
class    Payment extends KBN.Payment
{
    
    public static var ST_COMMON:int = 0;
    public static var ST_POPULAR:int = 1;
    public static var ST_VALUABLE:int = 2;
    public static var ST_LIMIT:int = 3;
        
    private    var    buyItemOkCallback:Function;

    public class Notice extends BaseVO
    {
        public var NID    :int=0;
        public var img    :String;
        public var des    :String;
        public var startTime    :long;
        public var endTime        :long;
        public var timeRemaining    :long;
        public var type                :int;
        public var isRunning        :int;
        public var pricePointType : int;
        public var rewardChestId : int;
        public var rewardValue : int;
        public var rewardValuePercentage : int;
        public var pricePoint : int;
//        public var pricePoint : int;
        public var WorthBonus : float;
        /***
            0: yuna's offer.
        **/
        public function mergeDataFrom(src:Object):void
        {
            super.mergeDataFrom(src);
            this.startTime = this.getLong("startTime");
            this.endTime = this.getLong("endTime");
            this.type = this.getInt("type");
            this.isRunning = this.getInt("isRunning");

            switch(type)
            {
                case 8:
                    isRunning = 1;
                    
                    break;
            }
        }
        
        public function Notice()
        {
            // Empty default constructor
        }
        
        public function Notice(offerData : PaymentOfferData)
        {
            this.startTime = offerData.StartTime;
            this.endTime = offerData.EndTime;
            this.type = offerData.Type;
            this.isRunning = 1;
            this.pricePointType = offerData.PricePointType;
            this.rewardChestId = offerData.RewardChestId;
            this.pricePoint = offerData.PricePoint;
            this.rewardValue = offerData.RewardChestValue;
            this.rewardValuePercentage = offerData.RewardChestValuePercentage;
            this.WorthBonus=offerData.WorthBonus;
        }
        
        public function calcTime():void
        {
            switch(type)
            {
                case 1:
                case 2:
                case 3:
                    this.timeRemaining =  endTime - GameMain.unixtime();
                    break;
                case 8:
                    this.timeRemaining = 1;    //never complete.
                    
                    break;
            }
        }
    }
    
    private    var    itemList:Array = new Array();
    private    var    getListOkCallback:Function;
    private var _blocked:boolean = false;
    private var offerInfo:HashObject;
    private var tapjoyOpen:boolean = true;
    private static var PAYMENT_OFFER_ID : String = "payment_offer_id";
    private static var IS_BUY_OFFER_ID : String = "isBuyOffer";
    
    public function IsBuyOffer() : boolean
    {
        if(PlayerPrefs.HasKey(IS_BUY_OFFER_ID))
        {
            var buyOffer : int = PlayerPrefs.GetInt(IS_BUY_OFFER_ID);
            //_Global.Log("Payment IsBuyOffer : " + buyOffer);
            return buyOffer == 1;
        }
       // _Global.Log("Payment IsBuyOffer : false");
        return false;
    }
    
    public function GetPaymentOfferID() : int
    {
        if(PlayerPrefs.HasKey(PAYMENT_OFFER_ID))
        {
            var offerID : int = PlayerPrefs.GetInt(PAYMENT_OFFER_ID);
            //_Global.Log("Payment GetPaymentOfferID : " + offerID);
            return offerID;
        }
        
       // _Global.Log("Payment GetPaymentOfferID : -2");
        return -2;
    }
    
    public function SetBuyOfferData(buyOffer : boolean, buyOfferId : int) : void 
    {
        if(buyOffer)
        {
            PlayerPrefs.SetInt(IS_BUY_OFFER_ID, 1);
        }
        else
        {
            PlayerPrefs.SetInt(IS_BUY_OFFER_ID, 0);
        }

        PlayerPrefs.SetInt(PAYMENT_OFFER_ID, buyOfferId);
        //_Global.Log("Payment SetBuyOfferData  buyOfferId : " + buyOfferId + " buyOffer : " + buyOffer);
    }
    
    public static function instance() : Payment
    {
        if(singleton == null)
        {
            singleton = new Payment();
            (singleton as Payment).Init();
            if (GameMain.instance() != null) {
                GameMain.instance().resgisterRestartFunc(function () {
                    singleton = null;
                });
            }
        }
        
        return singleton as Payment;
    }
    
    private function Init()
    {
        buyItemOkCallback = null;
    }
    
    /******************************************************************/
    public function reqNotice():void
    {
        var seed:HashObject = GameMain.instance().getSeed();
//        var ifHasOffer:boolean = PaymentOfferManager.Instance.IsHaveOffer();
//        if(!ifHasOffer)        
//        {
            updateNotice(seed["blueLight"]);
//        }
    /*offerChange
        var seed:HashObject = GameMain.instance().getSeed();
        var data : PaymentOfferData;
        if(currentNoticeType == 3)
        {
            data = PaymentOfferManager.Instance.GetDataByCategory(3);
            if (data != null)
            {
                updateNotice(data);
            }
        }
        else
        {
            var isSlot1:int = 0;
            for(var i:int =1; i<=2; i++)
            {
                data = PaymentOfferManager.Instance.GetDataByCategory(i);
                if(data != null)
                {
                    isSlot1=i;
                    break;
                }
            }
            if(isSlot1 != 0)
            {
                updateNotice(PaymentOfferManager.Instance.GetDataByCategory(isSlot1));
            }
            else
            {
                updateNotice(seed["blueLight"]);
            }
        }
        */
    }
    
