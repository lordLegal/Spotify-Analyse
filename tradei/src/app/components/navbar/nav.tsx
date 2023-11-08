"use server";
import Link from "next/link";
import { options } from "../../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import DropdownMenu from "./dropdown";
import { AiOutlineHome } from 'react-icons/ai'
import { FcStatistics } from 'react-icons/fc'
import { FaExchangeAlt } from 'react-icons/fa'

export default async function Nav() {
    const session = await getServerSession(options);

    const prisma = new PrismaClient();

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string,
        },
    });

    const trade_user = await prisma.tradeUser.findFirst({
        where: {
            userId: user?.id,
        },
    });


    function formatNumberWithDots(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const coins = formatNumberWithDots(trade_user?.coins || 0)



    return (
        <>
            <nav className="fixed w-full bg-green-700 p-5">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">

                        <div className="text-white font-bold text-xl">
                            <Link href="/">Trade Spotify</Link>
                        </div>

                        <div className="hidden md:flex space-x-4">
                            <Link href="/" className="flex flex-row items-center justify-start text-white  font-bold "><AiOutlineHome className="mr-2 stroke-2" />Home</Link>
                            <Link href="/statics" className="flex flex-row items-center justify-start text-white  font-bold "><FcStatistics className="mr-2 stroke-2" />Statistics</Link>
                            <Link href="/trade" className="flex flex-row items-center justify-start text-white  font-bold "><FaExchangeAlt className="mr-2 stroke-1" />Trade</Link>
                        </div>

                        {session ? (

                            <DropdownMenu params={{ user: user, coins: coins }}></DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Link href="/api/auth/signin" ><strong className="text-white hover:text-gray-200">Login</strong></Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
