import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string,
    locationValue?: string;
    category?: string;
}


export default async function getListings(
    params: IListingsParams
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

        let query: any = {};

        if (userId){
            query.userId = userId;
        }

        if (category){
            query.category = category;
        }

        if (roomCount){
            query.roomCount = {
                gte: +roomCount //gte = greater than or equal to, + is used to convert the string to a number
            }
        }
        
        if (guestCount){
            query.guestCount = {
                gte: +guestCount //gte = greater than or equal to, + is used to convert the string to a number
            }
        }

        if (bathroomCount){
            query.bathroomCount = {
                gte: +bathroomCount //gte = greater than or equal to, + is used to convert the string to a number
            }
        }

        if (locationValue){
            query.locationValue = locationValue;
        }

        //Filter out by the desired date range
        if(startDate && endDate){
            query.NOT = {
                reservations: {
                    some: {
                        OR: [ //Check if there is a single day within the range that is already reserved if so, exclude the listing
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: startDate},
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: endDate},
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}