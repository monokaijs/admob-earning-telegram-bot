import fs from "fs";
import process from "process";
import {google, oauth2_v2} from "googleapis";
import {Credentials} from "google-auth-library";
import {UserDoc} from "@src/models/user.model";
import {AdmobConnectionModel} from "@src/models/admob-connection.model";

class AdmobService {
  credentials = JSON.parse(fs.readFileSync(process.env.CREDENTIAL_FILE_PATH, {
    encoding: 'utf-8'
  })).web;

  register() {
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

  async isUserConnected(user: UserDoc) {
    return !!(await AdmobConnectionModel.findOne({
      owner: user._id,
    }));
  }
}

export default new AdmobService();
