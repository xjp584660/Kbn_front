class HeroRelicUpgradePopMenu extends PopMenu
{
    public var titleLine : Label;
    public var btnHelp : Button;
    public var btnUpgrade : Button;
    public var btnCloseMenu : Button;
    public var relicBack : Label;
    public var relicIcon : Label;
    public var relicLevelBack : Label;
    public var relicLevelLeft : Label;
    public var relicLevelMid : Label;
    public var relicLevelRight : Label;
    public var stars : List.<Label> = new List.<Label>();
    public var relicDesBack : Label;
    public var relicMainDes : Label;
    public var relicDeputyDes : Label;
    public var relicDeputyUpIcon : Label;
    public var relicDeputyDes1 : Label;
    public var relicDeputyDes2 : Label;
    public var relicDeputyDes3 : Label;
    public var relicUpgradeLineLeft : Label;
    public var relicUpgradeLineRight : Label;

    public var relicScrollList : ScrollList;
    public var heroSimpleRelicItem : HeroSimpleRelicItem;

    public var progressBar : ProgressBarWithBg;

    public var relicInfo : KBN.HeroRelicInfo;
    public var relicInfoUpgradeList : List.<KBN.HeroRelicInfo> = new List.<KBN.HeroRelicInfo>();

    public var preOnPushSimpleRelicItemType : KBN.SimpleRelicItemType;
	
	public function Init():void
	{
		super.Init();
				
        title.txt = Datas.getArString("HeroRelic.Upgrade");
        relicScrollList.SetCanOffset(120, 140);
        relicScrollList.Init(heroSimpleRelicItem);
        //relicScrollList.itemDelegate = this;
        btnCloseMenu.OnClick = OnCloseMenu;
        btnUpgrade.txt = Datas.getArString("HeroRelic.UpgradeBtn");
        btnUpgrade.OnClick = OnUpgrade;

        progressBar.Init();
		progressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
        progressBar.SetBg("pvpbuilding_hpmeter",TextureType.MAP17D3A_UI);
        
        relicDeputyDes.txt = Datas.getArString("HeroRelic.DeputyValue");
        var minWidth : float = 0.0f;
        var maxWidth : float = 0.0f;
        relicDeputyDes.mystyle.CalcMinMaxWidth(GUIContent(relicDeputyDes.txt), minWidth, maxWidth);
        relicDeputyUpIcon.rect.x = Mathf.Ceil(relicDeputyDes.rect.x + maxWidth);
        relicDeputyUpIcon.SetVisible(false);
    }

    private function OnCloseMenu(param : System.Object) : void
    {
        MenuMgr.getInstance().PopMenu("HeroRelicUpgradePopMenu");
    }

    private function OnUpgrade(param : System.Object) : void
    {
        KBN.HeroRelicManager.instance().UpgradeHeroRelic(relicInfo.RelicId, relicInfoUpgradeList);
    }
    
    private function UpdateRelicList() {
		var list : List.<KBN.HeroRelicInfo> = KBN.HeroRelicManager.instance().GetUpgradeRelicsNoSelf(this.relicInfo.RelicId);
		relicScrollList.Clear();
		relicScrollList.SetData(list);
        relicScrollList.MoveToTop();
        relicScrollList.ResetPos();
        //SetSimpleRelicUpgradeType();
        KBN.HeroRelicManager.instance().simpleRelicItemType = KBN.SimpleRelicItemType.UpgradeType;
    }
    
    // private function SetSimpleRelicUpgradeType()
	// {
	// 	relicScrollList.ForEachItem( function ( item : ListItem ) : boolean {
	// 		var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
	// 		if (null == simpleRelicItem)
	// 			return true;
	// 		simpleRelicItem.SetSimpleRelicUpgradeType();
	// 		return true;
	// 	} );
    // }
    
    private function SetAdvanceadData()
    {
        var canUpgrade : boolean = relicInfo.IsCanUpgrade(relicInfoUpgradeList);
        relicDeputyUpIcon.SetVisible(canUpgrade);
        
        var canUpgradedLevel : int = relicInfo.GetCanUpgradedLevel(relicInfoUpgradeList);
        relicLevelRight.txt = "Lv " + canUpgradedLevel;

        if(canUpgrade)
        {
            var curCanUpgradeLevelTotalExp : int = relicInfo.GetCurLevelTotalExp(canUpgradedLevel + 1);
            if(canUpgradedLevel >= relicInfo.MaxLevel)
            {
                progressBar.SetValue(relicInfo.TotalExp + relicInfo.GetSelectTotalExp(relicInfoUpgradeList), curCanUpgradeLevelTotalExp);
                progressBar.SetTxt(Datas.getArString("HeroRelic.EXPMax"));
            }
            else
            {
                progressBar.SetValue(relicInfo.TotalExp + relicInfo.GetSelectTotalExp(relicInfoUpgradeList), curCanUpgradeLevelTotalExp);
            }          
        }
        else
        {
            var curLevelTotalExp : int = relicInfo.GetCurLevelTotalExp(relicInfo.Level + 1);
            progressBar.SetValue(relicInfo.TotalExp + relicInfo.GetSelectTotalExp(relicInfoUpgradeList), curLevelTotalExp);
        }
    }
	
	public function OnPush(param:Object)
	{
        super.OnPush(param);
        
        preOnPushSimpleRelicItemType = KBN.HeroRelicManager.instance().simpleRelicItemType;

        KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
        relicInfoUpgradeList.Clear();
        relicInfo = param as KBN.HeroRelicInfo;
        UpdateRelicData();
        UpdateRelicList();
    }
    
    public function UpdateRelicData()
    {
        relicIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(relicInfo.IconName, TextureType.HERORELIC);
        relicMainDes.txt = Datas.getArString("HeroRelic.MainValue") + relicInfo.MainSkillDesc;

        relicDeputyDes1.txt = String.Empty;
        relicDeputyDes2.txt = String.Empty;
        relicDeputyDes3.txt = String.Empty;
        if(relicInfo.DeputySkill1 != 0)
        {        
            relicDeputyDes1.txt = relicInfo.DeputySkill1Desc;
        }

        if(relicInfo.DeputySkill2 != 0)
        {
            relicDeputyDes2.txt = relicInfo.DeputySkill2Desc;
        }
        
        if(relicInfo.DeputySkill3 != 0)
        {
            relicDeputyDes3.txt = relicInfo.DeputySkill3Desc;
        }  

        SetStars(relicInfo.Tier);

        relicLevelLeft.txt = "Lv " + relicInfo.Level;
        relicLevelRight.txt = "Lv " + relicInfo.Level;

        var curLevelTotalExp : int = relicInfo.GetCurLevelTotalExp(relicInfo.Level + 1);
        if(relicInfo.TotalExp >= curLevelTotalExp)
        {
            btnUpgrade.SetDisabled(true);
			btnUpgrade.changeToGreyNew();
            progressBar.SetValue(relicInfo.TotalExp, curLevelTotalExp);
            progressBar.SetTxt(Datas.getArString("HeroRelic.EXPMax"));
        }
        else
        {
            btnUpgrade.SetDisabled(false);
			btnUpgrade.changeToBlueNew();
            progressBar.SetValue(relicInfo.TotalExp, curLevelTotalExp);
        }     
    }
	
	public function OnPopOver()
	{
        super.OnPopOver();
        relicScrollList.Clear();
        KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();

        KBN.HeroRelicManager.instance().simpleRelicItemType = this.preOnPushSimpleRelicItemType;
	}
	
	function Update() 
	{
		relicScrollList.Update();
	}
	
	public function DrawItem()
	{
        titleLine.Draw();
        btnHelp.Draw();
        btnUpgrade.Draw();
        btnCloseMenu.Draw();
        relicBack.Draw();
        relicIcon.Draw();
        relicLevelBack.Draw();
        relicLevelLeft.Draw();
        relicLevelMid.Draw();
        relicLevelRight.Draw();
        progressBar.Draw();

        for(var i : int = 0; i < this.stars.Count; ++i)
        {
            stars[i].Draw();
        }

        relicDesBack.Draw();
        relicMainDes.Draw();
        relicDeputyDes.Draw();
        relicDeputyUpIcon.Draw();
        relicDeputyDes1.Draw();
        relicDeputyDes2.Draw();
        relicDeputyDes3.Draw();
        relicUpgradeLineLeft.Draw();
        relicUpgradeLineRight.Draw();
        relicScrollList.Draw();
    }

    public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
	        case Constant.HeroRelic.RelicAddUpgradeItem:
                var addRelic : KBN.HeroRelicInfo = param as KBN.HeroRelicInfo;
                if(!relicInfo.IsCanSelectUpgradeRelic())
                {
                    MenuMgr.getInstance().PushMessage(Datas.getArString("HeroRelic.UpgradeLimitPop"));
                }
                else
                {
                    var canUpgrade : boolean = relicInfo.IsCanUpgrade(relicInfoUpgradeList); 
                    var canUpgradedLevel : int = relicInfo.GetCanUpgradedLevel(relicInfoUpgradeList);
                    if(canUpgradedLevel >= relicInfo.MaxLevel)
                    {
                        MenuMgr.getInstance().PushMessage(Datas.getArString("HeroRelic.UpgradeLimitPop"));
                    }
                    else
                    {
                        SetSimpleRelicItemSelect(addRelic.RelicId, true);
                        relicInfoUpgradeList.Add(addRelic);
                        KBN.HeroRelicManager.instance().SetHeroRelicSelectState(addRelic.RelicId, true);    
                        SetAdvanceadData();
                    }                   
                }
                break;
            case Constant.HeroRelic.RelicRemoveUpgradeItem:
                var removeRelic : KBN.HeroRelicInfo = param as KBN.HeroRelicInfo;
                SetSimpleRelicItemSelect(removeRelic.RelicId, false);
                relicInfoUpgradeList.Remove(removeRelic);
                KBN.HeroRelicManager.instance().SetHeroRelicSelectState(removeRelic.RelicId, false);
                SetAdvanceadData();
                break;
            case Constant.HeroRelic.RelicUpgradeSuccess:
                relicInfoUpgradeList.Clear();
                KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
                relicInfo = param as KBN.HeroRelicInfo;
                UpdateRelicData();
                UpdateRelicList();
				break;
	    }
	}

    private function SetSimpleRelicItemSelect(relicId : int, flag : boolean) {
		relicScrollList.ForEachItem( function ( item : ListItem ) : boolean {
			var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
			if (null == simpleRelicItem)
				return true;
            var isSame : boolean = simpleRelicItem.GetHeroRelicInfo().RelicId == relicId;
            if(isSame)
            {
                simpleRelicItem.RelicSelect = flag;
            }           
			return true;
		} );
	}
    
    public function SetStars(starCount : int)
    {
        for(var j : int = 0; j < this.stars.Count; j++)
        {
            this.stars[j].SetVisible(false);
        }

        if(starCount % 2 == 0)
        {
            var left : int = 272;
            var right : int = 302;
            for(var i : int = 0; i < starCount; i++)
            {
                if((i + 1) % 2 == 0)
                {
                    stars[i].rect.x = right;
                    right += 30;
                }
                else
                {
                    stars[i].rect.x = left;
                    left -= 30;
                }
                this.stars[i].SetVisible(true);
            }
        }
        else
        {
            var mid : int = 286;
            var midLeft : int = mid - 30;
            var midRight : int = mid + 30; 
            for(var k : int = 0; k < starCount; k++)
            {
                if(k == 0)
                {
                    stars[k].rect.x = mid;
                }
                else
                {
                    if((k + 1) % 2 == 0)
                    {
                        stars[k].rect.x = midRight;
                        midRight += 30;
                    }
                    else
                    {
                        stars[k].rect.x = midLeft;
                        midLeft -= 30;
                    }
                } 
                this.stars[k].SetVisible(true);            
            }
        }
    }
}