import pytest
import os
import sys
from unittest.mock import Mock, AsyncMock

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def mock_openai_client():
    return Mock()


@pytest.fixture
def mock_discord_context():
    context = Mock()
    context.author = Mock()
    context.author.id = "123456789"
    context.send = Mock()
    return context


@pytest.fixture
def sample_messages():
    return [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Welcome to the dungeon!"},
        {"role": "user", "content": "I want to explore"},
        {"role": "assistant", "content": "You enter the dark cave."},
    ]


@pytest.fixture
def mock_cosmos_container():
    container = Mock()
    container.read_item = Mock()
    container.upsert_item = Mock()
    container.delete_item = Mock()
    return container


@pytest.fixture
def mock_bot():
    bot = AsyncMock()
    bot.user = AsyncMock()
    return bot
