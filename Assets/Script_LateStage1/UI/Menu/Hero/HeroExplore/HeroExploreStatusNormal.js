public class HeroExploreStatusNormal extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var exploreAnimation : HeroExplore.HeroExploreAnimation[] = null;
    private var elapseTime : float = 0.0f;
    private var step : int = 0;

    public function HeroExploreStatusNormal(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument, exploreAnimation : HeroExplore.HeroExploreAnimation[])
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
        this.exploreAnimation = exploreAnimation;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Normal;
    }

    public function Init() : void
    {
		ChangeMessage();
    }

    public function Enter() : void
    {
		
    }

    public function Update() : void
	{
		elapseTime += Time.deltaTime;
		
		if (elapseTime >= argument.heroSpeakInterval)
		{
			elapseTime -= argument.heroSpeakInterval;
			step = (step + 1) % argument.heroSpeakCount;
			main.Animation.AddAlphaAnimation(control.message, 0.2f, ChangeMessage, null, 1.0f, 0.0f);
		}
		
	    for (var i : HeroExplore.HeroExploreAnimation in exploreAnimation)
	    {
	        i.Update();
	    }
    }

    public function Leave() : void
    {

    }

    public function Draw() : void
	{
	    for (var i : Label in control.itemBackground)
		{
		    i.Draw();
		}
        for (var i : Label in control.itemTile)
		{
		    i.Draw();
        }
        for (var i : Label in control.itemFrame)
		{
		    i.Draw();
		}
        for (var i : Label in control.itemAlpha)
		{
		    i.Draw();
		}
        for (var i : Button in control.item)
		{
		    i.Draw();
		}
        control.bottomBackground.Draw();
        control.map.Draw();
        for (var i : Button in control.explore)
		{
			i.Draw();
        }
        for (var i : Label in control.exploreEffect)
	    {
	        i.Draw();
	    }
        for (var i : Label in control.box)
		{
			i.Draw();
		}
        control.headBack.Draw();
        control.head.Draw();
        control.headFrame.Draw();
        control.headButton.Draw();
        control.number.Draw();
        control.message.Draw();
        control.lineBottom.Draw();
        control.description.Draw();
		control.finish.Draw();
		control.itemDescription.Draw();
        for (var i : Label in control.itemLight)
		{
		    i.Draw();
		}
	}
	
	public function NextMessage() : void
	{
		elapseTime = argument.heroSpeakInterval;
	}
	
	private function ChangeMessage() : void
	{
		control.message.txt = Datas.getArString(String.Format("HeroHouse.Explore_Hero_Text{0}", step + 1));
		control.message.mystyle.wordWrap = false;
		var messageSize : Vector2 = control.message.mystyle.CalcSize(GUIContent(control.message.txt));
		control.message.mystyle.wordWrap = true;
		var width : int = messageSize.x * 0.5f + 50;
		var height : int = 60;
		if (width > 400)
		{
			width = messageSize.x * 0.333333f + 50;
			height = 85;
		}
		control.message.rect.width = width;
		control.message.rect.height = height;
		main.Animation.AddAlphaAnimation(control.message, 0.2f, null, null, 0.0f, 1.0f);
	}
}
