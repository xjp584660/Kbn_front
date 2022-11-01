class Treasure
{	
	private static var instance:Treasure;
	private var curChestId:int;
	private var curMarchId:int;
	private var curCityId:int;
	private var curCallBack:Function;
	private var curCrestMap:HashObject;

	public static function getInstance():Treasure
	{
		if(instance == null)
		{
			instance = new Treasure();
		}
		
		return instance;
	}
	
	public function get chestId():int
	{
		return curChestId;
	}
	
	public function get crestDescription():HashObject
	{
		return curCrestMap;
	}

	public function openTreasureChest(chestId:int, callBack:Function):void
	{
		openTreasureChest(chestId, 0, callBack);
	}
	
	public function openTreasurePopmenu(marchId:int, cityId:int, chestId:int, callBack:Function):void
	{
		curChestId = chestId;
		curMarchId = marchId;
		curCityId = cityId;
		curCallBack = callBack;
	
		if(Shop.instance().updateShop)
		{
			Shop.instance().getShopData(GetTreasureList);
		}
		else
		{
			GetTreasureList();
		}
	}	
								
	private function GetTreasureList():void							
	{
		var idArr:Array = getValidStakeIds();
		var ids:String = idArr.join(",");

		getStakeDescription(curChestId, ids);
	}
	
	private function getValidStakeIds():Array
	{
		var items:Array = Shop.instance().dataProduct;
		var arr:Array = new Array();
		var arr1:Array = new Array();
		var imageName:String;
		
		var tempItem:Hashtable;
		var id:int;
		for(var a:int = 0; a < items.length; a++)
		{
			tempItem = items[a] as Hashtable;
			id = _Global.INT32(tempItem["ID"]);
			if(id > 3000 && id < 3100)
			{
				arr.Push(id);
			}		
		}

		for(a = 0; a < arr.length; a++)
		{
			id = arr[a];
			imageName = TextureMgr.instance().LoadTileNameOfItem(id);
			
			if(TextureMgr.instance().ItemSpt().IsTileExist(imageName))
			{
				arr1.Push(id);
			}
		}
		
		return arr1;			
	}
						
	public function openTreasureChest(chestId:int, itemId:int, callBack:Function):void
	{
		var params:Array = new Array();
		params.Add(chestId);
		params.Add(itemId);	
		params.Add(curMarchId);
		params.Add(curCityId);	
		
		var ok:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				if(curMarchId > 0 && curCallBack != null)
				{
					curCallBack(curMarchId, curCityId);
				}			
			
				MyItems.instance().substractTreasureChest(chestId, 1);				
				
				if(itemId != 0)
				{
					MyItems.instance().subtractItem(itemId);
				}
				
				var items:HashObject = result["items"];
				var arr:Array = _Global.GetObjectKeys(items);
				var item:HashObject;
				var itemArr:Array = new Array();
				var id:int;
				var num:int;
				
				for(var a:int =0; a < arr.length; a++)
				{
					item = items[_Global.ap + a] as HashObject;	
					id = _Global.INT32(item["itemId"].Value);
					num = _Global.INT32(item["count"].Value);
					MyItems.instance().AddItem(id, num);
					
					itemArr.Push(item);										
				}

				if(callBack != null)
				{
					callBack(itemArr);
				}
				
				MenuMgr.getInstance().sendNotification("updateTreasureItems", null);
			}
		};
		
		UnityNet.reqOpenTreasureChest(params, ok, null);		
	}
	
	public function getStakeDescription(chestId:int, stakeIds:String):void
	{
		var params:Array = new Array();
		
		params.Add(chestId);
		params.Add(stakeIds);	
			
		var ok:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				curCrestMap = result["crestMap"] as HashObject;
				MenuMgr.getInstance().PushMenu("TreasurePopmenu", null, "trans_zoomComp");
			}
		};
		
		UnityNet.reqGetStakeDescription(params, ok, null);		
	}
}