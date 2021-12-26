import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import { Tracks } from '../types/types';
import Song from './Song';

const Songs = () => {
    const playlist = useRecoilValue(playlistState);
    console.log(playlist);
    return (
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
            {playlist?.tracks.items.map((tracks: Tracks, i: number) => {
                const { track } = tracks;

                return <Song key={track.id} track={track} order={i} />;
            })}
        </div>
    );
};

export default Songs;
