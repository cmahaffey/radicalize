angular.module('Final',[]);

angular.module('Final')
       .controller('app-controller',["$scope","$http","$sce",function($scope,$http,$sce){
         $scope.welcomeMessage='Hi there, Let\'s chat'
        //  $scope.chats=[
        //    {text:'this is a test'},
        //    {text:'and another'}
        //  ];
        $scope.makeHTML = $sce.trustAsHtml;
         $scope.socket=io();
         $scope.searchResults;
         $scope.newSearch;
         $scope.sendChat = function(){
           $scope.socket.emit('search request', $scope.newSearch)
         };
         $scope.socket.on('send data', function(data){
           $scope.searchResults=data
           $scope.$digest();
         })
         console.log($scope.searchResults);
}]);
