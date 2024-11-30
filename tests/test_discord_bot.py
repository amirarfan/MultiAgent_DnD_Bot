from asyncio import exceptions
from io import BytesIO
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from discord.ext import commands
from discord import Message, User, Reaction, PartialEmoji
from discord_bot import bot, new_session
from azure.cosmos import exceptions


@pytest.fixture
def mock_message():
    message = AsyncMock(spec=Message)
    message.author.id = 123456789
    message.author == bot.user
    message.content = "!start"
    message.mentions = []
    return message


@pytest.fixture
def mock_context():
    ctx = AsyncMock(spec=commands.Context)
    ctx.author.id = 123456789
    ctx.send = AsyncMock()
    return ctx


# Mock the OpenAI and Swarm clients
@pytest.fixture(autouse=True)
def mock_clients():
    with patch('discord_bot.OpenAI') as mock_openai, \
         patch('discord_bot.Swarm') as mock_swarm:
        mock_openai.return_value = MagicMock()
        mock_swarm.return_value = MagicMock()
        yield


@pytest.mark.asyncio
async def test_new_session_no_existing_session(mock_context):
    with patch("discord_bot.cosmos_client", autospec=True) as mock_cosmos_client:
        container = AsyncMock()
        mock_cosmos_client.create_database_if_not_exists.return_value.create_container_if_not_exists.return_value = (
            container
        )
        container.delete_item.side_effect = exceptions.CosmosResourceNotFoundError(
            message="Not Found", status_code=404, headers=None
        )
        await new_session(mock_context)
        mock_context.send.assert_called_with(
            "No existing session found. You're starting fresh!"
        )

