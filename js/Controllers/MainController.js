app.controller('MainController', ['$scope', 'data', function($scope, data) {
	data.success(function(data) {
		$scope.cohorts = data.cohorts;
		$scope.limit = 1;
		$scope.increment = function() {
       		$scope.limit = $scope.limit + 1;
		};

		// $scope.turnoff = function() {
		// 	$scope.limit = 9999;
		// };	

	})
}]);

