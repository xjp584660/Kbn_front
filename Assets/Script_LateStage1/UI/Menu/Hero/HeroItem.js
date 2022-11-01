

public class HeroItem extends ListItem
{
	private enum HeroItemStatus
	{
		Locked,
		Unassigned,
		Assigned
	};

	@SerializeField
	private var flashSpeed : float;
	// Common status
	@SerializeField
	private var panelBack : Label;
	@SerializeField
	private var frame : Label;
	@SerializeField
	private var level : Label;
    @SerializeField
	private var renown : PercentBar;
	@SerializeField
	private var giftBack : Label;
	// Locked status
	@SerializeField
	private var locked : Label;
	@SerializeField
	private var lock : Button;
	@SerializeField
	private var lockedDescription : Label;
	// Unassigned status
	@SerializeField
	private var free : Button;
	@SerializeField
	private var freeDescription : Label;
	@SerializeField
	private var assign : Button;
    // Assigned status
    @SerializeField
    private var headBack : Label;
    @SerializeField
    private var head : Label;
    @SerializeField
    private var info : Label;
    @SerializeField
    private var statusBack : Label;
    @SerializeField
    private var statusBack2 : Label;
    @SerializeField
    private var sleepStatus : Label;
    @SerializeField
    private var sleepTime : Label;
    @SerializeField
    private var marchStatus : Label;
	@SerializeField
	private var detail : Button;
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var skillName : Label[];
	@SerializeField
	private var speedup : Button;
	@SerializeField
	private var explore : Button;
	@SerializeField
	private var exlporeDecorationTop : Label;
	@SerializeField
	private var exlporeDecorationBottom : Label;
	@SerializeField
	private var exploreTime : Label;
	@SerializeField
	private var exploreTips : Label;
	@SerializeField
	private var gift : Button;
	@SerializeField
	private var giftFlash : Label;
	@SerializeField
	private var elevateLightPoint : Label;
	@SerializeField
    private var elevateLightPointAnimParam_X : String;
    @SerializeField
    private var elevateLightPointAnimParam_Y : String;
     @SerializeField
    private var elevateAnimRadius : float;
    @SerializeField private var animLabel:AnimationLabel;
    
    private static var Orign_X : float = 10;
    private static var Orign_Y : float = 235;
	

	private var status : HeroItemStatus = HeroItemStatus.Locked;
	private var heroSlot : KBN.HeroSlot = null;
	private var oldElevate:int = 0;

	public function Init() : void
	{
	    assign.txt = Datas.getArString("HeroHouse.AssignButton");
	    speedup.txt = Datas.getArString("Common.Speedup");
	    explore.txt = Datas.getArString("HeroHouse.ExploreButton");
	    exploreTips.txt = Datas.getArString("HeroHouse.ExploreNoTime");
	    sleepStatus.txt = Datas.getArString("HeroHouse.HeroState2");
	    marchStatus.txt = Datas.getArString("HeroHouse.HeroState3");
	    
	    assign.changeToBlueNew();
	    explore.changeToBlueNew();
	    speedup.changeToGreenNew();

	    frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
	    level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
	    locked.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lock");
	    attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
	    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
	    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
	    marchStatus.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_march");
	    sleepStatus.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_sleep");
	    sleepTime.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_time");
	    
	    info.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);
		elevateLightPoint.setBackground("ui_elevate_ef_light",TextureType.DECORATION);
	    assign.OnClick = OnAssignClick;
	    free.OnClick = OnAssignClick;
		detail.OnClick = OnDetailClick;
		lock.OnClick = OnLockClick;
		speedup.OnClick = OnSpeedUpClick;
		explore.OnClick = OnExploreClick;
		gift.OnClick = OnGiftClick;
		elevateLightPoint.SetVisible(false);
	}

	public function Update() : void
	{
	    if (status == HeroItemStatus.Assigned && heroSlot.AssignedHero.Status == KBN.HeroStatus.Sleeping)
        {
            sleepTime.txt = heroSlot.AssignedHero.SleepTimeDescripiton;
        }
        
        giftFlash.alpha = 0.5f * (1 + Mathf.Sin(Time.realtimeSinceStartup * flashSpeed));
	}

	public function Draw() : int
	{
	    if (heroSlot == null)
	    {
            return;
        }
        
		GUI.BeginGroup(rect);
		panelBack.Draw();
		switch (status)
		{
		    case HeroItemStatus.Locked:
		        locked.Draw();
		        renown.Draw();
		        frame.Draw();
		        level.Draw();
		    	lockedDescription.Draw();
		    	lock.Draw();
		    	giftBack.Draw();
		    	break;
		    case HeroItemStatus.Unassigned:
		        free.Draw();
		        renown.Draw();
		        frame.Draw();
		        level.Draw();
		    	freeDescription.Draw();
		    	assign.Draw();
		    	giftBack.Draw();
		    	break;
		    case HeroItemStatus.Assigned:
		        headBack.Draw();
		        head.Draw();
		        info.Draw();
		        giftBack.Draw();
		        gift.Draw();
		        giftFlash.Draw();
		        switch (heroSlot.AssignedHero.Status)
		        {
		            case KBN.HeroStatus.Assigned:
				    	explore.Draw();
				    	exlporeDecorationTop.Draw();
				    	exlporeDecorationBottom.Draw();
				    	exploreTime.Draw();
				    	exploreTips.Draw();
		                break;
		            case KBN.HeroStatus.Marching:
		            	statusBack.Draw();
		                marchStatus.Draw();
				    	explore.Draw();
				    	exlporeDecorationTop.Draw();
				    	exlporeDecorationBottom.Draw();
				    	exploreTime.Draw();
				    	exploreTips.Draw();
		                break;
		            case KBN.HeroStatus.Sleeping:
		            	statusBack.Draw();
		                statusBack2.Draw();
		                sleepStatus.Draw();
		                sleepTime.Draw();
		                speedup.Draw();
		                exploreTime.Draw();
						exploreTips.Draw();
		                break;
		        }
		    	detail.Draw();
		    	renown.Draw();
		    	frame.Draw();
		    	level.Draw();
		    	heroName.Draw();
		    	attack.Draw();
		    	health.Draw();
		    	load.Draw();
		    	elevateLightPoint.Draw();
		    	
		    	animLabel.Draw();
		    	for (var i : Label in skillName)
		    	{
		    		i.Draw();
		    	}
		    	break;
		}
		GUI.EndGroup();

	   	return -1;
	}

	public function SetRowData(data : Object) : void
	{
	    heroSlot = data as KBN.HeroSlot;
	    var heroInfo : KBN.HeroInfo = heroSlot.AssignedHero;
	    if(heroInfo != null)
	    {
	    	oldElevate = heroInfo.Elevate;
	    }
	    UpdateData();
	}

	private function UpdateLevelFrame()
	{
		var heroInfo : KBN.HeroInfo = heroSlot.AssignedHero;
	    if(heroInfo != null)
	    {
		    if(heroInfo.Elevate == 0)
		    {
		    	 level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
		    }
		   	else
			{
				var temp = heroInfo.Elevate;
				if (temp > 8)
					temp = 8;
				level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe" + temp);
			}
		}
		else
		{
			level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
		}
	}

    public function UpdateData() : void
    {
        if (heroSlot == null)
	    {
            return;
        }
    	switch (heroSlot.Status)
		{
		    case KBN.HeroSlotStatus.Locked:
		        status = HeroItemStatus.Locked;
		        level.txt = String.Empty;
		        renown.Init(0, 1);
		        lockedDescription.txt = heroSlot.ActiveMessage;
			    break;
		    case KBN.HeroSlotStatus.Unassigned:
		        status = HeroItemStatus.Unassigned;
		        level.txt = String.Empty;
                renown.Init(0, 1);
		        freeDescription.txt = Datas.getArString("HeroHouse.Slot_Empty_Text");
			    break;
		    case KBN.HeroSlotStatus.Assigned:
		        var heroInfo : KBN.HeroInfo = heroSlot.AssignedHero;
		        if(status == HeroItemStatus.Assigned && oldElevate != heroInfo.Elevate && heroInfo.Elevate != 0)
		        {
		        	oldElevate = heroInfo.Elevate;
		        	StartElevateLightAnim();
		        }
		        if (heroInfo.Status == KBN.HeroStatus.Sleeping)
		        {
		        	speedup.changeToGreenNew();
		        }
		        else
		        {
		        	speedup.changeToGreyNew();
		        }
		        if (heroInfo.Status == KBN.HeroStatus.Assigned && heroInfo.Explored < heroInfo.MaxExplore)
		        {
		            explore.changeToBlueNew();
		        }
		        else
		        {
		            explore.changeToGreyNew();
		        }
		        if (heroInfo.Explored < heroInfo.MaxExplore)
		        {
		        	exploreTime.SetVisible(true);
		        	exploreTips.SetVisible(false);
		        }
		        else
		        {
		        	exploreTime.SetVisible(false);
		        	exploreTips.SetVisible(true);
		        }
		        heroName.txt = heroInfo.Name;
		        level.txt = heroInfo.Level.ToString();
                headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	            head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
	            
	            if (heroInfo.CanLevelup)
	            {
	            	renown.changeThumbBG("ui_hero_bar",TextureType.DECORATION);
	            	renown.Init(heroInfo.Renown, heroInfo.NextRenown);
	            }
                else
                {
                	if(heroInfo.CanElevate)
                	{
                		renown.changeThumbBG("ui_hero_bar_elevate",TextureType.DECORATION);
                	}
                	else
                	{
                		renown.changeThumbBG("ui_hero_bar",TextureType.DECORATION);
                	}
                	renown.Init(1, 1);
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
	            exploreTime.txt = String.Format(Datas.getArString("HeroHouse.ExploreTime"), heroInfo.MaxExplore - heroInfo.Explored, heroInfo.MaxExplore);
				gift.SetVisible((heroInfo.CanLevelup || heroInfo.CanElevate) && heroInfo.Status != KBN.HeroStatus.Marching);
			
				//giftFlash
				if(heroInfo.CanLevelup)
				{
					gift.setNorAndActBG("ui_hero_lvup1","ui_hero_lvup2");
					giftFlash.setBackground("ui_hero_lvup2",TextureType.BUTTON);
				}
				else if(heroInfo.CanElevate)
				{
					gift.setNorAndActBG("ui_hero_lvup4","ui_hero_lvup5");
					giftFlash.setBackground("ui_hero_lvup5",TextureType.BUTTON);
				}
				giftFlash.SetVisible(heroInfo.Status != KBN.HeroStatus.Marching && (heroInfo.CanLevelup && HeroManager.Instance().GetHeroGiftFlash(heroInfo) || heroInfo.CanElevate));
				
				status = HeroItemStatus.Assigned;
				oldElevate = heroInfo.Elevate;
			    break;
		}
		
		UpdateLevelFrame();
    }

	private function OnDetailClick(param : Object) : void
	{
	    var heroMenu : HeroMenu = MenuMgr.getInstance().getMenu("HeroMenu") as HeroMenu;
	    if (heroMenu == null)
	    {
	        return;
	    }

	    if (heroSlot.Status != KBN.HeroSlotStatus.Assigned)
        {
	        return;
	    }
	    
	    heroMenu.OpenHeroDetail(heroSlot.AssignedHero);
	}

	private function OnAssignClick(param : Object) : void
	{
	    if (heroSlot.Status != KBN.HeroSlotStatus.Unassigned)
        {
        	return;
	    }
	    
	    MenuMgr.getInstance().PushMenu("HeroAssign", heroSlot);
	}
	
	private function OnLockClick(param : Object) : void
	{
	    SoundMgr.instance().PlayEffect("kbn_hero_lockedslot", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
	}
	
	private function OnSpeedUpClick(param : Object) : void
	{
		if (heroSlot.Status != KBN.HeroSlotStatus.Assigned || heroSlot.AssignedHero == null || heroSlot.AssignedHero.Status != KBN.HeroStatus.Sleeping)
		{
			return;
		}
		
		var data : QueueItem = HeroManager.Instance().GetNewHeroSpeedUpData(heroSlot.AssignedHero);
		if (data == null)
		{
			return;
		}
		
		MenuMgr.getInstance().PushMenu("SpeedUpMenu", data, "trans_zoomComp");
	}

	private function OnExploreClick(param : Object) : void
	{
	    if (heroSlot.Status != KBN.HeroSlotStatus.Assigned || heroSlot.AssignedHero == null || heroSlot.AssignedHero.Status != KBN.HeroStatus.Assigned)
        {
	        return;
	    }
	    
	    MenuMgr.getInstance().PushMenu("HeroExplore", heroSlot.AssignedHero);
	}
	
	private function OnGiftClick(param : Object) : void
	{
		if (heroSlot.Status != KBN.HeroSlotStatus.Assigned || heroSlot.AssignedHero == null)
        {
	        return;
	    }
	    
	    if (heroSlot.AssignedHero.CanLevelup)
	    {
	    	 MenuMgr.getInstance().PushMenu("HeroGift", heroSlot.AssignedHero, "trans_zoomComp");
	    }
	    else if(heroSlot.AssignedHero.CanElevate)
	    {
	    	MenuMgr.getInstance().PushMenu("HeroElevateMenu", { "from" : Constant.Hero.HeroElevateOKFromHeroMenu, "hero" : heroSlot.AssignedHero }, "trans_zoomComp");
	    }
	}
	
	private function StartElevateLightAnim()
	{
        if (String.IsNullOrEmpty(elevateLightPointAnimParam_X) || String.IsNullOrEmpty(elevateLightPointAnimParam_Y))
        {
            return;
        }
    
        
        var genX : IAnimationCurveGenerator = AnimationCurveGeneratorFactory.GetGenerator(elevateLightPointAnimParam_X);
        var genY : IAnimationCurveGenerator = AnimationCurveGeneratorFactory.GetGenerator(elevateLightPointAnimParam_Y);
        if (genX == null || genY == null)
        {
            return;
        }
        
        var acInfoX : AnimationCurveInfo = genX.Generate();
        var acInfoY : AnimationCurveInfo = genY.Generate();
        
       	elevateLightPoint.SetVisible(true);
      	  
	}
	
	public function get ElevateLightPointX() : float
	{
			return elevateLightPoint.rect.x;
	}
	public function set ElevateLightPointX(value:float)
	{
		elevateLightPoint.rect.x = value;
	}
	
	public function get ElevateLightPointY() : float
	{
			return elevateLightPoint.rect.y;
	}
	public function set ElevateLightPointY(value:float)
	{
		elevateLightPoint.rect.y = value;
	}
	
	private function StopElevateLightAnim() : void
    {
        
        elevateLightPoint.rect.x = Orign_X;
        elevateLightPoint.rect.y = Orign_Y;
        elevateLightPoint.SetVisible(false);
    }
    
    private function OnHOTweenAnimOnComplete():void
    {
    	StopElevateLightAnim();
    	animLabel.OnAnimationOver = OnFrameAnimComplete;
		animLabel.Init("lizisankai_000", 6, TextureType.DECORATION,AnimationLabel.LABEL_STATE.ANIMATION);
		animLabel.SetVisible(true);
    }
    
    private function OnFrameAnimComplete()
    {
    	animLabel.SetVisible(false);
    	animLabel.Stop();
    	UpdateLevelFrame();
    }
    
}
