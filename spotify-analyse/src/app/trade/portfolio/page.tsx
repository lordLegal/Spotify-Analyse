"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";

import { options } from "@/app/api/auth/[...nextauth]/options"





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

            <div className="flex flex-col h-screen">
                <div className="flex flex-row h-1/6">
                    <h3 className="text-3xl font-bold text-white">Portfolio</h3>
                </div>
            </div>
        </>
    )
}