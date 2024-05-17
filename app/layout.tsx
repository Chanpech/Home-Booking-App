import type { Metadata } from "next";
import "./globals.css";

import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";

import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import SearchModal from "./components/modals/SearchModal";
import RentModal from "./components/modals/RentModal";

import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { //Control title or descriptions
  title: "Airbnb",
  description: "AirbnbClone",
};

const font = Nunito({ // Give a certain class the font
  subsets: ["latin"],
})

export default async function  RootLayout({
  children,
}: {
  children: React.ReactNode;
})
 {
  const currentUser= await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly> 
          <ToasterProvider /> {/* Requires a least one parent and thus why we can't use toaster by itself here*/}
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
         {children}
        </div>
        
      </body>
    </html>
  );
}
