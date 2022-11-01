import System.Collections.Generic;


class GooglePlayPayment
{
	private static var currentOrderId:String = "";

	private static function VerifyMultiOKFunction(hash:HashObject)
	{	
		
		_Global.Log("VerifyOKFunction in unity.hash ==  null is " + (hash == null));
		if(hash == null) return;
		
		_Global.Log("VerifyOKFunction in unity.hash[multi] ==  null is " + (hash["multi"] == null));
		if(hash["multi"] ==  null) return;
		
		var array:Array = _Global.GetObjectKeys(hash["multi"]);
		var n:int = array.length;
		_Global.Log("VerifyOKFunction in unity.n = " + n);
		if(n < 1) return;
		
		for(var i:int = 0; i < n; i++)
		{
			_Global.Log("VerifyOKFunction in unity.i = " + i);
			VerifyOKFunction(hash["multi"][_Global.ap + i]);
		}
		
	}
	private static function ConfirmGems(hash:HashObject)
	{		
		if(hash == null)
		{
			return;
		}
		else if(hash["receiptData"] == null)
		{
			_Global.Log("ConfirmGems hash[receiptData] is null.");
			return;
		}
		if(hash["receiptData"]["gems"] == null)
		{
			_Global.Log("ConfirmGems gems is null.");
			return;
		}
		else if(hash["receiptData"]["gems"].Value == null)
		{
			_Global.Log("ConfirmGems hash[receiptData][gems].Value is null.");
			return;
		}
		else
			_Global.Log("ConfirmGems VerifyOKFunction in unity. gems=" + hash["receiptData"]["gems"].Value.ToString());
		var gems:int = 0;
		if(Int32.TryParse(hash["receiptData"]["gems"].Value.ToString(),gems))
		{
			_Global.Log("ConfirmGems VerifyOKFunction in unity. 0 gems=" + hash["receiptData"]["gems"].Value.ToString());
			var g:int = Payment.instance().Gems;
			_Global.Log("ConfirmGems VerifyOKFunction in unity. g=" + g.ToString());
            Payment.instance().AddGems(gems - g);
            _Global.Log("ConfirmGems VerifyOKFunction in unity. 1 gems=" + hash["receiptData"]["gems"].Value.ToString());
		}		
	}

