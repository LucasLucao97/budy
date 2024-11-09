import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const encryptedMessages = formData.get("encryptedMessages") as string;

        if (!encryptedMessages) {
            return NextResponse.json({ error: "No se proporcionaron mensajes encriptados" }, { status: 400 });
        }
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, '-');

        const fileName = `encryptedMessages_${formattedDate}_${formattedTime}.txt`;

        const blob = new Blob([encryptedMessages], { type: "text/plain" });
        const file = new File([blob], fileName, { type: "text/plain" });

        const uploadData = await pinata.upload.file(file);

        const url = await pinata.gateways.createSignedURL({
            cid: uploadData.cid,
            expires: 3600,
        });
        
        return NextResponse.json({ url }, { status: 200 });
    } catch (e) {
        console.error("Error en el servidor:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
