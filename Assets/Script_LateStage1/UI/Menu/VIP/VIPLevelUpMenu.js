class VIPLevelUpMenu extends KBNMenu
{
	public var labelFrame:Label;
	public var l_vipIcon:Label;
	public var l_vipBG:Label;
	public var l_light:Label;
	public var l_flow:Label;
	public var l_Title:Label;
	public var l_lightBackTop:Label;
	public var rotateSpeed:int;
	private var m_rotate:Rotate;
	
	public var l_levelBg:Label;
	public var l_Level:Label;
	public var l_bg:Label;
	public var l_line:Label;
	public var scrollView_CurVip:ScrollView;
	public var vipItem:ListItem;
	public var l_getVip:Label;
	
	
	public var mask:SimpleLabel;
	
	public function Init()
	{
//		repeatTimes = 6;
		bgStartY = 165;
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");
		bgMiddleBodyPic.rect.width = rect.width - 30;
		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black",TextureType.BACKGROUND);
		}
		
		l_lightBackTop.setBackground("payment_light",TextureType.DECORATION);
		m_rotate = new Rotate();
		m_rotate.init(l_lightBackTop,EffectConstant.RotateType.LOOP,Rotate.RotateDirection.CLOCKWISE,0,rotateSpeed);
		m_rotate.rotateMultiple = rotateSpeed;
		m_rotate.playEffect();
		l_vipIcon.setBackground("VIP",TextureType.DECORATION);
		l_light.setBackground("light_box",TextureType.DECORATION);
		l_levelBg.setBackground("Decorative_frame",TextureType.DECORATION);
		l_bg.setBackground("square_black2",TextureType.DECORATION);
		l_line.setBackground("between line",TextureType.DECORATION);
		l_vipBG.setBackground("Beginners-offer_tiao",TextureType.ICON_ELSE);
		l_flow.setBackground("Award_Pattern",TextureType.DECORATION);
		l_Title.txt = Datas.getArString("Common.VIPLvUp_Title");
		l_getVip.txt = Datas.getArString("Common.VIPLvUp_Desc");
		scrollView_CurVip.Init();
		btnClose.OnClick = CloseMenu;
	} 
	
	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/" );
		var data:HashObject = param as HashObject;
		SetDispayData(_Global.INT32(data["vipLevel"]));
	}
	
	public function OnPopOver()
	{
		scrollView_CurVip.clearUIObject();
	}
	
	public function Update()
	{
		scrollView_CurVip.Update();
		m_rotate.updateEffect();
	}
	
	public function DrawItem()
	{
		l_flow.Draw();
		labelFrame.Draw();
		l_vipBG.Draw();
		m_rotate.drawItems();
//		l_light.Draw();
		l_vipIcon.Draw();
		l_Title.Draw();
		l_levelBg.Draw();
		l_Level.Draw();
		l_bg.Draw();
		l_line.Draw();
		scrollView_CurVip.Draw();
		l_getVip.Draw();
		btnClose.Draw();
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		mask.Draw();
		GUI.color = oldColor;
	}
	
	protected function DrawBackground()
	{	
		if(Event.current.type != EventType.Repaint)
			return;
		DrawMiddleBg(570,36);
	}
	
	private function SetDispayData(vipLevel:int)
	{
		var strPrivilege:String = Datas.getArString("Common.PlayerInfo_VIP_SubTitle");
		l_Level.txt = strPrivilege.Replace("{0}",vipLevel.ToString());
		scrollView_CurVip.clearUIObject();
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
	
	public function CloseMenu():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	
}