    public var notice:Notice;
    public function updateNotice(data:HashObject):void
    {
        if(data != null)
        {
            notice = new Notice();
            notice.mergeDataFrom(data);
            notice.calcTime();
            setCurNoticeType(notice.type);
        }
    }
    
    public function updateNotice(data : PaymentOfferData) : void
    {
        if (data == null)
        {
            return;
        }
        
        notice = new Notice(data);
    }
    
    public function updateQueue():void
    {
        if(notice)
        {
            notice.calcTime();
            if(notice.timeRemaining < 0)
            {
                notice = null;
                MenuMgr.getInstance().sendNotification(Constant.Notice.PAYMENT_NOTICE_END,null);
            }
        }
    }
    
    
    /******************************************************************/
    public function isBlocked():boolean
    {
        return _blocked;
    }
    public    function    getPaymentItems():Array{
        if(itemList.length <= 0)
        {
            var okCallback:Function = function( result:Object ){
                return result;
            } ;
            Payment.instance().reqPaymentList(okCallback,null, true, true);    
        }
        else
        {
            return itemList;
        }
    }
    
    public var googlePlayProducts : HashObject;
    
    public    function    setValideProducts( products:HashObject ){
        if( products != null ){
//            if(/*currencyCode == "USD" && */GameMain.instance().isWritePaymentLog() == "1")
//            {
//                UnityNet.reportErrorToServer("SendPaymentStatus1  googlePlayProducts : ",null,null,products.ToString(),false);
//            }
            googlePlayProducts = products;
            //UnityNet.reportErrorToServer("SendPaymentStatus2  googlePlayProducts : ",null,null,products.ToString(),false);
    
            var p:HashObject = products["Products"];
            var lista:List.<Object> = new List.<Object>();
            var dictionaryp:Dictionary.<String,String> = new Dictionary.<String,String>();
            var codeTypeDic : Dictionary.<String,String> = new Dictionary.<String,String>();
            var centsDic : Dictionary.<String,String> = new Dictionary.<String,String>();
            for(var i:System.Collections.DictionaryEntry in p.Table)
            {
                if(i.Key == null) continue;
                if(i.Key.ToString().Contains("a"))
                {
                    
                    if(p[i.Key] == null) continue;
                    
                   // _Global.Log("ming setValideProducts aaaaaaaaa " + i.Key.ToString());
                    
                    lista.Add(p[i.Key]);
                    if(p[i.Key].Value == null) continue;
                    _Global.Log("ming setValideProducts aaaa" + i.Key.ToString() + " value = " + p[i.Key].Value.ToString());
                }
                else if(i.Key.ToString().Contains("p"))
                {
                    if(p[i.Key] == null) continue;
                    if(p["a"+i.Key.ToString().Substring(1)] == null) continue;
                    dictionaryp[p["a"+i.Key.ToString().Substring(1)].Value.ToString()] = (p[i.Key].Value).ToString();
                    //_Global.Log("ming setValideProducts ppp " + i.Key.ToString() + " value =" + p[i.Key].Value.ToString());
                    //_Global.Log("ming setValideProducts ppp ai.Key.ToString().Substring(1) " + "a"+i.Key.ToString().Substring(1) + " value =" + p["a"+i.Key.ToString().Substring(1)].Value.ToString());
                }
                else if(i.Key.ToString().Contains("c"))
                {
                    if(p[i.Key] == null) continue;
                    if(p["a"+i.Key.ToString().Substring(1)] == null) continue;
                    codeTypeDic[p["a"+i.Key.ToString().Substring(1)].Value.ToString()] = (p[i.Key].Value).ToString();
                    //_Global.Log("ming setValideProducts ccc " + i.Key.ToString() + " value =" + p[i.Key].Value.ToString());
                    //_Global.Log("ming setValideProducts ccc ai.Key.ToString().Substring(1) " + "a"+i.Key.ToString().Substring(1) + " value =" + p["a"+i.Key.ToString().Substring(1)].Value.ToString());
                }
                else if(i.Key.ToString().Contains("b"))
                {
                    if(p[i.Key] == null) continue;
                    if(p["a"+i.Key.ToString().Substring(1)] == null) continue;
                    centsDic[p["a"+i.Key.ToString().Substring(1)].Value.ToString()] = (p[i.Key].Value).ToString();
                    //_Global.Log("ming setValideProducts bbb " + i.Key.ToString() + " value =" + p[i.Key].Value.ToString());
                    //_Global.Log("ming setValideProducts bbb ai.Key.ToString().Substring(1) " + "a"+i.Key.ToString().Substring(1) + " value =" + p["a"+i.Key.ToString().Substring(1)].Value.ToString());
                }
            }

            itunesValideProducts = lista.ToArray();
            productsPrice = dictionaryp;
            productsCodeType = codeTypeDic;
            productsCents = centsDic;
            
            //_Global.Log("ming check 2222");
            filterProducts();
            setAndroidPrices();
            setAndroidCurrencyCode();
            setAndroidCents();
//            itunesHasChecked = true;
        }
        
        if( getListOkCallback && Application.platform != RuntimePlatform.OSXEditor){
            getListOkCallback(itemList);
        }
        
        MenuMgr.getInstance().netBlock = false;
    }
    
