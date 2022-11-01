
class MystryChest extends KBN.MystryChest
{
	//private var chestOrder:Array;
	private var configData : HashObject;
	//private var onSaleList:Array = new Array();

	private var m_thread : System.Threading.Thread;
	private var m_resultFromThread : HashObject = null;
	//private var m_isLoadOK : boolean = false;
	//private var m_mstryChestLoadedType : int = -1;
	
	private var m_funcLoadOK : System.Collections.Generic.List.<function()> = new System.Collections.Generic.List.<function()>();

	private var m_loadByJson : boolean = false;
	
	public function get DataType()
	{
		return m_loadByJson?1:0;
	}
	
	public function set DataType(value : int)
	{
		m_loadByJson = value?true:false;
	}

	public	static	function	instance(){
		if( singleton == null ){
			singleton = new MystryChest();
            GameMain.instance().resgisterRestartFunc(function() {
                singleton = null;
            });
		}
		
        var ret : MystryChest = singleton as MystryChest;
        if ( ret.m_loadByJson )
        {
			var dat : HashObject = ret.m_resultFromThread;
			if ( dat != null && ret.m_thread != null && ret.m_thread.Join(0) )
			{
				ret.m_thread = null;
				ret.getConfigOk(dat);
				ret.m_resultFromThread = null;
			}
		}
		else
		{
			ret.prot_checkForPBFuncLoad();
		}

		return ret;
	}

	public function InitWithAsync() : void
	{
		if ( m_mstryChestLoadedType != EnumLoadType.AsyncLoad )
			return;
		if ( m_loadByJson )
			this.priv_reqMystryChestConfig();
		else
			super.InitWithAsync();
	}
	
	public function InitWithSync() : void
	{
		if ( m_mstryChestLoadedType != EnumLoadType.SyncLoad )
			return;
		if ( m_loadByJson )
			UnityNet.ReqMystryChestConfig(getConfigOk, null);
		else
			super.InitWithSync();
	}

	//public function get IsLoadFinish() : boolean
	//{
	//	return m_isLoadOK;
	//}
	
	//public function AddLoadMystryChestCallback(proc : function())
	//{
	//	if ( m_isLoadOK )
	//	{
	//		proc();
	//		return;
	//	}
	//	
	//	m_funcLoadOK.Add(proc);
	//}
	
	private function priv_reqMystryChestConfig() : void
	{
		var url:String = "getMysteryChestList.php";
		var language:String = Datas.instance().getGameLanguageAb();
		var form:WWWForm = new WWWForm();
		form.AddField("lang",language);
		UnityNet.DoRequestRaw(url, form, priv_onRecvMystryChestString, null);
	}

	private function priv_onRecvMystryChestString(dat : String) : HashObject
	{
		var td : System.Threading.Thread = new System.Threading.Thread(this.priv_transDat);
		td.Start(dat);
		m_thread = td;
		return null;
	}
	
