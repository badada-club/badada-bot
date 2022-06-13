import express from 'express'
import axios from 'axios'

import { TELEGRAM_URI, TELEGRAM_BOT_USERNAME, WEBHOOK_ACTION /*, WEBHOOK_ACTION_DEV */ } from './config.js'
const PORT = process.env.PORT || 3000

async function sendMessage(chatId, message) {
  await sendRequest('sendMessage', {
    chat_id: chatId,
    text: message // encodeURIComponent(message)
  });
}
async function sendRequest(method, params) {
  let url = `${TELEGRAM_URI}/${method}`;
  await axios.post(url, params);
}

const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// app.post(`/${WEBHOOK_ACTION_DEV}`, async (req, res) => {
app.post(`/${WEBHOOK_ACTION}`, async (req, res) => {
    const { message } = req.body;

    console.log('Webhook message received:' + JSON.stringify(message));

    if(!message)
      return res.sendStatus(400);

    const text = message.text;
    const chat = message.chat;
    if(!chat)
      return res.sendStatus(400);

    const chatId = chat.id;
    if(!chatId)
      return res.sendStatus(400);

    const params = text.split(' ');

    if(!params[0])
      return;

    if(params[0].startsWith('/')) {
      const atLocation = params[0].lastIndexOf('@'); // Commands may end with the bot's name, see https://core.telegram.org/bots#commands
      const botName = atLocation !== -1 ? params[0].substring(atLocation + 1) : null;
      const command = params[0].substring(1, botName === TELEGRAM_BOT_USERNAME ? atLocation : params[0].length);
      switch(command) {
        case 'start':
          await sendMessage(chatId, 'Hey dude!');
          break;
        case 'echo':
          await sendMessage(chatId, params[1]);
          break;
      }
    }

    res.send('Done');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})