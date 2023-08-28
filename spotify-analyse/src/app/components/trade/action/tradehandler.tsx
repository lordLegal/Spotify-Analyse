"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function buyHandler(data: any) {
    console.log(data?.get("artist_id"));
    console.log(data?.get("coins"));
    console.log(data?.get("user_id"));
    const prisma = new PrismaClient();
    const artist_spotify_id = data?.get("artist_id");
    const coins = parseInt(data?.get("coins"));
    const user_id = (data?.get("user_id"));

    console.log(artist_spotify_id);
    console.log(coins);
    console.log(user_id);

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log(" Buy all data is there");



        const artist = await prisma.artist.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id;


        // create invest artist



        await prisma.investArtist.create({
            data: {
                coins: coins,
                artistId: artist_id,
                userId: user_id,
                operation_id: 1,
                operation: "buy"

            }
        })

        // update trade user

        const trade_user = await prisma.tradeUser.findFirst({
            where: {
                userId: user_id
            }
        })

        const coins_invested = trade_user?.coins_invested ?? 0;

        const new_coins = (trade_user?.coins ?? 0) - coins;

        const new_coins_invested = coins_invested + coins;

        await prisma.tradeUser.update({
            where: {
                userId: user_id
            },
            data: {
                coins: new_coins,
                coins_invested: new_coins_invested
            }

        })

        revalidatePath("/trade");

    }
}


export async function sellHandler(data: any) {
    console.log(data);
    console.log(data?.get("artist_id"));
    console.log(data?.get("coins"));
    console.log(data?.get("user_id"));
    const prisma = new PrismaClient();
    const artist_spotify_id = data?.get("artist_id");
    const coins = parseInt(data?.get("coins")); // Handle NaN case
    const user_id = (data?.get("user_id"));

    console.log(artist_spotify_id);
    console.log(coins);
    console.log(user_id);

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log("all data is there");



        const artist = await prisma.artist.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id;


        // create invest artist

        await prisma.investArtist.create({
            data: {
                coins: coins,
                artistId: artist_id,
                userId: user_id,
                operation_id: 2,
                operation: "sell"

            }
        })

        // update trade user

        const trade_user = await prisma.tradeUser.findFirst({
            where: {
                userId: user_id
            }
        })

        const coins_invested = trade_user?.coins_invested ?? 0;

        const new_coins = (trade_user?.coins ?? 0) + coins;

        const new_coins_invested = coins_invested - coins;

        await prisma.tradeUser.update({
            where: {
                userId: user_id
            },
            data: {
                coins: new_coins,
                coins_invested: new_coins_invested
            }

        })

        revalidatePath("/trade");


    }

}