import angular from 'angular';
import angularMocks from 'angular-mocks';
import debouncedPromiseModule from '../src/index';

describe('debouncePromise', () => {
	let debouncePromise, $timeout, $q;

	beforeEach(() => {
		angular.mock.module(debouncedPromiseModule, /*($provide) => {
			$provide.value('$window', {});
		}*/);

		inject((_debouncePromise_, _$timeout_, _$q_) => {
			debouncePromise = _debouncePromise_;
			$timeout = _$timeout_;
			$q = _$q_;
		});
	});

	it('single successful call', () => {
		const debounced = debouncePromise(() => {
			const deferred = $q.defer();
			deferred.resolve('Success');
			return deferred.promise;
		}, 100);

		debounced().then(result => expect(result).toEqual('Success'));

		$timeout.flush();
	});

	it('single unsuccessful call', () => {
		const debounced = debouncePromise(() => {
			const deferred = $q.defer();
			deferred.reject('Error');
			return deferred.promise;
		}, 100);

		debounced().catch(error => expect(error).toEqual('Error'));

		$timeout.flush();
	});

	it('single call with zero delay', () => {
		const debounced = debouncePromise(() => {
			const deferred = $q.defer();
			deferred.resolve('Success');
			return deferred.promise;
		});

		debounced().catch(error => expect(error).toEqual('Success'));

		$timeout.flush();
	});

	it('debounce no delay between calls', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => {
			callCount++;
			const deferred = $q.defer();
			deferred.resolve(value);
			return deferred.promise;
		}, 100);

		for (let i = 0; i < 5; i++) {
			debounced(i).then(value => expect(value).toEqual(4));
		}

		$timeout.flush();

		expect(callCount).toEqual(1);
	});

	it('debounce delay >= promise call delay', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => {
			callCount++;
			const deferred = $q.defer();
			deferred.resolve(value);
			return deferred.promise;
		}, 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i).then(value => {
					expect(value).toEqual(4);
				});
			}, i * 100);
		}

		$timeout.flush();
		$timeout.flush();

		expect(callCount).toEqual(1);
	});

	it('debounce delay < promise call delay', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => {
			callCount++;
			const deferred = $q.defer();
			deferred.resolve(value);
			return deferred.promise;
		}, 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i).then(value => {
					expect(value).toEqual(i);
				});
			}, i * 101);
		}

		$timeout.flush();
		$timeout.flush();

		expect(callCount).toEqual(5);
	});

	it('nested', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => {
			callCount++;
			const deferred = $q.defer();
			deferred.resolve(value);
			return deferred.promise;
		}, 100);

		$timeout(() => {
			debounced(1).then(value => {
				expect(value).toEqual(1);
				expect(callCount).toEqual(1);

				debounced(2).then(value => {
					expect(value).toEqual(2);
					expect(callCount).toEqual(2);

					debounced(3).then(value => {
						expect(value).toEqual(3);
						expect(callCount).toEqual(3);
					})
				})
			});
		}, 100);

		$timeout.flush();
		$timeout.flush();
		$timeout.flush();
		$timeout.flush();
	});

	it('multiple debounce resolves', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => {
			callCount++;
			const deferred = $q.defer();
			deferred.resolve(value);
			return deferred.promise;
		}, 100);

		$timeout(() => {
			debounced(1).then(value => {
				expect(value).toEqual(2);
				expect(callCount).toEqual(1);
			});
		}, 100);

		$timeout(() => {
			debounced(2).then(value => {
				expect(value).toEqual(2);
				expect(callCount).toEqual(1);
			});
		}, 200);

		$timeout(() => {
			debounced(3).then(value => {
				expect(value).toEqual(4);
				expect(callCount).toEqual(2);
			});
		}, 301);

		$timeout(() => {
			debounced(4).then(value => {
				expect(value).toEqual(4);
				expect(callCount).toEqual(2);
			});
		}, 401);

		$timeout.flush();
		$timeout.flush();
	});

	it('should accept any number of arguments', () => {
		const debounced = debouncePromise((a, b, c) => {
			const deferred = $q.defer();
			deferred.resolve(a + b + c);
			return deferred.promise;
		}, 100);

		for (let i = 0; i < 5; i++) {
			debounced(i, i * 10, i * 100).then(value => {
				expect(value).toEqual(444);
			});
		}
		$timeout.flush();
	});

	it('should not create new promise until debounce timeout is not resolved', () => {
		const debounced = debouncePromise(() => {
			const deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		}, 100);


		let first;
		$timeout(() => {
			first = debounced();
		}, 50);

		let second;
		$timeout(() => {
			second = debounced();
		}, 100);

		let third;
		$timeout(() => {
			third = debounced();
		}, 201);

		$timeout.flush();
		$timeout.flush();

		expect(first).toBe(second);
		expect(first).not.toBe(third);
	});
	//
	// it('underlying promise', () => {
	// 	const debounced = debouncePromise(value => {
	// 		const deferred = $q.defer();
	// 		deferred.resolve();
	// 		deferred.promise.myExtendedPromiseValue = value;
	// 		return deferred.promise;
	// 	}, 100);
	//
	// 	const debouncedPromise = debounced('myValue');
	//
	// 	$timeout.flush();
	//
	// 	expect(debouncedPromise.wrappedPromise.myExtendedPromiseValue).toEqual('myValue');
	// });
});
