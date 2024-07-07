"use client"

import { useState } from "react";
import * as z from "zod";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";


import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alertModals";
import { ApiAlert } from "@/components/ui/apiAlert";
import { useOrigin } from "@/hooks/useOrigin";





interface StoreSettingsFormPage {
    initialData: Store;
}


const fromStoreSchema = z.object({
    name: z.string().min(1),
})

type StoreSettingsFormValues = z.infer<typeof fromStoreSchema>;

export const StoreSettingsForm: React.FC<StoreSettingsFormPage> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] =useState(false);
    const [loading, setLoading] =useState(false);

    const form = useForm<StoreSettingsFormValues>({
        resolver: zodResolver(fromStoreSchema),
        defaultValues: initialData

    })
    
    const onSubmit = async (data: StoreSettingsFormValues) => {

        try {
          setLoading(true); 
          const response = await fetch(`/api/stores/${params.storeId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: data.name
            }) 
          });
          
          router.refresh();
          toast.success("Store Updated")
      
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
         // try {
        //    setLoading(true);
        //    await axios.patch(`/api/stores/${params.storeId}`, data)
        //    router.refresh();
        //    toast.success("Store updated")
        // } catch(error) {
        //     toast.error("Something went wrong")
        // } finally {
        //     setLoading(false);
        // }
      }

      const onDelete = async () => {
        try {
          setLoading(true);
          
          const response = await fetch(`/api/stores/${params.storeId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          
          if (response.ok) {
            toast.success("Store Deleted");
            router.refresh();
            router.push("/");
          } else {
            if (response.status === 400) {
              toast.error("Make sure you want to delete all products and categories");
            } else {
              toast.error("Failed to delete store");
            }
          }
        } catch(error) {
          console.error("Error deleting store:", error);
          toast.error("An error occurred while deleting the store");
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
               title="Store Settings"
               description="Mange store preferences"
            />
             <Button
             disabled={loading}
             variant={"destructive"}
             size="icon"
             onClick={() => setOpen(true)}
             >
              <Trash className="h-4 w-4"/>
           </Button>
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
                      <Input disabled={loading} placeholder="Store name" {...field}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
               )}
              />
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                Save Changes
            </Button>
           </form>
        </Form>
        <Separator />
        <ApiAlert 
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant={"public"}/>
        </>
    )
}
