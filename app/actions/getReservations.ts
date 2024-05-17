//This is an action for the server component

import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string; //This is for your property
    authorId?: string; //This is for the author of the reserve property
}

export default async function getReservations(
    params: IParams
) {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};
        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) { // Search for all of the reservations that the other users have made on the property
            query.listing = { userId: authorId };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString(),
                }
            })
        );
        return safeReservations
    } catch (error: any) { //Catch the error if anything goes wrong
        throw new Error(error);
    }   
}