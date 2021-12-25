import React from 'react';
import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';

export const Sidebar = () => {
    const { data: session, status } = useSession();

    return (
        <div className="text-gray-500 p-10 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide">
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

                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
                <p className="cursor-pointer hover:text-white transition duration-150 ease-in">
                    Playlist name...
                </p>
            </div>
        </div>
    );
};
