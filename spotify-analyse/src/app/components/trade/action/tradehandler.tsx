"use server";
import { PrismaClient } from "@prisma/client";


export async function buyHandler(data: any) {
    console.log(data);
    console.log(data?.get("artist_id"));
    console.log(data?.get("coins"));
    console.log(data?.get("user_id"));
    const prisma = new PrismaClient();
    const artist_spotify_id = data?.get("artist_id");
    const coins = parseInt(data?.get("coins")); // Handle NaN case
    const user_id = parseInt(data?.get("user_id"));

    console.log(artist_spotify_id);
    console.log(coins);
    console.log(user_id);

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log("all data is there");



        const artist = await prisma.aRTIST.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id_artits;


        // create invest artist

        await prisma.iNVEST_ARTIST.create({
            data: {
                coins: coins,
                fk_id_artist: artist_id,
                fk_id_user: user_id

            }
        })

        // update trade user

        const trade_user = await prisma.tRADE_USER.findFirst({
            where: {
                fk_id_user: user_id
            }
        })

        const coins_invested = trade_user?.coins_invested ?? 0;

        const new_coins = (trade_user?.coins ?? 0) - coins;

        const new_coins_invested = coins_invested + coins;

        await prisma.tRADE_USER.update({
            where: {
                fk_id_user: user_id
            },
            data: {
                coins: new_coins,
                coins_invested: new_coins_invested
            }

        })



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
    const user_id = parseInt(data?.get("user_id"));

    console.log(artist_spotify_id);
    console.log(coins);
    console.log(user_id);

    if (artist_spotify_id !== null && coins !== null && user_id !== null && !isNaN(coins)) {
        console.log("all data is there");



        const artist = await prisma.aRTIST.findFirst({
            where: {
                spotify_id: artist_spotify_id
            }
        })

        if (artist === null) {
            console.log("artist not found");
            return;
        }

        const artist_id = artist?.id_artits;


        // create invest artist

        await prisma.iNVEST_ARTIST.create({
            data: {
                coins: coins,
                fk_id_artist: artist_id,
                fk_id_user: user_id

            }
        })

        // update trade user

        const trade_user = await prisma.tRADE_USER.findFirst({
            where: {
                fk_id_user: user_id
            }
        })

        const coins_invested = trade_user?.coins_invested ?? 0;

        const new_coins = (trade_user?.coins ?? 0) + coins;

        const new_coins_invested = coins_invested - coins;

        await prisma.tRADE_USER.update({
            where: {
                fk_id_user: user_id
            },
            data: {
                coins: new_coins,
                coins_invested: new_coins_invested
            }

        })



    }

}