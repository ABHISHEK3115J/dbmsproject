const express = require('express')
const app = express()
var path = require('path');

const passport = require('passport')

const flash = require('connect-flash');
var session = require('express-session');
require('./config/passport')(passport);

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
})
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  app.set('views', path.join(__dirname, 'views'));
  const expressLayouts = require('express-ejs-layouts')
  app.set('view engine','ejs')
  const bodyParser = require('body-parser');
app.set('views',__dirname+'/views')
app.set('layout','layout')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

  const  indexRouter=require('./routes/index')
  const adminRouter = require('./routes/admin')
  const  allocateRouter=require('./routes/allocate')
  const  hostelRouter=require('./routes/hostel')
  const  outingRouter=require('./routes/outing')
  const  roomRouter=require('./routes/room')
  const  studentRouter=require('./routes/student')
  const  visitorRouter=require('./routes/visitor')
  const login = require('./routes/nosql');
  const studFeedback = require('./routes/studfeedback');
  const feedback = require('./routes/feedback')
  const registration = require('./routes/registration') 
  const Location = require('./routes/location')
  const reportGeneration = require('./routes/generateReport')
  const Tour = require('./routes/tour')
//var flash = require('express-flash');


// view engine setup




app.use('/',login);
app.use('/user',login);
app.use('/index',indexRouter);
app.use('/admin',adminRouter);
app.use('/allocate',allocateRouter);
app.use('/hostel',hostelRouter);
app.use('/outing',outingRouter);
app.use('/room',roomRouter);
app.use('/student',studentRouter);
app.use('/visitor',visitorRouter);
app.use('/registration',registration);
app.use('/location',Location)
app.use('/tour',Tour)
app.use('/report',reportGeneration);
app.use('/studfeedback',studFeedback);
app.use('/feedback',feedback);
app.listen(3000);








module.exports = app;

