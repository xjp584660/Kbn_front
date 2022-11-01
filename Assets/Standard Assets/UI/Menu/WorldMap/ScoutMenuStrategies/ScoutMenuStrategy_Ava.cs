using UnityEngine;
using System.Collections;
using System;

using GameMain = KBN.GameMain;

[Serializable]
public class ScoutMenuStrategy_Ava : ScoutMenuStrategy_Base
{
    private const int ScoutingConstSpeed = 6000;
    private const int ScoutingBaseSpeed = 2000; 
    private const long ScoutingMinTime = 30;

    public override bool CanScoutInstantly()
    {
        return false;
    }
    
    public override void StartScout(int targetX, int targetY, bool instant, Action<bool> okFunc)
    {
        var marchInfo = new PBMsgReqAVA.PBMsgReqAVA.ReqMarchInfo();
        marchInfo.marchType = Constant.AvaMarchType.SCOUT;
        marchInfo.toXCoord = targetX;
        marchInfo.toYCoord = targetY;
		marchInfo.fromXCoord = GameMain.Ava.Seed.MyOutPostTileX;
		marchInfo.fromYCoord = GameMain.Ava.Seed.MyOutPostTileY;
        GameMain.Ava.March.RequestMarch(marchInfo);
    }
    
    public override long CalcScoutTime(int targetX, int targetY)
    {
        var myX = GameMain.Ava.Seed.MyOutPostTileX;
        var myY = GameMain.Ava.Seed.MyOutPostTileY;

        float diffX = targetX - myX;
        float diffY = targetY - myY;
        float dist = Mathf.Sqrt(diffX * diffX + diffY * diffY);

        long secondsNeeded = (long)(Mathf.CeilToInt(dist * ScoutingConstSpeed / ScoutingBaseSpeed));
        if (secondsNeeded < ScoutingMinTime)
        {
            secondsNeeded = ScoutingMinTime;
        }

        return secondsNeeded;
    }
    
    public override int CalcInstantScoutGems(int targetX, int targetY)
    {
        // Won't be used, but shouldn't throw an exception due to the way UI calls this.
        return 0;
    }
}
