"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Music, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Playlist } from "@spotify/web-api-ts-sdk";

interface PlaylistDetailsProps {
  playlist: Playlist | null;
}

const PlaylistDetails = ({ playlist }: PlaylistDetailsProps) => {
  const { user } = useUser();

  if (!playlist) {
    return <PlaylistDetailsSkeleton />;
  }

  // Calculate total duration
  const totalDuration = playlist.tracks.items.reduce((acc, item) => {
    return acc + (item.track?.duration_ms || 0);
  }, 0);

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const isOwner =
    playlist.owner.display_name === user?.fullName ||
    playlist.owner.id === user?.username;

  return (
    <div className="flex items-end space-x-6">
      {/* Playlist Cover */}
      <div className="relative group flex-shrink-0">
        {playlist.images?.[0]?.url ? (
          <img
            className="h-56 w-56 shadow-2xl rounded-lg object-cover"
            src={playlist.images[0].url}
            alt={`${playlist.name} cover`}
          />
        ) : (
          <div className="h-56 w-56 shadow-2xl rounded-lg bg-gray-800 flex items-center justify-center">
            <Music className="h-20 w-20 text-gray-600" />
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Playlist Type Badge */}
        <div>
          <p className="text-sm text-white font-medium">
            {playlist.public ? "Public Playlist" : "Private Playlist"}
          </p>
        </div>

        {/* Playlist Title */}
        <h1 className="font-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-none tracking-tight line-clamp-2 max-w-4xl">
          {playlist.name}
        </h1>

        {/* Description */}
        {playlist.description && (
          <div
            className="text-sm text-gray-300 max-w-2xl opacity-70"
            dangerouslySetInnerHTML={{
              __html: playlist.description,
            }}
          />
        )}

        {/* Playlist Metadata */}
        <div className="flex items-center space-x-1 text-sm text-white">
          {/* Spotify Icon */}
          <div className="h-6 w-6 bg-[#1DB954] rounded-full flex items-center justify-center mr-2">
            <Music className="h-3 w-3 text-white" />
          </div>

          {/* Made for text */}
          <span className="font-medium">Made for</span>

          {/* Owner */}
          <span className="font-bold hover:underline cursor-pointer">
            {playlist.owner.display_name}
          </span>

          <span className="text-gray-300">•</span>

          {/* Track Count and Duration */}
          <span className="text-gray-300">
            {playlist.tracks.total.toLocaleString()} songs,{" "}
            {formatDuration(totalDuration)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const PlaylistDetailsSkeleton = () => (
  <div className="flex items-end space-x-6">
    <Skeleton className="h-56 w-56 rounded-lg bg-gray-800 flex-shrink-0" />
    <div className="flex-1 space-y-6">
      <Skeleton className="h-4 w-32 bg-gray-800" />
      <Skeleton className="h-20 w-96 bg-gray-800" />
      <Skeleton className="h-4 w-80 bg-gray-800" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full bg-gray-800" />
        <Skeleton className="h-4 w-40 bg-gray-800" />
      </div>
    </div>
  </div>
);

export default PlaylistDetails;
