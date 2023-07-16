import express from "express";
import callbackRoute from "@src/routes/callback.route";

class WebserverService {
  register() {
    const app = express();
    app.use('/callback', callbackRoute);

    app.listen(process.env.PORT, () => {
      console.log('Webserver is now online');
    });
  }
}

export default new WebserverService();
