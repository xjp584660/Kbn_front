public class HeroExploreStatusPlay extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var startTime : float = 0.0f;

    public function HeroExploreStatusPlay(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Play;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        startTime = Time.realtimeSinceStartup;
        GameMain.instance().getHeroExploreController().ChangeStatus(HeroExploreStatusType.Teach);
        SoundMgr.instance().PlayEffect("kbn_hero_countdown", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
        SoundMgr.instance().PlayEffect("kbn_hero_orbglow", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
    }

    public function Update() : void
	{
	    var leftTime : float = Constant.Hero.HeroExploreGameTime - (Time.realtimeSinceStartup - startTime);
	    if (leftTime < 0.0f)
	    {
	        leftTime = 0.0f;
	        main.ChangeStatus(HeroExploreStatusType.Timeout);
	    }
	    control.gameProgressText.txt = String.Format("{0:F1} s", leftTime);
	    control.gameProgress.Init(leftTime * 1000, Constant.Hero.HeroExploreGameTime * 1000);
    }

    public function Leave() : void
    {

    }

    public function Draw() : void
	{
		control.npcTitle.Draw();
	    control.npcHead.Draw();
        control.npcBall.Draw();
        control.npcName.Draw();
        control.npcMessage.Draw();
        control.gameProgress.Draw();
        control.gameProgressText.Draw();
        // control.autoButton.Draw();
        // control.autoHelpButton.Draw();
	}
}
