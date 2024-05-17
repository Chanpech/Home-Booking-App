//Types that is for safe user 

import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<
    Listing,
    "createdAt"
> & {
    createdAt: string;
};

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}



export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified" 
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
}; // This is a type that is used to make sure that the user object is safe to use in the frontend so that we don't expose any sensitive information