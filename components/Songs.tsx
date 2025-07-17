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
      <div className="px-8 py-8 text-center">
        <p className="text-gray-400 text-lg">
          No tracks found in this playlist
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 pb-28">
      {/* Table Header */}
      <div className="grid grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-4 items-center px-4 py-2 border-b border-gray-800 mb-4">
        <div className="flex items-center justify-center">
          <Hash className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Title
        </div>
        <div className="hidden md:block text-sm font-medium text-gray-400 uppercase tracking-wider">
          Album
        </div>
        <div className="flex items-center justify-end">
          <Clock className="h-4 w-4 text-gray-400" />
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
      <div className="mt-8 px-4">
        <p className="text-gray-400 text-sm">
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
  <div className="px-8 pb-28">
    {/* Header Skeleton */}
    <div className="grid grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-4 items-center px-4 py-2 border-b border-gray-800 mb-4">
      <Skeleton className="h-4 w-4 bg-gray-800" />
      <Skeleton className="h-4 w-16 bg-gray-800" />
      <Skeleton className="hidden md:block h-4 w-16 bg-gray-800" />
      <div className="flex justify-end">
        <Skeleton className="h-4 w-4 bg-gray-800" />
      </div>
    </div>

    {/* Track Skeletons */}
    <div className="space-y-1">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[16px_4fr_2fr_minmax(120px,_1fr)] gap-4 items-center px-4 py-2"
        >
          <Skeleton className="h-4 w-4 bg-gray-800" />
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded bg-gray-800" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 bg-gray-800" />
              <Skeleton className="h-3 w-24 bg-gray-800" />
            </div>
          </div>
          <Skeleton className="hidden md:block h-4 w-28 bg-gray-800" />
          <div className="flex justify-end">
            <Skeleton className="h-4 w-12 bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Songs;
