import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser.js";


export default async function getFavouriteListing() {
    try {
        const currentuser=await getCurrentUser();
        if(!currentuser){
            return[];
        }

        const favourite=await prisma.listing.findMany({
            where:{
                id:{
                    in:[...(currentuser.favoriteIds || [])]
                }
            }
        })

        const sadefavorties =favourite.map((favourite)=>({
            ...favourite,
            createdAt:favourite.createdAt.toISOString()
        }));
        return sadefavorties;
    } catch (error:any) {
        throw new Error(error)
    }
}