const commandsValues = {
  start: "/start",
  info: "/info",
  showBtn: "/button",
  cancel: '/cancel'
};

const message = {
  replacement: "replacement",
  conclusion: "conclusion",
  mbank: "mbank",
  omoney: "omoney",
  paid: "paid",
};

const commandsBtns = [
  { command: "/start", description: "Начальное приветствие" },
  { command: "/button", description: "показать кнопку" },
  { command: "/info", description: "Информация" },
  { command: "/cancel", description: "Отменить всё" },
];

module.exports = {
  commandsValues,
  commandsBtns,
  message,
};
