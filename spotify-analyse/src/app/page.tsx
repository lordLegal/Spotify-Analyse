import Link from "next/link"
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"



export default async function Home() {
  const session = await getServerSession(options)


  return (
    <>
      {session ? (

        <div className="justify-center text-center">

          <h1 className="text-5xl">Spotify Analyse</h1>
          <p>Hello my friend: {session?.user?.name}</p>
          <p>dads </p>
          <Link href="/api/auth/signout" >Logout</Link>
        </div>
      ) : (
        <div className="my-auto  ">

          <h1 className="text-center text-3xl">Hey, we recommend to Login to see your spotify Stats and trade with spotiofy Data</h1><br></br>
          <Link className="" href="/api/auth/signin" ><p className=" ml-96 text-center text-bold text-2xl mt-10 bg-green-700 p-5 rounded-md w-24">Login</p></Link>
        </div>
      )}
    </>
  )
}