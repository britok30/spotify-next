// lib/spotify-token.ts

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getSpotifyAccessToken(): Promise<string> {
  // Get the current user ID using Clerk's auth object
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Call the Clerk API to get the user's OAuth access tokens
    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(
      userId,
      "spotify"
    );

    // Extract token from the response
    const accessToken = clerkResponse.data[0]?.token;

    if (!accessToken) {
      throw new Error("No Spotify access token found");
    }

    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    throw new Error("Failed to retrieve Spotify token");
  }
}