    private function setAndroidCents()
    {
        if(RuntimePlatform.Android != Application.platform) return;
        if(Datas.GetPlatform() != Datas.AppStore.GooglePlay) return;
        if(itemList == null) return;
        var hash:Dictionary.<String,String>  = productsCents;
        if(hash == null) return;
        
        var n:int = itemList.length;
        
        for(var i:int =0;i<n;i++)
        {        
            var pe:PaymentElement = itemList[i] as PaymentElement;
            if(pe == null) continue;            
                //_Global.Log("ming setAndroidCents itemList[i].itunesProductId="+pe.itunesProductId);
            var p:String = hash[pe.itunesProductId.ToString()];
            if(p == null) continue;
            if(p.Trim() == "") continue;

            pe.cents = p;        
            //_Global.Log("ming setAndroidPrices pe.price="+pe.price);        
        }    
    }
    
    private function setAndroidCurrencyCode()
    {
        if(RuntimePlatform.Android != Application.platform) return;
        if(Datas.GetPlatform() != Datas.AppStore.GooglePlay) return;
        if(itemList == null) return;
        var hash:Dictionary.<String,String>  = productsCodeType;
        if(hash == null) return;
        
        var n:int = itemList.length;
        
        for(var i:int =0;i<n;i++)
        {        
            var pe:PaymentElement = itemList[i] as PaymentElement;
            if(pe == null) continue;            
                //_Global.Log("ming setAndroidCurrencyCode itemList[i].itunesProductId="+pe.itunesProductId);
            var p:String = hash[pe.itunesProductId.ToString()];
            if(p == null) continue;
            if(p.Trim() == "") continue;

            pe.currencyCode = p;
            //_Global.Log("ming setAndroidPrices pe.price="+pe.price);        
        }    
    }
    
    private function setAndroidPrices()
    {
        if(RuntimePlatform.Android != Application.platform) return;
        if(Datas.GetPlatform() != Datas.AppStore.GooglePlay) return;
        if(itemList == null) return;
        var hash:Dictionary.<String,String>  = productsPrice;
        if(hash == null) return;
        
        var n:int = itemList.length;
        
        for(var i:int =0;i<n;i++)
        {        
            var pe:PaymentElement = itemList[i] as PaymentElement;
            if(pe == null) continue;            
            //_Global.Log("ming setAndroidPrices itemList[i].itunesProductId="+pe.itunesProductId);
            var p:String = hash[pe.itunesProductId.ToString()];
            if(p == null) continue;
            if(p.Trim() == "") continue;

            pe.price = p;
            //_Global.Log("ming setAndroidPrices pe.price="+pe.price);        
        }        
    }
    private    function    filterProducts()
    {
        //_Global.Log("ming filterProducts 0");
        for( var i:int = itemList.length - 1; i >= 0 ; i -- )
        {
            //_Global.Log("ming filterProducts 1");
            if(Application.platform == RuntimePlatform.Android)
            {
                //_Global.Log("ming filterProducts 2");
                
                var p:PaymentElement = itemList[i] as PaymentElement;
                //_Global.Log("ming filterProducts remove 2.5 id="+p.itunesProductId.ToString()+" price="+p.price);

                if( !(findProductInValideAndroid( itemList[i], itunesValideProducts )))
                {
                    //_Global.Log("ming filterProducts 3");
                    var pe:PaymentElement = itemList[i] as PaymentElement;
                    //_Global.Log("ming filterProducts remove 5 id="+pe.itunesProductId.ToString()+" price="+pe.price);
                    itemList.RemoveAt(i);
                }
            }
            else
            {
                //_Global.Log("ming filterProducts 4");
                if( !(findProductInValide( itemList[i], itunesValideProducts )))
                {
                //_Global.Log("ming filterProducts 6");
                    itemList.RemoveAt(i);
                }
            }    
        }
    }
    
    private    function    hasItemData( itemDataList:HashObject, itemId:int ){
        var itemData:HashObject = itemDataList["i" + itemId];
        if(itemData == null || itemData["category"] == null ){
//            _Global.Log(" payment item:" + itemId + "data Invalide");
            return false;
        }
        
        return true;
    }
    
    
    
    private    function    findProductInValide( e:PaymentElement, valideProducts:Array ){
//        _Global.Log("find valide id:" + e.itunesProductId);    
        for( var i:int = 0; i < valideProducts.length; i ++ ){
            if( e.itunesProductId == (valideProducts[i] as HashObject)["itunes_productid"].Value ){
                var price:String = (valideProducts[i] as HashObject)["price"].Value;
                e.price = price;
                if ((valideProducts[i] as HashObject)["currency_code"] != null)
                {
                    e.currencyCode = (valideProducts[i] as HashObject)["currency_code"].Value;
                }
//                e.description = e.description.Replace("%price%",price);
//                _Global.Log("price:" + price + " desc:" + e.description + " find ok");
                return true;
            }
        }
//        _Global.Log("find false");
        return false;
    }
    
