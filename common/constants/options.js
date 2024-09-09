const setAdminOptions = (userChatId = "", isShowSuspicious) => {
  const adminOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "ПРИНЯТЬ", callback_data: `accept${userChatId}` },
          { text: "ОТКЛОНИТЬ", callback_data: `reject${userChatId}` },
        ],
      ],
    }),
  };
  const parsedOptions = JSON.parse(adminOptions.reply_markup);
  parsedOptions.inline_keyboard.push([
    {
      text: `${!isShowSuspicious ? "" : "НЕ"}ПОДОЗРИТЕЛЬНЫЙ`,
      callback_data: `${
        !isShowSuspicious ? "suspicious" : "normal"
      }${userChatId}`,
    },
  ]);
  adminOptions.reply_markup = JSON.stringify(parsedOptions);
  return adminOptions;
};

const conclusionOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "О Деньги!", callback_data: "conclusion_omoney" },
        { text: "Компаньон", callback_data: "conclusion_kompanion" },
      ],
      [{ text: "Оптима", callback_data: "conclusion_optima" }],
    ],
  }),
};

const replacementOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "О Деньги!", callback_data: "omoney" },
        { text: "Компаньон", callback_data: "kompanion" },
      ],
      [{ text: "Оптима", callback_data: "optima" }],
    ],
  }),
};

const startOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "ПОПОЛНЕНИЕ", callback_data: "replacement" },
        { text: "ВЫВОД", callback_data: "conclusion" },
      ],
    ],
  }),
};

const paymentOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "ОПЛАТИЛ", callback_data: "paid" }]],
  }),
};

module.exports = {
  startOptions,
  replacementOptions,
  paymentOptions,
  conclusionOptions,
  setAdminOptions,
};
