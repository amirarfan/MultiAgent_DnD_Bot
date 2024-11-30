from pathlib import Path


async def text_to_speech(client_openai, text):
    speech_file_path = Path(__file__).parent / "speech.mp3"
    response = client_openai.audio.speech.create(
        model="tts-1-hd", voice="alloy", input=text
    )
    response.stream_to_file(speech_file_path)
    return speech_file_path
