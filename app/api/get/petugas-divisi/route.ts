import { NextRequest, NextResponse } from "next/server";
import prisma from "@prisma/client";

export async function GET(request: NextRequest) {
    const prismaClient = new prisma.PrismaClient();

    try {
        const urlSearchParams = request.nextUrl.searchParams;
        const divisiId = urlSearchParams.get('divisiId')!;
        if (divisiId === null) return NextResponse.json({code: 219, message: 'tambahkan parameter divisiId untuk set ID divisi'})
        const petugasDivisi = await prismaClient.petugas.findMany({
            where: {
                divisi_id: parseInt(divisiId)
            }
        })

        if(petugasDivisi.length <= 0) return NextResponse.json({code: 221, message: `tidak ada divisi dengan ID ${divisiId}`})

        return NextResponse.json({data: petugasDivisi});
    }
    catch(error) {
        return NextResponse.json({error: true, message: "failed to get petugas divisi"});
    }
    finally {
        prismaClient.$disconnect();
    }
}