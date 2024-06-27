import { resultCode } from "@/utils/rescode";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const prisma = new PrismaClient();
  
    try {
      const urlSearchParams = request.nextUrl.searchParams;
      let filter = urlSearchParams.get('filter')
      const divisiId = urlSearchParams.get('divisiId')
      const petugasId = urlSearchParams.get('petugasId')
  
    //   if(divisiId === null || pe === null) {
    //     return NextResponse.json({...resultCode(212)}, )
    //   }

    if(filter === null) {
      filter = "belum_selesai"
    }
  
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
            petugas_id: {not: null}
          };
          break;
        case 'belum_diselesaikan_petugas':
          additionalWhere = {
            is_processed: true,
            petugas_id: {not: null},
            is_complete: false,
          };
          break;
        case 'belum_selesai' :
          additionalWhere = {
            is_complete: false,
          };
          break;
        case 'sudah_selesai':
          additionalWhere = {
            is_complete: true,
          };
          break;
        case 'semua_data':
          additionalWhere = {
            id: {not: null}
          }
        default:
          // Handle default case if no filter type is provided
      }

      if(petugasId !== null) {
        additionalWhere = {
            ...additionalWhere,
            petugas_id: parseInt(petugasId)
        }
      }
      
      let additionDivisiCondition = {};

      if(divisiId !== null) {
        additionDivisiCondition = {
            divisi_id: parseInt(divisiId) 
        }
      } 
      // else {
      //   additionDivisiCondition = {
      //       id : != null
      //   }
      // }
  
    //   const allPengaduan = await prisma.pengaduan.findMany({
    //     include: {
    //       jenis_aduan: true,
    //       petugas: true,
    //       pelanggan: true,
    //     },
    //     where: {
    //       ...additionalWhere, // Apply additional where conditions dynamically
    //     },
    //     orderBy: {id: 'desc'}
    //   });

    const allPengaduan = await prisma.penugasan_pengaduan.findMany({
        include: {
            pengaduan: {
                include: {
                    jenis_aduan: true,
                    petugas: true,
                    pelanggan: true,
                }
            },
            penugasan: true
        },
        where: {
            pengaduan: {
                ...additionalWhere,
                
            },
            penugasan: {
                ...additionDivisiCondition,
            }
        }
    })
  
  
      return NextResponse.json({ data: allPengaduan });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Failed to fetch pengaduan' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }