public class HeroExploreStatusLoad extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;

    public function HeroExploreStatusLoad(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Load;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
    	control.lightBackground.SetVisible(false);
    	control.npcMessage.txt = Datas.getArString("HeroHouse.Explore_Merlin_Text1");
    	
        var index : int = 0;
        for (var i : Vector2 in argument.explorePos) // Generator Position
        {
        	i = argument.exploreBasePos[index];
        	i.x += _Global.GetRandNumber(-argument.explorePosOffset, argument.explorePosOffset);
        	i.y += _Global.GetRandNumber(-argument.explorePosOffset, argument.explorePosOffset);
        	index++;
        }
        for (var id : int = 0; id < argument.explorePos.Length; id++) // Random Switch Position
        {
        	var other : int = _Global.GetRandNumber(0, argument.explorePos.Length);
        	var tempPos : Vector2 = argument.explorePos[id];
        	argument.explorePos[id] = argument.explorePos[other];
        	argument.explorePos[other] = tempPos;
        }
        
        index = 0;
        for (var i : Button in control.explore)
        {
            i.rect.x = argument.explorePos[index].x;
            i.rect.y = argument.explorePos[index].y;
            i.SetDisabled(true);
            index++;
        }
        index = 0;
        for (var i : Label in control.box)
        {
            i.rect.x = argument.explorePos[index].x + argument.boxPosOffset.x;
            i.rect.y = argument.explorePos[index].y + argument.boxPosOffset.y;
			i.SetVisible(false);
            index++;
        }
        index = 0;
        for (var i : Label in control.boxIcon)
        {
            i.alpha = 1.0f;
			i.SetVisible(false);
            index++;
        }
        index = 0;
        for (var i : Label in control.itemLight)
        {
            i.alpha = 0.0f;
            index++;
        }
        control.itemDescription.alpha = 0.0f;
        control.itemAlphaTips.alpha = 0.0f;
        index = 0;
        for (var i : Label in control.exploreEffect)
        {
            i.rect.x = argument.explorePos[index].x;
            i.rect.y = argument.explorePos[index].y;
            i.SetVisible(false);
            index++;
		}

		control.npcTitle.alpha = 0.0f;
    	control.npcHead.alpha = 0.0f;
        control.npcBall.alpha = 0.0f;
        control.npcName.alpha = 0.0f;
        control.npcMessage.alpha = 0.0f;
        control.npcMessageArrow.alpha = 0.0f;
        control.gameProgressText.txt = String.Format("{0:F1} s", Constant.Hero.HeroExploreGameTime);
        control.gameProgress.Init(Constant.Hero.HeroExploreGameTime * 1000, Constant.Hero.HeroExploreGameTime * 1000);
        control.npcHand.alpha = 0.0f;
        control.npcHand.rect.x = argument.handFromPos.x;
		control.npcHand.rect.y = argument.handFromPos.y;
		control.npcMessageArrow.rect.x = argument.arrowFromPos.x;
		control.npcMessageArrow.rect.y = argument.arrowFromPos.y;
		

        GameMain.singleton.loadLevel(GameMain.HERO_EXPLORE_LEVEL);
    }

    public function Update() : void
	{

    }

    public function Leave() : void
    {
		GameMain.instance().getHeroExploreController().ChangeStatus(HeroExploreStatusType.Load);
		
		main.Animation.AddAlphaAnimation(control.npcTitle, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcHead, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcBall, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcName, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcMessage, 0.2f, null, null, 0.0f, 1.0f);
		main.Animation.AddAlphaAnimation(control.npcMessageArrow, 0.2f, null, null, 0.0f, 1.0f);
    }

    public function Draw() : void
	{

	}
}
