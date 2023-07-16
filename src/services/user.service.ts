import TelegramBot from "node-telegram-bot-api";
import {UserModel} from "@src/models/user.model";

class UserService {
  async checkFirstUse(msg: TelegramBot.Message) {
    const userTelegramId = msg.from.id;
    return !(await UserModel.exists({
      telegramId: userTelegramId
    }));
  }

  getUserByTelegramId(id: number) {
    return UserModel.findOne({
      telegramId: id
    });
  }
}

export default new UserService();
