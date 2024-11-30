from io import BytesIO
import requests

def generate_image(client_openai, prompt):
    response = client_openai.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    image_url = response.data[0].url

    # Download the image directly into a BytesIO object
    image_data = BytesIO(requests.get(image_url).content)
    return image_data
