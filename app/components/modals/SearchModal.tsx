'use client';

import qs from "query-string";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";


import Modal from "./Modal"
import useSearchModal from "@/app/hooks/useSearchModal";
import Heading from "../Heading";
import { CountrySelectValue } from "../Inputs/CountrySelect";
import CountrySelect from "../Inputs/CountrySelect";
import Calendar from "../Inputs/Calendar";
import Counter from "../Inputs/Counter";

enum STEPS { //Create an enum for the steps
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
}

const SearchModal = () => {

    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>(); //Set the initial location to an empty string
    const [step, setStep] = useState(STEPS.LOCATION); //Set the initial step to location
    const [guestCount, setGuestCount] = useState(1); //Set the initial guest count to 1
    const [roomCount, setRoomCount] = useState(1); //Set the initial room count to 1
    const [bathroomCount, setBathroomCount] = useState(1); //Set the initial bathroom count to 1
    const  [dateRange, setDateRange] = useState<Range>({ //Set the initial date range
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import ('../Map'), { //Return the import of the map component
        ssr: false //Set the server side rendering to false
    }), [location]); //Load the map component dynamically

    const onBack = useCallback(() => {
        setStep((value) => value -1);
    }, []); //Go back one step

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    },[]);

    const onSubmit = useCallback( async () => { //Async because we are using await
        if(step  !== STEPS.INFO) { //If the step is not the last then go to the next step
            return onNext(); 
        }
        //Otherwise we'll define the query

        let currentQuery = {};
        if(params){
            currentQuery = qs.parse(params.toString()); //Parse the query
        }
        const updateQuery: any = {  //Initial updated query
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        //We're transforming the query object into a string
        if ( dateRange.startDate){ 
            updateQuery.startDate = formatISO(dateRange.startDate);
        }

        if ( dateRange.endDate){
            updateQuery.endDate = formatISO(dateRange.endDate);
        }

        const url =qs.stringifyUrl({ //Stringify the url
            url: '/',
            query: updateQuery,
        },{ skipNull: true });

        setStep(STEPS.LOCATION); //Set the step to location after the search
        searchModal.onClose(); //Close the search modal

        router.push(url); //Push the stringtify url to the router 
    },[
        step,
        searchModal,
        location,
        router,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext, 
        params
    ]);

    const actionLabel = useMemo(() => { //Return the action label
        if(step === STEPS.INFO){ //If the step is the last step then return search
            return "Search";
        }
        return 'Next'; //Otherwise return next
    },[step]);

    const secondaryActionLabel = useMemo(() => { 
        if(step === STEPS.LOCATION){ //If the step is the location then return close
            return "Close";
        }
        return "Back"; //Otherwise return back
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8" >
            <Heading 
                title="Where do you want to go?"
                subtitle="Find the perfect location!"
            />
            <CountrySelect
                value={location}
                onChange={(value) => 
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr />
            <Map center={location?.latlng}/>
        </div>
    )

    if ( step === STEPS.DATE ){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    if(step === STEPS.INFO ){ 
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="More information"
                    subtitle="Find  your perfect place!"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)} //Set the guest count
                />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)} //Set the guest count
                />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)} //Set the guest count
                />
            </div>
        )
    }

    return ( 
        <Modal 
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack} //If the step is location then return undefined otherwise return onBack
            body={bodyContent}
        />
     );
}
 
export default SearchModal;