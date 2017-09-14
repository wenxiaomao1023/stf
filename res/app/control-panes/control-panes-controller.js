module.exports =
  function ControlPanesController($scope, $http, gettext, $routeParams,
    $timeout, $location, DeviceService, GroupService, ControlService,
    StorageService, FatalMessageService, SettingsService) {

    var sharedTabs = [
      {
        title: gettext('Screenshots'),
        icon: 'fa-camera color-skyblue',
        templateUrl: 'control-panes/screenshots/screenshots.pug',
        filters: ['native', 'web']
      },
      {
        title: gettext('File Explorer'),
        icon: 'fa-folder-open color-blue',
        templateUrl: 'control-panes/explorer/explorer.pug',
        filters: ['native', 'web']
      }
/*
      {
        title: gettext('Logs'),
        icon: 'fa-info color-orange',
        templateUrl: 'control-panes/logs/logs.pug',
        filters: ['native', 'web']
      }
*/
//wen del
/*
      {
        title: gettext('Screenshots'),
        icon: 'fa-camera color-skyblue',
        templateUrl: 'control-panes/screenshots/screenshots.pug',
        filters: ['native', 'web']
      },
      {
        title: gettext('Automation'),
        icon: 'fa-road color-lila',
        templateUrl: 'control-panes/automation/automation.pug',
        filters: ['native', 'web']
      },
      {
        title: gettext('Advanced'),
        icon: 'fa-bolt color-brown',
        templateUrl: 'control-panes/advanced/advanced.pug',
        filters: ['native', 'web']
      },
      {
        title: gettext('File Explorer'),
        icon: 'fa-folder-open color-blue',
        templateUrl: 'control-panes/explorer/explorer.pug',
        filters: ['native', 'web']
      },
      {
        title: gettext('Info'),
        icon: 'fa-info color-orange',
        templateUrl: 'control-panes/info/info.pug',
        filters: ['native', 'web']
      }
*/
//wen end
    ]

    $scope.topTabs = [
      {
        title: gettext('Dashboard'),
        icon: 'fa-dashboard fa-fw color-pink',
        templateUrl: 'control-panes/dashboard/dashboard.pug',
        filters: ['native', 'web']
      }
    ].concat(angular.copy(sharedTabs))

    $scope.belowTabs = [
      {
        title: gettext('Logs'),
        icon: 'fa-list-alt color-red',
        templateUrl: 'control-panes/logs/logs.pug',
        filters: ['native', 'web']
      }
    ].concat(angular.copy(sharedTabs))

    $scope.device = null
    $scope.control = null

    // TODO: Move this out to Ctrl.resolve
    function getDevice(serial) {
      DeviceService.get(serial, $scope)
        .then(function(device) {
          return GroupService.invite(device)
        })
        .then(function(device) {
          $scope.device = device
          $scope.control = ControlService.create(device, device.channel)

          // TODO: Change title, flickers too much on Chrome
          // $rootScope.pageTitle = device.name

          SettingsService.set('lastUsedDevice', serial)

          return device
        })
        .catch(function() {
          $timeout(function() {
            $location.path('/')
          })
        })
    }

//wen add
//it must use api first, if someone wants to reserve device , example:
//curl -X POST --header "Content-Type: application/json" --data '{"serial":"10.57.3.133:5555","timeout":10000}' -H "Authorization: Bearer token" http://10.57.5.55:7100/api/v1/user/devices
DeviceService.load($routeParams.serial)
  .then(function(device){
    if(device.owner){
      getDevice($routeParams.serial)
    }else{
      $location.path('/')
    }
})
//wen end

//wen del
    //getDevice($routeParams.serial)
//wen end

    $scope.$watch('device.state', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (oldValue === 'using'
//wen add
          || oldValue === 'automation'
//wen end
        ) {
          FatalMessageService.open($scope.device, false)
        }
      }
    }, true)

  }
