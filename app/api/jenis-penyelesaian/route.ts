import { resultCode } from '@/utils/rescode';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const jenisPenyelesaian = await prisma.jenis_penyelesaian.findMany();

    return NextResponse.json({ data: jenisPenyelesaian });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const reqBody = await request.json();
    const {
      nama_penyelesaian,

    } = reqBody;
    const newJenisPenyelesaian = await prisma.jenis_penyelesaian.create({ data: { nama_penyelesaian, is_active: true } });
    return NextResponse.json({ message: "Success create jenis penyelesaian", data: newJenisPenyelesaian }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  const prisma = new PrismaClient();
  try {
    const reqBody = await request.json();
    const {
      id,
      nama_penyelesaian,
      is_active
    } = reqBody;

    if (id === null) {
      return NextResponse.json({ ...resultCode(214) }, { status: 200 })
    }
    const newJenisPenyelesaian = await prisma.jenis_penyelesaian.update({ where: { id: id }, data: { nama_penyelesaian, is_active: is_active } });
    return NextResponse.json({ message: "Success update jenis penyelesaian", data: newJenisPenyelesaian }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  const prisma = new PrismaClient();
  try {
    const reqBody = await request.json();
    const {
      id,
    } = reqBody;
    if (id === null) {
      return NextResponse.json({ ...resultCode(214) }, { status: 200 })
    }
    const newJenisPenyelesaian = await prisma.jenis_penyelesaian.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "Success delete jenis penyelesaian", data: newJenisPenyelesaian }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete jenis penyelesaian' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
