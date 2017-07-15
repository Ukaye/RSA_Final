RSA.controller('admin', function ($scope, $http, $timeout, toastr) {


    let EndPoint = "http://localhost:3000/";
    let Bank = function () {

        $http.get(EndPoint + 'users-bank')
            .success(function (Data) {

                if (Data.status == true) {


                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };

    let Bankhistory = function () {

        $http.get(EndPoint + 'users-bankhistory')
            .success(function (Data) {

                if (Data.status == true) {



                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };

    let card = function () {

        $http.get(EndPoint + 'users-card')
            .success(function (Data) {

                if (Data.status == true) {



                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };

    let plan = function () {

        $http.get(EndPoint + 'users-plan')
            .success(function (Data) {

                if (Data.status == true) {



                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };

    var user = function () {

        $http.get(EndPoint + 'users')
            .success(function (Data) {

                if (Data.status == true) {

                    console.log(Data.Data);
                    $scope.users = Data.Data

                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    var tsavings = function () {

        $http.get(EndPoint + 'totalsavings')
            .success(function (Data) {

                console.log(Data.value);

                $scope.totalsavings = Data.value

            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    ///verifiedsavers

    var vsavers = function () {

        $http.get(EndPoint + 'verifiedsavers')
            .success(function (Data) {


                console.log(Data);
                $scope.vsavers = Data.value

            }
            )
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    var tplan = function () {

        $http.get(EndPoint + 'totalplan')
            .success(function (Data) {

                console.log('reg users');
                console.log(Data);
                $scope.tplans = Data

            }
            )
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    $scope.withdrawRequest = function () {


        var emailOptions = {

            email: 'email',
            message: 'message'
        };

        $http.post(EndPoint + 'withdraw-request', emailOptions)
            .success(function (Data) {
                console.log('request approve');
            }
            )
            .error(function (data) {
                $scope.error = "Connection Error";

            });
    };

    $scope.changePassword = function () {
        $scope.show = "";

        var data = {
            Password: $scope.user.password
        };



        $http.post(EndPoint + 'admin-changepassword', data)
            .success(function (Data) {


                if (Data.status == true) {

                    toastr.success('redirecting...', 'Your password have been changed!');

                    $timeout(function () {

                        window.location.href = EndPoint + 'admin';

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

        console.log('password doesnt match');
        toastr.error(Data.message, 'Password doesnt match');

    }

    $scope.Login = function () {


        var admindetails = {
            Username: $scope.user.username,
            password: $scope.user.password
        }
        console.log(admindetails);
        $http.post(EndPoint + 'admin-login', admindetails)
            .success(function (Data) {


                if (Data.status == true) {

                    toastr.success('redirecting...', 'Success!');

                    $timeout(function () {

                        window.location.href = EndPoint + 'admin';

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

    var allusers = function () {

        $http.get(EndPoint + 'allusers')
            .success(function (Data) {


                console.log(Data.value);
                $scope.allusers = Data.value

            }
            )
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };

    var allwithdraw = function () {

        $http.get(EndPoint + 'allwithdrawal')
            .success(function (Data) {


                console.log(Data.value);
                $scope.allwithdraw = Data.value;
            }
            )
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };



    let wallet = function () {

        $http.get(EndPoint + 'users-wallet')
            .success(function (Data) {

                if (Data.status == true) {



                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    let wallethistory = function () {

        $http.get(EndPoint + 'users-wallethistory')
            .success(function (Data) {

                if (Data.status == true) {



                }
            })
            .error(function (data) {

                $scope.error = "Connection Error";

            });
    };


    allwithdraw();
    allusers();
    Bank();
    tplan();
    Bankhistory();
    card();
    plan();
    user();
    wallet();
    wallethistory();
    tsavings();
    vsavers();



});






