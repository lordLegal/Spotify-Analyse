"use server";
import Image from "next/image"
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"


export default async function Artstlist() {
    "use server";


    async function change_time_range(time_range: string) {



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



        const topArtists_res = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${api_user?.access_token}`
            }
        })
        const topArtists = await topArtists_res.json();
        return topArtists
    }

    const topArtists = change_time_range('short_term') as any







    return (
        <>




        </>
    )
}
