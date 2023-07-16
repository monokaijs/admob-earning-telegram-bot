import TelegramBot from "node-telegram-bot-api";
import {UserModel} from "@src/models/user.model";

class UserService {
  async checkFirstUse(msg: TelegramBot.Message) {
    const userTelegramId = msg.from.id;
    return !(await UserModel.exists({
      telegramId: userTelegramId
    }));
  }

  async prepareUser(msg: TelegramBot.Message) {
    const userTelegramId = msg.from.id;
    if (await this.checkFirstUse(msg)) {
      // first use? create one
      return await UserModel.create({
        telegramId: userTelegramId,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username,
        languageCode: msg.from.language_code,
      });
    } else {
      return UserModel.findOne({
        telegramId: userTelegramId,
      });
    }
  }

  getUserByTelegramId(id: number) {
    return UserModel.findOne({
      telegramId: id
    });
  }

  getUser(id: string) {
    return UserModel.findById(id);
  }
}

export default new UserService();
