
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
.controller('dealController',function(){
  
    var con = this;
    
    con.presentMe = 'I take care of single deal actions';
})
// controller to take care of creating and presenting contests
.controller('contestController',function(){
 
    var con = this;
    
    con.presentMe = 'I take care of full contest business';
})
// list all deals
.controller('listController',function(){
    
    var con = this;
    
    con.presentMe = 'I show full list of deals and give access to actions concerning them';
});