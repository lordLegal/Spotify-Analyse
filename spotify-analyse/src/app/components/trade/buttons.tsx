import Link from 'next/link';
import Image from 'next/image';
import Buy from './buttons/buy';
import Sell from './buttons/sell';
import More from './buttons/more';
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { options } from '@/app/api/auth/[...nextauth]/options';


export default async function Buttons(params: any) {

    const artist = params.artist;


    const session = await getServerSession(options)

    const prisma = new PrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    const tradeUser = await prisma.tradeUser.findFirst({
        where: {
            userId: user?.id
        }
    })

    const artists = await prisma.artist.findFirst({
        where: {
            spotify_id: artist
        }
    })


    const tradeArtist = await prisma.investArtist.findUnique({
        where: {
            artistId: artists?.id,
            userId: user?.id
        }
    })

    console.log(tradeArtist);


    const coins = tradeUser?.coins as number;
    const coinsInvested = tradeUser?.coins_invested as number;
    const max = coins as number;
    const sellMax = (tradeArtist?.coins as number);
    console.log(tradeArtist?.coins as number);
    console.log(sellMax);




    return (
        <>
            <Buy max={max} coins={coins} artist={artist} user={user?.id} />
            <Sell max={sellMax} coins={coins} artist={artist} user={user?.id} />
            <More />
        </>
    );
}
