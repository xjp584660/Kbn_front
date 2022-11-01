
class	GenExpBoostMenu extends	PopMenu{
	public var lineLabel:Label;
	public	var	listView:ScrollList;
	public	var	genExpBoostItem:GenExpBoostItem;
	
	private var hash:Hashtable;
	
	private	var	itemIds:int[]=[361, 362, 363];
	
	private var generalLevelUp1Start = 2201;
	private var generalLevelUp1End = 2210;
	private var generalLevelUp1CompareMinus = 2200;
	
	private var generalLevelItemMinId = 2300;
	private var generalLevelItemMaxId = 2350;
	private var generalLevelCompareMinus = 2100;
	
	
	//over level 270
	private var generalLevelUp270Start:int;
	private var generalLevelUp270End:int;
	private var generalLevel270ItemMinId:int;
	private var generalLevel270ItemMaxId:int;
	function Init()
	{
		InitParamsFromSeed();
		super.Init();
		listView.Init(genExpBoostItem);
		title.txt = Datas.getArString("Generals.Experience");
	}
	
	private function InitParamsFromSeed() {
		var serverSetting : HashObject = GameMain.instance().getSeed()["serverSetting"];
		if (serverSetting == null) {
			return;
		}
		var generalLevelUpItemSetting : HashObject = serverSetting["generalLevelUpItems"];
		if (generalLevelUpItemSetting == null) {
			return;
		}
		
		var oneLevel : HashObject = generalLevelUpItemSetting["oneLevel"];
		if (oneLevel != null
				&& oneLevel["baseMin"] != null
				&& oneLevel["baseMax"] != null
				&& oneLevel["compareMinus"] != null) {
			generalLevelUp1Start = _Global.INT32(oneLevel["baseMin"]);
			generalLevelUp1End = _Global.INT32(oneLevel["baseMax"]);
			generalLevelUp1CompareMinus = _Global.INT32(oneLevel["compareMinus"]);
		}
		
		var toLevel : HashObject = generalLevelUpItemSetting["toLevel"];
		if (toLevel != null
				&& toLevel["baseMin"] != null
				&& toLevel["baseMax"] != null
				&& toLevel["compareMinus"] != null) {
			generalLevelItemMinId = _Global.INT32(toLevel["baseMin"]);
			generalLevelItemMaxId = _Global.INT32(toLevel["baseMax"]);
			generalLevelCompareMinus = _Global.INT32(toLevel["compareMinus"]);
		}
		
		generalLevelUp270Start = _Global.INT32(serverSetting["generalLevelUpItems"]["over270OneLevel"]["baseMin"]);
		generalLevelUp270End = _Global.INT32(serverSetting["generalLevelUpItems"]["over270OneLevel"]["baseMax"]);
		generalLevel270ItemMinId = _Global.INT32(serverSetting["generalLevelUpItems"]["over270ToLevel"]["baseMin"]);
		generalLevel270ItemMaxId = _Global.INT32(serverSetting["generalLevelUpItems"]["over270ToLevel"]["baseMax"]);
	}
	
	public function DrawItem()
	{
		
		lineLabel.Draw();
		listView.Draw();
	}
	
	public	function	Update(){
		listView.Update();
	}
	
