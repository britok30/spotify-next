// app/api/spotify/token/route.ts

import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-token";

export async function GET() {
  try {
    const accessToken = await getSpotifyAccessToken();

    return NextResponse.json({
      access_token: accessToken,
      expires_in: 3600, // Clerk handles token refresh automatically
    });
  } catch (error) {
    console.error("Error in token endpoint:", error);

    if (error.message?.includes("User not authenticated")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message?.includes("No Spotify access token found")) {
      return NextResponse.json(
        {
          error:
            "Spotify account not connected. Please connect your Spotify account.",
          reconnect: true,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to retrieve Spotify token" },
      { status: 500 }
    );
  }
}
