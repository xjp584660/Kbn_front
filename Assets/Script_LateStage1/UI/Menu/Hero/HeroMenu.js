public class HeroMenu extends ComposedMenu
{
	@SerializeField
	private var menuHeroMain : ComposedUIObj;
	@SerializeField
	private var menuHeroDetail : HeroDetail;

	@SerializeField
	private var explain : Label;
	@SerializeField
	private var titleBackground : Label;
	@SerializeField
	private var rankBack : Label;
	@SerializeField
    private var rank : Button;
    @SerializeField
    private var rankLight : Label;
    @SerializeField
    private var collectBack : Label;
	@SerializeField
	private var collect : Button;
	@SerializeField
	private var help : Button;
	@SerializeField
	private var collectCount : NotifyBug;
	@SerializeField
	private var description : Label;
    @SerializeField
    private var line : Label;
    @SerializeField
    private var leftLine : Label;
    @SerializeField
    private var rightLine : Label;
    @SerializeField
    private var bottom : Label;
	@SerializeField
	private var heroTemplate : HeroItem;
	@SerializeField
	private var heroList : ScrollList;
	@SerializeField
	private var flashSpeed : float;

	public function Init() : void
	{
	    super.Init();

	    menuHeroDetail.Init();

	    menuHead.setTitle(Datas.getArString("HeroHouse.Name"));
	    description.txt = Datas.getArString("HeroHouse.Desc");

		setDefautlFrame = false; // do not use default background image
		menuHeroMain.component = [titleBackground, rankBack, rank, rankLight, collectBack, collect, collectCount, help, description, heroList];
		tabArray = [menuHeroMain];
		frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);
		menuHead.backTile.rect = Rect(0, 0, 640, 140);
		
		bgMiddleBodyPic = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_hero_hpbg1",TextureType.DECORATION), "ui_hero_hpbg1");
		explain.tile = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_paper_bottom", TextureType.BACKGROUND), "ui_paper_bottom");
		titleBackground.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_hp_details");
		leftLine.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_paper_wen");
		rightLine.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_paper_wen");

		heroList.Init(heroTemplate);
		
		rank.OnClick = OnRankClick;
		collect.OnClick = OnCollectClick;
		help.OnClick = OnHelpClick;
	}

	public function Update() : void
	{
		super.Update();

		menuHead.Update();
		heroList.Update();
		rankLight.alpha = 0.5f * (1 + Mathf.Sin(Time.realtimeSinceStartup * flashSpeed));
	}

	public function DrawBackground() : void
	{
		bgStartY = 70;
		menuHead.Draw();
	    DrawMiddleBg();
	    bottom.Draw(); // draw here first
		explain.Draw(); // draw here second
		leftLine.Draw();
		rightLine.Draw();
		line.Draw();
		frameTop.Draw();
	}

	public function OnPush(param : Object) : void
	{
		super.OnPush(param);

		RefreshHeroList();
		RefreshCollectCountIcon();
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
		super.OnPopOver();

		heroList.Clear();
		TryDestroy(menuHead);
		menuHead = null;
	}

	public function handleNotification(type : String, param : Object) : void
    {
        if (GetTopSubMenu() != null)
        {
            menuHeroDetail.handleNotification(type, param);
	    }

        switch (type)
	    {
            case Constant.Hero.HeroErrorMessage:
                MenuMgr.getInstance().PopMenu("HeroMenu");
                break;
            case Constant.Hero.HeroInfoListUpdated:
            case Constant.Hero.HeroBoosted:
            case Constant.Hero.HeroUnassigned:
            case Constant.Hero.HeroAssigned:
            case Constant.Hero.HeroElevateOKFromHeroMenu:
            case Constant.Hero.SkillLevelUpOK:
	            heroList.UpdateData();
	            break;
	        case Constant.Hero.HeroElevateOKFromDetail:
	        case Constant.Hero.HeroElevateOKFromCollectAndDetailMenu:
	        case Constant.Hero.HeroElevateOKFromAssignAndDetail:
	        	RefreshHeroList();
	        	break;
            case Constant.Hero.HeroStatusUpdated:
                heroList.UpdateData();
                break;
	    }
    }

    public function OpenHeroDetail(heroInfo : KBN.HeroInfo) : void
	{
	    menuHead.leftHandler = GoBackMenu;
        menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
		//PushSubMenu(menuHeroDetail, { "from" : "main", "hero" : heroInfo });
		MenuMgr.getInstance().PushMenu("HeroDetail", {"from" : "main", "hero" : heroInfo });
    }

    public function GoBackMenu() : void
    {
        menuHead.leftHandler = null;
        menuHead.setTitle(Datas.getArString("HeroHouse.Name"));
		//PopSubMenu();
        MenuMgr.getInstance().PopMenu("HeroDetail");
    }
    
    private function OnRankClick(param : Object) : void
    {
    	MenuMgr.getInstance().PushMenu("PveLeaderboardMenu", 1, "trans_zoomComp");
    }

	private function OnCollectClick(param : Object) : void
	{
		MenuMgr.getInstance().PushMenu("HeroCollect", null);
		PlayerPrefs.SetInt(Constant.Hero.HeroCollectCount, 0);
		RefreshCollectCountIcon();
	}

	private function OnHelpClick() : void
	{
		var setting : InGameHelpSetting = new InGameHelpSetting();
		setting.name = Datas.getArString("HeroHouse.Name");
		setting.type = "building";
		setting.key = Constant.Building.HERO.ToString();

		MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
	}

	private function RefreshHeroList() : void
	{
	    var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
	    heroList.SetData((KBN.HeroManager.Instance.GetHeroSlotList(currentCityIndex) as List.<KBN.HeroSlot>).ToArray());
		heroList.ResetPos();
	}

	private function RefreshCollectCountIcon() : void
	{
		var count : int = PlayerPrefs.GetInt(Constant.Hero.HeroCollectCount, 0);
		collectCount.SetCnt(count);
	}
}
