const replacementOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "О Деньги!", callback_data: "omoney" },
        { text: "Mbank", callback_data: "mbank" },
      ],
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
    inline_keyboard: [
      [
        { text: "ОПЛАТИЛ", callback_data: "paid" },
      ],
    ],
  }),
};

module.exports = {
  startOptions,
  replacementOptions,
  paymentOptions
};
