export default angular.module('debouncePromise', []).factory('debouncePromise', ['$q', '$timeout', ($q, $timeout) => {
	return (fn, delay = 0) => {
		let timeoutPromise;
		let deferred;
		return (...fnArguments) => {
			if (timeoutPromise) {
				$timeout.cancel(timeoutPromise);
			} else {
				deferred = $q.defer();
			}

			timeoutPromise = $timeout(() => {
				fn.apply(this, fnArguments).then(result => {
					deferred.resolve(result);
				}).catch(error => {
					deferred.reject(error);
				});
				$timeout.cancel(timeoutPromise);
				timeoutPromise = null;
			}, delay);

			return deferred.promise;
		};
	};
}]).name;
