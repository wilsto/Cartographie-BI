
angular.module('infographieApp')
  .controller('appCtrl', function($scope){

  $scope.BISolutions = ['Excel','BI Pilot','Cockpit','BO SETHI','SETHI','WCO Report','MUSIC','TrackIT','SAS','ARGUS'];

  $scope.steps = [
    {name:'Structure Lead',size:46,color:'#B1B1B1', details:[29,17,0,0,0,0,0,0,0,0]},
    {name:'Project Lead',size:38,color:'#F9AA99',details:[6,31,0,0,0,0,0,0,0,0]},

    {name:'Study Declaration',size:10,color:'#FFBFD7',details:[0,0,0,0,0,0,0,0,0,10]},
    {name:'Study Submission',size:20,color:'#7D92BF',details:[0,0,0,0,0,0,0,0,0,20]}
  ];

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      /** workaround border radius IE8 */
      $('.arrondi').corner();
  });

  $scope.focus = function(name){
    $scope.focusname = name;
  };

});
