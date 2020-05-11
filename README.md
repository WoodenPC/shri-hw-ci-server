Разрешаю использовать свою работу для разбора

Если ты это читаешь, надеюсь у тебя установлен докер и докер компоуз, чтобы все работало :)

также прикрутил ssr (P.S. должно пройти какое то время чтобы контейнеры полностью запустились)

Если же нет, то гайд по установке есть тута https://docs.docker.com/install/

# env Файл для сервера
 `.env` файл с переменными окружения подгружается через docker-compose. Надо его создать в папке `server`. Пример есть в файлике `server/env.example`.
Переменные окружения:
- AUTH_TOKEN - токен, получить можно https://hw.shri.yandex/
- CACHE_DIR - путь до папки с кэшом внутри контейнера, если не задан в переменных окружения, то по умолчанию /home/logsCache
- REPOS_DIR - путь до папки с репозиториями внутри контейнера, по умолчанию /home/repos
- CACHE_LIFETIME_MINUTES - время жизни кэша в минутах

# Инструкция по запуску

## Dev режим
`sudo docker-compose --file docker-compose.dev.yml up --build`

## Prod режим
`sudo docker-compose up --build`

Решил делать с помощью докера, чтобы не париться насчет того под какой системой будет работать этот сервер и не подгружать дополнительную либу для чтения файла с переменными окружения. Также если сервак упадет policy restart: always должен если что спасти ситуацию, хотя я попытался обмазаться try catch по максимому в местах работы с промисами и вызовов операций в отдельном процессе.

Базовый образ взял node:alpine, подтягивает *node js 13* версии
Тесты запускал на ноде версии 12.16.1

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

# Тесты

## Тесты на клиенте

Для тестирования использовал библиотеки jest и hermione.
Юнит тесты запускаются командой `npm run test` из папки client.
Интеграционные тесты на гермионе запускаются командой `npm run hermione` из папки hermione.
Чтобы тесты на гермионе запустились, необходимо чтобы был запущен selenium-standalone с помощью команды `selenium-standalone start`. Предварительно может потребоваться установить драйверы селеинума с помощью команды `selenium-standalone install` и установить java (У себя поставил open jdk 13). Также для гермионы надо запустить приложение через докер компоуз.

## Тесты на сервере

Для тестов на сервере использовался jest, тесты запускаются командой `npm run test` из папки server

## Билд сервер
Лежит в папке `buildServer`

Билд сервер следит за агентами и за сборками в состоянии `Waiting` (берет последнии 300 билдов) и обрабатывает их в порядке очереди. Если в распоряжении сервера будет свободный агент, то сервер получит ему собирать билд.

- Сервер должен максимально утилизировать имеющихся агентов. Есть, сервер с помощью сокета пытается достчаться до агентов и в случае если они не доступны отвязывает их от себя
- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать между сборками. Есть
- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать в процессе выполнения сборки.  опять же вкрутил проверки что если агент недоступен и ему поручена какая то сборка, то завершаем сборку с ошибкой

- Агент должен корректно обрабатывать ситуацию, когда при старте не смог соединиться с сервером. Есть, сервак в случае чего будет стучаться до сервака через определенный интервал

- Агент должен корректно обрабатывать ситуацию, когда при отправке результатов сборки не смог соединиться с сервером. Если билд сервер не упал, он разрулит эту проблему. Иначе агент просто завершит сборку но не отправит результат если что то случилось. Но если упадет все сразу то сборка так и останется в статусе InProgress

В связи с тем, что использован докер, билд сервер не использует файл конфигурации, а читает параметры из переменных окружения

### dockerfile
1. Билд: `npm run build-docker-image` или `npm run build-docker-image:dev`
2. Запуск: `sudo docker run -e apiBaseUrl=https://hw.shri.yandex/api/ -e port=12345 -e apiToken= -p 12345:12345 build-server`

## Билд агент
Лежит в папке `buildAgent`
Билд агент при запуске привязывается к билд серверу и при получении пост запроса на сборку начинает обрабатывать репозиторий.

В связи с тем, что использован докер, билд агент не использует файл конфигурации, а читает параметры из переменных окружения

### dockerfile
1. Билд: `npm run build-docker-image` или `npm run build-docker-image:dev`
2. Запуск: `sudo docker run -e serverHost=192.168.0.103 -e serverPort=12345 -e port=30000 -p 30000:30000 build-agent`

baseUrl агента я задаю через `host.docker.internal`

serverHost я указывал из Системные настройки -> Сеть (на маке), на линуксе подозреваю, что можно подсмотреть через `ifconfig`

Не уверен что правильно прописал пермишенны в докерфайлах агента, но вроде как `rm -rf /home` не срабатывает :)

## Типизация
1. Трудоемкость перевода на typescript. Перейти на тайпскрипт было не сложно к тому же на клиенте у меня были prop-types для компонентов. Однако появилось дублирование объявлений типов изза того что у меня не монорепа.
2. Исправил часть тестов, которые неправильно работали.
3. Данный PR я хочу смерджить, т.к. типизация позволяет избежать многих ошибок на этапе написания кода, чем если бы это был обычный js


## Воркеры
Реализовал в 2х вариантах: с использованием workbox и без. Но подключил воркер с workbox. Из проблем: получилось написать нормально тесты (для workbox вообще непонятно как их писать), они тупо не хотят работать, постараюсь что то сделать с этой проблемой.
  Выбранные стратегии кэширования:
  - Вся статика в папке билд прекэшируется (по стандарту в workbox) и отдается по стратегии Cache first
  - Картинки и шрифты кэшируются по стратегии Cache first, т.к. эти файлы не меняются и можно без опасений брать кэшированные файлы.
  - js, css, html файлы кэшируются стратегии workbox StaleWhileRevalidate, ресурсы запрашиваются параллельно из кэша и сети, но если в кэше есть данные они первым делом загрузятся из кэша. js, css, html файлы тоже достаточно статичны и не будут меняться (в отличии от того же гитхаба где на каждый чих грузятся скрипты), так что можем позволить брать из кэша.

### Пуш уведомления
Для работы пуш ведомлений необходимо запустить pushServer
1. Зайти в директорию pushServer
2. npm run build-docker-image
3. sudo docker run push-server


# TODO
Что не доделано: не прикручена нормальная обработка ошибок (сейчас вызываются только alertы и console.log)
У билд сервера и билд агента нету тестов.Также не весь лог красится. Появилось дублирование кода (наверное эта проблема решается монорепозиторием)
Есть проблема с переменными окружения. Почему то через docker не прокидываются переменные окружения. Поэтому push уведомления пока не работают по нормальному.