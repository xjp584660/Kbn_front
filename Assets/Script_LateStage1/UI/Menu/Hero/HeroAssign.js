public class HeroAssign extends ComposedMenu
{
	@SerializeField
	private var menuHeroAssign : ComposedUIObj;
	@SerializeField
	private var menuHeroDetail : HeroDetail;
	
	@SerializeField
	private var description : Label;
	@SerializeField
	private var line : Label;
	@SerializeField
	private var heroAssignTemplate : HeroAssignItem;
	@SerializeField
	private var heroAssignList : ScrollList;
	@SerializeField
	private var nodata : Label;

	private var heroSlot : KBN.HeroSlot = null;

	public function Init() : void
	{
		super.Init();
		
		menuHeroDetail.Init();
		
		menuHead.setTitle(Datas.getArString("HeroHouse.Assign_Title"));
		description.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_assign_bg");
		description.txt = Datas.getArString("HeroHouse.AssignDesc");
		nodata.txt = Datas.getArString("HeroHouse.Assign_NoHero");
		menuHeroAssign.component = [line, nodata, heroAssignList];
		tabArray = [menuHeroAssign];
		frameTop.rect = Rect(0, 69, frameTop.rect.width, frameTop.rect.height);
		menuHead.backTile.rect = Rect(0, 0, 640, 140);
		menuHead.leftHandler = GoMainMenu;

		heroAssignList.Init(heroAssignTemplate);
	}

	public function Update() : void
	{
		super.Update();

		menuHead.Update();
		heroAssignList.Update();
	}

	public function DrawBackground() : void
	{
		bgStartY = 70;
		menuHead.Draw();
		DrawMiddleBg();
		description.Draw(); // draw here first
		frameTop.Draw();
	}

	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);

	    heroSlot = param as KBN.HeroSlot;
		
		RefreshHeroAssignList();
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
		
		heroAssignList.Clear();
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
        	case Constant.Hero.HeroElevateOKFromAssignAndDetail:
            case Constant.Hero.HeroBoosted:
                heroAssignList.UpdateData();
	            break;
            case Constant.Hero.HeroUnlock:
            	MenuMgr.getInstance().PopMenu("HeroGift");
    	        MenuMgr.getInstance().PushMenu("HeroUnlock", param as KBN.HeroInfo, "trans_zoomComp");
	            break;
	        case Constant.Hero.HeroAssigned:
                MenuMgr.getInstance().PopMenu("HeroAssign");
                MenuMgr.getInstance().PushMessage(String.Format(Datas.getArString("Common.HeroSummonedDesc"), (param as KBN.HeroInfo).Name));
	            break;
	    }
    }
	
	public function OpenHeroDetail(heroInfo : KBN.HeroInfo) : void
	{
	    menuHead.leftHandler = GoBackMenu;
	    menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
		//PushSubMenu(menuHeroDetail, { "from" : "assign", "hero" : heroInfo });
		MenuMgr.getInstance().PushMenu("HeroDetail", {"from" : "assign", "hero" : heroInfo });
	}

    public function GoBackMenu() : void
    {
        menuHead.leftHandler = GoMainMenu;
        menuHead.setTitle(Datas.getArString("HeroHouse.Assign_Title"));
		//PopSubMenu();
		MenuMgr.getInstance().PopMenu("HeroDetail");
    }

    public function GoMainMenu() : void
    {
        MenuMgr.getInstance().PopMenu("HeroAssign");
    }

	public function RequestAssign(heroInfo : KBN.HeroInfo) : void
    {
        var cityId : int = GameMain.instance().getCurCityId();
        KBN.HeroManager.Instance.RequestAssign(heroInfo.Id, cityId, heroSlot.Index);
	}
	
	private function RefreshHeroAssignList() : void
	{
		var data : Array = (KBN.HeroManager.Instance.GetUnassignedHeroList() as List.<KBN.HeroInfo>).ToArray();
		nodata.SetVisible(data.length <= 0);
	    heroAssignList.SetData(data);
		heroAssignList.ResetPos();
	}
}
