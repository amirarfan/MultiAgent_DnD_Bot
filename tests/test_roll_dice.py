import pytest
from unittest.mock import patch
from configs.tools import roll_dice

class TestRollDice:
    
    @pytest.mark.parametrize("dice_type,num_dice,modifier,dc,expected", [
        (20, 1, 0, None, "Rolling 1d20 + 0: [4] = 4"),
        (6, 2, 3, None, "Rolling 2d6 + 3: [4, 4] = 11"),
        (12, 1, 5, 15, "Rolling 1d12 + 5: [4] = 9 (DC: 15, Failure)"),
        (20, 1, 2, 5, "Rolling 1d20 + 2: [4] = 6 (DC: 5, Success)")
    ])
    def test_roll_dice_variations(self, dice_type, num_dice, modifier, dc, expected, monkeypatch):
        def mock_randint(a, b):
            return 4
        monkeypatch.setattr("random.randint", mock_randint)
        result = roll_dice(dice_type, num_dice, modifier, dc)
        assert result == expected

    def test_roll_dice_invalid_dice_type(self):
        with pytest.raises(ValueError):
            roll_dice("invalid", 2, 3)

    @patch('configs.tools.random.randint')
    def test_roll_dice_negative_modifier(self, mock_randint):
        # Mock random.randint to return 4 and 4
        mock_randint.side_effect = [4, 4]
        result = roll_dice(6, 2, -1, None)
        assert result == "Rolling 2d6 + -1: [4, 4] = 7"

    def test_roll_dice_zero_dice(self):
        result = roll_dice(20, 0, 5, None)
        assert result == "Rolling 0d20 + 5: [] = 5"

    @patch('configs.tools.random.randint')
    def test_roll_dice_dc_none(self, mock_randint):
        # Mock random.randint to return 4
        mock_randint.return_value = 4
        result = roll_dice(10, 1, 2, None)
        assert result == "Rolling 1d10 + 2: [4] = 6"

    @patch('configs.tools.random.randint')
    def test_roll_dice_success_with_dc(self, mock_randint):
        # Example additional test with DC
        mock_randint.return_value = 15
        result = roll_dice(20, 1, 2, 10)
        assert result == "Rolling 1d20 + 2: [15] = 17 (DC: 10, Success)"

    @patch('configs.tools.random.randint')
    def test_roll_dice_failure_with_dc(self, mock_randint):
        # Example additional test with DC
        mock_randint.return_value = 5
        result = roll_dice(20, 1, 2, 10)
        assert result == "Rolling 1d20 + 2: [5] = 7 (DC: 10, Failure)"
