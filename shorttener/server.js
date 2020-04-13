'use strict';
var express       = require('express');
var mongoose      = require('mongoose');
const bodyParser  = require('body-parser');
var validUrl      = require('valid-url');
var cors          = require('cors');
var app           = express();
let autoIncrement = require('mongoose-auto-increment')

// Basic Configuration 
var port = process.env.PORT || 3000;
/** ***************************
 *  conectando ao banco
 *********************/
mongoose.connect( process.env.MONGO_URI,{
  'useNewUrlParser': true,
  'useFindAndModify': true, 
  'useCreateIndex': true ,
  'useUnifiedTopology' : true
});

/**
 *  server configuration 
 */
app.use(cors());
app.use( bodyParser.urlencoded( {extended: true} ) );
app.use( bodyParser.json() );
app.use('/public', express.static(process.cwd() + '/public'));

const Url = require('./models/url');
/**********************************
 ********* ROTAS  *****************
 *********************************/
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", (req, res) =>{
   let url = req.body.url;
    
   if (validUrl.isUri(url)){   
      let newUrl = new Url({ original_url : url});
      
      newUrl.save( (err, data) => {
        if(err) throw err;
        res.json({original_url: data.original_url, short_url: data.short_url});
      });

    } 
    else {
        res.json({"error":"invalid URL"});
    }
});

app.get("/api/shorturl/:n_url", (req, res) =>{

  if( !isNaN( req.params.n_url ) ){
    const url   = req.params.n_url;
    const query = { short_url : Number(url) };
  
    Url.findOne( query, ( err, result ) => {
        if(err) throw err;
        res.redirect(result.original_url);
    });
  }else{
    res.redirect()
  }
});


app.listen(port, function () {
  console.log('Node.js listening  at port ' + port);
});