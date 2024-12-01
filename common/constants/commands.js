const commandsValues = {
  start: "/start",
  cancel: "/cancel",
  aktan: "/aktanlogin",
  kairat: "/kairatlogin",
  aidai: "/aidailogin",
  kydyr: "/kydyrlogin",
  botTurnOn: "/turnonbot",
  botTurnOff: "/turnoffbot",
  botIsWorking: "/botworking",
};

const btnType = {
  replacement: "replacement",
  omoney: "omoney",
  bakai: "bakai",
  optima: "optima",
  mbank: "mbank",
  conclusionOmoney: "conclusion_omoney",
  conclusionBakai: "conclusion_bakai",
  conclusionOptima: "conclusion_optima",
  conclusionMbank: "conclusion_mbank",
  paid: "paid",
  conclusion: "conclusion",
  accept: "accept",
  reject: "reject",
  startAfterSubscribe: "startAfterSubscribe",
  suspicious: "suspicious",
  normal: "normal",
};

const reqMethod = {
  omoney: "О деньги",
  bakai: "Бакай",
  optima: "Оптима",
  mbank: "Mbank",
  conclusion_omoney: "О деньги",
  conclusion_bakai: "Бакай",
  conclusion_optima: "Оптима",
  conclusion_mbank: "Mbank",
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
