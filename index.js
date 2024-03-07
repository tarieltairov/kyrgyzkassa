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
} = require("./common/constants/options");
const { sendPhotoToChat } = require("./common/helpers");

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
  };
  userInfo.push(newUserInfo);
};

const udpatedSteps = async (chatId) => {
  const updated = userInfo?.map((item) => {
    if (item.chatId === chatId) {
      return {
        ...item,
        currentStep: item.currentStep + 1,
      };
    }
    return item;
  });
  userInfo = updated;
};

const sendUserInfoToOut = async (foundUser) => {
  await bot.sendMessage(
    groupId,
    `id аккаунта - ${foundUser.accountId}
сумма пополнения  - ${foundUser.replenishmentAmount}`
  );
  await sendPhotoToChat(groupId, foundUser.screenshot);
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
      foundUser.replenishmentAmount = text;
      await udpatedSteps(chatId);
      return bot.sendMessage(chatId, MESSAGE.ACCOUNT_ID);
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
  }

  return bot.sendMessage(chatId, MESSAGE.WRONG);
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const messageId = msg.message.message_id;
  if (data === btnType.replacement) {
    await bot.deleteMessage(chatId, messageId);
    return bot.sendMessage(
      chatId,
      MESSAGE.REFILLMENT_METHOD,
      replacementOptions
    );
  }

  if (data === btnType.mbank || data === btnType.omoney) {
    udpatedSteps(chatId);
    await bot.deleteMessage(chatId, messageId);
    const answer = await bot.sendMessage(
      chatId,
      MESSAGE.SUM_RULES
      // {
      //   reply_markup: {
      //     force_reply: true,
      //   },
      // }
    );

    console.log("answer", answer);
  }

  if (data === btnType.paid) {
    const foundUser = userInfo.find((item) => item.chatId === chatId);
    foundUser.isPaid = true;
    udpatedSteps(chatId);
    await bot.deleteMessage(chatId, messageId);
    return bot.sendMessage(chatId, MESSAGE.SCREENSHOT);
  }
});
