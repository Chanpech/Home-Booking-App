'use client';

import { IconType } from "react-icons";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), {
    ssr: false 
}); //Dynamically import the map component

interface ListingInfoProps {
    user: SafeUser
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined // The category object
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps>  = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    const { getByValue } = useCountries(); ///Get the country by the value
    
    const coordinates = getByValue(locationValue)?.latlng;
    return ( 
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div
                 className="
                  text-xl
                  font-semibold
                  flex
                  flex-row
                  items-center
                  gap-2
                 "
                >
                    Hosted by {user?.name} 
                    <Avatar 
                    src={user?.image}
                />
                </div>
                <div 
                    className="
                     flex
                     flex-row
                     items-center
                     gap-4
                     font-light
                     text-neutral-500
                    "
                >
                    <div>
                        {guestCount} guests
                    </div>
                    <div>
                        {roomCount} rooms
                    </div>
                    <div>
                        {bathroomCount} bathrooms
                    </div>
                </div>
            </div>
            <hr />
            {category && ( //Display the category if it exists
                <ListingCategory 
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
                
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <hr />
            <Map center={coordinates} />
        </div>
     );
}
 
export default ListingInfo;