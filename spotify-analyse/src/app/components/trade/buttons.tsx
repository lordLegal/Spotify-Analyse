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

    const coins = tradeUser?.coins ?? 0;
    const coinsInvested = tradeUser?.coins_invested ?? 0;
    const max = coins;




    return (
        <>
            <Buy max={max} coins={coins} artist={artist} user={user?.id} />
            <Sell max={max} coins={coins} artist={artist} user={user?.id} />
            <More />
        </>
    );
}
