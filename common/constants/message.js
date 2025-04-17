const REQUISITES = [
  {
    id: "/aktanlogin",
    name: "Актан",
    omoney: "0700015403 (Актан K.)",
    bakai: "------",
    optima: "------",
    mbank: "-------",
  },
  {
    id: "/kairatlogin",
    name: "Кайрат",
    omoney: "0706518080  (Наргиза К.)",
    bakai: "070855233 (Чынгызхан С.)",
    optima: "------",
    mbank: "------",
  },
  {
    id: "/aidailogin",
    name: "Айдай",
    omoney: "------",
    bakai: "------",
    optima: "------",
    mbank: "-------",
  },
  {
    id: "/kydyrlogin",
    name: "Кыдыр",
    omoney: "0501144985 (Мырза Ж.)",
    bakai: "------",
    optima: "------",
    mbank: "0995102430 (Мырза Ж.)",
  },
];

const setRequisites = (admin) => {
  const currentAdmin = REQUISITES.find((i) => i.id === admin);
  MESSAGE.REQUISITES = `Отправьте по следующим реквизитам:\n\nО деньги\n${currentAdmin.omoney}\n\nБакай\n${currentAdmin.bakai}\n\nОптима\n${currentAdmin.optima}\n\nMbank\n${currentAdmin.mbank}\n\nПосле оплаты нажмите на кнопку ниже👇`;
};

const MESSAGE = {
  START:
    "Пополнение/Вывод средств из 1XBET!\n\n📥Пополнение: 0%\n\n📤Вывод: 0%\n\n👨‍💻Служба поддержки: @kesha8008",
  ACCOUNT_ID: "Введите ID(Номер Счёта) 1XBET!",
  REQUISITES: "",
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
    "1. Настройки! 🛠️\n2. Вывести со счета! 💵\n3. Наличные 💵\n4. Сумму для Вывода! 💰\n5. Город: Бишкек 📍\n6. Улица: KyrgyzKassa 📍\n7. Подтвердить✅\n8. Получить Код!🔑\n9. Отправить его нам 📨\n\nЕсли возникнут проблемы\n👨‍💻Оператор: @kesha8008\n",
  FULFILLED_APPLICATION: "✅ ваша последняя заявка принята",
  REJECTED_APPLICATION: "❌ ваша последняя заявка отклонена",
  BOT_ON: "Бот включен! ✅",
  BOT_ON_YET: "Бот ужё включен! ✅",
  BOT_OFF: "Бот выключен! ❌",
  BOT_OFF_YET: "Бот уже выключен! ❌",
  BOT_OFF_CLIENT: "Бот отключен на время для технических работ ❌🛠️🛠️",
  YOU_ARE_SUBSCRIBED: "Вы подписаны на канал😌! Кликните на /start",
  BOT_IS_WORKING:
    "✅Бот работает в штатном режиме!✅\n\n💸 Пополнение: 0% — ⚡⚡⚡\n💰 Вывод: 0% — 🚀🚀🚀\n⏰ Мы всегда на связи: 24/7!\n\n🎁 Промокод: 'Kgbonus1'\n🎯 Как использовать:\n💡 Введите промокод, чтобы получить бонусы:\n✨ 1x1\n💵 1000с = 1000 бонусов\n\n🔄 Начните прямо сейчас, нажав кнопку ниже:\n👉 /start",
  EMPTY_DB: "В базе пока нет ни одного пользователя 🧹",
  SUSPICIOUS: "🤔 ПОДОЗРИТЕЛЬНЫЙ !!!\n\n",
  BONUS_ACTIVATE:
    "🎉 Открыт бонус +10% на пополнение! ✅\n⏰ Работаем круглосуточно: 24/7\n\n🔥 Успей забрать бонус — он будет активен всего 1 час!\n💰 Не упусти возможность получить больше прямо сейчас! 😉\n\n🎁 Промокод: 'Kgbonus1'\n🎯 Как использовать:\n💡 Введите промокод, чтобы получить бонусы:\n✨ 1x1\n💵 1000с = 1000 бонусов",
};

module.exports = {
  MESSAGE,
  setRequisites,
  REQUISITES,
};
