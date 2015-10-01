angular.module('Final',[]);

angular.module('Final')
       .controller('app-controller',["$scope","$http",function($scope,$http){
         $scope.welcomeMessage='Hi there, Let\'s chat'
         $scope.chats=[
           {text:'this is a test'},
           {text:'and another'}
         ];
         $scope.socket=io();

         $scope.newChat = {};
         $scope.sendChat = function(){
           $scope.socket.emit('send message', $scope.newChat)
         };
         $scope.socket.on('emit message', function(message){
           console.log(message);
           $scope.chats.push(message);
           $scope.$digest();
         })

}]);
