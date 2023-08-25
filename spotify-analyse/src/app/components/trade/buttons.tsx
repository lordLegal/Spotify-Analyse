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

    const user = await prisma.uSER.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    const tradeUser = await prisma.tRADE_USER.findFirst({
        where: {
            fk_id_user: user?.id_user
        }
    })

    const coins = tradeUser?.coins ?? 0;
    const coinsInvested = tradeUser?.coins_invested ?? 0;
    const max = coins - coinsInvested;




    return (
        <>
            <Buy max={max} coins={coins} artist={artist} user={user?.id_user} />
            <Sell max={max} coins={coins} artist={artist} user={user?.id_user} />
            <More />
        </>
    );
}
