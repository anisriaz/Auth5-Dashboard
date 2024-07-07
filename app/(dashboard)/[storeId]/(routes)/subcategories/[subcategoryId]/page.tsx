import {prismadb} from "@/lib/prismadb";
import { SubCategoryForm } from "./components/categoryForm"



const categoryPage = async ({
  params
}: {
  params: { subcategoryId: string, storeId: string }
}) => {
 
  const subcategory = await prismadb.subCategory.findUnique({
    where: {
      id: params.subcategoryId
    }
  });

  const category = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm categories={category} initialData={subcategory}/>
      </div>
    </div>
  );
};


export default categoryPage;
