"use client"

import { OrderColumn, columns } from "./columns"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/dataTable"



interface OrdersClientProps {
  data: OrderColumn[]
}

export const OrdersClient: React.FC<OrdersClientProps> = ({
  data
}) => {

    return (
        <>
          <Heading 
          title={`Orders (${data.length})`}
          description="Manage Orders for your store"
          />
        <Separator />
        <DataTable searchKey="products" columns={columns} data={data}/>
        </>
    )
}  
