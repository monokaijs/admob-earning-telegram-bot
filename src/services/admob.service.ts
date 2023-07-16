import fs from "fs";
import process from "process";
import {admob_v1beta, google, oauth2_v2} from "googleapis";
import {Credentials} from "google-auth-library";
import {UserDoc} from "@src/models/user.model";
import {AdmobConnectionDoc, AdmobConnectionModel} from "@src/models/admob-connection.model";
import telegramService from "@src/services/telegram.service";
import Admob = admob_v1beta.Admob;

class AdmobService {
  credentials = JSON.parse(fs.readFileSync(process.env.CREDENTIAL_FILE_PATH, {
    encoding: 'utf-8'
  })).web;

  register() {
  }

  async getAdmobPubAccounts(admob: Admob) {
    const {data: {account: accounts}} = await admob.accounts.list();
    return accounts;
  }

  async getStatistics(user: UserDoc) {
    const connection = await this.getUserConnection(user);
    const admob = await this.getAdmobAuthorized(connection);
    if (!connection.defaultAccount || !connection.defaultAccount.publisherId) {
      const {data: {account: accounts}} = await admob.accounts.list();
      await telegramService.bot.sendMessage(user.telegramId, "You haven't set a default publisher account yet. Select one below to continue...", {
        reply_markup: {
          inline_keyboard: [
            accounts.map((account) => {
              return {
                text: account.publisherId,
                callback_data: 'setDefaultAcc:' + account.name
              }
            })
          ]
        }
      });
      return;
    } else {
      console.log('wow', connection.defaultAccount);
    }

  }

  async getAdmobAuthorized(connection: AdmobConnectionDoc) {
    const authClient = await this.getOauthClient();
    authClient.setCredentials({
      access_token: connection.accessToken,
      id_token: connection.idToken,
      refresh_token: connection.refreshToken,
    });
    const admob = google.admob('v1beta');
    admob.context.google._options.auth = authClient;
    return admob;
  }

  getOauthClient() {
    const credentials = this.credentials;
    const redirectUri = `${process.env.DEPLOYMENT_URL}/callback`;
    return new google.auth.OAuth2(credentials.client_id, credentials.client_secret, redirectUri);
  }

  getAuthUrl(state: string) {
    const oauthClient = this.getOauthClient();

    const scopes = [
      'https://www.googleapis.com/auth/admob.readonly',
      'https://www.googleapis.com/auth/admob.report'
    ];
    return oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state,
    });
  }

  async connectFromOauth(user: UserDoc, credentials: Credentials) {
    let connection = await AdmobConnectionModel.findOne({
      owner: user._id,
    });
    if (!connection) {
      connection = await AdmobConnectionModel.create({
        owner: user._id,
        accessToken: credentials.access_token,
        idToken: credentials.id_token,
        refreshToken: credentials.refresh_token,
        expirationTime: credentials.expiry_date,
      })
    } else {
      connection.accessToken = credentials.access_token;
      connection.refreshToken = credentials.refresh_token;
      connection.idToken = credentials.id_token;
      connection.expirationTime = credentials.expiry_date;

      await connection.save();
    }

    return connection;
  }

  async disconnect(user: UserDoc) {
    await AdmobConnectionModel.deleteOne({
      owner: user._id
    });
    await telegramService.bot.sendMessage(user.telegramId, "Success! Admob account has been disconnected. Now you can connect again.");
  }

  async isUserConnected(user: UserDoc) {
    return !!(await AdmobConnectionModel.findOne({
      owner: user._id,
    }));
  }

  async getUserConnection(user: UserDoc) {
    return AdmobConnectionModel.findOne({
      owner: user._id,
    })
  }
}

export default new AdmobService();
