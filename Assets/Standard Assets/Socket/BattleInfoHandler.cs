using System;
using KBN;
public class BattleInfoHandler : IPacketHandler
{
	enum BATTLE_TYPE
	{
		BATTLE_TYPE_WORLD_MAP	= 0,
		BATTLE_TYPE_PVE			= 1,
		BATTLE_TYPE_AVA			= 2,
		BATTLE_TYPE_RALLY       = 3,  // 集结相关信息更新时PBMsgBattleInfo中type＝3、msg＝PBMsgRallySocket的二进制流
		BATTLE_TYPE_BOSS        = 4,  // boss相关信息更新时PBMsgBattleInfo中type＝4、msg＝PBMsgWorldBossSocket的二进制流
		BATTLE_TYPE_MARCH       = 5,  // 集结和世界boss涉及到的march信息更新时PBMsgBattleInfo中type＝5、msg＝PBMsgMarchInfo的二进制流
		BATTLE_TYPE_MAP       = 6,  // 刷新map
		MSG_TYPE_RESOURCE_TILE = 7,
	};
    public int Opcode
    {
        get
        {
			return (int)PBOpcode.battleInfo;
        }
    }

    public void Handle(byte[] bytes)
    {
		battleInfo.battleInfo packet = NewSocketNet.GetPacket<battleInfo.battleInfo>(bytes);
		switch((BATTLE_TYPE)packet.type)
		{
		case BATTLE_TYPE.BATTLE_TYPE_WORLD_MAP:
			KBN.TournamentManager.getInstance().receiveTournamentSocketPacket( packet.msg );
			break;
		case BATTLE_TYPE.BATTLE_TYPE_PVE:
			KBN.AllianceBossController.instance().OkMsgAllianceBossSocket(packet.msg);
			break;
		case BATTLE_TYPE.BATTLE_TYPE_AVA:
			KBN.GameMain.Ava.ReceiveSocketMsg(packet.msg);
			break;
		case BATTLE_TYPE.BATTLE_TYPE_RALLY:
			KBN.RallyController.instance().OnRallySocketMsgReceive(packet.msg);
			break;
		case BATTLE_TYPE.BATTLE_TYPE_BOSS:
			KBN.WorldBossController.singleton.OnBossSocketMsgReceive(packet.msg);
			break;
		case BATTLE_TYPE.BATTLE_TYPE_MARCH:
			MrachHandle(packet.msg);
			break;
		case BATTLE_TYPE.BATTLE_TYPE_MAP:   //刷新地块
			updateMap(packet.msg);
			break;
		case BATTLE_TYPE.MSG_TYPE_RESOURCE_TILE:   //采集
		// _Global.LogWarning("MSG_TYPE_RESOURCE_TILE !!!!!");
			ResourceTileHandle(packet.msg);
			break;
		default:
			_Global.Log("Packet battleInfo use an invalid type!");
			break;
		}
    }

	private void ResourceTileHandle(byte[] result)
	{
		if (result == null)
		{
			_Global.LogWarning("ResourceTileHandle recive a empty packet!");
			return;
		}

		if(result.Length == 0)
		{
			_Global.LogError("BattleInfoHandler.ResourceTileHandle  result.Length == 0 !!!!");
		}

		PBMsgResourceTileInfo.PBMsgResourceTileInfo resourceTile =  _Global.DeserializePBMsgFromBytes<PBMsgResourceTileInfo.PBMsgResourceTileInfo>(result);
		if(resourceTile == null)
		{
			_Global.LogError("BattleInfoHandler.ResourceTileHandle  resourceTile == null !!!!");
		}

		if(GameMain.singleton.getMapController() != null)
		{
			GameMain.singleton.getMapController().GetOneResourceTileInfo(resourceTile);
		}		
	}

    private void MrachHandle(byte[] result){
    	if (result == null)
		{
			_Global.LogWarning("march recive a empty packet!");
			return;
		}

		PBMsgMarchInfo.PBMsgMarchInfo march = _Global.DeserializePBMsgFromBytes<PBMsgMarchInfo.PBMsgMarchInfo>(result);
		if(march!=null){
			if(IsMyMarch(march.fromPlayerId)){
				//自己的march
				// if(march.marchStatus==8||march.marchStatus==0){
					// UpdateSeed.singleton.update_seed_ajax_Force();
				if(march.marchType == Constant.MarchType.RALLY_ATTACK || march.marchType == Constant.MarchType.JION_RALLY_ATTACK)
				{
					// _Global.LogWarning("PBMsgMarchInfo : " + " marchId : " + march.marchId + " fromPlayerId : " + march.fromPlayerId + "fromX : " + march.fromX + 
					//                       " fromY : " + march.fromY + " toX : " + march.toX + " toY : " + march.toY + " marchtype : " + march.marchType + " marchstatus : " + 
					//                              march.marchStatus + " startTime : " + march.startTimeStamp + " endTime : " + march.endTimeStamp + " isWin " + march.isWin);
					KBN.RallyController.instance().changeRallyMarchItem(march);
				}
				// }
			}else{
				// _Global.LogWarning("PBMsgMarchInfo  others : " + " marchId : " + march.marchId + " fromPlayerId : " + march.fromPlayerId + "fromX : " + march.fromX + 
				//                              " fromY : " + march.fromY + " toX : " + march.toX + " toY : " + march.toY + " marchtype : " + march.marchType + " marchstatus : " + 
				//                              march.marchStatus + " startTime : " + march.startTimeStamp + " endTime : " + march.endTimeStamp + " isWin " + march.isWin);
				//别人的march，包含boss和rally
				if((march.marchType == Constant.MarchType.RALLY_ATTACK || march.marchType == Constant.MarchType.JION_RALLY_ATTACK) 
				   && march.marchStatus == Constant.MarchStatus.OUTBOUND)
				{
					return;
				}
				KBN.RallyBossMarchController.instance().OnMarchReceive(march);
			}
		}

    }

    private bool IsMyMarch(int fromPlayerId)
	{
		if(GameMain.singleton != null)
		{
			return fromPlayerId == GameMain.singleton.getUserId();
		}
    	
		return false;
    }

    private void updateMap(byte[] result){
    	if (result == null)
		{
			_Global.LogWarning("march recive a empty packet!");
			return;
		}

		PBMsgMapChange.PBMsgMapChange map=_Global.DeserializePBMsgFromBytes<PBMsgMapChange.PBMsgMapChange>(result);
    	if(map!=null&&
    		GameMain.singleton.getMapController()!=null&&GameMain.singleton.getMapController().IsInView(map.xCoord,map.yCoord)){
			// _Global.LogWarning("xCoord : " + map.xCoord + " yCoord : " + map.yCoord+" status:"+map.status);
			// GameMain.singleton.getMapController().updateWorldMap(map.xCoord,map.yCoord,map.status);
			HashObject slotInfo = MapMemCache.instance().getTileInfoData(map.xCoord, map.yCoord);
			if(slotInfo!=null){
				MapMemCache.instance().setTileInfoData(map.xCoord, map.yCoord,GameMain.singleton.GetTileInfoFromSocket(map));
				if(map.status==1){
					MapMemCache.instance().updateAdditionInfo(
					GameMain.singleton.GetTileAllianceNamesInfoFromSocket(map), 
					GameMain.singleton.GetTileAllianceMightInfoFromSocket(map),
					GameMain.singleton.GetTileAllianceLeagueInfoFromSocket(map),
					GameMain.singleton.GetTileUserInfoFromSocket(map),
                    null,//rslt["tournament"],
                    null//rslt["march"] 
                    );
				}
				GameMain.singleton.getMapController().setTexturePublic(map.xCoord,map.yCoord);
			}
		}
    }










}