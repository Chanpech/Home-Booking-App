'use client';

import { Range } from "react-date-range";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";

import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import Container from "@/app/components/Container";
import useLoginModal from "@/app/hooks/useLoginModal";
import ListingReservation from "@/app/components/listings/ListingReservation";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selections'
};///Initial date range object

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [], // Default value for reservation
    currentUser
}) => {

    const loginModal = useLoginModal(); 
    const router = useRouter(); 
    
    const disabledDates = useMemo(() => {
        let dates: Date[] = []; //By default, the dates are empty

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                //Object in this function
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            }); //Get the range of dates

            dates= [...dates, ...range]; //Add the range to the dates, ... is a spread operator that adds the range to the dates
        });

        return dates; //Return the dates
    },[reservations]);

    const [isLoading, setIsLoading] = useState(false); //Set the loading state to false
    const [totalPrice, setTotalPrice] = useState(listing.price); //Set the total price to the listing price
    const [dateRange, setDateRange] = useState<Range>(initialDateRange); //Set the date range to the initial date range

    const onCreateReservation = useCallback(()=> {
        if(!currentUser) { //If there is no current user we will open the login modal
            loginModal.onOpen();
            return;
        }

        setIsLoading(true); //Set the loading state to true
        axios.post(`/api/reservations`, {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(() => {
            toast.success("Listing reserved!"); //Show a success toast
            setDateRange(initialDateRange); //Set the date range to the initial date range
            router.push("/trips"); //Redirect to the trips page
        })
        .catch(() => { 
            toast.error("Something went wrong."); //Show an error toast
        })
        .finally(() => { 
            setIsLoading(false); //Set the loading state to false if the request is finished
        })
    },[
        totalPrice,
        dateRange,
        listing?.id,
        router,
        currentUser,
        loginModal
    ]); //Create a reservation function

    useEffect(() => { 
        if(dateRange.startDate && dateRange.endDate) { //This going to spot everytime that the date range changes   
            const dayCount = differenceInCalendarDays( //Count the days between the start and end date
                //differenceInDays is a function that returns the difference between two dates and it removes the time
                dateRange.endDate,
                dateRange.startDate
            ); //Get the day count
            
            if(dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price); //Set the total price to the day count multiplied by the listing price
            } else {
                setTotalPrice(listing.price); //If there is no day count, set the total price to the single listing price
            } 
        }
    },[dateRange, listing.price]); //Use effect to calculate the total price    

    const category = useMemo(() => {  //We are using categories from the client component
        return categories.find((item) => 
            item.label === listing.category);
    }, [listing.category]); //Memoize the category

    return ( 
        <Container>
            <div className="max-w-scren-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    /> 
                    <div className="
                         grid
                         grid-cols-1
                         md:grid-cols-7
                         md:gap-10
                         mt-6"
                    >
                        <ListingInfo 
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div
                         className="
                            order-first
                            mb-10
                            md:order-last
                            md:col-span-3
                         "
                        >
                            <ListingReservation 
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
     );
}
 
export default ListingClient;