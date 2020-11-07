const ace = require('atlassian-connect-express');
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const fs = require('fs');

// https://expressjs.com/en/guide/using-middleware.html
const bodyParser = require('body-parser');
const compression = require('compression');
// const cookieParser = require('cookieParser');
const errorHandler = require('errorHandler');
const morgan = require('morgan');

const helmet = require('helmet');
const nocache = require('nocache');

app.prepare()
  .then(() => {
    const server = express();
    const addon = ace(server);

    // Atlassian security policy requirements
    // http://go.atlassian.com/security-requirements-for-cloud-apps
    // HSTS must be enabled with a minimum age of at least one year
    server.use(helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: false
    }));
    server.use(helmet.referrerPolicy({
      policy: ['origin']
    }));

    // Include request parsers
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: false}));
    // server.use(cookieParser());

    // Gzip responses when appropriate
    server.use(compression());

    // Include atlassian-connect-express middleware
    server.use(addon.middleware());

    // Atlassian security policy requirements
    // http://go.atlassian.com/security-requirements-for-cloud-apps
    server.use(nocache());

    server.get('/', function(req, res) {
      res.format({
        'text/html': function() {
          res.json(addon.descriptor);
        },
        'application/json': function() {
          res.json(addon.descriptor);
        }
      });
    });

    server.get('/atlassian-connect.json', function(req, res) {
      res.json(addon.descriptor);
    });

    server.get('/addon/config', (req, res) => {
      res.json(addon.config);
    });

    server.get('/addon/descriptor', (req, res) => {
      res.json(addon.descriptor);
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(addon.config.port(), (err) => {
      if (err) throw err
      console.log(`> Ready on ${addon.config.localBaseUrl()}`);
      if (dev) addon.register();
    });
  });
