"use server";
import Link from "next/link"
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import '../css/home.css'
import Image from "next/image"
import { PrismaClient } from "@prisma/client"
import Artstlist from "../components/artistlist"
import { useSearchParams } from 'next/navigation'









export default async function Home({
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

    const api_user = await prisma.api_user.findFirst({
        where: {
            fk_id_user_api: user?.id_user
        }
    })

    // https://api.spotify.com/v1/me/top/artists
    const time_range = searchParams?.time_range || 'short_term'

    console.log(searchParams?.time_range)

    const url = 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=' + time_range
    const topArtists_res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_user?.access_token}`
        }
    })
    const topArtists = await topArtists_res.json();





    return (
        <>
            {session ? (

                <div className="flex flex-col justify-center items-center  ">

                    <h1 className="font-sans text-6xl font-bold p-3 pb-12">Hello {session?.user?.name}, here your Spotify Stats!</h1>
                    <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-24 w-24 rounded-full"></Image>
                    <p className="font-bold text-3xl">{session?.user?.name}</p>
                    <h2 className="text-4xl font-bold py-8" >Top Artists</h2>
                    <div className=" flex flex-row justify-center items-center space-x-4">
                        <form className="flex flex-row justify-center items-center space-x-4">
                            <input type="hidden" name="time_range" value="short_term" />

                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >Short Term</button>
                        </form>
                        <form className="flex flex-row justify-center items-center space-x-4">
                            <input type="hidden" name="time_range" value="medium_term" />

                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >medium Term</button>
                        </form>
                        <form className="flex flex-row justify-center items-center space-x-4">
                            <input type="hidden" name="time_range" value="long_term" />

                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >long Term</button>
                        </form>
                    </div>





                    <table className=" text-left table-auto w-auto text-2xl ">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th></th>
                                <th>Artist</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topArtists?.items?.map((artist: any, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="p-3"><Image className="h-16 w-16 rounded-full" width='1000' height='1000' alt={artist.name} src={artist.images[0].url}></Image></td>
                                    <td>{artist.name}</td>
                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>
            ) : (
                <div>

                    <h1 className="text-5xl">You Shall Not Pass!</h1>
                    <Link href="/api/auth/signin" >Login</Link>
                </div>
            )}
        </>
    )
}