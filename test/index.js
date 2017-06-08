describe("Player", function() {
  it("should be able to play a Song", function() {
    expect(2).toEqual(2);
  });
});

// import angular from 'angular';
// import '../src/sample';
// import jasmine from 'jasmine'
// console.log(215)
//
// describe('PasswordController', function() {
// 	beforeEach(module('app'));
//
// 	var $controller;
//
// 	beforeEach(inject(function(_$controller_){
// 		// The injector unwraps the underscores (_) from around the parameter names when matching
// 		$controller = _$controller_;
// 	}));
//
// 	describe('$scope.grade', function() {
// 		var $scope, controller;
//
// 		beforeEach(function() {
// 			$scope = {};
// 			controller = $controller('PasswordController', { $scope: $scope });
// 		});
//
// 		it('sets the strength to "strong" if the password length is >8 chars', function() {
// 			$scope.password = 'longerthaneightchars';
// 			$scope.grade();
// 			expect($scope.strength).toEqual('strong');
// 		});
//
// 		it('sets the strength to "weak" if the password length <3 chars', function() {
// 			$scope.password = 'a';
// 			$scope.grade();
// 			expect($scope.strength).toEqual('weak');
// 		});
// 	});
// });

//
// import debouncePromise from '../src/index'
//
// let fooService, fooController
//
// describe('The FooController', () => {
// 	beforeEach(() => {
// 		fooService = jasmine.createMock('fooService', ['bar'])
// 		fooController = new FooController(fooService)
// 	})
//
// 	it('should do something', () => {
// 		fooController.doTheThing();
// 		expect(fooService.bar).toHaveBeenCalledWith('I am going to do the thing')
// 	})
// })
//
//
//
// 'build/angular.js', // and other module files you need
// 	'build/angular-mocks.js',
