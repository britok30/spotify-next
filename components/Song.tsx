"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, Heart, MoreHorizontal, Music, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSpotifyContext } from "@/contexts/SpotifyContext";
import type { Track } from "@spotify/web-api-ts-sdk";

interface SongProps {
  order: number;
  track: Track;
}

const Song = ({ order, track }: SongProps) => {
  const {
    spotifyApi,
    isAuthenticated,
    currentTrackId,
    setCurrentTrackId,
    isPlaying,
    setIsPlaying,
    fetchCurrentTrack,
    makeSpotifyRequest,
    getActiveDevice,
  } = useSpotifyContext();

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isCurrentTrack = currentTrackId === track.id;
  const showPlayButton = isHovered || isCurrentTrack;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!spotifyApi) return;

    // Get device ID from context
    const deviceId = await getActiveDevice();
    if (!deviceId) {
      alert("No active Spotify device found. Please open Spotify on a device.");
      return;
    }

    // Immediate UI feedback
    if (isCurrentTrack && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrackId(track.id);
      setIsPlaying(true);
    }

    try {
      if (isCurrentTrack && isPlaying) {
        await makeSpotifyRequest((api) => api.player.pausePlayback(deviceId));
      } else {
        await makeSpotifyRequest((api) =>
          api.player.startResumePlayback(deviceId, undefined, [track.uri])
        );
      }
      // Longer delay to avoid rate limits and let Spotify update
      setTimeout(fetchCurrentTrack, 1500);
    } catch (error) {
      console.error("Error playing track:", error);

      // Handle rate limiting
      if (error.status === 429) {
        console.log("Rate limited, will retry in 2 seconds");
        setTimeout(fetchCurrentTrack, 2000);
      } else {
        // Revert UI state if API call failed
        setIsPlaying(false);
      }
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!spotifyApi) return;

    // Immediate UI feedback
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      if (isLiked) {
        await spotifyApi.currentUser.tracks.removeSavedTracks([track.id]);
      } else {
        await spotifyApi.currentUser.tracks.saveTracks([track.id]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);

      // Handle rate limiting
      if (error.status === 429) {
        console.log("Rate limited, like action failed");
        // Revert UI state
        setIsLiked(isLiked);
        return;
      }

      // Revert UI state for other errors
      setIsLiked(isLiked);
    }
  };

  const handleAddToQueue = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    try {
      await makeSpotifyRequest((api) =>
        api.player.addItemToPlaybackQueue(track.uri, deviceId)
      );
    } catch (error) {
      console.error("Error adding to queue:", error);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "group grid grid-cols-[16px_1fr_minmax(80px,_auto)] md:grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-2 md:gap-4 items-center px-2 md:px-4 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-white/5",
        isCurrentTrack && "bg-white/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Track Number / Play Button */}
      <div className="flex items-center justify-center w-4">
        {showPlayButton ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-4 p-0 text-white hover:scale-110 transition-transform"
            onClick={handlePlay}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </Button>
        ) : (
          <span
            className={cn(
              "text-sm",
              isCurrentTrack ? "text-[#18D860]" : "text-gray-400"
            )}
          >
            {order + 1}
          </span>
        )}
      </div>

      {/* Track Info */}
      <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
        <div className="relative group/image flex-shrink-0">
          {track.album?.images?.[0]?.url ? (
            <img
              className="h-10 w-10 rounded object-cover"
              src={track.album.images[0].url}
              alt={`${track.name} cover`}
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-800 flex items-center justify-center">
              <Music className="h-4 w-4 text-gray-600" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs md:text-sm font-medium",
              "line-clamp-1 md:truncate", // Allow 1 line on mobile, truncate on desktop
              isCurrentTrack ? "text-[#18D860]" : "text-white"
            )}
            title={track.name} // Show full name on hover
          >
            {track.name}
          </p>
          <p className="text-[10px] md:text-sm text-gray-400 truncate">
            {track.artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Album Name */}
      <div className="hidden md:block min-w-0">
        <p className="text-sm text-gray-400 truncate hover:text-white hover:underline cursor-pointer">
          {track.album?.name}
        </p>
      </div>

      {/* Actions & Duration */}
      <div className="flex items-center justify-end space-x-1 md:space-x-2">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "h-8 w-8 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity",
            isLiked
              ? "text-[#18D860] opacity-100"
              : "text-gray-400 hover:text-white"
          )}
          onClick={handleLike}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </Button>

        <span
          className={cn(
            "text-[11px] md:text-sm tabular-nums",
            isCurrentTrack ? "text-[#18D860]" : "text-gray-400"
          )}
        >
          {formatDuration(track.duration_ms)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 md:h-8 md:w-8 text-gray-400 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-gray-800 border-gray-700"
            align="end"
          >
            <DropdownMenuItem
              className="text-white hover:bg-gray-700"
              onClick={handleAddToQueue}
            >
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Go to song radio
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Show credits
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Song;
