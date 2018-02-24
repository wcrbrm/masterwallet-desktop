// (() => {
//    'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 62222;

app.use(cors());
app.use('/ping', (req, res, next) => {
  res.json({ ping: 'pong' });
});
// KUCOIN requests proxy
// app.use('/kucoin', require('./kucoin')); 


const server = app.listen(port, '127.0.0.1', () => {
  console.log('Express server listening to ' + server.address().address + ':' + server.address().port);
});

//     module.exports = app;
// })();

export default app;