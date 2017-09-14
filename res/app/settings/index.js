module.exports = angular.module('ui-settings', [
  require('./general').name,
  require('./keys').name,
  require('stf/common-ui/nice-tabs').name
  //require('./notifications').name
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/settings', {
//wen add
      redirectTo: '/devices'
//wen end
      //template: require('./settings.pug')
    })
  }])
  .controller('SettingsCtrl', require('./settings-controller'))
