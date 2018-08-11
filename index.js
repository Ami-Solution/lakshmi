var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static('public'));
PORT = 3000;
app.listen(process.env.PORT || PORT, () => console.log(`Durga app listening on port ${PORT}!`));