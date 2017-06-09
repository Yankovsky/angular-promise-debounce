import angular from 'angular';
import angularMocks from 'angular-mocks';
import sample from '../src/sample';

let myService;
beforeEach(angular.mock.module('myModule'));
beforeEach(function() {
	//
	// module(function($provide) {
	// 	$provide.value('$window', mock);
	// });

	inject(function($injector) {
		myService = $injector.get('myService');
	});
});

it('should not alert first two notifications', function() {
	expect(myService.a).toEqual(2);
});
