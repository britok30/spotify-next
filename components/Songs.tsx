"use client";

import React from "react";
import { Clock, Hash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpotifyContext } from "@/contexts/SpotifyContext";
import Song from "./Song";

const Songs = () => {
  const { currentPlaylist } = useSpotifyContext();

  // Show loading skeleton if no playlist yet
  if (!currentPlaylist) {
    return <SongsSkeleton />;
  }

  if (!currentPlaylist.tracks?.items?.length) {
    return (
      <div className="px-4 md:px-8 py-8 text-center">
        <p className="text-gray-400 text-base md:text-lg">
          No tracks found in this playlist
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-8 pb-28">
      {/* Table Header */}
      <div className="grid grid-cols-[16px_1fr_minmax(80px,_auto)] md:grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-2 md:gap-4 items-center px-2 md:px-4 py-2 border-b border-gray-800 mb-4">
        <div className="flex items-center justify-center">
          <Hash className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
        </div>
        <div className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
          Title
        </div>
        <div className="hidden md:block text-sm font-medium text-gray-400 uppercase tracking-wider">
          Album
        </div>
        <div className="flex items-center justify-end">
          <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {currentPlaylist.tracks.items.map((trackItem: any, index: number) => {
          // Skip if track is null (removed tracks show as null)
          if (!trackItem.track || trackItem.track.type !== "track") {
            return null;
          }

          return (
            <Song
              key={`${trackItem.track.id}-${index}`}
              track={trackItem.track}
              order={index}
            />
          );
        })}
      </div>

      {/* Track Count Summary */}
      <div className="mt-8 px-2 md:px-4">
        <p className="text-gray-400 text-xs md:text-sm">
          {currentPlaylist.tracks.total.toLocaleString()} songs
          {currentPlaylist.followers?.total && (
            <span>
              {" "}
              • {currentPlaylist.followers.total.toLocaleString()} likes
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

// Loading skeleton component
const SongsSkeleton = () => (
  <div className="px-2 md:px-8 pb-28">
    {/* Header Skeleton */}
    <div className="grid grid-cols-[16px_1fr_minmax(80px,_auto)] md:grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-2 md:gap-4 items-center px-2 md:px-4 py-2 border-b border-gray-800 mb-4">
      <Skeleton className="h-3 w-3 md:h-4 md:w-4 bg-gray-800" />
      <Skeleton className="h-3 md:h-4 w-16 bg-gray-800" />
      <Skeleton className="hidden md:block h-4 w-16 bg-gray-800" />
      <div className="flex justify-end">
        <Skeleton className="h-3 w-3 md:h-4 md:w-4 bg-gray-800" />
      </div>
    </div>

    {/* Track Skeletons */}
    <div className="space-y-1">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[16px_1fr_minmax(80px,_auto)] md:grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-2 md:gap-4 items-center px-2 md:px-4 py-2"
        >
          <Skeleton className="h-4 w-4 bg-gray-800" />
          <div className="flex items-center space-x-2 md:space-x-3">
            <Skeleton className="h-10 w-10 rounded bg-gray-800 flex-shrink-0" />
            <div className="space-y-1 min-w-0 flex-1">
              <Skeleton className="h-3 md:h-4 w-24 md:w-32 bg-gray-800" />
              <Skeleton className="h-2 md:h-3 w-20 md:w-24 bg-gray-800" />
            </div>
          </div>
          <Skeleton className="hidden md:block h-4 w-28 bg-gray-800" />
          <div className="flex justify-end">
            <Skeleton className="h-3 md:h-4 w-10 md:w-12 bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Songs;
