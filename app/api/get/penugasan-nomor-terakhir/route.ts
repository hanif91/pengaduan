import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const prisma = new PrismaClient();
  
    try {
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
        
        let counter:any = 1; // Start with 1 for each new month/year combination

        if (lastCode.length > 0) {
          const lastNumericPart:any = lastCode[0]?.nomor_penugasan?.slice(9);
          if (lastNumericPart === '999') {
            // If last code was 999, start from 001 for the new code
            counter = 1;
          } else {
            // Otherwise, increment based on the last code
            counter = parseInt(lastNumericPart) + 1;
          }
        }
      
        counter = counter.toString().padStart(3, '0'); // Pad with leading zeros
        return `PEN${currentMonth}${currentYear}${counter}`;
      }
  
      return NextResponse.json({ data: { nomor: await generateUniqueCode() } });
    } catch (error) {
      console.error('Error fetching and incrementing nomor:', error);
      return NextResponse.json({ message: 'Failed to fetch nomor' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  