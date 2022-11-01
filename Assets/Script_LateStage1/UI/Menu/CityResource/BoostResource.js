class BoostResource extends PopMenu
{
	public var seperateLine:Label;
	public var seperateLine1:Label;
	public var scrollList:ScrollList;
	public var boostItem:BoostItem;
	
	public var composed:ComposedUIObj;
	public var buff:Label;
	public var label1:Label;
	public var label2:Label;
	public var label3:Label;
	public var label4:Label;
	public var itemName:Label;
	public var icon:Label;	

	private var resourceId:int;
	private var m_data:Hashtable;
	private var buffEndTime:long;
	private var lastTime:long;
	private var remainTime:long;
    
    @SerializeField
    private var buffLeftMargin : float = 10;
	
	function Init()
	{
		super.Init();
		
		title.txt = Datas.getArString("Common.ProductionBoost_Title");
		scrollList.Init(boostItem);
		
		seperateLine.setBackground("between line", TextureType.DECORATION);
		seperateLine1.setBackground("between line", TextureType.DECORATION);
		
		buff.Init();
		label1.Init();
		label2.Init();
		label3.Init();
		label4.Init();
		itemName.Init();
		icon.Init();
		
		seperateLine1.Init();
		seperateLine.Init();
		
		composed.component = [itemName, buff, label1, label2, label3, label4];		
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
	
		if(aniOwnedLabel)
		{
			aniOwnedLabel.SetVisible(true);
			aniOwnedLabel = null;
		}
		
		if(aniBuffLabel)
		{
			aniBuffLabel.SetVisible(true);
			aniBuffLabel = null;
		}
		
	
		resourceId = (param as Hashtable)["recType"];
		m_data = (param as Hashtable)["data"];
		
		itemName.txt = Datas.getArString("ResourceName."+ _Global.ap + resourceId);
        buff.rect.x = itemName.rect.x + itemName.GetWidth() + buffLeftMargin;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_rec" + resourceId);
		//icon.tile.name = "icon_rec" + resourceId;		
		
		initComponent(resourceId, true);
		
		Shop.instance().getShopData(SetItems);
	}
	
	public	function	OnPopOver()
	{
		scrollList.Clear();
	}
	
	function Update()
	{
		scrollList.Update();
		
		if(buffEndTime > GameMain.unixtime())
		{
			if(GameMain.unixtime() - lastTime > 0)
			{
				remainTime = buffEndTime - GameMain.unixtime();
				if(resourceId == Constant.ResourceType.GOLD)
				{
					buff.txt = "(+100% "+ _Global.timeFormatStr(remainTime) + ")";
				}
				else
				{
					buff.txt = "(+25% "+ _Global.timeFormatStr(remainTime) + ")";	
				}
					
				lastTime = 	GameMain.unixtime();		
			}
		}		
		
		playAnimation();				
	}
	
	function DrawItem()
	{
		icon.Draw();
		composed.Draw();
		seperateLine.Draw();
		seperateLine1.Draw();		
		scrollList.Draw();
	}
	
	private function SetItems():void
	{
		var ids:int[];
		switch(resourceId)
		{
		case Constant.ResourceType.GOLD:
			ids = [101, 102, 1005, 1006, 1007];
			break;
		case Constant.ResourceType.FOOD:
			ids = [111, 112, 1015, 1016, 1017];
			break;
		case Constant.ResourceType.STONE:		
			ids = [131, 132, 1035, 1036, 1037];
			break;
		case Constant.ResourceType.IRON:
			ids = [141, 142, 1045, 1046, 1047];
			break;
		case Constant.ResourceType.LUMBER:
			ids = [121, 122, 1025, 1026, 1027];
			break;
		}
		
		var data:Hashtable;
		var arr:Array = new Array();
		var count:int;
		var item:Hashtable;
		for(var a:int = 0; a < ids.length; a++)
		{
			count = MyItems.instance().countForItem(ids[a]);
			item = Shop.instance().getItem(Shop.PRODUCT, ids[a]);
			data = {"ID":ids[a], "recType":resourceId, "count":count, "item":item};
			arr.Push(data);
		}
		
		scrollList.SetData(arr);
	}

	public function initComponent(type:int, isInit:boolean):void
	{
		var hr:String = "/" + Datas.getArString("TimeStr.timeHr");
		var seed:HashObject = GameMain.instance().getSeed();
		
		ownedNum = _Global.INT64(m_data["owned"]);
		
		switch(type)
		{
			case Constant.ResourceType.FOOD:
				label1.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(_Global.INT64(m_data["product"]) + _Global.INT64(m_data["upkeep"])) + hr;
				label2.txt = Datas.getArString("Common.UpKeep") + ": " + _Global.NumFormat(m_data["upkeep"]) + hr;
				if(isInit)
				{
					label3.txt = Datas.getArString("Common.youOwn") + ": " + _Global.NumFormat(m_data["owned"]);
				}
				label4.txt = Datas.getArString("Common.Capacity") + ": " + _Global.NumFormat(m_data["cap"]);
				break;
			case Constant.ResourceType.STONE:				
			case Constant.ResourceType.IRON:
			case Constant.ResourceType.LUMBER:
				label1.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(m_data["product"]) + hr;
				if(isInit)
				{
					label2.txt = Datas.getArString("Common.youOwn") + ": " + _Global.NumFormat(m_data["owned"]);
				}
				label3.txt = Datas.getArString("Common.Capacity") + ": " + _Global.NumFormat(m_data["cap"]);
				label4.txt = "";
				break;				
			case Constant.ResourceType.GOLD:
				label1.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(m_data["product"]) + hr;
				label2.txt = Datas.getArString("Generals.salary") + ": " + _Global.NumFormat(m_data["upkeep"]) + hr;
				if(isInit)
				{
					label3.txt = Datas.getArString("Common.youOwn") + ": " + _Global.NumFormat(m_data["owned"]);
				}
				label4.txt = "";
				break;
		}
		
		buff.txt = "";
		var temp:long;
		if (type == Constant.ResourceType.GOLD) 
		{
			temp = _Global.INT64(seed["bonus"]["bC1000"]["bT1001"]);
		} 
		else if (type == Constant.ResourceType.FOOD) 
		{
		    temp = _Global.INT64(seed["bonus"]["bC1100"]["bT1101"]);
		} 
		else if (type == Constant.ResourceType.LUMBER) 
		{
			temp = _Global.INT64(seed["bonus"]["bC1200"]["bT1201"]);
		} 
		else if (type == Constant.ResourceType.STONE) 
		{
			temp = _Global.INT64(seed["bonus"]["bC1300"]["bT1301"]);
		} 
		else if (type == Constant.ResourceType.IRON) 
		{
			temp = _Global.INT64(seed["bonus"]["bC1400"]["bT1401"]);
		}
		
		if(isInit)
		{
			buffEndTime = temp;
		}
		else
		{
			buffNum = temp;
		}
		
		if(temp > GameMain.unixtime())
		{
			if(isInit)
			{
				if(type == Constant.ResourceType.GOLD)
				{
					buff.txt = "( +100% "+ _Global.timeFormatStr(remainTime) + " )";
				}
				else
				{
					buff.txt = "( +25% "+ _Global.timeFormatStr(remainTime) + " )";
				}				
			}
				
			buff.SetVisible(true);
		}
		else
		{
			buff.SetVisible(false);
		}	
	}
	
	private var aniOwnedLabel:Label;
	private var aniBuffLabel:Label;
	private var ownedNum:long;
	private var buffNum:long;
	private var countForOwned:int = 0;
	private var countForBuff:int = 0;
	
	
	public function setAnimation(type:String):void
	{
		if(type == Constant.Notice.ADD_RESOURCE)
		{
			switch(resourceId)
			{
			case Constant.ResourceType.STONE:				
			case Constant.ResourceType.IRON:
			case Constant.ResourceType.LUMBER:
				aniOwnedLabel = label2;
				break;	
			case Constant.ResourceType.FOOD:			
			case Constant.ResourceType.GOLD:
				aniOwnedLabel = label3;
				break;				
			}
			
			countForOwned = 0;
			timerOwned = .0;
		}
		else if(type == Constant.Notice.BOSST_RESOURCE)
		{
			if(buffEndTime != 0)
			{
				aniBuffLabel = buff;
			}
			else
			{
				remainTime = buffNum - GameMain.unixtime();
				if(resourceId == Constant.ResourceType.GOLD)
				{
					buff.txt = "( +100% "+ _Global.timeFormatStr(remainTime) + " )";
				}
				else
				{
					buff.txt = "( +25% "+ _Global.timeFormatStr(remainTime) + " )";
				}
				
				buff.SetVisible(true);
				buffEndTime = buffNum;
				aniBuffLabel = null;			
			}
			
			countForBuff = 0;
			timerbuff = .0;
		}
	}
	
	private var timerOwned:float;
	private var timerbuff:float;
	private var duration:float = 0.2;
	private var maxCount:int = 8;
	
	public function playAnimation():void
	{
		if(aniOwnedLabel)
		{
			timerOwned += Time.deltaTime;
			if(timerOwned > duration * countForOwned)
			{
				if(countForOwned < maxCount)
				{
					aniOwnedLabel.SetVisible(countForOwned % 2 > 0 ? true : false);			
				}
				
				countForOwned++;
				
				if(countForOwned > maxCount + 1)
				{
					aniOwnedLabel.txt = Datas.getArString("Common.youOwn") + ": " + _Global.NumFormat(ownedNum);
					aniOwnedLabel.SetVisible(true);
					aniOwnedLabel = null;
					countForOwned = 0;
				}
			}
		}
		
		if(aniBuffLabel)
		{
			timerbuff += Time.deltaTime;
			if(timerbuff > duration * countForBuff)
			{
				if(countForBuff < maxCount)
				{
					aniBuffLabel.SetVisible(countForBuff % 2 > 0 ? true : false);
				}

				countForBuff++;
				
				if(countForBuff > maxCount + 1)
				{
					remainTime = buffNum - GameMain.unixtime();
					if(resourceId == Constant.ResourceType.GOLD)
					{
						aniBuffLabel.txt = "( +100% "+ _Global.timeFormatStr(remainTime) + " )";
					}
					else
					{
						aniBuffLabel.txt = "( +25% "+ _Global.timeFormatStr(remainTime) + " )";
					}
					
					aniBuffLabel.SetVisible(true);
					
					countForBuff = 0;
					aniBuffLabel = null;
					buffEndTime = buffNum;
				}
			}
		}
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.ADD_RESOURCE:
				m_data = Resource.instance().getData(resourceId);
				initComponent(resourceId, false);
				SetItems();
				break;
			case Constant.Notice.BOSST_RESOURCE:
				m_data = Resource.instance().getData(resourceId);
				initComponent(resourceId, false);
				SetItems();	
				break;	
		}		
		
		setAnimation(type);				
	}	
}

