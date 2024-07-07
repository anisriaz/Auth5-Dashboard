import {prismadb} from "@/lib/prismadb";
import { CategoryForm } from "./components/categoryForm"



const categoryPage = async ({
  params
}: {
  params: { categoryId: string, storeId: string }
}) => {
 
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId
    }
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  });


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category}/>
        
      </div>
    </div>
  );
};


export default categoryPage;










// "use client"


// import { useEffect, useState } from 'react';
// import prismadb from "@/lib/prismadb";
// import { CategoryForm } from "./components/categoryForm";

// const categoryPage = ({
//   params
// }: {
//   params: { categoryId: string }
// }) => {

//   const [category, setCategory] = useState<any>(null);

//   useEffect(() => {
//     const fetchedCategory = async () => {
//       try {
//         // Check if the billboardId exists
//         if (params.categoryId !== 'new') {
//           const fetchedCategory = await prismadb.category.findUnique({
//             where: {
//               id: params.categoryId
//             }
//           });
      
//         }
//       } catch (error) {
//         console.error('Error fetching billboard:', error);
//       }
//     };
//   }, []);

  
//   if (params.categoryId === 'new') {
//     return (
//       <div className="flex-col">
//         Create New Category
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           <CategoryForm initialData={null} />
//         </div>
//       </div>
//     );
//   }

//   // If billboardId exists, it's an edit page
//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <CategoryForm initialData={category} />
//       </div>
//     </div>
//   );
// };

// export default categoryPage;


