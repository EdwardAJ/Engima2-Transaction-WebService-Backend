require("dotenv").config();

var express = require('express'),
    app = express(),
    port = process.env.PORT || 4000,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');
routes(app);

app.listen(port);
console.log('Transaction Web Service running on port : ' + port);