import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { NextResponse } from "next/server";


//GET API

export async function GET (
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
              
            },
        });

        return NextResponse.json(color)

    } catch (error) {
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


//UpPDATE API
export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, colorId: string } }
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

        if (!params.colorId) {
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

       const color = await prismadb.color.updateMany({
        where: {
         id: params.colorId,
        },
        data: {
            name,
            value
        }
    });

        return NextResponse.json(color)

    } catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


///DELTE API

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string, storeId: string } }
) {
  try {
    const user = await currentUser();
        const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId
      }
    });
  
    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

