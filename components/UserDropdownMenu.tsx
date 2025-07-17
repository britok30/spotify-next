"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Shield,
  Download,
  LogOut,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const UserDropdownMenu = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const handleOpenProfile = () => {
    openUserProfile();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-3 bg-black/70 hover:bg-black/90 rounded-full py-8 px-10 transition-all duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
            <AvatarFallback className="bg-gray-700 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold text-sm max-w-[100px] truncate">
            {user.fullName || user.firstName || "User"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-gray-900 border-gray-700"
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
              <AvatarFallback className="bg-gray-700 text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {user.fullName || user.firstName || "User"}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <DropdownMenuItem
          className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2"
          onClick={handleOpenProfile}
        >
          <User className="h-4 w-4 mr-3" />
          Account
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2">
          <User className="h-4 w-4 mr-3" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2">
          <Shield className="h-4 w-4 mr-3" />
          Private session
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2">
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* App Actions */}
        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2">
          <Download className="h-4 w-4 mr-3" />
          Install app
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-white hover:bg-gray-800 cursor-pointer px-3 py-2"
          onClick={() => window.open("https://spotify.com", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-3" />
          Open Spotify
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Logout */}
        <DropdownMenuItem
          className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer px-3 py-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
