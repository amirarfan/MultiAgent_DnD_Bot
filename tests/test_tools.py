import pytest
from configs.tools import (
    initiate_baggage_search,
    apply_damage,
    check_player_status,
    describe_environment,
    check_for_traps,
    reveal_secret,
    npc_dialogue,
    give_quest,
    check_player_charisma,
    update_quest_progress,
    check_quest_completion,
    trigger_story_event,
    level_up_character,
    learn_new_skill,
    acquire_equipment,
    generate_random_event,
    use_special_ability,
    take_defensive_action,
    use_environment
)

class TestTools:
    
    def test_initiate_baggage_search(self):
        assert initiate_baggage_search() == "Baggage was found!"

    def test_apply_damage(self):
        target = "Thorin"
        amount = 10
        expected = "Applying 10 damage to Thorin"
        assert apply_damage(target, amount) == expected

    def test_check_player_status(self):
        player_name = "Elara"
        expected = "Checking status of Elara"
        assert check_player_status(player_name) == expected

    def test_describe_environment(self):
        location_type = "forest"
        expected = "Generating a detailed description of a forest"
        assert describe_environment(location_type) == expected

    def test_check_for_traps(self):
        assert check_for_traps() == "Checking for traps in the area"

    def test_reveal_secret(self):
        assert reveal_secret() == "Revealing a hidden secret or passage"

    def test_npc_dialogue(self):
        npc_name = "Gandalf"
        expected = "Initiating dialogue with Gandalf"
        assert npc_dialogue(npc_name) == expected

    def test_give_quest(self):
        quest_name = "Retrieve the Lost Sword"
        expected = "Giving quest: Retrieve the Lost Sword"
        assert give_quest(quest_name) == expected

    def test_check_player_charisma(self):
        player_name = "Grok"
        expected = "Checking charisma roll for Grok"
        assert check_player_charisma(player_name) == expected

    def test_update_quest_progress(self):
        quest_name = "Explore the Cave"
        progress = "50%"
        expected = "Updating progress for quest: Explore the Cave"
        assert update_quest_progress(quest_name, progress) == expected

    def test_check_quest_completion_success(self):
        quest_name = "Find the Hidden Treasure"
        expected = "Checking if quest 'Find the Hidden Treasure' is completed"
        assert check_quest_completion(quest_name) == expected

    def test_trigger_story_event(self):
        event_name = "Dragon Attack"
        expected = "Triggering story event: Dragon Attack"
        assert trigger_story_event(event_name) == expected

    def test_level_up_character(self):
        character_name = "Lirael"
        expected = "Leveling up Lirael"
        assert level_up_character(character_name) == expected

    def test_learn_new_skill(self):
        character_name = "Elara"
        skill_name = "Fireball"
        expected = "Elara learns Fireball"
        assert learn_new_skill(character_name, skill_name) == expected

    def test_acquire_equipment(self):
        character_name = "Thorin"
        equipment = "Orcish Axe"
        expected = "Thorin acquires Orcish Axe"
        assert acquire_equipment(character_name, equipment) == expected

    def test_generate_random_event(self):
        location = "Dark Forest"
        party_composition = "Thorin, Elara, Grok, Lirael"
        expected = "Generating a random event for Dark Forest with party: Thorin, Elara, Grok, Lirael"
        assert generate_random_event(location, party_composition) == expected

    def test_use_special_ability(self):
        character = "Grok"
        ability_name = "Berserk"
        expected = "Grok uses Berserk"
        assert use_special_ability(character, ability_name) == expected

    def test_take_defensive_action(self):
        character = "Lirael"
        action_type = "Shield Block"
        expected = "Lirael takes a Shield Block defensive action"
        assert take_defensive_action(character, action_type) == expected

    def test_use_environment(self):
        character = "Elara"
        environmental_element = "Ancient Ruins"
        expected = "Elara interacts with Ancient Ruins in the environment"
        assert use_environment(character, environmental_element) == expected
