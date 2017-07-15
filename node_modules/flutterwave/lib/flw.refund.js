/**
* Flutterwave Refund class
*
* @class FlutterwaveRefund
* @constructor
*/ 
var FlutterwaveRefund = function (FlutterwaveBase) {



	/**
	* Refund amount charged for a specified transaction Ref.
	*
	* @method initiate
	* @param {String} refundamount
	* @param {String} paymentreference  
	* @param {Function} Response callback
	*/
	this.initiate = function (refundamount, paymentreference, callback) 
	{
 
		 

		var requestData = {};
		requestData.refundamount = refundamount; 
		requestData.paymentreference = paymentreference;
		requestData.merchantid = FlutterwaveBase.getMerchantKey(); 
 
		requestData = FlutterwaveBase.validateAndEncryptParams(requestData, this.endpointParamSpec('/refund'), FlutterwaveBase.getMerchantAPIKey());

		var requestParams    = {};
		requestParams.data   = requestData;
		requestParams.method = "POST";
		return FlutterwaveBase.makeRequest('fw/refund/',  requestParams, callback);

	} 

	this.endpointParamSpec = function (path)
	{
		var specs = {};

		specs['/refund'] = FlutterwaveBase.objectBuilder({})
						     .build('refundamount', 'required:true, encrypt:true')
						     .build('merchantid', 'required:true, encrypt:false')
						     .build('paymentreference', 'required:true, encrypt:true') 
						     .end();


		return specs[path];
	}
}

module.exports = FlutterwaveRefund;
