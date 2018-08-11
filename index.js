var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var models = [];
var obj = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
fs.writeFileSync('./data.json', models.join(',') , 'utf-8'); 

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static('public'));
app.get("/:data",(req,res)=>{
   res.sendfile(__dirname+"/public/index.html");
})
PORT = 3000;
app.listen(process.env.PORT || PORT, () => console.log(`Durga app listening on port ${PORT}!`));