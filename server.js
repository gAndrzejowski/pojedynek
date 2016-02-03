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
                
                deal.hcpEast = (req.body.hcpEast !== undefined) ? req.body.hcpEast : deal.hcpEast;
                deal.hcpWest = (req.body.hcpWest !== undefined) ? req.body.hcpWest : deal.hcpWest;
                deal.hcpTotal = deal.hcpEast+deal.hcpWest;
                
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
        to_insert.hcpEast = (req.body.hcpEast) ? req.body.hcpEast : -40;
        to_insert.hcpWest = (req.body.hcpWest) ? req.body.hcpWest : -40;
        to_insert.hcpTotal = parseInt(to_insert.hcpEast)+parseInt(to_insert.hcpWest);
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
                    
        testDeal.hcpEast = 10;
        testDeal.hcpWest = 0;
        testDeal.hcpTotal = 10;
        testDeal.best = 1;
        testDeal.good = 1;
        testDeal.fair = 1;
    console.log('do zapisu');    
    testDeal.save();
        res.json({
            message: "Dodano dokument testowy",
        
    });
});
//list all deals
apiRouter.get('/list',function(req,res){
   deals = Deal.find({},function(err,deals){
       list = Array();
       for (i=0;i<deals.length;i++) {
           console.log(deals[i]);
           list.push({
              deal_id: deals[i]._id,
              difficulty: deals[i].best+deals[i].good+deals[i].fair,
              hcp_total:deals[i].hcpTotal
           });
       }
       res.json({
           deals:list,
           message:"obecnie posiadamy rozdań w naszej bazie: "+list.length
       });
   }) 
});
//get specific deals
apiRouter.get('/deals/:qtity',function(req,res){
    
    var queryFilter = {
        hcpEast: {},
        hcpWest: {},
        hcpTotal: {},
        best: {},
        good: {},
        fair: {},
    };
    //grab params from request query and build a condition to filter db results by field
    var fieldLimit = function(maxP,minP) {
        var field = {$exists: true};
        if (maxP!==undefined && minP!==undefined) 
            {
            field = {$lte: parseInt(maxP), $gte: parseInt(minP)};
            }
        else {
            if (maxP!==undefined) field = {$lte: parseInt(maxP)};
            if (minP!==undefined) field = {$gte: parseInt(minP)};
            } 
        return field;
    }
    //hcpEast condition
    queryFilter.hcpEast = fieldLimit(req.query.maxHE,req.query.minHE);
    //hcpWest condition
    queryFilter.hcpWest = fieldLimit(req.query.maxHW,req.query.minHW);
    //total hcp condition
    queryFilter.hcpTotal = fieldLimit(req.query.maxHT,req.query.minHT);
    // best contract difficulty
    queryFilter.best = fieldLimit(req.query.maxB,req.query.minB);
    // good contract difficulty
    queryFilter.good = fieldLimit(req.query.maxG,req.query.minG);
    // fair contract difficulty
    queryFilter.fair = fieldLimit(req.query.maxF,req.query.minF);
    
   
    deals = Deal.find(queryFilter,function(err,deals){
       var removeRandom = function(arrayToCut) {
           var ind = Math.floor((Math.random()*arrayToCut.length))
           return arrayToCut.splice(ind,1);
       }
       
       var newDeals = Array();
       for (i=0;i<req.params.qtity;i++) {
           newDeals.push(removeRandom(deals)[0]);
       }
       res.json(newDeals);
       
    });
});

app.use('/api',apiRouter);

// Start the goddamn server already
app.listen(port)
console.log('Strona stoi na porcie ' + port);
