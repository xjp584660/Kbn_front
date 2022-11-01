using KBN;
using UnityEngine;
using System.Collections;

public class AvaRallyAttack : AvaBaseMarch 
{
	private const float MAX_COMBATANIMATIONTIME = 3.0f;
	private float m_CombatAnimationLeftTime;

	public AvaRallyAttack(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
		:base(marchData)
	{
	}

	public override void Update()
	{
		if(Constant.AvaMarchStatus.RALLYING == Status && LeftTime <= 0)
		{
			RequestUpdateMarch();
		}
		else if(Constant.AvaMarchStatus.OUTBOUND == Status && LeftTime <= 0)
		{
			m_CombatAnimationLeftTime = MAX_COMBATANIMATIONTIME;
			Status = Constant.AvaMarchStatus.WAITING_FOR_REPORT;
		}
		else if(Constant.AvaMarchStatus.WAITING_FOR_REPORT == Status)
		{
			m_CombatAnimationLeftTime --;
			if(m_CombatAnimationLeftTime <= 0)
			{
				m_CombatAnimationLeftTime = 0;
				RequestUpdateMarch();
			}
		}
		else if(Constant.AvaMarchStatus.RETURNING == Status && LeftTime <= 0)
		{
			Status = Constant.AvaMarchStatus.DELETED;
			GameMain.Ava.Units.RequestAvaUnits ();
		}
	}

    public long TroopCount
    {
        get
        {
            var rallyData = this.m_MarchInfo.rallyAttackInfo;
            var players = rallyData.rallyPlayerList;

            long ret = 0;
            for (int i = 0; i < players.Count; ++i)
            {
                ret += CalcPlayerTroopCount(players[i]);
            }

            return ret;
        }
    }

	public bool HasJoin()
	{
		int myUserId = GameMain.Ava.Seed.UserId;
		if(MarchData.fromPlayerId == myUserId)
		{
			return true;
		}
		if(MarchData.rallyAttackInfo != null)
		{
			for(int i=0; i<MarchData.rallyAttackInfo.rallyPlayerList.Count;i++)
			{
				if(myUserId == MarchData.rallyAttackInfo.rallyPlayerList[i].playerId && GameMain.unixtime() >= MarchData.rallyAttackInfo.rallyPlayerList[i].arrivalTime)
				{
					return true;
				}
			}
		}
		return false;
	}

    public static long CalcPlayerTroopCount(PBMsgAVAMarchList.PBMsgAVAMarchList.RallyPlayerInfo player)
    {
        if (player == null)
        {
            return 0;
        }

        var units = player.unitlist;
        long ret = 0;
        for (int i = 0; i < units.Count; ++i)
        {
            ret += (long)(units[i].count);
        }

        return ret;
    }

	public override string GetStatusString(bool withCoords)
	{
		string ret = "";
		string tileName = Datas.getArString(AvaUtility.GetTileNameKey(MarchData.toTileType));
		switch(Status)
		{
		case Constant.AvaMarchStatus.RALLYING:
			ret = Datas.getArString("AVA.rallying");
			break;
		case Constant.AvaMarchStatus.WAITING_FOR_REPORT:
			ret  = withCoords ? Datas.GetFormattedString("AvaMarch.WaitingForReport",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("March.WaitForReport");
			break;
		case Constant.AvaMarchStatus.OUTBOUND:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.RallyAttack",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("AVA.RallyAttack");
			break;
		case Constant.AvaMarchStatus.RETURNING:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.Returning",tileName) : Datas.getArString("Common.Returning");
			break;
		case Constant.AvaMarchStatus.DEFENDING:
			ret = withCoords ? 
				Datas.GetFormattedString("AvaMarch.EncampStatus",tileName,(int)TargetCoord.x, (int)TargetCoord.y, GetReturnUnitCount())
					:Datas.getArString("Common.Defending");
			break;
		}
		
		return ret;
	}

	public override string GetTypeString ()
	{
		return Datas.getArString("AVA.RallyAttack");
	}
}
