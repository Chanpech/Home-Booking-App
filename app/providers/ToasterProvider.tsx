'use client';

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => { //This is a client component that we want to use for  our app 
    return ( 
        <Toaster
        />
     );
}

export default ToasterProvider;