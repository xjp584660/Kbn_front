#pragma strict

import System;

@Serializable
public class ScoutMenuStrategy_Normal extends ScoutMenuStrategy_Base
{
    public function CanScoutInstantly() : boolean
    {
        return true;
    }
    
    public function StartScout(targetX : int, targetY : int, instant : boolean, okFunc : System.Action.<boolean>) : void
    {
        Scout.instance().scout(targetX.ToString(), targetY.ToString(), instant, okFunc);
        return;
    }
    
    public function CalcScoutTime(targetX : int, targetY : int) : long
    {
        return Scout.instance().getScoutTime(targetX, targetY);
    }
    
    public function CalcInstantScoutGems(targetX : int, targetY : int) : int
    {
        return Scout.instance().getScoutInstantlyGems(targetX, targetY);
    }
}
