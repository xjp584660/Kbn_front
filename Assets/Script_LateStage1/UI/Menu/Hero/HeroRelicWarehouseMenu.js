import System.Text;

public class HeroRelicWarehouseMenu extends KBNMenu
{
	public var clone_menuHead : MenuHead;
    public var menuHead : MenuHead;
    
    public var relicBack : Label;
    public var relicIcon : Label;
    public var relicLevel : Label;
    public var relicNameLine : Label;
    public var relicName : Label;
    public var stars : List.<Label> = new List.<Label>();
    public var oneSet : Label;
    public var twoSet : Label;

    public var descBack : Label;
    public var mainDesc : Label;
    public var mainValue : Label;
    public var deputyDesc : Label;
    public var deputy1Valeu : Label;
    public var deputy2Valeu : Label;
    public var deputy3Valeu : Label;

    public var lockAndUnlockBtn : Button;
    public var UpgradeBtn : Button;
    public var line : Label;
    public var sortLabel : Label;
    public var defaultToggleBtn : ToggleButton;
    public var defaultLabel : Label;
    public var levelToggleBtn : ToggleButton;
    public var levelLabel : Label;
    public var starToggleBtn : ToggleButton;
    public var starLabel : Label;
    public var selectGroup : String;

    public var defaultRelicScrollList : ScrollList;
    public var levelRelicScrollList : ScrollList;
    public var starRelicScrollList : ScrollList;
    public var curScrollList : ScrollList;
    public var heroSimpleRelicItem : HeroSimpleRelicItem;

    public var relicInfo : KBN.HeroRelicInfo;

	public function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
        menuHead.setTitle(Datas.getArString("HeroRelic.Warehouse"));
        
        defaultRelicScrollList.Init(heroSimpleRelicItem);
        levelRelicScrollList.Init(heroSimpleRelicItem);
        starRelicScrollList.Init(heroSimpleRelicItem);
		
