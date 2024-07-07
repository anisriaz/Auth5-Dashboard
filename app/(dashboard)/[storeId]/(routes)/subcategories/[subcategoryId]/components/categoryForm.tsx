"use client"

import { useState } from "react";
import * as z from "zod";
import { Trash } from "lucide-react";
import { Category, SubCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios"


import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alertModals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



const fromStoreSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof fromStoreSchema>;


interface SubCategoryFormProps {
    initialData: SubCategory | null;
    categories: Category[];
};

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
    initialData,
    categories
}) => {

    const params = useParams();
    const router = useRouter();
  

    const [open, setOpen] =useState(false);
    const [loading, setLoading] =useState(false);

    const title = initialData ? "Edit SubCategory" : "Create SubCategory";
    const description = initialData ? "Edit a SubCategory" : "Add a new SubCategory";
    const toastMessage = initialData ? "SubCategory updated" : "SubCategory Created ";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(fromStoreSchema),
        defaultValues: initialData || {
          name: "",
          categoryId: ""
        }

    })

    
    const onSubmit = async (data: CategoryFormValues) => {
      try {
        setLoading(true);
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/subcategories/${params.subcategoryId}`, data);
        } else {
          await axios.post(`/api/${params.storeId}/subcategories`, data);
        }
        router.refresh();
        router.push(`/${params.storeId}/subcategories`);
        toast.success(toastMessage);
      } catch (error: any) {
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    

      const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/${params.storeId}/subcategories/${params.subcategoryId}`)
          router.refresh();
          router.push(`/${params.storeId}/subcategories`)
          toast.success("subcategories deleted")
       } catch(error) {
           toast.error("Make sure you removed all products using this subcategory first")
       } finally {
           setLoading(false);
           setOpen(false);
       }
     }
      
      
      

    return (
        <>
        <AlertModal 
         isOpen={open}
         onClose={() => setOpen(false)}
         onConfirm={onDelete}
         loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading
               title={title}
               description={description}
            />
            {initialData && (
             <Button
             disabled={loading}
             variant={"destructive"}
             size="icon"
             onClick={() => setOpen(true)}
             >
              <Trash className="h-4 w-4"/>
           </Button>
           )}
        </div>
        <Separator />
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="grid grid-cols-3 gap-8">
              <FormField 
               control={form.control}
               name="name"
               render={({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="SubCategory Name" {...field}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
               )}
              />
              <FormField 
               control={form.control}
               name="categoryId"
               render={({field}) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                        defaultValue={field.value}
                        placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                        key={category.id}
                        value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
               )}
              />
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
           </form>
        </Form>
      
        </>
    )
}
