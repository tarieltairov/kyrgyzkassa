const commandsValues = {
  start: "/start",
  cancel: '/cancel'
};

const btnType = {
  replacement: "replacement",
  mbank: "mbank",
  omoney: "omoney",
  paid: "paid",
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
