import bcrypt from "bcrypt";
import prisma from "D:/Swiftrut Backend  Task/Airbnb Clone/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json(); // Awaiting the parsed JSON from request

        const { email, name, password } = body;

        if (!email || !name || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json(user, { status: 201 }); // Return created user

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
