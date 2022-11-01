public class HeroExploreStatusWait extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;

    public function HeroExploreStatusWait(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Wait;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        control.blankPanel.alpha = 1.0f;
        GameMain.instance().getHeroExploreController().ChangeStatus(HeroExploreStatusType.Help);

        if (main.HeroInfo != null)
        {
            var cityId : int = GameMain.instance().getCurCityId();
            var speed : int = GameMain.instance().getHeroExploreController().GetSpeed();
            KBN.HeroManager.Instance.RequestInitHeroExplore(main.HeroInfo.Id, cityId, speed);
        }
        else
        {
            main.ChangeStatus(HeroExploreStatusType.ShowFirst);
        }
    }

    public function Update() : void
	{

    }

    public function Leave() : void
    {

    }

    public function Draw() : void
	{
	    control.blankPanel.Draw();
	}
}
