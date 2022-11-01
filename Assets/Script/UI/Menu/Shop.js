
class Shop extends KBN.Shop
{
	private var purchasedId:int;
	private	var itemcost:int;
	private var mayDropGear:boolean;
	
	var    bHaveData:boolean;
	var  selectedList:int = 0;
	var  updateShop:boolean;
	
	private static var m_defaultSelTabID : int = 0;

	public static function instance() : Shop
	{
		if( singleton == null ){
			singleton = new Shop();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
			(singleton as Shop).updateShop = true;
		}

		return singleton as Shop;
	}
	
	public function get DefaultSelTabID() : int
	{
		return m_defaultSelTabID;
	}

	public function getShopData(_callBackFunc:Function):void
	{
		getShopData(_callBackFunc, false);
	}
	
	public function getShopData(_callBackFunc:Function, forceNoConnectMenu:boolean):void
	{
		if(updateShop)
		{	
			callBackFunc = _callBackFunc;
			UnityNet.GetInventoryList(successGetShopData, null, forceNoConnectMenu);
		}
		else
		{
			if(_callBackFunc)
			{
				_callBackFunc();
			}
		}
	}
	
	private static var bDiscount:boolean[] = [false, false, false, false, false, false, false, false, false, false];
	private var callBackFunc:Function;
	
	public function HasDiscountItem(_type:int):boolean
	{
		//booleanreturn bDiscount[type - 1];
		var hasDiscount:boolean = false;
		var array:Array = getArrayByType(_type);
		var curTime:long = GameMain.instance().unixtime();
						
		if(array != null)
		{
			var hash:Hashtable;
			for(var a:int = 0; a < array.length; a ++)
			{
				hash = array[a] as Hashtable;
				if(_Global.INT32(hash["price"]) != _Global.INT32(hash["salePrice"]) 
				   && curTime > _Global.INT64(hash["startTime"]) 
				   && curTime < (_Global.INT64(hash["endTime"]) - 30) 
				   && _Global.INT32(hash["isShow"]) > 0)
				{
					hasDiscount = true;
					break;
				}
			}
		}
		
		return hasDiscount;					
	}
	
	public function setDiscountArray(_type:int ,result:boolean)
	{
		bDiscount[_type] = result;
	}
	
	public function getItem(_type:int, _id:int):Hashtable
	{
		var array:Array = getArrayByType(_type);
		var item:Hashtable;
		
		if(array)
		{
			var hash:Hashtable;
			for(var a:int = 0; a < array.length; a ++)
			{
				hash = array[a] as Hashtable;
				if(hash["ID"] == _id)
				{
					item = hash;
					break;
				}
			}		
		}		
						
		if(item == null)
		{
			var price:int = 0;
			if((Datas.instance().itemlist())["i" + _id] != null && (Datas.instance().itemlist())["i" + _id]["price"] != null)
			{
				price = _Global.INT32((Datas.instance().itemlist())["i" + _id]["price"]);	
			}
			 	
			item = {"price":price, "salePrice":price, "startTime":0, "endTime":0 ,"isShow":0};
		}
		
		return item;
	}
	
	public function itemExistInShop(_type:int, _id:int):boolean
	{
		var array:Array = getArrayByType(_type);
		
		if(array)
		{
			var hash:Hashtable;
			for(var a:int = 0; a < array.length; a ++)
			{
				hash = array[a] as Hashtable;
				if(hash["ID"] == _id)
				{
					return true;
				}
			}		
		}	
		
		return false;								
	}
	
	public function getArrayByType(type : int) : Array
	{
		var array:Array;
		
		switch(type)
		{
			case SPEEDUP:
				array = dataSpeed;
				break;
			case GENERAL:
				array = dataGeneral;
				break;
			case ATTACK:
				array = dataAttack;
				break;
			case PRODUCT:
				array = dataProduct;
				break;
			case CHEST:
				array = dataChest;
				break;
			case BUFF:
				array = dataBuff;
				break;
			case TROOPS:
				array = dataTroops;
				break;
			case GEAR:
				array = dataGear;
				break;
			case HERO:
				array = dataHero;
				break;
			case EXCHANGE:
				array = dataExchange;
			case CITY_SKIN_PROP:
				array = dataCitySkinProp;
				break;
			case PIECE:
				array = dataPiece;
				break;
		}
		
		return array;
	}
	
