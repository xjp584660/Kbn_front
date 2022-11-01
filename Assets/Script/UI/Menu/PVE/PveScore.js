class PveScore extends UIObject
{
	//public var back:SimpleLabel;
	public var back:Button;
	public var scoreIcon:Label;
	public function Init():void
	{
//		if(back.mystyle.normal.background == null)
//		{
//			back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_score_bg",TextureType.DECORATION);
//		}
		
		//back.setNorAndActBG("button_score_bg","button_score_bg");
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_score_bg", TextureType.DECORATION);
		back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_score_bg", TextureType.DECORATION);
		back.OnClick = handleClick;
		scoreIcon.setBackground("button_score_chapter",TextureType.BUTTON);
		
	}
	
	public function Draw()
	{
		back.Draw();
		scoreIcon.Draw();
	}
	
	public function Update()
	{
	}
	
	public function SetData(scoreNum:int)
	{
		back.txt = scoreNum+"";
	}
	
	public function handleClick()
	{
		MenuMgr.getInstance().PushMenu("PveLeaderboardMenu",Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE,"trans_zoomComp" );
	}
	
}