app.factory('data', ['$http', function($http) {
	return $http.get('json/main.json')
		.success(function(data) {
			return data;

		})
		.error(function(err) {
			return err;
		});
}]);

