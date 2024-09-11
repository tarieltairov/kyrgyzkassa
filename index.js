const fs = require("fs");
const {
  bot,
  replenishmentGroupId,
  conclusionGroupId,
  accessAcconts,
  targetChannelId,
  dbToken,
} = require("./botConfig");
// bot.getUpdates()
const {
  commandsValues,
  btnType,
  reqMethod,
} = require("./common/constants/commands");

const {
  MESSAGE,
  setRequisites,
  REQUISITES,
} = require("./common/constants/message");

const {
  startOptions,
  replacementOptions,
  paymentOptions,
  conclusionOptions,
} = require("./common/constants/options");

const {
  checkNeedSum,
  sendConclusion,
  sendReplenishment,
  editAdminMessage,
  subscribeToChannel,
  sendUserChatId,
  getUsers,
  editAdmiMessageAfterSuspicious,
  sendAdminReqId,
  getCurrentReqId,
} = require("./common/helpers");
const { userStatusbyChannel } = require("./common/constants/other");
const mongoose = require("mongoose");

mongoose.connect(dbToken).then(() => {
  console.log("Connected to database!");
});

const start = async () => {
  console.log("Bot has been started!");

  try {
    let userInfo = [];
    let isBotActive = true;
    const turnOnBot = () => {
      isBotActive = true;
      console.log("Bot has been turned on!");
    };

    const turnOffBot = () => {
      isBotActive = false;
      console.log("Bot has been turned off!");
    };

    const cancel = (chatId) => {
      userInfo = userInfo.filter((item) => item.chatId !== chatId);
      bot.sendMessage(chatId, MESSAGE.CANCEL);
    };

    const addNewUser = async (chatId, user) => {
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
        user,
      };
      const prossessIsStart = userInfo.some((user) => user.chatId === chatId);
      if (!prossessIsStart) {
        userInfo.push(newUserInfo);
      } else {
        userInfo = userInfo.map((item) => {
          if (item.chatId === chatId) {
            return newUserInfo;
          }
          return item;
        });
      }
      sendUserChatId(chatId);
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
      await sendReplenishment(foundUser);
      return cancel(foundUser.chatId);
    };

    const sendConclusionUserInfo = async (foundUser) => {
      await sendConclusion(foundUser);
      return cancel(foundUser.chatId);
    };

    bot.on("message", async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;
      const userName = msg.chat.username;
      const isNotAdminGroups =
        chatId !== replenishmentGroupId && chatId !== conclusionGroupId;
      const isAccessAccount = Object.values(accessAcconts).some(
        (item) => item == msg.from.id
      );
      bot
        .getChatMember(targetChannelId, msg.from.id)
        .then(async (chatMember) => {
          if (chatMember.status === userStatusbyChannel.left) {
            return subscribeToChannel(chatId, targetChannelId);
          } else {
            if (isBotActive) {
              if (isNotAdminGroups) {
                if (isAccessAccount) {
                  if (text === commandsValues.botTurnOn) {
                    return bot.sendMessage(chatId, MESSAGE.BOT_ON_YET);
                  }
                  if (text === commandsValues.botTurnOff) {
                    turnOffBot();
                    return bot.sendMessage(chatId, MESSAGE.BOT_OFF);
                  }
                  if (
                    text === commandsValues.aktan ||
                    text === commandsValues.kairat ||
                    text === commandsValues.aidai ||
                    text === commandsValues.kydyr
                  ) {
                    await sendAdminReqId(text);
                    return bot.sendMessage(
                      chatId,
                      `Реквизиты изменены на ваши ${
                        REQUISITES.find((i) => i.id === text).name
                      }`
                    );
                  }
                  if (text === commandsValues.botIsWorking) {
                    const res = await getUsers();
                    if (res.length) {
                      return res.forEach((user) => {
                        bot.sendMessage(
                          user.userChatId,
                          MESSAGE.BOT_IS_WORKING
                        );
                      });
                    } else {
                      await bot.sendMessage(chatId, MESSAGE.EMPTY_DB);
                      return bot.sendMessage(chatId, MESSAGE.BOT_IS_WORKING);
                    }
                  }
                }

                if (text === commandsValues.cancel) {
                  return cancel(chatId);
                }

                if (text === commandsValues.start) {
                  await addNewUser(chatId, userName);
                  return bot.sendMessage(chatId, MESSAGE.START, startOptions);
                }

                const foundUser = userInfo.find(
                  (item) => item.chatId === chatId
                );

                if (foundUser) {
                  if (foundUser.currentStep === 1) {
                    if (checkNeedSum(text)) {
                      foundUser.replenishmentAmount = text;
                      await udpatedSteps(chatId);
                      return bot.sendPhoto(
                        chatId,
                        fs.readFileSync("common/assets/images/photo.jpg"),
                        { caption: MESSAGE.ACCOUNT_ID }
                      );
                    } else {
                      return bot.sendMessage(chatId, MESSAGE.SUM_RULES);
                    }
                  }

                  if (
                    foundUser.currentStep === 2 &&
                    !foundUser.isFullAccountId
                  ) {
                    foundUser.accountId = text;
                    foundUser.isFullAccountId = true;
                    const currentAdminReqId = await getCurrentReqId();
                    setRequisites(currentAdminReqId);
                    return bot.sendMessage(
                      chatId,
                      MESSAGE.REQUISITES,
                      paymentOptions
                    );
                  }

                  if (foundUser.currentStep === 3) {
                    if ("document" in msg || "photo" in msg) {
                      foundUser.screenshot = msg.document || msg.photo;
                      await bot.sendMessage(
                        chatId,
                        MESSAGE.APPLICATION_ACCEPTED
                      );
                      return sendUserInfoToOut(foundUser);
                    } else {
                      return bot.sendMessage(chatId, MESSAGE.SCREENSHOT);
                    }
                  }
                  if (!foundUser.isPaid && foundUser.currentStep === 2) {
                    const currentAdminReqId = await getCurrentReqId();
                    setRequisites(currentAdminReqId);
                    return bot.sendMessage(
                      chatId,
                      MESSAGE.REQUISITES,
                      paymentOptions
                    );
                  }
                  if (foundUser.currentStep === 5) {
                    foundUser.conclusionRequisites = text;
                    udpatedSteps(chatId);
                    return bot.sendPhoto(
                      chatId,
                      fs.readFileSync("common/assets/images/photo.jpg"),
                      { caption: MESSAGE.ACCOUNT_ID }
                    );
                  }
                  if (foundUser.currentStep === 6) {
                    foundUser.conclusionAccountId = text;
                    udpatedSteps(chatId);
                    await bot.sendMessage(chatId, MESSAGE.CODE_INSTRUCTION);
                    return bot.sendMessage(chatId, MESSAGE.CODE);
                  }
                  if (foundUser.currentStep === 7) {
                    foundUser.conclusionCode = text;
                    udpatedSteps(chatId);
                    return bot.sendMessage(
                      chatId,
                      MESSAGE.CONCLUSION_SUM_RULES
                    );
                  }
                  if (foundUser.currentStep === 8) {
                    foundUser.conlusionAmount = text;
                    await bot.sendMessage(chatId, MESSAGE.CONCLUSION_ACCEPTED);
                    return sendConclusionUserInfo(foundUser);
                  }
                }

                return bot.sendMessage(chatId, MESSAGE.WRONG);
              }
            } else {
              if (isAccessAccount) {
                if (text === commandsValues.botTurnOn) {
                  turnOnBot();
                  return bot.sendMessage(chatId, MESSAGE.BOT_ON);
                }
                if (text === commandsValues.botTurnOff) {
                  return bot.sendMessage(chatId, MESSAGE.BOT_OFF_YET);
                }
              }
              return bot.sendMessage(chatId, MESSAGE.BOT_OFF_CLIENT);
            }
          }
        });
    });

    bot.on("callback_query", async (msg) => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      const messageId = msg.message.message_id;
      const foundUser = userInfo.find((item) => item.chatId === chatId);

      if (data === btnType.startAfterSubscribe) {
        bot
          .getChatMember(targetChannelId, msg.from.id)
          .then(async (chatMember) => {
            await bot.deleteMessage(chatId, messageId);
            if (chatMember.status === userStatusbyChannel.left) {
              return subscribeToChannel(chatId, targetChannelId);
            } else {
              return bot.sendMessage(chatId, MESSAGE.YOU_ARE_SUBSCRIBED);
            }
          });
      }

      if (foundUser) {
        if (!isBotActive) {
          return bot.sendMessage(chatId, MESSAGE.BOT_OFF_CLIENT);
        }
        if (data === btnType.replacement) {
          await bot.deleteMessage(chatId, messageId);
          await bot.sendMessage(chatId, "📥");
          return bot.sendMessage(
            chatId,
            MESSAGE.REFILLMENT_METHOD,
            replacementOptions
          );
        }

        if (
          data === btnType.kompanion ||
          data === btnType.bakai ||
          data === btnType.optima ||
          data === btnType.mbank
        ) {
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

        if (
          data === btnType.conclusionKompanion ||
          data === btnType.conclusionBakai ||
          data === btnType.conclusionOptima ||
          data === btnType.conclusionMbank
        ) {
          foundUser.conlusionRefillmentMethod = data;
          udpatedSteps(chatId, 5);
          await bot.deleteMessage(chatId, messageId);
          await bot.sendMessage(chatId, `Метод вывода: ${reqMethod[data]}`);
          return bot.sendMessage(chatId, MESSAGE.CONCLUSION_REQUISITES);
        }
      }

      // --------------------admin actions ----------------------
      if (data.includes(btnType.accept)) {
        return editAdminMessage(msg, btnType.accept);
      }
      if (data.includes(btnType.reject)) {
        return editAdminMessage(msg, btnType.reject);
      }
      if (data.includes(btnType.suspicious)) {
        return editAdmiMessageAfterSuspicious(msg, true);
      }
      if (data.includes(btnType.normal)) {
        return editAdmiMessageAfterSuspicious(msg, false);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};

start();
