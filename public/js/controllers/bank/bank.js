RSA.controller('Bank', function ($scope, $http, $timeout, $uibModal, toastr) {

  var EndPoint = "/";
  var Phone = window.localStorage.getItem("user");
  $scope.banks = [];
  $scope.show = true;

  toastr.success('Banks loaded successfully!', 'Success!');

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



  $http.get(EndPoint + 'nigbank')
    .success(function (Data) {

      console.log(Data);

      if (Data.status == true) {

        $scope.nigbanks = Data.data;

      }
    })
    .error(function (data) {

      $scope.error = "Connection Error";

    });



  $scope.Bank = function (data) {

    var bank = JSON.parse(data.bank);
    data.Phone = Phone;
    data.bank_name = bank.name;
    data.bank_code = bank.code;
    data.bank = "";

    $scope.show = "";

    $http.post(EndPoint + 'validatebank', data)
      .success(function (Data) {

        console.log(Data);

        if (Data.status == true) {

          $scope.show = true;
          toastr.success(Data.message, 'Success!');
          $scope.account_name = Data.data.account_name;
          $scope.account_number = Data.data.account_number;
          $scope.banks.push(Data.data);


        } else {

          toastr.error(Data.message, 'Error!');
          $scope.show = true;

        };
      })
      .error(function (data) {

        toastr.error('Connection Error', 'Error!');
        $scope.show = true;

      });

  }


  $scope.confirm = function (data, index) {

    $scope.show = "";

    payload = {
      account_number: data
    };

    $http.post(EndPoint + 'addbank', payload)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.show = true;
          $scope.account_name = "";
          toastr.success(Data.message, 'Success!');
          $scope.banks.push(Data.data);
          $scope.banks.splice(index, 1);
        };
      })
      .error(function (data) {

        toastr.error('Connection Error', 'Error!');
        $scope.show = true;

      });
  }





  var Bank = function () {

    $http.get(EndPoint + 'GetBank/' + Phone)
      .success(function (Data) {

        console.log(Data);

        if (Data.status == true) {

          angular.forEach(Data.data, function (bank) {

            $scope.banks.push(bank);

          });


        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });




    $http.get(EndPoint + 'GetunconfirmedBank/' + Phone)
      .success(function (Data) {

        console.log(Data);

        if (Data.status == true) {

          angular.forEach(Data.data, function (bank) {

            $scope.banks.push(bank);

          });


        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });



    $http.get(EndPoint + 'GetBankHistory/' + Phone)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.history = Data.data;

        }
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });

  }



  $scope.remove = function (data, index) {

    $scope.show = "";
    $http.get(EndPoint + 'removeBank/' + data)
      .success(function (Data) {

        if (Data.status == true) {
          $scope.show = true;

          toastr.success(Data.message, 'Success!');
          $scope.banks.splice(index, 1);

        }
      })
      .error(function (data) {

        toastr.error('Connection Error', 'Error!');
        $scope.show = true;

      });


  }


  $scope.addcard = function (payload) {


    payload.Phone = Phone;

    $scope.show = "";

    $http.post(EndPoint + 'addcard', payload)
      .success(function (Data) {

        if (Data.status == true) {

          $scope.show = true;
          $scope.Form = {};

          toastr.success(Data.message, 'Success!');

        } else {

          $scope.Form = {};
          $scope.show = true;
          toastr.error(Data.message, 'Error!');

        };
      })
      .error(function (data) {

        toastr.error('Connection Error', 'Error!');
        $scope.show = true;

      });

  }

  //  Functions 
  Bank()

});