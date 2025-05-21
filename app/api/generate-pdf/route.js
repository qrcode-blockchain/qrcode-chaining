import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { resend } from '../../../lib/resend';

export async function POST(req) {
    try {
        const { urls, email } = await req.json();

        if (!urls || !email) {
            console.log("Missing Data: ", { urls, email })
            return NextResponse.json({ error: 'Missing URLs or email' }, { status: 400 });
        }
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([620, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let x = 20, y = 700;
        console.log('PDF Generation Started.....')

        const regexPattern = /https:\/\/[^/]+\/products\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/

        for (let url of urls) {
            const qrDataURL = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', scale: 2 });
            const qrImageBytes = Buffer.from(qrDataURL.split(',')[1], 'base64');
            const qrImage = await pdfDoc.embedPng(qrImageBytes);
            const match = url.match(regexPattern);

            if (!match) {
                console.warn(`Invalid URL: ${url}`);
                continue;
            }

            const productName = match[1];
            const location = match[2];
            const batch = match[4];
            const rawDate = match[3];
            const formattedDate = `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}/${rawDate.slice(0, 4)}`;

            page.drawImage(qrImage, {
                x, y,
                width: 40, height: 40
            });

            page.drawText(batch, {
                x: x + 5,
                y: y + 41,
                size: 5,
                font,
                color: rgb(0, 0, 0),
            });
            page.drawText(productName, {
                x: x + 7,
                y: y - 5,
                size: 5,
                font,
                color: rgb(0, 0, 0),
            });
            page.drawText(formattedDate, {
                x: x - 1,
                y: y + 9,
                rotate: degrees(90),
                size: 5,
                font,
                color: rgb(0, 0, 0),
            });
            page.drawText(location, {
                x: x + 45,
                y: y + 9,
                rotate: degrees(90),
                size: 5,
                font,
                color: rgb(0, 0, 0),
            });

            x += 60;
            if (x > 580) {
                x = 20;
                y -= 60;
            }
            if (y < 50) {
                x = 20;
                y = 700;
                page = pdfDoc.addPage([620, 800]);
            }
        }

        const pdfBytes = await pdfDoc.save();
        console.log("PDF Generation done.... Sending PDF......")
        const msg = {
            from: 'info@qrcipher.in',
            to: email,
            subject: 'QR Codes PDF',
            text: 'Please find attached the QR codes PDF.',
            attachments: [
                {
                    filename: 'qrcodes.pdf',
                    content: Buffer.from(pdfBytes).toString('base64'),
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };
        const response  = await resend.emails.send(msg);
        console.log("PDF Sent....", response)
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}