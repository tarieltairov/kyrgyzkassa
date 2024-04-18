const commandsValues = {
  start: "/start",
  cancel: "/cancel",
  aktan: "/aktanlogin",
  kairat: "/kairatlogin",
};

const btnType = {
  replacement: "replacement",
  mbank: "mbank",
  omoney: "omoney",
  optima: "optima",
  elcart: "elcart",
  conclusionMbank: "conclusion_mbank",
  conclusionOmoney: "conclusion_omoney",
  conclusionOptima: "conclusion_optima",
  conclusionElcart: "conclusion_elcart",
  paid: "paid",
  conclusion: "conclusion",
  accept: "accept",
  reject: "reject",
};

const reqMethod = {
  mbank: "Mbank",
  omoney: "О Деньги!",
  optima: "Оптима",
  elcart: "Элкарт",
  conclusion_mbank: "Mbank",
  conclusion_omoney: "О Деньги!",
  conclusion_optima: "Оптима",
  conclusion_elcart: "Элкарт",
};

const commandsBtns = [
  { command: "/start", description: "Старт" },
  { command: "/cancel", description: "Отменить всё" },
];

module.exports = {
  commandsValues,
  commandsBtns,
  btnType,
  reqMethod,
};
