
angular.module('infographieApp')
  .controller('appCtrl', function($scope,$http, $filter, ngTableParams, alldata){
  $scope.Math = window.Math;

  $scope.ordinateData = ['Excel','BI Pilot','Cockpit','BO SETHI','SETHI','WCO Report','MUSIC','TrackIT','SAS','ARGUS'];

  /* avec un serveur Web
  $http.get('data/steps.json').success(function (data) {
    console.log(data);
  });*/

  $scope.getOrdinateData = function(ordinate) {
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
     $scope.focusOnData();
  };

 $scope.focusOnData = function(keyAbciss, keyOrdinate){

    $scope.focusAbcissName = (typeof keyAbciss == 'undefined') ? 'none' : keyAbciss;
    $scope.focusOrdinateName = (typeof keyOrdinate == 'undefined') ? 'none' :  keyOrdinate;

    $scope.filters = [];
    if (typeof keyAbciss !== 'undefined' && keyAbciss !== 'none') { $scope.filters.push('Process :' + keyAbciss)}
    if (typeof keyOrdinate !== 'undefined') {$scope.filters.push($scope.ordinate + ' :' + keyOrdinate)}

    $scope.dataArrayAbciss = (typeof keyAbciss == 'undefined' || keyAbciss == 'none') ? alldata : $(alldata).filter(function (key,data){return data.processLevel1.indexOf(keyAbciss) >= 0});
    $scope.dataArray = (typeof keyOrdinate == 'undefined' || keyOrdinate == 'all') ?  $scope.dataArrayAbciss : $($scope.dataArrayAbciss).filter(function (key,data){return data[$scope.ordinateItem].indexOf(keyOrdinate) >= 0});
    //console.log( $scope.dataArray);

    $scope.reports = angular.copy( $scope.dataArray);
    if (typeof $scope.tableParams !== 'undefined') {$scope.tableParams.reload()};
   
    angular.forEach($scope.process, function(dataProcess, keyProcess){

        // reinit
        dataProcess.names = [];
        dataProcess.details = [];
        angular.forEach($scope.ordinateData, function(dataOrdinate,keyOrdinate){
            dataProcess.names.push(keyOrdinate);
            dataProcess.details.push(0);
        });

        angular.forEach(alldata, function(dataAll, keyAll){
            if (dataAll.processLevel1.indexOf(keyProcess)>=0) {
              var index = 0;
              angular.forEach($scope.ordinateData, function(dataOrdinate, keyOrdinate){
                  angular.forEach(dataAll[$scope.ordinateItem].split(", "), function(datasplit){
                      if (datasplit == keyOrdinate ) { dataProcess.details[index] += 1;} 
                  });
                  index +=1;
              });
            }
        });
    });
    console.log($scope.process);
 };

  $scope.groupBy = ['solutions','types','hierarchies'];
  $scope.process = {"Structure Lead": {total:0,details:[]},"Project Lead": {total:0,details:[]},"Study Lead": {total:0,details:[]},"Study Conduct": {total:0,details:[]}};
  $scope.categories = {};
  $scope.solutions = {};
  $scope.hierarchies = {};
  $scope.types = {};

// calculate the results    
    angular.forEach(alldata, function(data){
        angular.forEach(data.processLevel1.split(", "), function(datasplit){
             $scope.process[datasplit].total = (!$scope.process[datasplit].total ) ? 1 : $scope.process[datasplit].total  + 1;  
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
