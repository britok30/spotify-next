"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "../Sidebar";
import Main from "../Main";
import Player from "../Player";

const HomeClient = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for Clerk to load, then check if user exists
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="bg-black h-screen overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Main />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default HomeClient;
