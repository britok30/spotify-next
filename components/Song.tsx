import React from 'react';
import { millisToMinutesAndSeconds } from '../lib/time';
import { Track } from '../types/types';

const Song = ({ order, track }: { order: number; track: Track }) => {
    return (
        <div className="grid grid-cols-2">
            <div className="flex items-center space-x-4 space-y-4">
                <p>{order + 1}</p>
                <img
                    className="h-10 w-10 rounded"
                    src={track.album.images[0].url}
                    alt="track-img"
                />
                <div className="text-sm">
                    <p className="w-36 lg:w-64 truncate">{track.name}</p>
                    <p>{track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0  text-sm">
                <p className="hidden md:inline">{track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
            </div>
        </div>
    );
};

export default Song;
