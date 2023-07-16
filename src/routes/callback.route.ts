import express from "express";
import jwt from "jsonwebtoken";
import userService from "@src/services/user.service";
import telegramService from "@src/services/telegram.service";
import admobService from "@src/services/admob.service";

const callbackRoute = express.Router();

callbackRoute.get('/', async (req, res) => {
  const {scope, code, state} = req.query;
  if (!scope || !code || !state) {
    res.send("Invalid response.");
  } else {
    // TODO: check enough scopes
    // const user = UserService.getUserByTelegramId()
    // TelegramService.bot.sendMessage();
    const isVerified = jwt.verify(state, process.env.JWT_SECRET);
    if (isVerified) {
      const data = jwt.decode(state);
      const {user: userId, creationTime, iat} = data;
      const user = await userService.getUser(userId);

      // Connect
      const oauthClient = admobService.getOauthClient();
      const {tokens} = await oauthClient.getToken(code as string);

      await admobService.connectFromOauth(user, tokens);

      await telegramService.bot.sendMessage(user.telegramId, 'Admob Connected.');
      res.send("Connected, please return to Telegram Bot.");
    } else {
      res.send("Failed to verify request.");
    }
  }
});

export default callbackRoute;
