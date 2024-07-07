"use client"


import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { BillboardColumn, columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"


interface BillboardsClientProps {
  data: BillboardColumn[]
}

export const BillboardsClient: React.FC<BillboardsClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
          <Heading 
          title={`Billboards (${data.length})`}
          description="Manage Billboards for your store"
          />
          <Button  onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="mr-w h-4 w-4"/>
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="label" columns={columns} data={data}/>
        <Heading title="Api" description=" Api calls for Billboard"/>
        <Separator />
        <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}  
