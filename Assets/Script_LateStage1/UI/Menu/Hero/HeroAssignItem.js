public class HeroAssignItem extends ListItem
{
	private enum HeroAssignItemStatus
	{
		Assign,
		Gift
	};
	
	// Common status
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var headBack : Label;
	@SerializeField
	private var head : Label;
    @SerializeField
    private var headAlpha : Label;
    @SerializeField
	private var headDetail : Button;
	@SerializeField
	private var headFrame : Label;
	@SerializeField
	private var detail : Button;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var line : Label;
	// Assign status
	@SerializeField
	private var exploreBack : Label;
	@SerializeField
	private var exploreTime : Label;
	@SerializeField
	private var exploreTips : Label;
	@SerializeField
	private var renownBar : PercentBar;
	@SerializeField
	private var level : Label;
	@SerializeField
	private var skillName : Label[];
	@SerializeField
	private var assign : Button;
	// Gift status
	@SerializeField
	private var friendshipBar : PercentBar;
    @SerializeField
	private var friendshipBarText : Label;
	@SerializeField
	private var friendship : Label;
	@SerializeField
	private var gift : Button;
	
	private var status : HeroAssignItemStatus = HeroAssignItemStatus.Assign;
	private var heroInfo : KBN.HeroInfo = null;
	
	public function Init() : void
	{
	    detail.txt = Datas.getArString("HeroHouse.Assign_HeroDetail");
	    assign.txt = Datas.getArString("HeroHouse.AssignButton");
	    gift.txt = Datas.getArString("HeroHouse.GiftButton");
	    friendship.txt = Datas.getArString("HeroHouse.Assign_Friendship");
	    exploreTips.txt = Datas.getArString("HeroHouse.ExploreNoTime");
	    
	    assign.changeToBlueNew();
	    gift.changeToBlueNew();

	    headFrame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
	    level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
	    attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
	    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
	    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");

		headDetail.OnClick = OnDetailClick;
		detail.OnClick = OnDetailClick;
		assign.OnClick = OnAssignClick;
		gift.OnClick = OnGiftClick;
	}
	
	public function Update() : void
	{

	}
	
	public function Draw() : int
	{
        if (heroInfo == null)
        {
            return;
    	}
	    
		GUI.BeginGroup(rect);
		heroName.Draw();
		headBack.Draw();
		head.Draw();
		if (status == HeroAssignItemStatus.Gift)
		{
		    headAlpha.Draw();
		}
		headDetail.Draw();
		headFrame.Draw();
		detail.Draw();
		attack.Draw();
		health.Draw();
		load.Draw();
		line.Draw();
		switch (status)
		{
		    case HeroAssignItemStatus.Assign:
		    	exploreBack.Draw();
		    	exploreTime.Draw();
		    	exploreTips.Draw();
		    	renownBar.Draw();
		    	level.Draw();
		    	for (var i : Label in skillName)
		    	{
		    		i.Draw();
		    	}
		    	assign.Draw();
		    	break;
		    case HeroAssignItemStatus.Gift:
		    	friendshipBar.Draw();
                friendshipBarText.Draw();
		    	friendship.Draw();
		    	gift.Draw();
		    	break;
		}
		GUI.EndGroup();
		
		return -1;
	}
	
	public function SetRowData(data : Object) : void
	{
	    heroInfo = data as KBN.HeroInfo;
	    UpdateData();
	}

	public function UpdateData() : void
    {
        if (heroInfo == null)
        {
            return;
    	}

        switch (heroInfo.Status)
	    {
	        case KBN.HeroStatus.Unassigned:
	            status = HeroAssignItemStatus.Assign;
	            break;
	        case KBN.HeroStatus.Unlocked:
	            status = HeroAssignItemStatus.Gift;
	            break;
	    }

	    heroName.txt = heroInfo.Name;
	    level.txt = heroInfo.Level.ToString();
	    headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
	    friendshipBarText.txt = String.Format("{0}/{1}", heroInfo.Renown.ToString(), heroInfo.NextRenown.ToString());
	    friendshipBar.Init(heroInfo.Renown, heroInfo.NextRenown);
	    if (heroInfo.CanLevelup)
    	{
    		renownBar.Init(heroInfo.Renown, heroInfo.NextRenown);
    	}
        else
        {
        	renownBar.Init(1, 1);
        }
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
	    load.txt = heroInfo.Load.ToString();
	    var skillIndex : int = 0;
	    var fateIndex : int = 0;
	    for (var i : Label in skillName)
	    {
            if (skillIndex < heroInfo.Skill.Count)
	        {
                i.txt = heroInfo.Skill[skillIndex].Name;
                i.SetNormalTxtColor(heroInfo.Skill[skillIndex].Actived ? FontColor.Light_Yellow : FontColor.Description_Light);
                skillIndex++;
	        }
            else if (fateIndex < heroInfo.Fate.Count)
            {
                i.txt = heroInfo.Fate[fateIndex].Name;
                i.SetNormalTxtColor(heroInfo.Fate[fateIndex].Actived ? FontColor.Light_Yellow : FontColor.Description_Light);
                fateIndex++;
            }
            else
            {
                i.txt = String.Empty;
            }
        }
        if (heroInfo.Explored < heroInfo.MaxExplore)
        {
        	exploreTime.txt = String.Format(Datas.getArString("HeroHouse.ExploreTime"), heroInfo.MaxExplore - heroInfo.Explored, heroInfo.MaxExplore);
        	exploreTime.SetVisible(true);
        	exploreTips.SetVisible(false);
        }
        else
        {
        	exploreTime.SetVisible(false);
        	exploreTips.SetVisible(true);
        }
        UpdateLevelFrame();
    }
	
	private function OnDetailClick(param : Object) : void
	{
		var heroAssign : HeroAssign = MenuMgr.getInstance().getMenu("HeroAssign") as HeroAssign;
		if (heroAssign == null)
		{
		    return;
		}

		heroAssign.OpenHeroDetail(heroInfo);
	}
	
	private function OnAssignClick(param : Object) : void
	{
	    var heroAssign : HeroAssign = MenuMgr.getInstance().getMenu("HeroAssign") as HeroAssign;
	    if (heroAssign == null)
	    {
	        return;
	    }

	    heroAssign.RequestAssign(heroInfo);
	}
	
	private function OnGiftClick(param : Object) : void
	{
		MenuMgr.getInstance().PushMenu("HeroGift", heroInfo, "trans_zoomComp");
	}
	
	private function UpdateLevelFrame()
	{
	    if(heroInfo != null)
	    {
		    if(heroInfo.Elevate == 0)
		    {
		    	 level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
		    }
		   	else
		   	{
		   		level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe" + heroInfo.Elevate);
		   	}
	   }
	}
}