class LeaderBoardItem extends ListItem
{
	public enum Function_Type
	{
		Function_Type_None = 0,
		Function_Type_OnMightClick,
		Function_Type_OnLeagueClick,
		Function_Type_OnPveClick,
		Function_Type_OnDefenseClick,
		Function_Type_OnAvaEventClick
	}
	
	public var btnDefault:SimpleButton;
	public enum Item_Type
	{
		Item_Type_Normal = 0,
		Item_Type_None
	};
	public var backImage:SimpleLabel;
	public var iconBack:SimpleLabel;
	public var rankName:SimpleLabel;
	public var cirleIcon:SimpleLabel;
	private var itemType:Item_Type;
	
	private var clickParam:Function_Type;
	
	public var cirleAlpha:float = 0.65f;
	
	public function SetRowData(data:Object)
	{
		var hash:HashObject = data as HashObject;
		var iconName:String = _Global.ToString(hash["icon"]);
		if(iconName == "")
		{
			itemType = Item_Type.Item_Type_None;
		}
		else
		{
			icon.useTile = false;
			itemType = Item_Type.Item_Type_Normal;
			switch(_Global.ToString(hash["iconType"]))
			{
			case "BUTTON":
				icon.setBackground(iconName, TextureType.BUTTON);
				break;
			case "ElseIconSpt":
				icon.useTile = true;
				icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(iconName);
				break;
			}
			
			clickParam = _Global.INT32(hash["function"]);
			rankName.txt = _Global.ToString(hash["desc"]);
		}
		
	}
	
	public function DrawItem()
	{
//		GUI.BeginGroup(rect);
			backImage.Draw();
					
			if(itemType == Item_Type.Item_Type_None)
			{
				description.Draw();
			}
			else if(itemType == Item_Type.Item_Type_Normal)
			{		
				btnDefault.Draw();	
				var oldAlpha:float = GUI.color.a;
				GUI.color.a = cirleAlpha;	
					cirleIcon.Draw();
				GUI.color.a = oldAlpha;					
				iconBack.Draw();							
				icon.Draw();	
				rankName.Draw();
				btnSelect.Draw();				
			}
//		GUI.EndGroup();
//		
//	   	return -1;
	}

	public function Init()
	{
		super.Init();
		
		itemType = Item_Type.Item_Type_Normal;
					
		btnSelect.setNorAndActBG("button_moreinfo_small2_normal","button_moreinfo_small2_down");
		description.txt = Datas.getArString("Rank.MoreRank");
		
		backImage.setBackground("Rank_Background", TextureType.DECORATION);
		btnDefault.mystyle.normal.background = TextureMgr.instance().LoadTexture("a_0_square",TextureType.BACKGROUND);
		btnDefault.mystyle.active.background = TextureMgr.instance().LoadTexture("Rank_Down_gradient",TextureType.DECORATION);
//		btnDefault.rect = new Rect(0,0,backImage.rect.width,backImage.rect.height);
		btnDefault.rect = new Rect(44,5,560,140);
		
		
		iconBack.setBackground("bossinfo-bg-lv2", TextureType.PVEBOSS);
		cirleIcon.setBackground("report-cup-bg", TextureType.DECORATION);
		
		btnSelect.OnClick = btnDefault.OnClick = OnClickItem;
	}
	
	private function OnClickItem()
	{
		switch(clickParam)
		{
		case Function_Type.Function_Type_OnMightClick:
			OnMightClick();
			break;
		case Function_Type.Function_Type_OnPveClick:
			OnPveClick();
			break;
		case Function_Type.Function_Type_OnDefenseClick:
			OnDefClick();
			break;
		case Function_Type.Function_Type_OnAvaEventClick:
			OnAvaEventClick();
			break;
		case Function_Type.Function_Type_OnLeagueClick:
			OnLeagueClick();
			break;
		}
		
	}
	
	private function OnMightClick():void
	{
		MenuMgr.getInstance().PushMenu("LeaderboardMenu", null, "trans_horiz");
	}
	
	private function OnPveClick():void
	{
		MenuMgr.getInstance().PushMenu("LeaderBoardPveMenu", null, "trans_horiz");
	}

	private function OnDefClick() : void
	{
		MenuMgr.getInstance().PushMenu("LeaderboardMenu", LeaderboardMenu.ERankType.CitySiegeRank, "trans_horiz");
	}
	
	private function OnAvaEventClick() : void
	{
		var h : HashObject = new HashObject();
		h["FromRank"] = new HashObject();
		h["FromRank"].Value = "true";
		MenuMgr.getInstance().PushMenu("AvAEventMenu", h, "trans_horiz");
	}
	
	private function OnLeagueClick():void
	{
		var h : HashObject = new HashObject();
		h["FromLeagueRank"] = new HashObject();
		h["FromLeagueRank"].Value = "true";
		MenuMgr.getInstance().PushMenu("AvAEventMenu", h, "trans_horiz");
	}
}