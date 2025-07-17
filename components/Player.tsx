"use client";

import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import {
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useSpotifyContext } from "@/contexts/SpotifyContext";

const Player = () => {
  const {
    spotifyApi,
    isAuthenticated,
    connectSpotify,
    currentTrack,
    currentTrackId,
    isPlaying,
    setIsPlaying,
    volume,
    shuffle,
    repeat,
    progress,
    setProgress,
    duration,
    setVolume,
    fetchCurrentTrack,
    getActiveDevice,
    makeSpotifyRequest,
  } = useSpotifyContext();

  // Local state for volume control and like status
  const [localVolume, setLocalVolume] = useState(volume);
  const [isLiked, setIsLiked] = useState(false);
  const [isSeekingActive, setIsSeekingActive] = useState(false);

  // Sync local volume with context volume
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  // Only check like status when track changes, with debouncing
  const checkIfTrackIsLiked = useCallback(
    debounce(async (trackId: string) => {
      if (!spotifyApi || !trackId) return;

      try {
        const saved = await makeSpotifyRequest((api) =>
          api.currentUser.tracks.hasSavedTracks([trackId])
        );
        setIsLiked(saved?.[0] || false);
      } catch (error) {
        console.error("Error checking if track is liked:", error);
        setIsLiked(false);
      }
    }, 1000),
    [spotifyApi, makeSpotifyRequest]
  );

  useEffect(() => {
    if (isAuthenticated && currentTrackId) {
      checkIfTrackIsLiked(currentTrackId);
    }
  }, [currentTrackId, isAuthenticated, checkIfTrackIsLiked]);

  // Debounced volume adjustment using context device
  const debouncedAdjustVolume = useCallback(
    debounce(async (vol: number) => {
      if (!spotifyApi) return;

      const deviceId = await getActiveDevice();
      if (!deviceId) return;

      try {
        await makeSpotifyRequest((api) =>
          api.player.setPlaybackVolume(vol, deviceId)
        );
        setVolume(vol);
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    }, 300),
    [spotifyApi, getActiveDevice, setVolume, makeSpotifyRequest]
  );

  useEffect(() => {
    if (localVolume >= 0 && localVolume <= 100 && isAuthenticated) {
      debouncedAdjustVolume(localVolume);
    }
  }, [localVolume, debouncedAdjustVolume, isAuthenticated]);

  // Optimized player controls with immediate UI feedback
  const handlePlayPause = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) {
      alert("No active Spotify device found. Please open Spotify on a device.");
      return;
    }

    // Immediate UI feedback
    setIsPlaying(!isPlaying);

    try {
      if (isPlaying) {
        await makeSpotifyRequest((api) => api.player.pausePlayback(deviceId));
      } else {
        await makeSpotifyRequest((api) =>
          api.player.startResumePlayback(deviceId)
        );
      }

      // Only fetch current track after a longer delay to let Spotify update
      setTimeout(fetchCurrentTrack, 1000);
    } catch (error) {
      console.error("Error toggling playback:", error);
      // Revert UI state if API call failed
      setIsPlaying(isPlaying);
    }
  };

  const handlePrevious = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    try {
      await makeSpotifyRequest((api) => api.player.skipToPrevious(deviceId));
      // Longer delay for skip actions
      setTimeout(fetchCurrentTrack, 1500);
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  };

  const handleNext = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    try {
      await makeSpotifyRequest((api) => api.player.skipToNext(deviceId));
      // Longer delay for skip actions
      setTimeout(fetchCurrentTrack, 1500);
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  };

  const handleShuffle = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    try {
      await makeSpotifyRequest((api) =>
        api.player.togglePlaybackShuffle(!shuffle, deviceId)
      );
      setTimeout(fetchCurrentTrack, 1000);
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  };

  const handleRepeat = async () => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    const nextRepeat =
      repeat === "off" ? "context" : repeat === "context" ? "track" : "off";

    try {
      await makeSpotifyRequest((api) =>
        api.player.setRepeatMode(nextRepeat, deviceId)
      );
      setTimeout(fetchCurrentTrack, 1000);
    } catch (error) {
      console.error("Error setting repeat:", error);
    }
  };

  const handleLike = async () => {
    if (!spotifyApi || !currentTrackId) return;

    // Immediate UI feedback
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      if (isLiked) {
        await makeSpotifyRequest((api) =>
          api.currentUser.tracks.removeSavedTracks([currentTrackId])
        );
      } else {
        await makeSpotifyRequest((api) =>
          api.currentUser.tracks.saveTracks([currentTrackId])
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert UI state if API call failed
      setIsLiked(isLiked);
    }
  };

  // Optimized seek handling with immediate feedback
  const handleSeekChange = (value: number[]) => {
    setProgress(value[0]); // Immediate UI feedback
  };

  const handleSeekEnd = async (value: number[]) => {
    if (!spotifyApi) return;

    const deviceId = await getActiveDevice();
    if (!deviceId) return;

    setIsSeekingActive(true);

    try {
      await makeSpotifyRequest((api) =>
        api.player.seekToPosition(value[0], deviceId)
      );
      setTimeout(() => {
        setIsSeekingActive(false);
        fetchCurrentTrack();
      }, 500);
    } catch (error) {
      console.error("Error seeking:", error);
      setIsSeekingActive(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (localVolume === 0) return VolumeX;
    if (localVolume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  // Show authentication prompt if Spotify not connected
  if (!isAuthenticated) {
    return (
      <div className="h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 md:px-8">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Button
              onClick={connectSpotify}
              className="bg-[#18D860] hover:bg-[#109643] text-black font-semibold mb-2"
            >
              Connect Spotify Account
            </Button>
            <p className="text-gray-400 text-xs">
              Connect your Spotify account to control music playback
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 md:px-8">
      <div className="grid grid-cols-3 h-full items-center">
        {/* Currently Playing Track */}
        <div className="flex items-center space-x-4 min-w-0">
          {currentTrack && (
            <>
              <div className="hidden md:block">
                <img
                  className="h-14 w-14 rounded-md object-cover"
                  src={currentTrack.album?.images?.[0]?.url}
                  alt={`${currentTrack.name} album cover`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white text-sm font-medium truncate">
                  {currentTrack.name}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artists
                    ?.map((artist) => artist.name)
                    .join(", ")}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "hidden md:flex h-8 w-8 transition-colors",
                  isLiked ? "text-[#18D860]" : "text-gray-400 hover:text-white"
                )}
                onClick={handleLike}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
            </>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 text-gray-400 hover:text-white transition-colors",
                shuffle && "text-[#18D860]"
              )}
              onClick={handleShuffle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-white transition-colors"
              onClick={handlePrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 bg-white hover:bg-gray-200 text-black rounded-full transition-all hover:scale-105"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-white transition-colors"
              onClick={handleNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 text-gray-400 hover:text-white transition-colors",
                repeat !== "off" && "text-[#18D860]"
              )}
              onClick={handleRepeat}
            >
              <Repeat className="h-4 w-4" />
              {repeat === "track" && (
                <span className="absolute text-[10px] font-bold">1</span>
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          {currentTrack && (
            <div className="hidden md:flex items-center space-x-2 w-full max-w-md">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(progress)}
              </span>
              <Slider
                value={[progress]}
                max={duration}
                step={1000}
                className="flex-1"
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekEnd}
              />
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-white transition-colors"
            onClick={() => setLocalVolume(localVolume === 0 ? 50 : 0)}
          >
            <VolumeIcon className="h-4 w-4" />
          </Button>
          <div className="hidden md:block w-24">
            <Slider
              value={[localVolume]}
              max={100}
              step={1}
              onValueChange={([value]) => setLocalVolume(value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
