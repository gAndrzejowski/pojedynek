// Packages

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 1337;

// Config
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, \ Authorization');
    next()
});

//Logging

app.use(morgan('dev'));

//Homepage

app.get('/',function(req,res) {
    res.send('Witaj na stronie z pojedynkami licytacyjnymi');
    }
);

//Api

var apiRouter = express.Router();

apiRouter.get('/',function(req,res){
     res.json({
              message: "Api strony z pojedynkami, witaj"      
             } 
        );
    }
);

app.use('/api',apiRouter);

// Start the goddamn server already
app.listen(port)
console.log('Strona stoi na porcie ' + port);
