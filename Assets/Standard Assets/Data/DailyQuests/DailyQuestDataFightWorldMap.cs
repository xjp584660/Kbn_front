using UnityEngine;
using System.Collections;

using _Global = KBN._Global;

public abstract class DailyQuestDataFightWorldMap : DailyQuestDataAbstract
{
    protected enum ResultRequest
    {
        Lose = 0,
        Win = 1,
    }

    protected ResultRequest resultRequest;

    protected override void ParseParams(int[] paramArray)
    {
        resultRequest = (ResultRequest) paramArray[0];
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.WORLD, null);
    }

    public override void CheckProgress(object progressData)
    {
        var progressDict = progressData as Hashtable;

        if (progressDict == null)
        {
            return;
        }

        int wins = (int) progressDict["wins"];
        int losses = (int) progressDict["losses"];

        int delta;

        switch (resultRequest)
        {
        case ResultRequest.Lose:
            delta = losses;
            break;
        case ResultRequest.Win:
            delta = wins;
            break;
        default:
            delta = losses + wins;
            break;
        }

        IncreaseDoneCount(delta);
    }
}
