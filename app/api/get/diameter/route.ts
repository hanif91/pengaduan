import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const prisma = new PrismaClient();
  
    try {
      // Fetch the last diameter with 'nomor' in descending order
      const dataDivisi = await prisma.diameters.findMany();
  
      // Ensure dataDivisi exists before incrementing
      if (!dataDivisi) {
        return NextResponse.json({ message: 'No diameter records found' }, { status: 404 });
      }
  
      return NextResponse.json({ data: dataDivisi });
    } catch (error) {
      console.error('Error fetching and incrementing nomor:', error);
      return NextResponse.json({ message: 'Failed to fetch nomor' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  