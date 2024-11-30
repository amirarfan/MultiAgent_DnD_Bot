from configs.tools import *
from data.routines.combat.policies import *
from data.routines.prompts import DM_STARTER_PROMPT

from swarm import Agent


def transfer_to_combat():
    return combat_agent


def transfer_to_exploration():
    return exploration_agent


def transfer_to_npc_interaction():
    return npc_interaction_agent


def transfer_to_triage():
    """Call this function when a player needs to be transferred to a different agent and a different policy.
    For instance, if a player is asking about a topic that is not handled by the current agent, call this function.
    """
    return triage_agent


def triage_instructions(context_variables):
    dungeon_context = context_variables.get("dungeon_context", None)
    player_context = context_variables.get("player_context", None)
    return f"""You are to triage a player's request by calling the appropriate transfer function.
    **Do not provide any explanations or messages to the player unless you need more information to make a decision.**
    When you need more information to triage the request, ask a direct question without explaining why you're asking it.
    Do not share your thought process with the player! Do not make unreasonable assumptions on behalf of the player.

    The dungeon context is here: {dungeon_context}

    The party consists of:
    {player_context}

    Keep the party composition in mind when triaging requests. Different character classes may have different needs or abilities that could influence which agent is most appropriate."""


triage_agent = Agent(
    name="Triage Agent",
    instructions=triage_instructions,
    functions=[
        transfer_to_combat,
        transfer_to_exploration,
        transfer_to_npc_interaction,
    ],
)

combat_agent = Agent(
    name="Combat Agent",
    instructions=DM_STARTER_PROMPT + COMBAT_POLICY,
    functions=[
        roll_dice,
        apply_damage,
        check_player_status,
        transfer_to_triage,
        encounter_resolved,
        check_dice_result,
    ],
)

exploration_agent = Agent(
    name="Exploration Agent",
    instructions=DM_STARTER_PROMPT + EXPLORATION_POLICY,
    functions=[
        describe_environment,
        check_for_traps,
        reveal_secret,
        generate_random_event,
        transfer_to_triage,
        encounter_resolved,
        roll_dice,
        check_dice_result,
    ],
)

npc_interaction_agent = Agent(
    name="NPC Interaction Agent",
    instructions=lambda context_variables: DM_STARTER_PROMPT
    + NPC_INTERACTION_POLICY.format(
        player_context=context_variables.get("player_context", "")
    ),
    functions=[
        npc_dialogue,
        check_player_charisma,
        give_quest,
        transfer_to_triage,
        encounter_resolved,
        roll_dice,
        check_dice_result,
    ],
)
