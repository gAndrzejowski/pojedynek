
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
        var level = contract.charAt(1);
        var strain = contract.charAt(0);
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
        return $sce.trustAsHtml(contract);
    };
    con.parseDiff = function(diff) {
        var stars = '';
        for (i=0;i<diff;i++) stars +="&#9733;"; //black star
        return $sce.trustAsHtml(stars);
    }
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