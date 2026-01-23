
"use client";
import { useAuthStore } from "@/lib/Store/store";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const homeLayout = ({ children }: { children: React.ReactNode }) => {
  const { refreshUser, loading, isLoggedIn } = useAuthStore();

  useEffect(() => {
    refreshUser();
  }, []);

  
  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center  dark:bg-stone-950">
        <Button disabled size="icon-lg">
        <Spinner className="size-7" />
        <p className="text-lg font-inter text-black dark:text-white">Loading...</p>
      </Button>
      </div>
    )
  }

  return (
    <div className="w-full  bg-pink-50 dark:bg-stone-950">
      {/* Fixed Sidebar */}
      <Sidebar />
      {/* Content area offset by sidebar width and topbar height */}
      <div className="lg:ml-64 ml-0 flex flex-col min-h-screen">
        {/* Top Bar */}
        <TopBar />
        {/* Page content */}
        <main className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-6 font-outfit">
          {children}
        </main>
      </div>
    </div>
  );
};

export default homeLayout;
