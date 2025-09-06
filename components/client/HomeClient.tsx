"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "../Sidebar";
import Main from "../Main";
import Player from "../Player";
import UserDropdownMenu from "../UserDropdownMenu";
import { Menu, X, Home, Search, Library } from "lucide-react";
import { Button } from "../ui/button";

const HomeClient = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    <div className="bg-black h-screen overflow-hidden relative">
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          
          <span className="text-white font-bold text-lg">Spotify Clone</span>
          
          <div className="md:hidden">
            <UserDropdownMenu />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        md:hidden fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onMobileNavClick={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex h-full">
        {/* Desktop Sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content Area - Adjusted for mobile */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-hidden pt-16 md:pt-0 pb-24">
            <Main />
          </div>
        </div>
      </main>

      {/* Player - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Player />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-24 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 z-30">
        <div className="flex justify-around items-center py-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Library className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;
