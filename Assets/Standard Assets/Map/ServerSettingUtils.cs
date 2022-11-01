using UnityEngine;
using System.Collections;
using KBN;

/// <summary>
/// Server setting utils. Functions to retrieve data from seed["serverSetting"];
/// </summary>
public static class ServerSettingUtils
{
    private static HashObject ServerSettingNode
    {
        get
        {
            return GameMain.singleton.getSeed()["serverSetting"];
        }
    }

    public static int GetItemToDefendId()
    {
        if (ServerSettingNode == null)
        {
            return -1;
        }
        
        var toDefendNode = ServerSettingNode["items2Defend"];
        if (toDefendNode == null)
        {
            return -1;
        }
        
        string[] items = _Global.GetString(toDefendNode).Split(',');
        if (items.Length <= 0)
        {
            return -1;
        }
        
        var itemId = _Global.INT32(items[0]);
        if (MyItems.singleton.countForItem(itemId) <= 0)
        {
            return -1;
        }
        
        return itemId;
    }
}
