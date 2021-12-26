import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';

const Player = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrack] =
        useRecoilState(currentTrackIdState);

    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState<number>(50);

    return (
        <div className="w-full flex justify-between items-center">
            <div>
                <img src="" alt="" />
            </div>
        </div>
    );
};

export default Player;
