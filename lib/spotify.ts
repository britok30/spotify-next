import SpotifyWebApi from 'spotify-web-api-node';

const scopes: string = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-state',
    'user-read-currently-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read',
].join(',');

const params = {
    scope: scopes,
};

const queryParamString: URLSearchParams = new URLSearchParams(params);
const LOGIN_URL: string = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi: SpotifyWebApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
