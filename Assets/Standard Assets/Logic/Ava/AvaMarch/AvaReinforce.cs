using KBN;
using UnityEngine;
using System.Collections;

public class AvaReinforce : AvaBaseMarch 
{
	private PBMsgAVASeed.PBMsgAVASeed m_Seed;



	public AvaReinforce(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
		:base(marchData)
	{
	}


	public void RequestSeed()
	{
		PBMsgAVASeed.PBMsgAVASeed request = new PBMsgAVASeed.PBMsgAVASeed ();
		//cmd scmd
		
		UnityNet.RequestForGPB("ava.php", request, OnGetAvaSeedOk, OnGetAvaSeedError,true);
	}

	private void OnGetAvaSeedOk(byte[] data)
	{
		m_Seed = _Global.DeserializePBMsgFromBytes<PBMsgAVASeed.PBMsgAVASeed> (data);
	}

	private void OnGetAvaSeedError(string errorMessage, string errorCode)
	{
		
	}

	public override string GetStatusString(bool withCoords)
	{
		string ret = "";
		string tileName = Datas.getArString(AvaUtility.GetTileNameKey(MarchData.toTileType));
		switch(Status)
		{
		case Constant.AvaMarchStatus.OUTBOUND:
            ret  = withCoords ? Datas.GetFormattedString("AvaMarch.Reinfoce",tileName,(int)TargetCoord.x, (int)TargetCoord.y) : Datas.getArString("Common.Marching");
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
		return Datas.getArString("Common.Reinforce");
	}
}
