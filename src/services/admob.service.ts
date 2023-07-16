import fs from "fs";
import process from "process";
import {google} from "googleapis";

class AdmobService {
  credentials = JSON.parse(fs.readFileSync(process.env.CREDENTIAL_FILE_PATH, {
    encoding: 'utf-8'
  })).web;

  register() {

  }

  getAuthUrl(state: string) {
    const credentials = this.credentials;
    console.log('credentials', credentials);
    const redirectUri = `${process.env.DEPLOYMENT_URL}/callback`;
    console.log('redirect uri', redirectUri);
    const oauth2Client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, redirectUri);

    const scopes = [
      'https://www.googleapis.com/auth/admob.readonly',
      'https://www.googleapis.com/auth/admob.report'
    ];
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state,
    });
  }
}

export default new AdmobService();
