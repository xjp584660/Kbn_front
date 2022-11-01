class QuestListItem extends FullClickItem
{
	public var itemTitle:Label;
	public var itemName:Label;

	public var btnFetch : Button;

	public var titleBg : Label;
	public var divideBg:Texture2D;
	public var lb_Finish : Label;
	public var lb_Hightlight : Label;
	public var lb_Type : Label;

	private var g_isTitle:boolean;
	private var g_itemId:int;
	private var data:Mission.MissionItem;
	
	public static var g_curSelectedId : int = -1;

	function Init()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		
		var lineRect : UnityEngine.Rect = line.rect;
		super.Init();
		btnFetch.Init();
		btnFetch.OnClick = handleBtnReward;
		btnFetch.mystyle.normal.background = texMgr.LoadTexture("claim_normal", TextureType.BUTTON);
		btnFetch.mystyle.active.background = texMgr.LoadTexture("claim_down", TextureType.BUTTON);
		btnFetch.txt = Datas.getArString("fortuna_gamble.win_claimButton");
		
		lb_Hightlight.Init();
		lb_Hightlight.mystyle.normal.background = texMgr.LoadTexture("White_Gradients", TextureType.DECORATION);

		btnDefault.OnClick = handleBtn;
		itemTitle.Init();
		itemName.Init();

		lb_Finish.Init();
		lb_Finish.mystyle.normal.background = texMgr.LoadTexture("icon_satisfactory", TextureType.ICON);
		titleBg.mystyle.normal.background = texMgr.LoadTexture("square_black2", TextureType.DECORATION);
		line.rect = lineRect;

		lb_Type.Init();
	}

	private function handleBtnReward():void
	{
		Quests.instance().getReward(g_itemId, getRewardSuccess);
	}
	
	private function getRewardSuccess():void
	{	
		var missionMenu:Mission = MenuMgr.getInstance().getMenu("Mission") as Mission;
		if ( missionMenu != null )
			missionMenu.resetDisplayInfor(g_itemId);		
	}
	
	private function playMusic():void
	{
		SoundMgr.instance().PlayEffect( "quest_complete", /*TextureType.AUDIO*/"Audio/" );
	}
	
	private function handleBtn()
	{	
		var missionMenu:Mission = MenuMgr.getInstance().getMenu("Mission") as Mission;
		if ( missionMenu != null )
			missionMenu.pushSubMenu(data);
	}

	public function SetRowData(_data:Object)
	{
		data = _data as Mission.MissionItem;
		g_isTitle = data.isTitle;

		if(g_isTitle)
		{
			itemTitle.SetFont(FontSize.Font_20,FontType.TREBUC);
			itemTitle.txt = data.title;
			var texMgr : TextureMgr = TextureMgr.instance();
			var iconType : String = null;
			switch ( data.missionType )
			{
			case Mission.MissionItem.MissionType.Research:
				iconType = "Research_tasks";
				break;
			case Mission.MissionItem.MissionType.City:
			case Mission.MissionItem.MissionType.Army:
				iconType = "Economic_tasks";
				break;
			case Mission.MissionItem.MissionType.Economy:
				iconType = "Resources_Task";
				break;
			default:
				iconType = "Resources_Task";
				break;
			}
			if ( iconType != null )
				lb_Type.mystyle.normal.background = texMgr.LoadTexture(iconType, TextureType.ICON);
		}
		else
		{
			g_itemId = data.id;
			itemName.txt = data.name;
		}
	}

	function Draw()
	{	
		GUI.BeginGroup(rect);

		if(g_isTitle)
		{
			titleBg.Draw();
			itemTitle.Draw();
			lb_Type.Draw();
		}
		else
		{
			if ( Event.current.type == EventType.Repaint )
			{
				btnDefault.Draw();
			
				if ( data != null ) 
				{
					if ( data.isFinished )
					{
						lb_Finish.Draw();
						btnFetch.Draw();
					}
					if ( data.needDivideLine )
						line.Draw();
	
					if ( data.id == g_curSelectedId )
						lb_Hightlight.Draw();
				}
	
				itemName.Draw();
			}
			else
			{
				if ( data.isFinished )
					btnFetch.Draw();
				btnDefault.Draw();
			}
		}

		GUI.EndGroup();
	}
}