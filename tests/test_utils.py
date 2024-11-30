import pytest
from utils.tts.tts import text_to_speech
from utils.image.image_gen import generate_image
from io import BytesIO
from unittest.mock import Mock, patch
from pathlib import Path


class TestTextToSpeech:
    @pytest.mark.asyncio
    async def test_text_to_speech(self, mock_openai_client):
        mock_response = Mock()
        mock_response.stream_to_file = Mock()
        mock_openai_client.audio.speech.create.return_value = mock_response

        text = "Welcome to the dungeon!"
        await text_to_speech(mock_openai_client, text)

        mock_openai_client.audio.speech.create.assert_called_once_with(
            model="tts-1-hd", voice="alloy", input=text
        )
        mock_response.stream_to_file.assert_called_once()

    @pytest.mark.asyncio
    async def test_text_to_speech_failure(self, mock_openai_client):
        mock_openai_client.audio.speech.create.side_effect = Exception("API Error")

        text = "This will fail."
        with pytest.raises(Exception) as exc_info:
            await text_to_speech(mock_openai_client, text)

        assert "API Error" in str(exc_info.value)


class TestImageGeneration:
    def test_generate_image(self, mock_openai_client, monkeypatch):
        mock_response = Mock()
        mock_response.data = [Mock(url="http://fake-image.url")]
        mock_openai_client.images.generate.return_value = mock_response

        mock_requests_get = Mock()
        mock_requests_get.return_value.content = b"fake_image_data"
        monkeypatch.setattr("requests.get", mock_requests_get)

        result = generate_image(mock_openai_client, "A dark dungeon")

        assert isinstance(result, BytesIO)
        mock_openai_client.images.generate.assert_called_once_with(
            model="dall-e-3",
            prompt="A dark dungeon",
            size="1024x1024",
            quality="standard",
            n=1,
        )