    private    function    findProductInValideAndroid( e:PaymentElement, valideProducts:Array ){
        //_Global.Log("find valide id:" + e.itunesProductId);    
        for( var i:int = 0; i < valideProducts.length; i ++ ){
            if( e.itunesProductId == (valideProducts[i] as HashObject).Value)
            {
                return true;
            }
        }
//        _Global.Log("find false");
        return false;
    }
    
    
//    private static var PIDS:Array = [
//           "com.kabam.kocmobile.hardcurrency50",
//            "com.kabam.kocmobile.hardcurrency100",
//            "com.kabam.kocmobile.hardcurrency200",
//            "com.kabam.kocmobile.hardcurrency300",
//            "com.kabam.kocmobile.hardcurrency525",
//            "com.kabam.kocmobile.hardcurrency1100"];
    public function getProductIdByCurrency(currency:int):Payment.PaymentElement
    {
        for (var payItem:Payment.PaymentElement in itemList) 
        {
            if (payItem.currency == currency && payItem.category != -2) 
            {
                return payItem;
            }
        }
        return null;
    }
    
    public function getDBProductIdByCurrency(currency:int):Payment.PaymentElement
    {
        for (var payItem:Payment.PaymentElement in itemList) 
        {
            if (payItem.currency == currency && payItem.category == -2) 
            {
                return payItem;
            }
        }
        return null;
    }
    
    public    function isTapjoyOpen(){
        return tapjoyOpen;
    }
    
    public    function reqPaymentList( okCallback:Function, errorCallback:Function, netBlock:boolean, itunesCheck:boolean ){
        MenuMgr.getInstance().netBlock = netBlock;
        
        
        var okFunc:Function = function(result:HashObject){
//            _Global.Log("Get Payment OK");
            itemList.clear();
            var packages:HashObject = result["packageData"]["packages"];
            var packagesCnt:int = _Global.GetObjectValues( packages ).length;
            var e:PaymentElement;
            var p:HashObject;
            //JIRA:2427
            this._blocked = (result["blocked"].Value == true); // default false.
            if( result["opentapjoy"] != null ){
                var tapjoyValue:int = _Global.INT32(result["opentapjoy"]);
                tapjoyOpen = tapjoyValue == 1 ? true : false;
            }
            
            //kick 4.99$
            
            for( var i:int = 0; i < packagesCnt; i ++ )
            {
                p = packages[_Global.ap + i];
                e = new PaymentElement();
                
                e.payoutId = _Global.INT32(p["payoutid"]);
                e.currency = _Global.INT32(p["currency"]);
                if(p["category"])
                    e.category = _Global.INT32(p["category"].Value);
                    
                if( p["currency_code"] != null ){
                    e.currencyCode = p["currency_code"].Value.ToString();
                }
                
                if( p["cents"] != null ){
                    e.cents = p["cents"].Value.ToString();
                }

                e.description = p["description"].Value;
                e.itunesProductId = p["itunes_productid"].Value;
                
                
                switch( e.itunesProductId ){
                case    prefix + ".tier1":
                    e.bi = 18;
                    e.icon = "10g";
                    break;
                case    prefix + ".tier2":
                e.bi = 18;
                e.icon = "20g";
                    break;
                case    prefix + ".tier3a":
                    e.bi = 18;
                    e.icon = "30g";
                    break;
                case    prefix + ".tier5":
                    e.bi = 11;
                    e.icon = "50g";
                    break;
                    
                case    prefix + ".tier10":
                    e.bi = 12;
                    e.icon = "100g";
                    break;
                    
                case    prefix + ".tier20":
                    e.bi = 13;
                    e.icon = "240g";
                    break;
                    
                case    prefix + ".tier30":
                    e.bi = 14;
                    e.icon = "375g";
                    break;
                    
                case    prefix + ".tier50":
                    e.bi = 15;
                    e.icon = "665g";
                    break;
                    
                case    prefix + ".tier60":
                    e.bi = 16;
                    e.icon = "1600g";
                    break;
                case     prefix + ".tier75":
                    e.bi = 17;
                    e.icon = "4500g";
                    break;
                }
                
                
                //to change next sprint.

                if(p != null && p["bonus_description"] != null)
                {
                    if(_Global.GetString(p["bonus_description"]).Trim() != "")
                    {
                        e.bonusDescription = String.Format(Datas.instance().getArString("paymentLabel.BonusDescription"),_Global.GetString(p["bonus_description"]));
                        if(e.bonusDescription == "paymentLabel.BonusDescription")
                            e.bonusDescription = "";
                    }
                    
                }
                
                //e.bonusName = p["bonus_name"];
                e.saleType = _Global.INT32(_Global.FilterStringToNumberStr(p["bonus_name"].Value)) ;
//                _Global.Log("ST:" + e.saleType);
                /*
                if( p["chestid"] ){
                    e.chestId = _Global.INT32(p["chestid"]);
                }else{
                    e.chestId = PaymentElement.NO_BONUS;
                }
                */
                
                //setAndroidPrice(e,p);
               // _Global.Log("ming e.id=" + e.itunesProductId );
                
                itemList.Push(e);
                
            }
            if(Application.platform == RuntimePlatform.Android && Datas.GetPlatform() == Datas.AppStore.GooglePlay)
                NativeCaller.ItunesCheckPackages();
            if( itunesCheck )
            {
                //_Global.Log("ming check 0");
                getListOkCallback = okCallback;
                if( itunesValideProducts && Application.platform != RuntimePlatform.Android)
                {
                    //_Global.Log("ming check 1");
                    filterProducts();
                    if( getListOkCallback )
                    {
                        getListOkCallback(itemList);
                    }
                    MenuMgr.getInstance().netBlock = false;
                }
                else if( Datas.GetPlatform() == Datas.AppStore.Amazon ){
                    AmazonPayment.getInstance().ItunesCheckPackages();
                }
                else if(Application.platform == RuntimePlatform.IPhonePlayer)
                {
                    NativeCaller.ItunesCheckPackages();
                }
            }
            else if(okCallback)
            {
                okCallback(result);
            }
            
        } ;
        
//        var    errorFunc:Function = function(msg:String, errorCode:String){
//            MenuMgr.getInstance().netBlock = false;
//            
//            if( errorCallback ){
//                errorCallback( msg, errorCode );
//            }
//            
//        } ;

        
        UnityNet.reqPaymentList([Datas.instance().tvuid()], okFunc, errorCallback );
        
    }
    
