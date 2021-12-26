import {
    ArrowCircleDownIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
    PauseIcon,
    PlayIcon,
} from '@heroicons/react/outline';
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
import { isPlayingState } from '../atoms/songAtom';
import UserTag from './UserTag';
import PlaylistDetails from './PlaylistDetails';

const Main = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState<string | null>(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const { ref, isComponentVisible, setIsComponentVisible } =
        useComponentVisible(false);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

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
    console.log('playlist ', playlist);

    const playPlaylist = () => {
        setIsPlaying(true);
        spotifyApi.play({
            context_uri: playlist.uri,
        });
    };

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

            <div className="hidden md:flex md:items-center space-x-8 px-7 mb-5">
                <div
                    className="bg-green-500 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer hover:scale-105 transition duration-150 ease-in"
                    onClick={playPlaylist}
                >
                    {isPlaying ? (
                        <PauseIcon className="h-10 w-10" />
                    ) : (
                        <PlayIcon className="h-10 w-10" />
                    )}
                </div>

                <ArrowCircleDownIcon className="h-10 w-10 cursor-pointer hover:scale-105 transition duration-150 ease-in" />
                <DotsHorizontalIcon className="h-10 w-10 cursor-pointer hover:scale-105 transition duration-150 ease-in" />
            </div>
            <div>
                <Songs />
            </div>
        </div>
    );
};

export default Main;
