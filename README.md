Inspired by other promise-debounce plugins. Unlike other plugins, this one works with angular promises.

Installation:
`npm i -D angular-promise-debounce`

Basic use-case:
```
angular.module('myApp', ['debouncePromise']).run(['$timeout', '$http', 'debouncePromise', ($timeout, $http, debouncePromise) => {
	let callsCount = 0;
	const debounced = debouncePromise(() => {
		callsCount++;
		return $http.get('index.html');
	}, 100);

	for (let i = 0; i < 5; i++) {
		$timeout(() => {
			debounced().then(response => console.log(callsCount));
		}, i * 100);
	}
}]);
```

Console:
```
1
1
1
1
1
```

Check test directory for advanced use-cases.
