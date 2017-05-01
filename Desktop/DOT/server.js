'use strict'

var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));


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
  
  connection.query('SELECT pwd,user_id FROM profile WHERE username = ?',[username], function (error, results, fields) {
  if (error) {
    if(username == ""){
      res.send("Please enter the username");}
    else{
        res.send("Please enter the correct username");
    }
    }
  else{
    if(pwd1 == results[0].pwd){
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
  
connection.query(query, [username,firstname,lastname,email_addre,phone_number,dob,pwd], function(err) {
    if(err){
      console.log(err);
    }
 res.redirect("/login/payment");
});
});


app.get('/login/payment',function(req,res){
  connection.query('SELECT LAST_INSERT_ID();',function(err,rows){
    if(err){
      console.log(err);
    }
  console.log(rows[0]);
 res.render('payment', {user_id : rows[0].user_id});
});
});

app.post('/login/payment/save',function(req,res){
  var query = 'INSERT INTO payment_details(card_number,name,exp_date,cvv,billing_address) VALUES (?,?,?,?,?)';
  var ccnum = req.body.ccnum;
  var cname = req.body.cname;
  var expdate = req.body.expdate;
  var cvv = req.body.cvv;
  var address = req.body.address;

  connection.query(query, [ccnum,cname,expdate,cvv,address],function(err){
   if(err){
      console.log(err);
    }
  res.redirect("/login");
});
});

app.get('/login/first',function(req,res){
  res.render('select');
});

app.get('/myaccount', function(req,res){
  res.render('myaccount')
});

app.post('/myaccount/:user_id/edit', function(req, res) {
   var query = 'SELECT * FROM profile WHERE user_id = 26';
   connection.query(query,function(err,rows) {
   if(err || rows.length === 0) {
    console.log(err || 'No user found.');
    res.redirect('/');
    return;
  }
  console.log(rows);
 res.render('editAccount',{username : rows[0].username, firstname : rows[0].firstname, lastname : rows[0].lastname,email_address: rows[0].email_addre, phone_number : rows[0].phone_number});
});
});

//app.post('/myaccount/:user_id/edit', function(req, res) {
  // var query = 'SELECT * FROM payment_details WHERE user_id = 22';
   
//connection.query(query,function(err,rows) {
  // if(err || rows.length === 0) {
  //  console.log(err || 'No user found.');
   // res.redirect('/');
   // return;
  //}
 //res.render('editAccount',{username : rows[0].username, firstname : rows[0].firstname, lastname : rows[0].lastname,email_address: rows[0].email_addre, phone_number : rows[0].phone_number});
//});
//});


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
  res.render('ticketVerification');
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

app.post('/purchaseTicket/completed',function(req,res){
  res.render('purchaseCompleted');
});

app.get('/scanbar', function(req,res) { 
  res.render('scanbar');
});

app.get('/refill', function(req,res) { 
  res.render('refill');
});




  
