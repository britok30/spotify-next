import React, { useEffect, useState } from 'react';

import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';

export const Sidebar = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState<
        SpotifyApi.PlaylistObjectSimplified[]
    >([]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                const { items } = data.body;
                setPlaylists(items);
            });
        }
    }, [session, spotifyApi]);

    if (playlists) {
        console.log(playlists);
    }

    return (
        <div className="text-gray-500 p-5 w-56 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide">
            <div className="space-y-4">
                <button
                    className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in"
                    onClick={() => signOut()}
                >
                    <p>Logout</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <HeartIcon className="h-5 w-5" />
                    <p>Liked songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition duration-150 ease-in">
                    <RssIcon className="h-5 w-5" />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />

                {playlists.map((playlist) => {
                    return (
                        <p
                            key={playlist.id}
                            className="cursor-pointer hover:text-white transition duration-150 ease-in"
                        >
                            {playlist.name}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};
