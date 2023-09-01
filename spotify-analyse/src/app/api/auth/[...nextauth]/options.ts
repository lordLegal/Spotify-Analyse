import { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { PrismaClient } from "@prisma/client"
import internal from "stream"

export const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: "https://accounts.spotify.com/authorize?scope=user-read-email%20user-read-private%20user-read-playback-state%20user-read-currently-playing%20user-modify-playback-state%20user-read-recently-played%20user-top-read",
        }),
    ],
    callbacks: {


        async jwt({ token, user, account, profile, isNewUser }) {
            console.log("jwt");


            const prisma = new PrismaClient();

            const profile_ = profile as any;

            try {
                const exist = await prisma.user.findMany({
                    where: {
                        spotify_id: account?.providerAccountId,
                    },
                });

                if (exist.length === 0) {
                    await prisma.user.create({
                        data: {
                            spotify_id: account?.providerAccountId,
                            email: profile?.email,
                            name: profile_?.display_name,
                            image: profile_?.images[0]?.url, // Added ?. for safer access
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: {
                            id: exist[0]?.id,
                        },
                        data: {
                            spotify_id: account?.providerAccountId,
                            email: profile?.email,
                            name: profile_?.display_name,
                            image: profile_?.images?.[profile_?.images.length - 1]?.url, // Fixed image index
                        },
                    });
                }

                const user_ = await prisma.user.findFirst({
                    where: {
                        spotify_id: account?.providerAccountId,
                    },
                });

                const api_user = await prisma.apiUser.findMany({
                    where: {
                        userId: user_?.id,
                    },
                });




                if (api_user.length === 0) {

                    await prisma.apiUser.create({
                        data: {
                            access_token: account?.access_token,
                            refreshtoken: account?.refresh_token,
                            expries_at: account?.expires_at,
                            scope: account?.scope,
                            user: {
                                connect: {
                                    id: user_?.id,
                                },
                            },
                        },
                    });
                } else {

                    const now = Math.floor(Date.now() / 1000);
                    const difference = Math.floor(((api_user[0]?.expries_at as number) - now) / 60);
                    const refreshToken = api_user[0]?.refreshtoken as string;
                    console.log(`Token still active for ${difference} minutes.`);

                    // If the token is older than 50 minutes, fetch a new one
                    if (difference <= 10) {
                        console.log("Token expired, fetching new one...");
                        const request = await fetch("https://accounts.spotify.com/api/token", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
                            },
                            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
                        });

                        if (request.ok) {
                            const response = await request.json();
                            const { access_token, expires_in, refresh_token } = response;

                            // Get the current timestamp in seconds
                            const nowInSeconds = Math.floor(Date.now() / 1000);

                            // Add 3600 seconds (1 hour) to the current timestamp
                            const time = nowInSeconds + expires_in;

                            await prisma.apiUser.update({
                                where: {
                                    id: api_user[0]?.id, // Added ?. for safer access
                                },
                                data: {
                                    access_token: access_token,
                                    refreshtoken: refresh_token ?? api_user[0]?.refreshtoken,
                                    expries_at: time,
                                },
                            });

                            token.accessToken = access_token;
                            token.refreshToken = refresh_token;
                            token.accessTokenExpires = time;
                        } else {
                            console.error(`Failed to refresh token: ${request.status} ${request.statusText}`);
                        }
                    }

                    await prisma.apiUser.update({
                        where: {
                            id: api_user[0]?.id, // Added ?. for safer access
                        },
                        data: {
                            access_token: account?.access_token,
                            refreshtoken: account?.refresh_token,
                            expries_at: account?.expires_at,
                            scope: account?.scope,
                        },
                    });
                }

                const trade_user = await prisma.tradeUser.findMany({
                    where: {
                        userId: user_?.id,
                    },
                });

                if (trade_user.length === 0) {
                    await prisma.tradeUser.create({
                        data: {
                            user: {
                                connect: {
                                    id: user_?.id,
                                },
                            },
                        },
                    });
                }



                // Do not disconnect the PrismaClient at this point, as it will be used for subsequent operations

                return token;
            } catch (error) {
                // Handle the error or log it, so it's not unhandled
                console.error(error);
                throw error; // Rethrow the error to be handled at a higher level
            }
        }

    },


}
