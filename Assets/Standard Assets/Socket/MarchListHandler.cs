using System;
using KBN;

public class MarchListHandler : IPacketHandler 
{
	public int Opcode
	{
		get
		{
			return (int)PBOpcode.marchList;
		}
	}

	public void Handle(byte[] bytes)
	{
		PBMsgMarchList.PBMsgMarchList marchList = _Global.DeserializePBMsgFromBytes<PBMsgMarchList.PBMsgMarchList>(bytes);
		for(int i = 0; i < marchList.marchList.Count; ++i)
		{
			PBMsgMarchInfo.PBMsgMarchInfo march = _Global.DeserializePBMsgFromBytes<PBMsgMarchInfo.PBMsgMarchInfo>(marchList.marchList[i]);
			if(march!=null)
			{
				if(!IsMyMarch(march.fromPlayerId))
				{
					_Global.LogWarning("CarmotMarch : " + " marchId : " + march.marchId + " fromPlayerId : " + march.fromPlayerId + "fromX : " + march.fromX + 
												" fromY : " + march.fromY + " toX : " + march.toX + " toY : " + march.toY + " marchtype : " + march.marchType + " marchstatus : " + 
												march.marchStatus + " startTime : " + march.startTimeStamp + " endTime : " + march.endTimeStamp + " isWin " + march.isWin);

					KBN.RallyBossMarchController.instance().OnMarchReceive(march);
				}
			}
		}
		// _Global.LogWarning("Receive MarchListHandler");
	}

    private bool IsMyMarch(int fromPlayerId){
    	return fromPlayerId==GameMain.singleton.getUserId();
    }
}
