
angular.module('ethExplorer')
    .controller('transactionInfosCtrl', function ($rootScope, $scope, $location, $routeParams,$q) {

        $scope.init=function()
        {
			
            $scope.txId=$routeParams.transactionId;

            if($scope.txId!==undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

                getTransactionInfos()
                    .then(function(result){
                        //TODO Refactor this logic, asynchron calls + services....
                        var number = web3.eth.blockNumber;

                    $scope.result = result;

                    if(result.blockHash!==undefined){
                        $scope.blockHash = result.blockHash;
                    }
                    else{
                        $scope.blockHash ='pending';
                    }
                    if(result.blockNumber!==undefined){
                        $scope.blockNumber = result.blockNumber;
                    }
                    else{
                        $scope.blockNumber ='pending';
                    }
					//var functionHashes = getFunctionHashes(abi);
					
                    $scope.from = result.from;
                    $scope.gas = result.gas;
                    //$scope.gasPrice = result.gasPrice.c[0] + " WEI";
                    $scope.gasPrice = web3.fromWei(result.gasPrice, "ether").toFormat(10) + " ETH";
                    $scope.hash = result.hash;
                    $scope.input = result.input; // that's a string
                    $scope.nonce = result.nonce;
                    //$scope.to = result.to;
                    $scope.transactionIndex = result.transactionIndex;
                    //$scope.ethValue = web3.fromWei(result.value[0], "ether"); Newer method but has ""
                    $scope.ethValue = result.value.c[0] / 10000;
                    $scope.txprice = web3.fromWei(result.gas * result.gasPrice, "ether") + " ETH";
					$scope.to = 'test';
					
					// var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"}];
		
					// var functionHashes = getFunctionHashes(abi);
					// console.log(functionHashes);
					// console.log('yihaa '+$scope.input);
					// var func = findFunctionByHash(functionHashes, $scope.input);
					// console.log('yihaa1 '+func);
					// var inputData;
					//var SolidityCoder = require('bower_components/web3/lib/solidity/coder.js');
					 //if (func == 'transfer') {
												 
						 //inputData = SolidityCoder.decodeParams(["uint256"], $scope.input.substring(10));
						 $scope.to = $scope.input.substr(34,40);
						 $scope.to = '0x' + $scope.to;
						 
						 $scope.ethValue = $scope.input.substr(106, 32);
						 $scope.ethValue = parseInt($scope.ethValue, 16) / 100000000;
						 
					 //}
					
					// $scope.toAdd = inputData[0];
					// $scope.trcValue = inputData[1];								
					 
                    if($scope.blockNumber!==undefined){
                        $scope.conf = number - $scope.blockNumber;
                        if($scope.conf===0){
                            $scope.conf='unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
                        }
                    }
                        //TODO Refactor this logic, asynchron calls + services....
                    if($scope.blockNumber!==undefined){
                        var info = web3.eth.getBlock($scope.blockNumber);
                        if(info!==undefined){
                            $scope.time = info.timestamp;
                        }
                    }

                });

            }



            else{
                $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
            }


            function getTransactionInfos(){
                var deferred = $q.defer();

                web3.eth.getTransaction($scope.txId,function(error, result) {
                    if(!error){
                        deferred.resolve(result);
                    }
                    else{
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }
			
			// function getFunctionHashes(abi) {
			  // var hashes = [];
			  // for (var i=0; i<abi.length; i++) {
				// var item = abi[i];
				// if (item.type != "function") continue;
				// var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
				// var hash = web3.sha3(signature);
				// console.log(item.name + '=' + hash);
				// hashes.push({name: item.name, hash: hash});
			  // }
			  // return hashes;
			// }

			// function findFunctionByHash(hashes, functionHash) {
			  // for (var i=0; i<hashes.length; i++) {
				// if (hashes[i].hash.substring(0, 8) == functionHash.substring(2, 10))
				  // return hashes[i].name;
			  // }
			  // return null;
			// }



        };
        $scope.init();
        //console.log($scope.result);

    });
