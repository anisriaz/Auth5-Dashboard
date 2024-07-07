"use client"


import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { ProductColumn, columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
          <Heading 
          title={`Products (${data.length})`}
          description="Manage Products for your store"
          />
          <Button  onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <Plus className="mr-w h-4 w-4"/>
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="Api" description=" Api calls for Products"/>
        <Separator />
        <ApiList entityName="products" entityIdName="productId"/>
        </>
    )
}  
