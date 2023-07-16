import TelegramBot from "node-telegram-bot-api";
import userService from "@src/services/user.service";
import admobService from "@src/services/admob.service";
import jwt from "jsonwebtoken";
import process from "process";

class TelegramService {
  bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
  }

  async register() {
    const bot = this.bot;

    await bot.setMyCommands([{
      command: 'start',
      description: 'Initialize the chat'
    }, {
      command: 'menu',
      description: 'Show menu with options'
    }, {
      command: 'connect',
      description: 'Connect Admob account'
    }]);

    this.listen(bot).then(() => null);
  }

  async listen(bot) {
    bot.onText(/\/start/, async (msg) => {
      const isFirstUse = await userService.checkFirstUse(msg);
      await userService.prepareUser(msg);
      if (isFirstUse) {
        await bot.sendMessage(msg.from.id, 'Hello there, this is the first time you be there. To see the statistics, this bot must' +
          'have access to your Admob data.\n\n' +
          'To continue, please use /connect command to authorize this application access your account.\n\n' +
          'Have a good time.'
        );
      } else {
        await bot.sendMessage(msg.from.id, 'Welcome back, use /menu to show all options');
      }
    });
    bot.onText(/\/connect/, async (msg) => {
      const user = await userService.prepareUser(msg);
      const token = jwt.sign({
        user: user._id,
        creationTime: new Date().getTime(),
      }, process.env.JWT_SECRET);
      await bot.sendMessage(msg.chat.id, "Click below button to connect", {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Connect",
              url: admobService.getAuthUrl(token),
            }]
          ]
        }
      })
    });
    bot.onText(/\/menu/, async (msg) => {
      // show message
      const user = await userService.prepareUser(msg);
      if (await admobService.isUserConnected(user)) {
        await bot.sendMessage(msg.chat.id, '/statistics - Show statistics');
      } else {
        await bot.sendMessage(msg.chat.id, 'You have not connected to Admob. Please connect first using /connect command.');
      }
    });
    bot.onText(/\/statistics/, async (msg) => {
      const user = await userService.prepareUser(msg);
      const connection = await admobService.getUserConnection(user);
      // show message
      await admobService.getStatistics(connection);
    });
  };
}

export default new TelegramService();