	public function getPriceOfItem(_type:int, _id:int, origin:boolean):int
	{
		var array : Array = getArrayByType(_type);
		var price : int = 0;

		if(array)
		{
			var item:Hashtable;
			for(var a:int = 0; a < array.length; a ++)
			{
				item = array[a] as Hashtable;
				if(item["ID"] == _id)
				{
					if(origin)
						price = item["price"];
					else if(item["salePrice"])
						price = item["salePrice"];	
					break;
				}
			}
		}
		if(price == 0)
		{
			price = _Global.INT32( (Datas.instance().itemlist())["i" + _id]["price"] );
		}		
		return price;
	}
	public function getPriceOfItem(_type:int, _id:int):int
	{
		return getPriceOfItem(_type, _id, false);
	}
	public var dataSpeed:Array;
	public var dataGeneral:Array;
	public var dataAttack:Array;
	public var dataProduct:Array;
	public var dataChest:Array;
	public var dataPiece:Array;
	public var dataBuff:Array;
	public var dataTroops:Array;
	public var dataGear:Array;
	public var dataHero:Array;
	public var dataExchange:Array;
	public var dataCitySkinProp: Array;


	private function successGetShopData(result:HashObject):void
	{
		if (!result["ok"].Value) 
			return;
		bHaveData = true;
		var	priorityItemIds = [ // this will always be put first
			//			599, // gamble token
						10018,
						10019
					];
		bDiscount = [false, false, false, false, false];	
		var	items:HashObject = result["data"]["shopOrder"];
		var	featuredOrder = result["data"]["featuredOrder"];
		var	featuredInfo = result["data"]["featureInfo"];
		var	gearItems = result["data"]["gearItems"];

		var focusTabStr : HashObject = result["data"]["focusTab"];
		m_defaultSelTabID = _Global.INT32(focusTabStr);

		dataSpeed = new Array();
		dataGeneral = new Array();
		dataAttack = new Array();
		dataProduct = new Array();
		dataChest = new Array();
		dataPiece = new Array();
		dataBuff = new Array();
		dataTroops = new Array();
		dataGear = new Array();
		dataHero = new Array();
		dataExchange = new Array();
		dataCitySkinProp = new Array();

		MystryChest.instance().AddLoadMystryChestCallback(priv_RecvMystryChestOK);

		var seed:HashObject = GameMain.instance().getSeed();
		var itemValues:Array = _Global.GetObjectValues(items);
		var itemCnt:int = itemValues.length;
		
		var i:int = 0;
		var curTime:long = GameMain.instance().unixtime();

		for( i = 0; i < itemCnt; i++)
		{	
			var itemId:int = _Global.INT32( items[_Global.ap + i]["itemId"] );
			var item:HashObject = (Datas.instance().itemlist())["i" + itemId];
			
			if(item == null || item["category"] == null || item["price"] == null)
			{
				continue;
			}
			
			var price:int = items[_Global.ap + i]["origPrice"].Value;
			var	salePrice:int = featuredInfo["i"+itemId] != null ? _Global.INT32(featuredInfo["i"+itemId]["price"].Value):price;
			var startTime:long = featuredInfo["i"+itemId] != null?_Global.INT32(featuredInfo["i"+itemId]["startTime"].Value):0;
			var endTime:long = featuredInfo["i"+itemId] != null ?_Global.INT32(featuredInfo["i"+itemId]["endTime"].Value):0;
			
			var isShow:int = 1;
			if(featuredInfo["i"+itemId] != null && featuredInfo["i"+itemId]["isShow"] != null)
			{
				isShow = _Global.INT32(featuredInfo["i"+itemId.ToString()]["isShow"].Value);
			}
			
			// LiHaojie 2013.09.22: add gear node
			var tMayDropGear:boolean = false;
			if (gearItems != null && null != gearItems["i" + itemId])
				tMayDropGear = true;

			var newItem:Hashtable  = {
				"ID":itemId,
				"salePrice":salePrice,
				"price":price,
				"Count":seed["items"]["i" + itemId] ? _Global.INT32(seed["items"]["i" + itemId]) :0, 
				"Category":_Global.INT32(item["category"]),
				"startTime":startTime,
				"endTime":endTime,
				"isShow":isShow,
				"tMayDropGear":tMayDropGear
			};

			var  category:int = item["category"].Value;
			var  bFeatured:boolean = false;
			for(var j:int =0; j<priorityItemIds.length; j++)
			{
				if(priorityItemIds[j] == itemId)
				{
					bFeatured = true;
					break;
				}
			}

			if(price != salePrice && curTime > startTime && curTime < endTime && isShow > 0)
			{			
				if( category >= 1 && category <= 5 )
				{
					bDiscount[category - 1] = true;
				}
				else
				{
					bDiscount[0] = true;
				}				
			}
			
			switch (category) 
			{
				case GENERAL:
						if (bFeatured) 
						{
							//newItem.Destroy(); //generalList.unshift(newItem);
						} 
						else 
						{
							dataGeneral.Push(newItem);
						}
						break;
				case SPEEDUP:
						dataSpeed.Push(newItem);
						break;
				case ATTACK:
						dataAttack.Push(newItem);
						break;
				case PRODUCT:
						dataProduct.Push(newItem);
						break;
				case CHEST:
						if (bFeatured) 
						{
							//chestList.AddItem(newItem);//chestList.unshift(newItem);
						} 
						else 
						{
							dataChest.Push(newItem);
						}
						break;
				case BUFF:
						dataBuff.Push(newItem);
						break;
				case TROOPS:
						dataTroops.Push(newItem);
						break;
				case GEAR:
						dataGear.Push(newItem);
						break;
				case HERO:
						dataHero.Push(newItem);
						break;
				case EXCHANGE:
						dataExchange.Push(newItem);
						break;
				case PIECE:
						dataPiece.Push(newItem);
					break;
				case CITY_SKIN_PROP:
					dataCitySkinProp.Push(newItem);
					break;
				default:
						dataGeneral.Push(newItem);
			}
		}
		
		orderChestData();
		
		updateShop = false;
		
		if(callBackFunc)
		{
			callBackFunc();
		}		
	}
	
