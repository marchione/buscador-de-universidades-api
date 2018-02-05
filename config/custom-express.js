const express = require('express');
const expressLoad = require('express-load');
const expressValidator = require('express-validator');

const bodyParser =  require('body-parser');

module.exports = function(){

  const app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });
  expressLoad('controllers').into(app);

  return app;
}
