public class HeroExploreEnd extends PopMenu
{
	@SerializeField
	private var head : Label;
    @SerializeField
    private var message : Label;
	@SerializeField
	private var ok : Button;
	@SerializeField
	private var cancel : Button;

	public function Init() : void
	{
	    super.Init();

	    message.txt = Datas.getArString("HeroHouse.Explore_Warning");
	    ok.txt = Datas.getArString("HeroHouse.EndExploreButton");
	    cancel.txt = Datas.getArString("Common.Cancel_Button");
	    
	    ok.changeToRedNew();
	    cancel.changeToBlueNew();
 		
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_ex_merlinend");

	    ok.OnClick = OnOKClick;
	    cancel.OnClick = OnCancelClick;
	}

	public function Update() : void
	{
		super.Update();
	}
	
	public function DrawItem() : void
	{
	    head.Draw();
	    message.Draw();
	    ok.Draw();
	    cancel.Draw();
	}

	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);
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
	
	private function OnOKClick(param : Object) : void
	{
	    MenuMgr.getInstance().PopMenu("HeroExplore");
	}

    private function OnCancelClick(param : Object) : void
	{
	    MenuMgr.getInstance().PopMenu("HeroExploreEnd");
	}
}
