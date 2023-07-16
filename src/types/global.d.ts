interface User {
  telegramId: number;
  username: string;
  languageCode: string;
  firstName: string;
  lastName: string;
}

interface AdmobConnection {
  owner: User | import("mongoose").Schema.Types.ObjectId;
  defaultAccount: import('googleapis').admob_v1beta.Schema$PublisherAccount;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expirationTime: number;
}
