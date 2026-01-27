# 🐧 Penguin Clicker

A Telegram Mini App clicker game where you tap to fish, build your igloo, and dominate the Antarctic!

![Penguin Clicker](public/images/penguin-main.png)

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Your Telegram Bot token (from @BotFather)

### 1. Setup Environment
```bash
cd penguin-clicker
cp .env.example .env.local
```

Edit `.env.local` and add your bot token.

### 2. Build and Run
```bash
# Development mode (with hot reload)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Game
Open http://localhost:3000 in your browser.

## 📱 Testing in Telegram

1. Message @BotFather
2. Send `/mybots` → Select your bot
3. Select "Bot Settings" → "Menu Button" or "Configure Mini App"
4. Enter your deployed URL (from Netlify)

## 🛠️ Development Commands

```bash
# Start development server
docker-compose up

# Rebuild after changes to package.json
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

## 📦 Deploy to Netlify

1. Fork/Clone this repository
2. Go to [Netlify](https://app.netlify.com)
3. "Import from Git"
4. Select repository
5. Deploy! (Settings are pre-configured in `netlify.toml` / `next.config.js`)

## 📁 Project Structure

```
penguin-clicker/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/
│   └── game/
│       └── Game.tsx    # Core game logic
├── public/
│   └── images/         # Game assets (Penguins, Backgrounds)
├── Dockerfile          # Development Dockerfile
└── docker-compose.yml  # Docker Compose config
```

## 🎮 Game Features

- ✅ Tap to earn Fish (🐟)
- ✅ Idle income generation (Auto-Fishers)
- ✅ 5 upgrades to buy (Rods, Nets, Boats)
- ✅ 8 luxury assets (Shiny Pebble -> South Pole)
- ✅ Staff recruitment (Baby Penguin, Emperor)
- ✅ Prestige system (Migrate South)
- 🔜 Coin launch simulator
- 🔜 Telegram Cloud Storage
- 🔜 Phantom wallet integration

## 📄 License

MIT
