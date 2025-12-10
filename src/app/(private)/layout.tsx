"use client";
import { useAuthStore } from "@/lib/Store/store";
import { useEffect } from "react";

const homeLayout = ({ children }: { children: React.ReactNode }) => {
  const { refreshUser, loading, isLoggedIn } = useAuthStore();

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    console.log("Auth Status Changed: ", { isLoggedIn, loading });
  }, [isLoggedIn, loading]);

  return (
    <div className="w-screen flex gap-10 justify-center items-center ">
      hello, this is private Layout
      <div>{children}</div>
    </div>
  );
};

export default homeLayout;