		frameTop.rect = Rect( 0, 69, frameTop.rect.width, frameTop.rect.height);
		if(!background)
			this.background = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.DECORATION);
        
        UpgradeBtn.txt = Datas.getArString("HeroRelic.UpgradeBtn");
        UpgradeBtn.OnClick = OnUpgradeBtnOnClick;

        lockAndUnlockBtn.OnClick = OnLockAndUnlockBtnOnClick;

        sortLabel.txt = Datas.getArString("HeroRelic.Sort");
        defaultLabel.txt = Datas.getArString("HeroRelic.Default");
        levelLabel.txt = Datas.getArString("Alliance.JoinRequestLevel");
        starLabel.txt = Datas.getArString("HeroRelic.Star");
        defaultToggleBtn.selected = false;
        defaultToggleBtn.valueChangedFunc = DefaultValueChangedFunc;
        levelToggleBtn.selected = false;
        levelToggleBtn.valueChangedFunc = LevelValueChangedFunc;
        starToggleBtn.selected = false;
        starToggleBtn.valueChangedFunc = StarValueChangedFunc;
    }
    
    public function DefaultValueChangedFunc(b : boolean)
    {     
        selectGroup = "Default";
        levelToggleBtn.selected = false;
        starToggleBtn.selected = false;
        defaultToggleBtn.selected = b;

        UpdateRelicList();
    }

    public function LevelValueChangedFunc(b : boolean)
    {
        selectGroup = "Level";   
        starToggleBtn.selected = false;
        defaultToggleBtn.selected = false;
        levelToggleBtn.selected = b;

        UpdateRelicList();
    }

    public function StarValueChangedFunc(b : boolean)
    { 
        selectGroup = "Star";
        levelToggleBtn.selected = false;   
        defaultToggleBtn.selected = false;
        starToggleBtn.selected = b;

        UpdateRelicList();
    }
	
    public function handleNotification(type : String, body : Object)
    {
        switch (type)
        {
            case Constant.HeroRelic.RelicSelectWarehouseItem:
                relicInfo = body as KBN.HeroRelicInfo;
                RefreshRelicInfo();
                SetSimpleRelicItemSelect(relicInfo.RelicId);
                KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
                KBN.HeroRelicManager.instance().SetHeroRelicSelectState(relicInfo.RelicId, true);
                break;
            case Constant.HeroRelic.RelicLockAndUnlocckSuccess:
                relicInfo = body as KBN.HeroRelicInfo;
                RefreshRelicInfo();
                //UpdateRelicList();
                break;
            case Constant.HeroRelic.RelicUpgradeSuccess:
                relicInfo = body as KBN.HeroRelicInfo;
                RefreshRelicInfo();
                ShowRelicList();
                break;
            default:
                break;
        }
    }

    private function SetSimpleRelicItemSelect(relicId : int) {
		curScrollList.ForEachItem( function ( item : ListItem ) : boolean {
			var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
			if (null == simpleRelicItem)
				return true;
			simpleRelicItem.RelicSelect = (simpleRelicItem.GetHeroRelicInfo().RelicId == relicId);
			return true;
		} );
    }
    
    private function SetLockStatue(relicId : int) {
		curScrollList.ForEachItem( function ( item : ListItem ) : boolean {
			var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
			if (null == simpleRelicItem)
                return true;
            if(simpleRelicItem.GetHeroRelicInfo().RelicId == relicId)
            {
                simpleRelicItem.SetLockStatue(simpleRelicItem.GetHeroRelicInfo().Status == 2);
            }
			
			return true;
		} );
	}
    
	public function OnPush(param : Object)
	{
		super.OnPush(param);
        KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
		menuHead.setTitle(Datas.getArString("HeroRelic.Warehouse"));
        
        var list : List.<KBN.HeroRelicInfo> = KBN.HeroRelicManager.instance().GetAllRelics();
        relicInfo = list[0];
        RefreshRelicInfo();
        selectGroup = "Default";
        DefaultValueChangedFunc(true);
        //UpdateRelicList();
        ShowRelicList();
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
        TryDestroy(menuHead);
		menuHead = null;
        defaultRelicScrollList.Clear();
        levelRelicScrollList.Clear();
        starRelicScrollList.Clear();
        KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
		super.OnPopOver();
    }
    
    public function Update() : void
	{
        super.Update();
		menuHead.Update();
		
        curScrollList.Update();
    }
    
    private function ShowRelicList()
    {
        var defaultList : List.<KBN.HeroRelicInfo> = new List.<KBN.HeroRelicInfo>();
        defaultList = KBN.HeroRelicManager.instance().GetAllRelics();
        defaultRelicScrollList.Clear();
        defaultRelicScrollList.SetData(defaultList);
        defaultRelicScrollList.ResetPos();

        var leveltList : List.<KBN.HeroRelicInfo> = new List.<KBN.HeroRelicInfo>();
        leveltList = KBN.HeroRelicManager.instance().GetLevelSortRelics();
        levelRelicScrollList.Clear();
        levelRelicScrollList.SetData(leveltList);
        levelRelicScrollList.ResetPos();

        var starList : List.<KBN.HeroRelicInfo> = new List.<KBN.HeroRelicInfo>();
        starList = KBN.HeroRelicManager.instance().GetTierSortRelics();
        starRelicScrollList.Clear();
        starRelicScrollList.SetData(starList);
        starRelicScrollList.ResetPos();

        KBN.HeroRelicManager.instance().simpleRelicItemType = KBN.SimpleRelicItemType.WareHouseType;
    }

    private function UpdateRelicList()
    {
        //var list : List.<KBN.HeroRelicInfo> = new List.<KBN.HeroRelicInfo>();
        switch(selectGroup)
        {
            case "Default":
                //list = KBN.HeroRelicManager.instance().GetAllRelics();
                curScrollList = defaultRelicScrollList;
                break;
            case "Level":
                //list = KBN.HeroRelicManager.instance().GetLevelSortRelics();
                curScrollList = levelRelicScrollList;
                break;
            case "Star":
                //list = KBN.HeroRelicManager.instance().GetTierSortRelics();
                curScrollList = starRelicScrollList;
                break;
        }
        		
        curScrollList.ResetPos();
        RefreshRelicInfo();
        //SetSimpleRelicWarehouseType();
        KBN.HeroRelicManager.instance().simpleRelicItemType = KBN.SimpleRelicItemType.WareHouseType;
    }

    // private function SetSimpleRelicWarehouseType()
	// {
	// 	relicScrollList.ForEachItem( function ( item : ListItem ) : boolean {
	// 		var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
	// 		if (null == simpleRelicItem)
	// 			return true;
	// 		simpleRelicItem.SetSimpleRelicWarehouseType();
	// 		return true;
	// 	} );
    // }
    
    public function RefreshRelicInfo()
    {
        relicInfo.IsSelected = true;

        relicIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(relicInfo.IconName, TextureType.HERORELIC);
        relicLevel.txt = "Lv " + relicInfo.Level.ToString();
        relicName.txt = relicInfo.RelicName;
        SetStars(relicInfo.Tier);

        var twoBonus : String = "RelicSet.TwoBonus_";
		var fourBonus : String = "RelicSet.FourBonusRegular_";
        oneSet.txt = String.Format(Datas.getArString(twoBonus + relicInfo.RelicSetId.ToString()), relicInfo.TwoSetValue);
        twoSet.txt = Datas.getArString(fourBonus + relicInfo.RelicSetId.ToString());

        mainDesc.txt = Datas.getArString("HeroRelic.MainValue");
        mainValue.txt = relicInfo.MainSkillDesc;
        deputyDesc.txt = String.Empty;
        deputy1Valeu.txt = String.Empty;
        deputy2Valeu.txt = String.Empty;
        deputy3Valeu.txt = String.Empty;
        if(relicInfo.DeputySkill1 != 0)
        {       
            deputyDesc.txt = Datas.getArString("HeroRelic.DeputyValue");
            deputy1Valeu.txt = relicInfo.DeputySkill1Desc;
        }

        if(relicInfo.DeputySkill2 != 0)
        {
            deputy2Valeu.txt = relicInfo.DeputySkill2Desc;
        }
        
        if(relicInfo.DeputySkill3 != 0)
        {
            deputy3Valeu.txt = relicInfo.DeputySkill3Desc;
        }    

        if(relicInfo.Status == 1)
        {
            lockAndUnlockBtn.txt = Datas.getArString("HeroRelic.Lock");
            lockAndUnlockBtn.clickParam = Datas.getArString("HeroRelic.Lock");
        }
        else
        {
            lockAndUnlockBtn.txt = Datas.getArString("HeroRelic.Unlock");
            lockAndUnlockBtn.clickParam = Datas.getArString("HeroRelic.Unlock");
        }

        SetLockStatue(relicInfo.RelicId);
    }

    public function SetStars(starCount : int)
    {
        for(var j : int = 0; j < stars.Count; j++)
        {
            stars[j].SetVisible(false);
        }

        if(starCount % 2 == 0)
        {
            var left : int = 70;
            var right : int = 100;
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
                stars[i].SetVisible(true);
            }
        }
        else
        {
            var mid : int = 85;
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
                stars[k].SetVisible(true);            
            }
        }
    }
	
	private function OnLockAndUnlockBtnOnClick(clickParam : Object) : void
	{
        if(clickParam == Datas.getArString("HeroRelic.Lock"))
        {
            // 上锁
            KBN.HeroRelicManager.instance().ChangeReliccStatus(relicInfo, 2);
        }
        else
        {
            // 解锁
            KBN.HeroRelicManager.instance().ChangeReliccStatus(relicInfo, 1);
        }
	}
    
    private function OnUpgradeBtnOnClick(param : Object) : void
    {
        MenuMgr.getInstance().PushMenu("HeroRelicUpgradePopMenu", relicInfo, "trans_zoomComp");
    }
	
	public function DrawBackground()
	{
		menuHead.Draw();
		bgStartY = 70;
		DrawMiddleBg();	
		
		frameTop.Draw();		
	}
	
	public function DrawTitle()
	{
		
	}
	
	public function DrawItem()
	{
        relicBack.Draw();
        relicIcon.Draw();
        relicLevel.Draw();
        relicNameLine.Draw();
        relicName.Draw();
        for(var i : int = 0; i < this.stars.Count; ++i)
        {
            stars[i].Draw();
        }
        oneSet.Draw();
        twoSet.Draw();

        descBack.Draw();
        mainDesc.Draw();
        mainValue.Draw();
        deputyDesc.Draw();
        deputy1Valeu.Draw();
        deputy2Valeu.Draw();
        deputy3Valeu.Draw();

        lockAndUnlockBtn.Draw();
        UpgradeBtn.Draw();
        line.Draw();
        sortLabel.Draw();
        defaultToggleBtn.Draw();
        defaultLabel.Draw();
        levelToggleBtn.Draw();
        levelLabel.Draw();
        starToggleBtn.Draw();
        starLabel.Draw();
        curScrollList.Draw();
	}
}
