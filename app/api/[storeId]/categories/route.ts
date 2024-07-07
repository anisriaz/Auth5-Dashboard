import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth"; 
import {prismadb} from "@/lib/prismadb";



//  Post CategorieS API
export async function POST(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {
        const user = await currentUser(); 
        const userId = user?.id; 
        const body = await req.json();


        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard Id is Required", { status: 400 });
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



        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

    
        return new NextResponse(JSON.stringify(category), {
          headers: {
              'Content-Type': 'application/json'
          }
      });

    } catch (error) {
        console.error('[CATEGORIES_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}



//  Get CategorieS API

  export async function GET(
    req: Request,
    { params }: {params: {storeId: string}}
    ) {

    try {

        if(!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        
        return  NextResponse.json(categories);

    } catch (error) {
        console.error('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

