import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const listFilterPengaduan = ["belum_ditugas", "sudah_ditugas", "belum_diselesaikan", "sudah_ditugasi_belum_diselesainkan", "sudah_diselesaikan"]

export async function POST(request: Request) {
  console.log('masuk ke save data pengaduan')
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    const {
      nomor,
      jenis_aduan_id,
      pelanggan_id,
      nama,
      no_identitas,
      alamat,
      no_telp,
      keterangan,
      sumber_laporan,
    } = reqBody;
    
    const is_pelanggan = pelanggan_id ? true : false;

    const newPengaduan = await prisma.pengaduan.create({
      data: {
        nomor,
        jenis_aduan_id,
        pelanggan_id,
        is_pelanggan,
        nama,
        no_identitas,
        alamat,
        no_telp,
        keterangan,
        sumber_laporan,
      },
    });

    return NextResponse.json({ message: 'Success create pengaduan', data: newPengaduan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const urlSearchParams = request.nextUrl.searchParams;
    const month = urlSearchParams.get('month');
    // console.log("month:", month)
    const year = urlSearchParams.get('year');
    // console.log("year:", year)
    const filter = urlSearchParams.get('filter')

    if(month === null || year === null) {
      return NextResponse.json({...resultCode(212)}, )
    }
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    console.log('end date', endDate)

    let additionalWhere = {};

    switch (filter) {
      case 'belum_ditugas':
        additionalWhere = {
          petugas_id: null,
          is_processed: true,
        };
        break;
      case 'sudah_ditugas':
        additionalWhere = {
          is_processed: true,
          petugas_id: !null
        };
        break;
      case 'belum_diselesaikan':
        additionalWhere = {
          is_processed: true,
          petugas_id: !null,
          is_complete: false,
        };
        break;
      case 'sudah_diselesaikan':
        additionalWhere = {
          is_complete: true,
        };
        break;
      default:
        // Handle default case if no filter type is provided
    }

    const allPengaduan = await prisma.pengaduan.findMany({
      include: {
        jenis_aduan: true,
        petugas : true,
        petugas_selesai : true,
        pelanggan: true,
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
        ...additionalWhere, // Apply additional where conditions dynamically
      },
      orderBy: {id: 'desc'}
    });


    return NextResponse.json({ data: allPengaduan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request:Request) {
  const prisma = new PrismaClient();
  console.log("Request on ", request.url)

  try {
    const reqBody = await request.json();
    const {pengaduanId} = reqBody;
    if(pengaduanId === null) {
      return NextResponse.json({...resultCode(214)}, { status: 200 })
    }

    const allPengaduan = await prisma.pengaduan.delete({
      where: {
          id: parseInt(pengaduanId)
      },
    });


    return NextResponse.json({ message: 'sukses hapus data pengaduan dengan id: '+pengaduanId, data: allPengaduan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  console.log('masuk ke update data pengaduan')
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    const {
      id,
      nomor,
      jenis_aduan_id,
      pelanggan_id,
      nama,
      no_identitas,
      alamat,
      no_telp,
      keterangan,
      sumber_laporan,
    } = reqBody;
    
    const is_pelanggan = pelanggan_id ? true : false;

    const newPengaduan = await prisma.pengaduan.update({
      where: {
        id: id
      },
      data: {
        nomor,
        jenis_aduan_id,
        pelanggan_id,
        is_pelanggan,
        nama,
        no_identitas,
        alamat,
        no_telp,
        keterangan,
        sumber_laporan,
      },
    });

    return NextResponse.json({ message: 'Success update pengaduan', data: newPengaduan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
