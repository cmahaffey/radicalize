angular.module('Final',[]);

angular.module('Final')
       .controller('app-controller',["$scope","$http","$sce",function($scope,$http,$sce){
         $scope.welcomeMessage='Hi there, Let\'s chat'
        $scope.searchRads=[]
        $scope.makeHTML = $sce.trustAsHtml;
         $scope.socket=io();
         $scope.searchResults;
         $scope.newSearch;
         $scope.sendChat = function(character){
           $scope.newSearch=character;
           console.log('character sent:' +character);
           $scope.socket.emit('search request', $scope.newSearch)
         };
         $scope.socket.on('send data', function(data){
           $scope.searchResults=data;
           $scope.$digest();
         })
        //  console.log($scope.searchResults);
         $scope.radicals=[];
         $http.get('api/CharRads').then(function(response){
           console.log(response.data);
          $scope.radicals = response.data;
        });
         $scope.findCharacters = function(radical){
           $scope.searchRads.push(radical)
           $scope.socket.emit('get characters', $scope.searchRads)
           console.log('Radicals:'+ $scope.searchRads);
         };
         $scope.socket.on('send characters', function(characters){
           $scope.relevantChars=characters;
           $scope.$digest();
         })
}]);
