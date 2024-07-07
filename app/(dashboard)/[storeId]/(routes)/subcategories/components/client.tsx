"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/dataTable"
import { ApiList } from "@/components/ui/apiList"

import { columns, SubCategoryColumn } from "./columns"

interface CtegorriesClientProps {
  data: SubCategoryColumn[]
}

export const CtegoriesClient: React.FC<CtegorriesClientProps> = ({
  data
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
          <Heading 
          title={`SubCategories (${data.length})`}
          description="Manage SubCategories for your store"
          />
          <Button  onClick={() => router.push(`/${params.storeId}/subcategories/new`)}>
            <Plus className="mr-w h-4 w-4"/>
            Add New
          </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="Api" description=" Api calls for SubCategories"/>
        <Separator />
        <ApiList entityName="Subcategories" entityIdName="subcategoryId"/>
        </>
    )
}  
