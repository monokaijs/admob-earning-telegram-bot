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
    }, {
      command: 'disconnect',
      description: 'Disconnect Admob account'
    }]);

    this.listen(bot).then(() => null);
  }

  async listen(bot: TelegramBot) {
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
      // show message
      await admobService.getStatistics(user);
    });
    bot.onText(/\/disconnect/, async (msg) => {
      const user = await userService.prepareUser(msg);
      // show message
      await admobService.disconnect(user);
    });
    bot.on('callback_query', async (msg) => {
      const data = msg.data;
      const action = data.split(':')[0];
      const user = await userService.getUserByTelegramId(msg.from.id);
      const connection = await admobService.getUserConnection(user);
      switch (action) {
        case "setDefaultAcc":
          const accountId = data.split(':')[1];
          const admob = await admobService.getAdmobAuthorized(connection);
          const accounts = await admobService.getAdmobPubAccounts(admob);
          const pickedAccount = accounts.find(acc => acc.name === accountId);
          console.log(accounts, accountId);
          if (!pickedAccount) {
            await bot.sendMessage(msg.from.id, "Invalid account.");
          } else {
            connection.defaultAccount = pickedAccount;
            await connection.save();
            await bot.sendMessage(msg.from.id, 'Default publisher account has been set. Now you can use command /statistics to see revenue...');
          }
          break;
        default:
          await bot.sendMessage(msg.from.id, "Invalid action.");
          break;
      }
    });
  };
}

export default new TelegramService();
