import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    // Get the selected period from the request (replace with your logic)
    
    const reqBody = await request.json();

    const { selectedPeriod } = reqBody;
   
    console.log("selectedPeriod", selectedPeriod)

    let returnedData:any;

    const homeDataWithoutPeriod = await prisma.$transaction([
      // count jumlah aduan yang belum ditugasi
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: false,
        },
      }),
      // count jumlah aduan yang sudah di tugaskan
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: true,
        },
      }),
      // count jumlah aduan yang belum diselesaikan
      prisma.pengaduan.count({
        where: {
          is_complete: false,
          is_processed: false,
        },
      }),
      //count jumlah aduan yang sudah di selesaikan
      prisma.pengaduan.count({
        where: {
          is_complete: true,
          is_processed: true,
        },
      }),
    ]) as any;

    if(selectedPeriod) {
      const startDate = new Date(selectedPeriod.year, selectedPeriod.month - 1, 1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1); // Last day of month
  
      const homeDataWithPeriod = await prisma.$transaction([
        // count jumlah aduan yang belum ditugasi
        prisma.pengaduan.count({
          where: {
            is_complete: false,
            is_processed: false,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        // count jumlah aduan yang sudah di tugaskan
        prisma.pengaduan.count({
          where: {
            is_complete: false,
            is_processed: true,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        // count jumlah aduan yang belum diselesaikan
        prisma.pengaduan.count({
          where: {
            is_complete: false,
            is_processed: false,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        //count jumlah aduan yang sudah di selesaikan
        prisma.pengaduan.count({
          where: {
            is_complete: true,
            is_processed: true,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ]) as any;

      
      returnedData = {
        pengaduanBelumDitugaskan: homeDataWithPeriod[0],
        pengaduanDitugaskan: homeDataWithPeriod[1],
        pengaduangBelumDiselesaikan: homeDataWithPeriod[2],
        pengaduanDiselesaikan: homeDataWithPeriod[3]
      }

      return NextResponse.json({...resultCode(200), data: returnedData}, {status: 200})
    
    }

    returnedData = {
      pengaduanBelumDitugaskan: homeDataWithoutPeriod[0],
      pengaduanDitugaskan: homeDataWithoutPeriod[1],
      pengaduangBelumDiselesaikan: homeDataWithoutPeriod[2],
      pengaduanDiselesaikan: homeDataWithoutPeriod[3]
    }

    return NextResponse.json({...resultCode(200), data: returnedData}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}