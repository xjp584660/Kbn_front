
class PveStar extends UIObject
{
	//public var back:SimpleLabel;
	public var back:Button;
	public var star:Label;
	//@SerializeField private var :Label;
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
		star.setBackground("BIGstar",TextureType.ICON);
	}
	
	public function Draw()
	{
		back.Draw();
		star.Draw();
	}
	
	public function Update()
	{
	}
	
	public function SetData(starNum:int)
	{
		back.txt = starNum+"";
	}
	
	public function handleClick()
	{
//		MenuMgr.getInstance().PushMenu("HidenBossMenu",null,"trans_zoomComp" );
//		MenuMgr.getInstance().PushMenu("PveResultMenu",null,"trans_down" );
		KBN.PveController.instance().CheckLevelUp();
	}
}