import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth"; 
import {prismadb} from "@/lib/prismadb";




//GET Billboard API
export async function GET(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        
        return  NextResponse.json(billboards);

    } catch (error) {
        console.error('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}






//POST Billboard API
export async function POST(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {
        const user = await currentUser(); 
        const userId = user?.id; 
        const body = await req.json();


        const { label, ImageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is Required", { status: 400 });
        }

        if (!ImageUrl) {
            return new NextResponse("Image URL is Required", { status: 400 });
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



        const billboard = await prismadb.billboard.create({
            data: {
                label,
                ImageUrl,
                storeId: params.storeId
            }
        });

    
        return new NextResponse(JSON.stringify(billboard), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}



