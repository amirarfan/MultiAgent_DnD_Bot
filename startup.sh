#!/bin/bash

echo "Starting setup..."

# Install system dependencies
echo "Installing system dependencies..."
apt-get update
apt-get install -y ffmpeg git python3-pip

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements with error handling
echo "Installing requirements..."
if ! pip install -r requirements.txt; then
    echo "Failed to install requirements"
    exit 1
fi

# Start the Discord bot
echo "Starting the Discord bot..."
python discord_bot.py
