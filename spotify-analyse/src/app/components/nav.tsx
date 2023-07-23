import Link from "next/link"
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import '../css/home.css'
import Image from "next/image"
import { PrismaClient } from "@prisma/client"

export default async function Nav() {
    const session = await getServerSession(options)

    const prisma = new PrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })



    return (
        <>
            <nav className=" fixed w-full  bg-green-700 p-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">

                        <div className="text-white font-bold text-xl">
                            <Link href="/">Spotify Analyse</Link>
                        </div>


                        <div className="hidden md:flex space-x-4">
                            <a href="/" className="text-white hover:text-gray-200">Home</a>
                            <a href="statics" className="text-white hover:text-gray-200">Statics</a>
                            <a href="#" className="text-white hover:text-gray-200">Trade</a>
                        </div>


                        {session ? (
                            <div className="flex items-center space-x-1">

                                <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-9 w-9 rounded-full"></Image>
                                <span className="text-white ml-2">{user?.name}</span>
                                <Link className="text-right pl-4" href="/api/auth/signout" ><strong>Logout</strong></Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Link href="/api/auth/signin" ><strong>Login</strong></Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}