    public function GetPaymentItem(ProductID:String):PaymentElement {
        for (var payItem:Payment.PaymentElement in itemList) {
            if (payItem.itunesProductId == ProductID) {
                return payItem;
            }
        }
        return null;
    }
    
    protected function DirectPurchaseGetListOK(Obj:HashObject):void {
            if (!GetPaymentItem(Obj["productid"].Value)) {
                return;
            }
            MenuMgr.getInstance().PushMenu("DirectPurchaseDlg", Obj, "trans_zoomComp");
    }
    
    public function DirectPurchaseItem(Obj:HashObject):void {
        if (!Obj["description"] || !Obj["productid"]) {
            return;
        }
        var okFunc:Function = function(result:Object){
            DirectPurchaseGetListOK(Obj);
        } ;
        reqPaymentList(okFunc, null, true, true);
    }
    //save payment list data
    public function reqPaymentData(){
        var okFunc:Function = function(result:Object){
            var datas:Array= result as Array;
            for(var i:int;i<datas.length;i++)
            {
                var pe:PaymentElement = datas[i] as PaymentElement;
                //_Global.Log("prodect id is"+pe.payoutId+" ----- price is "+pe.price+"----- code is "+pe.currencyCode+"------ cents is"+pe.cents);
                AddOrderInfo(pe);
            }
        } ;
        reqPaymentList(okFunc, null, true, true);
    }
    
    private function setAndroidPrice(e:PaymentElement, p:HashObject):void
    {
        if(Application.platform == RuntimePlatform.Android)
        {
            if(p["cents"] != null && p["currency_code"] != null)
            {
                var d:double = 0.0f; 
                
                var currency:String = "";
                System.Double.TryParse(p["cents"].Value.ToString(),d);
                
                d /= 100;
                currency = p["currency_code"].Value.ToString();
                
                
                currency = NativeCaller.GetCurrencySign(currency);
                e.price = currency +  d.ToString();
                
            }
        }
        
        
    }
    
    public function AndroidPaymentOk() : void 
    {
        //_Global.Log("Payment AndroidPaymentOk !!!!!!!");
        var offerId : int = GetPaymentOfferID();
        if(IsBuyOffer() && offerId != -2)
        {
            //_Global.Log("Payment AndroidPaymentOk refreshOfferPaymentData!!!!!!!");
            
            var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetPaymentOfferDataById(offerId);        
            //_Global.Log("Payment offerMenu  refreshOfferPaymentData offerId : " + offerId + " offerData.IsMonthlyCard : " + offerData.IsMonthlyCard);    
            if(offerData != null && offerData.IsMonthlyCard)
            {
                PaymentOfferManager.Instance.RemovePaymentMonthlyCardOffer(offerId);
            }
            MenuMgr.getInstance().sendNotification("refreshOfferPaymentData",offerId);
        }
            
        SetBuyOfferData(false,-2);
    }
    
    public function responseToObjectC(receiveMsg:String):void
    {
        if( !receiveMsg ){
            return;
        }
                
        var msgArr : String[] = receiveMsg.Split(":"[0]);
        var msg : String = msgArr[0];
        var offerId : int = _Global.INT32(msgArr[1]);
        
        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetPaymentOfferDataById(offerId);        
        if(offerData != null && offerData.IsMonthlyCard)
        {
            PaymentOfferManager.Instance.RemovePaymentMonthlyCardOffer(offerId);
        }
        
        MenuMgr.getInstance().sendNotification("refreshOfferPaymentData",offerId);
//        var kPush : KPushHelp = KPushHelp.getInstance();
//        kPush.IOsPingPayment();
        //_Global.Log("Payment receiveMsg :" + receiveMsg + "msg : " + msg + "offerId : " + offerId);
        for( var i = 0; i < itemList.length; i ++ ){
            var element:PaymentElement = itemList[i] as PaymentElement;
            if( msg == (itemList[i] as PaymentElement).itunesProductId)
            {
                /*
                if( itemList[i].chestId != PaymentElement.NO_BONUS )
                {
                    MyItems.instance().AddItem(itemList[i].chestId);
                }
                */
                if (element.category == 1) {
                    GameMain.instance().invokeUpdateSeedInTime(1);
                }
                var seed:HashObject = GameMain.instance().getSeed();
                AddGems(element.currency);
                
                //update  offer data 
                updateOffer(element.currency);
                //ADXWrapper.SendAdXEvent("Sale", element.PriceWithoutCurrencySymbol, element.currencyCode == null ? String.Empty : element.currencyCode);
                break;
            }
        } ;
    }
    
    public function updateOffer(cost:int)
    {/*offerChange
        PaymentOfferManager.Instance.RemoveDisPlayDataByPricePoint(cost,true);*/
    }
    
