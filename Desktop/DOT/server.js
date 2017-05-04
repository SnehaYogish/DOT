'use strict'

var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var session = require('client-sessions');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, 
  signed: true,// how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));


var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'vagrant',
  password: '',
  database: 'DOT'
});

connection.connect(function(err) {
  if(err) {
    console.log(err);
    return;
  }

  console.log('Connected to the database.');

app.listen(8080, function() {
    console.log('Web server listening on port 8080!');
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/createprofile', function(req, res) {
 res.render('profile');
});

app.post('/login/users', function (req,res) {
  var username = req.body.uname;
  var pwd1 = req.body.pwd;
  
  
  connection.query('SELECT * FROM profile WHERE username = ?',[username], function (error, results, fields) {
  if (error) {
    if(username == ""){
      res.send("Please enter the username");}
    else{
        res.send("Please enter the correct username");
    }
    }
  else{
    if(pwd1 == results[0].pwd){
      req.session.user = results[0];
      req.session.user.user_id = results[0].user_id;
      console.log(req.session.user.user_id);
      res.redirect("/login/first");
      }
      else{
        res.send({
          "code":204,
          "success":"username and password does not match"
            });
      }
    }
  });
  });

app.post('/createprofile/users', function(req, res) {
  var query = 'INSERT INTO profile(username, firstname ,lastname ,email_addre,phone_number,dob,pwd) VALUES(?, ?, ?, ?, ?, ?, ?)';
  var username = req.body.uname;
  var firstname = req.body.Fname;
  var lastname = req.body.Lname;
  var email_addre = req.body.email;
  var phone_number = req.body.pnum;
  var dob = req.body.DOB;
  var pwd = req.body.pwd;
  
connection.query(query, [username,firstname,lastname,email_addre,phone_number,dob,pwd], function(err,rows) {
    if(err){
      console.log(err);
    }
res.redirect("/login/payment/");
});
});

app.post('/login/payment/save',function(req,res){
  var query = 'INSERT INTO payment_details(card_number,name,exp_date,cvv,billing_address,user_id) VALUES (?,?,?,?,?,?)';
  var user_id = req.session.user.user_id;
  var ccnum = req.body.ccnum;
  var cname = req.body.cname;
  var expdate = req.body.expdate;
  var cvv = req.body.cvv;
  var address = req.body.address;

  connection.query(query, [ccnum,cname,expdate,cvv,address,user_id],function(err){
   if(err){
      console.log(err);
    }
   res.redirect("/");
});
});

app.get('/login/payment', function(req,res){
  res.render('payment');
});

app.get('/myaccount', function(req,res){
  console.log(req.session.user_id);
  res.render('myaccount')
});

app.get('/forgot',function (req,res){
  res.render('forgot')
});

app.post('/reset',function(req,res){
  var query = 'update profile set pwd = ? where username =?';
  var username = req.body.username;
  var pwd = req.body.pwd;
  
  connection.query(query,[pwd,username], function (err, results, fields) {
  if (err) {
    if(username == ""){
      res.send("Please enter the username");
    }
    else{
      console.log(err)
        res.send("Please enter the correct username");
    }
    }
  else{
      res.send({
          "code":204,
          "success":"successfully password is changed"
            });
    }
  });
  });



app.post('/myaccount/:user_id/edit',function(req,res){
  var query = 'SELECT * FROM profile WHERE user_id = ?';
  var user_id = req.session.user.user_id;
   connection.query(query,[user_id],function(err,rows) {
   if(err || rows.length === 0) {
    console.log(err || 'No user found.');
    res.redirect('/');
    return;
  }
  console.log(rows);
 res.render('editAccount',{username : rows[0].username, firstname : rows[0].firstname, lastname : rows[0].lastname,email_address: rows[0].email_addre, phone_number : rows[0].phone_number});
});
});
app.get('/login/first/',function(req,res){
  res.render('select');
});
app.get('/selectpark', function(req,res){
  res.render('selectpark');
});

app.get('/Disney-Cali-adv', function(req,res){
  res.render('disneyCali');
});

app.get('/enterTicket',function(req,res){
res.render('enterTicket');
});


app.post('/enterTicket/verified',function(req,res){
  var ticketNumber = req.body.TicketNumber;
  connection.query('SELECT purchase_id FROM purchase_ticket_details WHERE type = "ticketyes"', function (err, results, fields) {
  if (err) {
    console.log(err);
    res.send("Please enter the correct username");
    }
  
  else{
    if(ticketNumber == results[0].purchase_id){
      res.render('ticketVerification');
      }
      else{
        res.send({
          "code":204,
          "success":"ticket number does not match"
            });
      }
    }
  });
});



app.get('/iHavePass', function(req,res){
  res.render('iHavePass');
});

app.post('/iHavePass/verified', function(req,res){
  res.render('passVerified');
});

app.get('/purchaseTicket', function(req,res){
  res.render('purchaseTicket');
});

app.post('/purchaseTicket', function(req,res){
  var query = 'INSERT INTO purchase_ticket_details (date,quantity,type,user_id) VALUES (?,?,?,?)';
  var user_id = req.session.user.user_id;
  var date = req.body.Date;
  var quantity = req.body.Quantity;
  var type = req.body.Type;
 
  connection.query(query, [date,quantity,type,user_id],function(err){
   if(err){
      console.log(err);
    }
  res.redirect('/purchaseTicket/completed');
});
});

app.get('/purchaseTicket/completed',function(req,res){
  res.render('purchaseCompleted');
});

app.get('/scanbar', function(req,res) { 
  res.render('scanbar');
});

app.get('/refill', function(req,res) { 
  res.render('refill');
});




  
