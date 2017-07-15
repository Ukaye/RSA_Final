/**
* Flutterwave USSD class
*
* @class FlutterwaveUSSD
* @constructor
*/ 
var FlutterwaveUSSD = function (FlutterwaveBase) {


	/**
	* Performs a USSD Charge on an account
	*
	* @method charge
	* @param {Object} paymentData {amount, orderreference, accountno, bankcode, callbackurl, customername, customerphoneno, narration, currency }
	* @param {Function} Response callback
	*/ 
	this.charge = function (paymentData, callback) { 

		var requestParams      = {};
		paymentData.merchantid = FlutterwaveBase.getMerchantKey();
		requestParams.data     = FlutterwaveBase.validateAndEncryptParams(paymentData, this.endpointParamSpec('/ussd'), FlutterwaveBase.getMerchantAPIKey());
		requestParams.method   = 'POST'; 
		return FlutterwaveBase.makeRequest('ussd',  requestParams, callback);

	}


	/**
	* Checks the status of a USSD Charge
	*
	* @method validate
	* @param {String} orderreference
	* @param {String} transactionreference  
	* @param {Function} Response callback
	*/
	this.status = function (orderreference, transactionreference, callback) 
	{
 
		 

		var requestData = {};
		requestData.orderreference = orderreference; 
		requestData.transactionreference = transactionreference;
		requestData.merchantid = FlutterwaveBase.getMerchantKey(); 
 
		requestData = FlutterwaveBase.validateAndEncryptParams(requestData, this.endpointParamSpec('/ussd/status'), FlutterwaveBase.getMerchantAPIKey());

		var requestParams    = {};
		requestParams.data   = requestData;
		requestParams.method = "POST";
		return FlutterwaveBase.makeRequest('ussd/status',  requestParams, callback);

	} 

	this.endpointParamSpec = function (path)
	{
		var specs = {};
		specs['/ussd'] = FlutterwaveBase.objectBuilder({})
						   .build('amount', 'required:true, encrypt:true')
						   .build('accountno', 'required:true, encrypt:true')
						   .build('bankcode', 'required:true, encrypt:true')
						   .build('orderreference', 'required:true, encrypt:true')
						   .build('callbackurl', 'required:true, encrypt:true')
						   .build('customerphoneno', 'required:true, encrypt:true')
						   .build('currency', 'required:true, encrypt:true')
						   .build('merchantid', 'required:true, encrypt:false')
						   .build('narration', 'required:true, encrypt:true')
						   .build('customername', 'required:true, encrypt:true')
						   .end();


		specs['/ussd/status'] = FlutterwaveBase.objectBuilder({})
						     .build('orderreference', 'required:true, encrypt:true')
						     .build('merchantid', 'required:true, encrypt:false')
						     .build('transactionreference', 'required:true, encrypt:true') 
						     .end();


		return specs[path];
	}
}

module.exports = FlutterwaveUSSD;
