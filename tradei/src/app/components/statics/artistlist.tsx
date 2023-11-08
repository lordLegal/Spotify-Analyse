"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import { options } from "../../api/auth/[...nextauth]/options";
import Link from "next/link";
import { VscLinkExternal } from "react-icons/vsc";
import {FaSpotify} from 'react-icons/fa'


export default async function Artistlist(artist_time_range = 'short_term' as any) {
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
    const artist_url = 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=' + artist_time_range.artist_time_range
    const topArtists_res = await fetch(artist_url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_user?.access_token}`
        }
    })
    const topArtists = await topArtists_res.json();

    function getUniqueGenres(topArtists: { items?: { genres: string[] }[] }) {
        const top_genres = topArtists?.items?.map((artist: any) => artist.genres).flat();
        return Array.from(new Set(top_genres?.flat()));
    }

    const genres = getUniqueGenres(topArtists)
    genres.splice(5)





    return (
        <>

            <h2 className="text-4xl font-bold py-8" id="artist" >Top Artists</h2>
            <div className=" flex flex-row justify-center items-center space-r-4">
                <form className="flex flex-row justify-center items-center space-x-4">
                    <input type="hidden" name="artist_time_range" value="short_term" />

                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >4 Wochen</button>
                </form>
                <form className="flex flex-row justify-center items-center space-x-4">
                    <input type="hidden" name="artist_time_range" value="medium_term" />

                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >6 Monate</button>
                </form>
                <form className="flex flex-row justify-center items-center space-x-4">
                    <input type="hidden" name="artist_time_range" value="long_term" />

                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" >1 Jahr</button>
                </form>
            </div>

            <div className="max-w-3xl mx-auto pt-4 text-xl overflow-y-auto">
                <table className="w-full bg-zinc-900 border border-zinc-900 rounded-lg overflow-hidden">
                    <thead className="bg-zinc-950 text-gray-600">
                        <tr>
                            <th className="py-2 px-4 text-green-500 text-2xl">#</th>
                            <th className="py-2 px-4 text-green-500 text-2xl">Image</th>
                            <th className="py-2 px-4 text-green-500 text-2xl">Artist</th>
                            <th className="py-2 px-4 text-green-500 text-2xl">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topArtists?.items?.map((artist: any, index: number) => (
                            <tr className="border-b border-zinc-900 text-white " key={index}>
                                <td className="py-2 px-4 text-center">{index + 1}</td>
                                <td className="py-2 px-4"><Image className="w-16 h-16 object-cover rounded-full" width='1000' height='1000' alt={artist.name} src={artist.images[0].url}></Image></td>
                                <td className="py-2 px-4">{artist.name}</td>
                                <td className="py-2 px-4 text-xs md:text-xl"><Link href={artist.external_urls.spotify}> <FaSpotify className="fill-green-500" ></FaSpotify> Open with Spotify <VscLinkExternal className="fill-green-500"></VscLinkExternal></Link></td>
                            </tr>
                        ))}

                    </tbody>

                </table>




            </div>

            <h2 className="text-4xl font-bold py-8">Top Genres</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto" >
                {genres.map((genre, index) => (
                    <div className=" bg-zinc-900 text-white hover:text-green-500  p-2 ml-4 rounded shadow-md" key={index}>
                        {genre}
                    </div>
                ))}
            </div>
        </>
    )
}


