'use strict';

var express      = require('express');
var cors         = require('cors');
const bodyParser = require('body-parser');
const multer     = require('multer');
const upload     = multer({dest : 'public/'})

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) =>{
  let file = req.file
  
  let file_meta = { 
    name : file.originalname, 
    type : file.mimetype, 
    size : file.size }
  
  console.log(file)
  res.json(file_meta);
  
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
