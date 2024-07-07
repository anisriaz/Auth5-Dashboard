import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { NextResponse } from "next/server";


//GET API

export async function GET (
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
              billboard: true
            }
        });

        return new NextResponse(JSON.stringify(category), { status: 200, headers: { 'Content-Type': 'application/json' } });
 
        // return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_GET]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


//UpPDATE API
export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, categoryId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name, billboardId } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
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

       const category = await prismadb.category.updateMany({
        where: {
         id: params.categoryId,
        },
        data: {
            name,
            billboardId
        }
    });

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


//DELETE API

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
  ) {
    try {
        const user = await currentUser();
         const userId = user?.id;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.categoryId) {
        return new NextResponse("Category id is required", { status: 400 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        }
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const category = await prismadb.category.delete({
        where: {
          id: params.categoryId,
        }
      });
    
      return NextResponse.json(category);
    } catch (error) {
      console.log('[CATEGORY_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };