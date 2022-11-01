public class HeroOpened extends PopMenu
{
	@SerializeField
	private var head : Label;
	@SerializeField
	private var caption : Label;
    @SerializeField
    private var message : Label;
	@SerializeField
	private var ok : Button;
	@SerializeField
    private var frameOffset : RectOffset;

	public function Init() : void
	{
	    super.Init();

		caption.txt = Datas.getArString("Hero.Notice_Title");
	    message.txt = Datas.getArString("Hero.Notice_Desc");
	    ok.txt = Datas.getArString("Common.OK_Button");
	    
	    ok.changeToBlueNew();
	    ok.OnClick = OnOKClick;
	}

	public function Update() : void
	{
		super.Update();
	}
	
	public function resetLayout()
    {
        ResetLayoutWithRectOffset(frameOffset);
    }
	
	protected function DrawLastItem()
	{
		caption.Draw();
	}
	
	public function DrawItem() : void
	{
	    head.Draw();
	    message.Draw();
	    ok.Draw();
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
	    MenuMgr.getInstance().PopMenu("HeroOpened");
	}
}