	private function priv_RecvMystryChestOK() : void
	{
		var mystryChestTmpArray : Array = new Array();
		var mystryChests:System.Collections.Generic.IEnumerable.<Hashtable> = MystryChest.instance().ChestList;
		var curTime:long = GameMain.instance().unixtime();
		for ( var chestItem : Hashtable in mystryChests )
		{
			var mysStartTime:long = chestItem["startTime"];
			var mysEndTime:long = chestItem["endTime"];
			
			var mysSaleStartTime:long = chestItem["discountStartTime"];
			var mysSaleEndTime:long = chestItem["discountEndTime"];		
			
			if( (mysStartTime != 0 && curTime < mysStartTime) || ( mysEndTime!=0 && curTime > mysEndTime) )
				continue;
			if(chestItem["price"] != chestItem["salePrice"] && chestItem["salePrice"] != 0)	//discount..
			{
				if((mysSaleStartTime != 0 && curTime > mysSaleStartTime) && ( mysSaleEndTime!=0 && curTime < mysSaleEndTime))
					bDiscount[MyItems.Category.Chest - 1] = true;	//as chest..
			}
			mystryChestTmpArray.Push(chestItem);
		}

		for (var chest in dataChest)
			mystryChestTmpArray.Push(chest);
		dataChest = mystryChestTmpArray;
		orderChestData();
		
 		MyItems.instance().dealExchangeItem();
	}
	
	private function orderChestData():void
	{
		var mChestOrder:Array = MystryChest.instance().ChestOrder;
		if ( mChestOrder == null )
			return;
		var dataChestCopy:Array = new Array();

		var newItem:Hashtable;
		for(var a:int = 0; a < mChestOrder.length; a ++)
		{
			var mChestId:int = mChestOrder[a];
			
			for(var b:int = 0; b < dataChest.length; b++)
			{
				newItem = dataChest[b] as Hashtable;
				
				if(newItem["ID"] == mChestId)
				{
					dataChestCopy.Push(newItem);
					dataChest.Remove(newItem);
					
					break;
				}
			}
		}	
		
		for(var c:int = 0; c < dataChest.length; c++)
		{
			newItem = dataChest[c] as Hashtable;
			dataChestCopy.Push(newItem);
		}
		
		dataChest = dataChestCopy;
	}	
	
	function CannotGetList(result:Object, errorCode:int)
	{
	}
	
	public function BuyInventory(itemId : int, price : int, buyCount : int, inMayDropGear : boolean)
	{
		BuyInventory(itemId, price, buyCount, inMayDropGear, null);
	}
	
	public function BuyInventory(itemId : int, price : int, buyCount : int, inMayDropGear : boolean, successOK : System.Action)
	{	
		//var data:Hashtable = param as Hashtable;
		//var itemId:int = _Global.INT32(data["iid"]);
		if (!Payment.instance().CheckGems(price))
			return;
		//	var itemcost = salePrice ? _Global.INT32(salePrice, 10) : itemlist['i' + itemId].price,
		itemcost = price;
		UnityNet.BuyInventory(itemId, buyCount, function(result:HashObject){
				BuySucess(result, buyCount);
				if( successOK != null )
					successOK();
			}, null);

		purchasedId = itemId;
		mayDropGear = inMayDropGear;
	}
	
