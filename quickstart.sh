#!/bin/bash

# BadPeopleOnline Quick Start Script
# This script helps you set up and run BadPeopleOnline locally

set -e

echo "🎮 BadPeopleOnline Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old (found v$NODE_VERSION)"
    echo "Please upgrade to Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "You can start it with: brew services start mongodb-community (macOS)"
        echo "Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    fi
else
    echo "⚠️  MongoDB not found locally"
    echo "You can use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Set up environment file
if [ ! -f .env ]; then
    echo "Creating server/.env file..."
    cp .env.example .env
    echo "✅ Created server/.env - please update with your settings"
else
    echo "✅ server/.env already exists"
fi

cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "🌱 Optional: Seed the database with sample questions"
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    cd server
    node src/utils/seedQuestions.js || echo "⚠️  Could not seed database (MongoDB might not be running)"
    cd ..
fi

echo ""
echo "🚀 Ready to start!"
echo ""
echo "To run the application:"
echo "  1. Open two terminal windows"
echo "  2. In terminal 1: cd server && npm run dev"
echo "  3. In terminal 2: cd client && npm run dev"
echo ""
echo "Or run both at once: npm run dev"
echo ""
echo "The app will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo "📖 For more information, see docs/GETTING_STARTED.md"
echo ""

# Ask if user wants to start now
read -p "Start the application now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting BadPeopleOnline..."
    npm run dev
fi
