// contexts/SpotifyContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import useSpotify from "../hooks/useSpotify";
import type {
  Playlist,
  SimplifiedPlaylist,
  Track,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";

interface SpotifyContextType {
  // Spotify API
  spotifyApi: SpotifyApi | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectSpotify: () => void;

  // Device Management
  activeDeviceId: string | null;
  getActiveDevice: () => Promise<string | null>;

  // Current Track State
  currentTrack: Track | null;
  currentTrackId: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "track" | "context";

  // Playlist State
  currentPlaylist: Playlist | null;
  currentPlaylistId: string;
  userPlaylists: SimplifiedPlaylist[];

  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setCurrentTrackId: (id: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeat: (repeat: "off" | "track" | "context") => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  setCurrentPlaylistId: (id: string) => void;
  setUserPlaylists: (playlists: SimplifiedPlaylist[]) => void;

  // Fetch functions
  fetchCurrentTrack: () => Promise<void>;
  refreshToken: () => Promise<SpotifyApi | null>;
  makeSpotifyRequest: <T>(
    apiCall: (api: SpotifyApi) => Promise<T>
  ) => Promise<T | null>;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    spotifyApi,
    isAuthenticated,
    isLoading,
    connectSpotify,
    refreshToken,
    makeSpotifyRequest,
  } = useSpotify();

  // Device Management
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [deviceLastChecked, setDeviceLastChecked] = useState<number>(0);

  // Current Track State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "track" | "context">("off");

  // Playlist State
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string>("");
  const [userPlaylists, setUserPlaylists] = useState<SimplifiedPlaylist[]>([]);

  // Rate limiting state
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  const API_DELAY = 1000; // 1 second between API calls

  // Centralized device management
  const getActiveDevice = useCallback(async () => {
    const now = Date.now();

    // Use cached device if checked within last 60 seconds
    if (activeDeviceId && now - deviceLastChecked < 60000) {
      return activeDeviceId;
    }

    if (!spotifyApi) return null;

    try {
      // Use makeSpotifyRequest for automatic error handling
      const devices = await makeSpotifyRequest((api) =>
        api.player.getAvailableDevices()
      );
      if (!devices) return null;

      const active = devices.devices.find((device: any) => device.is_active);

      if (active?.id) {
        setActiveDeviceId(active.id);
        setDeviceLastChecked(now);
        return active.id;
      }

      if (devices.devices.length > 0 && devices.devices[0].id) {
        setActiveDeviceId(devices.devices[0].id);
        setDeviceLastChecked(now);
        return devices.devices[0].id;
      }

      return null;
    } catch (error) {
      console.error("Error getting devices:", error);
      return null;
    }
  }, [spotifyApi, activeDeviceId, deviceLastChecked, makeSpotifyRequest]);

  // Rate-limited API call wrapper
  const makeRateLimitedApiCall = useCallback(
    async (apiFunction: () => Promise<any>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastApiCall;

      if (timeSinceLastCall < API_DELAY) {
        await new Promise((resolve) =>
          setTimeout(resolve, API_DELAY - timeSinceLastCall)
        );
      }

      setLastApiCall(Date.now());
      return await apiFunction();
    },
    [lastApiCall]
  );

  // Enhanced fetch current track with error handling
  const fetchCurrentTrack = useCallback(async () => {
    if (!spotifyApi || !isAuthenticated) return;

    try {
      const playbackState = await makeSpotifyRequest((api) =>
        api.player.getCurrentlyPlayingTrack()
      );

      if (
        playbackState &&
        playbackState.item &&
        playbackState.item.type === "track"
      ) {
        const track = playbackState.item;
        setCurrentTrackId(track.id);
        setCurrentTrack(track as Track);
        setProgress(playbackState.progress_ms || 0);
        setDuration(track.duration_ms);
        setIsPlaying(playbackState.is_playing);
      } else {
        // Nothing playing
        setCurrentTrackId(null);
        setCurrentTrack(null);
        setProgress(0);
        setDuration(0);
        setIsPlaying(false);
      }

      // Get additional playback info
      const playerState = await makeSpotifyRequest((api) =>
        api.player.getPlaybackState()
      );

      if (playerState) {
        setVolume(playerState.device?.volume_percent || 50);
        setShuffle(playerState.shuffle_state);
        setRepeat(playerState.repeat_state as "off" | "track" | "context");
      }
    } catch (error) {
      console.error("Error fetching current track:", error);
      // Don't reset state on error to prevent UI flicker
    }
  }, [spotifyApi, isAuthenticated, makeSpotifyRequest]);

  // Auto-fetch current track when authenticated
  useEffect(() => {
    if (isAuthenticated && spotifyApi) {
      fetchCurrentTrack();
    }
  }, [isAuthenticated, spotifyApi, fetchCurrentTrack]);

  // Polling for real-time updates when playing (less frequent to avoid rate limits)
  useEffect(() => {
    if (!isPlaying || !isAuthenticated) return;

    const interval = setInterval(fetchCurrentTrack, 10000); // Increased to 10 seconds
    return () => clearInterval(interval);
  }, [isPlaying, isAuthenticated, fetchCurrentTrack]);

  // Progress tracking when playing
  useEffect(() => {
    if (!isPlaying || !duration) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1000;
        return newProgress >= duration ? duration : newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Clear current playlist when ID changes
  useEffect(() => {
    if (currentPlaylistId) {
      setCurrentPlaylist(null);
    }
  }, [currentPlaylistId]);

  // Initialize device on authentication
  useEffect(() => {
    if (isAuthenticated && spotifyApi) {
      getActiveDevice();
    }
  }, [isAuthenticated, spotifyApi, getActiveDevice]);

  const value: SpotifyContextType = {
    // Spotify API
    spotifyApi,
    isAuthenticated,
    isLoading,
    connectSpotify,

    // Device Management
    activeDeviceId,
    getActiveDevice,

    // Current Track State
    currentTrack,
    currentTrackId,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,

    // Playlist State
    currentPlaylist,
    currentPlaylistId,
    userPlaylists,

    // Actions
    setCurrentTrack,
    setCurrentTrackId,
    setIsPlaying,
    setProgress,
    setDuration,
    setVolume,
    setShuffle,
    setRepeat,
    setCurrentPlaylist,
    setCurrentPlaylistId,
    setUserPlaylists,

    // Fetch functions
    fetchCurrentTrack,
    refreshToken,
    makeSpotifyRequest,
  };

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotifyContext must be used within a SpotifyProvider");
  }
  return context;
};
