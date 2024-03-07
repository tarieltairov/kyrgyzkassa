const TelegramApi = require("node-telegram-bot-api");

const token = "7040341581:AAEWqVvHe00KWU9-jIvFsUZwKUmT6tebS3A";

const bot = new TelegramApi(token, { polling: true });

const groupId = "-4112697287";

module.exports = {
  bot,
  groupId,
};
