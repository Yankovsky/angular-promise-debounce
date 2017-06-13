Inspired by other promise-debounce plugins. Unlike other plugins, this one works with angular promises.

Installation:
`npm i -D angular-promise-debounce`

Basic use-case:
```
angular.module('myApp', ['debouncePromise']).run(['$timeout', '$http', 'debouncePromise', ($timeout, $http, debouncePromise) => {
	let callsCount = 0;
	const debounced = debouncePromise(value => {
		callsCount++;
		return $http.get(`index.html?i=${value}`);
	}, 100);

	for (let i = 0; i < 5; i++) {
		$timeout(() => {
			debounced(i).then(response => console.log(callsCount, response.config.url));
		}, i * 50);
	}
}]);
```

Console:
```
1 "index.html?i=4"
1 "index.html?i=4"
1 "index.html?i=4"
1 "index.html?i=4"
1 "index.html?i=4"
```

Check test directory for advanced use-cases.
