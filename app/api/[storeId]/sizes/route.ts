import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth"; 
import {prismadb} from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {
        const user = await currentUser(); 
        const userId = user?.id; 
        const body = await req.json();


        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is Required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
             where: {
                id: params.storeId,
                userId
             }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }



        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

    
        return new NextResponse(JSON.stringify(size), {
            headers: {
                'Content-Type': 'application/json'
            }
        });


    } catch (error) {
        console.error('[SIZES_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}




export async function GET(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        
        return  NextResponse.json(sizes);

    } catch (error) {
        console.error('[SIZES_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}




