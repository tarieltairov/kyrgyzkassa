const {
  bot,
  conclusionGroupId,
  replenishmentGroupId,
} = require("../../botConfig");
const { btnType } = require("../constants/commands");
const { setAdminOptions } = require("../constants/options");
const fs = require("fs");

const sendReplenishment = async (foundUser) => {
  const caption = ` ТИП ОПЕРАЦИИ: ПОПОЛНЕНИЕ
  
ПОЛЬЗОВАТЕЛЬ - @${foundUser.user}
ID - ${foundUser.accountId}
СУММА - ${foundUser.replenishmentAmount} cом
ОПЛАТА - ${
    foundUser.refillmentMethod === btnType.mbank ? "Mbank" : "О Деньги!"
  }`;

  try {
    if (Array.isArray(foundUser.screenshot)) {
      await bot.sendPhoto(
        replenishmentGroupId,
        foundUser.screenshot[0].file_id,
        {
          caption,
          reply_markup: setAdminOptions(foundUser.chatId).reply_markup,
        }
      );
    } else {
      await bot.sendDocument(
        replenishmentGroupId,
        foundUser.screenshot.file_id,
        {
          caption,
          reply_markup: setAdminOptions(foundUser.chatId).reply_markup,
        }
      );
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

const sendConclusion = async (foundUser) => {
  const caption = `ТИП ОПЕРАЦИИ: ВЫВОД

  ПОЛЬЗОВАТЕЛЬ - @${foundUser.user}
  ID - ${foundUser.conclusionAccountId}
  ОПЛАТА - ${
    foundUser.conlusionRefillmentMethod === btnType.conclusionMbank
      ? "Mbank"
      : "О Деньги!"
  }
  РЕКВИЗИТЫ - ${foundUser.conclusionRequisites}
  СУММА ВЫВОДА - ${foundUser.conlusionAmount} сом
  КОД - ${foundUser.conclusionCode}`;
  bot.sendPhoto(
    conclusionGroupId,
    fs.readFileSync("common/assets/images/conclusion.jpg"),
    {
      caption,
      reply_markup: setAdminOptions(foundUser.chatId).reply_markup,
    }
  );
};

module.exports = {
  sendConclusion,
  sendReplenishment,
  checkNeedSum,
  getUserChatIdFromAdmin,
};
