import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams { 
    reservationId?: string;
}

export async function DELETE(
    request: Request,
    { params } : { params: IParams}
 ){
    const currentUser = await getCurrentUser();

    if (!currentUser) {                                         //If there is no current user
        return NextResponse.error();
    }
    
    const { reservationId } = params;
    
    if( !reservationId || typeof reservationId !== 'string') {  //If the reservation ID is not a string
        throw new Error('Invalid ID');
    }


    // We want to ensure that the user that is deleting the reservation is either the user that created the reservation or the user that owns the listing
    const reservation = await prisma.reservation.deleteMany( { 
        where: {
            id: reservationId,
            OR: [
                {userId: currentUser.id}, //If the user is the creator of the reservation
                {listing: {userId: currentUser.id}} //If the user is the owner of the listing
            ]
        }
    });

    return NextResponse.json(reservation); //Return the deleted reservation
 }