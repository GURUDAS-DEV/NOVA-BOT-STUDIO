"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/Store/store";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { refreshUser, loading, isLoggedIn } = useAuthStore();
  
    useEffect(() => {
      refreshUser();
    }, []);
  
    useEffect(() => {
      console.log("Auth Status Changed: ", { isLoggedIn, loading });
    }, [isLoggedIn, loading]);
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
