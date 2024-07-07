import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { NextResponse } from "next/server";


//GET API

export async function GET (
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
              
            },
        });

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SIZE_GET]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


//UpPDATE API
export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, sizeId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name, value } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("billboard id is required", { status: 400 });
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

       const size = await prismadb.size.updateMany({
        where: {
         id: params.sizeId,
        },
        data: {
            name,
            value
        }
    });

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SIZE_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


///DELTE API


export async function DELETE(
    req: Request,
    { params }: { params: { sizeId: string, storeId: string } }
  ) {
    try {
        const user = await currentUser();
         const userId = user?.id;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.sizeId) {
        return new NextResponse("Size id is required", { status: 400 });
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
  
      const size = await prismadb.size.delete({
        where: {
          id: params.sizeId,
        }
      });
    
      return NextResponse.json(size);
    } catch (error) {
      console.log('[SIZE_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };