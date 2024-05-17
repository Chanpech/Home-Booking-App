import EmptyState from "../components/EmptyState";
import ReservationsClient from "./ReservationsClient";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";

const ReservationPage = async () => {

    const currentUser = await getCurrentUser(); //Get the current user await is used to wait for the promise to resolve

    if (!currentUser) { //If there is no current user
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        )   
    }

    const reservations = await getReservations({
        authorId: currentUser.id //Get the reservations of the current user on our listing
    }); //Get the reservations await is used to wait for the promise to resolve

    if (reservations.length === 0) { //If there are no reservations
        return (
            <ClientOnly>
                <EmptyState
                    title="No reservations"
                    subtitle="You have no reservations on your property"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient 
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ReservationPage;