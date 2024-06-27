import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { resultCode } from '@/utils/rescode'

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const result:any = await prisma.$queryRaw`SELECT YEAR(completed_at) AS thn FROM pengaduan WHERE is_complete=1 GROUP BY thn ORDER BY thn DESC`
        const returnerData = result.map((data:any) => data.thn )
        return NextResponse.json({data: returnerData}, {status: 200})
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Gagal request get' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}