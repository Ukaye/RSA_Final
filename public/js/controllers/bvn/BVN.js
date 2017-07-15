RSA.controller('BVN', function ($scope, $http, $timeout, $uibModal) {

  var EndPoint = "/";
  var Phone = window.localStorage.getItem("user");
  var ref = window.localStorage.getItem("ref");
  var bvn = window.localStorage.getItem("bvn");

  $scope.Verify = function (data) {

    console.log(data);

    $http.post(EndPoint + 'verifyBVN/' + data.type, data)
      .success(function (Data) {

        if (Data.status == true) {

          console.log(Data.data);

          window.localStorage.setItem("ref", Data.data.transactionReference);
          window.localStorage.setItem("bvn", data.bvn);

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

      valid = {};
      valid.phone = Phone;
      valid.bvn = bvn;
      valid.transaction_ref = ref;
      valid.otp = data;

      $http.post(EndPoint + 'validateBVN', valid)
        .success(function (Data) {

          if (Data.status == true) {

            $scope.message = Data.message;

            $timeout(function () {
              window.location.href = EndPoint + "dashboard";
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




  $scope.open_error = function (v) {


    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: EndPoint + 'modal/error.html',
      controller: 'PLAN',
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


});