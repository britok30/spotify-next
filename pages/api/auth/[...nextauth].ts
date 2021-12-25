import NextAuth, { Account, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

interface NextAuth {
    token: JWT;
    account: Account;
    user: User;
}

const refreshAccessToken = async (token: any) => {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };
    } catch (e) {
        console.log(e);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
};

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }: NextAuth) {
            // initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has expired, so we refresh it
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            //@ts-ignore
            session.user.accessToken = token.accessToken;
            //@ts-ignore
            session.user.refreshToken = token.refreshToken;
            //@ts-ignore
            session.user.username = token.username;

            return session;
        },
    },
});
