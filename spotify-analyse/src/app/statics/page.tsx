"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { options } from "../api/auth/[...nextauth]/options";
import Artistlist from "../components/statics/artistlist";
import Songlist from "../components/statics/songlist";
import Chart from "../components/statics/chart";



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

    const user = await prisma.uSER.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    const api_user = await prisma.aPI_USER.findFirst({
        where: {
            fk_id_user_api: user?.id_user
        }
    })

    // https://api.spotify.com/v1/me/top/artists
    const song_time_range = searchParams?.song_time_range || 'short_term'

    const artist_time_range = searchParams?.artist_time_range || 'short_term'

    let large_toptracks: any[] = []

    for (let i = 0; i <= 2; i++) {
        const x = [0, 49]
        const large_song_url = 'https://api.spotify.com/v1/me/top/tracks?limit=49&time_range=' + song_time_range + '&offset=' + x[i]
        console.log(large_song_url)
        const large_topSongs_res = await fetch(large_song_url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${api_user?.access_token}`
            }
        })
        const large_topSongs = await large_topSongs_res.json() || [];
        for (let i = 0; i < large_topSongs?.items?.length; i++) {
            large_toptracks.push(large_topSongs.items[i].id)
        }
    }



    const large_toptracks_url = 'https://api.spotify.com/v1/audio-features?ids=' + large_toptracks.join()
    const large_toptracks_res = await fetch(large_toptracks_url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api_user?.access_token}`
        }
    })
    const large_toptracks_features = await large_toptracks_res.json() || [];

    let acousticness = []
    let danceability = []
    let duration = []
    let energy = []
    let instrumentalness = []
    let key = []
    let liveness = []
    let loudness = []
    let mode = []
    let speechiness = []
    let tempo = []
    let time_signature = []
    let valence = []

    for (let i = 0; i < large_toptracks_features?.audio_features?.length; i++) {

        acousticness.push(large_toptracks_features.audio_features[i].acousticness)
        danceability.push(large_toptracks_features.audio_features[i].danceability)
        duration.push(large_toptracks_features.audio_features[i].duration_ms)
        energy.push(large_toptracks_features.audio_features[i].energy)
        instrumentalness.push(large_toptracks_features.audio_features[i].instrumentalness)
        key.push(large_toptracks_features.audio_features[i].key)
        liveness.push(large_toptracks_features.audio_features[i].liveness)
        loudness.push(large_toptracks_features.audio_features[i].loudness)
        mode.push(large_toptracks_features.audio_features[i].mode)
        speechiness.push(large_toptracks_features.audio_features[i].speechiness)
        tempo.push(large_toptracks_features.audio_features[i].tempo)
        time_signature.push(large_toptracks_features.audio_features[i].time_signature)
        valence.push(large_toptracks_features.audio_features[i].valence)
    }

    const acousticness_mitellerwert = acousticness.reduce((a, b) => a + b, 0) / acousticness.length
    const danceability_mitellerwert = danceability.reduce((a, b) => a + b, 0) / danceability.length
    const duration_mitellerwert = duration.reduce((a, b) => a + b, 0) / duration.length
    const energy_mitellerwert = energy.reduce((a, b) => a + b, 0) / energy.length
    const instrumentalness_mitellerwert = instrumentalness.reduce((a, b) => a + b, 0) / instrumentalness.length
    const key_mitellerwert = key.reduce((a, b) => a + b, 0) / key.length
    const liveness_mitellerwert = liveness.reduce((a, b) => a + b, 0) / liveness.length
    const loudness_mitellerwert = loudness.reduce((a, b) => a + b, 0) / loudness.length
    const mode_mitellerwert = mode.reduce((a, b) => a + b, 0) / mode.length
    const speechiness_mitellerwert = speechiness.reduce((a, b) => a + b, 0) / speechiness.length
    const tempo_mitellerwert = tempo.reduce((a, b) => a + b, 0) / tempo.length
    const time_signature_mitellerwert = time_signature.reduce((a, b) => a + b, 0) / time_signature.length
    const valence_mitellerwert = valence.reduce((a, b) => a + b, 0) / valence.length


    const large_toptracks_features_mitellerwert = {
        Acousticness: acousticness_mitellerwert,
        Danceability: danceability_mitellerwert,
        Energy: energy_mitellerwert,
        Instrumentalness: instrumentalness_mitellerwert,
        Liveness: liveness_mitellerwert,
    }






    return (
        <>
            {session ? (

                <div className="flex flex-col justify-center items-center  ">

                    <h1 className="font-sans text-4xl font-bold p-3 pb-12">Hello {session?.user?.name}, here your Spotify Stats!</h1>
                    <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-24 w-24 rounded-full"></Image>
                    <p className="font-bold text-3xl">{session?.user?.name}</p>


                    <Artistlist artist_time_range={artist_time_range as string}></Artistlist>

                    <Songlist song_time_range={song_time_range as string}></Songlist>

                    <Chart large_toptracks_features={large_toptracks_features_mitellerwert}></Chart>


                    <Script id="setview" strategy="beforeInteractive">
                        {`
                        function isParameterSet(parameterName) {
                            // Get the current URL
                            const currentUrl = new URL(window.location.href);
                            
                            // Parse the query string of the URL
                            const params = currentUrl.searchParams;
                            
                            // Check if the specified parameter is set
                            return params.has(parameterName);
                        }
                        
                        const artistisParamset = isParameterSet('artist_time_range');

                        if (artistisParamset) {
                            document.getElementById("artist")?.scrollIntoView();
                        }
                        
                        const tracksParamset = isParameterSet('song_time_range');
                        if (tracksParamset) {
                            document.getElementById("song")?.scrollIntoView();
                        }
                        
                        `}
                    </Script>
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