    public function addBeginnerOfferReward(result:HashObject):void
    {        
        checkBegginerReward(result);
        setCurNoticeType(8);
        checkBlueLight(result);
        
    }
    
    private function checkBegginerReward(result:HashObject):boolean
    {
        var rlist:Array = _Global.GetObjectValues(result["rewards"]);
        var item:HashObject;
        var iid:int;
        var inum:int;
        var offerId:int;
//         _Global.Log("payment.js-->rlist.length="+rlist.length);
        if(rlist.length == 0)
        {
            MenuMgr.getInstance().PushMessage(Datas.instance().getArString("ToastMsg.Payment_OK"));
            return false;
        }

        var hasShownToaster : boolean = false;
        var offerType : int = 0;
        var offerName : String;
        for(var i:int = 0; i<rlist.length; i++)
        {
            item = rlist[i] as HashObject;
            if(!item)
                continue;
            
            offerType = _Global.INT32(item["offerType"]);
            iid = _Global.INT64(item["itemId"]);
            inum = _Global.INT32(item["count"]);
            offerId = _Global.INT32(item["offerId"]);
            
            //offerType = 1MonthlyCard ;  offerType = 2 offer        
            var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetSpecialPaymentOfferDataById(offerId);        
            if(offerData != null)
            {
                var chestId : int = offerData.RewardChestId;
                if(chestId != 0)
                {                
                    if(offerType == 1)
                    {
                        var rewardName : String = _Global.GetString(item["offerName"]);
                        var tile : Tile = TextureMgr.instance().LoadTileOfItem(iid);
                        
                        MenuMgr.getInstance().PushMessageWithImage(String.Format(Datas.getArString("Offer.CongratulationMonthly"), rewardName), tile);
                        hasShownToaster = true;
                    }
                    else
                    {
                        MyItems.instance().AddItem(iid,inum);
                        if (!hasShownToaster && (!MystryChest.instance().IsMystryChest_Temp(iid) || MystryChest.instance().IsLoadFinish))
                        {
                            ShowOfferRewardToaster(iid);
                            hasShownToaster = true;
                        }
                    }
                }
                else
                {                
                    if(offerType == 1)
                    {
                        MenuMgr.getInstance().PushMessage(Datas.getArString("Offer.NewCongratulationMonthly"));
                        hasShownToaster = true;
                    }
                    else
                    {
                        var intsubItems : HashObject = offerData.subItems;
                        var items : InventoryInfo[] = ChestDetailDisplayData.GetOfferItems(intsubItems);
                        for(var j : int = 0; j < items.Length; ++j)
                        {
                            var temp : InventoryInfo = items[j];
                            var itemId : int = temp.id;
                            var itemCount : int = temp.quant;
                            
                            MyItems.instance().AddItem(itemId,itemCount);                        
                        }
                        
                        MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.NewOfferReward"));
                        hasShownToaster = true;
                    }
                }
            }                        
        }

        if (!hasShownToaster)
        {
            hasShownToaster = true;
            MenuMgr.getInstance().PushMessage(Datas.instance().getArString("ToastMsg.Payment_OK"));
        }


        var isOffer:boolean = false;
        /*offerChange
        var topOfferType:int = MenuMgr.getInstance().MainChrom.topOfferType;
        for(var k:int =1;k<=3;k++)
        {
            var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDataByCategory(k);
            if (offerData != null)
            {
                if(offerData.IsOnce && offerData.CheckPurchaseAmount(_Global.INT32(result["gems"].Value)))
                {
                    PaymentOfferManager.Instance.UpdateData(null, k);
                }
                    
                isOffer = true;
            }
        }
        
        if (PaymentOfferManager.Instance.PayingStatus != PaymentOfferManager.PayingStatusType.HasPaid
            && PaymentOfferManager.Instance.GetDataByCategory(1) != null)
        {
            PaymentOfferManager.Instance.UpdateData(null, 1);
            PaymentOfferManager.Instance.PayingStatus = PaymentOfferManager.PayingStatusType.HasNotPaid;
        }
        
        for(var j:int =1; j<=3;j++)
        {
            if (PaymentOfferManager.Instance.GetDataByCategory(topOfferType) == null && PaymentOfferManager.Instance.GetDataByCategory(j) != null)
            {
                topOfferType = j;
            }
        }
        if (PaymentOfferManager.Instance.GetDataByCategory(topOfferType) == null)
            MenuMgr.getInstance().MainChrom.topOfferType = 8;
        */
        return isOffer;
    }
    
    private function ShowOfferRewardToaster(iid : int)
    {
        var rewardName : String;
        var tile : Tile = TextureMgr.instance().LoadTileOfItem(iid);
        if (MystryChest.instance().IsMystryChest(iid))
        {
            rewardName = MystryChest.instance().GetChestName(iid);
            MenuMgr.getInstance().PushMessageWithImage(String.Format(Datas.getArString("ToastMsg.OfferReward"), rewardName), tile);
        }
        else
        {
            MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Payment_OK"));
        }       
    }
    
