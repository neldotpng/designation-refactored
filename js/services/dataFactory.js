app.factory('data', ['$http', function($http) {
	return $http.get('http://localhost:8080/json/main.json')
		.success(function(data) {
			return data;

		})
		.error(function(err) {
			return err;
		});
}]);

