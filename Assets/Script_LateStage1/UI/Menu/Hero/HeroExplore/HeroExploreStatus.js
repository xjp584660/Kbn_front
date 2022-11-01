import System;
public enum HeroExploreStatusType
{
    Load,
    Teach,
    Ready,
    Help,
    Play,
    Timeout,
    Wait,
    ShowFirst,
    ShowNext,
    ShowLast,
    Normal,
    Flag,
    Auto
};

public class HeroExploreStatus
{
    private var main : HeroExplore = null;
    private var control : HeroExplore.HeroExploreControl = null;

    public function GetStatusType() : HeroExploreStatusType
    {
        throw new NotSupportedException();
    }

    public function Init() : void
    {
        throw new NotSupportedException();
    }

    public function Enter() : void
    {
        throw new NotSupportedException();
    }

    public function Update() : void
	{
	    throw new NotSupportedException();
    }

    public function Leave() : void
    {
        throw new NotSupportedException();
    }

    public function Draw() : void
	{
	    throw new NotSupportedException();
	}
}
