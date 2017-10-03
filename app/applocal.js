// begin AltSheets changes
///////////////////////////////
// TODO: Put go into a config.js
// But how to include a file from local?

var GETH_HOSTNAME	= "localhost" ;	// put your IP address!
var APP_HOSTNAME 	= "localhost"; // See package.json --> scripts --> start: Change 'localhost'!!!";

var GETH_RPCPORT  	= 8547; 		// for geth --rpcport GETH_RPCPORT
var APP_PORT 		= "8000"; //See package.json --> scripts --> start: Perhaps change '8000'";

// this is creating the corrected geth command
var WL=window.location;
var geth_command	= "geth --rpc --rpcaddr "+ GETH_HOSTNAME + " --rpcport " + GETH_RPCPORT +'\
 --rpcapi "web3,eth" ' + ' --rpccorsdomain "' + WL.protocol +"//" + WL.host + '"';
 

////////////////////////////////////////////////////
//end AltSheets changes


'use strict';

angular.module('ethExplorer', ['ngRoute','ui.bootstrap','filters','ngSanitize'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            }).
            when('/block/:blockId', {
                templateUrl: 'views/blockInfos.html',
                controller: 'blockInfosCtrl'
            }).
            when('/tx/:transactionId', {
                templateUrl: 'views/transactionInfos.html',
                controller: 'transactionInfosCtrl'
            }).
            when('/address/:addressId', {
                templateUrl: 'views/addressInfos.html',
                controller: 'addressInfosCtrl'
            }).

            // info page with links:
            when('/chain/api', {
                templateUrl: 'views/api/api.html',
                controller: 'chainInfosCtrl'
            }).

            // getBlock (current) & getBlock (last)
            when('/chain/', {
                templateUrl: 'views/chainInfos.html',
                controller: 'chainInfosCtrl'
            }).
            when('/chain/gaslimit', {
                templateUrl: 'views/api/gaslimit.html',
                controller: 'chainInfosCtrl'
            }).
            when('/chain/difficulty', {
                templateUrl: 'views/api/difficulty.html',
                controller: 'chainInfosCtrl'
            }).
/*
            // fast = doesn't need to getBlock any block
            when('/chain/blocknumber', {
                templateUrl: 'views/api/blocknumber.html',
                controller: 'fastInfosCtrl'
            }).
            when('/chain/supply', {
                templateUrl: 'views/api/supply.html',
                controller: 'fastInfosCtrl'
            }).
            when('/chain/mined', {
                templateUrl: 'views/api/mined.html',
                controller: 'fastInfosCtrl'
            }).

            // begin of: not yet, see README.md
            when('/chain/supply/public', {
                templateUrl: 'views/api/supplypublic.html',
                controller: 'fastInfosCtrl'
            }).*/
            // end of: not yet, see README.md

            otherwise({
                redirectTo: '/'
            });

            //$locationProvider.html5Mode(true);
    }])
    .run(function($rootScope) {
        var web3 = require('web3');
		
		//var SolidityCoder = require("./bower_components/web3/lib/solidity/coder.js");
		var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"}];
		var addressContract = '0x6f70f93eabc522c973d9f509545d4ac21714efe3';
		
        // begin AltSheets changes
		//web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider("http://"+GETH_HOSTNAME+":"+GETH_RPCPORT));
        // end AltSheets changes

		
        $rootScope.web3=web3;
        // MetaMask injects its own web3 instance in all pages, override it
        // as it might be not compatible with the one used here
        //if (window.web3)
        //    window.web3 = web3;
        function sleepFor( sleepDuration ){
            var now = new Date().getTime();
            while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
        }
		//var trc1 = web3.eth.contract(abi).at(addressContract);
		//var functionHashes = getFunctionHashes(abi);
		
        var connected = false;
        if(!web3.isConnected()) {
            $('#connectwarning').modal({keyboard:false,backdrop:'static'})
            $('#connectwarning').modal('show')
        }
    });
