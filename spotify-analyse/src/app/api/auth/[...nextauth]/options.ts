import NextAuth, { NextAuthOptions } from "next-auth"
import spotify from "next-auth/providers/spotify"

export const options: NextAuthOptions = {
    providers: [
        spotify({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
        }),
    ],

}
