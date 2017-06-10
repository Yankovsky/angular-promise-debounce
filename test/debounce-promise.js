import angular from 'angular';
import angularMocks from 'angular-mocks';
import debouncedPromiseModule from '../src/index';

describe('debouncePromise', () => {
	const noop = () => {};

	const resolve = (fn = noop) => {
		const deferred = $q.defer();
		deferred.resolve(fn());
		return deferred.promise;
	};

	const reject = (fn = noop) => {
		const deferred = $q.defer();
		deferred.reject(fn());
		return deferred.promise;
	};

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
		const debounced = debouncePromise(() => resolve(() => 'Success'), 100);

		debounced().then(result => expect(result).toEqual('Success'));

		$timeout.flush();
	});

	it('single unsuccessful call', () => {
		const debounced = debouncePromise(() => reject(() => 'Error'), 100);

		debounced().catch(error => expect(error).toEqual('Error'));

		$timeout.flush();
	});

	it('single call with zero delay', () => {
		const debounced = debouncePromise(() => resolve(() => 'Success'));

		debounced().then(error => expect(error).toEqual('Success'));

		$timeout.flush();
	});

	it('should return result of the latest call when calls made without delay', () => {
		const debounced = debouncePromise(value => resolve(() => value), 100);

		for (let i = 0; i < 5; i++) {
			debounced(i).then(value => expect(value).toEqual(4));
		}

		$timeout.flush();
	});

	it('should call target promise only one time when calls made without delay', () => {
		let callCount = 0;
		const debounced = debouncePromise(() => resolve(() => callCount++), 100);

		for (let i = 0; i < 5; i++) {
			debounced(i);
		}

		$timeout.flush();

		expect(callCount).toEqual(1);
	});

	it('should return result of the latest call when calls made within specified delay', () => {
		const debounced = debouncePromise(value => resolve(() => value), 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i).then(value => {
					expect(value).toEqual(4);
				});
			}, i * 100);
		}

		$timeout.flush();
		$timeout.flush();
	});

	it('should call target promise only one time when calls made within specified delay', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => resolve(() => callCount++), 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i)
			}, i * 100);
		}

		$timeout.flush();
		$timeout.flush();

		expect(callCount).toEqual(1);
	});

	it('????', () => {
		const debounced = debouncePromise(value => resolve(() => value), 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i).then(value => {
					expect(value).toEqual(i);
				});
			}, i * 101);
		}

		$timeout.flush();
		$timeout.flush();
	});

	it('!!!!', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => resolve(() => callCount++), 100);

		for (let i = 0; i < 5; i++) {
			$timeout(() => {
				debounced(i);
			}, i * 101);
		}

		$timeout.flush();
		$timeout.flush();

		expect(callCount).toEqual(5);
	});

	it('nested', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => resolve(() => {
			callCount++;
			return value;
		}), 100);

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
		const debounced = debouncePromise(value => resolve(() => {
			callCount++;
			return value;
		}), 100);

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

	it('should wait until delay time has passed', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => resolve(() => callCount++), 100);

		$timeout(debounced, 50);
		$timeout(debounced, 150);

		$timeout.flush(249);
		expect(callCount).toEqual(0);
		$timeout.flush(250);
		expect(callCount).toEqual(1);
	});

	it('should call the given function again if wait time has passed', () => {
		let callCount = 0;
		const debounced = debouncePromise(value => resolve(() => callCount++), 100);

		debounced();
		$timeout.flush();
		expect(callCount).toEqual(1);

		debounced();
		$timeout.flush();
		expect(callCount).toEqual(2);
	});

	it('should accept any number of arguments', () => {
		const debounced = debouncePromise((a, b, c) => resolve(() => a + b + c), 100);

		for (let i = 0; i < 5; i++) {
			debounced(i, i * 10, i * 100).then(value => {
				expect(value).toEqual(444);
			});
		}
		$timeout.flush();
	});

	it('should not create new promise until debounce timeout is not resolved', () => {
		const debounced = debouncePromise(() => resolve(), 100);

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
