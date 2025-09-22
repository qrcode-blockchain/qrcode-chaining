import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { dbConnect, getGridFsBucket } from '../../../lib/dbConnect';
import { resend } from '../../../lib/resend';
import { Readable } from 'stream';

// function updateCoOrdinates() {

// }

export async function POST(req) {
    try {
        const { dataArray, email, taskId,batchNo,productName } = await req.json();

        if (!dataArray || !email) {
            console.log("Missing Data: ", { dataArray, email })
            return NextResponse.json({ error: 'Missing URLs or email' }, { status: 400 });
        }
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([620, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let x = 20, y = 700;
        console.log('PDF Generation Started.....')
        console.log("Number of Qrcodes: ", dataArray.length)

        const regexPattern = /(https|http):\/\/[^/]+\/products\/([^/]+)/

        for (let { data, url } of dataArray) {
            if (url == '') {
                continue;
            }
            const match = url.match(regexPattern);

            if (!match) {
                console.warn(`Invalid URL: ${url}`);
                continue;
            }
            const qrDataURL = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', scale: 2 });
            const qrImageBytes = Buffer.from(qrDataURL.split(',')[1], 'base64');
            const qrImage = await pdfDoc.embedPng(qrImageBytes);

            const rawDate = data.date;
            const formattedDate = `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}/${rawDate.slice(0, 4)}`;
            const batchSerialData = `${data.batch_number}/${data.serial_number}`

            page.drawImage(qrImage, {
                x, y,
                width: 40, height: 40
            });

            page.drawText(batchSerialData, {
                x: x + 5,
                y: y + 41,
                size: 5,
                font,
                color: rgb(0, 0, 0),
            });
            page.drawText(data.product_name, {
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
            page.drawText(data.location, {
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

        // await dbConnect()
        // const bucket = getGridFsBucket()
        // const pdfBuffer = Buffer.from(pdfBytes);
        // const pdfStream = Readable.from([pdfBuffer]);

        // const uploadStream = bucket.openUploadStream(`qrcodes-${taskId}-${batchNo}.pdf`, {
        //     metadata: {
        //         email,
        //         taskId,
        //         batchNo,
        //         createdAt: new Date()
        //     }
        // });
        // console.log("The pdf file name is ",`qrcodes-${taskId}-${batchNo}.pdf`);
        

        // pdfStream.pipe(uploadStream)
        // .on('error', (err) => {
        //     console.error("Error uploading PDF to GridFS:", err);
        // })
        // .on('finish', () => {
        //     console.log("PDF successfully uploaded to GridFS with ID:", uploadStream.id);
        // });
       

        // // Wait for GridFS upload to complete
        await dbConnect();
        const bucket = getGridFsBucket();
        const pdfBuffer = Buffer.from(pdfBytes);
        const filename = `qrcodes-${taskId}-${batchNo}.pdf`;
        
        console.log("Uploading PDF to GridFS:", filename);
        
        const uploadId = await new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(filename, {
                metadata: { email, taskId, batchNo, createdAt: new Date() }
            });
            const pdfStream = Readable.from([pdfBuffer]);
        
            pdfStream.pipe(uploadStream)
                .on('error', (err) => {
                    console.error("GridFS upload error:", err);
                    reject(err);
                })
                .on('finish', () => {
                    console.log("PDF successfully uploaded to GridFS with ID:", uploadStream.id.toString());
                    resolve(uploadStream.id);
                });
        });
        
        // // Only after the upload completes, send the email
        

        const msg = {
            from: 'info@qrcipher.in',
            to: email,
            subject: 'QR Codes PDF',
            text: 'Please find attached the QR codes PDF.',
            attachments: [
                {
                    filename: `qrcodes-${productName}-${batchNo}.pdf`,
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