	private function priv_transDat(dat : String) : void
	{
		var startTimeInMain : System.DateTime = System.DateTime.Now;
		_Global.Log("priv_transDat : Begin");
		var temp:String = UnityNet.DESDeCode_AES(dat,null);
		m_resultFromThread = JSONParse.ParseStatic(temp);
		var timeSpan : System.TimeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("priv_transDat : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
	}
	private var version:String;
	function getConfigOk(result:HashObject)
	{
		var datTime : System.DateTime = System.DateTime.Now;
		var version:String=result["version"].Value.ToString();
		if(version==PlayerPrefs.GetString("MystryChestData_version_"+KBN.Datas.singleton.worldid(),"0")){
			configData=JSONParse.defaultInst().Parse(PlayerPrefs.GetString("MystryChestData_data_"+KBN.Datas.singleton.worldid(),''));
			CreatOnSaleList(configData);
			createLevelLimitChest(JSONParse.defaultInst().Parse(PlayerPrefs.GetString("MystryChestData_ldata_"+KBN.Datas.singleton.worldid(),'')));
			createMChestOrder(JSONParse.defaultInst().Parse(PlayerPrefs.GetString("MystryChestData_order_"+KBN.Datas.singleton.worldid(),'')));
		}else{
			configData = result["data"];		
			CreatOnSaleList(configData);
			createLevelLimitChest(result["ldata"]);
			createMChestOrder(result["order"]);

			PlayerPrefs.SetString("MystryChestData_data_"+KBN.Datas.singleton.worldid(),result["data"].ToString());
			PlayerPrefs.SetString("MystryChestData_ldata_"+KBN.Datas.singleton.worldid(),result["ldata"].ToString());
			PlayerPrefs.SetString("MystryChestData_order_"+KBN.Datas.singleton.worldid(),result["order"].ToString());

			PlayerPrefs.SetString("MystryChestData_version_"+KBN.Datas.singleton.worldid(),result["version"].Value.ToString());			
		}
		
		Flags.instance().MYSTRY_CHEST_CONFIG = true;
		m_isLoadOK = true;
		priv_invokeFuncOnLoadOK();
		//for ( var func in m_funcLoadOK )
		//	func();
		//m_funcLoadOK.Clear();
	}
	
	private function createMChestOrder(data:HashObject):void
	{
		var chestOrderTmp : Array = new Array();
		
		if(data == null)
		{
			return;
		}
		
		var orderArr:Array = _Global.GetObjectValues(data);
		var orderObj:HashObject;
		for(var a:int = 0; a < orderArr.length; a ++)
		{
			orderObj = data[_Global.ap + a] as HashObject;
			chestOrderTmp.Push(_Global.INT32(orderObj.Value));
		}
		chestOrder = chestOrderTmp.ToBuiltin(typeof(int));
	}
	
	//public function get getChestOrder():Array
	//{
	//	return chestOrder;
	//}
	
	private function createLevelLimitChest(data:HashObject):void
	{
		if(data != null)
		{
			levelLimitChestHash.Clear();
			var chests:Array = _Global.GetObjectKeys(data);
			
			var hashObj:HashObject;
			var levelLimitchest:LevelLimitChest;
			for(var a:int = 0; a < chests.length; a ++)
			{
				hashObj = data[chests[a]] as HashObject;
				levelLimitchest = new LevelLimitChest();
				levelLimitchest.id = _Global.INT32(chests[a]+"");
				levelLimitchest.levelLimit = _Global.INT32(hashObj["level"].Value);
				levelLimitchest.textureName = hashObj["icon"].Value as String;
				
				//levelLimitchest.name = Datas.getArString("Common.LevelChestName", [levelLimitchest.levelLimit]);
				//levelLimitchest.des = Datas.getArString("Common.LevelChestDesc", [levelLimitchest.levelLimit]);
								
				levelLimitChestHash.Add(levelLimitchest.id, levelLimitchest);
			}
		}
	} 
	
	function CreatOnSaleList(configData : HashObject)
	{
		var idList:Array = _Global.GetObjectKeys(configData);
		var curWorld:int = Datas.instance().worldid() ;
		//onSaleList.Clear();
		m_forSalesId = new System.Collections.Generic.HashSet.<int>();
		//m_forSalesId.Clear();
		idList.Sort(function(a:Object,b:Object){
			
			var id1:int  = (a as String).IndexOf('i') == 0?_Global.INT32((a as String).Split('i'[0])[1]):_Global.INT32(a);
			var id2:int  = (b as String).IndexOf('i') == 0?_Global.INT32((b as String).Split('i'[0])[1]):_Global.INT32(b);
			return id2 - id1;
		});
		for(var i:int; i < idList.length; i++)
		{
			var item:HashObject = configData[ idList[i] ] as HashObject;
			if(_Global.INT32(item["forSale"]) == 0)
				continue;
			var id:int = _Global.INT32(idList[i]);
			var worlds:HashObject = item["serverId"];
			var onSale:boolean = false;
			var j:int = 0;
			while(worlds[_Global.ap + j] != null)
			{
				if(_Global.INT32( worlds[_Global.ap + j] )== curWorld || _Global.INT32( worlds[_Global.ap + j] ) == 0 )
				{
					onSale = true;
					break;
				}
				j++;
			}
			
			if(!onSale)
				continue;

			var price:int = _Global.INT32(item["price"]);	
			var salePrice:int = _Global.INT32(item["discountPrice"]) == 0?price:_Global.INT32(item["discountPrice"]);
			var startTime:long = _Global.INT64(item["starttime"]);
			var endTime:long = _Global.INT64(item["finishtime"]);
			var discountStartTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountStarttime"]); 
			var discountEndTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountFinishtime"]); 
			var isExchange:int = _Global.INT32(item["isExchange"]);
			
			var newItem:Hashtable  = {
				"ID":id,
				"salePrice":salePrice,
				"price":price,
				"Count":0, 
				"Category":MyItems.Category.MystryChest,
				"startTime":startTime,
				"endTime":endTime,
				"discountStartTime":discountStartTime,
				"discountEndTime":discountEndTime,
				"isShow":1,
				"isExchange":isExchange
			};	
			//check startTime && finishTime 
			//onSaleList.Push(newItem);
			m_forSalesId.Add(id);
		}
	}
	
	public function GetChestItemData(id:int):Hashtable
	{
		if ( !m_loadByJson )
			return super.GetChestItemData(id);
		// var curWorld:int = Datas.instance().worldid() ;
		
		var item:HashObject = configData[id.ToString()] as HashObject;
		var worlds:HashObject = item["serverId"];

		var price:int = _Global.INT32(item["price"]);	
		var salePrice:int = _Global.INT32(item["discountPrice"]) == 0?price:_Global.INT32(item["discountPrice"]);
		var startTime:long = _Global.INT64(item["starttime"]);
		var endTime:long = _Global.INT64(item["finishtime"]);
		var discountStartTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountStarttime"]); 
		var discountEndTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountFinishtime"]); 
		var isExchange:int = _Global.INT32(item["isExchange"]);

		var newItem:Hashtable  = {
			"ID":id,
			"salePrice":salePrice,
			"price":price,
			"Count":0, 
			"Category":MyItems.Category.MystryChest,
			"startTime":startTime,
			"endTime":endTime,
			"discountStartTime":discountStartTime,
			"discountEndTime":discountEndTime,
			"isShow":1,
			"isExchange":isExchange
		};	

		return newItem;
	}


	public function IsMystryChest(id:int):boolean
	{
		if ( !m_loadByJson )
			return super.IsMystryChest(id);

		if(configData == null)
			return false;
			
		if(IsExchangeChest(id))
		{
			return false;
		}
		return configData[id.ToString()] != null;
	}
	
	public function get ChestList() : System.Collections.Generic.IEnumerable.<Hashtable>
	{
		if ( !m_loadByJson )
		{
			for ( var itemInChestList : Hashtable in super.ChestList )
				yield itemInChestList;
		}
		else
		{
			for (var itemId : int in m_forSalesId )
			{
				var item : HashObject = configData[itemId.ToString()];
				if ( item == null )
					continue;
				var price:int = _Global.INT32(item["price"]);	
				var salePrice:int = _Global.INT32(item["discountPrice"]) == 0?price:_Global.INT32(item["discountPrice"]);
				var startTime:long = _Global.INT64(item["starttime"]);
				var endTime:long = _Global.INT64(item["finishtime"]);
				var discountStartTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountStarttime"]); 
				var discountEndTime:long = _Global.INT64(item["discountPrice"]) == 0?0:_Global.INT64(item["discountFinishtime"]); 
				var isExchange:int = _Global.INT32(item["isExchange"]);
				
				var newItem:Hashtable  = {
					"ID":itemId,
					"salePrice":salePrice,
					"price":price,
					"Count":0, 
					"Category":MyItems.Category.MystryChest,
					"startTime":startTime,
					"endTime":endTime,
					"discountStartTime":discountStartTime,
					"discountEndTime":discountEndTime,
					"isShow":1,
					"isExchange":isExchange
				};
				yield newItem;
			}
		}
	}
	
	public function IsExchangeChest(id : int) : boolean
	{
		if ( !m_loadByJson )
			return super.IsExchangeChest(id);
		if(configData == null)
			return false;
		var item : HashObject = configData[id.ToString()];
		if ( item == null )
			return false;
		if(item["isExchange"] == null)
		{
			return false;
		}
		return (_Global.INT32(item["isExchange"]) == 1);
	}
	
	public function GetChestImage(id : int) : String
	{
		if ( !m_loadByJson )
			return super.GetChestImage(id);

		var item : HashObject = configData[id.ToString()];
		if ( item == null )
			return "";
		return _Global.GetString(item["icon"]);
	}

	public function GetChestItemRawData(id : int) : PBData.PBMsgResMystryChest.ChestData
	{
		if ( !m_loadByJson )
			return super.GetChestItemRawData(id);
		return priv_castToMystryChestData(id);
	}

	private function priv_castToMystryChestData(id : int) : PBData.PBMsgResMystryChest.ChestData
	{
		var item : HashObject = configData[id.ToString()];
		if ( item == null )
			return null;
		var discountPrice : int = _Global.INT32(item["discountPrice"]);
		var price:int = _Global.INT32(item["price"]);	
		var salePrice:int = _Global.INT32(item["discountPrice"]) == 0?price:_Global.INT32(item["discountPrice"]);
		var startTime:long = _Global.INT64(item["starttime"]);
		var endTime:long = _Global.INT64(item["finishtime"]);
		var discountStartTime:long = discountPrice==0?0:_Global.INT64(item["discountStarttime"]); 
		var discountEndTime:long = discountPrice==0?0:_Global.INT64(item["discountFinishtime"]); 
		var isExchange:int = _Global.INT32(item["isExchange"]);

		var gearDrop : System.Collections.Generic.List.<int> = priv_getKeyIntArray(item["dropGear"]);
		var serverIds : System.Collections.Generic.List.<int> = priv_getArray(item["serverId"]);

		var data : PBData.PBMsgResMystryChest.ChestData = new PBData.PBMsgResMystryChest.ChestData();
		data.id = id;
		data.icon = _Global.GetString(item["icon"]);
		data.starttime = startTime;
		data.finishtime = endTime;
		data.price = price;
		data.forSale = _Global.INT32(item["forSale"]) != 0;
		data.discountStarttime = discountStartTime;
		data.discountFinishtime = discountEndTime;
		data.discountPrice = discountPrice;
		data.isExchange = isExchange;
		if ( gearDrop != null )
			data.gearDrop.AddRange(gearDrop);
		if ( serverIds != null )
			data.serverId.AddRange(serverIds);
		return data;
	}

	private function priv_getArray(item : HashObject) : System.Collections.Generic.List.<int>
	{
		if ( item == null )
			return null;

		var datList : System.Collections.Generic.List.<int> = new System.Collections.Generic.List.<int>();
		for ( var itemIdObj : HashObject in _Global.GetObjectValues(item) )
		{
			var valDat : int = _Global.INT32(itemIdObj);
			datList.Add(valDat);
		}
		
		return datList;
	}

	private function priv_getKeyIntArray(item : HashObject) : System.Collections.Generic.List.<int>
	{
		if ( item == null )
			return null;

		var datList : System.Collections.Generic.List.<int> = new System.Collections.Generic.List.<int>();
		for ( var itemIdObj : String in _Global.GetObjectKeys(item) )
		{
			var keyDat : int = _Global.INT32(itemIdObj);
			datList.Add(keyDat);
		}

		return datList;
	}
}
