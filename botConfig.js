const TelegramApi = require("node-telegram-bot-api");
const { commandsBtns } = require("./common/constants/commands");
require("dotenv").config();

const token = process.env.BOT_TOKENN;
const replenishmentGroupId = process.env.REPLENISHMENT_GROUP_ID;
const conclusionGroupId = process.env.CONCLUSION_GROUP_ID;

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands(commandsBtns);

module.exports = {
  bot,
  replenishmentGroupId,
  conclusionGroupId,
};
