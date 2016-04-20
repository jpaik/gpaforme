var app = angular.module('gpa', []);

// Make sure that the levels are hidden if it's not highschool.
app.directive('classRepeatDir', function(){
  return function($scope){
    if($scope.gpatype != 3){
      if($scope.$last){
        $(".hs").addClass("hidden");
      }
    }
  }
});

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
    $scope.levels = [ // For Highschool Levels
      {value: 1, text: 'Academic'},
      {value: 2, text: 'Honors'},
      {value: 3, text: 'A.P.'}
    ];

    //Check for local Storage, and if not init default values
    $scope.saved = localStorage.getItem('classes');
    $scope.savedtype = localStorage.getItem('gpatype');
    $scope.classes = (localStorage.getItem('classes') != null) ? JSON.parse($scope.saved) : [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}];
    $scope.gpatype = (localStorage.getItem('gpatype') != null) ? JSON.parse($scope.savedtype) : 1;
    localStorage.setItem('classes', JSON.stringify($scope.classes)); //Set classes correctly.
    localStorage.setItem('gpatype', JSON.stringify($scope.gpatype)); //Set GPA tyle correctly

    // If local storage had values, then update the GPA and type to go with it
    if (localStorage.getItem('classes') != null){
      $scope.updateGPA();
      $scope.changeType();
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
    localStorage.setItem('classes', JSON.stringify($scope.classes)); //Save classes to local storage
    localStorage.setItem('gpatype', JSON.stringify($scope.gpatype)); //Save GPA type to local storage
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
    if($scope.gpatype != 3){
        $scope.classes = [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}];
    }
  };

  $scope.changeType = function(){
    if($scope.gpatype == 1){
      $(".hs").addClass("hidden");
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
      $(".hs").addClass("hidden");
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
    if($scope.gpatype == 3){
      $scope.grades = [
        {value: 4.3, text: 'A+'},
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
      $(".hs").removeClass("hidden");
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
      // Who the hell came up with Highschool GPA values??
      if($scope.gpatype == 3){ // Got to see if it's AP class or what not
        if($scope.classes[i].level == 2){ // Honors has + .5 GPA
          quality += ($scope.classes[i].credit * ($scope.classes[i].grade + 0.5));
        }
        else if($scope.classes[i].level == 3){ //AP has + 1.0 GPA
          quality += ($scope.classes[i].credit * ($scope.classes[i].grade + 1.0));
        }
        else{
          quality += ($scope.classes[i].credit * $scope.classes[i].grade);
        }
      }
      else{ //Else, if it's college's so simple scale
        quality += ($scope.classes[i].credit * $scope.classes[i].grade);
      }

    }
    // Divide Quality Points by total credits to get GPA!
    $scope.totalgpa = quality/totalcredits;
  };

  // Let there be calculations!
  $scope.init();
});
