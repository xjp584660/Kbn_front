using KBN;
using UnityEngine;
using System.Collections;

public class AvaScout : AvaBaseMarch 
{
	public AvaScout(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
		:base(marchData)
	{
	}

	public override void Update()
	{
		if(Constant.AvaMarchStatus.OUTBOUND == Status && LeftTime <= 0)
		{
			Status = Constant.AvaMarchStatus.DELETED;
		}
	}

	public override string GetStatusString(bool withCoords)
	{
		string ret = "";
		string tileName = Datas.getArString(AvaUtility.GetTileNameKey(MarchData.toTileType));
		switch(Status)
		{
		case Constant.AvaMarchStatus.OUTBOUND:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.Scouting",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("Common.Scouting");
			break;
		case Constant.AvaMarchStatus.RETURNING:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.Returning",tileName) : Datas.getArString("Common.Returning");
			break;
		}
		
		return ret;
	}

	public override string GetTypeString ()
	{
		return Datas.getArString("Common.Scout");
	}
}