	//p:{kid}
	private function resetDisplay():void
	{
		var	listData:Array = new Array();
		var	count:int = 0;
		var itemlist:HashObject = Datas.instance().itemlist();
		var item:Hashtable;
		
		for( var i:int = 0; i < itemIds.length; i ++ )
		{
			count = MyItems.instance().countForItem(itemIds[i]);	
			item = Shop.instance().getItem(Shop.ATTACK, itemIds[i]);
//			
//			if(itemIds[i] > 363 && count == 0)
//				continue;
			
			listData.Push({
			"itemId":itemIds[i],
			"itemName":Datas.getArString("itemName.i" + itemIds[i]),
			"desc":Datas.getArString("itemDesc.i" + itemIds[i]),
			"item":item,
			"count":count,
			"kid":hash["kid"]
			});
			
		}
		
		var	seed:HashObject = GameMain.instance().getSeed();
		var level:int = _Global.INT32(seed["knights"]["city"+GameMain.instance().getCurCityId()]["knt"+(hash["kid"])]["knightLevel"]);
		
		for( var k:int = generalLevelUp1Start; k <= generalLevelUp1End; k ++ )
		{
			count = MyItems.instance().countForItem(k);	
			item = Shop.instance().getItem(Shop.ATTACK, k);
			
			if(count == 0 || level >= (k - generalLevelUp1CompareMinus)*5 + 200)
				continue;
			
			listData.Push({
			"itemId":k,
			"itemName":Datas.getArString("itemName.i" + k),
			"desc":Datas.getArString("itemDesc.i" + k),
			"item":item,
			"count":count,
			"kid":hash["kid"]
			});
			
		}
		
		//over level270
		var gdsBuilding : GDS_Building = GameMain.GdsManager.GetGds.<GDS_Building>();
		var knightHouseLevel:int = Building.instance().getMaxLevelForType(Constant.Building.GENERALS_QUARTERS,KBN.GameMain.singleton.getCurCityId());
		var buildingEffectLevel:int = gdsBuilding.getBuildingEffect(Constant.Building.GENERALS_QUARTERS, knightHouseLevel, Constant.BuildingEffectType.EFFECT_TYPE_GENERALLEVEL_CAP);
		var itemLevel:int = 270;
		for (var m:int = generalLevelUp270Start;m <= generalLevelUp270End; m++)
		{
			itemLevel += 5;
			count = MyItems.instance().countForItem(m);	
			if(count == 0)
				continue;
			if(level >= itemLevel)
				continue;
			if(buildingEffectLevel < itemLevel)
				continue;
			
			item = Shop.instance().getItem(Shop.ATTACK, m);
			listData.Push({
			"itemId":m,
			"itemName":Datas.getArString("itemName.i" + m),
			"desc":Datas.getArString("itemDesc.i" + m),
			"item":item,
			"count":count,
			"kid":hash["kid"]
			});
		}
		
		for(var j:int = generalLevelItemMinId; j <= generalLevelItemMaxId; j++)
		{
			if(!(itemlist["i"+j] && itemlist["i"+j]["price"]) || level >= (j - generalLevelCompareMinus))
				continue;
			
			count = MyItems.instance().countForItem(j);	
			item = Shop.instance().getItem(Shop.ATTACK, j);
			
			if(count == 0)
				continue;
			
			listData.Push({
			"itemId":j,
			"itemName":Datas.getArString("itemName.i" + j),
			"desc":Datas.getArString("itemDesc.i" + j),
			"item":item,
			"count":count,
			"kid":hash["kid"]
			});
		}
		
		//over level270
		itemLevel = 270;
		for (var n:int = generalLevel270ItemMinId;n <= generalLevel270ItemMaxId; n++)
		{
			itemLevel += 5;
			count = MyItems.instance().countForItem(n);	
			if(count == 0)
				continue;
			if(level >= itemLevel)
				continue;
			if(buildingEffectLevel < itemLevel)
				continue;
			
			item = Shop.instance().getItem(Shop.ATTACK, n);
			listData.Push({
			"itemId":n,
			"itemName":Datas.getArString("itemName.i" + n),
			"desc":Datas.getArString("itemDesc.i" + n),
			"item":item,
			"count":count,
			"kid":hash["kid"]
			});
		}
		
		
		listView.SetData(listData);
		listView.ResetPos();
		
		super.resetLayout();		
	}
		
	public	function	OnPush( p:Object )
	{
		listView.Clear();
		
		hash = p as Hashtable;
		
		if(Shop.instance().updateShop)
		{
			Shop.instance().getShopData(resetDisplay);
		}
		else
		{
			resetDisplay();
		}	
	}

	public	function	OnPopOver()
	{
		listView.Clear();
	}

}