interface User {
  telegramId: number;
  username: string;
  languageCode: string;
  firstName: string;
  lastName: string;
}

interface AdmobConnection {
  owner: User | import("mongoose").Schema.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
}
