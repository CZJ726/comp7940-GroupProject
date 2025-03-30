const admin = require("firebase-admin");
const TelegramBot = require("node-telegram-bot-api");

// 1. 初始化 Firebase
const serviceAccount = require("./comp7940-groupproject-9bdce-firebase-adminsdk-fbsvc-9aec205ef0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://comp7940-groupproject-9bdce-default-rtdb.firebaseio.com" // 替换为你的数据库URL
});

const db = admin.firestore();

// 2. 初始化 Telegram Bot
const BOT_TOKEN = "7514197128:AAFuSfH7cJsXmSDjFtwfus5QFhIUa-rH6js";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// 3. 监听用户消息
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  try {
    // 存储用户信息到 Firestore
    await db.collection("users").doc(userId.toString()).set({
      username: msg.from.username || "anonymous",
      lastMessage: text,
      lastActive: new Date().toISOString()
    }, { merge: true });

    // 回复用户
    bot.sendMessage(chatId, `✅ 你的消息已保存到数据库: "${text}"`);
  } catch (error) {
    console.error("保存数据失败:", error);
    bot.sendMessage(chatId, "❌ 保存数据时出错，请稍后再试。");
  }
});

console.log("Bot 正在运行...");