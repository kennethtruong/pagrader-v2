import express from 'express';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import * as actions from './actions/index';
import { mapUrl } from './utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import secrets from './config/secrets.js';
import passport from 'passport';
// import initPassport from './passport/init';
import mongoose from 'mongoose';
import mongoSession from 'connect-mongo';
import { closeSSHConnection } from './ssh/connection';

const isProd = process.env.NODE_ENV === 'production';
const pretty = new PrettyError();

const MongoStore = mongoSession(session);
const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');
const port = process.env.PORT || 5000;

mongoose.connect(secrets.db, dbErr => {
  if (dbErr) {
    console.log('MongoDB ERROR: Could not connect to ' + secrets.db);
    console.log(dbErr);
  } else {
    console.log('==> 💻  Mongoose connected to ' + secrets.db);

    if (isProd) {
      app.set('trust proxy', 1);
    }
    app.use(
      session({
        secret: secrets.session,
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          touchAfter: 300
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 3600,
          secure: isProd
        }
      })
    );

    app.use(bodyParser.json());

    app.use(passport.initialize());
    app.use(passport.session());

    // Initialize Passport
    // initPassport(passport);
    app.use('/api', (req, res) => {
      const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

      const { action, params } = mapUrl(actions, splittedUrlPath);

      // TODO: Need to add authentication check here
      if (action) {
        action(req, params).then(
          result => {
            if (result instanceof Function) {
              result(res);
            } else {
              res.json(result);
            }
          },
          reason => {
            if (reason && reason.redirect) {
              res.redirect(reason.redirect);
            } else {
              console.error('API ERROR:', pretty.render(reason));
              res.status(reason.status || 500).json(reason);
            }
          }
        );
      } else {
        res.status(404).end('NOT FOUND');
      }
    });

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '..', 'client/build')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '/client/build/index.html'));
    });

    const runnable = app.listen(port, err => {
      if (err) {
        console.error(err);
      }
      console.info('----\n==> 🌎  API is running on port %s', port);
    });
    io.on('connection', socket => {
      socket.emit('clientId', { id: socket.id });
      // sshConnections();
      // console.log(`${socket.conn.id} Connected from Socket --------`);
      socket.on('disconnect', () => {
        closeSSHConnection(socket.id);
        // console.log(`${socket.conn.id} Disconnected from Socket --------`);
      });
    });
    runnable.on('close', () => {
      mongoose.disconnect();
    });
    io.listen(runnable);
  }
});
