
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { options } from "../api/auth/[...nextauth]/options";
import Sidebar from "../components/trade/sidebar";
import { FaExchangeAlt } from 'react-icons/fa'
import { revalidatePath, revalidateTag } from "next/cache";


let artistResult: any = null;


export default async function Trade({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {





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



    const handleSearchArtist = async (formData: FormData) => {
        "use server";
        const artist_name = formData.get('artist') as string
        const artistSearch_url = `https://api.spotify.com/v1/search?q=${artist_name}&type=artist&limit=10`
        const artist_res = await fetch(artistSearch_url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${api_user?.access_token}`
            }
        })
        artistResult = await artist_res.json();
        revalidatePath('/trade')
    }



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
                            <Link href={"/trade/" + artist?.id} className=" flex flex-row items-center ml-4 pl-9  bg-green-500 text-white text-center py-2 rounded"><FaExchangeAlt className="mr-2" > </FaExchangeAlt> TRADE</Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-4xl font-bold py-8" id="artist" >Search a Artist!</h2>
                <form action={handleSearchArtist}>
                    <label className="text-xl font-bold">Artist:</label>
                    <input name="artist" type="text" className="text-black border-2 border-green-700 rounded-lg p-4 space-y-2 w-52" placeholder="Artist Name" />
                    <button className="bg-green-500 text-white text-center py-2 rounded">Search</button>
                </form>
                {artistResult === null ? '' :
                    <>
                        <h2 className="text-4xl font-bold py-8" id="artist" >Search Result:</h2>
                        <table className="w-full bg-zinc-900 border border-zinc-900 rounded-lg overflow-hidden text-left">
                            <thead className="bg-zinc-950 text-gray-600">
                                <tr>
                                    <th className="py-2 px-4 text-green-500 text-2xl">Image</th>
                                    <th className="py-2 px-4 text-green-500 text-2xl">Artist Name</th>
                                    <th className="py-2 px-4 text-green-500 text-2xl">Trade?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artistResult?.artists?.items?.map((artist: any, index: number) => (
                                    <tr className="border-b border-zinc-900" key={index}>
                                        <td className="py-2 px-4"><Image className="w-16 h-16 object-cover rounded-lg" width='1000' height='1000' alt={artist?.name} src={artist?.images[0]?.url}></Image></td>
                                        <td className="py-2 px-4 text-xs md:text-xl">{artist?.name}</td>
                                        <td className="px-2 py-4"><Link href={"/trade/" + artist?.id} className=" flex flex-col items-center text-center  bg-green-500 text-white py-2 rounded"><FaExchangeAlt className="mr-2" > </FaExchangeAlt> TRADE</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }







            </div>



        </>
    )
}