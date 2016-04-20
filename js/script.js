var app = angular.module('gpa', []);

app.controller("calcCtrl", function($scope, $filter){

  // Initialize
  $scope.totalgpa = 4; //Total GPA
  var classCount = 1; //Count for amount of classes
  $scope.classes = [ //Add a class for placeholder
    {name: 'Class 1', credit: 3, grade: 4}
  ];
  $scope.grades = [
    {value: 4, text: 'A'},
    {value: 3.5, text: 'B+'},
    {value: 3, text: 'B'},
    {value: 2, text: 'C'},
    {value: 2.5, text: 'C+'},
    {value: 1.5, text: 'D+'},
    {value: 1, text: 'D'},
    {value: 0, text: 'F'}
  ];

  // Remove Class
  $scope.removeClass = function(index) {
    // If it's the last column, set GPA to 0.
    if($scope.classes.length == 1){
      $scope.totalgpa = 0;
    }
    classCount--;
    $scope.classes.splice(index, 1);
    // Also need to update if it's removed
    $scope.updateGPA();
  };

  // Add Class
  $scope.addClass = function() {
    classCount++;
    $scope.inserted = {
      id: $scope.classes.length+1,
      name: "Class " + classCount,
      credit: null,
      grade: null
    };
    $scope.classes.push($scope.inserted);
  };

  $scope.changeType = function(){
    if($scope.gpatype == 1){
      $scope.grades = [
        {value: 4, text: 'A'},
        {value: 3.5, text: 'B+'},
        {value: 3, text: 'B'},
        {value: 2, text: 'C'},
        {value: 2.5, text: 'C+'},
        {value: 1.5, text: 'D+'},
        {value: 1, text: 'D'},
        {value: 0, text: 'F'}
      ];
    };
    if($scope.gpatype == 2){
      $scope.grades = [
        {value: 4, text: 'A+'},
        {value: 4, text: 'A'},
        {value: 3.7, text: 'A-'},
        {value: 3.3, text: 'B+'},
        {value: 3, text: 'B'},
        {value: 2.7, text: 'B-'},
        {value: 2.3, text: 'C+'},
        {value: 2, text: 'C'},
        {value: 1.7, text: 'C-'},
        {value: 1.3, text: 'D+'},
        {value: 1, text: 'D'},
        {value: 0.7, text: 'D-'},
        {value: 0, text: 'F'}
      ];
    };
  };

  // Update the total GPA. Formula for Rutgers is Credit of class times Grade divided by total credits.
  $scope.updateGPA = function(){
    var totalcredits = 0;
    var quality = 0;
    var i;
    // Add total Credits
    for(i = 0; i < $scope.classes.length; i++){
      if($scope.classes[i].credit == null){
        i++;
      }
      else{
      totalcredits += parseInt($scope.classes[i].credit);
      }
    }
    console.log("total Credits: " + totalcredits);
    // Add Quality Points
    for(i = 0; i < $scope.classes.length; i++){
      quality += ($scope.classes[i].credit * $scope.classes[i].grade);
    }
    console.log("Quality: " + quality);
    // Divide Quality Points by total credits
    $scope.totalgpa = quality/totalcredits;
  };
});
