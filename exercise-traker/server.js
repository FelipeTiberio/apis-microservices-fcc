const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose'); 
const cors       = require('cors');

/******************************** 
****  conectando ao db 
*********************************/

mongoose.connect( process.env.MONGO_URI,{
  'useNewUrlParser': true,
  'useFindAndModify': true, 
  'useCreateIndex': true ,
  'useUnifiedTopology' : true
});
// configurando o app
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// user model 
let User     = require('./model/user');
let Exercise = require('./model/exercise');

/*************************************
 *  ROTAS 
 *************************************/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create a user
app.post('/api/exercise/new-user', (req, res) =>{
  let new_user = new User(  { 'username': req.body.username } );  
  new_user.save( (err, result) =>{
    if(err){
      res.send('id not valide')
    }else{
      res.json({ username: result.username, _id: result._id});      
    }  
  });
});

app.post("/api/exercise/add" , ( req, res, next ) => {
  let userId      = req.body.userId;
  let description = req.body.description;
  let duration    = Number(req.body.duration);
  let date        = req.body.date;
  
  const requiredFieldsCompleted = userId && description && duration;
  
  if(requiredFieldsCompleted){
    
    User.findById(userId, (error, user) => {
      if(error) return next(error);

        const date = (req.body.date) ? new Date(req.body.date) : new Date();  
        const newExercise = new Exercise({
          description: description, duration: duration, date: date, userId: userId});
           
        newExercise.save( ( err, exercise) => {
          if( err ){
            throw err;
          } else {
            user.log.push(exercise);
            user.count = user.log.length;
            user.save((error, user) => {
              if(error) return next(error);
              const dataToShow = { 
                username: user.username, _id: user._id,description: description, duration: duration, date: date.toDateString()};
              res.json(dataToShow);
            });
          }
        });
    });
  } else {
    let message = "Please complete all the required fields.";
    res.send(message);
  }
});


app.get('/api/exercise/log', (req, res, next) =>{
  
  const { userId, from, to, limit } = req.query;
  const dateValidation = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  const fromString = (from && dateValidation.test(from)) ? new Date(from.replace('-', ',')).toDateString() : undefined;
  const toString = to ? new Date(to.replace('-', ',')).toDateString() : undefined;
  const query = {};

  if(userId){
    User.findById(userId).populate('log').exec( (err, user) =>{
      if( err) throw err;
      
      
       const msg = {
      _id: user._id,
      username: user.username
    };

    const filter = {userId: req.query.userId};

    if (req.query.from) {
      const from = new Date(req.query.from);
      if (!isNaN(from.valueOf())) {
        filter.date = {'$gt': from};
        msg.from = from.toDateString();
      }
    }

    if (req.query.to) {
      const to = new Date(req.query.to);
      if (!isNaN(to.valueOf())) {
        if (!filter.date) filter.date = {};
        filter.date['$lt'] = to;
        msg.to = to.toDateString();
      }
    }

    const fields = 'description duration date';
    const options = {sort: {date: -1}};
    const query = Exercise.find(filter, fields, options).lean();

    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (limit) query.limit(limit);
    }

    query.exec(function(error, posts) {

      //console.log(error);
      if (error) return next(error);

      for (let post of posts) {
        delete post._id;
        post.date = post.date.toDateString();
      }

      msg.count = posts.length;
      msg.log = posts;
      res.json(msg);
    });
      
      
    })
  }else {
    res.send('UserId Required');
  }
});

// lists all the users
app.get('/api/exercise/users', (req, res) =>{
  
  User.find({}).populate('log').exec( (err, user) => {
    if(err) throw err;
    res.json(user);
  });  
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
