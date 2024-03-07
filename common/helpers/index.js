const { bot } = require("../../botConfig");

const sendPhotoToChat = async (groupId, screenshot) => {
  try {
    if (Array.isArray(screenshot)) {
      await bot.sendPhoto(groupId, screenshot[0].file_id);
    } else {
      await bot.sendDocument(groupId, screenshot.file_id);
    }
  } catch (error) {
    console.error("Ошибка отправки фотографии:", error);
  }
};

const checkNeedSum = (str) => {
  const checkFullNumber = /^\d+$/.test(str);
  if (checkFullNumber) return Number(str) > 50;
  return false;
};

module.exports = {
  sendPhotoToChat,
  checkNeedSum
};
