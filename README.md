Разрешаю использовать свою работу для разбора

Если ты это читаешь, надеюсь у тебя установлен докер и докер компоуз, чтобы все работало :)

также прикрутил ssr (P.S. должно пройти какое то время чтобы контейнеры полностью запустились)

Если же нет, то гайд по установке есть тута https://docs.docker.com/install/

# env Файл для сервера
 `.env` файл с переменными окружения подгужается через docker-compose. Надо его создать в корне проекта. Пример есть в файлике env.example.
Переменные окружения:
- AUTH_TOKEN - токен, получить можно https://hw.shri.yandex/
- CACHE_DIR - путь до папки с кэшом внутри контейнера, если не задан в переменных окружения, то по умолчанию /home/logsCache
- REPOS_DIR - путь до папки с репозиториями внутри контейнера, по умолчанию /home/repos
- CACHE_LIFETIME_MINUTES - время жизни кэша в минутах

# Инструкция по запуску

Можно в принципе и без докера запустить, но тогда надо в файле `axios-instance.js` вместо process.env.AUTH_TOKEN вручную прописать свой токен. Остальные параметры, которые могут тянуться из переменных окружения выставятся по умолчанию. А также на винде наверное надо поменять пути сохранения кэша в файле `server/services/cache-service.js` и путь до папки, куда будут сохраняться репозитории в файле `/server/services/git-service.js` (можно выполнить поиск по файлу и найти места, где используется process.env) и выполнить `npm run start` в корне проекта. Но с лучше конечно проверять работоспособность с докером.

## Dev режим
`sudo docker-compose --file docker-compose.dev.yml up --build`

## Prod режим
`sudo docker-compose up --build`

Решил делать с помощью докера, чтобы не париться насчет того под какой системой будет работать этот сервер и не подгружать дополнительную либу для чтения файла с переменными окружения. Также если сервак упадет policy restart: always должен если что спасти ситуацию, хотя я попытался обмазаться try catch по максимому в местах работы с промисами и вызовов операций в отдельном процессе.

Базовый образ взял node:alpine, подтягивает *node js 13* версии

# Работа сервера
сервер развернут на порту 5000, т.е. стучаться к нему можно к примеру через Insomnia GET localhost:5000/api/builds/list или любую другую тулзу

Чтобы хранилище яндекса начало что то отдавать, надо сначала сохранить конфигурацию настроек POST localhost:5000/api/settings (вроде бы если 1 раз сохранить настройки сервера, то повторн уже не обязательно сохранять)

При доступе к ручке POST /api/settings идет клонирование репозитория и дальнейшее слежение за ним (получилось сделать только слежение за веткой master), при обновлении все новые коммиты отправляются на сборку. Репозитории клонируются внутрь контейнера по пути /home/repos

Пример тела post запроса:
`
{
  "repoName": "WoodenPC/shri-async-hw",
  "buildCommand": "npm run build",
  "mainBranch": "master",
  "period": 0
}
`

Запилил переключение на другие ветки, надеюсь ничего не отвалится :)
 
# Внешние зависимости
- *axios* - для работы с http запросами
- *nodemon* - чтобы перезапускать сервер, при изменении файлов
- *express* - фреймворк для ноды
- *date-fns* - либа для работы с датами, по итогу можно было обойтись без нее, но она достаточно легковесная так что решил оставить

# Клиент
Клиент запущен на порту 3000 и доступен если в адресной строке браузера ввести localhost: 3000
Для клиента использовал create-react-app
Также nginx раздает статику в prod режиме.
В Dev режиме запускается react-dev-server. В качестве стейт менеджера используется redux, для ассинхронной логики взял redux-thunk.

После запуска нового билда по коммиту (через кнопку Run build), надо ребутнуть страницу, чтобы история билдов обновилась.

# TODO
Что не доделано: не прикручена нормальная обработка ошибок (сейчас вызываются только alertы и console.log)