    private function checkBlueLight(result:HashObject):boolean
    {
        var seed:HashObject = GameMain.instance().getSeed();
        var bl:HashObject = result["blueLight"];
        if(bl == null)
            return false;
        if(seed["blueLight"] == null)
        {
            seed["blueLight"]=new HashObject({"type":8} );
        }
        
        blueLightData.updateWithData(bl);
        /*
        seed["blueLight"]["cur"] = bl["cur"];
        seed["blueLight"]["max"] = bl["max"];
        seed["blueLight"]["showIcon"] = ( _Global.INT32(seed["blueLight"]["max"]) - _Global.INT32(seed["blueLight"]["cur"]) < 100);
        */
        var chestId:int = _Global.INT32(bl["chest"]);
        if( chestId > 0)
        {
            MyItems.instance().AddItem(chestId,1);
            MenuMgr.getInstance().PushMenu("BlueLightPrize",bl,"trans_zoomComp");
            return true;
        }
        this.updateNotice(bl);
        return false;
    }
//    //after user buy item, itemlist need clear
//    public    function    clear():void{
//        itemList.clear();
//    }
    
    public function PushPaymentMenu(biType:int)
    {
        if(World.instance().IsTestWorld() && TestGems > 0)
        {
            var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
            dialog.setLayout(600,460);
            dialog.setTitleY(40);
            dialog.setContentRect(70,140,0,360);
            dialog.setDefaultButtonText();
            var content:String = Datas.instance().getArString("SpeciallWorld.FreeGem_Desc") + "\n\n" + 
            Datas.instance().getArString("SpeciallWorld.FreeGem_RealGems") + ":" + Gems + "\n" +
            Datas.instance().getArString("SpeciallWorld.FreeGem_FreeGem") + ":" + TestGems + "\n" ;
            
            var title:String = Datas.instance().getArString("SpeciallWorld.FreeGem_Title");
        
            MenuMgr.getInstance().PushConfirmDialog(content,title,null,null);
            dialog.SetCancelAble(false);
        }
        else
        {
            UnityNet.SendPaymentBI( biType );
            GameMain.instance().cancelrecoverBuyObserver();
            
            var menu : KBNMenu = KBN.MenuMgr.instance.getMenu("OfferMenu");
            if(menu != null)
            {
                   MenuMgr.getInstance().sendNotification(Constant.Notice.PAYMENT_OFFER_CLICK_PAGE, Constant.OfferPage.Payment); 
            }    
            else
            {
                MenuMgr.getInstance().PushMenu("OfferMenu", Constant.OfferPage.Payment, "trans_zoomComp");
            }
            
            //MenuMgr.getInstance().sendNotification(Constant.Notice.PAYMENT_OFFER_CLICK_PAGE,pageNum); 
//            var okCallback:Function = function( result:Object ){
//                var transition : String = "trans_zoomComp";
//                //MenuMgr.getInstance().PushMenu("PaymentMenu", result, transition);
//                //MenuMgr.getInstance().PushMenu("OfferMenu", {"offerPage" : Constant.OfferPage.Payment, "data" : result}, transition);
//                MenuMgr.getInstance().PushMenu("OfferMenu", Constant.OfferPage.Payment, transition);
//            } ;
//            Payment.instance().reqPaymentList(okCallback,null, true, true);    
        }
    }
    public function CheckGems(reqire:int)
    {
        if(World.instance().IsTestWorld() && TestGems > 0)
        {
            if(TestGems >= reqire)
            {
                return true;
            }
            else
            {
                MenuMgr.getInstance().PushPaymentMenu();
                return false;
            }
        }
        else
        {
            if(Gems >= reqire)
            {
                return true;
            }
            else
            {
                MenuMgr.getInstance().PushPaymentMenu();
                return false;
            }
        }
    }
    
    // Total gems, including normal ones and shadow ones.
    public function get Gems():long
    {
        var seed : HashObject = GameMain.instance().getSeed();
        return _Global.INT64(seed["player"]["gems"]);
    }
    
    // Gems that are granted from special items and only can be used in the world where the items are obtained.
    public function get ShadowGems() : long
    {
        var seed : HashObject = GameMain.instance().getSeed();
        return _Global.INT64(seed["player"]["shadowGems"]);
    }
    
    // Gems that are purchased in IAP/IAB or granted by advertisements and can be used across worlds.

    public function get NormalGems() : long
    {
        return Gems - ShadowGems;
    }

    /* 迷雾远征 购买 成功后 更新 Gems 数量*/
    public function SetGames(result: HashObject) {

        var seed: HashObject = GameMain.instance().getSeed();


        if (result != null && result.Contains("shadowgems"))
            seed["player"]["shadowGems"] = result["shadowgems"];
        else
            Debug.Log("<color=#E79400FF> shadowgems 有问题 1086  </color>");


        if (result != null && result.Contains("gems"))
            seed["player"]["gems"] = result["gems"];
        else
            Debug.Log("<color=#E79400FF> gems 有问题 1090  </color>");
    }


    
    public function get TestGems():long
    {
        var seed:HashObject = GameMain.instance().getSeed();
        return _Global.INT64(seed["player"]["worldGems"]);
    }
    
    public function get DisplayGems():long
    {
        if(World.instance().IsTestWorld() && TestGems > 0)
        {
            return TestGems;
        }
        else
        {
            return Gems;
        }
    }
    public function SubtractGems(cost:int)
    {
        if(World.instance().IsTestWorld() && TestGems > 0)
        {
            updateTestCurrency(TestGems - cost);
        }
        else
        {
            SubtractRealGems(cost);
        }
    }
    public function SubtractGems(cost:int,isReal:boolean)
    {
        if(isReal)
        {
            SubtractRealGems(cost);
        }
        else
        {
            SubtractGems(cost);
            if(TestGems <=0)
            {
                MenuMgr.getInstance().MainChrom.SetBtnMoneyStyle(true);
            }
        }
    }
    
