"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Buttons from "@/app/components/trade/buttons";
import { IoMdArrowRoundBack } from 'react-icons/io'
import { env } from "process";
import ArtistChart from "@/app/components/trade/artistChart";




export default async function Trade({
    params,
    searchParams,
}: {
    params: {
        artist_id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    "use server";

    console.log(params?.artist_id as string)
    console.log(searchParams)

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


    const artist_url = 'https://api.spotify.com/v1/artists/' + params?.artist_id as string
    console.log(artist_url)
    const artist_res = await fetch(artist_url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_user?.access_token}`
        }
    })

    const artist = await artist_res?.json();
    const artist_mothly_listeners_url = env.API_URL + params?.artist_id as string
    const artist_mothly_listeners_res = await fetch(artist_mothly_listeners_url, {
        method: 'GET',
    })


    const artist_mothly_listeners = await artist_mothly_listeners_res?.json();
    const monthly = formatNumberWithDots(artist_mothly_listeners.monthly);

    console.log(monthly)

    const dbartist = await prisma.artist.findMany({
        where: {
            spotify_id: params?.artist_id as string,
        },
    });



    if (dbartist.length === 0 && artist !== undefined && user !== undefined) {
        await prisma.artist.create({
            data: {
                spotify_id: params?.artist_id as string,
                name: artist?.name,
                image: artist?.images[0].url,
            },
        });
    }

    const artistData = await prisma.artistData.findMany({
        where: {
            artistId: dbartist[0]?.spotify_id as string,
        },
    });
    var monthly_listeners = []
    var date = []
    const artistDataLength = artistData.length
    for (let i = 0; i < artistData.length; i++) {
        
        monthly_listeners.push(artistData[i].monthly_listeners)
        date.push(artistData[i].date)

    }

    const artistDatalist = {
        "monthly_listeners": monthly_listeners,
        "date": date,
        "artistDataLength": artistDataLength,
        "artist": artist?.name,
    } 
    



    return (
        <>
            <h1 className="font-sans text-4xl font-bold p-3 pb-12">Hello {session?.user?.name}, you want to Trade your Spotify coins?</h1>
            <Link href={"/trade"} style={{ marginLeft: "-24rem" }} className="felx bg-green-500 text-white text-center rounded p-2 mr-36"><IoMdArrowRoundBack></IoMdArrowRoundBack></Link>
            <h2 className="text-4xl font-bold py-8" id="artist" >Invest in </h2>

            <div className="flex flex-row justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                    <Image width='1000' height='1000' src={artist?.images[0]?.url} alt="Account" className="h-24 w-24 rounded-full"></Image>
                    <p className="font-bold text-3xl">{artist?.name}</p>
                    <p className=" text-xl" >Monthly Listeners: <span className="font-bold">{monthly}</span></p>
                </div>
            </div>
            <ArtistChart artistData={artistDatalist}></ArtistChart>

            <div className=" flex justify-center items-center ">
                    
                <div className="flex space-x-4">
                    <Buttons artist={params?.artist_id}></Buttons>
                </div>
            </div>
        </>
    )
}