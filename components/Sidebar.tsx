"use client";

import React, { useEffect, useState } from "react";
import { Home, Search, Library, Plus, Heart, Radio, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSpotifyContext } from "@/contexts/SpotifyContext";

const SidebarButton = ({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
}) => (
  <Button
    variant="ghost"
    className={cn(
      "flex items-center justify-start space-x-3 w-full h-10 px-3 text-gray-400 hover:text-black transition-colors duration-200 rounded-md cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

export const Sidebar = ({ onMobileNavClick }: { onMobileNavClick?: () => void } = {}) => {
  const {
    spotifyApi,
    isAuthenticated,
    connectSpotify,
    currentPlaylistId,
    setCurrentPlaylistId,
    userPlaylists,
    setUserPlaylists,
    setCurrentPlaylist, // Add this to clear current playlist
  } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!spotifyApi) return;

      setIsLoading(true);
      try {
        const data = await spotifyApi.currentUser.playlists.playlists(50);
        setUserPlaylists(data.items || []);

        // Set first playlist as default if none selected
        if (data.items?.length > 0 && !currentPlaylistId) {
          console.log("Setting default playlist:", data.items[0].id);
          setCurrentPlaylistId(data.items[0].id);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [
    spotifyApi,
    isAuthenticated,
    setUserPlaylists,
    currentPlaylistId,
    setCurrentPlaylistId,
  ]);

  const handlePlaylistClick = (id: string) => {
    console.log("Clicking playlist:", id, "Current:", currentPlaylistId);
    if (id !== currentPlaylistId) {
      setCurrentPlaylistId(id);
      setCurrentPlaylist(null); // Clear current playlist to show loading
    }
    if (onMobileNavClick) {
      onMobileNavClick();
    }
  };

  // Show connect prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen w-64 bg-black border-r border-gray-800 text-white">
        {/* Main Navigation */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Music className="h-8 w-8 text-[#18D860]" />
            <span className="text-xl font-bold">Spotify</span>
          </div>

          <nav className="space-y-2">
            <SidebarButton icon={Home} label="Home" />
            <SidebarButton icon={Search} label="Search" />
            <SidebarButton icon={Library} label="Your Library" />
          </nav>
        </div>

        <Separator className="bg-gray-800" />

        {/* Connect Spotify Prompt */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Connect Spotify to view your playlists
            </p>
            <Button
              onClick={connectSpotify}
              className="bg-[#18D860] hover:bg-[#109643] text-black font-semibold"
            >
              Connect Spotify
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-black border-r border-gray-800 text-white">
      {/* Main Navigation */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Music className="h-8 w-8 text-[#18D860]" />
          <span className="text-xl font-bold">Spotify</span>
        </div>

        <nav className="space-y-2">
          <SidebarButton icon={Home} label="Home" />
          <SidebarButton icon={Search} label="Search" />
          <SidebarButton icon={Library} label="Your Library" />
        </nav>
      </div>

      <Separator className="bg-gray-800" />

      {/* Library Actions */}
      <div className="p-6 space-y-2">
        <SidebarButton icon={Plus} label="Create Playlist" />
        <SidebarButton icon={Heart} label="Liked Songs" />
        <SidebarButton icon={Radio} label="Your Episodes" />
      </div>

      <Separator className="bg-gray-800" />

      {/* Playlists */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          Playlists
        </h3>

        <div className="pb-6 overflow-y-scroll h-48 scrollbar scrollbar-thumb-zinc-400 scrollbar-track-black">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {userPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  className={cn(
                    "w-full text-left p-2 rounded-md transition-colors duration-200 text-sm",
                    currentPlaylistId === playlist.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-900"
                  )}
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <div className="truncate">{playlist.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {playlist.owner.display_name} • {playlist.tracks.total}{" "}
                    songs
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
