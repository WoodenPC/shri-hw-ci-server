import express from 'express';
import React, { ReactNode, ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import http from 'http';
import path from 'path';

import { Provider } from 'react-redux';

import { StaticRouter } from 'react-router-dom';
import { createServerStore } from 'store/store';
import { App } from '../src/App';

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
          <StaticRouter location={req.url}>
            <App />
          </StaticRouter>
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
  try {
    // если в дев режиме, то переводим на сервак cra
    http.get(
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
              res.status(500);
              res.send(e);
            });
          return;
        }
        res.writeHead(proxiedResponse.statusCode as number, proxiedResponse.headers);
        proxiedResponse.pipe(res, { end: true });
        next();
      }
    );
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
