import { dbConnect, getGridFsBucket } from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { taskId } = await params;
    try {
        await dbConnect();
        const bucket = getGridFsBucket();
        const filename = `qrcodes-${taskId}.pdf`

        const fileCursor = await bucket.find({ filename }).toArray();
        if (!fileCursor || fileCursor.length === 0) {
            return new NextResponse("File not found", { status: 404 });
        }

        const stream = bucket.openDownloadStreamByName(filename);

        return new NextResponse(stream, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 });
    }
}