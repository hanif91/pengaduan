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

        let returnedData: any;

        if (selectedPeriod.year == null || selectedPeriod.month == null) {
            return NextResponse.json({ ...resultCode(212) },);
        }

        if (selectedPeriod.divisiId == null) {
            return NextResponse.json({ ...resultCode(215) },);
        }



        const startDate = new Date(selectedPeriod.year, selectedPeriod.month - 1, 1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1); // Last day of month

        const homeDataWithPeriod = await prisma.$transaction([
            // count jumlah aduan yang belum ditugasi

            prisma.penugasan_pengaduan.count({
                where: {
                    penugasan: {
                        divisi_id: selectedPeriod.divisiId
                    },
                    pengaduan: {
                        petugas_id: selectedPeriod.petugasId,
                        processed_by: null,
                        is_complete: false,
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }
                }
            }),


            // prisma.pengaduan.count({
            //     where: {
            //         is_complete: false,
            //         processed_by: null,
            //         created_at: {
            //             gte: startDate,
            //             lte: endDate,
            //         },
            //     },
            // }),


            // count jumlah aduan yang sudah di tugaskan


            prisma.penugasan_pengaduan.count({
                where: {
                    penugasan: {

                        divisi_id: selectedPeriod.divisiId
                    },
                    pengaduan: {
                        petugas_id: selectedPeriod.petugasId,

                        is_complete: false,
                        NOT: {
                            processed_by: null,
                        },
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }

                },
            }),




            // prisma.pengaduan.count({
            //     where: {
            //         is_complete: false,
            //         NOT: {
            //             processed_by: null,
            //         },
            //         created_at: {
            //             gte: startDate,
            //             lte: endDate,
            //         },
            //     },
            // }),
            // count jumlah aduan yang belum diselesaikan

            prisma.penugasan_pengaduan.count({
                where: {
                    penugasan: {
                        divisi_id: selectedPeriod.divisiId
                    },
                    pengaduan: {
                        petugas_id: selectedPeriod.petugasId,

                        is_complete: false,
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }

                },
            }),




            // prisma.pengaduan.count({
            //     where: {
            //         is_complete: false,
            //         created_at: {
            //             gte: startDate,
            //             lte: endDate,
            //         },
            //     },
            // }),
            //count jumlah aduan yang sudah di selesaikan


            prisma.penugasan_pengaduan.count({
                where: {
                    penugasan: {
                        divisi_id: selectedPeriod.divisiId
                    },
                    pengaduan: {
                        petugas_id: selectedPeriod.petugasId,

                        is_complete: true,
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }

                },
            }),


            // prisma.pengaduan.count({
            //     where: {
            //         is_complete: true,
            //         created_at: {
            //             gte: startDate,
            //             lte: endDate,
            //         },
            //     },
            // }),
        ]) as any;


        returnedData = {
            pengaduanBelumDitugaskan: homeDataWithPeriod[0],
            pengaduanDitugaskan: homeDataWithPeriod[1],
            pengaduangBelumDiselesaikan: homeDataWithPeriod[2],
            pengaduanDiselesaikan: homeDataWithPeriod[3]
        }

        return NextResponse.json({ ...resultCode(200), data: returnedData }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}