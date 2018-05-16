const express = require('express');
const path = require('path');
// const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const Web3 = require('web3');
​
let web3 = new Web3(new Web3.providers.HttpProvider('http://bchxee-dns-reg1.westeurope.cloudapp.azure.com:8545'));
​
let serverWallet = '0x732A6E65688d39cd031A97508C1AF14570149001';
​
let privateKey = '01bb32e06b970e773c5176460f9ca9e974bd249998262b7ae742cdb32cf2456d';
let abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "ownerId",
                "type": "uint256"
            },
            {
                "name": "sellerIds",
                "type": "uint256[]"
            },
            {
                "name": "buyerIds",
                "type": "uint256[]"
            },
            {
                "name": "startTimeInMillis",
                "type": "uint256"
            },
            {
                "name": "endTimeInMillis",
                "type": "uint256"
            },
            {
                "name": "contractFileStr",
                "type": "string"
            }
        ],
        "name": "add_transaction",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "uid",
                "type": "uint256"
            }
        ],
        "name": "get_associated_contracts",
        "outputs": [
            {
                "components": [
                    {
                        "name": "contractId",
                        "type": "uint256"
                    },
                    {
                        "name": "ownerId",
                        "type": "uint256"
                    },
                    {
                        "name": "sellerIds",
                        "type": "uint256[]"
                    },
                    {
                        "name": "sellerSigned",
                        "type": "bool[]"
                    },
                    {
                        "name": "buyerIds",
                        "type": "uint256[]"
                    },
                    {
                        "name": "buyerSigned",
                        "type": "bool[]"
                    },
                    {
                        "name": "startTimeInMillis",
                        "type": "uint256"
                    },
                    {
                        "name": "endTimeInMillis",
                        "type": "uint256"
                    },
                    {
                        "name": "contractFileStr",
                        "type": "string"
                    }
                ],
                "name": "",
                "type": "tuple[]"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "userId",
                "type": "uint256"
            }
        ],
        "name": "get_my_contracts",
        "outputs": [
            {
                "components": [
                    {
                        "name": "contractId",
                        "type": "uint256"
                    },
                    {
                        "name": "ownerId",
                        "type": "uint256"
                    },
                    {
                        "name": "sellerIds",
                        "type": "uint256[]"
                    },
                    {
                        "name": "sellerSigned",
                        "type": "bool[]"
                    },
                    {
                        "name": "buyerIds",
                        "type": "uint256[]"
                    },
                    {
                        "name": "buyerSigned",
                        "type": "bool[]"
                    },
                    {
                        "name": "startTimeInMillis",
                        "type": "uint256"
                    },
                    {
                        "name": "endTimeInMillis",
                        "type": "uint256"
                    },
                    {
                        "name": "contractFileStr",
                        "type": "string"
                    }
                ],
                "name": "",
                "type": "tuple[]"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "userId",
                "type": "uint256"
            },
            {
                "name": "contractId",
                "type": "uint256"
            }
        ],
        "name": "sign_contract",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dummy",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "pull_last_transaction",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256[]"
            },
            {
                "name": "",
                "type": "bool[]"
            },
            {
                "name": "",
                "type": "uint256[]"
            },
            {
                "name": "",
                "type": "bool[]"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
let contractAddress = '0x3e0091b9a67ffe4c3775e5afad0af6fc854b779f';
let contractInstance = web3.eth.contract(abi).at(contractAddress);

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

    let query = "INSERT INTO users (email, password, first_name, last_name, phone, device_token)" +
        " VALUES ('" + email + "','" + password + "','" + first_name + "','" + last_name + "','" + phone + "','" + device_token + "')";

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

    let query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";

    queryDB(query)
        .then((result) => {
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({
                    error: 'invalid_credentials'
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

app.get('/contracts', function (req, res, next){
    console.log(contractInstance.dummy());
});

app.get('/contracts/:id/sign', function (req, res, next){

});

app.post('/contracts', function (req, res, next){

});



app.set('port', 80);

const server = app.listen(app.get('port'), function() {
   console.log('Connected');
});
