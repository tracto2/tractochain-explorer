// preliminary code! TDD - still needs refactoring & optimization
//
//
// chainInfoController.js
//
// contains 1 controller:
//    addressInfosCtrl
//
// by AltSheets
//    September 2015
//

angular.module('ethExplorer')
    .controller('addressInfosCtrl', function ($rootScope, $scope, $location, $routeParams,$q, $http, NgTableParams) {

        $scope.init=function()
        {
			
            $scope.addressId=$routeParams.addressId;
            var addressId = $routeParams.addressId;

            if($scope.addressId!==undefined) {
            	getAddressBalance()
                    .then(function(result){
                    	//$scope.balance = web3.fromWei(result).toNumber();
						$scope.balance = (result.toNumber() / 100000000).toFixed(8);
						//console.log('wtf1' + $scope.balance);
						getETHUSD();
                    });
            	getAddressTransactionCount()
	                .then(function(result){
	                	$scope.txCount = result;
	                });
            	getCode()
            		.then(function(result){
            			$scope.code = result;
            		});
            	getTransactions()
                .then(function(result){
                	console.log("getTransactions is executed!")
                	console.log(result)
                	$scope.transactions=result;
                	});
              
            } else {
                $location.path("/");
            }

            function getAddressBalance(){
                var deferred = $q.defer();
				var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"}];
		
				var addressContract = '0x6f70f93eabc522c973d9f509545d4ac21714efe3';	//change to your contract address
				
				
				
				var trc1 = web3.eth.contract(abi).at(addressContract) ;
				trc1.balanceOf($scope.addressId, function(error, result){
					if(!error){deferred.resolve(result);}
                    else{deferred.reject(error);}
				});
				
				
				
                // web3.eth.getBalance($scope.addressId, function(error, result) {
                    // if(!error){deferred.resolve(result);}
                    // else{deferred.reject(error);}
                // });
                return deferred.promise;
            }
			
			

            function getETHUSD() {
              // $.getJSON("https://coinmarketcap-nexuist.rhcloud.com/api/eth/price", function(json) {
                // var price = json.usd;
                // var ethusd = price.toFixed(2);
                // var balanceusd = "$" + ethusd * $scope.balance;
                // $scope.balanceusd = balanceusd;
                // //console.log("Balance in USD " + $scope.balanceusd);
              // });
			  //console.log('wtfabc' + $scope.balance);
			  var balanceusd = $scope.balance * 0.85;
			 
			  //console.log('wtf' + balanceusd);
			  $scope.balanceusd = balanceusd.toFixed(8);
            }

            function getAddressTransactionCount(){
            	// var success=$.getScript('../../config.js');
                var deferred = $q.defer();
                web3.eth.getTransactionCount($scope.addressId, function(error, result) {
                    if(!error){deferred.resolve(result);}
                    else{deferred.reject(error);}
                });
                return deferred.promise;
            }

            function getCode(){
                var deferred = $q.defer();
                web3.eth.getCode($scope.addressId, function(error, result) {
                    if(!error){deferred.resolve(result);}
                    else{deferred.reject(error);}
                });
                return deferred.promise;
            }

            // TODO: not working yet:
            function getTransactions(){
                var deferred = $q.defer();
				//console.log("getTransactions()");
				// var mysql      = require('mysql');		
				// var connection = mysql.createConnection({
				  // host     : 'localhost',
				  // user     : 'root',
				  // password : '',
				  // database : 'tractochain'
				// });
				
				// connection.connect(function(err){
					// if(!err) {
						// console.log("Database is connected ... nn");    
						
						// var sql = "select * from tc_transactions where sender order by sender, receiver";
						// connection.query(sql, function (err, result) {
							// if (err) throw err;
							// console.log(result);
						// });
					// }
				// });
				
				
				
				//function ($scope, $http){
					//$scope.addresstransactions = [];
					$http.get('http://mysql/txaddr?addr='+$scope.addressId).then(function(hasil){
						
						//console.log('hasil'+hasil);
						$scope.addresstransactions = hasil.data;
						$scope.tableParams = new NgTableParams({}, {dataset: $scope.addresstransactions});
					});
				//});
								
				/*

                // See https://github.com/ethereum/go-ethereum/issues/1897#issuecomment-166351797
                // plus the following posts
                // Giving up for now. Invested another 3 hours without results. Grrrr..

                // var options="address:"+$scope.addressId;
                // var options = {"address": "0xf2cc0eeaaaed313542cb262b0b8c3972425143f0"}; // $scope.addressId}; // , "topics": [null]
                // var options = 'pending'
                // console.log(options);

                var options = {fromBlock: 0, toBlock: 'latest', address: "0xf2cc0eeaaaed313542cb262b0b8c3972425143f0"};

                var myfilter = web3.eth.filter(options);

                // var myfilter= web3.eth.filter(options);
                console.log(myfilter);


                myfilter.get(function (error, log) {
                	  console.log("get error:", error);
                	  console.log("get log:", log);
                	});

                web3.eth.filter(options,
                		function(error, result){
                			if(!error){
                				console.log("no error");
                				deferred.resolve(result);
                				}
                			else{
                				console.log("error");
                				deferred.reject(error);
                				}
                			});

                */
                return deferred.promise;

            }
        };
        $scope.init();

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
});



