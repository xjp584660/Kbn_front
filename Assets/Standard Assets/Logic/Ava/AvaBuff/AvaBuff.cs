using KBN;
using UnityEngine;
using System.Collections;

public class AvaBuff : AvaModule 
{
	public delegate void OnBuffDataOk();
	private OnBuffDataOk onBuffDataOk;

	public AvaBuff(AvaManager avaEntry)
		: base(avaEntry)
	{
	}


	public void RequestBuffList()
	{

		RequestBuffList (null);
	}

	public void RequestBuffList(OnBuffDataOk _onBuffDataOk)
	{
		onBuffDataOk = _onBuffDataOk;
		UnityNet.RequestForGPB("avaBuffList.php", null, OnGetBuffListOK, null,true);
	}

	public void OnGetBuffListOK(byte[] data)
	{
		if(data == null)
		{
			//mybuffList
			GameMain.PlayerBuffs.InitAvaSelfBuffs(null);
			//enemybuffList
			GameMain.PlayerBuffs.InitAvaEnemyBuffs(null);
		}
		else
		{
			PBMsgAvaBuffList.PBMsgAvaBuffList response = _Global.DeserializePBMsgFromBytes<PBMsgAvaBuffList.PBMsgAvaBuffList> (data);
			//mybuffList
			GameMain.PlayerBuffs.InitAvaSelfBuffs(response.myBuffList);
			//enemybuffList
			GameMain.PlayerBuffs.InitAvaEnemyBuffs(response.enemyBuffList);
		}
		if (onBuffDataOk != null)
			onBuffDataOk ();
		KBN.Game.Event.Fire(this, new KBN.AvaBuffListOkEventArgs());
		//GameMain.Ava.TileShare.RefreshShareList(AvaTileShare.SubCommand.Alliance, 1, 20);
	}
}
