import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const prisma = new PrismaClient();
    
    try {

      const urlSearchParams = request.nextUrl.searchParams;
      const noPelanggan = urlSearchParams.get('noPelanggan') as string;
      // Fetch the last pelanggan with 'nomor' in descending order
      const dataPengaduan = await prisma.pelanggan.findMany({
        where: {
            no_pelanggan : {
                contains: noPelanggan
            }
        },
        take: 3
      });
  
      // Ensure dataPengaduan exists before incrementing
      if (!dataPengaduan) {
        return NextResponse.json({ message: 'No pelanggan records found' }, { status: 404 });
      }
  
      return NextResponse.json({ data: dataPengaduan });
    } catch (error) {
      console.error('Error fetching and incrementing nomor:', error);
      return NextResponse.json({ message: 'Failed to fetch nomor' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  