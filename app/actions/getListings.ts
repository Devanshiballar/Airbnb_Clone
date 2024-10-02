import prisma from "../libs/prismadb"

export interface IlistingParams{
    userId?:string;
    guestCount?:string;
    roomCount?:string;
    bathroomCount?:string;
    startDate?:string;
    endDate?:string;
    locationValue?:string;
    category?:string;
}

export default async function getListing(
    params:IlistingParams
) {
    try {
        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category
        } = params;

        let query :any={};

        if(userId){
            query.userId=userId
        }

        if(category){
            query.category = category;
        }

        if(guestCount){
            query.guestCount = {
                gte: +guestCount
            }
        }
        
        if(bathroomCount){
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }
        
        if(roomCount){
            query.roomCount = {
                gte: +roomCount
            }
        }

        if(locationValue){
            query.locationValue = locationValue;
        }

        if(startDate && endDate){
            query.NOT = {
                reservations:{
                    some:{
                        OR:[
                            {
                                endDate:{ lte : endDate},
                                startDate:{ lte : startDate},
                            },
                            {
                                startDate:{ lte : startDate},
                                endDate:{ lte : endDate}

                            }
                        ]
                    }
                }
            }

        }
        const listings=await prisma.listing.findMany({
            where:query,
            orderBy:{
                createdAt:"desc"
            }
        })
    const safeListings =listings.map((listing)=>({
        ...listing,
        createdAt:listing.createdAt.toISOString(),
    }))

    return safeListings;
    
}catch(error: any){
    throw new Error(error);
}

}