"use server";
import Link from "next/link";
import { options } from "../../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import DropdownMenu from "./dropdown";

export default async function Nav() {
    const session = await getServerSession(options);

    const prisma = new PrismaClient();

    const user = await prisma.uSER.findFirst({
        where: {
            email: session?.user?.email,
        },
    });

    const trade_user = await prisma.tRADE_USER.findFirst({
        where: {
            fk_id_user: user?.id_user
        }
    })
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
                            <Link href="/">Spotify Analyse</Link>
                        </div>

                        <div className="hidden md:flex space-x-4">
                            <Link href="/" className="text-white hover:text-gray-200">Home</Link>
                            <Link href="/statics" className="text-white hover:text-gray-200">Statics</Link>
                            <Link href="/trade" className="text-white hover:text-gray-200">Trade</Link>
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
