import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const prisma = new PrismaClient();
  
    try {
      // Fetch the last pengaduan with 'nomor' in descending order
      const dataPengaduan = await prisma.pengaduan.findMany({
        where: {
            is_processed: false,
            is_complete: false,
        },
        orderBy: { nomor: 'desc' },
        select: {
            nama: true,
            no_telp: true,
            nomor: true,
            id: true,
        }
      });
  
      // Ensure dataPengaduan exists before incrementing
      if (!dataPengaduan) {
        return NextResponse.json({ message: 'No pengaduan records found' }, { status: 404 });
      }
  
      return NextResponse.json({ data: dataPengaduan });
    } catch (error) {
      console.error('Error fetching and incrementing nomor:', error);
      return NextResponse.json({ message: 'Failed to fetch nomor' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  