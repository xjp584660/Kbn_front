using KBN;
using UnityEngine;
using System.Collections;

public class AvaAttack : AvaBaseMarch 
{
	private const float MAX_COMBATANIMATIONTIME = 2.0f;
	private float m_CombatAnimationLeftTime;
	public AvaAttack(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
		:base(marchData)
	{
	}

	public override void Update()
	{
		if(Constant.AvaMarchStatus.OUTBOUND == Status && LeftTime <= 0)
		{
			Status = Constant.AvaMarchStatus.WAITING_FOR_REPORT;
			m_CombatAnimationLeftTime = MAX_COMBATANIMATIONTIME;

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

	public override string GetStatusString(bool withCoords)
	{
		string ret = "";
		string tileName = Datas.getArString(AvaUtility.GetTileNameKey(MarchData.toTileType));
		switch(Status)
		{
		case Constant.AvaMarchStatus.OUTBOUND:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.Marching",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("Common.Marching");
			break;
		case Constant.AvaMarchStatus.WAITING_FOR_REPORT:
			ret  = withCoords ? Datas.GetFormattedString("AvaMarch.WaitingForReport",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("March.WaitForReport");
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
		return Datas.getArString("Common.Attack");
	}

}
