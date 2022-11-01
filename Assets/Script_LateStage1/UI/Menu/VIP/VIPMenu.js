class VIPMenu extends KBNMenu
{
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	
	public var l_bg1:Label;
	public var l_bg2:Label;
	public var l_bg3:Label;
	public var l_bg4:Label;
	
	public var l_VIPDescription:Label;
	public var l_VIPLevel:Label;
	public var l_progressBg:Label;
	public var l_progressColor:Label;
	public var l_CurrentAndNextLevelPoint:Label;
	public var btnTempVIP:Button;
	public var l_tempVIPLeftTime:Label;
	
	public var l_curVIPPrivilege:Label;
	public var vipItem:ListItem;
	public var scrollView_CurVip:ScrollView;
	public var btnLeft:Button;
	public var btnRight:Button;
	public var l_getVip:Label;
	public var l_nextLogin:Label;
	public var l_nextLoginPoints:Label;
	public var l_currentStreak:Label;
	public var l_currentStreakContent:Label;
	
	private var m_TempVipExpireTime:long;
	private var m_data:HashObject;
	private var m_displayLevel:int;
	public function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		menuHead.setTitle(Datas.getArString("Common.PlayerInfo_VIP_Title"));
		menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
		scrollView_CurVip.Init();
		
		btnTempVIP.OnClick = OpenTempVIPMenu;
		btnLeft.OnClick = OnLeft;
		btnRight.OnClick = OnRight;
		l_bg1.setBackground("square_blackorg",TextureType.DECORATION);
		l_bg2.setBackground("square_blackorg",TextureType.DECORATION);
		l_bg3.setBackground("square_blackorg",TextureType.DECORATION);
		l_bg4.setBackground("square_blackorg",TextureType.DECORATION);
		l_VIPLevel.setBackground("OfficiallyVIP",TextureType.DECORATION);
		l_progressColor.setBackground("lv_The-progress-bar1_HD",TextureType.DECORATION);
		l_progressBg.setBackground("lv_The-progress-bar2_HD",TextureType.DECORATION);
		
		btnTempVIP.setNorAndActBG("button_TemporaryVIP_normal","button_TemporaryVIP_down");
		btnLeft.setNorAndActBG("button_flip_dark_left_normal","button_flip_dark_left_down");
		btnRight.setNorAndActBG("button_flip_dark_right_normal","button_flip_dark_right_down");
		
		l_VIPDescription.txt = Datas.getArString("Common.PlayerInfo_VIP_Desc1");
		l_getVip.txt = Datas.getArString("Common.PlayerInfo_VIP_Desc2");
		l_tempVIPLeftTime.txt = "";
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		m_data = param as HashObject;
		Datas.singleton.SetVipLevelUpFlag1(0);
		Datas.singleton.SetVipLevelUpFlag2(0);
		
		var vipLevel:int = _Global.INT32(m_data["vipLevel"]);
		var tempLevel:int = _Global.INT32(m_data["vipBuff"]);
		btnTempVIP.txt = "" + tempLevel;
		m_TempVipExpireTime = _Global.INT64(m_data["vipBuffExpireTime"]);
		if(tempLevel <= 0 || m_TempVipExpireTime <= KBN.GameMain.unixtime())
		{
			btnTempVIP.SetVisible(false);
			l_tempVIPLeftTime.SetVisible(false);
		}
		else
		{
			btnTempVIP.SetVisible(true);
			l_tempVIPLeftTime.SetVisible(true);
		}
		l_VIPLevel.txt = "" + vipLevel;
		l_nextLogin.txt =  Datas.getArString("Common.PlayerInfo_VIP_Text1");
		var strLoginPoints:String = Datas.getArString("Common.PlayerInfo_VIP_Text2");
		l_nextLoginPoints.txt =  strLoginPoints.Replace("{0}",_Global.INT32(m_data["nextLoginPoint"]).ToString());
		
		l_currentStreak.txt =  Datas.getArString("Common.PlayerInfo_VIP_Text3");
		var strCurrentStreakContent:String = Datas.getArString("Common.PlayerInfo_VIP_Text4");
		l_currentStreakContent.txt =   strCurrentStreakContent.Replace("{0}", _Global.INT32(m_data["successionalDays"]).ToString());
		
		SetProgress();
		if(vipLevel <= 0)
		{
			vipLevel = 1;
		}
		SetDispayData(vipLevel);
		
		SetCurrentAndNextLevelPoint();
	}
	
	public function OnPopOver()
	{
		scrollView_CurVip.clearUIObject();
	}
	
	public function Update()
	{
		scrollView_CurVip.Update();
		var leftTime:long = m_TempVipExpireTime - KBN.GameMain.unixtime();
		if(leftTime >= 0)
		{
			l_tempVIPLeftTime.txt = _Global.timeFormatStr(leftTime);
		}
		else
		{
			btnTempVIP.SetVisible(false);
			l_tempVIPLeftTime.SetVisible(false);
		}
	}
	
	public function DrawBackground()
	{
		menuHead.Draw();
		bgStartY = 70;
		DrawMiddleBg();	
		
		frameTop.Draw();		
	}
	
	public function DrawItem()
	{
		l_bg1.Draw();
		l_bg2.Draw();
		l_bg3.Draw();
		l_bg4.Draw();
		
		l_VIPDescription.Draw();
		l_progressBg.Draw();
		l_progressColor.Draw();
		l_CurrentAndNextLevelPoint.Draw();
		l_tempVIPLeftTime.Draw();
		btnTempVIP.Draw();
		l_VIPLevel.Draw();
		
		l_curVIPPrivilege.Draw();
		scrollView_CurVip.Draw();
		btnLeft.Draw();
		btnRight.Draw();
		l_getVip.Draw();
		l_nextLogin.Draw();
		l_nextLoginPoints.Draw();
		l_currentStreak.Draw();
		l_currentStreakContent.Draw();
	}
	
	public function OnLeft()
	{
		if(m_displayLevel > 1)
		{
			SetDispayData(m_displayLevel-1);
		}
	}
	
	public function OnRight()
	{
		var maxLevel:int = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetVipMaxLevel();
		if(m_displayLevel < maxLevel)
		{
			SetDispayData(m_displayLevel+1);
		}
	}
	
	public function OpenTempVIPMenu()
	{
		var seed:HashObject = GameMain.instance().GetVipData();
		MenuMgr.getInstance().PushMenu("TempVIPMenu",seed, "trans_zoomComp");
	}
	
	private function SetProgress()
	{
		var curLevel:float = _Global.INT32(m_data["vipLevel"]);
		if(curLevel >= GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetVipMaxLevel())
		{
			l_progressColor.rect.width = l_progressBg.rect.width;
		}
		else
		{
			var curPoints:float = _Global.INT32(m_data["vipPoint"]);
			var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(curLevel);
			var nextLevelPoints:float = vipDataItem.POINT;
			l_progressColor.rect.width = curPoints/nextLevelPoints *l_progressBg.rect.width;
		}
	}
	
	private function SetDispayData(vipLevel:int)
	{
		scrollView_CurVip.clearUIObject();
		m_displayLevel = vipLevel;
		var strPrivilege:String = Datas.getArString("Common.PlayerInfo_VIP_SubTitle");
		l_curVIPPrivilege.txt = strPrivilege.Replace("{0}",vipLevel.ToString());
	
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
	
	public function SetCurrentAndNextLevelPoint()
	{
		var vipLevel:int = _Global.INT32(m_data["vipLevel"]);
		var maxLevel:int = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetVipMaxLevel();
		var curPoints:float = _Global.INT32(m_data["vipPoint"]);
		if(vipLevel >= maxLevel)
		{
			l_CurrentAndNextLevelPoint.txt = curPoints + "";
		}
		else
		{
			var nextVipItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
			l_CurrentAndNextLevelPoint.txt = curPoints + " / " + nextVipItem.POINT;
		}
		
	}
	
}