	private	function BuySucess(result:HashObject, itemCnt : int)
	{	
		var seed:HashObject = GameMain.instance().getSeed();
		var isReal:boolean = false;
		if(result["isWorldGem"] != null)
		{
			isReal = result["isWorldGem"].Value;
		}
		
		Payment.instance().SubtractGems(itemcost,isReal);
		
		// update seed items and shop item displays
		if (mayDropGear)
		{
			MyItems.instance().AddItemDropGear(purchasedId, itemCnt, true);
		}
		else if (purchasedId>4201&&purchasedId<=4210)
		{
			MyItems.instance().AddItem(4201, _Global.INT32(result["amount"]));
		}else
		{
			MyItems.instance().AddItem(purchasedId, itemCnt);
		}
		
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.BuySuccess"));

	}
	
	/*
	 buys something without triggering any chrome, for buy and use cases
	 synchronous (waits until finished)
	 returns true or false depending on success
	*/
	public	function	swiftBuy(itemId:int, buyCallback:System.Action) {
		/*
		var seed:HashObject = GameMain.instance().getSeed();
		var currentCount:int = 0;
		if( seed["items"]["i" + itemId] ){
			currentCount = _Global.INT32(seed["items"]["i" + itemId]);
		}
		*/

		var price: int = getCurPriceOfItem(_Global.INT32(Datas.instance().itemlist()["i" + itemId]["category"]), itemId);
		//_Global.INT32(Datas.instance().itemlist()["i" + itemId]["price"]);
		
		if (Payment.instance().CheckGems(price)) {
			var okFunc: Function = function (result: HashObject) {
				_Global.Log("shop swiftBuy price:" + price);

				var isReal: boolean = result["isWorldGem"] ? result["isWorldGem"].Value == false : true;
				Payment.instance().SubtractGems(price, isReal);

				MyItems.instance().AddItem(itemId);
				buyCallback();
			};

			UnityNet.BuyInventory(itemId, 1, okFunc, null);
		}
	}

	/********************************************************************* 城堡皮肤的道具购买接口 *******************************************************************/
	public function swiftCitySkinPropBuy(citySkinPropId: int, buyCnt: int, buyCallback: Function, errorFunc: Function) {
	 
		var price: int = getCurPriceOfItem(_Global.INT32(Datas.instance().itemlist()["i" + citySkinPropId]["category"]), citySkinPropId);

		if (Payment.instance().CheckGems(price)) {
			var okFunc: Function = function (result: HashObject) {
				_Global.Log("cityskin prop  swiftBuy price:" + price);

				var isReal: boolean = result["isWorldGem"] ? result["isWorldGem"].Value == false : true;
				Payment.instance().SubtractGems(price, isReal);

				buyCallback(result);
			};


			var cityId: int = GameMain.instance().getCurCityId();
			UnityNet.reqCityReplaceSkinBuySkinProp(cityId, citySkinPropId, buyCnt, okFunc, errorFunc);

			/*UnityNet.BuyInventory(itemId, 1, okFunc, null);*/

		}
	}
	/**********************************************************************************************************************************************************/


	public function getCurPriceOfItem(_type:int, _id:int):int
	{
		var array:Array = getArrayByType(_type);
		var price:int = 0;
		
		if(array)
		{
			var item:Hashtable;
			for(var a:int = 0; a < array.length; a ++)
			{
				item = array[a] as Hashtable;
				if(item["ID"] == _id)
				{
					price = item["price"];
					if(item["price"] != item["salePrice"])
					{
						var curTime:long =	GameMain.unixtime();
						if(curTime >= _Global.INT64(item["startTime"]) && curTime <= _Global.INT64(item["endTime"]))
						{
							price = item["salePrice"];
						}
					}
				}
			}
		}
		if(price == 0)
		{
			price = _Global.INT32( (Datas.instance().itemlist())["i" + _id]["price"] );
		}
				
		return price;
	}
	
	public	function	buyNotEnough(){
	}
	
	public function IsInShopList(itemId:int):boolean
	{
		if (-1 == itemId) return false;
		
		var isInShop:boolean = false;
		var typeArray:int[] = [Shop.SPEEDUP, Shop.GENERAL, Shop.ATTACK, Shop.PRODUCT, Shop.CHEST, Shop.PIECE];
		
		for (var i:int = 0; i < typeArray.Length; i++)
		{
			isInShop = Shop.instance().itemExistInShop(typeArray[i], itemId);
			if (isInShop)
			{
				break;
			}
		}
		
		return isInShop;
	}
}
