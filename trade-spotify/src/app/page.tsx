import Link from "next/link"
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import Script from "next/script"



export default async function Home() {
  const session = await getServerSession(options)


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center mt-60">
          <h1 className="text-6xl font-bold">
            Welcome to <span className="text-green-600">Trade Spotify</span>
          </h1>

          <p className="mt-3 text-2xl">
            Analyse and Trade with Coins using your Spotify Data
          </p>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full ">
            <Link className="p-6 mt-6 text-left border w-96 rounded-xl border-black dark:border-green-600 hover:text-green-600 focus:text-green-600" href="/api/auth/signin">
              <h3 className="text-2xl font-bold">Login &rarr;</h3>
              <p className="mt-4 text-xl">
                Login with your Spotify Account
              </p>
            </Link>


          </div>

          <div className="mt-72 mb-20">


            <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
              <div className="p-6 mt-6 text-left border w-96 rounded-xl border-black dark:border-green-600 hover:text-green-600 focus:text-green-600">
                <h3 className="text-2xl font-bold">What is it? &rarr;</h3>
                <p className="mt-4 text-xl">
                  Spotify Trade is a Web App that allows you to analyse your Spotify Data and trade with Coins.
                </p>
              </div>
            </div>


            <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
              <div className="p-6 mt-6 text-left border w-96 rounded-xl border-black dark:border-green-600 hover:text-green-600 focus:text-green-600">
                <h3 className="text-2xl font-bold">How does it work? &rarr;</h3>
                <p className="mt-4 text-xl">
                  Spotify Trade uses the Spotify API to get your Top Artists and Top Tracks. With this data you can trade with Coins.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
              <div className="p-6 mt-6 text-left border w-96 rounded-xl border-black dark:border-green-600 hover:text-green-600 focus:text-green-600">
                <h3 className="text-2xl font-bold">What can I do with it? &rarr;</h3>
                <p className="mt-4 text-xl">
                  You can trade with Coins. You can invest in your Top Artists. You can also trade .
                </p>
              </div>
            </div>
          </div>



        </main>

        <footer className="flex items-center justify-center w-full h-24 border-t">
          Coded and Designed by <Link href="https://github.com/lordLegal" className="text-green-600">Martin Beneder</Link>
        </footer>

      </div>

      <Script src="./components/home/js.js"></Script>

    </>
  )
}