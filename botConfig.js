const TelegramApi = require("node-telegram-bot-api");
const { commandsBtns } = require("./common/constants/commands");
require("dotenv").config();

const targetChannelId = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKENN;
const replenishmentGroupId = process.env.REPLENISHMENT_GROUP_ID;
const conclusionGroupId = process.env.CONCLUSION_GROUP_ID;
const accessAcconts = {
  aktan: process.env.AKTAN,
  kairat: process.env.KAIRAT,
  proger: process.env.PROGER,
};

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands(commandsBtns);

module.exports = {
  targetChannelId,
  bot,
  replenishmentGroupId,
  conclusionGroupId,
  accessAcconts,
};
