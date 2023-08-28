import mysql.connector
import requests
import os
from dotenv import load_dotenv
import time


load_dotenv()

host = str(os.getenv("HOST"))
user = str(os.getenv("USER"))
password = str(os.getenv("PASSWORD"))
db = str(os.getenv("DB"))

mydb = mysql.connector.connect(host=host, user=user, password=password, database=db)

con = mydb.cursor(buffered=True)

while True:
    con.execute("SELECT * FROM artist;")

    artists = con.fetchall()

    for artist in artists:
        print(artist)
        spotify_id = artist[1]
        monthly = (
            requests.get(("http://127.0.0.1:8000/" + str(spotify_id)))
            .json()
            .get("monthly")
        )
        countSql = f"SELECT COUNT(*) FROM artist_data WHERE fk_id_artist = {artist[0]};"
        con.execute(countSql)
        count = con.fetchall()[0][0]
        print(count, monthly, spotify_id)
        insertartistdata = f"INSERT INTO artist_data (fk_id_artist, monthly_listeners, data_count) VALUES ({artist[0]}, {monthly}, {count});"
        print(insertartistdata)
        con.execute(insertartistdata)
        mydb.commit()
    time.sleep(60)
