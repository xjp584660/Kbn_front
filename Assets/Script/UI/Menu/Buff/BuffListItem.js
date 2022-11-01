class BuffListItem extends ListItem
{
	public var itemIcon:Label;
	public var itemIconMask:Label;
	public var itemDescription:Label;
	public var divideline:Label;
	public var leftTime:Label;
	public var leftTimeIcon:Label;
	public var btnGoto:Button;
	public var labelGoto:Label;
	public var alert:Label;

	private var g_endTime:long;
	private var g_isDisplayProBar:boolean;
	private var g_lastTime:long = 0;
	private var g_type:int;
	private var g_id:int;
	private var m_data:Hashtable;
	public function Init():void
	{
		itemIcon.Init();
		itemDescription.Init();
		leftTime.Init();
		leftTimeIcon.Init();
		divideline.Init();
		alert.Init();
		
		btnGoto.Init();
		btnGoto.OnClick = handleClick;
		labelGoto.Init();
	}
	
	private function handleClick():void
	{
		var data:Object = BuffAndAlert.instance().getSubMenuInfor(g_type, g_id); 
		var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
		if ( bufferMenu != null )
			bufferMenu.pushSubMenu(data);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		itemIcon.Draw();
		itemDescription.Draw();
		
		if(g_isDisplayProBar)
		{
			leftTime.Draw();
			leftTimeIcon.Draw();
		}
		else
		{
			alert.Draw();
		}
		
		btnGoto.Draw();
		labelGoto.Draw();

		divideline.Draw();
		
		GUI.EndGroup();
	}
	
	public function Update()
	{
		if(g_isDisplayProBar)
		{
			var present:long = GameMain.unixtime();
			if(present - g_lastTime >= 1)
			{
				if(g_endTime - present >= 0)
				{
					leftTime.txt = _Global.timeFormatStr(g_endTime - present);
					g_lastTime = present;				
				}
				else
				{
					g_isDisplayProBar = false;
					var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
					if ( bufferMenu != null )
						bufferMenu.resetMenuPage();	
				}
			}				
		}
	}
	
	public function SetRowData(data:Object):void
	{
		m_data = data as Hashtable;
		g_type = m_data["type"];
		g_id = m_data["itemId"];
	
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(m_data["path"]);
		//itemIcon.tile.name = m_data["path"];
		
		itemDescription.txt = m_data["description"] + "";
		
		g_lastTime = GameMain.unixtime();
		g_endTime = _Global.INT64(m_data["endTime"]);
		
		if(m_data["canClick"])
		{
			btnGoto.SetVisible(true);
			labelGoto.SetVisible(true);		
		}
		else
		{
			btnGoto.SetVisible(false);
			labelGoto.SetVisible(false);				
		}
		
		alert.txt = m_data["alert"];

		if(g_endTime - g_lastTime > 0)
		{
			leftTime.txt = _Global.timeFormatStr(g_endTime - g_lastTime);
			g_isDisplayProBar = true;
		}
		else
		{
			g_isDisplayProBar = false;
		}
	}
}