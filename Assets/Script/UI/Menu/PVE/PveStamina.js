class PveStamina extends UIObject
{
	//public var back:SimpleLabel;
	public var back:Button;
	public var bottleIcon:Label;
	public function Init():void
	{
		//if(back.mystyle.normal.background == null)
		//{
		//	back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_switch_small_R",TextureType.BUTTON);
		//}
		
		back.setNorAndActBG("button_switch_small_R","button_switch_small_R");
		back.OnClick = handleClick;
		bottleIcon.setBackground("stamina",TextureType.ICON);
	}
	
	public function Draw()
	{
		back.Draw();
		bottleIcon.Draw();
	}
	
	public function SetData(staminaNum:int)
	{
		back.txt = "X"+staminaNum;
	}
	
	public function Update()
	{
	}
	
	public function handleClick()
	{
		MenuMgr.getInstance().PushMenu("RefillStaminaMenu", null, "trans_zoomComp");
	}
}