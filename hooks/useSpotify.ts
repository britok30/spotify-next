// hooks/useSpotify.ts

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { SpotifyApi, AccessToken } from "@spotify/web-api-ts-sdk";

const useSpotify = () => {
  const { user, isLoaded } = useUser();
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastTokenFetch, setLastTokenFetch] = useState<number>(0);

  // Check if user has Spotify connected via Clerk
  const hasSpotifyConnected = user?.externalAccounts.some(
    (account) => account.provider === "spotify"
  );

  // Token refresh function
  const refreshToken = useCallback(async () => {
    const now = Date.now();

    // Only fetch token if we haven't fetched one in the last 30 seconds
    if (now - lastTokenFetch < 30000) {
      return spotifyApi;
    }

    try {
      const tokenResponse = await fetch("/api/spotify/token");

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        const accessToken: AccessToken = {
          access_token: tokenData.access_token,
          token_type: "Bearer",
          expires_in: tokenData.expires_in || 3600,
          refresh_token: "",
        };

        const api = SpotifyApi.withAccessToken(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
          accessToken
        );

        setSpotifyApi(api);
        setIsAuthenticated(true);
        setLastTokenFetch(now);
        console.log("✅ Spotify token refreshed");
        return api;
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("Error refreshing Spotify token:", error);
      setIsAuthenticated(false);
      setSpotifyApi(null);
      return null;
    }
  }, [spotifyApi, lastTokenFetch]);

  // Initialize Spotify
  useEffect(() => {
    const initializeSpotify = async () => {
      if (!isLoaded || !user || !hasSpotifyConnected) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        await refreshToken();
      } catch (error) {
        console.error("Error initializing Spotify SDK:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSpotify();
  }, [user, isLoaded, hasSpotifyConnected, refreshToken]);

  // Enhanced API wrapper with automatic token refresh
  const makeSpotifyRequest = useCallback(
    async <T>(
      apiCall: (api: SpotifyApi) => Promise<T>,
      retryCount = 0
    ): Promise<T | null> => {
      if (!spotifyApi) {
        console.log("No Spotify API instance, attempting to refresh token");
        const newApi = await refreshToken();
        if (!newApi) return null;
        return makeSpotifyRequest(apiCall, retryCount);
      }

      try {
        console.log("Making Spotify API request, retry count:", retryCount);
        const result = await apiCall(spotifyApi);
        console.log("Spotify API request successful");
        return result;
      } catch (error: any) {
        console.error("Spotify API error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack?.split("\n").slice(0, 3), // First 3 lines of stack
        });

        // Handle JSON parsing errors (token likely expired)
        if (
          error.message?.includes("not valid JSON") ||
          error.message?.includes("Unexpected token") ||
          error.name === "SyntaxError"
        ) {
          console.log("JSON parsing error detected, likely token issue");
          if (retryCount < 1) {
            console.log("Attempting token refresh for JSON error...");
            const newApi = await refreshToken();
            if (newApi) {
              console.log("Token refreshed, retrying API call");
              return makeSpotifyRequest(apiCall, retryCount + 1);
            }
          }
          console.log("Max retries reached for JSON parsing error");
          return null;
        }

        // Handle rate limiting
        if (error.status === 429) {
          const retryAfter = error.headers?.["retry-after"] || 1;
          console.log(
            `Rate limited, waiting ${retryAfter} seconds before retry`
          );

          if (retryCount < 2) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfter * 1000)
            );
            return makeSpotifyRequest(apiCall, retryCount + 1);
          } else {
            console.log("Max retries reached for rate limit");
            return null;
          }
        }

        // Handle token expiration
        if (error.status === 401) {
          console.log("Token expired (401), attempting to refresh");
          if (retryCount < 1) {
            const newApi = await refreshToken();
            if (newApi) {
              console.log("Token refreshed for 401, retrying API call");
              return makeSpotifyRequest(apiCall, retryCount + 1);
            }
          }
          console.log("Max retries reached for token refresh");
          return null;
        }

        // Handle other HTTP errors
        if (error.status >= 400 && error.status < 500) {
          console.log(
            `Client error ${error.status}, not retrying:`,
            error.message
          );
          return null;
        }

        // Handle network errors
        if (error.name === "NetworkError" || error.name === "TypeError") {
          console.log("Network error detected:", error.message);
          if (retryCount < 1) {
            console.log("Retrying network request...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return makeSpotifyRequest(apiCall, retryCount + 1);
          }
        }

        // Log unknown errors and return null instead of throwing
        console.log("Unknown error, returning null:", error);
        return null;
      }
    },
    [spotifyApi, refreshToken]
  );

  const connectSpotify = () => {
    // Redirect to sign-in or show user profile to connect Spotify
    alert("Please connect your Spotify account through your user profile");
  };

  return {
    spotifyApi,
    isAuthenticated,
    isLoading,
    hasSpotifyConnected: !!hasSpotifyConnected,
    connectSpotify,
    refreshToken,
    makeSpotifyRequest,
  };
};

export default useSpotify;
