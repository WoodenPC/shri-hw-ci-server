import express from 'express';
import React from 'react';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import { resolve } from 'path';
import http from 'http';
import path from 'path';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';

import { Provider } from 'react-redux';

import { StaticRouter } from 'react-router-dom';
import { createServerStore } from '../src/store/store';
import { App } from '../src/App';
import { initReactI18next, I18nextProvider } from 'react-i18next';

import translationsEn from '../src/utils/i18n/translations/en.json';
import translationsRu from '../src/utils/i18n/translations/ru.json';

i18next
  .use(initReactI18next)
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    preload: ['en', 'ru'],
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'en',
    resources: {
      en: {
        translations: translationsEn,
      },
      ru: {
        translations: translationsRu,
      },
    },
    // backend: {
    //   loadPath: resolve(
    //     __dirname,
    //     '../src/utils/i18n/translations/{{lng}}.json'
    //   ),
    // },
    react: {
      useSuspense: false,
    },
  });

let productionTemplate: string;
const getProductionPageTemplate = () => {
  if (!productionTemplate) {
    productionTemplate = fs
      .readFileSync(path.resolve('./build/index.html'))
      .toString();
  }
  return productionTemplate;
};

const renderPage = (pageTemplate: string, reactComponent: ReactElement) => {
  const renderedComponent = renderToString(reactComponent);
  return pageTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedComponent}</div>`
  );
};

const PORT = process.env.PORT || 3001;
const server = express();

server.use(express.static('build'));

server.get('*', (req, res, next) => {
  const store = createServerStore();
  if (process.env.NODE_ENV === 'production') {
    res.send(
      renderPage(
        getProductionPageTemplate(),
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <StaticRouter location={req.url}>
              <App />
            </StaticRouter>
          </I18nextProvider>
        </Provider>
      )
    );
    next();
    return;
  }

  const headers = { ...req.headers };
  if (
    req.headers['accept'] &&
    req.headers['accept'].indexOf('text/html') > -1
  ) {
    headers['accept-encoding'] = 'utf8';
  }
  // если в дев режиме, то переводим на сервак cra
  http
    .get(
      {
        port: 3000,
        path: req.url,
        headers: headers,
      },
      (proxiedResponse) => {
        if (
          req.headers['accept'] &&
          req.headers['accept'].indexOf('text/html') > -1
        ) {
          let responseBody = '';
          proxiedResponse.setEncoding('utf8');
          proxiedResponse
            .on('data', (chunk) => {
              responseBody += chunk;
            })
            .on('end', () => {
              res.send(
                renderPage(
                  responseBody,
                  <Provider store={store}>
                    <StaticRouter location={req.url}>
                      <App />
                    </StaticRouter>
                  </Provider>
                )
              );
              next();
            })
            .on('error', (e) => {
              res.sendStatus(500);
              console.log(e.toString());
            });
          return;
        }
        res.writeHead(
          proxiedResponse.statusCode as number,
          proxiedResponse.headers
        );
        proxiedResponse.pipe(res, { end: true });
        next();
      }
    )
    .on('error', (err) => {
      res.sendStatus(500);
      console.log(err.toString());
    });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
