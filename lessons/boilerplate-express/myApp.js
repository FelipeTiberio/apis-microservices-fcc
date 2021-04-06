var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use( (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
});

app.use(bodyParser.urlencoded({extended: false}));

app.use("/public", express.static(__dirname + "/public"));

app.get("/json", (req, res) => {
  res.json({"message": "Hello json".toUpperCase()})
});

app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  next()
}, (req, res) =>{
  res.json({time:req.time})
});

app.get('/:word/echo', (req, res) =>{
  let echo= req.params.word;
  res.json({ echo });
});

app.get('/name', (req, res) => {
  let firstname = req.query.first;
  let lastname = req.query.last;

  res.json({ name: `${firstname} ${lastname}` });
});

app.post('/name', (req, res) => {
  let firstname = req.body.first;
  let lastname = req.body.last;

  res.json({ name: `${firstname} ${lastname}` });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"))
});

































 module.exports = app;
