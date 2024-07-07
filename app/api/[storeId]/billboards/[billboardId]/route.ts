import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { NextResponse } from "next/server";


//GET API

export async function GET (
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
              
            },
        });

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


//UpPDATE API
export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, billboardId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { label, ImageUrl } = await req.json();

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!ImageUrl) {
            return new NextResponse("Image Url is required", { status: 400 });
        }

        if (!params.billboardId) {
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

       const billboard = await prismadb.billboard.updateMany({
        where: {
         id: params.billboardId,
        },
        data: {
            label,
            ImageUrl
        }
    });

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


///DELTE API


export async function DELETE(
    req: Request,
    { params }: { params: { billboardId: string, storeId: string } }
  ) {
    try {
        const user = await currentUser();
         const userId = user?.id;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.billboardId) {
        return new NextResponse("Billboard id is required", { status: 400 });
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
  
      const billboard = await prismadb.billboard.delete({
        where: {
          id: params.billboardId,
        }
      });
    
      return NextResponse.json(billboard);
    } catch (error) {
      console.log('[BILLBOARD_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };