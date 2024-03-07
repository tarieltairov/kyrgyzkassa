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



module.exports = {
  sendPhotoToChat,
};
