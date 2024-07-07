import { currentUser } from "@/lib/auth";
import {prismadb} from "@/lib/prismadb";
import { NextResponse } from "next/server";




//UpPDATE API
export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await prismadb.store.update({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return new NextResponse(JSON.stringify(store), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}


///DELTE API
export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await prismadb.store.delete({
            where: {
                id: params.storeId,
                userId
            },
        });

        return new NextResponse(JSON.stringify(store), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal error: ", { status: 500 });
    }
}
