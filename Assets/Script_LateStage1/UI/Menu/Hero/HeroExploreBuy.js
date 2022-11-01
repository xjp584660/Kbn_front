public class HeroExploreBuy extends PopMenu
{
	@SerializeField
	private var line : Label;
    @SerializeField
    private var icon : Label;
    @SerializeField
    private var description : Label;
    @SerializeField
    private var owned : Label;
    @SerializeField
    private var use : Button;
    @SerializeField
    private var price : Label;
	@SerializeField
	private var buy : Button;
	@SerializeField
	private var vipIcon : Label;
	@SerializeField
	private var vipDescription : Label;

	private var heroInfo : KBN.HeroInfo = null;

	public function Init() : void
	{
	    super.Init();

	    title.txt = Datas.getArString("HeroHouse.Explore_RefillStamina_Title");
	    description.txt = Datas.getArString("HeroHouse.Explore_RefillStamina_Text");
	    use.txt = Datas.getArString("Common.Use_button");
	    buy.txt = Datas.getArString("Common.BuyAndUse_button");
	    vipDescription.txt = Datas.getArString("VIP.Energy_Tip");
	    
	    use.changeToBlueNew();
	    buy.changeToGreenNew();
 		
	    icon.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_item");

	    use.OnClick = OnUseClick;
	    buy.OnClick = OnBuyClick;
	}

	public function Update() : void
	{
		super.Update();
	}
	
	public function DrawItem() : void
	{
	    line.Draw();
	    icon.Draw();
	    description.Draw();
	    vipIcon.Draw();
	    vipDescription.Draw();
	    if (KBN.HeroManager.Instance.GetCurrentCostItemCount() > 0)
	    {
	        owned.Draw();
	        use.Draw();
	    }
	    else
	    {
	        price.Draw();
	        buy.Draw();
	    }
	}

	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);

	    heroInfo = param as KBN.HeroInfo;

	    owned.txt = String.Format("{0}: {1}", Datas.getArString("Common.Owned"), KBN.HeroManager.Instance.GetCurrentCostItemCount().ToString());
	    price.txt = KBN.HeroManager.Instance.GetCurrentCostGems().ToString();
	    
	    if (GameMain.instance().IsVipOpened())
	    {
	    	vipIcon.SetVisible(true);
	    	vipDescription.SetVisible(true);
	    	vipDescription.SetNormalTxtColor(GameMain.instance().GetVipOrBuffLevel() >= 8 ? FontColor.SmallTitle : FontColor.Red);
	    }
	    else
	    {
	    	vipIcon.SetVisible(false);
	    	vipDescription.SetVisible(false);
	    }
	    
	    SoundMgr.instance().PlayEffect("kbn_hero_staminaout", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
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
	}

    private function OnUseClick(param : Object) : void
	{
	    MenuMgr.getInstance().PopMenu("HeroExploreBuy");
	    var exploreId : long = KBN.HeroManager.Instance.GetCurrentExploreId();
	    var costItemId : int = KBN.HeroManager.Instance.GetCurrentCostItemId();
	    KBN.HeroManager.Instance.RequestProcessHeroExplore(heroInfo.Id, exploreId, costItemId, 0);
	}

    private function OnBuyClick(param : Object) : void
	{
	    MenuMgr.getInstance().PopMenu("HeroExploreBuy");
        var costGems : int = KBN.HeroManager.Instance.GetCurrentCostGems();
        if (Payment.instance().Gems < costGems)
        {
            MenuMgr.getInstance().PushPaymentMenu();
            return;
        }

        var exploreId : long = KBN.HeroManager.Instance.GetCurrentExploreId();
        var costItemId : int = KBN.HeroManager.Instance.GetCurrentCostItemId();
	    KBN.HeroManager.Instance.RequestProcessHeroExplore(heroInfo.Id, exploreId, costItemId, costGems);
	}
}
