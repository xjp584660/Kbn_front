public class HeroUnlock extends KBNMenu
{
	@SerializeField
    private var screenBackground : Label;
	@SerializeField
	private var lightBackground : Label;
    @SerializeField
    private var panelBackground : Label;
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
    @SerializeField
    private var speed : float;

    private var heroInfo : KBN.HeroInfo = null;
    private var effectRotate : Rotate;
	
	public function Init():void
	{
	    super.Init();

	    description.txt = Datas.getArString("Common.HeroSummonedDesc");
	    buttonOK.txt = Datas.getArString("Common.OK_Button");
	    
	    buttonOK.changeToBlueNew();

	    frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");

	    effectRotate = new Rotate();
	    effectRotate.init(lightBackground, EffectConstant.RotateType.LOOP, Rotate.RotateDirection.CLOCKWISE, 0.0f, 0.0f);
	    effectRotate.playEffect();

	    buttonOK.OnClick = OnOKClick;
	}
	
	public function DrawItem()
	{
	    screenBackground.Draw();
	    effectRotate.drawItems();
	    panelBackground.Draw();
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

		effectRotate.rotateMultiple = speed;
        effectRotate.updateEffect();
	}
	
	public function OnPush(param : Object) : void
	{
	    super.OnPush(param);

	    heroInfo = param as KBN.HeroInfo;
	    heroName.txt = heroInfo.Name;
	    headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
	    
	    SoundMgr.instance().PlayEffect("kbn_hero_heropopup", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
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
		MenuMgr.getInstance().PopMenu("HeroUnlock");
	}
}