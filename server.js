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

//Database
mongoose.connect('mongodb://localhost/db');
var Deal = require('./models/deal');

//Homepage

app.get('/',function(req,res) {
    res.send('Witaj na stronie z pojedynkami licytacyjnymi');
    }
);

//Api

var apiRouter = express.Router();
apiRouter.use(function(req,res,next){
    //log api requests
    console.log('New api request:'+req.method+' '+req.originalUrl+' from: '+req.ip);
    next();
})

apiRouter.get('/',function(req,res){
     res.json({
              message: "Api strony z pojedynkami, witaj"      
             } 
        );
    }
);

apiRouter.get('/all',function(req,res) {
    var allDeals=Deal.find({},function(err,dealsArr){
        console.log(dealsArr);
        res.json({
        message: "Oto wszystkie nasze rozdania, warto było czekać?" ,
        deals: dealsArr
    });
    })
    
    
});
apiRouter.post('/addtest',function(req,res){
    var testDeal = new Deal();
        testDeal.hands = {
            east: ['AKDW1098765432','','',''],
            west: ['','65432','5432','5432']
        };
        testDeal.contracts ={
            S7: 20,
            S6: 3
        };
                    
        testDeal.hcp = {
        east: 10,
        west: 0
        };
        testDeal.best = 1;
        testDeal.good = 1;
        testDeal.fair = 1;
    console.log('do zapisu');    
    testDeal.save();
        res.json({
            message: "Dodano dokument testowy",
        
    });
});
app.use('/api',apiRouter);

// Start the goddamn server already
app.listen(port)
console.log('Strona stoi na porcie ' + port);
