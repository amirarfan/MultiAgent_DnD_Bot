import os
import websockets
from io import BytesIO
import json
import base64


async def realtime_tts(text):
    url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"
    api_key = os.getenv("OPENAI_API_KEY")

    headers = {"Authorization": f"Bearer {api_key}", "OpenAI-Beta": "realtime=v1"}

    async with websockets.connect(url, extra_headers=headers) as ws:
        # Initialize session
        session_update = {
            "type": "session.update",
            "session": {
                "modalities": ["audio", "text"],
                "instructions": "You are a text to speech assistant. Your job is to convert text to speech, but act as a narrator for a D&D game. Make it overly dramatic. You always stay true to the text, and use the exact same words.",
                "voice": "alloy",
                "input_audio_format": "pcm16",
                "output_audio_format": "pcm16",
                "input_audio_transcription": {"model": "whisper-1"},
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500,
                },
            },
        }
        await ws.send(json.dumps(session_update))
        await ws.recv()  # Wait for session.updated response

        # Send text message
        text_message = {
            "type": "conversation.item.create",
            "item": {
                "type": "message",
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Narrate the following text as if it's a D&D game, stay true to the text and use the exact same words: "
                        + text,
                    }
                ],
            },
        }
        await ws.send(json.dumps(text_message))
        await ws.recv()  # Wait for conversation.item.created response

        # Request response
        response_request = {
            "type": "response.create",
            "response": {
                "modalities": ["audio", "text"],
                "voice": "alloy",
                "output_audio_format": "pcm16",
            },
        }
        await ws.send(json.dumps(response_request))

        audio_data = BytesIO()
        async for response in ws:
            result = json.loads(response)
            if result["type"] == "response.audio.delta":
                chunk = base64.b64decode(result["delta"])
                audio_data.write(chunk)
            elif result["type"] == "response.done":
                break

        audio_data.seek(0)
        return audio_data
