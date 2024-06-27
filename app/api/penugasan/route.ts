import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { resultCode } from '@/utils/rescode'

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const reqBody = await request.json();

    // Extract relevant data from request body
    const { pengaduanIds, divisiId, ditugaskanOleh } = reqBody;

    // Ensure pengaduanIds is an array
    if (!Array.isArray(pengaduanIds)) {
      throw new Error('pengaduanIds must be an array');
    }

    // Check for unprocessed pengaduan
    const unprocessedPengaduan = await prisma.pengaduan.findMany({
      where: {
        id: {
          in: pengaduanIds,
        },
        is_processed: false,
      },
    });

    if (unprocessedPengaduan.length !== pengaduanIds.length) {
      return NextResponse.json({...resultCode(211)}, {status: 200})
    }

    const generateUniqueCode = async() => {
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const currentYear = new Date().getFullYear().toString();

      // Find the last assigned code
      const lastCode = await prisma.penugasan.findMany({
        orderBy: {
          id: 'desc'
        },
        take: 1
      });
      const lastNumericPart:any = lastCode[0]?.nomor_penugasan?.slice(9); // Extract last 3 digits

      let counter:any = parseInt(lastNumericPart) + 1;
      counter = counter.toString().padStart(3, '0'); // Pad with leading zeros

      return `PEN${currentMonth}${currentYear}${counter}`;
    }
    

    // Create penugasan
    const newPenugasan = await prisma.penugasan.create({
      data: { 
        nomor_penugasan: await generateUniqueCode(),
        divisi_id: divisiId,
      },
    });

    // Create penugasan_pengaduan relationships
    await prisma.penugasan_pengaduan.createMany({
      data: unprocessedPengaduan.map((pengaduan) => ({
        penugasan_id: newPenugasan.id,
        pengaduan_id: pengaduan.id
      })),
    });

    // Mark pengaduan as processed
    await prisma.pengaduan.updateMany({
        where: {
          id: {
            in: pengaduanIds,
          },
        },
        data: {
          is_processed: true,
          processed_at: new Date(), // Set processed_at to current date/time
          updated_at: new Date(), // Update updated_at timestamp
        },
    });  

    return NextResponse.json({ message: 'Success create penugasan', data: newPenugasan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal membuat penugasan, mungkin ada aduan yang sudah di tugaskan' }, { status: 500 });
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
      const filter = urlSearchParams.get('filter')
  
      if(month === null || year === null) {
        return NextResponse.json({...resultCode(212)}, )
      }
      
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      
      const allPenugasan = await prisma.penugasan.findMany({
        include: {
          penugasan_pengaduan: {
            include: {
              pengaduan: {
                include: {
                  petugas: {
                    select: {
                      nama: true,
                    }
                  }
                },
                // select: {
                //   id: true,
                //   nomor: true,
                //   nama: true,
                //   no_telp: true,
                //   keterangan: true,
                //   is_processed: true,
                //   processed_at: true,
                //   processed_by: true,
                // }
              },
            },
          },
          divisi: true
        },
        orderBy: {
          created_at: "desc"
        },
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
  
      return NextResponse.json({ data: allPenugasan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch penugasan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }

  export async function DELETE(request:Request) {
    const prisma = new PrismaClient();
    console.log("Request on ", request.url)
  
    try {
      const reqBody = await request.json();
      const {penugasanId} = reqBody;
      if(penugasanId === null) {
        return NextResponse.json({...resultCode(214)}, { status: 200 })
      }

      const getPengaduanIdOnPenugasanPengaduan = await prisma.penugasan_pengaduan.findMany({
        where: {
          penugasan_id: penugasanId
        },
        select: {
          pengaduan_id: true
        }
      })

      // Loop through each pengaduan_id and update the corresponding record
      for (const pengaduanData of getPengaduanIdOnPenugasanPengaduan) {
        const pengaduanIdToUpdate = pengaduanData.pengaduan_id;

        // Assuming you have some update data, replace the following line with your actual update logic
        const updateData = {
          is_processed: false,
          processed_at: null
        };
        
        const updatedPengaduan = await prisma.pengaduan.update({
          where: {
            id: pengaduanIdToUpdate
          },
          data: updateData
        });

        console.log(`Updated pengaduan with ID ${pengaduanData.pengaduan_id}`);
      }


      const deleteSelectedPenugasanPengaduan = await prisma.penugasan_pengaduan.deleteMany({
        where: {
          penugasan_id: parseInt(penugasanId),
        }
      })

      const deletedPenugasan = await prisma.penugasan.delete({
        where: {
            id: parseInt(penugasanId)
        },
      });
  
      return NextResponse.json({ message: 'sukses hapus data pengaduan dengan id: '+penugasanId, data: deletedPenugasan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }