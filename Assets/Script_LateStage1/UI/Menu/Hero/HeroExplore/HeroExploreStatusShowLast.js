public class HeroExploreStatusShowLast extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var exploreAnimation : HeroExplore.HeroExploreAnimation[] = null;

    public function HeroExploreStatusShowLast(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument, exploreAnimation : HeroExplore.HeroExploreAnimation[])
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
        this.exploreAnimation = exploreAnimation;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.ShowLast;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        var index : int = 0;
        for (var i : Label in control.itemFrame)
        {
            i.rect.x = argument.itemEnd[index].x;
            i.rect.y = argument.itemEnd[index].y;
            index++;
        }

        index = 0;
        for (var i : Label in control.itemTile)
        {
            i.rect.x = argument.itemEnd[index].x;
            i.rect.y = argument.itemEnd[index].y + 5; // 5 pixel from frame
            index++;
        }
        
        index = 0;
        for (var i : Label in control.itemAlpha)
        {
            if (index == 0)
            {
                main.Animation.AddAlphaAnimation(i, 1.0f, ShowAlphaTips, null, 0.0f, 1.0f);
            }
            else
            {
                main.Animation.AddAlphaAnimation(i, 1.0f, null, null, 0.0f, 1.0f);
            }
            index++;
        }

        for (var i : Button in control.explore)
        {
            main.Animation.AddAlphaAnimation(i, 1.0f, null, null, 0.0f, 1.0f);
        }
    }

    public function Update() : void
	{

    }

    public function Leave() : void
    {
        for (var i : Button in control.explore)
        {
            i.SetDisabled(false);
        }
        for (var i : HeroExplore.HeroExploreAnimation in exploreAnimation)
        {
            i.animActive = true;
        }
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
		control.itemAlphaTips.Draw();
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
        control.headBack.Draw();
        control.head.Draw();
        control.headFrame.Draw();
        control.headButton.Draw();
        control.number.Draw();
        control.message.Draw();
        control.lineBottom.Draw();
        control.description.Draw();
        control.finish.Draw();
	}
	
	private function ShowAlphaTips(userData : Object) : void
	{
		main.Animation.AddAlphaAnimation(control.itemAlphaTips, 1.0f, WaitAlphaTips, null, 0.0f, 1.0f);
	}
	
	private function WaitAlphaTips(userData : Object) : void
	{
		main.Animation.AddDelayAnimation(control.itemAlphaTips, argument.itemAlphaTipsDelay, HideAlphaTips, null);
	}
	
	private function HideAlphaTips(userData : Object) : void
	{
		main.Animation.AddAlphaAnimation(control.itemAlphaTips, 1.0f, NextStatus, null, 1.0f, 0.0f);
	}

    private function NextStatus(userData : Object) : void
    {
        main.ChangeStatus(HeroExploreStatusType.Normal);
    }
}
