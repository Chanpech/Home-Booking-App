import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export default async function getListingById(
    params: IParams
){
    try {
        const { listingId } = params;
    
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId //Find the listing by the id
            },
            include: { 
                user: true //Include the user object 
            }
        });

        if (!listing) {
            return null;
        }

        return { //need to sanitize the data before returning it
            ...listing, //Spread the listing object
            createdAt: listing.createdAt.toISOString(),
            user: { //Spread the user object
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(), 
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: 
                    listing.user.emailVerified?.toISOString() || null, 
            }
        };
    } catch (error: any ) {
        throw new Error(error);
    }
}