public class HeroGift extends PopMenu
{
	@SerializeField
	private var description : Label;
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var level : Label;
    @SerializeField
    private var renownText : Label;
    @SerializeField
    private var might : Label;
   	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var nextLevel : Label;
	@SerializeField
    private var addMight : Label;
	@SerializeField
	private var addAttack : Label;
	@SerializeField
	private var addHealth : Label;
	@SerializeField
	private var addLoad : Label;
    @SerializeField
    private var renown : PercentBar;
	@SerializeField
	private var lineTop : Label;
	@SerializeField
	private var lineBottom : Label;
	@SerializeField
	private var giftItem : HeroGiftItem;
	@SerializeField
	private var giftList : ScrollList;
	@SerializeField
	private var nodata : Label;

	private var heroInfo : KBN.HeroInfo = null;
	private var isPlayingAnimation = false;
	private var lastLevel : int = 0;
	private var lastRenown : int = 0;

	public function Init() : void
	{
	    super.Init();

	    giftList.Init(giftItem);

	    attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
	    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
	    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");

	    title.txt = Datas.getArString("HeroHouse.Gift_ChooseItemTitle");
	    description.txt = Datas.getArString("HeroHouse.Gift_ChooseItemTip");
	    nodata.txt = Datas.getArString("HeroHouse.Gift_NoItem");
		nextLevel.txt = Datas.getArString("HeroHouse.Gift_NextLvText");
	}

	public function Update() : void
	{
		super.Update();

		renown.Update();
		giftList.Update();
	}

	public function DrawItem() : void
	{
		description.Draw();
		heroName.Draw();
		level.Draw();
		might.Draw();
		attack.Draw();
		health.Draw();
		load.Draw();
		if (heroInfo.Status == KBN.HeroStatus.Assigned || heroInfo.Status == KBN.HeroStatus.Marching || heroInfo.Status == KBN.HeroStatus.Sleeping || heroInfo.Status == KBN.HeroStatus.Unassigned)
		{
			nextLevel.Draw();
			addMight.Draw();
			addAttack.Draw();
			addHealth.Draw();
			addLoad.Draw();
		}
		renown.Draw();
		renownText.Draw();
		lineTop.Draw();
		lineBottom.Draw();
		nodata.Draw();
		giftList.Draw();
	}

	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);

	    heroInfo = param as KBN.HeroInfo;
	    heroName.txt = heroInfo.Name;
	    lastLevel = heroInfo.Level;
	    lastRenown = heroInfo.Renown;
        renown.Init(heroInfo.NextRenown > 0 ? 10000 * heroInfo.Renown / heroInfo.NextRenown : 0, 10000, true);
        RefreshHeroData();
	    RefreshHeroGiftList(true);
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
	    giftList.Clear();

		super.OnPopOver();
	}

	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
        {
            case Constant.Hero.HeroBoosted:
            	RefreshHeroData();
            	RefreshHeroGiftList(false);
            	SoundMgr.instance().PlayEffect("kbn_hero_renown_growth", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
		        if (!heroInfo.CanLevelup)
		        {
		        	MenuMgr.getInstance().PopMenu("HeroGift");
		        	MenuMgr.getInstance().PushMenu("HeroLevelMax", heroInfo, "trans_zoomComp");
		        }
	            break;
	    }
    }

    public function RequestBoost(heroItemType : int) : void
    {
        RequestBoost(heroItemType, 1);
        return;
    }

    public function RequestBoost(heroItemType : int, times : int) : void
    {
    	if (isPlayingAnimation)
    	{
    		return;
    	}
        KBN.HeroManager.Instance.RequestBoost(heroInfo.Id, heroItemType, times);
    }

    public function HeroCanUseLevelUpItem(heroItem : InventoryInfo) : boolean
    {
        return KBN.HeroManager.HeroCanUseLevelUpItem(heroInfo, heroItem);
    }

    private function RefreshHeroData() : void
    {
	    level.txt = String.Format(Datas.getArString("HeroHouse.Gift_HeroLv"), heroInfo.Status == KBN.HeroStatus.Assigned || heroInfo.Status == KBN.HeroStatus.Marching || heroInfo.Status == KBN.HeroStatus.Sleeping || heroInfo.Status == KBN.HeroStatus.Unassigned ? heroInfo.Level.ToString() : "???");
	    renownText.txt = String.Format("{0}/{1}", heroInfo.Renown.ToString(), heroInfo.NextRenown.ToString());
	    might.txt = String.Format(Datas.getArString("HeroHouse.Gift_HeroMight"), heroInfo.Status == KBN.HeroStatus.Assigned || heroInfo.Status == KBN.HeroStatus.Marching || heroInfo.Status == KBN.HeroStatus.Sleeping || heroInfo.Status == KBN.HeroStatus.Unassigned ? heroInfo.Might.ToString() : "???");
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
	    load.txt = heroInfo.Load.ToString();
	    if (heroInfo.CanLevelup && (heroInfo.Status == KBN.HeroStatus.Assigned || heroInfo.Status == KBN.HeroStatus.Marching || heroInfo.Status == KBN.HeroStatus.Sleeping || heroInfo.Status == KBN.HeroStatus.Unassigned))
		{
			var deltaAttack : int = GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level + 1).ATTACK - GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level).ATTACK;
			var deltaHealth : int = GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level + 1).LIFE - GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level).LIFE;
			var deltaLoad : int = GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level + 1).TROOP_NUM - GameMain.GdsManager.GetGds.<KBN.GDS_HeroLevel>().GetItemById(heroInfo.Type, heroInfo.Level).TROOP_NUM;
			addMight.txt = String.Format("+{0}", 20 * (deltaAttack + deltaHealth + deltaLoad));
			addAttack.txt = String.Format("+{0}", deltaAttack);
			addHealth.txt = String.Format("+{0}", deltaHealth);
			addLoad.txt = String.Format("+{0}", deltaLoad);
		}
	    if (heroInfo.Level > lastLevel)
	    {
	    	renown.updateWithAnimation(10000);
            isPlayingAnimation = true;
            Invoke("NextLevelAnimation", 1.0f);
	    }
	    else if (heroInfo.Renown > lastRenown)
        {
            renown.updateWithAnimation(heroInfo.NextRenown > 0 ? 10000 * heroInfo.Renown / heroInfo.NextRenown : 0);
            isPlayingAnimation = true;
            Invoke("FinishAnimation", 1.0f);
        }

        lastLevel = heroInfo.Level;
        lastRenown = heroInfo.Renown;
    }

    private function NextLevelAnimation() : void
    {
    	renown.Init(0, 10000, true);
	    renown.updateWithAnimation(heroInfo.NextRenown > 0 ? 10000 * heroInfo.Renown / heroInfo.NextRenown : 0);
	    Invoke("FinishAnimation", 1.0f);
    }

    private function FinishAnimation() : void
    {
    	isPlayingAnimation = false;
    }

	private function RefreshHeroGiftList(needResetPos : boolean) : void
    {
    	var data : System.Collections.Generic.List.<InventoryInfo> =
            HeroManager.Instance().GetHeroItemList(heroInfo);
		nodata.SetVisible(data.Count <= 0);
		for( var i : InventoryInfo in data )
		{
			i.customParam1 = heroInfo.Id;
		}
        giftList.SetData(data);

        if (needResetPos)
        {
	        giftList.ResetPos();
        }
        else
        {
            giftList.AutoLayout();
        }
    }
}
