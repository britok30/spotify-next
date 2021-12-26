import React from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';
import { Track } from '../types/types';

const Song = ({ order, track }: { order: number; track: Track }) => {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.uri],
        });
    };
    console.log('track uri', track.uri);
    return (
        <div
            className="grid grid-cols-2 text-gray-500 hover:bg-gray-900 rounded-lg transition duration-150 ease-in py-4 px-5 cursor-pointer"
            onClick={playSong}
        >
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img
                    className="h-10 w-10 rounded"
                    src={track.album.images[0].url}
                    alt="track-img"
                />
                <div className="text-sm">
                    <p className="w-36 lg:w-64 truncate text-white">
                        {track.name}
                    </p>
                    <p className="w-40">{track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0  text-sm">
                <p className="w-40 hidden md:inline">{track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
            </div>
        </div>
    );
};

export default Song;
