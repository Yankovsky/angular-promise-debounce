Inspired by other promise-debounce plugins. Unlike other plugins, this one works with angular promises.

Basic use-case:
```
angular.module('myApp', ['debouncePromise']).run(['$timeout', '$q', 'debouncePromise', ($timeout, $q, debouncePromise) => {
	const debounced = debouncePromise(value => {
		const deferred = $q.defer();
		deferred.resolve(value);
		return deferred.promise;
	}, 100);

	for (let i = 0; i < 5; i++) {
		$timeout(() => {
			debounced(i).then(value => {
				console.log(value);
			});
		}, i * 100);
	}
}]);
```

Console:
```
4
4
4
4
4
```
