
class ResItem extends ListItem
{
	public var product:Label;
	public var owned:Label;
	public var cap:Label;
	public var boostTime:Label;
	public var percent:PercentBar;
	public var upkeep:SimpleLabel;
	public var upkeepContent:SimpleLabel;
	public var seperateLine:Label;

	private var buffEndTime:long;
	private var m_data:Hashtable;
	
	public function Init()
	{
		seperateLine.setBackground("between line_list_small", TextureType.DECORATION);
		
		title.Init();
		
		product.Init();
		owned.Init();
		cap.Init();
		boostTime.Init();
		upkeep.Init();
		upkeepContent.Init();
		btnSelect.txt = Datas.getArString("Common.Boost");
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		title.Draw();
		icon.Draw();	
	//	if(ID != Constant.ResourceType.GOLD)	
	//		percent.Draw();
		if(ID == Constant.ResourceType.FOOD || ID == Constant.ResourceType.GOLD)
		{
			upkeep.Draw();	
			upkeepContent.Draw();
		}	
		owned.Draw();
		if(ID != Constant.ResourceType.GOLD)
			cap.Draw();
		product.Draw();
		boostTime.Draw();
		btnSelect.Draw();
		seperateLine.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as Hashtable;
		ID  =  m_data["ID"];
		var hr:String = "/" + Datas.getArString("TimeStr.timeHr");
		owned.txt = Datas.getArString("Common.youOwn") + ": " + _Global.NumFormat(m_data["owned"]);
		cap.txt = Datas.getArString("Common.Capacity") + ": " + _Global.NumFormat(m_data["cap"]);
		
	//	percent.Init(data["owned"], data["cap"]);
		if(ID == Constant.ResourceType.FOOD)
		{
			upkeep.txt = Datas.getArString("Common.UpKeep") + ": ";
			var cnt:long = _Global.INT64(m_data["product"]) + _Global.INT64(m_data["upkeep"]);
			product.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(cnt) + hr;
			if(_Global.GetBoolean(m_data["upkeepBuff"]))
				upkeepContent.SetNormalTxtColor(FontColor.Green);
			else if(_Global.INT64(m_data["upkeep"]) > cnt)
				upkeepContent.SetNormalTxtColor(FontColor.Red);	
			else
				upkeepContent.SetNormalTxtColor(FontColor.Light_Yellow);
		}
		else if(ID == Constant.ResourceType.GOLD)
		{
			upkeep.txt = Datas.getArString("Generals.salary") + ": ";
			product.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(m_data["product"]) + hr;
			if(_Global.INT64(m_data["upkeep"]) > _Global.INT64(m_data["product"]))
				upkeepContent.SetNormalTxtColor(FontColor.Red);	
			else
				upkeepContent.SetNormalTxtColor(FontColor.Light_Yellow);	
		}		
		else
		{
			upkeep.txt = Datas.getArString("Common.UpKeep") + ": ";
			product.txt = Datas.getArString("Common.Production") + ": " + _Global.NumFormat(m_data["product"]) + hr;
		}
		
		upkeep.SetFont(FontSize.Font_18, FontType.TREBUC);
		
		upkeepContent.rect.x = upkeep.Region.x + upkeep.GetWidth() + 10;
		upkeepContent.txt = "" + _Global.NumFormat(m_data["upkeep"]) + hr;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_rec" + ID);
		//icon.tile.name = "icon_rec" + ID;
		//icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_rec" + ID, TextureType.ICON_ELSE);//Resources.Load("Textures/UI/icon/icon_resource/icon_rec" + ID);
	
		btnSelect.OnClick = function(param)
		{
			var data:Object = {"recType":ID, "data":m_data};
			MenuMgr.getInstance().PushMenu("BoostResource", data, "trans_zoomComp");
		};
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("ResourceName."+_Global.ap + ID);
		boostTime.rect.x = title.rect.x + title.GetWidth() + 10;		
		InitBuff();
	}
	
	private function InitBuff()
	{	
		var seed:HashObject = GameMain.instance().getSeed();
		if (ID == Constant.ResourceType.GOLD) 
		{
			buffEndTime = _Global.INT64(seed["bonus"]["bC1000"]["bT1001"]);
		} 
		else if (ID == Constant.ResourceType.FOOD) 
		{
		    buffEndTime = _Global.INT64(seed["bonus"]["bC1100"]["bT1101"]);
		} 
		else if (ID == Constant.ResourceType.LUMBER) 
		{
			buffEndTime = _Global.INT64(seed["bonus"]["bC1200"]["bT1201"]);
		} 
		else if (ID == Constant.ResourceType.STONE) 
		{
			buffEndTime = _Global.INT64(seed["bonus"]["bC1300"]["bT1301"]);
		} 
		else if (ID == Constant.ResourceType.IRON) 
		{
			buffEndTime = _Global.INT64(seed["bonus"]["bC1400"]["bT1401"]);
		}
		
		var remainTime:long = buffEndTime - GameMain.unixtime();
		if(remainTime > 0)
		{
			if(ID == Constant.ResourceType.GOLD)
				boostTime.txt = "(+100% "+ _Global.timeFormatStr(remainTime) + ")";
			else
				boostTime.txt = "(+25% "+ _Global.timeFormatStr(remainTime) + ")";
			boostTime.SetVisible(true);
		}
		else
		{
			boostTime.SetVisible(false);
		}
	}
	
	public function Update()
	{
		var remainTime:long = buffEndTime - GameMain.unixtime();
		if(remainTime > 0)
		{
			if(ID == Constant.ResourceType.GOLD)
				boostTime.txt = "(+100% "+ _Global.timeFormatStr(remainTime) + ")";
			else
				boostTime.txt = "(+25% "+ _Global.timeFormatStr(remainTime) + ")";
			boostTime.SetVisible(true);
		}
		else
		{
			boostTime.SetVisible(false);
		}
	
	}
	
	public function UpdateData()
	{
		InitBuff();
	}
}


