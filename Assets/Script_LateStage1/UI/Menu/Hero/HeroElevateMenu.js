class HeroElevateMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Line:Label;
	public var l_Description:Label;

	public var l_Kuang:Label;
	public var l_HeroName:Label;
	
	public var l_MaxLevelIcon:Label;
	public var l_MaxLevelTitle:Label;
	public var l_HeroMaxLevelDesc:Label;
	public var l_SkillMaxLevelDesc:Label;
	
	public var l_divideLine:Label;
	
	public var l_NewSkillIcon:Label;
	public var l_NewSkillTitle:Label;
	public var l_NewSkillName:Label;
	public var l_NewSkillDesc:Label;
//	public var l_NewSkill3:Label;
//	public var l_NewSkill4:Label;
	
	
	public var l_ConditionTitle:Label;
	
	public var scrollReq:ScrollList;
	public var item:ListItem;
	
	
	public var btnElevate:Button;
	public var l_warning:Label;
	
	private var m_FromMenu:String = "";
	
	private var hero:KBN.HeroInfo = null;
	public function Init()
	{
		super.Init();
		InitTextureComponent();
		InitTextString();
		
		scrollReq.Init(item);
		btnClose.OnClick = OnClose;
		btnElevate.OnClick = OnElevate;
		
	}
	
	private function InitTextureComponent()
	{
		btnClose.setNorAndActBG("button_popup1_close_normal","button_popup1_close_down");
		l_Line.setBackground("between line",TextureType.DECORATION);
		l_Kuang.setBackground("Quest_kuang",TextureType.DECORATION);
		l_NewSkillIcon.setBackground("icon_heroskill",TextureType.ICON);
		l_divideLine.setBackground("between line_list_small",TextureType.DECORATION);
		l_MaxLevelIcon.setBackground("icon_herolevel",TextureType.ICON);
		l_ConditionTitle.setBackground("Quest_kuang1",TextureType.DECORATION);
		
		btnElevate.changeToBlueNew();
	}
	
	private function InitTextString()
	{
		btnElevate.txt = Datas.getArString("Hero.Elevate");
		l_Title.txt = Datas.getArString("Hero.Elevate_Title");
		l_Description.txt = Datas.getArString("Hero.Elevate_Desc");
		l_MaxLevelTitle.txt = Datas.getArString("Hero.Elevate_Detail_Maximum");
		l_NewSkillTitle.txt = Datas.getArString("Hero.Elevate_Detail_Skill");
		l_ConditionTitle.txt = Datas.getArString("Hero.Elevate_Requirement_Title");
		l_warning.txt = Datas.getArString("Hero.Elevate_Fail_Notice");
		
	}
	
	public function Update()
	{
		scrollReq.Update();
	}
	
	public function DrawItem()
	{
		l_Title.Draw();
		l_Line.Draw();
		l_Description.Draw();
		l_Kuang.Draw();
		l_HeroName.Draw();
		l_MaxLevelIcon.Draw();
		l_MaxLevelTitle.Draw();
		l_HeroMaxLevelDesc.Draw();
		l_SkillMaxLevelDesc.Draw();
		l_divideLine.Draw();
		l_NewSkillIcon.Draw();
		l_NewSkillTitle.Draw();
		l_NewSkillName.Draw();
		
		l_ConditionTitle.Draw();
		btnElevate.Draw();
		scrollReq.Draw();
		l_warning.Draw();
	}
	
	public function OnPush(param:Object):void
	{
	
		var paramTable : Hashtable = param as Hashtable;
	    hero = paramTable["hero"] as KBN.HeroInfo;
	    m_FromMenu = paramTable["from"] as String;
		
		//only one new skill or new fate with one elevate
		var newSkill:KBN.HeroSkill = hero.ElevateNewSkill();
		if(newSkill == null)
		{
			newSkill = hero.ElevateNewFate();
		}
		var reqList:Array = hero.GetElevateReqList().ToArray();
		var bAllEnough:boolean = true;
		var reqItem:KBN.HeroElevateReqItem = null;
		for(var i:int=0;i<reqList.length;i++)
		{
			reqItem = reqList[i] as KBN.HeroElevateReqItem;
			if(reqItem != null && reqItem.CurNum < reqItem.ReqNum)
			{
				bAllEnough = false;
				break;	
			}
		}
		l_HeroName.txt = Datas.getArString(hero.Name);
		l_HeroMaxLevelDesc.txt = String.Format(Datas.getArString("Hero.Elevate_Detail_MaxLv"),hero.MaxLevelOfElevate(hero.Elevate + 1));
		l_SkillMaxLevelDesc.txt = String.Format(Datas.getArString("Hero.Elevate_Detail_MaxSkillLv"),hero.MaxSkillLevelOfElevate(hero.Elevate + 1));
		scrollReq.SetData(hero.GetElevateReqList().ToArray());
		btnElevate.SetVisible(bAllEnough);
		l_warning.SetVisible(!bAllEnough);
		if(newSkill != null)
		{
			l_NewSkillName.txt = newSkill.Name;
		}
		else
		{
			l_NewSkillName.txt = Datas.getArString("Hero.Elevate_Detail_FullSkill");
		}
		
	}
	
	public function OnPopOver()
	{
		scrollReq.Clear();
	}
	
	private function OnClose()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function OnElevate()
	{
		MenuMgr.getInstance().PopMenu("");
		KBN.HeroManager.Instance.RequestHeroElevate(hero.Id,m_FromMenu);
	}
	
	private function OnSkillHelp()
	{
		
	}
	
	
	
	
}