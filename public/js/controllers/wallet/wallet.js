RSA.controller('Wallet', function ($scope, $http, $timeout,$uibModal,toastr) {

  var EndPoint = "/";
  var Phone    = window.localStorage.getItem("user");
   $scope.banks  = [];
   $scope.plans  = [];
   $scope.show   = true;


   var Bank = function () {

    $http.get(EndPoint +'GetBank/'+Phone)
      .success(function (Data) {

        if (Data.status == true) {

        angular.forEach(Data.data, function(bank){
        
         $scope.banks.push(bank);

        });
        
        } 
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
}



   var Plan = function () {

    $http.get(EndPoint +'plans/'+Phone)
      .success(function (Data) {

        if (Data.status == true) {

        angular.forEach(Data.data, function(plan){
        
         $scope.plans.push(plan);

        });

        console.log($scope.plans);
        
        } 
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
}


 var Wallet = function () {


    $http.get(EndPoint +'wallet/'+Phone)
      .success(function (Data) {

        console.log(Data);

        if (Data.status == true) {

          $scope.wallet = Data.data;
        
        } 
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
}



 var card = function(){


       $http.get(EndPoint +'getcard/'+Phone)
      .success(function (Data) {

        if (Data.status == true) {

          console.log(Data);
        
         $scope.accounts = Data.data;

        } 
      })
      .error(function (data) {

        $scope.error = "Connection Error";

      });
 }


   $scope.Method =  function(type){
     
     if (type == "1") {

      card();

     }else{

      $scope.accounts = $scope.banks;
     }

   }



$scope.Fund = function(data){

   $scope.Form = {};

   $scope.show = "";
   data.Phone  = Phone;

     if (data.plan) {

      data.target = "2";
     }else{

      data.target = "1";
     }

      console.log(data);


      $http.post(EndPoint +'fundwallet', data)
      .success(function (Data) {

        if (Data.status == true) {

          console.log(Data);
          $scope.show = true;
          toastr.success(Data.message, 'Success!');


        }else{
           
          $scope.show = true;
          toastr.error(Data.message, 'Error!');
        } 
      })
      .error(function (data) {

        $scope.show = true;
        toastr.error(Data.message, 'Error!');

      });


}



//  Functions 
    Bank();
    Plan();
    Wallet();


});