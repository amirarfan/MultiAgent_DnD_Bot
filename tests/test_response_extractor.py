import pytest
from utils.response.extractor import extract_response_text

class TestResponseExtractor:
    
    def test_extract_simple_messages(self):
        messages = [
            {"role": "assistant", "content": "You enter the cave.", "sender": "DM"},
            {"role": "assistant", "content": "Beware of the lurking dangers.", "sender": "DM"}
        ]
        expected = "**DM:** You enter the cave.\n**DM:** Beware of the lurking dangers.\n"
        assert extract_response_text(messages) == expected

    def test_extract_with_tool_calls(self):
        messages = [
            {
                "role": "assistant",
                "content": "Checking your perception...",
                "sender": "DM",
                "tool_calls": [
                    {
                        "function": {
                            "name": "roll_dice",
                            "arguments": '{"dice_type": 20, "modifier": 2}'
                        }
                    }
                ],
            }
        ]
        expected = '**DM:** Checking your perception...\n**DM:** *roll_dice("dice_type"= 20, "modifier"= 2)*\n'
        assert extract_response_text(messages) == expected

    def test_extract_mixed_messages(self):
        messages = [
            {"role": "user", "content": "I'd like to search the room.", "sender": "Player"},
            {"role": "assistant", "content": "Rolling for search...", "sender": "DM", "tool_calls": [
                {
                    "function": {
                        "name": "roll_dice",
                        "arguments": '{"dice_type": 20, "modifier": 3}'
                    }
                }
            ]},
            {"role": "assistant", "content": "You found a hidden lever.", "sender": "DM"},
        ]
        expected = '**DM:** Rolling for search...\n**DM:** *roll_dice("dice_type"= 20, "modifier"= 3)*\n**DM:** You found a hidden lever.\n'
        assert extract_response_text(messages) == expected

    def test_extract_no_assistant_messages(self):
        messages = [
            {"role": "user", "content": "Hello!", "sender": "Player"},
            {"role": "user", "content": "Is anyone there?", "sender": "Player"}
        ]
        expected = ""
        assert extract_response_text(messages) == expected

    def test_extract_empty_messages(self):
        messages = []
        expected = ""
        assert extract_response_text(messages) == expected
