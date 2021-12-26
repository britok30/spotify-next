import { HeartIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] =
        useRecoilState(currentTrackIdState);

    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState<number>(50);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentIdTrack(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session]);

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 flex items-center grid grid-cols-3 text-xs px-2 md:px-8 text-white">
            <div className="flex items-center space-x-4">
                <img
                    className="hidden md:inline h-16 w-16 rounded"
                    src={songInfo?.album?.images?.[0]?.url}
                    alt="song-album-art"
                />
                <div>
                    <h3 className="text-sm">{songInfo?.name}</h3>
                    <p className="text-gray-500">
                        {songInfo?.artists?.[0]?.name}
                    </p>
                </div>
                <HeartIcon className="h-5 w-5" />
            </div>
        </div>
    );
};

export default Player;
