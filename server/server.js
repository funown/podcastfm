const express = require("express");
const path = require('path');
const axios = require('axios');
const Parser = require('rss-parser');
const app = express();
const random = require('random');

const randomChar = require('./dict');
const StatusCodes = require('http-status-codes');
const NotFoundError = require('./error/not-found.error');

// add middlewares
app.use(express.static('assets'));

app.use(express.static(path.join(__dirname, "..", "build")));

//add CORS support
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Location');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization, Location');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get('/api/random', async (req, res, next) => {
  let randomItem;
  while (randomItem == null) {
    let keyword = randomChar();
    await axios({
      url: 'https://itunes.apple.com/search?',
      method: 'GET',
      params: {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        term: keyword.length > 1 ? unescape(keyword.replace(/\\u/g, '%u')) : keyword,
      }
    }).then(response => {
      if (response.data.resultCount > 0) {
        randomItem = response.data.results[random.int(0, response.data.resultCount)];
      }
    })
      .catch(err => {
        next(err);
      });
  }
  let parser = new Parser();
  await parser.parseURL(randomItem.feedUrl)
    .then(response => {
      res.status(StatusCodes.OK).send({ ...response, feedUrl: randomItem.feedUrl });
    })
    .catch(err => next(err));
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = StatusCodes.Not_FOUND;
  next(err);
});

app.use(function handleNotFoundError(error, req, res, next) {
  if (error instanceof NotFoundError) {
    return res.status(StatusCodes.Not_FOUND).send({
      httpStatus: StatusCodes.Not_FOUND,
      message: error.message,
      error: {}
    });
  }
  next(error);
});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});