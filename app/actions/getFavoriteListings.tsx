import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings(){
    try {
        const currentUser = await getCurrentUser(); //Get the current user

        if (!currentUser) { 
            return []; //If there is no current user, return an empty array
        }

        const favorites = await prisma.listing.findMany({
            where: { 
                id: {
                    in: [...(currentUser.favoriteIds || [])]
                }
            }
        }); //Get the favorite listings of the current user

        // Sanitize the favorites
        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString()
        }));

        return safeFavorites;
    } catch (error: any) {
        throw new Error(error);
    }
}