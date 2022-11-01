class ServerMergeWelcomeMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Description:Label;
	
	public var l_bg:Label;
	public var l_notice1:Label;
	public var l_noticeIcon1:Label;
	public var l_Line1:Label;
	public var l_notice2:Label;
	public var l_noticeIcon2:Label;
	public var l_Line2:Label;
	public var l_notice3:Label;
	public var l_noticeIcon3:Label;
	public var l_Line3:Label;
	public var l_notice4:Label;
	public var l_noticeIcon4:Label;
	
	public var frameOffset : RectOffset;
	
	public var btnOK:Button;
	private var m_strFromServerName : String;
	
	public function Init()
	{
		super.Init();
		InitTextureComponent();
		InitTextString();
		
		btnOK.OnClick = OnOKClick;
		
	}
	
	public function DrawItem()
	{
		
		l_Description.Draw();
		l_bg.Draw();
		l_notice1.Draw();
		l_noticeIcon1.Draw();
		l_Line1.Draw();
		l_notice2.Draw();
		l_noticeIcon2.Draw();
		l_Line2.Draw();
		l_notice3.Draw();
		l_noticeIcon3.Draw();
		l_Line3.Draw();
		l_notice4.Draw();
		l_noticeIcon4.Draw();
		btnOK.Draw();
	}
	
	public function DrawLastItem()
	{
		l_Title.Draw();
	}
	
	public function OnPush(param:Object):void
	{
		m_strFromServerName = param as String;
		if(String.IsNullOrEmpty(m_strFromServerName)) return;
		l_Description.txt = String.Format(Datas.getArString("NewWorld.Notice_Desc"),m_strFromServerName);
	}
	
	private function InitTextureComponent()
	{
		l_Title.setBackground("level_up_bg",TextureType.DECORATION);
		l_bg.setBackground("square_black2",TextureType.DECORATION);
		l_noticeIcon1.setBackground("icon_alliance_Fist",TextureType.ICON);
		l_noticeIcon2.setBackground("icon_alliance_Fist",TextureType.ICON);
		l_noticeIcon3.setBackground("icon_alliance_Fist",TextureType.ICON);
		l_noticeIcon4.setBackground("icon_alliance_Fist",TextureType.ICON);
		l_Line1.setBackground("between line_list_small",TextureType.DECORATION);
		l_Line2.setBackground("between line_list_small",TextureType.DECORATION);
		l_Line3.setBackground("between line_list_small",TextureType.DECORATION);
		
		btnOK.changeToBlueNew();
	}
	
	private function InitTextString()
	{
		l_Title.txt = Datas.getArString("NewWorld.Notice_Title");
		l_notice1.txt = Datas.getArString("NewWorld.Notice_Text1");
		l_notice2.txt = Datas.getArString("NewWorld.Notice_Text2");
		l_notice3.txt = Datas.getArString("NewWorld.Notice_Text3");
		l_notice4.txt = Datas.getArString("NewWorld.Notice_Text4");
		btnOK.txt = Datas.getArString("Common.OK_Button");
	}
	
	private function OnOKClick()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function resetLayout()
    {
        ResetLayoutWithRectOffset(frameOffset);
    }
}