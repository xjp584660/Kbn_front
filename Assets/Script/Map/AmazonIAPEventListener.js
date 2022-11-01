

class AmazonIAPEventListener
{
//#if UNITY_ANDROID
	private	static	var instance:AmazonIAPEventListener;
	
	public	static	var	AMAZON_INVALID:int = 0;
	public	static	var	AMAZON_SANDBOX:int = 1;
	public	static	var	AMAZON_PRODUCT:int = 2;
	
	private	var		env:int = AMAZON_INVALID;
	private	var		userId:String;
	private	var		listening:boolean;
	
	public	static function getInstance():AmazonIAPEventListener
	{
		if( instance == null ){
			instance = new AmazonIAPEventListener();
			instance.listening = false;
		}
		return instance;
	}
	
	public	function	startListen()
	{
		if( listening ){
			return;
		}
		
		listening = true;
		_Global.Log("Amazon Event Listener start listen");
		// Listen to all events for illustration purposes
		AmazonIAPManager.itemDataRequestFailedEvent += itemDataRequestFailedEvent;
		AmazonIAPManager.itemDataRequestFinishedEvent += itemDataRequestFinishedEvent;
		AmazonIAPManager.purchaseFailedEvent += purchaseFailedEvent;
		AmazonIAPManager.purchaseSuccessfulEvent += purchaseSuccessfulEvent;
		AmazonIAPManager.purchaseUpdatesRequestFailedEvent += purchaseUpdatesRequestFailedEvent;
		AmazonIAPManager.purchaseUpdatesRequestSuccessfulEvent += purchaseUpdatesRequestSuccessfulEvent;
		AmazonIAPManager.onSdkAvailableEvent += onSdkAvailableEvent;
		AmazonIAPManager.onGetUserIdResponseEvent += onGetUserIdResponseEvent;
	}


	public	function stopListen():void
	{
		if( !listening ){
			return;
		}
		
		// Remove all event handlers
		AmazonIAPManager.itemDataRequestFailedEvent -= itemDataRequestFailedEvent;
		AmazonIAPManager.itemDataRequestFinishedEvent -= itemDataRequestFinishedEvent;
		AmazonIAPManager.purchaseFailedEvent -= purchaseFailedEvent;
		AmazonIAPManager.purchaseSuccessfulEvent -= purchaseSuccessfulEvent;
		AmazonIAPManager.purchaseUpdatesRequestFailedEvent -= purchaseUpdatesRequestFailedEvent;
		AmazonIAPManager.purchaseUpdatesRequestSuccessfulEvent -= purchaseUpdatesRequestSuccessfulEvent;
		AmazonIAPManager.onSdkAvailableEvent -= onSdkAvailableEvent;
		AmazonIAPManager.onGetUserIdResponseEvent -= onGetUserIdResponseEvent;
		
		listening = false;
	}



	public	function itemDataRequestFailedEvent():void
	{
		_Global.Log( "itemDataRequestFailedEvent" );
		GameMain.instance().valideProducts('{"Products":[]}');
	}


	public	function itemDataRequestFinishedEvent( unavailableSkus:List.<String> , availableItems:List.<AmazonItem>  ):void
	{
		_Global.Log( "itemDataRequestFinishedEvent. unavailable skus: " + unavailableSkus.Count + ", avaiable items: " + availableItems.Count );
		var valideProducts:StringBuilder = new StringBuilder('{"Products":{');
		var index:int = 0;
		if( availableItems.Count > 0 ){
			var it:IEnumerator = availableItems.GetEnumerator();
			var cur:AmazonItem;
			while( it.MoveNext() ){
			
				cur = it.Current;
				valideProducts.Append('"a');
				valideProducts.Append(index++);
				valideProducts.Append('":"');
				valideProducts.Append(cur.sku);
				valideProducts.Append('",');
			}
			
			valideProducts.Remove( valideProducts.Length - 1, 1 );
		}
		
		valideProducts.Append('}}');
		
		_Global.Log("valideProducts:" + valideProducts.ToString() );
		GameMain.instance().valideProducts(valideProducts.ToString());
		
	}


	public	function purchaseFailedEvent( reason:String ):void
	{
		_Global.Log( "purchaseFailedEvent: " + reason );
		GameMain.instance().paymentError( reason );
	}


	public	function purchaseSuccessfulEvent(  receipt:AmazonReceipt ):void
	{
		_Global.Log( "purchaseSuccessfulEvent: " + receipt );
		GameMain.instance().AmazonVerifyPayment( userId, receipt );
	}


	public	function purchaseUpdatesRequestFailedEvent():void
	{
		_Global.Log( "purchaseUpdatesRequestFailedEvent" );
	}


	public	function purchaseUpdatesRequestSuccessfulEvent( revokedSkus:List.<String> , receipts:List.<AmazonReceipt>  ):void
	{
		_Global.Log( "purchaseUpdatesRequestSuccessfulEvent. revoked skus: " + revokedSkus.Count );
		for( var receipt in receipts )
			Debug.Log( receipt );
	}


	public	function onSdkAvailableEvent( isTestMode:boolean ):void
	{
		env = isTestMode ? AMAZON_SANDBOX : AMAZON_PRODUCT;
		_Global.Log( "onSdkAvailableEvent. isTestMode: " + isTestMode );
	}


	public	function onGetUserIdResponseEvent( userId:String ):void
	{
		_Global.Log( "onGetUserIdResponseEvent: " + userId );
		this.userId = userId;
	}

//#endif
}


