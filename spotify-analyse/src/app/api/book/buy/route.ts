
import { NextResponse, NextRequest } from 'next/server';
import { redirect } from 'next/navigation'



// route.ts

export async function POST(req: NextRequest) {
    const res = await req.formData()
    const coins = res.get('coins')
    const artist_id = res.get('artist_id')
    console.log(coins, artist_id)

    redirect("/")
}