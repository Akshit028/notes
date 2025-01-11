import { handlers } from "@/lib/auth"
// app/api/notes/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, categoryId } = await req.json();

        if (!title || !content) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                categoryId: categoryId || null,
                userId: session.user.id as string,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error("[NOTES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notes = await prisma.note.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("[NOTES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}