public class HeroExploreStatusTimeout extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;

    public function HeroExploreStatusTimeout(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Timeout;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        GameMain.instance().getHeroExploreController().ChangeStatus(HeroExploreStatusType.Ready);
        
        main.Animation.AddAlphaAnimation(control.npcTitle, 1.0f, NextStatus, null, 1.0f, 0.0f);
        main.Animation.AddAlphaAnimation(control.npcHead, 1.0f, null, null, 1.0f, 0.0f);
        main.Animation.AddAlphaAnimation(control.npcBall, 1.0f, null, null, 1.0f, 0.0f);
        main.Animation.AddAlphaAnimation(control.npcName, 1.0f, null, null, 1.0f, 0.0f);
        main.Animation.AddAlphaAnimation(control.npcMessage, 1.0f, null, null, 1.0f, 0.0f);
        
        SoundMgr.instance().PlayEffect("kbn_hero_orbzap", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
    }

    public function Update() : void
	{

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
    }

    private function NextStatus(userData : Object) : void
    {
        main.ChangeStatus(HeroExploreStatusType.Wait);
    }
}
