
public class HeroExploreStatusAuto extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var fireCount : int;
    private var isStartAuto : Boolean = false;
    private var count : int;
    private var elapseTime : float = 0.0f;

    public function HeroExploreStatusAuto(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Auto;
    }

    public function Init() : void
    {

    }


    public function Update() : void
	{
        if(isStartAuto)
        {
            elapseTime += Time.deltaTime;
            if (elapseTime >= 0.5f)
            {
                elapseTime = 0.0f;
            	count++;
            }
            if(count > this.fireCount)
            {
                count = this.fireCount;
                isStartAuto = false;
                // if (main.HeroInfo != null)
                // {
                //     var cityId : int = GameMain.instance().getCurCityId();
                //     var speed : int = GameMain.instance().getHeroExploreController().GetSpeed();
                //     KBN.HeroManager.Instance.RequestInitHeroExplore(main.HeroInfo.Id, cityId, speed);
                // }
                // else
                // {
                //     main.ChangeStatus(HeroExploreStatusType.ShowFirst);
                // }
                main.ChangeStatus(HeroExploreStatusType.Timeout);
            }
            GameMain.instance().getHeroExploreController().SetSpeed(count);
            GameMain.instance().getHeroExploreController().PlayAutoFire();
        }
    }

    public function Enter() : void
    {
        control.gameProgressText.txt = String.Format("{0:F1} s", 0);
	    control.gameProgress.Init(0 * 1000, Constant.Hero.HeroExploreGameTime * 1000);
        elapseTime = 0.0f;
        count = 0;
        var fireArray : Array = new Array([10, 20, 40, 65, 85, 100]);
        // random : int = Math.Floor(Math.random() * (100 - 1)) + 1;
        var random : int = Random.Range(1,100);
        for(var i : int = 0; i < fireArray.length; i++)
        {
            if(random < _Global.INT32(fireArray[i]))
            {
                this.fireCount = i + 1;
                break;
            }
        }
        isStartAuto = true;
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
	}
}