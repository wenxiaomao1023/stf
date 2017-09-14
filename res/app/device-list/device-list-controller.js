var QueryParser = require('./util/query-parser')

module.exports = function DeviceListCtrl(
  $scope
, DeviceService
, DeviceColumnService
, GroupService
, ControlService
, SettingsService
, $location
  //wen add
, UserService
  //wen end
) {
  $scope.tracker = DeviceService.trackAll($scope)
  $scope.control = ControlService.create($scope.tracker.devices, '*ALL')

  $scope.columnDefinitions = DeviceColumnService

  var defaultColumns = [
    {
      name: 'state'
    , selected: true
    }
  , {
      name: 'model'
    , selected: true
    }
  , {
      name: 'name'
    , selected: true
    }
//wen del
/*
  , {
      name: 'serial'
    , selected: true
    }
*/
//wen end
  , {
      name: 'operator'
    , selected: true
    }
  , {
      name: 'releasedAt'
    , selected: false
    }
  , {
      name: 'version'
    , selected: true
    }
//wen del
/*
  , {
      name: 'network'
    , selected: true
    }
*/
//wen end
  , {
      name: 'display'
    , selected: true
    }
  , {
      name: 'manufacturer'
    , selected: true
    }
  , {
      name: 'sdk'
    , selected: true
    }
//wen del
/*
  , {
      name: 'abi'
    , selected: false
    }
  , {
      name: 'browser'
    , selected: false
    }
  , {
      name: 'phone'
    , selected: false
    }
  , {
      name: 'imei'
    , selected: false
    }
  , {
      name: 'imsi'
    , selected: false
    }
  , {
      name: 'iccid'
    , selected: false
    }
  , {
      name: 'batteryHealth'
    , selected: false
    }
  , {
      name: 'batterySource'
    , selected: false
    }
  , {
      name: 'batteryStatus'
    , selected: false
    }
  , {
      name: 'batteryLevel'
    , selected: false
    }
  , {
      name: 'batteryTemp'
    , selected: false
    }
  , {
      name: 'provider'
    , selected: true
    }
*/
//wen del
  , {
      name: 'notes'
    , selected: true
    }
  , {
      name: 'owner'
    , selected: true
    }
  ]

  $scope.columns = defaultColumns

  SettingsService.bind($scope, {
    target: 'columns'
  , source: 'deviceListColumns'
  })

  var defaultSort = {
    fixed: [
      {
        name: 'state'
        , order: 'asc'
      }
    ]
    , user: [
      {
        name: 'name'
        , order: 'asc'
      }
    ]
  }

  $scope.sort = defaultSort

  SettingsService.bind($scope, {
    target: 'sort'
  , source: 'deviceListSort'
  })

  //wen add
  $scope.filter = QueryParser.parse(UserService.currentUser.name)
  //wen end

  //wen del
  //$scope.filter = []
  //wen end

  $scope.activeTabs = {
    icons: true
  , details: false
  }

  SettingsService.bind($scope, {
    target: 'activeTabs'
  , source: 'deviceListActiveTabs'
  })

  $scope.toggle = function(device) {
    if (device.using) {
      $scope.kick(device)
    } else {
      $location.path('/control/' + device.serial)
    }
  }

  $scope.invite = function(device) {
    return GroupService.invite(device).then(function() {
      $scope.$digest()
    })
  }

  $scope.applyFilter = function(query) {
    $scope.filter = QueryParser.parse(query)
  }

  $scope.search = {
    //wen add
    deviceFilter: UserService.currentUser.name,
    //wen end

    //wen del
    //deviceFilter: '',
    //wen end
    focusElement: false
  }

  $scope.focusSearch = function() {
    if (!$scope.basicMode) {
      $scope.search.focusElement = true
    }
  }

  $scope.reset = function() {
    //wen add
    $scope.search.deviceFilter = UserService.currentUser.name
    $scope.filter = QueryParser.parse(UserService.currentUser.name)
    //wen end

    //wen del
    //$scope.search.deviceFilter = ''
    //$scope.filter = []
    //wen end
    $scope.sort = defaultSort
    $scope.columns = defaultColumns
  }

}
