from fastapi import FastAPI
from bs4 import BeautifulSoup
import requests
from lxml.html.clean import Cleaner

app = FastAPI()


def sanitize(input_html: str):
    cleaner = Cleaner(scripts=True, javascript=True, comments=True, style=True)
    return str(cleaner.clean_html(input_html)).replace("<p>", "").replace("</p>", "")


@app.get("/{artist_id}")
async def artist(artist_id: str):
    artist_id = str(sanitize(artist_id))

    url = f"https://open.spotify.com/intl-de/artist/{artist_id}"
    print(url)

    try:
        response = requests.get(url, timeout=10)
    except requests.ConnectionError:
        return f"{url}: Connection Error"
    except requests.Timeout:
        return f"{url}: Timeout Error"
    except requests.RequestException as e:
        return f"{url}: An Error Occurred - {str(e)}"

    if response.status_code == 200:
        print((url + " 200: Successful"))
        soup = BeautifulSoup(response.text, "html.parser")
        meta_description = soup.find("meta", attrs={"name": "description"})

        if meta_description:
            contents = meta_description.get("content")  # type: ignore
            if contents:
                print(contents)
                content_words = str(contents).split(" ")
                if len(content_words) > 7:
                    print(content_words[9])
                    print(content_words[8])
                    print(content_words[7])

                    if content_words[7] == "·":
                        content = content_words[8]
                    elif content_words[7] == "Artist":
                        content = content_words[9]
                    else:
                        content = content_words[7]

                    print(content)
                    # Handle the specific format
                    if content[-1] == "K":
                        content = content[:-1] + "00"
                    elif content[-1] == "M":
                        content = content[:-1] + "00000"

                    print(content)

                    # Safely convert to integer
                    try:
                        content = int(content.replace(".", ""))
                    except ValueError:
                        return f"Invalid content format: {content}"

                    return {"monthly": content}
                else:
                    return "Content format is not as expected"
            else:
                print("Content not found")
        else:
            print("Meta description not found")
    else:
        return f"{url} {response.status_code}: Error"
