"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellAction"

export type SubCategoryColumn = {
  id: string
  name: string
  categoryname: string
  createdAt: string
}

export const columns: ColumnDef<SubCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.categoryname, 
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
