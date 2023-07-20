import Link from "next/link"
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"


export default async function Home() {
  const session = await getServerSession(options)


  return (
    <>
      {session ? (
        <div>
          <h1 className="text-5xl">Spotify Analyse</h1>
          <p>Hello my friend: {session?.user?.name}</p>
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