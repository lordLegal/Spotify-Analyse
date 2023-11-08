"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import { options } from "@/app/api/auth/[...nextauth]/options"
import { FaExchangeAlt } from 'react-icons/fa'




export default async function Portfolio({
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

    const investedArtists = await prisma.investArtist.findMany({
        where: {
            userId: user?.id
        }
    })



    const artists = await Promise.all(investedArtists.map(async (investedArtist) => {
        const artist = await prisma.artist.findFirst({
            where: {
                id: investedArtist.artistId
            }
        })
        return artist
    }))



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


            <h1 className="text-5xl font-bold text-white mt-4">Portfolio</h1>
            <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-24 w-24 rounded-full"></Image>
            <p className="font-bold text-3xl">{session?.user?.name}</p>
            <p className=" text-xl" >Coins: <span className="font-bold">{coins}</span></p>
            <h3 className="text-3xl font-bold text-white mt-4">Invested Artists</h3>
            {artists?.length === 0 && <p className="text-white">You have not invested in any artists yet. Invest here in an Artist:  <Link className="text-green-600" href="/trade">Trade!!!</Link></p>}
            <div className="grid grid-cols-1 gap-4">
                {artists?.map((artist: any, index: number) => (

                    <div className="flex-none  border-2 border-green-700 rounded-lg p-4 space-y-2 max-w-3xl" key={index}>
                        <table>
                            <tbody>
                                <tr>
                                    <th className="w-48">
                                        <Image
                                            width='1000'
                                            height='1000'
                                            src={artist?.image}
                                            alt="Artist Profile"
                                            className="rounded-full w-32 h-32 mx-auto"
                                        />
                                        <h2 className="text-center">{artist?.name}</h2>
                                        <Link href={"/trade/" + artist?.spotify_id} className=" flex flex-row items-center ml-4 pl-9  bg-green-500 text-white text-center py-2 rounded"><FaExchangeAlt className="mr-2" ></FaExchangeAlt> TRADE</Link>
                                    </th>
                                    <td>
                                        <p className="text-center">Coins Invested: {investedArtists[index].investedCoins}</p>
                                        <p className="text-center">Coins Earned: {investedArtists[index].plusCoins}</p>
                                        <p className="text-center">Coins all: {investedArtists[index].coins}</p>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    )
}