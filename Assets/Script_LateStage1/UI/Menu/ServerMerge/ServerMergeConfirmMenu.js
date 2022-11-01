class ServerMergeConfirmMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Line:Label;
	
	
	public var l_bg:Label;
	public var l_circle:Label;
	public var l_light:Label;
	public var l_img:Label;
	
	public var l_ServerName:Label;
	public var l_Level:Label;
	public var l_Might:Label;
	public var l_CityCount:Label;
	public var l_ReturnGems:Label;
	
	public var l_Warning:Label;

	public var btnComfirm:Button;
	public var btnCancel:Button;
	
	public var titleBg:Label;
	public var frameLabel:SimpleLabel;
	private var backGroundRect:Rect;
	
	private var m_Data:KBN.FromServerDetail = null;
	public function Init()
	{	
		super.Init();
		
		l_Line.setBackground("between line",TextureType.DECORATION);
		l_bg.setBackground("report-cup-bg",TextureType.DECORATION);
		l_circle.tile = TextureMgr.instance().GetGearIcon("Round_CheckBox");
		l_light.setBackground("light_box",TextureType.DECORATION);
		l_img.mystyle.normal.background = TextureMgr.instance().loadBuildingTextureFromSprite("f1_0_1_1");
		btnComfirm.changeToBlueNew();
		btnCancel.changeToBlueNew();
		l_Title.txt = Datas.getArString("MergeServer.Confirm_Title");
		btnComfirm.txt = Datas.getArString("Common.Confirm");
		btnCancel.txt = Datas.getArString("Common.Cancel");
		
		btnComfirm.OnClick = OnConfirm;
		btnCancel.OnClick = OnClose;
		btnClose.OnClick = OnClose;
		
		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		
		bgStartY = 31;
		
		backGroundRect = Rect( 5, 5, rect.width, rect.height - 10);
		
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		frameLabel.useTile = true;
		var iconSpt : TileSprite = texMgr.IconSpt();
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		frameLabel.rect = frameSimpleLabel.rect;
		frameLabel.rect.y = frameLabel.rect.y + bgStartY;
		frameLabel.rect.height = frameLabel.rect.height - bgStartY;
		
		frameSimpleLabel.useTile = false;
		btnClose.rect.y = 20;
		btnClose.rect.x = 475;
	}
	
	public function OnPush(param:Object):void
	{
		m_Data = param as KBN.FromServerDetail;
		if(m_Data == null) return;
		
		l_ServerName.txt = m_Data.serverName;
		l_Level.txt = Datas.getArString("Common.Level") + ":" + m_Data.level;
		l_Might.txt = String.Format(Datas.getArString("MergeServer.ServerData_Might"),m_Data.might);
		l_CityCount.txt = String.Format(Datas.getArString("MergeServer.ServerData_City"),m_Data.cityCount);
		l_ReturnGems.txt = String.Format(Datas.getArString("MergeServer.ServerData_Gem"),KBN.MergeServerManager.getInstance().MyServerMergeDetail.GetTotalReturnGems());
		l_Warning.txt = String.Format(Datas.getArString("MergeServer.Confirm_Notice"),m_Data.serverName,KBN.MergeServerManager.getInstance().MyServerMergeDetail.TargetServerName);
	}
	
 	public function Draw()
 	{
		super.Draw();	
 	}
	
	public function DrawItem()
	{
		frameLabel.Draw();
		titleBg.Draw();
	
		l_Title.Draw();
		l_Line.Draw();
		l_bg.Draw();
		l_circle.Draw();
		l_light.Draw();
		l_img.Draw();
		l_ServerName.Draw();
		l_Level.Draw();
		l_Might.Draw();
		l_CityCount.Draw();
		l_ReturnGems.Draw();
		l_Warning.Draw();
		
		btnClose.Draw();
		btnComfirm.Draw();
		btnCancel.Draw();
	}
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backGroundRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}
	
	private function OnClose()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function OnConfirm()
	{
		MenuMgr.getInstance().PopMenu("");
		KBN.MergeServerManager.getInstance().RequestChoice(m_Data.serverId);
	}
}