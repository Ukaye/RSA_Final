
/**
* Flutterwave Disburse class
*
* @class FlutterwaveDisburse
* @constructor
*/ 

var FlutterwaveDisburse = function (FlutterwaveBase) {

	/**
	* Make payment to an account number
	*
	* @method send
	* @param {Object} paymentData {transferamount, uniquereference, destbankcode, recipientaccount, narration, recipientname, sendername, country, currency, merchantid}
	* @param {Function} callback
	*/ 
	this.send = function (paymentData, callback) { 

		var requestParams      = {};
		paymentData.merchantid = FlutterwaveBase.getMerchantKey();
		requestParams.data     = FlutterwaveBase.validateAndEncryptParams(paymentData, this.endpointParamSpec('/send'), FlutterwaveBase.getMerchantAPIKey());
		requestParams.method   = 'POST'; 
		return FlutterwaveBase.makeRequest('pay/send',  requestParams, callback);

	}

  
	this.endpointParamSpec = function (path)
	{
		var specs = {};
		specs['/send'] = FlutterwaveBase.objectBuilder({})
						     .build('transferamount', 'required:true, encrypt:true')
						     .build('transfertype', 'required:false, encrypt:true')
						     .build('uniquereference', 'required:true, encrypt:true')
						     .build('destbankcode', 'required:false, encrypt:true')
						     .build('recipientaccount', 'required:true, encrypt:true') 
						     .build('narration', 'required:true, encrypt:true') 
						     .build('recipientname', 'required:true, encrypt:true')
						     .build('sendername', 'required:true, encrypt:true')
						     .build('country', 'required:true, encrypt:true') 
						     .build('currency', 'required:true, encrypt:true') 
						     .build('merchantid', 'required:true, encrypt:false')
						     .build('accounttoken', 'required:false, encrypt:true') 
						     .build('additionalfees', 'required:false, encrypt:true')
						     .end();      

		return specs[path];
	} 

}

module.exports = FlutterwaveDisburse;