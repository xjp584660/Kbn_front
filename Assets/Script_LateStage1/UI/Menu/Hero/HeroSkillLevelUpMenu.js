class HeroSkillLevelUpMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Line:Label;
	public var l_Description:Label;

	public var l_Kuang:Label;
	public var l_SkillNameLevel:Label;
	public var l_NextLevelDesc1:Label;
	public var l_NextLevelDesc2:Label;
	public var l_Condition:Label;
	
	public var reqScroll:ScrollList;
	public var item:ListItem;
	public var btnLevelUp:Button;
	public var l_warning:Label;
	
	private var skill:KBN.HeroSkill = null;
	public function Init()
	{
		super.Init();
		reqScroll.Init(item);
		InitTextureComponent();
		InitTextString();
		
		btnLevelUp.OnClick = OnSkillLevelUp;
		btnClose.OnClick = OnClose;
	}
	
	public function DrawItem()
	{
		l_Title.Draw();
		l_Line.Draw();
		l_Description.Draw();
		l_Kuang.Draw();
		l_SkillNameLevel.Draw();
		l_NextLevelDesc1.Draw();
//		l_NextLevelDesc2.Draw();
		l_Condition.Draw();
		reqScroll.Draw();
		l_warning.Draw();
		btnLevelUp.Draw();
	}
	
	public function Update()
	{
		reqScroll.Update();
	}
	
	public function OnPush(param:Object):void
	{
		skill = param as KBN.HeroSkill;
		Refresh();
	}
	
	public function OnPopOver()
	{
		reqScroll.Clear();
	}
	
	private function OnSkillLevelUp()
	{
		MenuMgr.getInstance().PopMenu("");
		KBN.HeroManager.Instance.RequestHeroSkillLevelUp(skill.Type);
	}
	
	private function OnClose()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function InitTextureComponent()
	{
		l_Line.setBackground("between line",TextureType.DECORATION);
		l_Kuang.setBackground("Quest_kuang",TextureType.DECORATION);
		l_Condition.setBackground("Quest_kuang1",TextureType.DECORATION);
	}
	
	private function InitTextString()
	{
		btnLevelUp.txt = Datas.getArString("HeroSkill.LevelUp");
		l_Title.txt = Datas.getArString("HeroSkill.LevelUp_Title");
		l_Description.txt = Datas.getArString("HeroSkill.LevelUp_Desc");
		
		l_Condition.txt = Datas.getArString("Hero.Upgrade_Requirement_Title");
		l_warning.txt = Datas.getArString("HeroSkill.LevelUp_Fail_Notice");
	}
	
	private function Refresh()
	{
		reqScroll.SetData(skill.GetlevelUpReqList().ToArray());
		var bAllEnough:boolean = true;
		for(var item in skill.GetlevelUpReqList())
		{
			if(!item.bEnough)
			{
				bAllEnough = false;
				break;
			}
		}
		l_SkillNameLevel.txt = Datas.getArString(skill.Name) + " Lv" + skill.Level;
		l_NextLevelDesc1.txt = Datas.getArString("HeroSkill.LevelUp_Detail") + skill.NextLevel + "  " + skill.GetNextLevelDescription();
		l_warning.SetVisible(!bAllEnough);
		btnLevelUp.SetVisible(bAllEnough);
	}
	
	
	
}