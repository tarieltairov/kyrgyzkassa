const fs = require("fs");
const { bot, groupId } = require("./botConfig");
const {
  commandsBtns,
  commandsValues,
  btnType,
} = require("./common/constants/commands");
const { MESSAGE } = require("./common/constants/message");
const {
  startOptions,
  replacementOptions,
  paymentOptions,
  conclusionOptions,
  setAdminOptions,
} = require("./common/constants/options");
const {
  sendPhotoToChat,
  checkNeedSum,
  getUserChatIdFromAdmin,
} = require("./common/helpers");

console.log("Bot has been started!");
bot.setMyCommands(commandsBtns);

let userInfo = [];
const cancel = (chatId) => {
  userInfo = userInfo.filter((item) => item.chatId !== chatId);
  bot.sendMessage(chatId, MESSAGE.CANCEL);
};

const addNewUser = async (chatId) => {
  let newUserInfo = {
    chatId,
    currentStep: 0,
    replenishmentAmount: "",
    accountId: "",
    isFullAccountId: false,
    isPaid: false,
    screenshot: null,
    refillmentMethod: "",
    conclusionRequisites: "",
    conclusionAccountId: "",
    conclusionCode: "",
    conlusionRefillmentMethod: "",
    conlusionAmount: "",
    lastApplicationDate: "",
  };
  userInfo.push(newUserInfo);
};

const udpatedSteps = async (chatId, step = 1) => {
  const updated = userInfo?.map((item) => {
    if (item.chatId === chatId) {
      return {
        ...item,
        currentStep: item.currentStep + step,
      };
    }
    return item;
  });
  userInfo = updated;
};

const sendUserInfoToOut = async (foundUser) => {
  await sendPhotoToChat(groupId, foundUser.screenshot, foundUser);
  return cancel(foundUser.chatId);
};

const sendConclusionUserInfo = async (foundUser) => {
  await bot.sendMessage(
    groupId,
    `ТИП ОПЕРАЦИИ: ВЫВОД
  
id аккаунта - ${foundUser.conclusionAccountId}
способ приема оплаты - ${
      foundUser.conlusionRefillmentMethod === btnType.conclusionMbank
        ? "Mbank"
        : "О Деньги!"
    }
реквизиты - ${foundUser.conclusionRequisites}
сумма вывода - ${foundUser.conlusionAmount} сом
код - ${foundUser.conclusionCode}`,
    setAdminOptions(foundUser.chatId)
  );
  return cancel(foundUser.chatId);
};

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === commandsValues.cancel) {
    return cancel(chatId);
  }

  if (text === commandsValues.start) {
    await addNewUser(chatId);
    return bot.sendMessage(chatId, MESSAGE.START, startOptions);
  }

  const foundUser = userInfo.find((item) => item.chatId === chatId);

  if (foundUser) {
    if (foundUser.currentStep === 1) {
      if (checkNeedSum(text)) {
        foundUser.replenishmentAmount = text;
        await udpatedSteps(chatId);
        return bot.sendMessage(chatId, MESSAGE.ACCOUNT_ID);
      } else {
        return bot.sendMessage(chatId, MESSAGE.SUM_RULES);
      }
    }

    if (foundUser.currentStep === 2 && !foundUser.isFullAccountId) {
      foundUser.accountId = text;
      foundUser.isFullAccountId = true;
      return bot.sendMessage(chatId, MESSAGE.REQUISITES, paymentOptions);
    }

    if (foundUser.currentStep === 3) {
      if ("document" in msg || "photo" in msg) {
        foundUser.screenshot = msg.document || msg.photo; 
        await bot.sendMessage(chatId, MESSAGE.APPLICATION_ACCEPTED);
        return sendUserInfoToOut(foundUser);
      } else {
        return bot.sendMessage(chatId, MESSAGE.SCREENSHOT);
      }
    }
    if (!foundUser.isPaid && foundUser.currentStep === 2) {
      return bot.sendMessage(chatId, MESSAGE.REQUISITES, paymentOptions);
    }
    if (foundUser.currentStep === 5) {
      foundUser.conclusionRequisites = text;
      udpatedSteps(chatId);
      return bot.sendPhoto(
        chatId,
        fs.readFileSync("common/assets/images/photo.jpg"),
        {
          caption:
            "Введите номер счёта, с которого выводите средства (1xBET ID)",
        }
      );
    }
    if (foundUser.currentStep === 6) {
      foundUser.conclusionAccountId = text;
      udpatedSteps(chatId);
      return bot.sendMessage(chatId, MESSAGE.CODE);
    }
    if (foundUser.currentStep === 7) {
      foundUser.conclusionCode = text;
      udpatedSteps(chatId);
      return bot.sendMessage(chatId, MESSAGE.CONCLUSION_SUM_RULES);
    }
    if (foundUser.currentStep === 8) {
      foundUser.conlusionAmount = text;
      await bot.sendMessage(chatId, MESSAGE.CONCLUSION_ACCEPTED);
      return sendConclusionUserInfo(foundUser);
    }
  }

  return bot.sendMessage(chatId, MESSAGE.WRONG);
});

bot.on("callback_query", async (msg) => {
  console.log("msg", msg);
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const messageId = msg.message.message_id;
  const foundUser = userInfo.find((item) => item.chatId === chatId);
  if (foundUser) {
    if (data === btnType.replacement) {
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(chatId, "📥");
      return bot.sendMessage(
        chatId,
        MESSAGE.REFILLMENT_METHOD,
        replacementOptions
      );
    }

    if (data === btnType.mbank || data === btnType.omoney) {
      foundUser.refillmentMethod = data;
      udpatedSteps(chatId);
      await bot.deleteMessage(chatId, messageId);
      return bot.sendMessage(chatId, MESSAGE.SUM_RULES);
    }

    if (data === btnType.paid) {
      foundUser.isPaid = true;
      udpatedSteps(chatId);
      await bot.deleteMessage(chatId, messageId);
      return bot.sendMessage(chatId, MESSAGE.SCREENSHOT);
    }

    if (data === btnType.conclusion) {
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(chatId, "📤");
      return bot.sendMessage(chatId, MESSAGE.CONCLUSION, conclusionOptions);
    }

    if (data === btnType.conclusionMbank || data === btnType.conclusionOmoney) {
      foundUser.conlusionRefillmentMethod = data;
      udpatedSteps(chatId, 5);
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(
        chatId,
        `Метод вывода: ${
          data === btnType.conclusionMbank ? "Mbank" : "О Деньги!"
        }`
      );
      return bot.sendMessage(chatId, MESSAGE.CONCLUSION_REQUISITES);
    }
  }

  // --------------------admin actions ----------------------
  if (data.includes(btnType.accept)) {
    // await bot.editMessageText("время ", {
    //   chat_id: chatId,
    //   message_id: messageId,
    // });
    await bot.editMessageCaption(
      msg.message.caption + "\n\n" + "ПРИНЯТО за ...",
      {
        chat_id: chatId,
        message_id: messageId,
      }
    );
    return bot.sendMessage(
      getUserChatIdFromAdmin(data),
      "✅ ваша последняя заявка принята"
    );
  }
  bot.getMessage;
  if (data.includes(btnType.reject)) {
    return bot.sendMessage(
      getUserChatIdFromAdmin(data),
      "❌ ваша последняя заявка отклонена"
    );
  }
});
