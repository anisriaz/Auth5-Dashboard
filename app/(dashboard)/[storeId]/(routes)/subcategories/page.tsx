
import { format } from "date-fns";
import {prismadb} from "@/lib/prismadb";

import { CtegoriesClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";

const Categories = async ({
    params
}:  {
    params: {storeId: string}
}) => {
    const subcategories = await prismadb.subCategory.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


    const formattedSubCategories: SubCategoryColumn[] = subcategories.map((item) => ({
        id: item.id,
        name: item.name,
        categoryname: item.category.name,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
      }));
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                Category
                <CtegoriesClient data={formattedSubCategories}/>
            </div>
        </div>
    );
};

export default Categories;

