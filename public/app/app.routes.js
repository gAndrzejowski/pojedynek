
angular.module('routerRoutes',['ngRoute'])

    .config(function($routeProvider, $locationProvider){
        
        $routeProvider
        
        
        .when('/',{
            templateUrl : '/app/views/home.html',
            controller : 'homeController',
            controllerAs : 'home' 
        })
        .when('/new',{
            templateUrl : '/app/views/newDeal.html',
            controller : 'dealController',
            controllerAs : 'deal'
        })
        .when('/deal/:deal_id',{
            templateUrl : '/app/views/deal.html',
            controller : 'dealController',
            controllerAs : 'deal'
        })
        
        .when('/contest',{
            templateUrl : '/app/views/contest.html',
            controller : 'contestController',
            controllerAs : 'contest'
        })
        
        .when('/list',{
            templateUrl : '/app/views/list.html',
            controller : 'listController',
            controllerAs : 'list'
        });
        
        $locationProvider.html5Mode(true);
    })