	private static function VerifyOKFunction(hash:HashObject)
	{
		_Global.Log("VerifyOKFunction in unity.");
		_Global.Log("VerifyOKFunction in unity Hash:"+hash.ToString());
		if(Confirm(hash))
		{
			ConfirmGems(hash);
			var product:String = "";
			var packageName:String = "";
			var orderID:String = "";
			var developerPayload:String = "";
			var purchaseTime:String = "";
			var purchaseState:String = "";
			var purchaseToken:String = "";
			
			if(hash != null)
			{
				if(hash["receiptData"] != null)
				{
					if(hash["receiptData"]["productid"] != null)
					{
						if(hash["receiptData"]["productid"].Value != null)
							product = hash["receiptData"]["productid"].Value.ToString();
					}
					if(hash["receiptData"]["packageName"] != null)
					{
						packageName = _Global.ToString(hash["receiptData"]["packageName"]);
					}
					if(hash["receiptData"]["orderID"] != null)
					{
						orderID = _Global.ToString(hash["receiptData"]["orderID"]);
					}
					if(hash["receiptData"]["developerPayload"] != null) 
					{
						developerPayload = _Global.ToString(hash["receiptData"]["developerPayload"]);
					}
					if(hash["receiptData"]["purchaseTime"] != null)
					{
						purchaseTime = _Global.ToString(hash["receiptData"]["purchaseTime"]);
					}
					if(hash["receiptData"]["purchaseState"] != null)
					{
						purchaseState = _Global.ToString(hash["receiptData"]["purchaseState"]);
					}
					if(hash["receiptData"]["purchaseToken"] != null)
					{
						purchaseToken = _Global.ToString(hash["receiptData"]["purchaseToken"]);
					}
					//removed in 18.5.0 Gaea
					//KBNSODA.Instance.LogPurchase(packageName, orderID,product, developerPayload,purchaseTime,purchaseState,purchaseToken);
					NativeCaller.MobileAppTrackerPaymentEvent();
				}
			}
			SendPaymentStatus(product, 0);
			GameMain.instance().paymentOk(product);
			GameMain.instance().paymentRewardByVerify(hash);
			
			try
			{
				var cents:double = NativeCaller.GetCents(product);
				var name:String = NativeCaller.GetNames(product);
				
				_Global.Log("VerifyOKFunction purchase product=" + product);
				_Global.Log("VerifyOKFunction purchase cents=" + cents);
				_Global.Log("VerifyOKFunction purchase names=" + name);
				
				NativeCaller.AdwordsTrackPurchase(product,name,cents);
			}
			catch(ex:Exception)
			{
				//ad exception.
				UnityNet.reportErrorToServer("Adwords_Error",null,null,ex.Message,false);
				_Global.Log("Adwords_Error");
			}
			finally
			{
				GameMain.instance().LockScreen("false");
			}
		}
		else
		{
			UnityNet.reportErrorToServer("GooglePlayment",null,null,hash.ToString(),false);
		}
	}
	

	
	private static function Confirm(hash:HashObject):boolean
	{
		var confirmKey:String = "";
		//if there is node "orders", then it is v2
		//if there is node "isRecevedV3", then it is v3
		
		if(hash["receiptData"]["productid"] == null)
			return;

		var isRecevedV3:boolean = NativeCaller.IsSupportV3();
		if(hash["receiptData"]["notificationid"] == null && hash["receiptData"]["productid"] != null)
			isRecevedV3 = true;
		else
			isRecevedV3 = false;
			
		_Global.Log("Confirm isRecevedV3=" + isRecevedV3);
		
			
								
		if(isRecevedV3)
			confirmKey = "productid";
		else
			confirmKey = "notificationid";
		

		if(hash["receiptData"] == null) _Global.Log("VerifyOKFunction receiptData is null.");
		if(hash["receiptData"] == null ) return false;
		
		if(hash["receiptData"]["success"] == null) 
			_Global.Log("VerifyOKFunction success0 is null.");
		else if (hash["receiptData"]["success"].Value == null)
			_Global.Log("VerifyOKFunction hash[receiptData][success].Value is null.");
		else 
			_Global.Log("VerifyOKFunction in unity. success=" + hash["receiptData"]["success"].Value.ToString());
		
		
		if(hash["receiptData"]["success"] == null) return false;
		
		if(hash["receiptData"]["gems"] == null)
			_Global.Log("gems is null.");
		else if(hash["receiptData"]["gems"].Value == null)
			_Global.Log("hash[receiptData][gems].Value is null.");
		else
			_Global.Log("VerifyOKFunction in unity. gems=" + hash["receiptData"]["gems"].Value.ToString());
		
		
		
		
		if(hash["receiptData"][confirmKey] == null) return false;
		if(hash["receiptData"][confirmKey] == null) 
			_Global.Log("confirmKey is null.");
		else if(hash["receiptData"][confirmKey].Value == null)
			_Global.Log("hash[receiptData][confirmKey].Value is null.");
		else
			_Global.Log("VerifyOKFunction in unity. confirmKey=" + hash["receiptData"][confirmKey].Value.ToString());
			
		//Confirm
		if(hash["receiptData"][confirmKey] != null && hash["receiptData"]["success"] != null 
		&& hash["receiptData"][confirmKey].Value != null && hash["receiptData"]["success"].Value != null)
		{
			var success:int = 0;
			if(!Int32.TryParse(hash["receiptData"]["success"].Value.ToString(),success))
				return false;
			
			var notificationID: String = hash["receiptData"]["purchaseToken"].Value;
			
			_Global.Log("VerifyOKFunction in unity. success=" + success.ToString());
			_Global.Log("VerifyOKFunction in unity. confirmKey=" + notificationID);
			
			
			//1 success.
			//2 already activited.
			if(notificationID != "null" && (success == 1 || success == 2) )
			{
				NativeCaller.Confirm(notificationID);
				GameMain.instance().LockScreen("false");
			}
			else
			{
				GameMain.instance().paymentErrorWithDlg("012: verify failed.");
				SendPaymentStatus(hash["receiptData"]["productid"].Value.ToString(), 1);
				return false;
			}
			_Global.Log("VerifyOKFunction in unity. hash[receiptData][gems]=" + (hash["receiptData"]["gems"] == null));

			if(	hash["receiptData"]["gems"] != null )
			{
				var serverGems:long;
				if(!Int64.TryParse(hash["receiptData"]["gems"].Value.ToString(),serverGems))
					return false;
		
				var originalGems:long = Payment.instance().Gems;
				_Global.Log("VerifyOKFunction in unity. serverGems=" + (serverGems));
				_Global.Log("VerifyOKFunction in unity. originalGems=" + (originalGems));
				
				_Global.Log("VerifyOKFunction in unity. hash[category] != null ? " + (hash["category"] != null));
				if(hash["receiptData"]["category"] != null)
				{
					_Global.Log("VerifyOKFunction in unity. _Global.INT32(hash[receiptData][category]) != = ? " + _Global.INT32(hash["receiptData"]["category"] != 0));
				}
				if(hash["receiptData"]["category"] != null  && (_Global.INT32(hash["receiptData"]["category"]) == 1 || _Global.INT32(hash["receiptData"]["category"]) == 2))
					return true;
									
//				if(serverGems <= originalGems)
//				{
//					if(serverGems == originalGems && (hash["receiptData"]["productid"].Value.ToString() == "com.kabam.kocmobile.tier1dbshield" || 
//					hash["receiptData"]["productid"].Value.ToString() == "com.kabam.kocmobile.tier2dbshield" ))
//					{
//						_Global.Log("VerifyOKFunction in unity. confirm finish. serverGems=originalGems");
//						return true;
//					}
//					GameMain.instance().LockScreen("false");
//					return false;
//				}
				
				_Global.Log("VerifyOKFunction in unity. confirm finish. serverGems=" + (serverGems));
				return true;
			}
		}
		
		return false;
	}
	
