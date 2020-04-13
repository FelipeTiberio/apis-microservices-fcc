// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp", (req, res) =>{
  let date = new Date();
  res.json({ unix: date.getTime(), utc: date.toUTCString()});
});


//  a rota para o teste fica aqui:
app.get("/api/timestamp/:data_string", ( req, res ) =>{
  let param = req.params.data_string;       
  let date;
  
  if(isNaN(param)){
    date = new Date(param);
  }else{
    date = new Date(Number(param));
  }      
  
  
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    
    if (isNaN(date.getTime())) {  // d.valueOf() could also work
      // date is not valid
      res.json({ error: "Invalid Date" });
    } else {
      // date is valid
      res.json({ unix: date.getTime(), utc: date.toUTCString()});
    }
  } else {
      res.json({ error: "Invalid Date" });
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});