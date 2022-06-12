const express = require('express')

const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN
const TELEGRAM_URI = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`

const PORT = process.env.PORT || 3000

async function sendMessage(chatId, message) {
  let url = `${TELEGRAM_URI}/sendMessage?chatId=${chatId}?text=${message}`;
  return await fetch(url, {
      method: 'POST'
  });
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

    const messageText = message?.text?.toLowerCase()?.trim();
    const chatId = message?.chat?.id;
    if (!messageText || !chatId) {
      return res.sendStatus(400);
    }

    await sendMessage(chatId, 'I have nothing to say.');
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})