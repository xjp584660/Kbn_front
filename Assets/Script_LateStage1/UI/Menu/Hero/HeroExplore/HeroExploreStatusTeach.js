public class HeroExploreStatusTeach extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var step : int = 0;

    public function HeroExploreStatusTeach(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Teach;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
    	PlayerPrefs.SetInt(Constant.Hero.HeroExploreOpenedFlag, 1);
    	
    	step = 0;
    	MoveArrow(0);
    }

    public function Update() : void
	{
		if (control.npcMessage.alpha > 0.99f && Input.GetMouseButtonDown(0))
        {
            step++;
            if (step < argument.npcSpeakCount)
            {
            	main.Animation.AddAlphaAnimation(control.npcMessage, 0.2f, ChangeMessage, null, 1.0f, 0.0f);
            	main.Animation.AddAlphaAnimation(control.npcMessageArrow, 0.2f, null, null, 1.0f, 0.0f);
            }
            else
            {
            	main.ChangeStatus(HeroExploreStatusType.Help);
            }
        }
    }

    public function Leave() : void
    {

    }

    public function Draw() : void
	{
		control.npcTitle.Draw();
        control.gameProgress.Draw();
        control.gameProgressText.Draw();
        control.blackPanel.Draw();
        control.npcHead.Draw();
        control.npcBall.Draw();
        control.npcName.Draw();
        control.npcMessage.Draw();
        control.npcMessageArrow.Draw();
	}
	
	private function ChangeMessage() : void
	{
		control.npcMessage.txt = Datas.getArString(String.Format("HeroHouse.Explore_Merlin_Text{0}", step + 1));
		main.Animation.AddAlphaAnimation(control.npcMessage, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcMessageArrow, 0.2f, null, null, 0.0f, 1.0f);
	}
	
	private function MoveArrow(userData : Object) : void
	{
		var animationStep : int = _Global.INT32(userData);
		if (animationStep == 0)
		{
			main.Animation.AddMoveAnimation(control.npcMessageArrow, argument.arrowSpeed, MoveArrow, 1, argument.arrowFromPos, argument.arrowToPos);
		}
		else
		{
			main.Animation.AddMoveAnimation(control.npcMessageArrow, argument.arrowSpeed, MoveArrow, 0, argument.arrowToPos, argument.arrowFromPos);
		}
	}
}
