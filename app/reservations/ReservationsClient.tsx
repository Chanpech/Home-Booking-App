'use client';

import { toast } from "react-hot-toast";
import axios  from "axios";
import  { useCallback, useState  } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";


interface ReservationsClientProps {
    reservations: SafeReservation[]; //Array of reservations
    currentUser?: SafeUser | null; //Optional
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter(); // Get the router object
    const [deletingId, setDeletingId] = useState(''); // This is the state that will hold the id of the reservation that is being deleted
    
    const onCancel = useCallback((id: string) => {
        setDeletingId(id); //Set the id of the reservation that is being deleted

        axios.delete(`/api/reservations/${id}`) //Delete the reservation
        .then(() => {
            toast.success("Reservation cancelled"); //Show a success message
            router.refresh(); 
        })
        .catch(() =>{
            toast.error("Something went wrong"); //Show an error message
        })
        .finally(() => { 
            setDeletingId(''); //Reset the deletingId state
        })
    }, [router]);
    return ( 
        <Container>
            <Heading 
              title="Reservations"
              subtitle="Bookings on your properties"            
            />
            <div
             className="
              mt-10
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-8
             "
            >
                {reservations.map((reservation) => (
                    <ListingCard 
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancel guest reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>

        </Container>
     );
}
 
export default ReservationsClient;