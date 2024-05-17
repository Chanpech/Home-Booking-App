import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";
import React from "react";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({
    listingId,
    currentUser
} : IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(listingId);
    }, [currentUser, listingId]); //Check if the listing is in the user's favorite list

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();
        
        if ( !currentUser ){
            return loginModal.onOpen();;
        }

        try {
            let request;

            if( hasFavorited ) {
                request = () => axios.delete(`/api/favorites/${listingId}`); //Remove from favorite
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`); //Add to favorite
            }

            await request(); //Make the request
            router.refresh();
            toast.success("Success");
        } catch (error) {
            toast.error("Something went wrong");
        }
    },[currentUser, hasFavorited, listingId, loginModal, router]);

    return {
        hasFavorited,
        toggleFavorite
    };
}

export default useFavorite;