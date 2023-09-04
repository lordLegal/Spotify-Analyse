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
    if time.strftime("%H:%M") == "23:50" or time.strftime("%H:%M") == "11:50":
        artist = db["Artist"]
        artists = artist.find()
        artistData = db["ArtistData"]

        for artist in artists:
            print(artist)
            spotify_id = artist["spotify_id"]
            monthly = requests.get(("" + str(spotify_id))).json().get("monthly")
            print(monthly)
            foundartist: Cursor = artistData.find({"artistId": spotify_id})

            foundartist_list = list(foundartist)
            if len(foundartist_list) > 0:
                num = int(foundartist_list[-1]["data_count"]) + 1
            else:
                num = 1

            artistData.insert_one(
                {
                    "date": time.strftime("%d %b %Y %H:%M:%S"),
                    "artistId": spotify_id,
                    "monthly_listeners": monthly,
                    "data_count": num,
                }
            )
