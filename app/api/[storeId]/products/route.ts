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

        const { 
            name,
            description,
            price,
            categoryId,
            subcategoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        if (!description) {
            return new NextResponse("Description is Required", { status: 400 });
        }
        if(!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price URL is Required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category id is Required", { status: 400 });
        }
        if (!subcategoryId) {
            return new NextResponse("Subcategory id is Required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("COlor id is Required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("Size id is Required", { status: 400 });
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



        const product = await prismadb.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
                subcategoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ] 
                    }
                }
            }
        });

    
        return NextResponse.json(product)

    } catch (error) {
        console.error('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}




export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
  ) {
    try {
      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined;
      const subcategoryId = searchParams.get('subcategoryId') || undefined;
      const colorId = searchParams.get('colorId') || undefined;
      const sizeId = searchParams.get('sizeId') || undefined;
      const isFeatured = searchParams.get('isFeatured');
  
      if (!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
  
      const products = await prismadb.product.findMany({
        where: {
          storeId: params.storeId,
          categoryId,
          subcategoryId,
          colorId,
          sizeId,
          isFeatured: isFeatured ? true : undefined,
          isArchived: false,
        },
        include: {
          images: true,
          category: true,
          subcategory: true,
          color: true,
          size: true,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    
      return new NextResponse(JSON.stringify(products), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    } catch (error) {
      console.log('[PRODUCTS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };



