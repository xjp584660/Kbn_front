public class HeroDetailView extends PopMenu
{
	@SerializeField
	private var line : Label;
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var headBack : Label;
	@SerializeField
	private var head : Label;
    @SerializeField
	private var headAlpha : Label;
    @SerializeField
	private var frame : Label;
	@SerializeField
	private var level : Label;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
    @SerializeField
	private var sleepStatus : Label;
    @SerializeField
	private var sleepTime : Label;
    @SerializeField
	private var marchStatus : Label;
	@SerializeField
	private var might : Label;
    @SerializeField
    private var renown : Label;
    @SerializeField
    private var unlockDescription : Label;
	@SerializeField
	private var skillBar : ToolBar;
	@SerializeField
	private var skillItem : HeroSkillViewItem;
	@SerializeField
	private var skillList : ScrollList;
	@SerializeField
	private var fateList : ScrollList;
	@SerializeField
	private var legend : Label;
	
	private var heroInfo : KBN.HeroInfo = null;

	public function Init() : void
 	{
 		super.Init();
 		
 		title.txt = Datas.getArString("HeroHouse.Detail_Title");
 		sleepStatus.txt = Datas.getArString("HeroHouse.HeroState2");
 		marchStatus.txt = Datas.getArString("HeroHouse.HeroState3");

 		frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
 		level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
 		attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
 		health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
 		load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
 		marchStatus.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_march");
 		sleepStatus.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_sleep");
 		sleepTime.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_time");

 		skillBar.Init();
 		var skill : String = Datas.getArString("HeroHouse.Detail_SubTitle1");
		var fate : String = Datas.getArString("HeroHouse.Detail_SubTitle2");
		var legend : String = Datas.getArString("HeroHouse.Detail_SubTitle3");
 		skillBar.toolbarStrings = [skill, fate, legend];
 		skillBar.indexChangedFunc = OnSkillBarChanged;
 		
 		skillList.Init(skillItem);
 		fateList.Init(skillItem);
	}
 	
 	public function Update() : void
	{
		super.Update();
		
		skillList.Update();
		fateList.Update();

		if (heroInfo.Status == KBN.HeroStatus.Sleeping)
		{
		    sleepTime.txt = heroInfo.SleepTimeDescripiton;
		}
	}
	
	public function DrawItem() : void
	{
		line.Draw();
		heroName.Draw();
	    headBack.Draw();
	    head.Draw();
	    if (heroInfo.Status == KBN.HeroStatus.Locked || heroInfo.Status == KBN.HeroStatus.Unlocked)
	    {
	        headAlpha.Draw();
	    }
	    frame.Draw();
	    if (heroInfo.Status != KBN.HeroStatus.Locked && heroInfo.Status != KBN.HeroStatus.Unlocked)
	    {
	        level.Draw();
	    }
	    if (heroInfo.Status == KBN.HeroStatus.Locked)
	    {
	        unlockDescription.Draw();
	    }
	    else
	    {
	        attack.Draw();
	        health.Draw();
	        load.Draw();
	        might.Draw();
	        renown.Draw();
	    }

		switch (heroInfo.Status)
		{
		    case KBN.HeroStatus.Assigned:
		        break;
		    case KBN.HeroStatus.Marching:
		        marchStatus.Draw();
		        break;
		    case KBN.HeroStatus.Sleeping:
		        sleepStatus.Draw();
		        sleepTime.Draw();
		        break;
		}

		skillBar.Draw();
		switch (skillBar.selectedIndex)
		{
		    case 0:
		    	skillList.Draw();
		    	break;
		    case 1:
		    	fateList.Draw();
		    	break;
		    case 2:
		    	legend.Draw();
		    	break;
		}
	}

	public function OnPush(param : Object) : void
	{
		super.OnPush(param);
		
	    heroInfo = param as KBN.HeroInfo;
	    
		headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
		head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
		
		skillBar.selectedIndex = 0;
		RefreshHeroDetail();
	}
	
	public function OnPushOver() : void
	{
		super.OnPushOver();
	}

	public function OnPop() : void
	{
		super.OnPop();
	}

	public function OnPopOver() : void
	{
	    skillList.Clear();
	    fateList.Clear();
	
		super.OnPopOver();
	}

	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
	        case Constant.Hero.HeroBoosted:
	            RefreshHeroDetail();
	            break;
            case Constant.Hero.HeroStatusUpdated:
                RefreshHeroDetail();
                break;
	    }
	}
	
	private function OnSkillBarChanged(index : int)
	{
		switch (index)
		{
		    case 0:
		    	RefreshHeroSkillList();
		    	break;
		    case 1:
		    	RefreshHeroFateList();
		    	break;
		    case 2:
		    	RefreshHeroLegend();
		    	break;
		}
	}

	private function RefreshHeroDetail() : void
    {
		heroName.txt = heroInfo.Name;
	    level.txt = heroInfo.Level.ToString();
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
	    load.txt = heroInfo.Load.ToString();
	    might.txt = String.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Status != KBN.HeroStatus.Locked && heroInfo.Status != KBN.HeroStatus.Unlocked ? heroInfo.Might.ToString() : "???");

    	if (heroInfo.CanLevelup)
    	{
    		renown.txt = String.Format(Datas.getArString("HeroHouse.Gift_HeroRenown"), heroInfo.Renown.ToString(), heroInfo.NextRenown.ToString());
    	}
        else
        {
        	renown.txt = Datas.getArString("HeroHouse.HeroRenownMax_Text");
        }
	    
	    unlockDescription.txt = heroInfo.UnlockDescription;
	    OnSkillBarChanged(skillBar.selectedIndex);
    }
	
	private function RefreshHeroSkillList() : void
	{
		skillList.SetData((heroInfo.Skill as List.<KBN.HeroSkill>).ToArray());
		skillList.ResetPos();
	}
	
	private function RefreshHeroFateList() : void
	{
		fateList.SetData((heroInfo.Fate as List.<KBN.HeroSkill>).ToArray());
		fateList.ResetPos();
	}
	
	private function RefreshHeroLegend() : void
	{
		legend.txt = heroInfo.Legend;
	}
}
