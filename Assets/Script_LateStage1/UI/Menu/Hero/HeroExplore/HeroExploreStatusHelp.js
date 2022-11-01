public class HeroExploreStatusHelp extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var elapseTime : float = 0.0f;
    private var step : int = 0;

    public function HeroExploreStatusHelp(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Help;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
    	elapseTime = argument.handInterval;
    	step = 0;
    }

    public function Update() : void
	{
		elapseTime += Time.deltaTime;
		if (elapseTime >= argument.handInterval)
		{
			elapseTime -= argument.handInterval;
			PlayHand(0);
			step = (step + 1) % argument.npcSpeakCount;
			main.Animation.AddAlphaAnimation(control.npcMessage, 0.2f, ChangeMessage, null, 1.0f, 0.0f);
		}
		
	    if (Input.GetMouseButtonDown(0))
        {
            main.ChangeStatus(HeroExploreStatusType.Play);
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
        control.npcHand.Draw();
        control.npcHandTips.Draw();
	}
	
	private function PlayHand(userData : Object) : void
	{
		var animationStep : int = _Global.INT32(userData);
        if (animationStep == 0)
        {
        	main.Animation.AddAlphaAnimation(control.npcHand, 0.2f, PlayHand, 1, 0.0f, 1.0f);
        }
        else if (animationStep == 1)
        {
        	main.Animation.AddMoveAnimation(control.npcHand, argument.handSpeed, PlayHand, 2,
	            argument.handFromPos, argument.handToPos);
        }
        else if (animationStep == 2)
        {
        	main.Animation.AddMoveAnimation(control.npcHand, argument.handSpeed, PlayHand, 3,
	            argument.handToPos, argument.handFromPos);
        }
        else if (animationStep == 3)
        {
        	main.Animation.AddMoveAnimation(control.npcHand, argument.handSpeed, PlayHand, 4,
	            argument.handFromPos, argument.handToPos);
        }
        else if (animationStep == 4)
        {
        	main.Animation.AddMoveAnimation(control.npcHand, argument.handSpeed, PlayHand, 5,
	            argument.handToPos, argument.handFromPos);
        }
        else if (animationStep == 5)
        {
        	main.Animation.AddAlphaAnimation(control.npcHand, 0.2f, null, null, 1.0f, 0.0f);
        }
	}
	
	private function ChangeMessage() : void
	{
		control.npcMessage.txt = Datas.getArString(String.Format("HeroHouse.Explore_Merlin_Text{0}", step + 1));
		main.Animation.AddAlphaAnimation(control.npcMessage, 0.2f, null, null, 0.0f, 1.0f);
	}
}
