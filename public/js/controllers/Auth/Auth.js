RSA.controller('Auth', function ($scope, $http, $timeout, toastr) {

  var EndPoint = "/";
  $scope.show = true;

  $scope.Login = function (data) {

    $scope.show = "";

    $http.post(EndPoint + 'login', data)
      .success(function (Data) {


        if (Data.status == true) {

          window.localStorage.setItem("user", Data.data.Phone);

          toastr.success('redirecting...', 'Success!');

          $timeout(function () {

            window.location.href = EndPoint +  Data.location;

          }, 2000);

        } else {

          toastr.error(Data.message, 'Error!');
          $scope.show = true;

        }
      })
      .error(function (data) {
        toastr.error('error in connection', 'Error!');
        $scope.show = true;


      });

  }





  $scope.Signup = function (data) {


    if (data.Email && data.Password && data.Phone) {

      $scope.show = "";

      $http.post(EndPoint + 'signup', data)
        .success(function (Data) {

          if (Data.status == true) {

            window.localStorage.setItem("user", JSON.stringify(Data.data.Phone));

            toastr.success('redirecting to dashboard...', 'Success!');


            $timeout(function () {
              window.location.href = EndPoint + Data.location;
            }, 2000);


          } else {


            toastr.error(Data.message, 'Error!');
            $scope.show = true;

          }


        })
        .error(function (data) {
          toastr.error("error in connection", 'Error!');
          $scope.show = true;
        });


    }

  }


});