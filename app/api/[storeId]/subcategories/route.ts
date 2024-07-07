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


        const { name, categoryId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
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



        const subcategory = await prismadb.subCategory.create({
            data: {
                name,
                categoryId,
                storeId: params.storeId
            }
        });

    
        return new NextResponse(JSON.stringify(subcategory), {
          headers: {
              'Content-Type': 'application/json'
          }
      });

    } catch (error) {
        console.error('[SUBCATEGORIES_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
