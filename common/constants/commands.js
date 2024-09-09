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
  kompanion: "kompanion",
  omoney: "omoney",
  optima: "optima",
  conclusionKompanion: "conclusion_kompanion",
  conclusionOmoney: "conclusion_omoney",
  conclusionOptima: "conclusion_optima",
  paid: "paid",
  conclusion: "conclusion",
  accept: "accept",
  reject: "reject",
  startAfterSubscribe: "startAfterSubscribe",
  suspicious: "suspicious",
  normal: "normal",
};

const reqMethod = {
  kompanion: "Компаньон",
  omoney: "О Деньги!",
  optima: "Оптима",
  conclusion_kompanion: "Компаньон",
  conclusion_omoney: "О Деньги!",
  conclusion_optima: "Оптима",
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
