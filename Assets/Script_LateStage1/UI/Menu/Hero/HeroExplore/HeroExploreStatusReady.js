public class HeroExploreStatusReady extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var elapseTime : float = 0.0f;

    public function HeroExploreStatusReady(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Ready;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
    	elapseTime = 0.0f;
    }

    public function Update() : void
	{
        // 添加Auto按钮 去掉帮助状态
		// elapseTime += Time.deltaTime;
		// if (elapseTime >= argument.handInterval)
		// {
		// 	main.ChangeStatus(HeroExploreStatusType.Help);
		// }
		
	    // if (Input.GetMouseButtonDown(0))
        // {
        //     main.ChangeStatus(HeroExploreStatusType.Play);
        // }
    }

    public function Leave() : void
    {
    	main.Animation.AddAlphaAnimation(control.blackPanel, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcHandTips, 0.2f, null, null, 0.0f, 1.0f);
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
        control.autoButton.Draw();
        control.autoHelpButton.Draw();
        this.main.DrawBallBtn();
	}
}
