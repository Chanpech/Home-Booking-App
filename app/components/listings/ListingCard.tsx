'use client';

import { useRouter } from "next/navigation";

import { SafeListing, SafeUser, SafeReservation } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id:string) => void;
    disabled?:  boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;//SafeUser is a type that is defined in the types folder

}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = "",
    currentUser
}) => {
    const router = useRouter();
    const { getByValue } = useCountries(); //Get the country by value
    
    const location = getByValue(data.locationValue); // Get the location by value

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation(); //Prevent the event from bubbling up

            if (disabled) {
                return;
            }
            onAction?.(actionId);
        }, [onAction, disabled, onAction] );
    
    const price = useMemo(() => {
        if (reservation){
            return reservation.totalPrice;
        }
        return data.price;
    },[data.price, reservation]);

    const reservationDate = useMemo(() => { 
        if (!reservation) {
            return null;
        }
        
        const start = new Date(reservation.startDate); 
        const end = new Date(reservation.endDate);
    
        return `${format(start, 'PP')} - ${format(end, 'PP')}` //Format of the reservation date
    },[reservation]);


    return ( 
        <div
         onClick={() => router.push(`/listings/${data.id}`)} //Redirect to the listing page
         className="
          col-span-1 cursor-pointer group
         "
        >
            <div className="flex flex-col gap-2 w-full">
                <div
                 className="
                  aspect-square
                  w-ful
                  relative
                  overflow-hidden
                  rounded-lg
                 "
                >
                    <Image 
                        fill
                        src={data.imageSrc}
                        alt="Listing"
                        className="
                         object-cover
                         h-full
                         w-full
                         group-hover:scale-110
                         transition
                        " 
                    /> 
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        ${price} 
                    </div>
                    {!reservation && (
                        <div className="font-light">
                            night
                        </div>
                    )}
                </div>
                {onAction && actionLabel && ( //If the action is available, show the button. This is done through reservation.
                    <Button 
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
     );
}
 
export default ListingCard;