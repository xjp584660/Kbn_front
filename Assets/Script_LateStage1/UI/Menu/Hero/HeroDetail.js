public class HeroDetail extends ComposedMenu implements IEventHandler
{
	private enum HeroDetailStatus
	{
		FromMain,
		FromAssign,
		FromCollect
	};

	@SerializeField
	private var menuHeroReelicc : HeroRelic;

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
	private var renownTitle : Label;
    @SerializeField
    private var renownText : Label;
	@SerializeField
	private var renown : PercentBar;
	@SerializeField
	private var gift : Button;
	@SerializeField
	private var unassign : Button;
	@SerializeField
	private var relic : Button;
	@SerializeField
	private var speedup : Button;
    @SerializeField
    private var unlockDescription : Label;
	@SerializeField
	private var skillBackground : Label;
	@SerializeField
	private var skillBar : ToolBar;
	@SerializeField
	private var skillItem : HeroSkillItem;
	@SerializeField
	private var skillList : ScrollList;
	@SerializeField
	private var fateList : ScrollList;
	@SerializeField
	private var legend : Label;
	@SerializeField
	private var infoTipsBar : ErrorTipsBar;
	@SerializeField
	private var elevateFlash : Label;
	@SerializeField
	private var flashSpeed : float;
	
	@SerializeField
	private var elevateLightPoint : Label;
	@SerializeField
    private var elevateLightPointAnimParam_X : String;
    @SerializeField
    private var elevateLightPointAnimParam_Y : String;
     @SerializeField
    private var elevateAnimRadius : float;
    @SerializeField private var animLabel:AnimationLabel;
    
    @SerializeField private var Orign_X : float;
   	@SerializeField private var Orign_Y : float;
	
	private var status : HeroDetailStatus = HeroDetailStatus.FromMain;
	private var heroInfo : KBN.HeroInfo = null;

	public function Init() : void
 	{
		 super.Init();
		 
		 menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
		 menuHead.backTile.rect = Rect(0, 0, 640, 140);
		menuHead.leftHandler = GoBackMenu;

 		menuHeroReelicc.Init();
 		setDefautlFrame = true;
 		frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);
 		
 		infoTipsBar.Init();
		infoTipsBar.StopTime = 1.0f;
 		
 		speedup.txt = Datas.getArString("Common.Speedup");
		unassign.txt = Datas.getArString("HeroHouse.UnAssignButton");
		relic.txt = Datas.getArString("HeroHouse.RelicButton");
 		sleepStatus.txt = Datas.getArString("HeroHouse.HeroState2");
 		marchStatus.txt = Datas.getArString("HeroHouse.HeroState3");
 		
 		gift.changeToBlueNew();
		unassign.changeToBlueNew();
		relic.changeToBlueNew();
 		speedup.changeToGreenNew();

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
 		
 		skillList.itemDelegate = this;
 		fateList.itemDelegate = this;
 		
		unassign.OnClick = OnUnassignClick;
		relic.OnClick = OnReliccClick;
 		speedup.OnClick = OnSpeedUpClick;
 		elevateFlash.setBackground("ui_hero_collect_hlight",TextureType.BUTTON);
 		elevateFlash.SetVisible(false);
 		
 		elevateLightPoint.setBackground("ui_elevate_ef_light",TextureType.DECORATION);
 		elevateLightPoint.SetVisible(false);
	}
 	
 	public function Update() : void
	{
		super.Update();

		menuHead.Update();
		infoTipsBar.Update();
		skillList.Update();
		fateList.Update();
		elevateFlash.alpha = 0.5f * (1 + Mathf.Sin(Time.realtimeSinceStartup * flashSpeed));
		if (heroInfo.Status == KBN.HeroStatus.Sleeping)
		{
		    sleepTime.txt = heroInfo.SleepTimeDescripiton;
		}
	}
	
	public function DrawBackground() : void
	{
		menuHead.Draw();
		bgStartY = 70;
		DrawMiddleBg();
		frameTop.Draw();
	}
	
	public function DrawItem() : void
	{
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
	        renownTitle.Draw();
	        renown.Draw();
			renownText.Draw();
			relic.Draw();
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
		if (heroInfo.Status != KBN.HeroStatus.Locked && heroInfo.Status != KBN.HeroStatus.Marching)
		{
			elevateFlash.Draw();
		    gift.Draw();
		}
		if (heroInfo.Status == KBN.HeroStatus.Sleeping)
		{
			speedup.Draw();
		}
		else if (status == HeroDetailStatus.FromMain)
		{
			unassign.Draw();
		}
		
		skillBackground.Draw();
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
		elevateLightPoint.Draw(); 	
		animLabel.Draw();
		infoTipsBar.Draw();
	}

	public function OnPush(param : Object) : void
	{
		super.OnPush(param);
		
	    var paramTable : Hashtable = param as Hashtable;
	    heroInfo = paramTable["hero"] as KBN.HeroInfo;
		switch (paramTable["from"] as String)
		{
		    case "main":
		        status = HeroDetailStatus.FromMain;
		    	break;
		    case "assign":
		    	status = HeroDetailStatus.FromAssign;
		    	break;
		    case "collect":
		    	status = HeroDetailStatus.FromCollect;
		    	break;
	    }
		headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
		head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
		
		skillBar.selectedIndex = 0;
		RefreshHeroDetail();
		UpdateLevelFrame();
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
	
		TryDestroy(menuHead);
		menuHead = null;
		super.OnPopOver();
	}

	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
	        case Constant.Hero.HeroBoosted:
	            RefreshHeroDetail();
	            break;
            case Constant.Hero.HeroUnassigned:
                GoBackMenu();
                MenuMgr.getInstance().PushMessage(String.Format(Datas.getArString("Common.HeroUnAssignDesc"), (param as KBN.HeroInfo).Name));
	            break;
            case Constant.Hero.HeroStatusUpdated:
            	RefreshHeroDetail();
            	break;
            case Constant.Hero.HeroElevateOKFromDetail:
            case Constant.Hero.HeroElevateOKFromCollectAndDetailMenu:
            case Constant.Hero.HeroElevateOKFromAssignAndDetail:
          	  	StartElevateLightAnim();
          	  	RefreshHeroDetail();
          	  	RefreshHeroSkillList();
          	  	RefreshHeroFateList();
          	  	break;
            case Constant.Hero.SkillLevelUpOK:
            	RefreshAtb();
                RefreshHeroSkillList();
                RefreshHeroFateList();
                break;
			case Constant.HeroRelic.RelicEquipSuccess:
				RefreshHeroSkillList();
                RefreshHeroFateList();
				RefreshHeroDetail();
				break;
			case Constant.HeroRelic.RelicUpgradeSuccess:
				RefreshHeroSkillList();
                RefreshHeroFateList();
				RefreshHeroDetail();
				break;
	    }
	}
	
	private function GoBackMenu() : void
	{
		switch (status)
		{
		    case HeroDetailStatus.FromMain:
		    	var heroMenu : HeroMenu = MenuMgr.getInstance().getMenu("HeroMenu") as HeroMenu;
		    	if (heroMenu != null)
		    	{
		    	    heroMenu.GoBackMenu();
		    	}
		    	break;
		    case HeroDetailStatus.FromAssign:
		    	var heroAssign : HeroAssign = MenuMgr.getInstance().getMenu("HeroAssign") as HeroAssign;
		    	if (heroAssign != null)
		    	{
		    		heroAssign.GoBackMenu();
		    	}
		    	break;
		    case HeroDetailStatus.FromCollect:
		    	var heroCollect : HeroCollect = MenuMgr.getInstance().getMenu("HeroCollect") as HeroCollect;
		    	if (heroCollect != null)
		    	{
		    		heroCollect.GoBackMenu();
		    	}
		    	break;
		}
	}
	
	private function OnGiftClick(param : Object) : void
	{
		MenuMgr.getInstance().PushMenu("HeroGift", heroInfo, "trans_zoomComp");
	}
	
	private function OnElevate(param : Object) : void
	{
		if(status == HeroDetailStatus.FromCollect)
		{
			MenuMgr.getInstance().PushMenu("HeroElevateMenu", { "from" : Constant.Hero.HeroElevateOKFromCollectAndDetailMenu, "hero" : heroInfo }, "trans_zoomComp");
		}
		else if(status == HeroDetailStatus.FromMain)
		{
			MenuMgr.getInstance().PushMenu("HeroElevateMenu", { "from" : Constant.Hero.HeroElevateOKFromDetail, "hero" : heroInfo }, "trans_zoomComp");
		}
		else if (status == HeroDetailStatus.FromAssign)
		{
			MenuMgr.getInstance().PushMenu("HeroElevateMenu", { "from" : Constant.Hero.HeroElevateOKFromAssignAndDetail, "hero" : heroInfo }, "trans_zoomComp");
		}
	}
	
	private function OnUnassignClick(param : Object) : void
	{
	    if (status != HeroDetailStatus.FromMain)
        {
            return;
	    }

	    var cityId : int = GameMain.instance().getCurCityId();
	    KBN.HeroManager.Instance.RequestUnassign(heroInfo.Id, cityId);
	}

	private function OnReliccClick(param : Object) : void
	{
		menuHead.leftHandler = GoBackMenu;
        //menuHead.setTitle(Datas.getArString("HeroHouse.Relic_Title"));
		//PushSubMenu(menuHeroReelicc, { "from" : "main", "hero" : heroInfo });
		MenuMgr.getInstance().PushMenu("HeroRelic", {"from" : "main", "hero" : heroInfo });
	}
	
	private function OnSpeedUpClick(param : Object) : void
	{
		if (heroInfo.Status != KBN.HeroStatus.Sleeping)
		{
		    return;
		}
		
		var data : QueueItem = HeroManager.Instance().GetNewHeroSpeedUpData(heroInfo);
		if (data == null)
		{
			return;
		}
		
		MenuMgr.getInstance().PushMenu("SpeedUpMenu", data, "trans_zoomComp");
	}
	
	private function OnSkillBarChanged(index : int)
	{
		switch (index)
		{
		    case 0:
		    	skillList.SetData((heroInfo.Skill as List.<KBN.HeroSkill>).ToArray());
		    	skillList.ResetPos();
		    	break;
		    case 1:
		    	fateList.SetData((heroInfo.Fate as List.<KBN.HeroSkill>).ToArray());
		    	fateList.ResetPos();
		    	break;
		    case 2:
		    	RefreshHeroLegend();
		    	break;
		}
	}

	private function RefreshHeroDetail() : void
    {
	    if (heroInfo.Status == KBN.HeroStatus.Assigned)
        {
            unassign.changeToBlueNew();
        }
        else
        {
            unassign.changeToGreyNew();
        }
        
        if (heroInfo.Status == KBN.HeroStatus.Sleeping)
        {
            speedup.changeToGreenNew();
        }
        else
        {
            speedup.changeToGreyNew();
        }

	    heroName.txt = heroInfo.Name;
	    level.txt = heroInfo.Level.ToString();
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
	    load.txt = heroInfo.Load.ToString();
	    might.txt = String.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Status != KBN.HeroStatus.Locked && heroInfo.Status != KBN.HeroStatus.Unlocked ? heroInfo.Might.ToString() : "???");
	    renownTitle.txt = Datas.getArString("HeroHouse.Detail_Renown");
	   
	    if (heroInfo.CanLevelup)
    	{
    		elevateFlash.SetVisible(false);
    		renown.changeThumbBG("ui_hero_bar",TextureType.DECORATION);
    		renownText.txt = String.Format("{0}/{1}", heroInfo.Renown.ToString(), heroInfo.NextRenown.ToString());
    		renown.Init(heroInfo.Renown, heroInfo.NextRenown);
    		gift.txt = Datas.getArString("HeroHouse.GiftButton");
    		gift.changeToBlueNew();
    		gift.OnClick = OnGiftClick;
    	}
    	else if(heroInfo.CanElevate)
	    {
	    	elevateFlash.SetVisible(true);
	    	renown.changeThumbBG("ui_hero_bar_elevate",TextureType.DECORATION);
	    	var totalRenown:int = heroInfo.CurTotalRenown;
	    	var lastlevelRenown:int = heroInfo.GetRenownOfLevel(heroInfo.Level-1);
	    	var levelRenown:int = heroInfo.GetRenownOfLevel(heroInfo.Level);
	    	renownText.txt = String.Format("{0}/{1}", heroInfo.CurTotalRenown - heroInfo.GetRenownOfLevel(heroInfo.Level-1), heroInfo.GetRenownOfLevel(heroInfo.Level) - heroInfo.GetRenownOfLevel(heroInfo.Level-1));;
    		renown.Init(1, 1);
    		gift.txt = Datas.getArString("Hero.Elevate");
    		gift.changeToBlueNew();
    		gift.OnClick = OnElevate;
	    }
        else
        {
        	elevateFlash.SetVisible(false);
        	renown.changeThumbBG("ui_hero_bar",TextureType.DECORATION);
        	renownText.txt = Datas.getArString("Common.Max");
        	renown.Init(1, 1);
        	gift.txt = Datas.getArString("HeroHouse.GiftButton");
        	gift.changeToGreyNew();
        }
        
	    unlockDescription.txt = heroInfo.UnlockDescription;
	    OnSkillBarChanged(skillBar.selectedIndex);
    }
	
	private function RefreshHeroSkillList() : void
	{
//		skillList.SetData((heroInfo.Skill as List.<KBN.HeroSkill>).ToArray());
		skillList.UpdateData();
	}
	
	private function RefreshHeroFateList() : void
	{
//		fateList.SetData((heroInfo.Fate as List.<KBN.HeroSkill>).ToArray());
		fateList.UpdateData();
	}
	
	private function RefreshHeroLegend() : void
	{
		legend.txt = heroInfo.Legend;
	}
	
	public function handleItemAction(action:String,param:Object):void
	{	
		switch(action)
		{
			case Constant.Action.HERO_MARCHING:
				infoTipsBar.setInfoContent(Datas.getArString("HeroSkill.LevelUp_Toaster"));
				infoTipsBar.Show();
			break;
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
	
	private function RefreshAtb()
	{
		level.txt = heroInfo.Level.ToString();
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
	    load.txt = heroInfo.Load.ToString();
	    might.txt = String.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Status != KBN.HeroStatus.Locked && heroInfo.Status != KBN.HeroStatus.Unlocked ? heroInfo.Might.ToString() : "???");
	    renownTitle.txt = Datas.getArString("HeroHouse.Detail_Renown");
	}
	
}
