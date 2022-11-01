class AmazonPayment extends KBN.AmazonPayment {
	private	var	externalTrkid:String;
	private	var	gameServerProductIds:String[];
	
	public	static function	getInstance():AmazonPayment{
		if( instance == null ){
			instance = new AmazonPayment();
		}
		return instance as AmazonPayment;
	}
	
	public	function	SetProductPackages(JSONPackages:String):void{
		if( JSONPackages == null )
			return;
			
		var serverData:HashObject = ( new JSONParse()).Parse(JSONPackages);
		
		if( serverData["ok"].Value != true )
			return;
		
		var packageData:HashObject = serverData["packageData"];
		if( packageData == null ){
			return;
		}
		
		externalTrkid = packageData["externalTrkid"].Value.ToString();
		
		var packages:HashObject = packageData["packages"];
		if( packages == null ){
			return;
		}
		
		var	values:Array = _Global.GetObjectValues(packages);
		var pIds:Array = new Array();
		for( var v:HashObject in values ){
			pIds.Add( v["itunes_productid"].Value );
		}
		
		gameServerProductIds = pIds.ToBuiltin(String);
	}
	
	public	function	ItunesCheckPackages():void{
		AmazonIAPEventListener.getInstance().startListen();
		AmazonIAP.initiateItemDataRequest(gameServerProductIds);
	}
	
	public	function	BuyAppProduct(pid:String):void{
		_Global.Log("Buy product:" + pid);
		AmazonIAP.initiatePurchaseRequest(pid);
		
		if( Application.isEditor ){
			var ht:Hashtable = new Hashtable();
			ht.Add("type","consumable");
			ht.Add("token","345");
			ht.Add("sku","123");
			var receipt:AmazonReceipt = new AmazonReceipt(ht);
			GameMain.instance().AmazonVerifyPayment( "1", receipt );
		}
	}
	
	
	
	public	function	VerifyPayment(userId:String, receipt:AmazonReceipt):void{
		var pe:Payment.PaymentElement = Payment.instance().GetPaymentItem(receipt.sku);
		if( pe == null ) return;
		
		var recorder:AmazonPaymentRecorderItem = new AmazonPaymentRecorderItem();
		
		recorder.payoutId = pe.payoutId.ToString();
		recorder.cents = pe.cents.ToString();
		recorder.currency = pe.currencyCode;
		recorder.amazonUserId = userId.ToString();
		recorder.token = BuildSetting.DEBUG_MODE == 1 ? receipt.token.ToString() + System.DateTime.Now.Ticks : receipt.token.ToString();
		recorder.sku = receipt.sku;
		recorder.transactionId = UnityNet.getMD5Hash(recorder.token + recorder.amazonUserId + recorder.sku);
		
		AmazonPaymentRecorder.getInstance().addRecord(recorder);
		VerifyToServer( recorder );
	}
	
	private	function	VerifyToServer( recorder:AmazonPaymentRecorderItem):void{
		
		var form:WWWForm = new WWWForm();
		form.AddField("transactionid", recorder.transactionId);
		form.AddField("sku", recorder.sku);
		form.AddField("type","verifyamazon");	//HARD CODE as before.
		form.AddField("payoutid",recorder.payoutId);
		form.AddField("cents",recorder.cents);
		form.AddField("currency",recorder.currency);
		form.AddField("amazonuserid",recorder.amazonUserId);
		form.AddField("purchasetoken",recorder.token);
		form.AddField("externalTrkid",externalTrkid);
		
		UnityNet.AmazonVerifyProduct(form, VerifyOKFunction, VerifyErrorFunction);
	}
	
	private function VerifyOKFunction(hash:HashObject):void{
	
		var productId:String;
		
		AmazonPaymentRecorder.getInstance().delRecord(hash["receiptData"]["transactionId"].Value);
		
		var success:int = _Global.INT32(hash["receiptData"]["success"]);
		switch( success ){
			case	1:
				productId = hash["receiptData"]["productid"].Value.ToString();
				GameMain.instance().paymentOk(productId);
				GameMain.instance().paymentRewardByVerify(hash);
				break;
			
			case	2:
				GameMain.instance().paymentOk("");
				break;
			
			default:
				GameMain.instance().paymentErrorWithDlg("012");
				break;
		}
		
	}
	
	private function VerifyErrorFunction(msg:String, errorCode:String):void{
		GameMain.instance().paymentErrorWithDlg("012");
	}
	
	public	function	recoverPayment(){
		UnityNet.reqAmazonOrderList(null, amazonOrderListOk, amazonOrderListError);
		ItunesCheckPackages();
	}
	
	private		function	amazonOrderListOk(result:HashObject){
		var p:HashObject = result["data"];
		var orders:Array = _Global.GetObjectValues(p);
		var order:HashObject;
		
		var localRecords:AmazonPaymentRecorderItem[] = AmazonPaymentRecorder.getInstance().getRecords();
		if( localRecords != null ){
			for( var i:int= 0; i < localRecords.length; i ++ ){
				for( var j:int = orders.length - 1; j >= 0; j -- ){
					order = orders[j] as HashObject;
					if( order == null ){
						continue;
					}
					
					if( localRecords[i].transactionId == order["transactionId"].Value.ToString()){
						orders.RemoveAt(j);
						break;
					}
				}
				
				VerifyToServer( localRecords[i] as AmazonPaymentRecorderItem );
			}
		}
		
		for( var k:int = 0; k < orders.length; k ++ ){
			order = orders[k] as HashObject;
			if( order == null ){
				continue;
			}
			
			var recorder:AmazonPaymentRecorderItem = new AmazonPaymentRecorderItem();
			
			recorder.transactionId = order["transactionId"].Value.ToString();
			
			VerifyToServer( recorder );
		}

		GameMain.instance().seedUpdate(true);
		
	}
	
	private		function	amazonOrderListError(errorMsg:String, errorCode:String){
		var localRecords:AmazonPaymentRecorderItem[] = AmazonPaymentRecorder.getInstance().getRecords();
		if( localRecords != null ){
			for( var i:int= 0; i < localRecords.length; i ++ ){
				VerifyToServer( localRecords[i] as AmazonPaymentRecorderItem );
			}
		}
	}
}