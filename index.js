require("dotenv").config();
const fs = require("fs");

let request = require("request-promise");
const cookieJar = request.jar();
request = request.defaults({jar: cookieJar});

const html_to_pdf = require("html-pdf-node");
const nodeHtmlToImage = require("node-html-to-image");

const TelegramBot = require("node-telegram-bot-api");

async function retrieveResult(username, bran) {
  const login = await request
    .post("http://scib-sys.alazhar.edu.eg/sci/natiga/login51.php", {form: {Username: username, Password: "Fuck you!"}})
    .catch((e) => 0);
  console.log("Logged-in for: " + username);

  const result = await request.get(`http://scib-sys.alazhar.edu.eg/sci/natiga/myads05.php?sem=&year=22&bran=${bran}&mycolg=2`);
  console.log("Retrieved result for: " + username);

  return result;
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const args = msg.text.split(" ");
  console.log(args);
  retrieveResult(args[0], args[1]).then((result) =>
    html_to_pdf
      .generatePdf({content: result}, {format: "A2", landscape: true})
      .then((out) => bot.sendDocument(chatId, out, {}, {filename: `${args[0]}.pdf`, contentType: "application/x-pdf"}))
  );

  //retrieveResult(args[0], args[1]).then(result => nodeHtmlToImage({html:result}).then(out => bot.sendPhoto(chatId, out)))
});
