import requests
import os
from dotenv import load_dotenv
import time
from pymongo import MongoClient
from pymongo.cursor import Cursor
import json


load_dotenv()

apiUrl = "http://81.217.39.104:8000/"

client = MongoClient(
    "mongodb+srv://retox2:GNSV2u__00@tradespotify.kecndgk.mongodb.net/"
)
db = client["tradespotify"]


while True:
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
            monthly = investartist["plusCoins"]
            spotify_id = artist["spotify_id"]
            if monthly is not None:
                print(monthly)

            # get the monthly listeners of the artist
            monthlyNow = (
                requests.get(str(apiUrl) + str(spotify_id)).json().get("monthly")
            )

            difference = monthlyNow - monthly

            # check if the difference is positive or negative
            if difference > 0:
                # calculate the percentage of the difference
                percentage = (difference / monthly) * 100
                print(percentage)
            else:
                # calculate the percentage of the difference
                percentage = (difference / monthly) * 100
                # check if the percentage is lower than -10%
                print(percentage)

    time.sleep((60 * 60) * 12)
