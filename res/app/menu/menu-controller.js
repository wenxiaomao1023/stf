module.exports = function MenuCtrl($scope, $rootScope, SettingsService,
//wen add
  UserService,
//wen end
  $location) {

  SettingsService.bind($scope, {
    target: 'lastUsedDevice'
  })

  SettingsService.bind($rootScope, {
    target: 'platform',
    defaultValue: 'native'
  })

  $scope.$on('$routeChangeSuccess', function() {
    $scope.isControlRoute = $location.path().search('/control') !== -1
  })

  //wen add
  $scope.currentUser = UserService.currentUser
  //wen end

}
