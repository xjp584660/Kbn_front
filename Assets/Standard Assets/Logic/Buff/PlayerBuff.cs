
using KBN;
using KBN.DataTable;
using System;
using System.Collections.Generic;

public class PlayerBuff {

	private RunningBuffs _homeRunningBuffs = new RunningBuffs();
	private RunningBuffs _avaSelfRunningBuffs = new RunningBuffs();
	private RunningBuffs _avaEnemyRunningBuffs = new RunningBuffs();


	public RunningBuffs HomeRunningBuffs{
		get{
			return _homeRunningBuffs;
		}
	}

	public RunningBuffs AvaSelfRunningBuffs{
		get{
			return _avaSelfRunningBuffs;
        }
    }

	public RunningBuffs AvaEnemyRunningBuffs{
		get{
			return _avaEnemyRunningBuffs;
        }
    }

	public float mySkill24BuffsValue = 0;

	public float emptySkill24BuffsValue = 0;

	public void InitHomeBuffs( HashObject seed ){

		HomeRunningBuffs.Clear();

		HashObject buffRoot = seed["buff"];
		object[] buffs = _Global.GetObjectValues( buffRoot );

		for( int i = 0; i < buffs.Length; i ++ ){

			HashObject hObject = buffs[i] as HashObject;
			int buffId = _Global.INT32(hObject["id"]);

			HomeRunningBuffs.Add( new RunningBuffItem( buffId,
			                                           _Global.INT64(hObject["eta"]), 
			                                           (BuffSource)Enum.Parse( typeof(BuffSource), _Global.GetString(hObject["src"]) )) );

		}
	}

	public void InitAvaSelfBuffs(List<PBMsgAvaBuffList.PBMsgAvaBuffList.BuffItem> buffs)
	{
		AvaSelfRunningBuffs.Clear ();
		mySkill24BuffsValue = 0;
		if(buffs!=null)
		{
			foreach(PBMsgAvaBuffList.PBMsgAvaBuffList.BuffItem buff in buffs)
			{
				_Global.LogWarning(" AvaMyBuffList buffId : " + buff.buffId);
				GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
				Buff bufftemp = buffGds.GetItemById( buff.buffId );
				if(bufftemp != null)
				{
					if(bufftemp.VALUE_TYPE == (int)BuffValueType.Thethousand)
					{
						mySkill24BuffsValue = bufftemp.VALUE / 10000f;
					}
					AvaSelfRunningBuffs.Add (new RunningBuffItem(buff.buffId,buff.endTime,(BuffSource)Enum.Parse(typeof(BuffSource),buff.from.ToString())));
				}		
			}
		}
	}

	public void InitAvaEnemyBuffs(List<PBMsgAvaBuffList.PBMsgAvaBuffList.BuffItem> buffs)
	{
		AvaEnemyRunningBuffs.Clear ();
		emptySkill24BuffsValue = 0;
		if(buffs!=null)
		{
			foreach(PBMsgAvaBuffList.PBMsgAvaBuffList.BuffItem buff in buffs)
			{
				//_Global.LogWarning(" AvaEnemyBuffList buffId : " + buff.buffId);
				GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
				Buff bufftemp = buffGds.GetItemById( buff.buffId );
				if(bufftemp.VALUE_TYPE == (int)BuffValueType.Thethousand)
				{
					emptySkill24BuffsValue = bufftemp.VALUE / 10000f;
				}
				AvaEnemyRunningBuffs.Add (new RunningBuffItem(buff.buffId,buff.endTime,(BuffSource)Enum.Parse(typeof(BuffSource),buff.from.ToString())));
			}
		}
	}

	public void AddTimeToRunningBuff( int buffId, BuffSource source, long time )
	{
		GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
		Buff buffEntity = buffGds.GetItemById( buffId );

		RunningBuffs targetRunningBuffs = HomeRunningBuffs;
		BuffScene scene = (BuffScene) Enum.Parse( typeof( BuffScene), buffEntity.SCENE.ToString());

		switch( scene )
		{
		case	BuffScene.Ava:
			targetRunningBuffs = AvaSelfRunningBuffs;
			break;

		case	BuffScene.Home:
			targetRunningBuffs = HomeRunningBuffs;
			break;
		}

		targetRunningBuffs.AddTimeToRunningBuff( buffId, source, time );
	}


}
