import requests
import os
from dotenv import load_dotenv
import time
from pymongo import MongoClient
from pymongo.cursor import Cursor


load_dotenv()

apiUrl = os.getenv("API_URL")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["tradespotify"]


while True:
    if time.strftime("%H:%M") == "24:00" or time.strftime("%H:%M") == "12:00":
        artistData = db["ArtistData"]
        InvestArtist = db["InvestArtist"]

        InvestArtist_list = list(InvestArtist.find())
        artists = db["Artist"]
        artists_list = list(artists.find())

        for investartist in InvestArtist_list:
            print(investartist)

            # find the artist in the artlist_list with the artist and the id of the artist
            artist = next(
                (
                    artist_item
                    for artist_item in artists_list
                    if artist_item["_id"] == investartist["artist"]
                ),
                None,
            )

            if artist is not None and investartist is not None:
                print(artist["spotify_id"])
                ArtistData: Cursor = artistData.find({"artistId": artist["spotify_id"]})

                ArtistData_list = list(ArtistData)
                if len(ArtistData_list) > 0:
                    ArtistData = ArtistData_list[-1]

                monthly = ArtistData["monthly_listeners"]
                spotify_id = artist["spotify_id"]
                if monthly is not None:
                    print(monthly)

                # get the monthly listeners of the artist
                monthlyNow = (
                    requests.get(str(apiUrl) + str(spotify_id)).json().get("monthly")
                )

                difference = monthlyNow - monthly

                # calculate the percentage of the difference
                percentage = (difference / monthly) * 100

                if int(percentage) != 0:
                    plusCoins = (int(investartist["coins"]) * int(percentage)) - int(
                        investartist["coins"]
                    )
                    InvestArtist.update_one(
                        {"_id": investartist["_id"]},
                        {
                            "$set": {
                                "plusCoins": plusCoins,
                                "coins": (int(investartist["coins"]) * int(percentage)),
                            }
                        },
                    )