    private function SubtractRealGems(cost : int) {
        if (ShadowGems >= cost) {
            updateShadowCurrency(ShadowGems - cost);
        } else {
            updateHardCurrency(Gems - cost);
            updateShadowCurrency(0);
        }
    }
    
    // Add normal gems
    public function AddGems(cost:int)
    {
        //_Global.Log("$$$$$ final add Gems $$$$$$$$$$");    
        updateHardCurrency(NormalGems + cost);
    }
    
    public function AddShadowGems(cost : int)
    {
        //_Global.Log("$$$$$ final AddShadowGems Gems $$$$$$$$$$");    
        updateShadowCurrency(ShadowGems + cost);
    }

    private function updateHardCurrency(newTotal:int) {
        //_Global.Log("$$$$$ final updateHardCurrency Gems $$$$$$$$$$");    
        var normalGemsAdded : int = newTotal - Payment.instance().NormalGems;
        var totalGemsOriginal : int = Payment.instance().Gems;
        var seed : HashObject = GameMain.instance().getSeed();
        seed["player"]["gems"].Value = (totalGemsOriginal + normalGemsAdded).ToString();
        MenuMgr.getInstance().sendNotification(Constant.Notice.GEMS_UPDATED,null);
    }

    private function updateShadowCurrency(newTotal : int) {
        //_Global.Log("$$$$$ final updateShadowCurrency Gems $$$$$$$$$$");    
        var shadowGemsAdded : int = newTotal - Payment.instance().ShadowGems;
        var totalGemsOriginal : int = Payment.instance().Gems;
        var seed : HashObject = GameMain.instance().getSeed();
        seed["player"]["shadowGems"].Value = "" + newTotal;
        seed["player"]["gems"].Value = (totalGemsOriginal + shadowGemsAdded).ToString();
        MenuMgr.getInstance().sendNotification(Constant.Notice.GEMS_UPDATED, null);
    }

    private function updateTestCurrency(newTotal:int)
    {
        var seed : HashObject = GameMain.instance().getSeed();
        seed["player"]["worldGems"].Value = "" + newTotal;
        MenuMgr.getInstance().sendNotification(Constant.Notice.GEMS_UPDATED,null);
    }
    
    public function IsDisplayRealGems()
    {
        if(World.instance().IsTestWorld() && TestGems > 0)
        {
            return false;
        }
        return true;
    }
    
    public function CheckBlockAndPopMessage():boolean 
    {
         if(isBlocked()) 
         {
            var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();    
            confirmDialog.setLayout(600,320);        
            confirmDialog.setContentRect(70,75,0,140);
            confirmDialog.setDefaultButtonText();
            confirmDialog.setButtonText(Datas.getArString("Settings.ContactUs"), Datas.getArString("Common.Cancel") );
            MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Payemnt.blockContent"),"",handler_contact,handler_close);
            confirmDialog.SetCloseAble(false);
            return true;
        }
        return false;
     }
     
     public function BuyItem(PayItem:Payment.PaymentElement):void 
     {
         buyItemOkCallback = null;
          BuyItem(PayItem,null);
     }
     
     public function BuyItem(PayItem:Payment.PaymentElement, OkCallback:Function):void 
     {
            
          if(CheckBlockAndPopMessage()) 
          {
             return;
         }

         
         if(OkCallback != null)
         {
             buyItemOkCallback = OkCallback;
         }
         
         if (PayItem != null) {
            UnityNet.SendPaymentBI(PayItem.bi);
            GameMain.instance().buyAppProduct(PayItem.itunesProductId,PayItem.payoutId);
            
         }
     }
     
     public function getBuyItemOkCallback():Function
     {
         return buyItemOkCallback;
     }
     
     public function BuyItemOkCallback():void
     {
         if(buyItemOkCallback)
         {
             buyItemOkCallback();
         }
     }
     
     public function resetBuyItemOkCallback():void
     {
         buyItemOkCallback = null;
     }
     
     private function handler_contact():void
     {
         UnityNet.GetHelp(2, GetHlepOk, null);
     }
     
    private function GetHlepOk(result:HashObject)
    {
        Application.OpenURL(result["url"].Value);
        handler_close();
    }
    
     private function handler_close():void
     {
         MenuMgr.getInstance().SwitchMenu("MainChrom",null);
     }
     
     public function getPaymentListForShow(all:Array):Array
    {
        var retArr:Array = new Array();
        for( var d:Payment.PaymentElement in all )
        {    
            if (d.category != 0) {
                continue;
            }
            retArr.Add(d);
        }
        return retArr;
    }
    
    public var buyMonthlyCardOk = false;
    private var secondTimes : int = 0;
    private var IntervalTime : int = 1;
    public function Update()
    {
        if(buyMonthlyCardOk && MenuMgr.getInstance().GetCurMenuName() == "MainChrom")
        {
            secondTimes += 1;
            if(secondTimes > IntervalTime)
            {
                secondTimes = 0;
                buyMonthlyCardOk = false;
                //_Global.Log("MonthCard   buyMonthlyCardOk = false");    
                GameMain.instance().buyMonthCardOk();
            }
        }
    }    
}