	public static function VerifyPayment(information:String)
	{
		if(Application.platform != RuntimePlatform.Android ) return;
		
		
		var prefix:String = "@=>@";

		_Global.Log("VerifyPayment information" + information.ToString());

		var index:int = information.IndexOf(prefix);
		if(index == -1) return;
		var signature:String = "";
		var data:String = "";
		var trk:String = "";
		var payoutID:String = "";
		_Global.Log("VerifyPayment index=" + index.ToString());
		if(index != 0)
		{
			signature = information.Substring(0,index);
			data = information.Substring(index+prefix.Length);
			if(data != null)
				_Global.Log("VerifyPayment in unity. data=" + data);
			else 
				_Global.Log("VerifyPayment in unity. data=null");

			_Global.Log("VerifyPayment in unity. signature=" + signature);
			_Global.Log("VerifyPayment in unity. data=" + data);
			
			if(data != null && data != "")
			{
				var infor:String = ParseData(data);
				_Global.Log("VerifyPayment in unity. infor=" + infor);
				trk = GetTrk(infor);
				_Global.Log("VerifyPayment in unity. trk=" + trk);
				payoutID = GetPayoutID(infor);				
				
				_Global.Log("VerifyPayment in unity. payoutID=" + payoutID);

				//send signature and data to server
				UnityNet.GooglePlayBuyProduct(data,signature,trk,payoutID,VerifyMultiOKFunction,null);
			}
		}
		//AndroidNativeCaller
	}

