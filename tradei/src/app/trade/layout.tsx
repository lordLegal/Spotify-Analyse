"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { options } from "../api/auth/[...nextauth]/options";
import Sidebar from "../components/trade/sidebar";




export default async function TradeLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
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






    return (
        <>
            {session ? (

                <div className=" ">

                    <Sidebar params={{ user: user, coins: coins, session: session }}></Sidebar>
                    <div className="flex flex-col items-center   ">
                        {children}
                    </div>


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