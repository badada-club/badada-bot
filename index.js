const express = require('express')
const axios = require('axios')

const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN
const TELEGRAM_URI = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`

const PORT = process.env.PORT || 3000

async function sendMessage(chatId, message) {
  let url = `${TELEGRAM_URI}/sendMessage?chatId=${chatId}?text=${message}`;

  console.log('url: ' + url);
  console.log('text: ' + message);

  await axios.post(url, {
    chat_id: chatId,
    text: message
  })
}

const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.post(`/telegram-webhook-message-${TELEGRAM_API_TOKEN}`, async (req, res) => {
    const { message } = req.body;

    console.log('message: ' + JSON.stringify(message));

    const messageText = message?.text?.toLowerCase()?.trim();
    const chatId = message?.chat?.id;
    if (!messageText || !chatId) {
      return res.sendStatus(400);
    }

    await sendMessage(chatId, messageText);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})