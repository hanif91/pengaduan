import { NextResponse } from "next/server";
import prisma from "@prisma/client";
import { compare } from "bcryptjs";

type ResponseData = {
    message: string;
};

export async function POST(request: Request) {
    const prismaClient = new prisma.PrismaClient();

    try {
        // Read the body as JSON
        const reqBody = await request.json();

        // Access properties from the request body
        const { username, password } = reqBody;

        let dataUser: prisma.users;

        // Now you can use the username and password in your logic
        let users = await prismaClient.users.findMany();

        console.log("users", users);

        const matchUser = users.find((user) => user.username === username);

        if (!matchUser) {
            return NextResponse.json({ message: 'Username or password is wrong' }, { status: 400 });
        }
        
        const isPasswordValid = await compare(password, matchUser.password);
        
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Username or password is wrong' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Success login', data: matchUser });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ message: 'Error parsing JSON' }, { status: 400 });
    } finally {
        await prismaClient.$disconnect();
    }
}