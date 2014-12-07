
angular.module('infographieApp')
  .controller('appCtrl', function($scope,$http, $filter, ngTableParams, alldata){
  $scope.Math = window.Math;

  $scope.ordinateData = ['Excel','BI Pilot','Cockpit','BO SETHI','SETHI','WCO Report','MUSIC','TrackIT','SAS','ARGUS'];

  /* avec un serveur Web
  $http.get('data/steps.json').success(function (data) {
    console.log(data);
  });*/

  $scope.getOrdinateData = function(ordinate) {
    $scope.focusData = {};
    $scope.ordinate = ordinate;
    switch($scope.ordinate) {
      case 'solutions':
           $scope.ordinateData = $scope.solutions;
           $scope.ordinateItem = 'solution';
          break;
      case 'types':
            $scope.ordinateData = $scope.types;
             $scope.ordinateItem = 'type';
          break;
      case 'hierarchies':
            $scope.ordinateData = $scope.hierarchies;
             $scope.ordinateItem = 'levelHierarchy';
          break;
      default:
           $scope.ordinateData = $scope.solutions;
            $scope.ordinateItem = 'solution';
    }
    $scope.openGroupBy=false;
  };

  $scope.focus = function(name){
    // filter
    $scope.focusname = name;
    $scope.dataArray = (name === 'all') ? alldata : $(alldata).filter(function (key,data){return data.processLevel1.indexOf(name) >= 0});

    // reinit
    $scope.focusData = {};
    angular.forEach($scope.ordinateData, function(data, key){
        $scope.focusData[key] = 0;
    });

    //agreggate
    angular.forEach($scope.dataArray, function(data){
        angular.forEach(data[$scope.ordinateItem].split(", "), function(datasplit){
             $scope.focusData[datasplit] = (!$scope.focusData[datasplit]) ? 1 : $scope.focusData[datasplit] + 1;  
        });
    });

    //console.log( $scope.focusData);
  };

 $scope.focusOnData = function(keyAbciss, keyOrdinate){

    $scope.filters = [];
    if (typeof keyAbciss !== 'undefined') { $scope.filters.push('Process :' + keyAbciss)}
    if (typeof keyOrdinate !== 'undefined') {$scope.filters.push($scope.ordinate + ' :' + keyOrdinate)}

    $scope.dataArray = (typeof keyAbciss == 'undefined') ? alldata : $(alldata).filter(function (key,data){return data.processLevel1.indexOf(keyAbciss) >= 0});
    console.log( $scope.dataArray);
    $scope.dataArray = (typeof keyOrdinate == 'undefined') ?  $scope.dataArray : $($scope.dataArray).filter(function (key,data){return data[$scope.ordinateItem].indexOf(keyOrdinate) >= 0});
    //console.log( $scope.dataArray);

    $scope.reports = angular.copy( $scope.dataArray);
    if (typeof $scope.tableParams !== 'undefined') {$scope.tableParams.reload()};


 };


  $scope.ordinate = 'solutions';
  $scope.groupBy = ['solutions','types','hierarchies'];
  $scope.categories = {};
  $scope.process = {"Structure Lead":0,"Project Lead":0,"Study Lead":0};
  $scope.solutions = {};
  $scope.hierarchies = {};
  $scope.types = {};

// calculate the results    
    angular.forEach(alldata, function(data){
        angular.forEach(data.processLevel1.split(", "), function(datasplit){
             $scope.process[datasplit] = (!$scope.process[datasplit]) ? 1 : $scope.process[datasplit] + 1;  
        });
        angular.forEach(data.category.split(", "), function(datasplit){
             $scope.categories[datasplit] = (!$scope.categories[datasplit]) ? 1 : $scope.categories[datasplit] + 1;  
        });
        angular.forEach(data.levelHierarchy.split(", "), function(datasplit){
             $scope.hierarchies[datasplit] = (!$scope.hierarchies[datasplit]) ? 1 : $scope.hierarchies[datasplit] + 1;  
        });
        angular.forEach(data.solution.split(", "), function(datasplit){
             $scope.solutions[datasplit] = (!$scope.solutions[datasplit]) ? 1 : $scope.solutions[datasplit] + 1;  
        });
        angular.forEach(data.type.split(", "), function(datasplit){
             $scope.types[datasplit] = (!$scope.types[datasplit]) ? 1 : $scope.types[datasplit] + 1;  
        });
    });

  $scope.alldata = angular.copy(alldata);
  $scope.getOrdinateData('solutions');  
  $scope.focusOnData();

  $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: {
                 // initial filter exemple :  name: 'M' 
        }
    }, {
        total: $scope.reports.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.filter() ? $filter('filter')($scope.reports, params.filter()) : $scope.reports;
            $scope.filteredReports = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve($scope.filteredReports);
        }
    });

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $('.arrondi').corner();
      $('.badge').corner();
  });



});
