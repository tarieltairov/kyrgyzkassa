const REQUISITES = [
  {
    id: "/aktanlogin",
    name: "Актан К.",
    mbank: "+996997897897",
    omoney: "0504061111",
    optima: "4169585354555541",
  },
  {
    id: "/kairatlogin",
    name: "Кайрат.М",
    mbank: "+996705090515",
    omoney: "0709050900",
    optima: "4169585359474706",
  },
];

const setRequisites = (admin) => {
  const currentAdmin = REQUISITES.find((i) => i.id === admin);
  MESSAGE.REQUISITES = `Отправьте по следующим реквизитам:\n\nMBANK\n${
    currentAdmin.mbank
  } (${
    currentAdmin.name === "Кайрат.М" ? "Зуурабубу О." : currentAdmin.name
  })\n\nО деньги!\n${currentAdmin.omoney} (${currentAdmin.name})\n\nОптима\n${
    currentAdmin.optima
  } (${currentAdmin.name})\n\nПосле оплаты нажмите на кнопку ниже👇`;
};

const MESSAGE = {
  START:
    "Пополнение/Вывод средств из 1XBET!\n\n📥Пополнение: 0%\n\n📤Вывод: 0%\n\n👨‍💻Служба поддержки: @kesha8008",
  ACCOUNT_ID: "Введите ID(Номер Счёта) 1XBET!",
  REQUISITES: `Отправьте по следующим реквизитам:\n\nMBANK\n+996997897897 (Актан К.)\n\nО деньги!\n0504061111 (Актан К.)\n\nОптима\n4169585354555541 (Актан К.)\n\nПосле оплаты нажмите на кнопку ниже👇`,
  APPLICATION_ACCEPTED: `📨Ваша заявка отправлена на проверку!\n\n⚠️Пополнение занимает от 1 до 10 минут.\nПожалуйста подождите!\n\n⚠️При сложностях до 3 Часов!\n\n✅Вы получите уведомление о зачислении средств!`,
  CONCLUSION_ACCEPTED:
    "📨Ваша заявка отправлена на проверку!\n\n⚠️Вывод занимает от 5 до 15 минут.\nПожалуйста подождите!\n\n⚠️При сложностях до 3 Часов!\n\n✅Вы получите уведомление о выводе средств!",
  WRONG: "Пожалуйста, выберите пункт из меню ниже.",
  REFILLMENT_METHOD: "Выберите необходимый способ для пополнения!",
  SUM_RULES:
    "Укажите сумму пополнения KGS.\n\nМинимальная сумма пополнения: 50.\n\nМаксимальная сумма пополнения: 100000",
  CONCLUSION_SUM_RULES: "Укажите сумму вывода",
  SCREENSHOT:
    "Отправьте СКРИНШОТ Платёжа!\n\n❗️В скриншоте должны быть видны Дата и Время совершения платежа!\nВ противном случае ваш платёж может не поступить на ваш Счёт!",
  CANCEL: "Теперь, чтобы отправить новую заяку, выберите команду /start",
  CONCLUSION: "Выберите удобный для вас способ приема оплаты!",
  CONCLUSION_REQUISITES: "Введите свои реквизиты",
  CODE: "💳Введите код:",
  CODE_INSTRUCTION:
    "1. Настройки! 🛠️\n2. Вывести со счета! 💵\n3. Наличные 💵\n4. Сумму для Вывода! 💰\n5. Город: Бишкек 📍\n6. Улица: KyrgyzKassa 📍\n7. Подтвердить✅\n8. Получить Код!🔑\n9. Отправить его нам 📨\n\nЕсли возникнут проблемы\n👨‍💻Оператор: @kesha8008\n👨‍💻Оператор: @rehabdone",
  FULFILLED_APPLICATION: "✅ ваша последняя заявка принята",
  REJECTED_APPLICATION: "❌ ваша последняя заявка отклонена",
  BOT_ON: "Бот включен! ✅",
  BOT_ON_YET: "Бот ужё включен! ✅",
  BOT_OFF: "Бот выключен! ❌",
  BOT_OFF_YET: "Бот уже выключен! ❌",
  BOT_OFF_CLIENT: "Бот отключен на время для технических работ ❌🛠️🛠️",
  YOU_ARE_SUBSCRIBED: "Вы подписаны на канал😌! Кликните на /start",
  BOT_IS_WORKING:
    "🚀 Бот работает в штатном режиме 🚀\n\n✅ Нажмите на старт ✅\n\n/start                   /start                   /start",
  EMPTY_DB: "В базе пока нет ни одного пользователя 🧹",
  SUSPICIOUS: "🤔 ПОДОЗРИТЕЛЬНЫЙ !!!\n\n",
};

module.exports = {
  MESSAGE,
  setRequisites,
  REQUISITES,
};
