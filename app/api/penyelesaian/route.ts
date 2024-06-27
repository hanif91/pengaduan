import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from '@/config/firebase';
import { isNumber } from 'util';
import { resultCode } from '@/utils/rescode';

const app = initializeApp(firebaseConfig);

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    
    const formData: any = await request.formData();
    console.log("form data: ", isNumber(formData.get("pengaduanId")) )

    const pengaduanId = formData.get("pengaduanId")
    const petugasId = formData.get("petugasId")
    const fotoPenyelesaian = formData.get("fotoPenyelesaian")
    const keteranganSelesain = formData.get("keteranganSelesain")
    const jenisPenyelesaianId = formData.get("jenisPenyelesaianId")
    const diameterId = formData.get("diameterId")

    const pengaduanData = await prisma.pengaduan.findUnique({
        where: {
            id: parseInt(pengaduanId),
            is_processed: true
        }
    })

    if(!pengaduanData) {
        return NextResponse.json({ 
            message: 'Error, pengaduan belum di proses, tidak bisa di selesaikan', 
            error: 'Failed to edit because the data not processed by administrator'}, 
            {status: 500}
        )
        
    }

    
    // Upload foto penyelesaian to Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, `images-penyelesaian-${pengaduanId}-petugas-${petugasId}.jpeg`);

    // 'file' comes from the Blob or File API

    const uploadTask = uploadBytes(storageRef, fotoPenyelesaian).then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                        });

    // Await upload completion
    await uploadTask;

    const photoUrl = await getDownloadURL(storageRef); // Get foto penyelesaian URL

    // Update pengaduan
    const updatedPengaduan = await prisma.pengaduan.update({
      where: { id: parseInt(pengaduanId) },
      data: {
        foto_penyelesaian: photoUrl,
        is_complete: true,
        completed_at: new Date(),
        ket_selesai: keteranganSelesain,
        jenis_penyelesaian_id: parseInt(jenisPenyelesaianId),
        updated_at: new Date(),
        petugas_id: parseInt(petugasId),
        diameter_id: parseInt(diameterId),
      },
    });

    return NextResponse.json({ message: 'Success menyelesaikan pengaduan', data: updatedPengaduan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to menyelesaikan pengaduan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const urlSearchParams = request.nextUrl.searchParams;``
    const month = urlSearchParams.get('month');
    console.log("month:", month)
    const year = urlSearchParams.get('year');``
    console.log("year:", year)
    const filter = urlSearchParams.get('filter')

    if(month === null || year === null) {
      return NextResponse.json({...resultCode(212)}, )
    }
    
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    const completedPengaduan = await prisma.pengaduan.findMany({
      where: {
        is_complete: true,
        completed_at: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        id: true,
        nomor: true,
        nama: true,
        jenis_aduan: true,
        alamat: true,
        completed_at: true,
        petugas_id: true,
        foto_penyelesaian: true,
        jenis_penyelesaian: true,
        petugas: {
          select: {
            nama: true,
          },
        },
        diameters: {
          select: {
            nama: true
          }
        }
      },
    });

    return NextResponse.json({ data: completedPengaduan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch pengaduan data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
