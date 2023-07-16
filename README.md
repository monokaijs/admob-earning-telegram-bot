# Admob Earning Tracker Telegram Bot
*Author: monokaijs | https://monokaijs.com*

Since Google has decided to remove Admob Earning Tracker app from mobile platforms, I have been confusing of finding a way to track my earning on Admob Monetization Platform.

Well, install a third-party app is such a neck-pain, while opening admob web console on mobile devices is like a pain in my a**. So, hope this is helpful to you.

It's free, no ads, open-source. Maybe not well coded, but safe and secure.

## Installation
Clone this repository via HTTPS:
```shell
git clone https://github.com/monokaijs/admob-earning-telegram-bot.git
```
... or clone it via SSH:
```shell
git clone git@github.com:monokaijs/admob-earning-telegram-bot.git
```

Run commands below to get your application ready (for development):
```shell
cd ./admob-earning-telegram-bot/
yarn install
cp .env.example .env
```

Now, it's time to provide environment variables:
```env
# Path to Google Project OAuth Client JSON credentials file (.json)
CREDENTIAL_FILE_PATH=./credentials.json
# Telegram Token, use BotFather to get one: https://t.me/botfather
TELEGRAM_TOKEN=
# MongoDB, on the production, this should be docker containerized
MONGO_URI=mongodb://mongodb:27017/admob-tracker
# Webservice Port, 3000 for example
PORT=3000
# Production Deployment URL of Webservice, must be used as callback for your Google Consent Screen
DEPLOYMENT_URL=
# JWT Secret, use to protect your assss
JWT_SECRET=hello-there
```

Finally, use command below to start the development:
```shell
yarn start:dev
```

## Configure Google Project
Now I have to lead my Pinscher to the park, this readme is nonsense to non-tech people. So, if you're a technician, go ahead and read the code in the repo. I've tried to write everything as clearly as possible.
I will update this doc soon. Stay tuned.
