import express from "express";
import TelegramService from "@src/services/telegram.service";
import UserService from "@src/services/user.service";

const callbackRoute = express.Router();

callbackRoute.get('/', (req, res) => {
  const {scopes, code, state} = req.query;
  if (!scopes || !code || !state) {
    res.send("Invalid response.");
  } else {
    // TODO: check enough scopes
    // const user = UserService.getUserByTelegramId()
    // TelegramService.bot.sendMessage();

  }
});

export default callbackRoute;
