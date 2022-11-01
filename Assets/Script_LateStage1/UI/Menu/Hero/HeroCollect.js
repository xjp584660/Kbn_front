public class HeroCollect extends ComposedMenu
{
	@SerializeField
	private var menuHeroCollect : ComposedUIObj;
	@SerializeField
	private var menuHeroDetail : HeroDetail;
	
	@SerializeField
	private var description : Label;
	@SerializeField
	private var heroCollectTemplate : HeroCollectItem;
	@SerializeField
	private var heroCollectList : ScrollList;

	public function Init() : void
	{
		super.Init();
		
		menuHeroDetail.Init();
		
		setDefautlFrame = false; // do not use default background image
		menuHead.setTitle(Datas.getArString("HeroHouse.Collection_Title"));
		description.txt = Datas.getArString("HeroHouse.Collection_Desc");

		menuHeroCollect.component = [description, heroCollectList];
		tabArray = [menuHeroCollect];
		frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);
		menuHead.backTile.rect = Rect(0, 0, 640, 140);
		menuHead.leftHandler = GoMainMenu;
		bgMiddleBodyPic = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_paper_bottomSystem", TextureType.BACKGROUND), "ui_paper_bottomSystem");
		repeatTimes = -6;
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
//		marginM.SetTextureScale("_MainTex", Vector2(1, 44));
		
		heroCollectList.Init(heroCollectTemplate);
	}

	public function Update() : void
	{
		super.Update();

		menuHead.Update();
		heroCollectList.Update();
	}

	public function DrawBackground() : void
	{
		bgStartY = 70;
		menuHead.Draw();
	    DrawMiddleBg();
	    prot_drawFrameLine();
		frameTop.Draw();
	}

	public function OnPush(param : Object) : void
	{
		super.OnPush(param);
		
		RefreshHeroCollectList();
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
		
		heroCollectList.Clear();
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
            case Constant.Hero.HeroBoosted:
                heroCollectList.UpdateData();
	            break;
            case Constant.Hero.HeroUnlock:
            	MenuMgr.getInstance().PopMenu("HeroGift");
    	        MenuMgr.getInstance().PushMenu("HeroUnlock", param as KBN.HeroInfo, "trans_zoomComp");
	            break;
	        case Constant.Hero.HeroElevateOKFromCollectAndDetailMenu:
	        	heroCollectList.UpdateData();
	        	break;
	    }
    }
	
	public function OpenHeroDetail(heroInfo : KBN.HeroInfo) : void
	{
	    menuHead.leftHandler = GoBackMenu;
	    menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
		//PushSubMenu(menuHeroDetail, { "from" : "collect", "hero" : heroInfo });
		MenuMgr.getInstance().PushMenu("HeroDetail", {"from" : "collect", "hero" : heroInfo });
	}

    public function GoBackMenu() : void
    {
        menuHead.leftHandler = GoMainMenu;
        menuHead.setTitle(Datas.getArString("HeroHouse.Collection_Title"));
		//PopSubMenu();
		MenuMgr.getInstance().PopMenu("HeroDetail");
    }

    public function GoMainMenu() : void
    {
        MenuMgr.getInstance().PopMenu("HeroCollect");
    }
	
	private function RefreshHeroCollectList() : void
	{
	    heroCollectList.SetData((KBN.HeroManager.Instance.GetCollectedHeroList() as List.<KBN.HeroInfo>).ToArray());
		heroCollectList.ResetPos();
	}
}
