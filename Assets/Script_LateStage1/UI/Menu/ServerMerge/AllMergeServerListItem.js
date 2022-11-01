class AllMergeServerListItem extends ListItem
{
	public var l_startLineL:Label;
	public var l_startLineR:Label;
	public var l_StartTime:Label;
	public var l_bg:Label;
	public var serverList:SimpleLabel[];
	public var LISTITEM_X:float = 50.0f;
	public var LISTITEM_W:float = 300.0f;
	public var LISTITEM_H:float = 30.0f;
	
	public var l_Line:Label;
	public var l_TargetServer:Label;
	
	private var m_Data:KBN.MergerServerUnit = null;
	
	public function Init():void
	{
//		l_startLineL.setBackground("between line_list_small",TextureType.DECORATION);
//		l_startLineR.setBackground("between line_list_small",TextureType.DECORATION);
//		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
//		l_bg.setBackground("ui_hero_frame",TextureType.DECORATION);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		l_startLineL.Draw();
		l_startLineR.Draw();
		l_StartTime.Draw();
		l_bg.Draw();
		for(var i:int=0;i<serverList.Length;i++)
		{
			serverList[i].Draw();
		}
		l_Line.Draw();
		l_TargetServer.Draw();
		
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object):void
	{
		m_Data = data as KBN.MergerServerUnit;
		if(m_Data == null) return;
//		
//		l_startLineL.setBackground("between line_list_small",TextureType.DECORATION);
//		l_startLineR.setBackground("between line_list_small",TextureType.DECORATION);
//		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
//		l_bg.setBackground("square_black2",TextureType.DECORATION);
		
		l_StartTime.txt = String.Format(Datas.getArString("MergeServer.Detail_Info_Time"), _Global.DateTime(m_Data.StartTime));
		l_TargetServer.txt = String.Format(Datas.getArString("MergeServer.Detail_Info_State"),m_Data.TargetServerName);
		
		l_bg.rect.y = l_StartTime.rect.y + l_StartTime.GetTxtHeight() + 5;
		
		serverList = new SimpleLabel[m_Data.FromServerList.Count];
		
		var beginY:int = l_bg.rect.y + 20;
		for(var i:int=0;i<serverList.Length;i++)
		{
			serverList[i] = new SimpleLabel();
			var itemLabel:SimpleLabel = serverList[i] as SimpleLabel;
			itemLabel.rect.x = LISTITEM_X;
			itemLabel.rect.y = beginY;
			itemLabel.rect.width = LISTITEM_W;
			itemLabel.rect.height = LISTITEM_H;
			itemLabel.txt = m_Data.FromServerList[i].ServerName;
			itemLabel.SetNormalTxtColor(FontColor.New_Level_Yellow);
			
			beginY =  beginY + LISTITEM_H - 5;
		}
		
		l_Line.rect.y = beginY + 5;
		l_TargetServer.rect.y = l_Line.rect.y + 10;
		l_bg.rect.height = l_TargetServer.rect.y + l_TargetServer.GetTxtHeight() + 20 - l_bg.rect.y;
		
		rect. height = l_bg.rect.y + l_bg.rect.height + 10;
		
		
	}
	
	
	
}