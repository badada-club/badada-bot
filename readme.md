Описание
========================
Node.js - приложение, реализующее функциональность Telegram-бота 'Badada'. Для выполнения HTTP запросов используется [axios](https://github.com/axios/axios), для маршрутизации и обработки входящих запросов используется [express.js](https://expressjs.com/).

Разработка
========================
Работа с Git
------------------------
В проекте используется [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow).

В репозитории есть основная ветка master, код из которой работает в "продакшне". Для написания новой фичи надо сделать для нее branch и [разрабатывать](#разработка-новой-фичи) в нем. Прогонять тесты (если есть) - тоже на этой ветке. По готовности создать Pull Request в master и вмерджить после review и возможного прогона тестов.

Разработка новой фичи
------------------------
1. Сделать новую ветку для фичи в репозитории.
2. [Сделать своего бота](#создание-telegram-бота), на котором будет тестироваться разрабатываемый функционал.
3. Прописать его token в константу TELEGRAM_API_TOKEN в файле .env в корне приложения, например: `TELEGRAM_API_TOKEN=5570432315:AAEavWcdUrj4AYJ6NrDOtCqQXzGa2ky9ECk`
4. Прописать его username в константу TELEGRAM_BOT_USERNAME в файле .env, например: `TELEGRAM_BOT_USERNAME=badada_dev_bot`
5. Cоздать для разработки отдельное (от "продакшна") Heroku-приложение (по очевидным причинам) и не в основном аккаунте (для экономии бесплатных часов аптайма).
6. Прописать название приложения в константу APP_NAME в файле .env, например `APP_NAME=badada-dev-bot`
7. По окончании разработки
    1. Поменять этот readme.md в соответствии с изменениями.
    2. Создать pull request из ветки фичи в master.
    3. По возможности дать на review другим разработчикам.
    4. Вмерджить в master.
    5. Опубликовать "продакшн" Heroku-приложение с изменениями.

Создание Telegram бота
------------------------
Бот - это сущность на серверах Telegram'а, идентифицирующаяся уникальным токеном. Этот токен используется в командах HTTP API Telegram'а (например, "отправить сообщение") для конкретизации бота, к которому эту команду нужно применить.

1. Находим среди пользователей Telegram бота @BotFather.
2. Вводим в окно сообщений с этим ботом команду создания нового бота `/newbot`
3. @BotFather задает далее вопросы, в ответах на которые надо задать name и username нового бота.
4. После создания бота @BotFather показывает его сгенерированный token.

Публикация
========================
Приложение хостится на [Heroku](https://www.heroku.com/). Механизм публикации можно прочитать в [документации](https://devcenter.heroku.com/articles/deploying-nodejs).

Публикуемое приложение имеет на Heroku свое имя <имя приложения>, свой Git-репозиторий, свой адрес в Интернете https://<имя приложения>.herokuapp.com.

Для "продакшна" предполагается создать основное Heroku-приложени в Heroku-аккаунте badada.it. Для разработки новой фичи должно использоваться отдельное Heroku-приложение.

Публикация производится как во временное приложение для новой фичи, так и в "продакшн".

Вкратце о публикации через git:
1. В корне локальной копии репозитория выполнить `heroku login`. В открывшемся в браузере окне вводим логин/пароль от аккаунта heroku. В "продакшне" используется аккаунт badada.it, пароль от которого можно получить у @wslark. При разработке должен использоваться другой аккаунт, чтобы не тратить бесплатные часы аптайма у основного аккаунта badada.it.
2. Если приложение на Heroku еще не было создано, то выполняем команду `heroku create [имя приложения]`. Имя приложения для разработки можно выбрать любое.
3. Выставить переменные окружения TELEGRAM_API_TOKEN, TELEGRAM_BOT_USERNAME и APP_NAME командами вроде `heroku config:set TELEGRAM_API_TOKEN=<token>`.
4. Сделать push локальной ветки, в которой ведется разработка, в ветку master удаленного репозитория Heroku-приложения на сервере Heroku. При создании Heroku-приложения такой удаленный репозиторий создается автоматически, но при необходимости его можно сделать и самому. Адрес Heroku-репозитория приложения можно посмотреть, например, в веб-интерфейсе Heroku.

База знаний
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

---
[Youtube: Testing Node Server with Jest and Supertest](https://www.youtube.com/watch?v=FKnzS_icp20)

Getting Started по тестрованию Express с использованием Jest and Supertest. Единственное - import supertest from 'supertest' он шустро меняет на import request from 'supertest' и ничего об этом не говорит))