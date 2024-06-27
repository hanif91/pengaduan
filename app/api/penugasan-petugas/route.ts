import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from '@/config/firebase';
import { isIsoDate } from '@/utils/datevalidation';
import { resultCode } from '@/utils/rescode';

const app = initializeApp(firebaseConfig);

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    
    const {petugasId, pengaduanId, tglTarget, ditugaskanOleh} = await request.json();
    console.log(isIsoDate(tglTarget));
    if(!isIsoDate(tglTarget)) {
        return NextResponse.json({
            message: 'Error, harus menggunakan ISO date time untuk tanggal target',
            error: 'Failed to eedit because the tglTarget not using ISO date time'
        },
        {status: 500})
    }

    const pengaduanData = await prisma.pengaduan.findUnique({
        where: {
            id: pengaduanId
        }
    })

    if(!pengaduanData) {
        return NextResponse.json({ 
            message: 'Error, pengaduan belum di proses, tidak bisa di selesaikan', 
            error: 'Failed to edit because the data not processed by administrator'}, 
            {status: 500}
        )
        
    }
    // Update pengaduan
    const updatedPengaduan = await prisma.pengaduan.update({
      where: { id: pengaduanId },
      data: {
        processed_by: parseInt(ditugaskanOleh),
        // is_processed: true,
        // processed_at: new Date(),
        tgl_target: tglTarget,
        updated_at: new Date(),
        petugas_id: parseInt(petugasId)
      },
    });

    return NextResponse.json({ message: 'Success update penugasan pengaduan', data: updatedPengaduan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update penugasan pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    
    const urlSearchParams = request.nextUrl.searchParams;
    const month = urlSearchParams.get('month');
    console.log("month:", month)
    const year = urlSearchParams.get('year');
    console.log("year:", year)
    const petugasId = urlSearchParams.get('petugasId');

    if(month === null || year === null) {
      return NextResponse.json({...resultCode(212)}, {status: 200})
    }

    if(petugasId === null) {
      return NextResponse.json({...resultCode(213)})
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    const allPengaduanByPetugas = await prisma.pengaduan.findMany({
      include: {
        jenis_aduan: true,
        petugas: true,
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
        petugas_id: parseInt(petugasId)
      },
    });

    return NextResponse.json({...resultCode(200, "pengaduan by petugas"), data: allPengaduanByPetugas}, {status:200})

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to get penugasan pengaduan'})
  }
}