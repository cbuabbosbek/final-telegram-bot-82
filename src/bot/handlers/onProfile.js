import { bot } from "../bot.js";
import User from "../../models/User.js";

async function onProfile(msg) {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId: chatId });

  if (!user) return;

  user = await User.findOneAndUpdate({ chatId: chatId }, { action: "profile" });

  console.log(user);

  bot.sendMessage(
    chatId,
    `
  SHAXSIY PROFIL:\n
- CHAT-ID: ${user.chatId}
- ISMI: ${user.firstname}
- USERNAME: ${user.username}
- ACTIVE: ${user.active ? "FAOL" : "FAOL EMAS"}
- BALANCE: ${user.balance}
  `
  );
}

export default onProfile;
