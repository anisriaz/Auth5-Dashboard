import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth"; 
import {prismadb} from "@/lib/prismadb";



//POST API
export async function POST(req: Request) {
    try {
        const user = await currentUser(); 
        const userId = user?.id; 
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        // Return a success response if store creation is successful
        return new NextResponse(JSON.stringify(store), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('[STORES_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}




