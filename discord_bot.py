import discord
from discord.ext import commands
from dotenv import load_dotenv
import os
from swarm import Swarm
from configs.agents import *
from openai import OpenAI
import logging
from azure.cosmos import exceptions, CosmosClient, PartitionKey
import asyncio
import wave
from aiohttp import web
import sys
from utils.tts.tts_realtime import realtime_tts
from utils.response.extractor import extract_response_text
from utils.image.image_gen import generate_image

load_dotenv(".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True
intents.reactions = True
intents.voice_states = True

bot = commands.Bot(command_prefix="!", intents=intents)

# Initialize OpenAI client first
client_openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Then initialize Swarm with the OpenAI client
client = Swarm(client=client_openai)

context_variables = {
    "dungeon_context": """Here is what you know about the dungeon:
1. Dungeon Name: The Caverns of Chaos
2. Dungeon Master: Eldrin the Wise
3. Number of Rooms: 10
4. Difficulty: Hard
5. Monsters: Goblins, Skeletons, and a Young Dragon
6. Loot: Gold, Magical Artifacts, and Rare Gems
""",
    "player_context": """The party consists of:
1. Thorin (Dwarf Fighter)
2. Elara (Elf Wizard)
3. Grok (Half-Orc Barbarian)
4. Lirael (Human Cleric)
The party is currently at the entrance of the dungeon.""",
    "current_location": "Entrance of the dungeon",
}

# Stores conversation history per user
user_conversations = {}


def update_location(messages):
    for message in reversed(messages):
        if message["role"] == "assistant":
            content = message.get("content")
            if content:
                content = content.lower()
                if (
                    "you are now in" in content
                    or "you have entered" in content
                    or "you find yourself in" in content
                ):
                    # Extract the new location from the message
                    new_location = content.split("in ", 1)[-1].split(".")[0].strip()
                    return new_location
    return None  # Return None if no location update was found


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    # Process commands first
    await bot.process_commands(message)

    if bot.user in message.mentions:
        user_id = str(message.author.id)
        user_input = message.content.replace(f"<@!{bot.user.id}>", "").strip()

        # Add a reaction to indicate the bot has received the message
        await message.add_reaction("🤔")

        # Retrieve conversation from Cosmos DB
        try:
            conversation_item = container.read_item(item=user_id, partition_key=user_id)
            conversation = conversation_item.get(
                "conversation",
                {
                    "messages": [],
                    "agent_name": "triage_agent",
                },
            )
        except exceptions.CosmosResourceNotFoundError:
            # If conversation doesn't exist, initialize a new one
            conversation = {
                "messages": [],
                "agent_name": "triage_agent",  # Starting agent name
            }

        messages = conversation["messages"]
        agent_name = conversation["agent_name"]
        agent = agent_map[agent_name]  # Get the actual agent object

        # Append the user's message to the conversation
        messages.append({"role": "user", "content": user_input})

        # Use typing context manager to show typing animation
        async with message.channel.typing():
            try:
                # Run the Swarm client with the full conversation history
                response = client.run(
                    agent=agent,
                    messages=messages,
                    context_variables={
                        **context_variables,
                        "current_location": context_variables["current_location"],
                        "party_composition": context_variables["player_context"],
                    },
                    stream=False,
                    debug=False,
                )

                # Process and send the response back to Discord
                response_text = extract_response_text(response.messages)

                # Split long messages
                max_length = 2000
                for i in range(0, len(response_text), max_length):
                    chunk = response_text[i : i + max_length]
                    await message.channel.send(chunk)

                # Update the conversation history
                messages.extend(response.messages)

                # Update the agent name if it has changed
                if response.agent != agent:
                    agent_name = next(
                        (
                            name
                            for name, obj in agent_map.items()
                            if obj == response.agent
                        ),
                        agent_name,
                    )

                # Save the updated conversation back to Cosmos DB
                container.upsert_item(
                    {
                        "id": user_id,
                        "user_id": user_id,
                        "conversation": {
                            "messages": messages,
                            "agent_name": agent_name,
                        },
                    }
                )

                # Update current_location based on exploration progress
                new_location = update_location(response.messages)
                if new_location:
                    context_variables["current_location"] = new_location
                    logger.info(f"Updated location: {new_location}")

            except Exception as e:
                error_message = "An error occurred, please try again later."
                await message.channel.send(error_message)
                logger.error(f"Error in on_message: {str(e)}")

        # Remove the thinking reaction
        await message.remove_reaction("🤔", bot.user)
        # Add a checkmark reaction to indicate completion
        await message.add_reaction("✅")


@bot.event
async def on_reaction_add(reaction, user):
    if user == bot.user:
        return

    logging.info(f"Reaction added: {reaction.emoji} by {user.name}")

    if str(reaction.emoji) == "🔥" and reaction.message.author == bot.user:
        original_content = reaction.message.content
        image_prompt = (
            f"A detailed fantasy illustration of a D&D scene: {original_content[:500]}"
        )
        image_data = generate_image(client_openai, image_prompt)

        # Create a Discord File object directly from the BytesIO object
        image_file = discord.File(image_data, filename="dnd_scene.png")

        # Reply to the original message with the image
        await reaction.message.reply(file=image_file)

    elif str(reaction.emoji) == "🔊" and reaction.message.author == bot.user:
        if user.voice is None:
            await reaction.message.channel.send(
                "You need to be in a voice channel to use this feature."
            )
            return

        voice_channel = user.voice.channel
        voice_client = await voice_channel.connect()

        try:
            # Generate speech using the new realtime_tts function
            logger.info(f"Generating speech for message")
            audio_data = await realtime_tts(reaction.message.content)
            logger.info(f"Speech generated")

            # Save the audio data to a temporary file
            with wave.open("temp_audio.wav", "wb") as wf:
                wf.setnchannels(1)  # Mono audio
                wf.setsampwidth(2)  # 16-bit audio
                wf.setframerate(24000)  # Sample rate
                wf.writeframes(audio_data.getvalue())

            # Play the audio
            voice_client.play(discord.FFmpegPCMAudio("temp_audio.wav"))

            # Wait for the audio to finish playing
            while voice_client.is_playing():
                await asyncio.sleep(1)

        finally:
            # Disconnect from the voice channel
            await voice_client.disconnect()

            # Delete the temporary audio file
            os.remove("temp_audio.wav")
            logger.info("Deleted temporary audio file")


@bot.event
async def on_ready():
    print(f"{bot.user} has connected to Discord!")


@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        await ctx.send("Command not found. Please check your command and try again.")
    else:
        await ctx.send(f"An error occurred: {str(error)}")


# Initialize Cosmos DB client
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_KEY = os.getenv("COSMOS_KEY")
cosmos_client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
DATABASE_NAME = "dnd_sessions"
CONTAINER_NAME = "user_sessions"

# Create database and container if they don't exist
database = cosmos_client.create_database_if_not_exists(id=DATABASE_NAME)
container = database.create_container_if_not_exists(
    id=CONTAINER_NAME, partition_key=PartitionKey(path="/user_id"), offer_throughput=400
)

# Create a dictionary to map agent names to agent objects
agent_map = {
    "triage_agent": triage_agent,
    "combat_agent": combat_agent,
    "exploration_agent": exploration_agent,
    "npc_interaction_agent": npc_interaction_agent,
}


@bot.command()
async def new_session(ctx):
    user_id = str(ctx.author.id)
    try:
        logger.info(f"Deleting session for user {user_id}")
        container.delete_item(item=user_id, partition_key=user_id)
        await ctx.send(
            "Your conversation history has been cleared. Starting a new session!"
        )
    except exceptions.CosmosResourceNotFoundError:
        await ctx.send("No existing session found. You're starting fresh!")


async def health_check(request):
    return web.Response(text="OK")


async def start_http_server():
    app = web.Application()
    app.router.add_get("/", health_check)  # This line handles the root path
    app.router.add_get("/health", health_check)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 8000)
    await site.start()
    logger.info("HTTP server started on port 8000")


async def run_bot():
    await bot.start(os.getenv("DISCORD_BOT_TOKEN"))


async def main():
    # Start the HTTP server first
    await start_http_server()

    # Add a small delay to ensure the server is up
    await asyncio.sleep(2)

    # Start the Discord bot
    await run_bot()


if __name__ == "__main__":
    asyncio.run(main())
