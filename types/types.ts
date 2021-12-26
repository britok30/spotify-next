export interface Tracks {
    added_at: string;
    added_by: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        type: string;
        url: string;
    };
    is_local: boolean;
    primary_color: string | null;
    track: Track;
    video_thumbnail: { url?: string | null };
}

export interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: { isrc: string };
    external_urls: { spotify: string };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
}

export interface Artist {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: AlbumImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    url: string;
}

export interface AlbumImage {
    height: number;
    url: string;
    width: number;
}
