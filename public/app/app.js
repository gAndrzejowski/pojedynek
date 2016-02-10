
angular.module('contestApp',['routerRoutes'])

//main controller - swap controllers acoording to URI

.controller('mainController',function(){
    
    var con = this;
    
    con.presentMe = "I am the main controller";
})
// homepage
.controller('homeController',function(){
        
    var con = this;
    
    con.presentMe = 'I am the homepage';
})
// controller to take care of single deal actions
.controller('dealController',function($routeParams,$http,$sce){
  
    var con = this;
    
    $http({
        method: 'GET',
        url: '/api/deal/'+$routeParams.deal_id
    })
        .then(function(response){
            con.details = response.data;
        },function(Err){
            con.details = Err.data.message;        
        });
    con.parseContract = function(contract){
        var strain = contract.charAt(0);
        var level = contract.charAt(1);
        var hand = contract.charAt(2);
        switch(strain) {
            case 'N': 
            strain = "NT";
            break;
            case 'S':
            strain = "&spades;";
            break;
            case 'H':
            strain = "&hearts;";
            break;
            case 'D':
            strain = "&diams;";
            break;
            case 'C':
            strain = "&clubs";
            break;
            default:
            strain = "???";
        }
        var contract = level+strain;
        if (hand) contract += hand;
        return $sce.trustAsHtml(contract);
    };
    con.parseDiff = function(diff) {
        var stars = '';
        for (i=0;i<diff;i++) stars +="&#9733;"; //black star
        return $sce.trustAsHtml(stars);
    }
    con.setDiff = function(diffValue,contract) {
        if (contract == 'best') con.best = diffValue;
        if (contract == 'good') con.good = diffValue;
        if (contract == 'fair') con.fair = diffValue;
        con.checkDiff();
    }
    con.checkDiff = function() {
        if (con.best<con.good || con.good<con.fair) 
            {
                con.diffMessage = 'Trudniej spełnić łatwiejsze wymagania? hmm...',
                con.diffMsgClass = 'alert-warning'
            }
        else 
            {
                con.diffMessage = 'Z poziomem trudności wszystko OK',
                con.diffMsgClass = 'alert-success'
            }
    }
    con.parseSuit = function(suitArray){
        var suitString = '';
        for (i=0;i<suitArray.length;i++)
        {
            if (suitArray[i][0]) suitString += suitArray[i][1];
        }
        return suitString;
    }
    con.checkCards = function(hand) {
        var cards, pClass;
        if (hand=='W') cards = con.parseSuit(con.WSpadesOption).length+con.parseSuit(con.WHeartsOption).length+con.parseSuit(con.WDiamsOption).length+con.parseSuit(con.WClubsOption).length;
        else cards = con.parseSuit(con.ESpadesOption).length+con.parseSuit(con.EHeartsOption).length+con.parseSuit(con.EDiamsOption).length+con.parseSuit(con.EClubsOption).length;    
        if (cards<13) pClass = "text-warning";
        else if (cards==13) pClass = "text-success";
        else pClass = "text-danger";
        var pMessage = '<p class="'+pClass+'">Liczba kart '+hand+': '+cards+'</p>';
        return $sce.trustAsHtml(pMessage);
    }
    con.WSpadesOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.WHeartsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];    
     con.WDiamsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.WClubsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.ESpadesOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.EHeartsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.EDiamsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    con.EClubsOption = 
             [
             [false,'A'],
             [false,'K'],
             [false,'D'],
             [false,'W'],
             [false,'10'],
             [false,'9'],
             [false,'8'],
             [false,'7'],
             [false,'6'],
             [false,'5'],
             [false,'4'],
             [false,'3'],
             [false,'2'],
             ];
    
    con.presentMe = 'I take care of single deal actions';
})
// controller to take care of creating and presenting contests
.controller('contestController',function($http){
 
    var con = this;
    
    con.presentMe = 'I take care of full contest business';
})
// list all deals
.controller('listController',function($http){
    
    var con = this;
    
    $http({
        method: 'GET',
        url: '/api/list'
    })
        .then(function(response){
            con.deals = response.data;
        },function(Err){
            con.deals = Err.data.message;
        })
        
    
    con.presentMe = 'I show full list of deals and give access to actions concerning them';
});