using KBN;
using UnityEngine;
using System.Collections;

public class AvaRallyReinforce : AvaBaseMarch 
{
	public AvaRallyReinforce(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
		:base(marchData)
	{
	}

	public override void Update()
	{
		if(Constant.AvaMarchStatus.OUTBOUND == Status && LeftTime <= 0)
		{
			Status = Constant.AvaMarchStatus.DELETED;
			GameMain.Ava.March.RequestMarchList();
		}
		if(Constant.AvaMarchStatus.RETURNING == Status && LeftTime <= 0)
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
			ret  = Datas.getArString("AVA.rallyreinforcing");
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
		return Datas.getArString("AVA.RallyReinforce");
	}

}
