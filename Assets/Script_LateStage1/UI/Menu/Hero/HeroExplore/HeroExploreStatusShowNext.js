public class HeroExploreStatusShowNext extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;

    public function HeroExploreStatusShowNext(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.ShowNext;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        for (var i : Label in control.itemAlpha)
        {
            i.alpha = 0.0f;
        }

        var index : int = 0;
        for (var i : Label in control.itemFrame)
        {
            i.rect.x = argument.itemNext[index].x;
            i.rect.y = argument.itemNext[index].y;
            index++;
        }

        index = 0;
        for (var i : Label in control.itemTile)
        {
            i.rect.x = argument.itemNext[index].x;
            i.rect.y = argument.itemNext[index].y + 5; // 5 pixel from frame
            index++;
        }

        main.Animation.AddAlphaAnimation(control.blankPanel, 1.0f, PlayItemAnimation, 0, 1.0f, 0.0f);
    }

    public function Update() : void
	{
	    for (var i : int = 0; i < control.itemFrame.length; i++)
	    {
	        control.itemTile[i].rect.x = control.itemFrame[i].rect.x;
	        control.itemTile[i].rect.y = control.itemFrame[i].rect.y + 5; // 5 pixel from frame
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
        control.bottomBackground.Draw();
        control.map.Draw();
        control.headBack.Draw();
        control.head.Draw();
        control.headFrame.Draw();
        control.headButton.Draw();
        control.number.Draw();
        control.message.Draw();
        control.lineBottom.Draw();
        control.description.Draw();
		control.finish.Draw();
	    control.blankPanel.Draw();
        for (var i : Label in control.itemTile)
        {
            i.Draw();
        }
        for (var i : Label in control.itemFrame)
        {
            i.Draw();
        }
    }

    private function PlayItemAnimation(index : int) : void
    {
        if (index < control.itemFrame.length)
        {
            main.Animation.AddMoveAnimation(control.itemFrame[index], 0.2f, PlayItemAnimation, index + 1, argument.itemNext[index], argument.itemEnd[index]);
        	SoundMgr.instance().PlayEffect("kbn_hero_propswish", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
        }
        else
        {
            main.ChangeStatus(HeroExploreStatusType.ShowLast);
        }
    }
}
