class TournamentLostTileMenu extends KBNMenu
{
	@SerializeField private var m_dlgFrame : SimpleLabel;
	@SerializeField private var m_dlgInterior : SimpleLabel;
	@SerializeField private var m_frameRect : Rect;
	@SerializeField private var m_revengeBtn : Button;
	@SerializeField private var m_title : Label;
	@SerializeField private var m_brief : Label;
	@SerializeField private var m_tileIcon : Label;
	@SerializeField private var m_splitter : Label;
	
	
	public function Init():void
	{
		super.Init();
		
		m_dlgFrame.Sys_Constructor();
		m_dlgFrame.mystyle.border = new RectOffset(68, 68, 68, 68);
		if( m_dlgFrame.mystyle.normal.background == null )
		{
			m_dlgFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("popup1_transparent",TextureType.DECORATION);
		}
		if(m_dlgInterior.mystyle.normal.background == null)
		{
			m_dlgInterior.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}
		
		m_splitter.setBackground( "between line", TextureType.DECORATION );
		
		m_tileIcon.setBackground( "tournament_1x1_act", TextureType.MAP17D3A_TILE );
		m_tileIcon.rect.x = 221;
		m_tileIcon.rect.y = 506;
		m_tileIcon.rect.width = 200;
		m_tileIcon.rect.height = 120;
		
		// Button
		btnClose.mystyle.normal.background = TextureMgr.instance().LoadTexture( "button_popup1_close_normal", TextureType.BUTTON );
		btnClose.mystyle.active.background = TextureMgr.instance().LoadTexture( "button_popup1_close_down", TextureType.BUTTON );
		btnClose.OnClick = onClickCloseButton;
		m_revengeBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture( "button_60_blue_normalnew", TextureType.BUTTON );
		m_revengeBtn.mystyle.active.background = TextureMgr.instance().LoadTexture( "button_60_blue_downnew", TextureType.BUTTON );
		m_revengeBtn.OnClick = onClickRevengeButton;
		
		// Text
		m_title.txt = Datas.getArString( "PVP.Report_Warning_Title" );
		m_brief.txt = String.Format( Datas.getArString("PVP.Report_Warning_Notice"), "0", "0", "0" );
		
		m_revengeBtn.txt = Datas.getArString( "PVP.Report_Warning_ViewBtn" );
		
		resetLayout();
	}
	
	public function resetLayout()
	{
		m_dlgFrame.rect.x = m_frameRect.x;
		m_dlgFrame.rect.y = m_frameRect.y;
		m_dlgFrame.rect.width = m_frameRect.width;
		m_dlgFrame.rect.height = m_frameRect.height - 3;
	}
	
	
	public function DrawItem()
	{
		m_revengeBtn.mystyle.normal.textColor = new Color(1f, 1f, 1f);
		m_splitter.Draw();
		m_title.Draw();
		m_brief.Draw();
		m_tileIcon.Draw();
		m_revengeBtn.Draw();
		btnClose.Draw();
	}
	
	protected function DrawBackground()
	{
		GUI.BeginGroup(m_frameRect);
			m_dlgInterior.rect = Rect(13, 13, m_frameRect.width-26, m_frameRect.height-26);
			m_dlgInterior.Draw();
		GUI.EndGroup();
		
		
		m_dlgFrame.Draw();
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
		if( param != null ) {
			var valString : String = param as String;
			var list : Array = valString.Split( "_"[0] );
			if( list.Count == 3 ) {
				m_brief.txt = String.Format( Datas.getArString("PVP.Report_Warning_Notice"),
													list[0], list[1], list[2] );
			}
		}
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	private function onClickRevengeButton()
	{
		close();
		NoticePadMenu.backButtonMotifIsHome = true;
		PvPToumamentInfoData.instance().PopUpNoticePad(2);
	}
	
	private function onClickCloseButton()
	{
		close();
	}
}