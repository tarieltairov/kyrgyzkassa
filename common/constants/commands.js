const commandsValues = {
  start: "/start",
  cancel: "/cancel",
};

const btnType = {
  replacement: "replacement",
  mbank: "mbank",
  omoney: "omoney",
  conclusionMbank: 'conclusion_mbank',
  conclusionOmoney: 'conclusion_omoney',
  paid: "paid",
  conclusion: "conclusion",
  accept: 'accept',
  reject: 'reject'
};

const commandsBtns = [
  { command: "/start", description: "Старт" },
  { command: "/cancel", description: "Отменить всё" },
];

module.exports = {
  commandsValues,
  commandsBtns,
  btnType,
};
