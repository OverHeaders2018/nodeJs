const express = require('express');
const path = require('path');
// const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');



const app = express();
// app.use(logger('common', {
//
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


let pool      =    mysql.createConnection({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'myDBpass@!',
    database : 'overheaders',
});

pool.connect(function(err) {
    console.log(err);
});


let queryDB = function(query) {
    return new Promise((resolve, reject) => {
        pool.query(query,  function (err, result, fields) {
            if (err) {reject(err);}
            resolve(result); // result without some field returns
        });
    });
};

app.post('/register', function(req, res, next) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    let device_token = req.body.device_token ? req.body.device_token : null;

    let query = 'INSERT INTO users (email, password, first_name, last_name, phone, device_token)' +
        ' VALUES (' + email + ',' + password + ',' + first_name + ',' + last_name + ',' + phone + ',' + device_token + ')' ;

    queryDB(query)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

app.post('/login', function (req, res, next){
    let email = req.body.email;
    let password = req.body.password;


});

app.get('/contracts', function (req, res, next){

});

app.get('/contracts/:id/sign', function (req, res, next){

});

app.post('/contracts', function (req, res, next){

});



app.set('port', 80);

const server = app.listen(app.get('port'), function() {
   console.log('Connected');
});
