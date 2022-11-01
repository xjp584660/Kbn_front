public class HeroExploreStatusFlag extends HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;
    private var argument : HeroExplore.HeroExploreArgument = null;
    private var exploreAnimation : HeroExplore.HeroExploreAnimation[] = null;
    private var itemAnimation : HeroExplore.HeroExploreAnimation[] = null;
    private var tempIndex : int = 0; // for test

    public function HeroExploreStatusFlag(main : HeroExplore, control : HeroExplore.HeroExploreControl, argument : HeroExplore.HeroExploreArgument, exploreAnimation : HeroExplore.HeroExploreAnimation[], itemAnimation : HeroExplore.HeroExploreAnimation[])
    {
        this.main = main;
        this.control = control;
        this.argument = argument;
        this.exploreAnimation = exploreAnimation;
        this.itemAnimation = itemAnimation;
    }

    public function GetStatusType() : HeroExploreStatusType
    {
        return HeroExploreStatusType.Flag;
    }

    public function Init() : void
    {

    }

    public function Enter() : void
    {
        control.number.txt = String.Format("x {0}", KBN.HeroManager.Instance.GetCurrentExploreStrength());
        control.explore[main.CurrentExploreIndex].SetDisabled(true);
        control.box[main.CurrentExploreIndex].SetVisible(true);
        if (main.CurrentExploreItemIndex < 0)
        {
        	control.boxIcon[tempIndex].rect.x = argument.explorePos[main.CurrentExploreIndex].x + argument.boxPosOffset.x;
        	control.boxIcon[tempIndex].rect.y = argument.explorePos[main.CurrentExploreIndex].y + argument.boxPosOffset.y;
        	control.boxIcon[tempIndex].SetVisible(true);
        }
        else
        {
        	control.boxIcon[main.CurrentExploreItemIndex].rect.x = argument.explorePos[main.CurrentExploreIndex].x + argument.boxPosOffset.x;
        	control.boxIcon[main.CurrentExploreItemIndex].rect.y = argument.explorePos[main.CurrentExploreIndex].y + argument.boxPosOffset.y;
        	control.boxIcon[main.CurrentExploreItemIndex].SetVisible(true);
        }
        exploreAnimation[main.CurrentExploreIndex].animActive = false;

        FlyToCenter(null);
    }

    public function Update() : void
	{
	    for (var i : HeroExplore.HeroExploreAnimation in itemAnimation)
        {
            i.Update();
        }
        
        control.effectRotate.updateEffect();
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
        for (var i : Label in control.itemEffect)
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
        control.effectRotate.drawItems();
        for (var i : Label in control.boxIcon)
        {
        	i.Draw();
        }
	}
	
	private function FlyToCenter(userData : Object) : void
	{
        if (main.CurrentExploreItemIndex < 0)
        {
        	main.Animation.AddAlphaAnimation(control.boxIcon[tempIndex], 0.2f, null, null, 0.5f, 1.0f);
	        main.Animation.AddMoveAnimation(control.boxIcon[tempIndex], 0.2f, LightStay, null,
	            argument.explorePos[main.CurrentExploreIndex] + argument.boxPosOffset, argument.itemCenter);
        }
        else
        {
        	main.Animation.AddAlphaAnimation(control.boxIcon[main.CurrentExploreItemIndex], 0.2f, null, null, 0.5f, 1.0f);
	        main.Animation.AddMoveAnimation(control.boxIcon[main.CurrentExploreItemIndex], 0.2f, LightStay, null,
	            argument.explorePos[main.CurrentExploreIndex] + argument.boxPosOffset, argument.itemCenter);
        }
        
        SoundMgr.instance().PlayEffect("kbn_hero_chestopen", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
	}
	
	private function LightStay(userData : Object) : void
	{
		control.lightBackground.SetVisible(true);
		if (main.CurrentExploreItemIndex < 0)
        {
        	main.Animation.AddDelayAnimation(control.boxIcon[tempIndex], 1.0f, FlyToItem, null);
        }
        else
        {
			main.Animation.AddDelayAnimation(control.boxIcon[main.CurrentExploreItemIndex], 1.0f, FlyToItem, null);
		}
	}
	
	private function FlyToItem(userData : Object) : void
	{
		control.lightBackground.SetVisible(false);
        
        if (main.CurrentExploreItemIndex < 0)
        {
        	main.Animation.AddAlphaAnimation(control.boxIcon[tempIndex], 0.3f, null, null, 1.0f, 0.0f);
	        main.Animation.AddMoveAnimation(control.boxIcon[tempIndex], 0.3f, null, null,
	            argument.itemCenter,
	            argument.itemEnd[tempIndex]);
            main.Animation.AddAlphaAnimation(control.itemAlpha[tempIndex], 0.3f, PlayEffect, null, 1.0f, 0.0f);
        }
        else
        {
        	main.Animation.AddAlphaAnimation(control.boxIcon[main.CurrentExploreItemIndex], 0.3f, null, null, 1.0f, 0.0f);
	        main.Animation.AddMoveAnimation(control.boxIcon[main.CurrentExploreItemIndex], 0.3f, null, null,
	            argument.itemCenter,
	            argument.itemEnd[main.CurrentExploreItemIndex]);
            main.Animation.AddAlphaAnimation(control.itemAlpha[main.CurrentExploreItemIndex], 0.3f, PlayEffect, null, 1.0f, 0.0f);
        }
        
        SoundMgr.instance().PlayEffect("kbn_hero_proplight", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
	}

    private function PlayEffect(userData : Object) : void
    {
        if (main.CurrentExploreItemIndex < 0)
        {
            itemAnimation[tempIndex].animActive = true;
            tempIndex++;
        }
        else
        {
            itemAnimation[main.CurrentExploreItemIndex].animActive = true;
        }
        
        main.Animation.AddDelayAnimation(null, 0.5f, NextStatus, null);
    }

    private function NextStatus(userData : Object) : void
    {
        main.ChangeStatus(HeroExploreStatusType.Normal);
    }
}
