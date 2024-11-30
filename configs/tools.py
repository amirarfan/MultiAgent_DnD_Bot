import random

def initiate_baggage_search():
    return "Baggage was found!"


def roll_dice(dice_type, number_of_dice=1, modifier=0, dc=None):
    rolls = [random.randint(1, int(dice_type)) for _ in range(int(number_of_dice))]
    total = sum(rolls) + int(modifier)
    result = f"Rolling {number_of_dice}d{dice_type} + {modifier}: {rolls} = {total}"
    if dc is not None:
        result += f" (DC: {dc}, {'Success' if total >= int(dc) else 'Failure'})"
    return result


def check_dice_result(result, dc):
    return f"Checking dice result: {result} (DC: {dc}, {'Success' if result >= dc else 'Failure'})"


def apply_damage(target, amount):
    return f"Applying {amount} damage to {target}"


def check_player_status(player_name):
    return f"Checking status of {player_name}"


def describe_environment(location_type):
    return f"Generating a detailed description of a {location_type}"


def check_for_traps():
    return "Checking for traps in the area"


def reveal_secret():
    return "Revealing a hidden secret or passage"


def npc_dialogue(npc_name):
    return f"Initiating dialogue with {npc_name}"


def check_player_charisma(player_name):
    return f"Checking charisma roll for {player_name}"


def give_quest(quest_name):
    return f"Giving quest: {quest_name}"


def encounter_resolved():
    return "Encounter resolved. Moving to the next part of the adventure. And transfering to the corresponding agent."


def use_special_ability(character, ability_name):
    return f"{character} uses {ability_name}"


def take_defensive_action(character, action_type):
    return f"{character} takes a {action_type} defensive action"


def use_environment(character, environmental_element):
    return f"{character} interacts with {environmental_element} in the environment"


def update_quest_progress(quest_name, progress):
    return f"Updating progress for quest: {quest_name}"


def check_quest_completion(quest_name):
    return f"Checking if quest '{quest_name}' is completed"


def trigger_story_event(event_name):
    return f"Triggering story event: {event_name}"


def level_up_character(character_name):
    return f"Leveling up {character_name}"


def learn_new_skill(character_name, skill_name):
    return f"{character_name} learns {skill_name}"


def acquire_equipment(character_name, equipment):
    return f"{character_name} acquires {equipment}"


def generate_random_event(location, party_composition):
    return f"Generating a random event for {location} with party: {party_composition}"
