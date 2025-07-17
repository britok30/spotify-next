// components/Main.tsx
"use client";

import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { Download, MoreHorizontal, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpotifyContext } from "@/contexts/SpotifyContext";
import Songs from "./Songs";
import PlaylistDetails from "./PlaylistDetails";
import UserDropdownMenu from "./UserDropdownMenu";

const Main = () => {
  const {
    spotifyApi,
    isAuthenticated,
    connectSpotify,
    currentPlaylist,
    currentPlaylistId,
    setCurrentPlaylist,
    setCurrentPlaylistId,
    isPlaying,
    setIsPlaying,
  } = useSpotifyContext();

  const [color, setColor] = useState<string | null>(null);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

  const colors: string[] = [
    "from-indigo-500",
    "from-slate-500",
    "from-gray-500",
    "from-zinc-500",
    "from-blue-500",
    "from-red-500",
    "from-pink-500",
    "from-purple-500",
    "from-green-500",
    "from-neutral-500",
    "from-stone-500",
    "from-orange-500",
    "from-amber-500",
    "from-yellow-500",
    "from-lime-500",
    "from-emerald-500",
    "from-teal-500",
    "from-cyan-500",
    "from-sky-500",
    "from-violet-500",
    "from-fuchsia-500",
    "from-rose-500",
  ];

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [currentPlaylistId]);

  useEffect(() => {
    if (spotifyApi && currentPlaylistId) {
      const fetchPlaylist = async () => {
        console.log("Fetching playlist:", currentPlaylistId);
        setIsLoadingPlaylist(true);

        try {
          const data = await spotifyApi.playlists.getPlaylist(
            currentPlaylistId
          );
          console.log("Playlist fetched successfully:", data.name);
          setCurrentPlaylist(data);
        } catch (error) {
          console.error("Error fetching playlist:", error);
          setCurrentPlaylist(null);
        } finally {
          setIsLoadingPlaylist(false);
        }
      };

      // Clear current playlist immediately to show loading state
      setCurrentPlaylist(null);
      fetchPlaylist();
    }
  }, [spotifyApi, currentPlaylistId, setCurrentPlaylist]);

  const handlePlayPlaylist = async () => {
    if (!spotifyApi || !currentPlaylist) return;

    try {
      const devices = await spotifyApi.player.getAvailableDevices();
      const activeDevice = devices.devices.find((device) => device.is_active);

      if (!activeDevice) {
        console.error("No active Spotify device found");
        return;
      }

      if (isPlaying) {
        await spotifyApi.player.pausePlayback(activeDevice.id!);
        setIsPlaying(false);
      } else {
        await spotifyApi.player.startResumePlayback(
          activeDevice.id!,
          currentPlaylist.uri
        );
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error controlling playback:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
        <header className="absolute top-5 right-8 z-10">
          <UserDropdownMenu />
        </header>

        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-4">
              Connect your Spotify account to view playlists
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
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar scrollbar-thumb-zinc-400 scrollbar-track-black">
      <header className="absolute top-5 right-8 z-10">
        <UserDropdownMenu />
      </header>

      {/* Hero Section with Playlist Details */}
      <section
        className={`flex items-end bg-gradient-to-b to-black ${color} min-h-[420px] text-white p-8 w-full`}
      >
        <PlaylistDetails playlist={currentPlaylist} />
      </section>

      {/* Controls Section */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4 px-8 py-6">
          <Button
            size="icon"
            variant="ghost"
            className="h-16 w-16 rounded-full bg-[#18D860] hover:bg-[#109643] hover:scale-105 transition-all duration-150"
            onClick={handlePlayPlaylist}
            disabled={!currentPlaylist || isLoadingPlaylist}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-black fill-current" />
            ) : (
              <Play className="h-8 w-8 text-black fill-current ml-1" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-gray-400 hover:text-white hover:scale-105 transition-all duration-150"
          >
            <Download className="h-6 w-6" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-gray-400 hover:text-white hover:scale-105 transition-all duration-150"
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                Add to queue
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                Add to playlist
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Songs Section */}
      <div className="bg-black/10">
        <Songs />
      </div>
    </div>
  );
};

export default Main;
