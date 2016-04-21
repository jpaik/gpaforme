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
  var semesterCount = 1;
  var currentSemester = 0;
  $scope.init = function(){
    $scope.cumulativegpa = '?'; //Initial GPA
    $scope.semestergpa = 4;

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
    $scope.gpatypes = [ //Init GPA Types
      {value: 1, text: '4.0 Scale (+)'},
      {value: 2, text: '4.0 Scale (+/-)'},
      {value: 3, text: 'High School Scale'}
    ];
    $scope.levels = [ // For Highschool Levels
      {value: 1, text: 'Academic'},
      {value: 2, text: 'Honors'},
      {value: 3, text: 'A.P.'}
    ];

    //Check for local Storage, and if not init default values
    $scope.savedSemesters = localStorage.getItem('semesters');
    $scope.savedtype = localStorage.getItem('gpatype');

    //If it's empty, create a new semester. Else, parse it from local storage
    if($scope.savedSemesters == undefined || ($scope.savedSemesters == null) || ($scope.savedSemesters == "undefined")){
      $scope.semesters = [{value: 1, name: 'Semester 1', selected: 'selected', classes: [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}]}];
    }
    else{
      $scope.semesters = JSON.parse($scope.savedSemesters);
      if($scope.semesters.length < 1){
        $scope.semesters = [{value: 1, name: 'Semester 1', selected: 'selected', classes: [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}]}];
      }
      currentSemester = $scope.getSelected(); //This checks which semester was previously selected
      semesterCount = $scope.semesters.length;
    }
    //$scope.semesters = (typeof localStorage.getItem('semesters') !== 'undefined') ? JSON.parse($scope.savedSemesters) : [{value: 1, name: 'Semester 1', selected: 'selected', classes: [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}]}];
    $scope.gpatype = (localStorage.getItem('gpatype') != null) ? JSON.parse($scope.savedtype) : 1;
    localStorage.setItem('semesters', angular.toJson($scope.semesters)); //Set semesters correctly.
    localStorage.setItem('gpatype', angular.toJson($scope.gpatype)); //Set GPA tyle correctly

    // If local storage had values, then update the GPA and type to go with it
    if (localStorage.getItem('semesters') != null){
      $scope.updateGPA();
      $scope.changeType();
    }

    //On load, make sure the selected semester is current semester
    $scope.selected_semester = $scope.semesters[currentSemester];
  };

  // Add Class
  $scope.addClass = function() {
    $scope.inserted = {
      credit: null,
      grade: null
    };
    $scope.semesters[currentSemester].classes.push($scope.inserted);
  };

  // Remove Class
  $scope.removeClass = function(index) {
    // If it's the last column, set GPA to 0.
    if($scope.semesters[currentSemester].classes.length == 1){
      $scope.semestergpa = 0;
    }
    $scope.semesters[currentSemester].classes.splice(index, 1);
    // Also need to update if it's removed
    $scope.updateGPA();
  };

  // Add Semester
  $scope.addSemester = function(){
    semesterCount++;
    $scope.inserted = {
      value: semesterCount,
      name: "Semester " + semesterCount,
      classes: []
    }
    $scope.semesters.push($scope.inserted);
    //Switch to new semester
    $scope.getSemester(semesterCount - 1);
  };

  // Remove Semester
  $scope.removeSemester = function() {
    // If it's the last column, set GPA to 0.
    if($scope.semesters.length == 1){
      $scope.semestergpa = 0;
      semesterCount = 1;
    }
    semesterCount--;
    $scope.semesters.splice(semesterCount, 1);
    // Switch to previous semester
    $scope.getSemester(semesterCount - 1);
    // Also need to update if it's removed
    $scope.updateGPA();
  };

  // Get Semester
  $scope.getSemester = function(index){
    var i;
    for(i = 0; i < $scope.semesters.length; i++){
      if(i == index){
        $scope.semesters[i].selected = 'selected';
        currentSemester = i;
        $scope.selected_semester = $scope.semesters[i];
      }
      else{
        $scope.semesters[i].selected = '';
      }
    }
    $scope.updateGPA();
  };

  // Returns the index of the previously selected semester
  $scope.getSelected = function(){
    var i;
    for(i = 0; i < $scope.semesters.length; i++){
      if($scope.semesters[i].selected == 'selected'){
        return i;
      }
    }
    return 0;
  }

  // Save inputs
  $scope.saveClasses = function(){
    localStorage.setItem('semesters', angular.toJson($scope.semesters)); //Save classes to local storage
    localStorage.setItem('gpatype', angular.toJson($scope.gpatype)); //Save GPA type to local storage
    //Show Saved alert on click
    $("#saveAlert").removeClass("in").show();
    $("#saveAlert").removeClass("hidden");
	  $("#saveAlert").delay(200).addClass("in").fadeOut(3000);
  };

  // Reset all values to null
  $scope.resetAll = function(){
    var i;
    for(i = 0; i < $scope.semesters[currentSemester].classes.length; i ++){
      $scope.semesters[currentSemester].classes[i].name = '';
      $scope.semesters[currentSemester].classes[i].credit = '';
      $scope.semesters[currentSemester].classes[i].grade = '';
    }
    $scope.updateGPA();
    if($scope.gpatype != 3){
        $scope.semesters[currentSemester].classes = [{credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}, {credit: '', grade: 4}];
    }
  };

  // Changes the GPA Model
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
    var quality = 0;
    var credits = 0;
    var cumulativequality = 0;
    var cumulativecredits = 0;
    var i;

    // CURRENT SEMESTER GPA CALC
    if($scope.semesters[currentSemester].classes != null){
      for(i = 0; i < $scope.semesters[currentSemester].classes.length; i++){
        // Add credits for semester
        if(!isNaN(parseInt($scope.semesters[currentSemester].classes[i].credit))) //Make sure it's not NaN so it doesn't mess with total
          credits += parseInt($scope.semesters[currentSemester].classes[i].credit);

        // Add Quality Points for semester
        // Who the hell came up with Highschool GPA values??
        if($scope.gpatype == 3){ // Got to see if it's AP class or what not
          if($scope.semesters[currentSemester].classes[i].level == 2){ // Honors has + .5 GPA
            quality += ($scope.semesters[currentSemester].classes[i].credit * ($scope.semesters[currentSemester].classes[i].grade == 0 ? 0 :$scope.semesters[currentSemester].classes[i].grade + 0.5)); //make sure it's not 0
          }
          else if($scope.semesters[currentSemester].classes[i].level == 3){ //AP has + 1.0 GPA
            quality += ($scope.semesters[currentSemester].classes[i].credit * ($scope.semesters[currentSemester].classes[i].grade == 0 ? 0 : $scope.semesters[currentSemester].classes[i].grade + 1.0));
          }
          else{
            quality += ($scope.semesters[currentSemester].classes[i].credit * $scope.semesters[currentSemester].classes[i].grade);
          }
        }
        else{ //Else, if it's college's so simple scale
          quality += ($scope.semesters[currentSemester].classes[i].credit * $scope.semesters[currentSemester].classes[i].grade);
        }
      }
      // Divide Quality Points by total credits to get GPA!
      $scope.semestergpa = quality/credits;
    };

    // CUMULATIVE GPA CALC
    if($scope.semesters != null){
      for(i = 0; i < $scope.semesters.length; i++){
        for(var j = 0; j < $scope.semesters[i].classes.length; j++){
          if(!isNaN(parseInt($scope.semesters[i].classes[j].credit))){
            cumulativecredits += parseInt($scope.semesters[i].classes[j].credit);
          }

          if($scope.gpatype == 3){
            if($scope.semesters[i].classes[j].level == 2){ // Honors has + .5 GPA
              cumulativequality += ($scope.semesters[i].classes[j].credit * ($scope.semesters[i].classes[j].grade == 0 ? 0 : $scope.semesters[i].classes[j].grade + 0.5)); //make sure it's not 0
            }
            else if($scope.semesters[i].classes[j].level == 3){ //AP has + 1.0 GPA
              cumulativequality += ($scope.semesters[i].classes[j].credit * ($scope.semesters[i].classes[j].grade == 0 ? 0 : $scope.semesters[i].classes[j].grade + 1.0));
            }
            else{
              cumulativequality += ($scope.semesters[i].classes[j].credit * $scope.semesters[i].classes[j].grade);
            }
          }
          else{ //Else, if it's college's so simple scale
            cumulativequality += ($scope.semesters[i].classes[j].credit * $scope.semesters[i].classes[j].grade);
          }
        }
      }
      $scope.cumulativegpa = cumulativequality/cumulativecredits;
    }
  }

  //Runtime? O(n) where n is semester's classes length.

  // Let there be calculations!
  $scope.init();
});
