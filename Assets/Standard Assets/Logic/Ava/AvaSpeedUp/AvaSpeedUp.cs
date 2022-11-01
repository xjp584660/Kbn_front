using KBN;
using System.Collections.Generic;
public partial class AvaSpeedUp : AvaModule
{
	public class AvaSpeedUpData
	{
		public int id;
		public int type;
		public int startTime;
		public int endTime;
		public int origTotalTime;
	}

	public AvaSpeedUp(AvaManager avaEntry)
		: base(avaEntry)
	{

	}

	public void RequestSpeedUp(PBMsgReqAVA.PBMsgReqAVA.SpeedUp reqSpeedUp)
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 9;
		request.subcmd = 1;
		request.speedUpData = reqSpeedUp;
		UnityNet.RequestForGPB("ava.php", request, OnSpeedUpOk, null);
	}

	private void OnSpeedUpOk(byte[] data)
	{
		if(data == null)
		{
			return;
		}
		PBMsgAvaSpeedUp.PBMsgAvaSpeedUp response = _Global.DeserializePBMsgFromBytes<PBMsgAvaSpeedUp.PBMsgAvaSpeedUp> (data);
		MyItems.singleton.subtractItem (response.itemId, response.itemCount);
		AvaSpeedUpData speedUpData = new AvaSpeedUpData ();

		if(Constant.AvaSpeedUpType.AvaMarchSpeedUp == response.type)
		{
			AvaBaseMarch march = AvaEntry.March.GetMarchById(response.marchInfo.marchId);
			if(march != null)
			{
				march.EndTime = response.marchInfo.endTime;
				speedUpData.id = march.MarchData.marchId;
				speedUpData.type = Constant.AvaSpeedUpType.AvaMarchSpeedUp;
				speedUpData.startTime = march.StartTime;
				speedUpData.endTime = march.EndTime;
				speedUpData.origTotalTime = march.OrigTotalTime;
			}

		}
		else if(Constant.AvaSpeedUpType.AvaHeroSpeedUp == response.type)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = AvaEntry.Units.GetRowHeroById(response.heroInfo.userHeroId);
			if(hero != null)
			{
				hero.sleepEndTime = response.heroInfo.sleepEndTime;
				speedUpData.id = hero.userHeroId;
				speedUpData.type = Constant.AvaSpeedUpType.AvaHeroSpeedUp;
				speedUpData.startTime = hero.sleepStartTime;
				speedUpData.endTime = hero.sleepEndTime;
				speedUpData.origTotalTime =  hero.sleepTotal;
				AvaEntry.Units.InitHeroInfoList();
			}
		}
		MenuMgr.instance.SendNotification (Constant.Notice.AvaUseSpeedUpItemOk,speedUpData);
	}
}
