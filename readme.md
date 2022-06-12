Description
========================

This is an app responsible for communications with the 'Badada' Telegram bot.

Development
========================

"Телеграм бот" - это некая сущность на серверах телеграма, идентифицируемая уникальным токеном, создаваемым при создании бота. Стороннее приложение (такое, как настоящее - badata-bot) выполняет запросы к API телеграма на URL вида https://api.telegram.org/bot<token>/METHOD_NAME


При на запросы на url, содержащий уникальный токен бота, телеграм делает некоторые действия в своем интерфейсе


Branching strategy
------------------------

В проекте используется [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow).

В репозитории есть основная ветка master, код из которой работает в "продакшне". Для написания новой фичи надо сделать для нее branch и разрабатывать в нем. Прогонять тесты (если есть) тоже на этой ветке. По готовности создать Pull Request в master и (после review и возможного прогона тестов) вмерджить в master.

New feature development
------------------------
Для написания новой фичи надо
1. Сделать новую ветку для фичи в репозитории.
2. Сделать своего бота, на котором будет тестироваться разрабатываемый функционал.
3. Прописать его token в константу TELEGRAM_API_TOKEN в файле .env.

Сервер для разработки фичи можно в теории развернуть где угодно. Но удобнее делать это так же, как и для ["продакшна"](#deployment), на Heroku.

Creating Telegram bot
------------------------
1. Находим среди пользователей Telegram бота @BotFather.
2. Вводим в окно сообщений с этим ботом команду создания нового бота
```
/newbot
```
3. @BotFather задает далее вопросы, в ответах на которые надо задать name и username нового бота.
4. После создания бота @BotFather показывает token для доступа к HTTP API вновь созданного бота.

Deployment
========================
The app is hosted on [Heroku](https://www.heroku.com/).

Knowledge base
========================

[Habr: Подключение телеграм бота к гугл таблицам](https://habr.com/ru/post/585456/)

Код бота хранится в Goolge App Script.

---
[Youtube: Telegram Bot Tutorial - How to connect your Telegram Bot to a Google Spreadsheet (Apps Script)](https://www.youtube.com/watch?reload=9&v=mKSXd_od4Lg&feature=youtu.be&skip_registered_account_check=true)

Ссылка на это видео дана в комментариях к статье выше про Telegram + Google Spreadsheets на Habr'е.

---
[Habr: Уведомления из гугл календаря в телеграм](https://habr.com/ru/post/666372/)

Статья от Макса. Развитие предыдущей статьи автора про Google SpreadSheet (выше).

---
[Habr: Node.js: разрабатываем бота для Telegram](https://habr.com/ru/company/timeweb/blog/665124/)

Статья, которой в основном вдохновлен настоящий проект. Приложение хостится на Heroku, использует Express.js.

---
[Heroku Documentation: Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs#next-steps)

---

[Heroku Documentation: How to get credentials for Heroku default Postgres DB](https://devcenter.heroku.com/articles/connecting-heroku-postgres#external-connections-ingress):
```
heroku pg:credentials:url DATABASE
```