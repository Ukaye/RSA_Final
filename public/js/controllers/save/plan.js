RSA.controller('PLAN', function ($scope, $http, $timeout, $uibModal, toastr) {

  //, $uibModalInstance

  var Phone = window.localStorage.getItem("user");

  var EndPoint = "/";
  $scope.plans = [];
  $scope.show = true;



  $scope.plan_name = "baby plan";
  $scope.target = 10000;
  $scope.saved = 1000;
  $scope.percent = 100;

  var Create = function (x) {

    var day = new Date(x).getDate();
    var year = new Date(x).getFullYear();
    var month = new Date(x).getMonth() + 1;

    var newdate = day + '-' + month + '-' + year;

    return newdate;
  };

  var calculate = function (durationtype, duration, type) {

    switch (durationtype) {
      case "days":


        return duration;

        break;
      case "months":


        if (type = "Daily") {

          var deduction_times = 28;

        } else if (type = "Weekly") {

          var deduction_times = 28 / 4;

        } else if (type = "Monthly") {

          deduction_times = 1;
        }

        return deduction_times * duration;

        break;
      case "weeks":

        deduction_times = 1;

        return deduction_times * duration;

        break;
      case "years":

        if (type = "Daily") {

          deduction_times = 365;

        } else if (type = "Weekly") {

          deduction_times = 365 / 52;

        } else if (type = "Monthly") {

          deduction_times = 12;


        }

        return deduction_times * duration;

        break;
    }
  }

  $scope.create = function (data) {


    data.deduction_day = Create(data.date);
    data.Phone = Phone;
    var deduction_times = calculate(data.value, parseInt(data.duration), data.deduction_freq);

    data.target_amount = deduction_times * parseInt(data.amount);

    $scope.plan_details = data;

    $scope.Confirm = true;

    console.log($scope.Confirm);

  }


  $scope.Confirmplan = function () {

    $scope.show = "";
    data = $scope.plan_details;

    $http.post(EndPoint + 'createplan', data)
      .success(function (Data) {

        if (Data.status == true) {


          toastr.success(Data.message, 'Success!');
          $scope.Form = {};
          $scope.show = true;
          window.location.href = EndPoint +  "dashboard";


        } else {


          toastr.error(Data.message, 'Error');
          $scope.show = true;
        }
      })
      .error(function (data) {

        toastr.error("Connection Error", 'Error!');
        $scope.show = true;

      });

  }

  $scope.Edit = function () {

    $scope.Form = $scope.plan_details;
    $scope.Confirm = "";
  }


  var plans = function () {

    $http.get(EndPoint + 'plans/' + Phone)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.plans = [];

          angular.forEach(Data.data, function (plan) {

            plan.amount = parseInt(plan.amount);
            plan.target_amount = parseInt(plan.target_amount);
            $scope.plans.push(plan);


          });



        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
  }




  $scope.open_plan = function () {

    console.log("console  log");
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: EndPoint + 'modal/plan.html',
      controller: 'MODAL',
      size: '',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
  };

  $scope.select = function (durationtype) {



    switch (durationtype) {
      case "days":
        $scope.arr = ['Daily'];

        break;
      case "months":

        $scope.arr = ['Daily', 'Weekly', 'Monthly'];
        break;
      case "weeks":

        $scope.arr = ['Weekly']
        break;
      case "years":


        $scope.arr = ['Daily', 'Weekly', 'Monthly'];
        break;
    }


  }

  


  $scope.planNames = ["Car", "Hospital", "Marriage",
    "Vacation", "WealthFund", "Rent",
    "Shopping", "Land", "Fees", "Baby",
    "Wedding", "Gifts"];

  plans();
  






});