'use client';

import Image from "next/image"; // Import Image from next/image
import { useRouter } from "next/navigation"; // Import useRouter from next/router


const Logo = () => {
    return (
        <Image 
            alt="Airbnb Logo"
            className="hidden md:block cursor-pointer"
            height="100"
            width="100"
            src="/images/airbnb_logo.png"
        /> // Use Image component from next/image
    );
}

export default Logo;