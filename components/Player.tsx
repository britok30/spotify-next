import {
    HeartIcon,
    SwitchHorizontalIcon,
    VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
    PlayIcon,
    PauseIcon,
    RewindIcon,
    ReplyIcon,
    FastForwardIcon,
    VolumeUpIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] =
        useRecoilState(currentTrackIdState);

    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState<number>(50);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);

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

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    });

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };

    const debouncedAdjustVolume = useCallback(
        debounce((volume: number) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500),
        [volume]
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 items-center grid grid-cols-3 text-xs px-2 md:px-8 text-white">
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

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="player-button" />
                <RewindIcon className="player-button" />
                {isPlaying ? (
                    <PauseIcon
                        onClick={handlePlayPause}
                        className="playpause-button w-14 h-14"
                    />
                ) : (
                    <PlayIcon
                        onClick={handlePlayPause}
                        className="playpause-button w-14 h-14"
                    />
                )}

                <FastForwardIcon className="player-button" />
                <ReplyIcon className="player-button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end">
                <VolumeDownIcon
                    className="player-button"
                    onClick={() => volume > 0 && setVolume(volume - 10)}
                />
                <input
                    className="w-14 md:w-28"
                    type="range"
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setVolume(Number(e.target.value))
                    }
                />
                <VolumeUpIcon
                    className="player-button"
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                />
            </div>
        </div>
    );
};

export default Player;
