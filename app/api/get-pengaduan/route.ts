import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const prisma = new PrismaClient();
  
    try {
      const urlSearchParams = request.nextUrl.searchParams;
      const pengaduanId = urlSearchParams.get('pengaduanId');
      if(pengaduanId === null) {
        return NextResponse.json({...resultCode(214)}, { status: 200 })
      }

      const allPengaduan = await prisma.pengaduan.findUnique({
        include: {
            jenis_aduan: true,
            petugas: true,
            pelanggan: true,
        },
        where: {
            id: parseInt(pengaduanId)
        },
      });
  
  
      return NextResponse.json({ data: allPengaduan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  