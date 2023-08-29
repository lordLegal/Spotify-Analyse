"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { options } from "../api/auth/[...nextauth]/options";
import Sidebar from "../components/trade/sidebar";




export default async function Trade({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    "use server";


    const session = await getServerSession(options)

    const prisma = new PrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    const api_user = await prisma.apiUser.findFirst({
        where: {
            userId: user?.id
        }
    })

    const trade_user = await prisma.tradeUser.findFirst({
        where: {
            userId: user?.id
        }
    })
    function formatNumberWithDots(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const coins = formatNumberWithDots(trade_user?.coins || 0)


    const artist_url = 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term'
    const topArtists_res = await fetch(artist_url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_user?.access_token}`
        }
    })
    const topArtists = await topArtists_res.json();



    return (
        <>
            <h1 className="font-sans text-4xl font-bold p-3 pb-12">Hello {session?.user?.name}, you want to Trade your Spotify coins?</h1>
            <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-24 w-24 rounded-full"></Image>
            <p className="font-bold text-3xl">{session?.user?.name}</p>
            <p className=" text-xl" >Coins: <span className="font-bold">{coins}</span></p>
            <h2 className="text-4xl font-bold py-8" id="artist" >Invest in your Top Artits!</h2>
            <div className=" p-4 overflow-x-auto max-w-md md:max-w-lg">

                <div className="flex space-x-4">
                    {topArtists?.items?.map((artist: any, index: number) => (

                        <div className="flex-none  border-2 border-green-700 rounded-lg p-4 space-y-2 w-52" key={index}>
                            <Image
                                width='1000'
                                height='1000'
                                src={artist?.images[0]?.url}
                                alt="Artist Profile"
                                className="rounded-full w-32 h-32 mx-auto"
                            />
                            <h2 className="text-center">{artist?.name}</h2>
                            <Link href={"/trade/" + artist?.id} className="block bg-green-500 text-white text-center py-2 rounded">TRADE</Link>
                        </div>
                    ))}


                </div>
            </div>



        </>
    )
}