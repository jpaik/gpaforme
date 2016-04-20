var app = angular.module('gpa', []);

app.controller("calcCtrl", function($scope, $filter){

  // Initialize
  $scope.init = function(){
    $scope.totalgpa = 4; //Initial GPA
    $scope.grades = [ //Init GPA Values
      {value: 4, text: 'A'},
      {value: 3.5, text: 'B+'},
      {value: 3, text: 'B'},
      {value: 2.5, text: 'C+'},
      {value: 2, text: 'C'},
      {value: 1.5, text: 'D+'},
      {value: 1, text: 'D'},
      {value: 0, text: 'F'}
    ];

    //Check for local Storage
    $scope.saved = localStorage.getItem('classes');
    $scope.classes = (localStorage.getItem('classes') != null) ? JSON.parse($scope.saved) : [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}];
    localStorage.setItem('classes', JSON.stringify($scope.classes)); //Set classes correctly.

    // If local storage had values, then update the GPA to go with it
    if (localStorage.getItem('classes') != null){
      $scope.updateGPA();
    }
  };

  // Remove Class
  $scope.removeClass = function(index) {
    // If it's the last column, set GPA to 0.
    if($scope.classes.length == 1){
      $scope.totalgpa = 0;
    }
    $scope.classes.splice(index, 1);
    // Also need to update if it's removed
    $scope.updateGPA();
  };

  // Add Class
  $scope.addClass = function() {
    $scope.inserted = {
      credit: null,
      grade: null
    };
    $scope.classes.push($scope.inserted);
  };

  // Save inputs
  $scope.saveClasses = function(){
    localStorage.setItem('classes', JSON.stringify($scope.classes)); //Save inputs to local storage
    //Show Saved alert on click
    $("#saveAlert").removeClass("in").show();
    $("#saveAlert").removeClass("hidden");
	  $("#saveAlert").delay(200).addClass("in").fadeOut(3000);
  };

  // Reset all values to null
  $scope.resetAll = function(){
    var i;
    for(i = 0; i < $scope.classes.length; i ++){
      $scope.classes[i].name = '';
      $scope.classes[i].credit = '';
      $scope.classes[i].grade = '';
    }
    $scope.updateGPA();
    $scope.classes = [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}];
  };

  $scope.changeType = function(){
    if($scope.gpatype == 1){
      $scope.grades = [
        {value: 4, text: 'A'},
        {value: 3.5, text: 'B+'},
        {value: 3, text: 'B'},
        {value: 2.5, text: 'C+'},
        {value: 2, text: 'C'},
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

  // Update the total GPA. Formula is credit of class times grade received divided by total credits... I think
  $scope.updateGPA = function(){
    var totalcredits = 0;
    var quality = 0;
    var i;
    // Add total Credits
    for(i = 0; i < $scope.classes.length; i++){
      if(!isNaN(parseInt($scope.classes[i].credit))) //Make sure it's not NaN so it doesn't mess with total
        totalcredits += parseInt($scope.classes[i].credit);
    }
    // Add Quality Points
    for(i = 0; i < $scope.classes.length; i++){
      quality += ($scope.classes[i].credit * $scope.classes[i].grade);
    }
    // Divide Quality Points by total credits to get GPA!
    $scope.totalgpa = quality/totalcredits;
  };

  // Let there be calculations!
  $scope.init();
});
