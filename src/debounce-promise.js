export default angular.module('debouncePromise', []).factory('debouncePromise', ['$q', '$timeout', ($q, $timeout) => () => {
	const deferred = $q.defer();

	deferred.resolve();

	return deferred.promise;
}]).name;
