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
const User = require("../../models/users.model");
const Requisite = require("../../models/requisites.model");

const suspiciousUser = async (userChatId, suspicious) => {
  try {
    const newData = { ...userChatId, suspicious };
    const result = await User.updateOne({ userChatId }, newData);
    if (result.nModified === 0) {
      console.log("Пользователь не найден");
    }
    console.log("Данные пользователя успешно обновлены");
  } catch (error) {
    console.log(error);
  }
};

const sendReplenishment = async (foundUser) => {
  const existingUser = await User.findOne({
    userChatId: foundUser.chatId,
  });

  const caption = `${
    !!existingUser.suspicious ? MESSAGE.SUSPICIOUS : ""
  }ТИП ОПЕРАЦИИ: ПОПОЛНЕНИЕ
  
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
          reply_markup: setAdminOptions(
            foundUser.chatId,
            !!existingUser.suspicious
          ).reply_markup,
        }
      );
    } else {
      await bot.sendDocument(
        replenishmentGroupId,
        foundUser.screenshot.file_id,
        {
          caption,
          reply_markup: setAdminOptions(
            foundUser.chatId,
            !!existingUser.suspicious
          ).reply_markup,
        }
      );
    }
  } catch (error) {
    console.error("Ошибка отправки фотографии:", error);
  }
};

const checkNeedSum = (str) => {
  const checkFullNumber = /^\d+$/.test(str);
  if (checkFullNumber) return Number(str) >= 300;
  return false;
};

const getUserChatIdFromAdmin = (str) => {
  let number = str.match(/\d+/)[0];
  return number;
};

const sendConclusion = async (foundUser) => {
  const existingUser = await User.findOne({
    userChatId: foundUser.chatId,
  });
  const caption = `${
    !!existingUser.suspicious ? MESSAGE.SUSPICIOUS : ""
  }ТИП ОПЕРАЦИИ: ВЫВОД

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
      reply_markup: setAdminOptions(foundUser.chatId, !!existingUser.suspicious)
        .reply_markup,
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

const setSuspiciousText = (text) => {
  let inputString = text;
  let searchString = MESSAGE.SUSPICIOUS;
  let replaceString = "";
  if (inputString.includes(searchString)) {
    inputString = inputString.replace(searchString, replaceString);
  } else {
    inputString = searchString + "\n" + inputString;
  }
  return inputString;
};

const editAdmiMessageAfterSuspicious = async (msg, type) => {
  const admin_chat_id = msg.message.chat.id;
  const message_id = msg.message.message_id;
  const message_caption = setSuspiciousText(msg.message.caption);
  const user_chat_Id = getUserChatIdFromAdmin(msg.data);
  await suspiciousUser(user_chat_Id, type);
  return bot.editMessageCaption(message_caption, {
    chat_id: admin_chat_id,
    message_id,
    reply_markup: setAdminOptions(user_chat_Id, type).reply_markup,
  });
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

const sendUserChatId = async (userChatId) => {
  try {
    const existingUser = await User.findOne({
      userChatId,
    });
    if (!existingUser) {
      await User.create({ userChatId, suspicious: false });
      console.log("новый пользователь добавлен в бд");
    }
    console.log("такой пользователь уже есть в бд");
  } catch (error) {
    console.log("err", error);
  }
};

const getUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.log("err", error);
  }
};

const sendAdminReqId = async (reqId) => {
  try {
    const get = await Requisite.find({});
    await Requisite.updateOne({ reqId: get[0].reqId }, { reqId });
  } catch (error) {
    console.log("err", error);
  }
};

const getCurrentReqId = async () => {
  try {
    const check = await Requisite.find({});
    return check[0].reqId;
  } catch (error) {
    console.log("err", error);
  }
};

module.exports = {
  sendConclusion,
  sendReplenishment,
  checkNeedSum,
  getUserChatIdFromAdmin,
  calculateTimeDifference,
  editAdminMessage,
  subscribeToChannel,
  sendUserChatId,
  getUsers,
  suspiciousUser,
  editAdmiMessageAfterSuspicious,
  sendAdminReqId,
  getCurrentReqId,
};
