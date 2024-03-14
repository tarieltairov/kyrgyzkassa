const TelegramApi = require("node-telegram-bot-api");
const { commandsBtns } = require("./common/constants/commands");

const token = "7040341581:AAEWqVvHe00KWU9-jIvFsUZwKUmT6tebS3A";

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands(commandsBtns);

const replenishmentGroupId = -4192521636;
const conclusionGroupId = -4171897579;

module.exports = {
  bot,
  replenishmentGroupId,
  conclusionGroupId
};
