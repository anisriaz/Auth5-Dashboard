"use client"


import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { SizeColumn, columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


interface SizesClientProps {
  data: SizeColumn[]
}

export const SizesClient: React.FC<SizesClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
          <Heading 
          title={`Sizes (${data.length})`}
          description="Manage Sizes for your store"
          />
          <Button  onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className="mr-w h-4 w-4"/>
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="Api" description=" Api calls for Sizes"/>
        <Separator />
        <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    )
}  
