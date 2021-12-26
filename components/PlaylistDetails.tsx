import { Session } from 'next-auth';
import React from 'react';

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
                {playlist?.description && (
                    <p
                        className="text-xs mb-4"
                        dangerouslySetInnerHTML={{
                            __html: playlist.description,
                        }}
                    ></p>
                )}
                <div className="flex items-center">
                    {playlist?.owner.display_name === session?.user.name && (
                        <img
                            className="rounded-full w-5 h-5 mr-2"
                            src={session?.user.image}
                            alt="profile image"
                        />
                    )}
                    <span className="text-xs mr-3">
                        {playlist?.owner.display_name}
                    </span>
                    <span className="text-xs">
                        {playlist?.tracks.items.length}{' '}
                        {playlist?.tracks.items.length > 1 ? 'songs' : 'song'}
                    </span>
                </div>
            </div>
        </>
    );
};

export default PlaylistDetails;
