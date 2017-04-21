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

app.get('/login', function(req, res) {
 res.render('login');
});

app.get('/createprofile', function(req, res) {
 res.render('profile');
});

app.post('/login/users', function (req,res) {
  var username = req.body.uname;
  var pwd1 = req.body.pwd;
  console.log(pwd1);
  
connection.query('SELECT pwd FROM profile WHERE username = ?',[username], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
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
  res.render('payment');
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

app.get('/selectpark', function(req,res){
  res.render('selectpark');
});






  
