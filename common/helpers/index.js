const { bot } = require("../../botConfig");
const { btnType } = require("../constants/commands");
const { setAdminOptions } = require("../constants/options");

const sendPhotoToChat = async (groupId, screenshot, foundUser) => {
  const caption = ` ТИП ОПЕРАЦИИ: ПОПОЛНЕНИЕ

ID - ${foundUser.accountId}
СУММА - ${foundUser.replenishmentAmount} cом
ОПЛАТА - ${
    foundUser.refillmentMethod === btnType.mbank ? "Mbank" : "О Деньги!"
  }`;

  try {
    if (Array.isArray(screenshot)) {
      await bot.sendPhoto(groupId, screenshot[0].file_id, {
        caption,
        reply_markup: setAdminOptions(foundUser.chatId).reply_markup,
      });
    } else {
      await bot.sendDocument(groupId, screenshot.file_id, {
        caption,
        reply_markup: setAdminOptions(foundUser.chatId).reply_markup,
      });
    }
  } catch (error) {
    console.error("Ошибка отправки фотографии:", error);
  }
};

const checkNeedSum = (str) => {
  const checkFullNumber = /^\d+$/.test(str);
  if (checkFullNumber) return Number(str) >= 50;
  return false;
};

const getUserChatIdFromAdmin = (str) => {
  let number = str.match(/\d+/)[0];
  return number;
};

module.exports = {
  sendPhotoToChat,
  checkNeedSum,
  getUserChatIdFromAdmin,
};
