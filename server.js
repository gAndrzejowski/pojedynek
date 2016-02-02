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
//api homepage, mostly useless
apiRouter.get('/',function(req,res){
     res.json({
              message: "Api strony z pojedynkami, witaj"      
             } 
        );
    }
);
//grab all deals
apiRouter.get('/all',function(req,res) {
    var allDeals=Deal.find({},function(err,dealsArr){
        if (err) return res.json({message : err});
        res.json({
        message: "Oto wszystkie nasze rozdania, warto było czekać?" ,
        deals: dealsArr
    });
    })  
});
//single deal interface
apiRouter.route('/deal/:deal_id')
        // grab a single deal
        .get(function(req,res){
            Deal.findOne({_id: req.params.deal_id},function(err,deal){
                if (err) return res.json({message : err});
                res.json(deal);
            });
        })
        // update deal data
        .put(function(req,res){
            Deal.findOne({_id: req.params.deal_id},function(err,deal){
                if (err) return res.json({message : err});

                deal.hands = {
                    east: (req.body.handEast !== undefined) ? req.body.handEast : deal.hands.east, 
                    west: (req.body.handWest !== undefined) ? req.body.handWest : deal.hands.west
                };
                deal.contracts = (req.body.contracts !== undefined) ? req.body.contracts : deal.contracts;
                deal.hcp = {
                    east: (req.body.hcpEast !== undefined) ? req.body.hcpEast : deal.hcp.east,
                    west: (req.body.hcpWest !== undefined) ? req.body.hcpWest : deal.hcp.west
                };
                deal.best = (req.body.best !== undefined) ? req.body.best : deal.best;
                deal.good = (req.body.good !== undefined) ? req.body.good : deal.good;
                deal.fair = (req.body.fair !== undefined) ? req.body.fair : deal.good;
            
                deal.save(function(err){
                    if (err) return res.json({message : err});
                    res.json(deal);  
                });
                
                
                });
        })
        // delete a deal
        .delete(function(req,res){
            Deal.remove({_id: req.params.deal_id},function(err){
                if (err) return res.json({message: err});
                res.json({message: "deal "+req.params.deal_id+" deleted successfully"});
            })
        });
//add a new deal
apiRouter.post('/deal',function(req,res){
    var to_insert = new Deal();
        to_insert.hands = {
            east: (req.body.handEast) ? req.body.handEast : null,
            west: (req.body.handWest) ? req.body.handWest : null,
        };
        to_insert.contracts = (req.body.contracts) ? req.body.contracts : null;
        to_insert.hcp = {
            east: (req.body.hcpEast) ? req.body.hcpEast : -40,
            east: (req.body.hcpWest) ? req.body.hcpWest : -40,
        };
        to_insert.best = (req.body.best) ? req.body.best : 0;
        to_insert.good = (req.body.good) ? req.body.good : 0;
        to_insert.fair = (req.body.fair) ? req.body.fair : 0;
        to_insert.save(function(err){
            if (err) return res.status(400).json({message: err});
            res.redirect('/');
        })
});
//add a test deal with 13 spades
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
