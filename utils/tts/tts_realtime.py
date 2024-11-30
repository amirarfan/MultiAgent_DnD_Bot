import os
import websockets
from io import BytesIO
import json
import base64


async def realtime_tts(text):
    audio_buffer = BytesIO()
    
    async with websockets.connect('wss://api.openai.com/v1/audio/speech') as websocket:
        async for message in websocket:
            try:
                data = json.loads(message)
                if data['type'] == 'response.audio.delta':
                    chunk = base64.b64decode(data['delta'])
                    audio_buffer.write(chunk)
                elif data['type'] == 'response.done':
                    break
            except json.JSONDecodeError:
                # Handle raw binary data if needed
                audio_buffer.write(message)
    
    audio_buffer.seek(0)
    return audio_buffer
