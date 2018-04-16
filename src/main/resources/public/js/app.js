const app = angular.module('main', ["ngRoute"]);


app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
    when('/home', {
        controller: 'PaymentListController',
        templateUrl: '../partials/paymentStuff/payments.html'
    }).
    when('/billers', {
        controller: 'BillerListController',
        templateUrl: '../partials/billerStuff/billers.html'
    }).
    when('/customers', {
        controller: 'CustomerListController',
        templateUrl: '../partials/customerStuff/customers.html'
    }).
    otherwise({redirectTo: '/home'});
}]);

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

app.controller('PaymentListController', function($scope, $http) {

    $scope.selectedCustomer = {}
    $scope.selectedBiller = {}
    $scope.newPayment = {}

    $scope.refresh = function() {
        $http.get("http://localhost:8080/api/customers")
            .then(function (response1) {
                $scope.customers = response1.data;
                return $http.get("http://localhost:8080/api/billers");
            }).then(function (responce2) {
            $scope.billers = responce2.data;
            return $http.get("http://localhost:8080/api/payments");
        }).then(function (responce3) {

            let payments = responce3.data;

            $scope.payments = payments.map(payment => {
                let date = new Date(payment.dateTime);

                payment.dateTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                payment['customer'] = {}
                payment['biller'] = {}

                // пока костыляем так так не понятно, нужно ли делать каскадное удалени
                // и т.п. и т.д.
                let fullName = getCustomerFullName($scope.customers, payment.customerId);
                if (typeof fullName === 'undefined') {
                    fullName = "DELETED";
                }
                fullName = fullName.split("*");
                payment['customer']['lastName'] = fullName[0];
                payment['customer']['firstName'] = fullName[1];

                let biller = getBillerCompany($scope.billers, payment.billerId);
                if (typeof biller === 'undefined') {
                    biller = "DELETED"
                }
                payment['biller']['companyName'] = biller;
                return payment;
            });
        }).catch(function (err) {
            console.log(err);
        });
    };

    $scope.refresh();

    $scope.openModal = function (){};

    $scope.makeNewPayment = function () {
        $("#paymentNewModal").modal("hide");
        let payment = {}
        payment['account'] = $scope.newPayment.account;
        payment['dateTime'] = new Date();
        payment['amount'] = $scope.newPayment.price;
        payment['customerId'] = $scope.newPayment.customer.id;
        payment['billerId'] = $scope.newPayment.biller.id;
        $http.post("http://localhost:8080/api/payments", payment)
            .then(function (response){
                console.log(response.data);
                $scope.refresh();
            })
            .catch(function (err) {console.log(err)});


    }
});





app.controller('CustomerListController', function($scope, $http) {

    $scope.newCustomer = {};
    $scope.editedCustomer = {};

    $http.get("http://localhost:8080/api/customers")
        .then(function (response) {
            $scope.customers = response.data;
        })
        .catch(function (err) {
            console.log(err)
        });


    $scope.openModal = function (ob){
        $scope.editedCustomer=ob;
    };

    $scope.submitCustomer = function (){
        console.log($scope.newCustomer);
        let newUser = JSON.stringify($scope.newCustomer);
        $scope.newCustomer = {};
        $("#customerNewModal").modal("hide");
        $http.post("http://localhost:8080/api/customers", newUser)
            .then(function (response){
                console.log(response.data);
                $scope.customers.push(response.data);
            })
            .catch(function (err) {console.log(err)});
        // not handling errors properly - so bad
    };

    $scope.updateCustomer = function () {
        $("#customerEditModal").modal("hide");
        $scope.editedCustomer.new.id = $scope.editedCustomer.id;
        let time = $scope.editedCustomer.new.dateOfBirth;

        $scope.editedCustomer.new.dateOfBirth = new Date(time);
        let id = $scope.editedCustomer.new.id;


        $http.put("http://localhost:8080/api/customers/"+id, JSON.stringify($scope.editedCustomer.new))
            .then(function (response) {
                console.log(response.data);
                $scope.editedCustomer = {};
                replaceObject($scope.customers, 'id', response.data);
            })
            .catch(function (err) {console.log(err)});
    };


    $scope.removeCustomer = function (customer) {

        $http.delete("http://localhost:8080/api/customers/"+customer.id)
            .then(function (responce) {
                console.log("Customer ", customer, " was deleted");
                console.log(responce);
                $scope.refresh();
            })

    }

    $scope.refresh = function() {
        $http.get("http://localhost:8080/api/customers")
            .then(function (response) {
                $scope.customers = response.data;
            })
            .catch(function (err) {
                console.log(err)
            });
    }


});

app.controller('BillerListController', function($scope, $http) {

    $scope.newBiller = {}
    $scope.editedBiller = {}

    $scope.openModal = function (ob){
        console.log(ob);
        $scope.editedBiller=ob;
    };

    $http.get("http://localhost:8080/api/billers")
        .then(function (response) {
            $scope.billers = response.data;
        })
        .catch(function (err) {
            console.log(err)
        });

    $scope.submitBiller = function (){
        console.log($scope.newBiller);
        let newBiller = JSON.stringify($scope.newBiller);
        $scope.newBiller = {};
        $("#billerNewModal").modal("hide");
        $http.post("http://localhost:8080/api/billers", newBiller)
            .then(function (response){
                console.log(response.data);
                $scope.billers.push(response.data);
            })
            .catch(function (err) {console.log(err)});
        // not handling errors properly - so bad
    };

    $scope.updateBiller = function () {
        $("#billerEditModal").modal("hide");
        $scope.editedBiller.new.id = $scope.editedBiller.id;
        let id = $scope.editedBiller.new.id;


        $http.put("http://localhost:8080/api/billers/"+id, JSON.stringify($scope.editedBiller.new))
            .then(function (response) {
                console.log(response.data);
                $scope.editedBiller = {};
                replaceObject($scope.billers, 'id', response.data);
            })
            .catch(function (err) {console.log(err)});
    };

    $scope.removeBiller = function (biller) {

        $http.delete("http://localhost:8080/api/billers/"+biller.id)
            .then(function (responce) {
                console.log("Biller ", biller, " was deleted");
                console.log(responce);
                $scope.refresh();
            })

    }

    $scope.refresh = function() {
        $http.get("http://localhost:8080/api/billers")
            .then(function (response) {
                $scope.billers = response.data;
            })
            .catch(function (err) {
                console.log(err)
            });
    }

});


function replaceObject(objectArray, property, newObject) {
    let i = 0;
    for (i; i<objectArray.length; i++) {
        if (objectArray[i][property] === newObject[property]) {
            objectArray[i] = newObject;
            break;
        }
    }
}


function getCustomerFullName(customers, id) {
    let i=0;
    for (i; i<customers.length; i++) {
        if (customers[i].id === id) {
            return customers[i].lastName + "*" + customers[i].firstName;
        }
    }
}

function getBillerCompany(billers, id) {
    let i=0;
    for (i; i<billers.length; i++) {
        if (billers[i].id === id) {
            return billers[i].companyName;
        }
    }
}
