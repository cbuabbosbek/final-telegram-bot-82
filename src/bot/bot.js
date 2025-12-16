import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import onStart from "./handlers/onStart.js";
import onProfile from "./handlers/onProfile.js";
import onRegister from "./handlers/onRegister.js";
import User from "../models/User.js";
config();

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = "@academy_100x_uz";
const ADMIN_ID = 875072364;

export const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async function (msg) {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text;

  // status
  // -kicked - chiqarib yuborilgan
  // -left - tark etgan
  // -creator - yaratuvchi
  // -admin - admin
  // -member - a'zo

  const chatMember = await bot.getChatMember(CHANNEL_ID, chatId);

  console.log(chatMember.status);

  if (chatMember.status == "left" || chatMember.status == "kicked") {
    return bot.sendMessage(
      chatId,
      `Hurmatli foydalanuvchi,\nBotni ishlatishingiz uchun quyidagi kanalga obuna bo'lishingiz shart... 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "100x Academy Kanali",
                url: "https://t.me/academy_100x_uz",
              },
            ],
            [
              {
                text: "Obunani tekshirish ✅",
                callback_data: "confirm_subscription",
              },
            ],
          ],
        },
      }
    );
  }

  // bot.sendMessage(chatId, chatMember.status)

  if (text == "/start") {
    return onStart(msg);
  }

  if (text == "/profile") {
    return onProfile(msg);
  }

  if (text == "✍️ Ro‘yxatdan o‘tish") {
    return onRegister(msg, bot);
  }

  let user = await User.findOne({ chatId: chatId });

  // action

  console.log("action:::: ", user.action);

  if (user.action == "awaiting_name") {
    user = await User.findOneAndUpdate(
      { chatId: chatId },
      { action: "awaiting_phone", name: text }
    );

    bot.sendMessage(chatId, `Telefon raqamingizni kiriting:`);

    return;
  }

  if (user.action == "awaiting_phone") {
    user = await User.findOneAndUpdate(
      { chatId: chatId },
      { action: "finish_register", phone: text }
    );

    bot.sendMessage(
      chatId,
      `Tabriklaymiz, siz muvofaqiyatli ro'yhatdan o'tdingiz ✅`
    );

    bot.sendMessage(chatId, `Name: ${user.name}\nPhone:${text}`);

    bot.sendMessage(
      ADMIN_ID,
      `Yangi xabar 🔔 \n\n🔘 ismi: ${user.name}\n🔘 tel: ${text}`
    );

    return;
  }

  return bot.sendMessage(chatId, `Kutilmagan xatolik... /start bosing!`);
});

bot.on("callback_query", async (query) => {
  const msg = query.message;
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const queryData = query.data;
  const queryId = query.id;

  console.log(queryData);

  if (queryData == "confirm_subscription") {
    // bot.sendMessage(chatId, `Siz hali obuna bo`)

    const chatMember = await bot.getChatMember(CHANNEL_ID, chatId);

    console.log(chatMember.status);

    if (chatMember.status == "left" || chatMember.status == "kicked") {
      bot.answerCallbackQuery(queryId, {
        text: `Siz hali obuna bo'lmadingiz, Oldin obuna boling`,
        show_alert: true,
      });
    } else {
      onStart(msg);
    }
  }
});

console.log(`Bot ishga tushdi...`);
