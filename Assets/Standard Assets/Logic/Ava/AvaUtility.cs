using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public static class AvaUtility
{
    private class TileBasicInfo
    {
        public string NameKey { get; private set; }
        public string DescKey { get; private set; }

        public TileBasicInfo(string nameKey, string descKey)
        {
            NameKey = nameKey;
            DescKey = descKey;
        }
    }

    private static Dictionary<int, TileBasicInfo> tiles = new Dictionary<int, TileBasicInfo>();

    private static void RegisterTileBasicInfo(int tileTypeId, string nameKey, string descKey)
    {
        tiles.Add(tileTypeId, new TileBasicInfo(nameKey, descKey));
    }

    static AvaUtility()
    {
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_PLAYER, "Common.PlayerTile", "MapView.PlayerTileDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_WONDER, "Common.Wonder", "MapView.WonderDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER, "Common.SuperWonder", "MapView.SuperWonderDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_ATTACK, "Common.Attackbufftiles", "MapView.AttackbufftilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_LIFE, "Common.Lifebufftiles", "MapView.LifebufftilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SPEED, "Common.Marchspeedtiles", "MapView.MarchspeedtilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_PLAIN, "Common.Plain", "MapView.PlainDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_BOG, "Common.Desert", "MapView.desertDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_BOG2, "Common.Desert", "MapView.desertDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_BOG3, "Common.Desert", "MapView.desertDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_BOG4, "Common.Desert", "MapView.desertDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_BOG5, "Common.Desert", "MapView.desertDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_ITEM, "Common.Itemtiles", "MapView.ItemtilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_MERCENERY, "Common.MercenaryTiles", "MapView.MercenaryTilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1, "Common.SuperWonder", "MapView.SuperWonderDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER2, "Common.SuperWonder", "MapView.SuperWonderDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER3, "Common.SuperWonder", "MapView.SuperWonderDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4, "Common.SuperWonder", "MapView.SuperWonderDesc");
		RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_ATTACK_REDUCE, "Common.FoeAttackbufftiles", "MapView.FoeAttackbufftilesDesc");
        RegisterTileBasicInfo(Constant.TileType.TILE_TYPE_AVA_LIFE_REDUCE, "Common.FoeLifebufftiles", "MapView.FoeLifebufftilesDesc");
    }

    public static string GetTileNameKey(int tileTypeId)
    {
        TileBasicInfo info;
        if (!tiles.TryGetValue(tileTypeId, out info))
        {
            return "Unknown Tile Type";
        }

        return info.NameKey;
    }

	public static string GetDefaultTileNameKey(int marchType, int tileTypeId, string pveName, int tileLevel, int tileKind)
	{
		string tileName = string.Empty;
		switch (marchType)
		{
			case Constant.MarchType.TRANSPORT:
				tileName = Datas.getArString("Common.Transported");
				break;
			case Constant.MarchType.EMAIL_WORLDBOSS:
				tileName = Datas.getArString("WorldBoss.BossUnit_Text1");
				break;
			case Constant.MarchType.ATTACK:              
			case Constant.MarchType.PVP:
			case Constant.MarchType.RALLY_ATTACK:
			case Constant.MarchType.JION_RALLY_ATTACK:
				tileName = ParseTileType(tileTypeId, tileLevel, tileKind);
				break;
			case Constant.MarchType.SCOUT:
				tileName = Datas.getArString("Common.Scouted");				
				break;
			case Constant.MarchType.REASSIGN:
				tileName = Datas.getArString("ModalMessagesViewReports.ReassignFrom");
				break;  
			case Constant.MarchType.PVE:
			case Constant.MarchType.ALLIANCEBOSS:
				tileName = Datas.getArString(pveName);
				break;
				
			default:
				break; 
		}

		return tileName;
	}

	public static string ParseTileType(int type, int tileLevel, int tileKind)
	{
		string tileName = "";
		switch(type)
		{
		case Constant.TileType.BOG:
			tileName = Datas.getArString("Common.Bog");
			break;
			
		case Constant.TileType.GRASSLAND:
			tileName = Datas.getArString("Common.Grassland");
			break;
			
		case Constant.TileType.LAKE:
			tileName = Datas.getArString("Common.Lake");
			break;
			
		case Constant.TileType.WOODS:
			tileName = Datas.getArString("Common.Woods");
			break;
			
		case Constant.TileType.HILLS:
			tileName = Datas.getArString("Common.Hills");
			break;
			
		case Constant.TileType.MOUNTAIN:
			tileName = Datas.getArString("Common.Mountain");
			break;
			
		case Constant.TileType.PLAIN:
			tileName = Datas.getArString("Common.Plain");
			break;
		case Constant.TileType.CITY://51
			if(tileLevel > 10)
			{
				tileName = Datas.getArString("Common.BarbarianCamp2");
			}
			else
			{
				tileName = Datas.getArString("Common.BarbarianCamp");
			}
			break;
		case Constant.TileType.WORLDMAP_1X1_ACT:
			tileName = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
			break;
		case Constant.TileType.WORLDMAP_1X1_DUMMY: 
		case Constant.TileType.WORLDMAP_2X2_LT_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_RT_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_LB_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_RB_DUMMY:
			tileName = Datas.getArString("Common.Bog");
			break;
		case Constant.TileType.WORLDMAP_2X2_LT_ACT:
		case Constant.TileType.WORLDMAP_2X2_RT_ACT:
		case Constant.TileType.WORLDMAP_2X2_LB_ACT:
		case Constant.TileType.WORLDMAP_2X2_RB_ACT:
			tileName = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
			break;
		}
		
		return tileName;
	}
	
	public static string GetTileDescKey(int tileTypeId)
	{
		TileBasicInfo info;
		if (!tiles.TryGetValue(tileTypeId, out info))
		{
			return "Unknown Tile Type";
		}

		if(tileTypeId == (int)Constant.TileType.TILE_TYPE_AVA_ATTACK || tileTypeId == (int)Constant.TileType.TILE_TYPE_AVA_LIFE
		   || tileTypeId == (int)Constant.TileType.TILE_TYPE_AVA_SPEED || tileTypeId == (int)Constant.TileType.TILE_TYPE_AVA_ATTACK_REDUCE
		   || tileTypeId == (int)Constant.TileType.TILE_TYPE_AVA_LIFE_REDUCE)
		{
			string value = _Global.GetString(5 + GameMain.Ava.Alliance.GetSkill24BuffValue() * 100);
			return string.Format(Datas.getArString(info.DescKey), value);
		}
		return info.DescKey;
	}
}
