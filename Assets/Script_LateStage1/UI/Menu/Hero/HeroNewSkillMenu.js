class HeroNewSkillMenu extends PopMenu
{
	public var l_NewSkillName:Label;
	public var l_Condition:Label;
	public var l_Description:Label;
	public var l_Kuang:Label;
	public var l_Line:Label;
	
	private var skill:KBN.HeroSkill = null;
	public function Init()
	{
		super.Init();
		l_Kuang.setBackground("quest_pointkuang",TextureType.DECORATION);
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		btnClose.OnClick = OnClose;
	}
	
	public function DrawItem()
	{
		
	}
	
	public function OnPush(param:Object):void
	{
		
	}
	
	private function OnClose()
	{
		MenuMgr.getInstance().PopMenu("");
	}
}