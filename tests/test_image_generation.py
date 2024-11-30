import pytest
from unittest.mock import Mock, patch
from utils.image.image_gen import generate_image
from io import BytesIO

class TestImageGeneration:
    
    def test_generate_image_success(self, mock_openai_client):
        mock_response = Mock()
        mock_response.data = [Mock(url="http://fake-image.url")]
        mock_openai_client.images.generate.return_value = mock_response

        with patch('utils.image.image_gen.requests.get', return_value=Mock(content=b"fake_image_bytes")) as mock_requests_get:
            image_data = generate_image(mock_openai_client, "A dark dungeon")
            mock_openai_client.images.generate.assert_called_once_with(
                model="dall-e-3",
                prompt="A dark dungeon",
                size="1024x1024",
                quality="standard",
                n=1,
            )
            mock_requests_get.assert_called_once_with("http://fake-image.url")
            assert isinstance(image_data, BytesIO)
            assert image_data.getvalue() == b"fake_image_bytes"

    def test_generate_image_failure(self, mock_openai_client):
        mock_openai_client.images.generate.side_effect = Exception("API Error")

        with pytest.raises(Exception) as exc_info:
            generate_image(mock_openai_client, "A dark dungeon")
        assert "API Error" in str(exc_info.value)