	private static function ParseData(data:String) : String
	{
		var hash:HashObject = (new JSONParse()).Parse(data);
		var information:String = "";
		
		currentOrderId = _Global.GetString(hash["orderId"]);

		var isRecevedV3:boolean = NativeCaller.IsSupportV3();
		
		//if there is node "orders", then it is v2
		//if there is node "isRecevedV3", then it is v3
//		if(hash["orders"] == null)
//			isRecevedV3 = true;
//		else
//			isRecevedV3 = false;
		_Global.Log("ParseData isRecevedV3=" + isRecevedV3);	
			
			
		
		if(isRecevedV3)
		{
			if(hash["developerPayload"] == null)
				_Global.Log("hash[developerPayload] =" + (hash["developerPayload"] == null) + "");
			information = hash["developerPayload"].Value;
			if(information == null) information = "";
			return information;
		}
		else
		{		
			if(hash["orders"] != null )
				if(hash["orders"][_Global.ap + "0"] != null)
					if(hash["orders"][_Global.ap + "0"]["developerPayload"] != null)
						information = hash["orders"][_Global.ap + "0"]["developerPayload"].Value;
		
			if(hash != null)
			{
				_Global.Log("hash[orders] =" + (hash["orders"] == null) + "");
			
				if(hash["orders"] != null)
				{
					_Global.Log("hash[orders][_Global.ap + 0] =" + (hash["orders"][_Global.ap + "0"] == null) + "");
					if(hash["orders"][_Global.ap + 0] != null)
					{
						_Global.Log("hash[orders][_Global.ap + 0][developerPayload] =" + (hash["orders"][_Global.ap + "0"]["developerPayload"] == null) + "");
					}
				}
			}
			
			if(information != null)
				_Global.Log("information =" + (information) + "");
			return information;
		}
	}
	
	private static function GetPayoutID(data:String) : String
	{
		var index:int = data.IndexOf("@=>@");
		if(index == -1 ) return "";
		return data.Substring(index + "@=>@".Length);
	}
	private static function GetTrk(data:String) : String
	{
		var index:int = data.IndexOf("@=>@");
		if(index == -1 ) return "";
		return data.Substring(0,index);
	}
	
	private static function SendPaymentStatus(productId:String, status:int)
	{
		var cents:String = "";
		var currencyCode:String = "";
		var paymentItems:Array = Payment.instance().getPaymentItems();
		var payItem:KBN.Payment.PaymentElement;
		for(var i:int=0;i<paymentItems.length;i++)
		{
			payItem = paymentItems[i] as KBN.Payment.PaymentElement;
			if (payItem != null && payItem.itunesProductId == productId) 
			{
				if(Application.platform == RuntimePlatform.Android)
				{
					var dCents:double = NativeCaller.GetCents(productId);
					cents = dCents.ToString();
				}	
				else
				{
					cents = payItem.cents + "";
				}
								
				currencyCode = payItem.currencyCode;
//				_Global.Log("for SendPaymentStatus productId: " + productId);
//				_Global.Log("for SendPaymentStatus cents: " + payItem.cents);
//				_Global.Log("for SendPaymentStatus currencyCode: " + payItem.currencyCode);
				break;
			}
		}
		_Global.Log("SendPaymentStatus productId: " + productId);
		_Global.Log("SendPaymentStatus cents: " + cents);
		_Global.Log("SendPaymentStatus currencyCode: " + currencyCode);
		var params:HashObject = new HashObject();
		params["transactionId"] = new HashObject();
		params["transactionId"].Value = currentOrderId;
		params["currencyAmount"] = new HashObject();
		params["currencyAmount"].Value = cents;
		params["currencyType"] = new HashObject();
		params["currencyType"].Value = currencyCode;
		params["payChannel"] = new HashObject();
		params["payChannel"].Value = "Google";
		params["goodId"] = new HashObject();
		params["goodId"].Value = productId;
		params["status"] = new HashObject();
		params["status"].Value = status + "";
		GameMain.instance().paymentOkForGATAHash(params);
		
		if(currencyCode == "EUR" && GameMain.instance().isWritePaymentLog() == "1")
		{
			UnityNet.reportErrorToServer("SendPaymentStatus",null,null,params.ToString(),false);
			var tempCents:double = NativeCaller.GetCents(productId);
			UnityNet.reportErrorToServer("SendPaymentStatus  cents : ",null,null,tempCents.ToString(),false);
			var tempProtucts : HashObject = Payment.instance().googlePlayProducts;
			if(tempProtucts != null)
			{
				UnityNet.reportErrorToServer("SendPaymentStatus  googlePlayProducts : ",null,null,tempProtucts.ToString(),false);
			}
		}		
	}

	
}
