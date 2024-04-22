const {
  bot,
  conclusionGroupId,
  replenishmentGroupId,
  targetChannelId,
} = require("../../botConfig");
const { btnType, reqMethod } = require("../constants/commands");
const { MESSAGE } = require("../constants/message");
const { setAdminOptions } = require("../constants/options");
const fs = require("fs");

const sendReplenishment = async (foundUser) => {
  const caption = ` ТИП ОПЕРАЦИИ: ПОПОЛНЕНИЕ
  
ПОЛЬЗОВАТЕЛЬ - @${foundUser.user}
ID - ${foundUser.accountId}
СУММА - ${foundUser.replenishmentAmount} cом
ОПЛАТА - ${reqMethod[foundUser.refillmentMethod]}`;

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
ОПЛАТА - ${reqMethod[foundUser.conlusionRefillmentMethod]}
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

const calculateTimeDifference = (sentTime, editTime) => {
  // Преобразование временных меток в миллисекунды
  const sentTimestamp = sentTime * 1000;
  const editTimestamp = editTime * 1000;

  // Вычисление разницы времени в миллисекундах
  const timeDifference = editTimestamp - sentTimestamp;

  // Преобразование разницы времени в секунды, минуты и часы
  const seconds = Math.floor((timeDifference / 1000) % 60);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

  // Формирование строки
  let timeString = "";
  if (hours > 0) {
    timeString += hours + " час ";
  }
  if (minutes > 0) {
    timeString += minutes + " минут ";
  }
  timeString += seconds + " секунд";

  return timeString;
};

const editAdminMessage = async (msg, type) => {
  const data = msg.data;
  const chat_id = msg.message.chat.id;
  const message_id = msg.message.message_id;
  const message_caption = msg.message.caption;
  const isAccept = type === btnType.accept;

  await bot
    .editMessageCaption(message_caption, {
      chat_id,
      message_id,
    })
    .then((res) => {
      bot.editMessageCaption(
        message_caption +
          "\n\n" +
          `${isAccept ? "ПРИНЯТО" : "ОТКЛОНЕНО"} за ${calculateTimeDifference(
            res.date,
            res.edit_date
          )}`,
        {
          chat_id,
          message_id,
        }
      );
    });

  return bot.sendMessage(
    getUserChatIdFromAdmin(data),
    isAccept ? MESSAGE.FULFILLED_APPLICATION : MESSAGE.REJECTED_APPLICATION
  );
};

const subscribeToChannel = (chatId) => {
  bot.getChat(targetChannelId).then((channel) => {
    bot.sendMessage(
      chatId,
      `Вы не являетесь участником канала\n"${channel.title}" 🙅‍♂️.\n\nПодпишитесь на канал 👇, чтобы пользоваться ботом 😉`,
      {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: "Подписаться на канал",
                url: channel.invite_link,
              },
            ],
            [
              {
                text: "Я подписался",
                callback_data: "startAfterSubscribe",
              },
            ],
          ],
        }),
      }
    );
  });
};

module.exports = {
  sendConclusion,
  sendReplenishment,
  checkNeedSum,
  getUserChatIdFromAdmin,
  calculateTimeDifference,
  editAdminMessage,
  subscribeToChannel,
};
