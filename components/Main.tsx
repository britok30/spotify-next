import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import LogoutMenu from './LogoutMenu';
import useComponentVisible from '../hooks/useComponentVisible';
import { Session } from 'next-auth';

const Main = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState<string | null>(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const { ref, isComponentVisible, setIsComponentVisible } =
        useComponentVisible(false);

    const colors: string[] = [
        'from-indigo-500',
        'from-slate-500',
        'from-gray-500',
        'from-zinc-500',
        'from-blue-500',
        'from-red-500',
        'from-pink-500',
        'from-purple-500',
        'from-green-500',
        'from-neutral-500',
        'from-stone-500',
        'from-orange-500',
        'from-amber-500',
        'from-yellow-500',
        'from-lime-500',
        'from-emerald-500',
        'from-teal-500',
        'from-cyan-500',
        'from-sky-500',
        'from-violet-500',
        'from-fuchsia-500',
        'from-rose-500',
    ];

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi
                .getPlaylist(playlistId)
                .then((data) => {
                    const {
                        body,
                    }: { body: SpotifyApi.SinglePlaylistResponse } = data;
                    setPlaylist(body);
                })
                .catch((e: string) => console.log(e));
        }
    }, [spotifyApi, playlistId]);

    return (
        <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <UserTag
                    session={session}
                    setIsComponentVisible={setIsComponentVisible}
                />
                {isComponentVisible && <LogoutMenu ref={ref} />}
            </header>

            <section
                className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}
            >
                <PlaylistDetails playlist={playlist} session={session} />
            </section>

            <div>
                <Songs />
            </div>
        </div>
    );
};

export default Main;

const UserTag = ({
    session,
    setIsComponentVisible,
}: {
    session: Session;
    setIsComponentVisible: (value: boolean) => void;
}) => {
    return (
        <div
            className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 transition duration-150 ease-in cursor-pointer rounded-full p-1 pr-2"
            onClick={() => setIsComponentVisible(true)}
        >
            <img
                className="rounded-full w-10 h-10"
                src={session?.user.image}
                alt="profile image"
            />

            <h2>{session?.user.name}</h2>
            <ChevronDownIcon className="w-5 h-5" />
        </div>
    );
};

const PlaylistDetails = ({
    playlist,
    session,
}: {
    playlist: SpotifyApi.SinglePlaylistResponse;
    session: Session;
}) => {
    return (
        <>
            <img
                className="h-44 w-44 shadow-2xl rounded-lg object-cover"
                src={playlist?.images?.[0]?.url}
                alt="playlist-art"
            />

            <div>
                <p className="text-sm m-0">PLAYLIST</p>
                <h1 className="font-bold text-2xl md:text-3xl lg:text-6xl my-4">
                    {playlist?.name}
                </h1>
                <div className="flex items-center">
                    <img
                        className="rounded-full w-5 h-5 mr-2"
                        src={session?.user.image}
                        alt="profile image"
                    />
                    <span className="text-xs">{session?.user.name}</span>
                </div>
            </div>
        </>
    );
};
