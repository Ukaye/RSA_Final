RSA
.controller('Bank', function ($scope, $http, $timeout, $uibModal, toastr) {

  var EndPoint = "/";
  var Phone = window.localStorage.getItem("user");
  var profile = JSON.parse(localStorage.profile);
  $scope.banks = [];
  $scope.show = true;
<<<<<<< HEAD

  $http.get(EndPoint + 'rte/get-account-status')
    .success(function (Data) {
      if (Data.status == false) {
        $scope.rte_signup();
        toastr.info(Data.message, 'Warning!');
      }
    })
    .error(function (data) { });

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

  $scope.rte_signup = function () {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: EndPoint + 'modal/rte-signup.html',
      controller: 'rte_signup',
      backdrop  : 'static',
      keyboard  : false,
      resolve: {
        profile: function () {
          return profile;
        },
        EndPoint: function () {
          return EndPoint;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
  };


  $http.get(EndPoint + 'rte/get-all-banks')
    .success(function (Data) {
      if (Data.status == true) {
        $scope.nigbanks = Data.data;
      }
    })
    .error(function (data) {
      $scope.error = "Connection Error";
    });

  $scope.Bank = function (data) {
    bank_details = JSON.parse(data.bank);
    var bank = {};
    bank.user_id = profile._id;
    bank.name = profile.first_name+" "+profile.last_name;
    bank.number = data.account_number;
    bank.bank_name = bank_details.name;
    bank.bank_code = bank_details.code;
    $scope.show = "";
    $http.post(EndPoint + 'rte/add-user-bankaccount/'+bank.user_id, bank)
      .success(function (Data) {
        if (Data.status == true) {
          $scope.show = true;
          toastr.success(Data.message, 'Success!');
          $scope.account_name = bank.name;
          $scope.account_number = bank.number;
          $scope.bank_code = bank.bank_code;
          $scope.banks.push(bank);
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


  $scope.confirm = function (number, bank_code, index) {
    $scope.show = "";
    $http.get(EndPoint + 'rte/get-user-bank/'+bank_code+'/'+number)
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
  };


  (function Bank() {
    $http.get(EndPoint + 'rte/get-user/'+profile._id)
      .success(function (Data) {
        if (Data.status == true) {
          angular.forEach(Data.data.bank_accounts, function (bank) {
            $scope.banks.push(bank);
          });
        }
      })
      .error(function (data) {
        $scope.error = "Connection Error";
      });

    $http.get(EndPoint + 'rte/get-user-transactions/'+profile._id+'/0/20')
      .success(function (Data) {
        if (Data.status == true) {
          $scope.history = Data.data;
        }
      })
      .error(function (data) {
        $scope.error = "Connection Error";
      });
  })();



  $scope.remove = function (number, index) {
    $scope.show = "";
    $http.delete(EndPoint + 'rte/delete-user-bankaccount/'+profile._id+'/'+number)
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

  function detectCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }

    for(var key in re) {
        if(re[key].test(number)) {
            return key
        }
    }
  }

  $scope.addcard = function (payload) {
    var card = {};
    card.user_id = profile._id;
    card.card_type = detectCardType(payload.no);
    card.number = payload.no;
    card.issuer = "";
    card.cvv2 = payload.cvv;
    card.expiry_month = payload.month;
    card.expiry_year = payload.year;
    $scope.show = "";
    $http.post(EndPoint + 'rte/update-user-card/'+card.user_id, card)
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
})

.controller('rte_signup', function ($scope, $http, $timeout, $uibModal, $uibModalInstance, toastr, profile, EndPoint) {
  $scope.profile = profile;

  $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
  };

  $scope.show = false;
  $scope.create_account = function (data) {
    var user = {};
    user.user_id = profile._id;
    user.username = data.first_name;
    user.email = data.Email;
    user.first_name = data.first_name;
    user.last_name = data.last_name;
    user.phone_number = data.Phone;
    user.bvn  = data.bvn;
    $http.post(EndPoint + 'rte/create-user/'+profile._id, user)
      .success(function (Data) {
        if (Data.status == true) {
          $scope.show = true;
          toastr.success(Data.message, 'Success!');
          $scope.cancel();
        } else {
          toastr.error(Data.message, 'Error!');
          $scope.show = false;
        };
      })
      .error(function (data) {
        toastr.error('Connection Error', 'Error!');
        $scope.show = false;
      });
  }

})