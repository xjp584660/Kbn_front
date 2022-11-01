using UnityEngine;
using System.Collections;

public class SharedTileInfoData
{
    public int flagid;
    public string s_cityName;
    public int level;
    public int intergration;
    public int coordinateX;
    public int coordinateY;
    public string s_occupantName;
    public string s_allinaceName;
    public long might;
    public int btn_type;
    public bool isTb_Selected = false;
    public int tileid;
    public int tileKind;
    public static bool isHasAllianceMemberTile = false;
    
    public SharedTileInfoData()
    {
        // Empty
    }
}
