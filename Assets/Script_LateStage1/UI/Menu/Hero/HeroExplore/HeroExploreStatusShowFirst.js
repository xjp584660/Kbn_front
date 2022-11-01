public class HeroExploreStatusShowFirst extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;

    public function HeroExploreStatusShowFirst(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument)
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.ShowFirst;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        control.number.txt = String.Format("x {0}", KBN.HeroManager.Instance.GetCurrentExploreStrength().ToString());

        var index : int = 0;
        var item : KBN.HeroExploreItem = null;
        for (var i : Label in control.itemFrame)
        {
            item = KBN.HeroManager.Instance.GetHeroExploreItem(index);
            i.txt = String.Format("x{0}", item != null ? item.Count.ToString() : "0");
            i.rect.x = argument.itemStart[index].x;
            i.rect.y = argument.itemStart[index].y;
            index++;
        }

        index = 0;
        for (var i : Label in control.itemTile)
        {
            i.tile = TextureMgr.instance().ItemSpt().GetTile(null);
            item = KBN.HeroManager.Instance.GetHeroExploreItem(index);
            i.tile.name = TextureMgr.instance().LoadTileNameOfItem(item != null ? item.Type : 1001);
            i.rect.x = argument.itemStart[index].x;
            i.rect.y = argument.itemStart[index].y + 5; // 5 pixel from frame
            index++;
        }
        
        index = 0;
        for (var i : Label in control.boxIcon)
        {
            i.tile = TextureMgr.instance().ItemSpt().GetTile(null);
            item = KBN.HeroManager.Instance.GetHeroExploreItem(index);
            i.tile.name = TextureMgr.instance().LoadTileNameOfItem(item != null ? item.Type : 1001);
            index++;
        }

        PlayItemAnimation(null);
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

    private function PlayItemAnimation(userData : Object) : void
    {
        main.Animation.AddMoveAnimation(control.itemFrame[0], 0.2f, NextStatus, null, argument.itemStart[0], argument.itemNext[0]);
        for (var i : int = 1; i < control.itemFrame.length; i++)
        {
            main.Animation.AddMoveAnimation(control.itemFrame[i], 0.2f, null, null, argument.itemStart[i], argument.itemNext[i]);
        }
    }

    private function NextStatus(userData : Object) : void
    {
        main.ChangeStatus(HeroExploreStatusType.ShowNext);
    }
}
