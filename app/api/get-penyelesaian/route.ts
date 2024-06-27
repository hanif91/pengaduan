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

      const dataPenyelesaian = await prisma.pengaduan.findUnique({
        include: {
            jenis_aduan: true,
            petugas: true,
            pelanggan: true,
            jenis_penyelesaian: true,
            petugas_pengaduan_processed_byTopetugas: true
        },
        where: {
            id: parseInt(pengaduanId)
        },
      });
  
      if(dataPenyelesaian?.is_complete === false) {
        return NextResponse.json({code: 216, message: 'Gagal get data, karena pengaduan belum di selesaikan'})
      }

      return NextResponse.json({ data: dataPenyelesaian });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  