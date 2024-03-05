const TelegramApi = require("node-telegram-bot-api");
const {
  commandsBtns,
  commandsValues,
  message,
} = require("./common/constants/commands");
const {
  startOptions,
  replacementOptions,
  paymentOptions,
} = require("./common/constants/options");

const token = "7040341581:AAEWqVvHe00KWU9-jIvFsUZwKUmT6tebS3A";
const bot = new TelegramApi(token, { polling: true });

let userSteps = [];
let userInfo = {
  replenishmentAmount: "",
  accountId: "",
  screenshot: null,
};

const cancel = (chatId) => {
  userSteps = userSteps.filter((item) => item.chatId !== chatId);
  userInfo = {
    replenishmentAmount: "",
    accountId: "",
    screenshot: null,
  };

  console.log("userSteps", userSteps);
  console.log("userInfo", userInfo);
};

const createNewSteps = async (chatId) => {
  let newChatStep = {
    chatId,
    currentStep: 1,
  };
  userSteps.push(newChatStep);
};

const udpatedSteps = async (chatId) => {
  const updated = userSteps.map((item) => {
    if (item.chatId === chatId) {
      return {
        ...item,
        currentStep: item.currentStep + 1,
      };
    }
    return item;
  });
  userSteps = updated;
};

bot.setMyCommands(commandsBtns);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  console.log("message", msg);

  if (text === commandsValues.cancel) {
    return cancel(chatId);
  }

  if (text === commandsValues.start) {
    await createNewSteps(chatId);
    return bot.sendMessage(
      chatId,
      "Поздравляем! Вы подписались на 1xbet_official_kg - Пополнение и вывод средств.",
      startOptions
    );
  }

  if (text === commandsValues.info) {
    return bot.sendMessage(
      chatId,
      `Вас зовут ${msg.from.first_name + msg.from.last_name}`
    );
  }

  if (text === commandsValues.showBtn) {
    return bot.sendMessage(chatId, "showBtn");
  }

  if (userSteps[0]?.currentStep === 3) {
    userInfo = { ...userInfo, replenishmentAmount: text };
    console.log(userInfo);
    await udpatedSteps(chatId);
    return bot.sendMessage(chatId, "Введите ID(Номер Счёта) 1XBET!");
  }

  if (userSteps[0]?.currentStep === 4) {
    userInfo = { ...userInfo, accountId: text };
    console.log(userInfo);
    return bot.sendMessage(
      chatId,
      `Отправьте по следующим реквизитам.

Реквизиты: OPTIMA BANK
4169585352221641
Реквизиты:  О деньги! (единицы)
0509525550
    
После оплаты нажмите на кнопку ниже👇`,
      paymentOptions
    );
  }

  if (userSteps[0]?.currentStep === 5) {
    userInfo = { ...userInfo, screenshot: msg.document || msg.photo || text };
    console.log("userInfo last - ", userInfo);

    return bot.sendMessage(
      chatId,
      `✅Ваша заявка принята на проверку!

⚠️ Пополнение занимает от 5 до 15 минут. 
Пожалуйста подождите!
    
⚠️При сложностях до 3 Часов!
    
✅Вы получите уведомление о зачислении средств!`
    );
  }

  return bot.sendMessage(chatId, "Пожалуйста, выберите пункт из меню ниже.");
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const messageId = msg.message.message_id;
  console.log("callback_query", msg);
  if (data === message.replacement) {
    udpatedSteps(chatId);
    await bot.deleteMessage(chatId, messageId);
    return bot.sendMessage(
      chatId,
      "Выберите необходимый способ для пополнения!",
      replacementOptions
    );
  }

  if (data === message.mbank || data === message.omoney) {
    udpatedSteps(chatId);
    await bot.deleteMessage(chatId, messageId);
    return bot.sendMessage(
      chatId,
      `Укажите сумму пополнения KGS.
Минимальная сумма пополнения: 50.
Максимальная сумма пополнения: 25 000`
    );
  }

  if (data === message.paid) {
    udpatedSteps(chatId);
    await bot.deleteMessage(chatId, messageId);
    return bot.sendMessage(
      chatId,
      `Отправьте СКРИНШОТ Платёжа!

❗️В скриншоте должны быть видны Дата и Время совершения платежа!
В противном случае ваш платёж может не поступить на ваш Счёт!`
    );
  }

  if (data === message.conclusion) {
    return bot.sendMessage(chatId, "test");
  }
});
