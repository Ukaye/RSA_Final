RSA.controller('Dashboard', function ($scope, $http, $timeout, $uibModal) {

  var Phone = window.localStorage.getItem("user");
  var EndPoint = "/";
  $scope.total_target = 0;
  $scope.total_saved = 0;

  $scope.Verify = function (data) {

    console.log(data);

    $http.post(EndPoint + 'verifyBVN/' + data.type, data)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.message = Data.message;

          $timeout(function () {

            window.location.href = EndPoint + 'otp';

          }, 4000);

        } else {

          $scope.error = Data.message;
        }
      })
      .error(function (data) {
        $scope.error = "Connection Error";

      });

  }


  $scope.Validate = function (data) {

    if (data) {

      $http.post(EndPoint + 'validate', data)
        .success(function (Data) {

          if (Data.status == true) {

            $scope.message = Data.message;

            $timeout(function () {
              window.location.href = EndPoint + "plan";
            }, 4000);

          } else {

            $scope.error = Data.message;

          }

        })
        .error(function (data) {
          $scope.error = "Connection Error";

        });


    }

  }


  var plans = function () {

    counter = 0;
    $http.get(EndPoint + 'plans/' + Phone)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.plans = [];

          angular.forEach(Data.data, function (plan) {

            $scope.total_target += parseInt(plan.target_amount);
            $scope.total_saved += plan.saved;

            if (counter < 2) {

              plan.amount = parseInt(plan.amount);
              plan.target_amount = parseInt(plan.target_amount);
              $scope.plans.push(plan);
              counter++;
            }

          });

        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
  }

  $scope.open_plan = function (v) {


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

  var plansChart = function () {

    $http.get(EndPoint + 'planname/' + Phone)
      .success(function (Data) {

        if (Data.status == true) {
          console.log(Data);


        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
  }
  var chartdraw = function () {
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.data = [300, 500, 100, 40, 120];
  };

  chartdraw();
  plans();
  plansChart();

});