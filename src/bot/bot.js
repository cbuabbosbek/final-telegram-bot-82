import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import onStart from "./handlers/onStart.js";
config();

const TOKEN = process.env.BOT_TOKEN;

export const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", function (msg) {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text;

  if (text == "/start") {
    return onStart(msg);
  }

  bot.sendMessage(chatId, `${text}`);
});

console.log(`Bot ishga tushdi...`);
