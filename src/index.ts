import {config} from "dotenv";
config();
import moduleAlias from "module-alias";

moduleAlias.addAliases({
  "@src": `${__dirname}`,
  "@src/*": `${__dirname}/*`
});
import TelegramService from "@src/services/telegram.service";
import dbService from "@src/services/db.service";
import WebserverService from "@src/services/webserver.service";

dbService.connect().then(() => {
  console.log('Database connected');
  WebserverService.register();
  TelegramService.register().then(() => {
    console.log('Application ready');
  });
})

