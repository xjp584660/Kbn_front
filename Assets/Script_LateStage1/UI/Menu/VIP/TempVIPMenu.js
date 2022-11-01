class TempVIPMenu extends PopMenu
{
	public var l_Title:Label;
	public var l_Line:Label;
	public var l_tempVIPIcon:Label;
	public var l_description:Label;
	public var l_timeIcon:Label;
	public var l_leftTime:Label;
	
	public var l_bg1:Label;
	public var scrollView_CurVip:ScrollView;
	public var vipItem:ListItem;
	
	public var l_bg2:Label;
	public var l_getVIP:Label;
	
	private var m_ExpireTime:long;
	public function Init()
	{
		super.Init();
		l_Line.setBackground("between line",TextureType.DECORATION);
		l_tempVIPIcon.setBackground("button_TemporaryVIP_normal",TextureType.BUTTON);
		l_timeIcon.setBackground("icon_time",TextureType.ICON);
		l_bg1.setBackground("square_black2",TextureType.DECORATION);
		l_bg2.setBackground("square_black2",TextureType.DECORATION);
		scrollView_CurVip.Init();
		
		l_Title.txt = Datas.getArString("Common.TempVIP_Title");
		l_description.txt = Datas.getArString("Common.TempVIP_Desc1");
		l_getVIP.txt = Datas.getArString("Common.TempVIP_Desc2");
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		var data:HashObject = param as HashObject;
		var tempVipLevel:int = _Global.INT32(data["vipBuff"]);
		l_tempVIPIcon.txt = "" + tempVipLevel;
		m_ExpireTime = _Global.INT64(data["vipBuffExpireTime"]);
		SetScrollData(tempVipLevel);
	}
	
	public function OnPopOver()
	{
		scrollView_CurVip.clearUIObject();
	}
	
	public function DrawItem()
	{
		btnClose.Draw();
		l_Title.Draw();
		l_Line.Draw();
		l_tempVIPIcon.Draw();
		l_description.Draw();
		l_timeIcon.Draw();
		l_leftTime.Draw();
		l_bg1.Draw();
		l_bg2.Draw();
		l_getVIP.Draw();
		scrollView_CurVip.Draw();
	}
	
	public function Update()
	{
		scrollView_CurVip.Update();
		var leftTime:long = m_ExpireTime - KBN.GameMain.unixtime();
		if(leftTime >= 0)
		{
			l_leftTime.txt = _Global.timeFormatStr(leftTime);
		}
		else
		{
			l_leftTime.txt = _Global.timeFormatStr(0);
		}

	}
	
	public function SetScrollData(vipLevel:int)
	{
		var data:VIPItemData = new VIPItemData();
		var item:ListItem;
		var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		var str:String;
		if(vipDataItem != null)
		{
				//reverse
			if(vipDataItem.HERO_RENOWN != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_GiftUp");
				data.content = str.Replace("{0}",vipDataItem.HERO_RENOWN.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.HERO_SLEEP != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_ExploreSleep");
				data.content = str.Replace("{0}",vipDataItem.HERO_SLEEP.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.HERO_EXPLORE_TIMES != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_ExploreStamina");
				data.content = str.Replace("{0}",vipDataItem.HERO_EXPLORE_TIMES.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.HERO_EXPLORE_DAY != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_ExploreTime");
				data.content = str.Replace("{0}",vipDataItem.HERO_EXPLORE_DAY.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.PVE_TROOP_RETURN != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_PVERevive");
				data.content = str.Replace("{0}",vipDataItem.PVE_TROOP_RETURN.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.PVE_MARCH_SPEEDUP != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_PVENoMarch");
				data.content = str.Replace("{0}",vipDataItem.PVE_MARCH_SPEEDUP.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.PVE_LOGIN_ENERGY != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_LoginStamina");
				data.content = str.Replace("{0}",vipDataItem.PVE_LOGIN_ENERGY.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.PVE_ENERGY != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_MaxStamina");
				data.content = str.Replace("{0}",vipDataItem.PVE_ENERGY.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.MERLINS_CHANCE != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_MerlinToken");
				data.content = str.Replace("{0}",vipDataItem.MERLINS_CHANCE.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.TECH != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_ResearchSpeed");
				data.content = str.Replace("{0}",vipDataItem.TECH.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.CONSTRUCT != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Text_BuildSpeed");
				data.content = str.Replace("{0}",vipDataItem.CONSTRUCT.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.MARCH_PRESET != 0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Privilege_MarchPreset");
				data.content = str.Replace("{0}",vipDataItem.MARCH_PRESET.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.MAP_SEARCH_TIMES!=0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Privilege_SearchTimes");
				data.content = str.Replace("{0}",vipDataItem.MAP_SEARCH_TIMES.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.STORE_HOUSE_CAP!=0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Privilege_ProtectLimit");
				data.content = str.Replace("{0}",vipDataItem.STORE_HOUSE_CAP.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.HOSPITAL_CAP!=0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Privilege_HospitalCapacity");
				data.content = str.Replace("{0}",vipDataItem.HOSPITAL_CAP.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.TRAIN_SPEED!=0)
			{
				data.iconName = "";
				str = Datas.getArString("VIP.Privilege_TrainSpeed");
				data.content = str.Replace("{0}",vipDataItem.TRAIN_SPEED.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.GOLD != 0)
			{
				data.iconName = "resource_Gold_icon";
				str = Datas.getArString("VIP.Text_Gold");
				data.content = str.Replace("{0}",vipDataItem.GOLD.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.ORE != 0)
			{
				data.iconName = "resource_Ore_icon";
				str = Datas.getArString("VIP.Text_Ore");
				data.content = str.Replace("{0}",vipDataItem.ORE.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.STONE != 0)
			{
				data.iconName = "resource_Stone_icon";
				str = Datas.getArString("VIP.Text_Stone");
				data.content = str.Replace("{0}",vipDataItem.STONE.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.WOOD != 0)
			{
				data.iconName = "resource_Wood_icon";
				str = Datas.getArString("VIP.Text_Wood");
				data.content = str.Replace("{0}",vipDataItem.WOOD.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
			if(vipDataItem.FOOD != 0)
			{
				data.iconName = "resource_Food_icon";
				str = Datas.getArString("VIP.Text_Food");
				data.content = str.Replace("{0}",vipDataItem.FOOD.ToString());
				item = Instantiate(vipItem);
				item.SetRowData(data);
				scrollView_CurVip.addUIObject(item);
			}
		
			scrollView_CurVip.AutoLayout();
			scrollView_CurVip.MoveToTop();	
		}
	}
}