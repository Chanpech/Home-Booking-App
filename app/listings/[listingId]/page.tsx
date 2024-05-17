import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyStage from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
    listingId?: string;
}

const ListingPage = async (
    {params}: { params: IParams} //This is a server component so we cannot use the hooks here

) => {
    const listing = await getListingById(params); //Get the listing by the id
    const reservations = await getReservations(params); //Get the reservations by the listing id
    const currentUser = await getCurrentUser(); //Get the current user

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyStage />
            </ClientOnly>
        ); 
    }

    return ( 
        <ClientOnly>
            <ListingClient 
                listing={listing}
                reservations={reservations} //string are sanitized
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default ListingPage;