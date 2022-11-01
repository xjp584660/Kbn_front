public class HeroLevelMax extends PopMenu
{
	@SerializeField
	private var caption : Label;
    @SerializeField
    private var decorationLeft : Label;
    @SerializeField
    private var decorationRight : Label;
    @SerializeField
	private var heroName : Label;
	@SerializeField
	private var headBack : Label;
	@SerializeField
	private var head : Label;
    @SerializeField
	private var frame : Label;
	@SerializeField
	private var description : Label;
    @SerializeField
    private var buttonOK : Button;

    private var heroInfo : KBN.HeroInfo = null;
	
	public function Init():void
	{
	    super.Init();

		caption.txt = Datas.getArString("HeroHouse.RenownMax_Title");
	    buttonOK.txt = Datas.getArString("Common.OK_Button");
	    
	    buttonOK.changeToBlueNew();

	    buttonOK.OnClick = OnOKClick;
	}
	
	public function DrawItem()
	{
	    caption.Draw();
	    decorationLeft.Draw();
	    decorationRight.Draw();
	    headBack.Draw();
	    head.Draw();
	    frame.Draw();
	    heroName.Draw();
	    description.Draw();
	    buttonOK.Draw();
	}
	
	function Update() 
	{
        super.Update();
	}
	
	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);

	    heroInfo = param as KBN.HeroInfo;
	    heroName.txt = heroInfo.Name;
	    if(!heroInfo.CanElevate)
	    {
	    	description.txt = String.Format(Datas.getArString("Hero.MaxLv_Notice"), heroInfo.Name);
	    }
	    else
	    {
	    	description.txt = String.Format(Datas.getArString("HeroHouse.RenownMax_Desc"), heroInfo.Name);
	    }
	   
	    headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
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
	
	private function OnOKClick():void
	{
		MenuMgr.getInstance().PopMenu("HeroLevelMax");
	}
}