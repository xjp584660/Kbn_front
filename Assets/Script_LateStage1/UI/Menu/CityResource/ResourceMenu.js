
class ResourceMenu extends KBNMenu
{
	public var resourceList:ScrollList;
	public var population:Label;
	public var idle:Label;
	public var populationCap:Label;
	public var happy:Label;
	public var taxRate:Label;
	public var protectLimit:Label;
	public var carmotLimit:Label;
	public var cityInfo:Label;
	public var itemTemplate:ResItem;
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var frame:SimpleLabel;
	
//	function Awake()
//	{
//		super.Awake();
//		
//	}
	
	function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		itemTemplate.Init();		
		resourceList.Init(itemTemplate);
		
		frameTop.rect = Rect( 0, 69, frameTop.rect.width, frameTop.rect.height);
	}
	
	function DrawItem() {
	//	cityInfo.Draw();
		population.Draw();
		idle.Draw();
		populationCap.Draw();
		happy.Draw();
		taxRate.Draw();
		protectLimit.Draw();
		carmotLimit.Draw();
		resourceList.Draw();
	//	btnClose.Draw();
	}	
	
	function Update()
	{
		menuHead.Update();
		resourceList.Update();
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
		GetList();
		var curCityId:int = GameMain.instance().getCurCityId();
		SetMenuTitle(curCityId);
		population.txt = Datas.getArString("Common.Population") + ": " + _Global.NumFormat(Resource.instance().populationCount(curCityId));
		populationCap.txt = Datas.getArString("ShowPopTooltip.PopLimit") + ": " + _Global.NumFormat(Resource.instance().populationCap(curCityId));
		idle.txt  = Datas.getArString("ShowPopTooltip.IdlePop") + ": "+ _Global.NumFormat(Resource.instance().populationIdle(curCityId));
		happy.txt = Datas.getArString("Common.Happiness") + ": "+Resource.instance().populationHappiness(curCityId) + "%";
		taxRate.txt = Datas.getArString("Common.Tax") + ": " +Resource.instance().taxRate(curCityId) + "%";
		protectLimit.txt =  Datas.getArString("ResourceTips.ProtectionLimit") + ":" + " " + _Global.NumSimlify2(Resource.instance().GetProtCnt(curCityId));
		var carmotLimtNum=Resource.instance().GetCarmotProtCnt(curCityId);
		if(carmotLimtNum<0){
			carmotLimit.txt= "Carmot Protection Limit:--" ;
		}else{
			carmotLimit.txt= "Carmot Protection Limit:" + " " + _Global.NumSimlify2(carmotLimtNum);
		}
		
	}
	
	private function SetMenuTitle(curCityId : int)
	{
		var cInfo:HashObject = GameMain.instance().GetCityInfo(curCityId);
		
		var cityName : String = _Global.GetString(cInfo[_Global.ap+1]);
		var coorX : String = _Global.GetString(cInfo[_Global.ap+2]);
		var coorY : String = _Global.GetString(cInfo[_Global.ap+3]);

		var renderWidth : float = menuHead.l_title.rect.width;
		var style : GUIStyle = menuHead.l_title.mystyle;
		
		var title : String = _Global.GUIClipToWidth(style, cityName, renderWidth, "...", String.Format("({0},{1})", coorX, coorY));
		menuHead.setTitle(title);
	}
	
	public	function	OnPopOver()
	{
		resourceList.Clear();
		TryDestroy(menuHead);
		menuHead = null;
	}
	
	function GetList()
	{
		var data:Array = new Array();
		var curCityId:int = GameMain.instance().getCurCityId();
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		var upkeep:long = Resource.instance().GetFoodUpkeep(curCityId) ;
		var seed:HashObject = GameMain.instance().getSeed();
		var upKeepBuff : boolean = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + curCityOrder]) > GameMain.unixtime();
		
		for(var i:int =Constant.ResourceType.FOOD; i <= Constant.ResourceType.IRON; i++ )
		{
			var newItem:Object  = {
				"ID":i,
				"owned":Resource.instance().getCountForTypeInSeed(i, curCityId),
				"product":Resource.instance().getFinalResourceProductivity(curCityId, i),
				"cap":Resource.instance().GetLimitForType(i, curCityId),
				"upkeep":upkeep,
				"upkeepBuff":upKeepBuff
				};
			data.Push(newItem);
		}
		newItem  = {
				"ID":Constant.ResourceType.GOLD,
				"owned":Resource.instance().getCountForTypeInSeed(Constant.ResourceType.GOLD, curCityId),
				"product":Resource.instance().TaxRevenue(curCityId),
				"cap":0,		
				"upkeep": Resource.instance().GetGoldUpkeep(curCityId)
			};
		data.Push(newItem);	
		resourceList.SetData(data);	
	}
	
	
	function DrawBackground()
	{
		menuHead.Draw();
		if(Event.current.type != EventType.Repaint)
			return;
	//	GUI.DrawTexture( Rect(0, 85, rect.width, rect.height ), background);	
	//	GUI.Label( Rect(0, 85, rect.width, rect.height ), background);
		bgStartY = 70;
		DrawMiddleBg();	
		
		frameTop.Draw();
		//GUI.Label( Rect(0, 85, rect.width , frameTop.height), frameTop);
		frame.Draw();
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.ADD_RESOURCE:
				GetList();
				break;
			case Constant.Notice.BOSST_RESOURCE:
				GetList();	
				break;	
		}		
	}
}
