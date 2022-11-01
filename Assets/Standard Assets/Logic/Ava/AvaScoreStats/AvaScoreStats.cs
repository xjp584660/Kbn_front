using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using LitJson;

public class AvaScoreStats : AvaModule
{
    public AvaScoreStats(AvaManager avaEntry)
        : base(avaEntry)
    {
        EnemyScore = -1;
    }

	public float MyIncreaseRate
	{
		get;
		set;
	}

	public float EnemyIncreaseRate
	{
		get;
		set;
	}

    public long TimeRemaining
    {
        get;
        set;
    }

    public long UserScore
    {
        get;
        set;
    }

	public float ownBigWonderNum
	{
		get;
		set;
	}

	public float ownSmallWonderNum
	{
		get;
		set;
	}

	public float enemyBigWonderNum
	{
		get;
		set;
	}

	public float enemySmallWonderNum
	{
		get;
		set;
	}

	public void Set_UserScore(long score)
	{
		_userScore = score;
	}

    public AllianceEmblemData UserEmblem
    {
        get;
        set;
    }

    public long EnemyScore
    {
        get;
        set;
    }

	public void Set_EnemyScore(long score)
	{
		_enemyScore = score;
	}

    public AllianceEmblemData EnemyEmblem
    {
        get;
        set;
    }

	public override void Update()
	{
		if(AvaEntry.Event.CurStatus == AvaEvent.AvaStatus.Combat)
		{
            _userScore += (double)MyIncreaseRate;
            _enemyScore += (double)EnemyIncreaseRate;
			UserScore = System.Convert.ToInt64(_userScore);
			EnemyScore = System.Convert.ToInt64(_enemyScore);
			UpdateUI ();
		}
	}

	public void UpdateWonderTileNumChange(PBMsgAVASocket.PBMsgAVASocket msg )
	{
		if(msg == null || msg.result == null || msg.result.Count < 2)
		{
			return;
		}

		string [] own = msg.result[0].value.ToString().Split (':');
		ownBigWonderNum = KBN._Global.FLOAT(own[0]);
		ownSmallWonderNum = KBN._Global.FLOAT(own[1]);

		string [] enemy = msg.result[1].value.ToString().Split (':');
		enemyBigWonderNum = KBN._Global.FLOAT(enemy[0]);
		enemySmallWonderNum = KBN._Global.FLOAT(enemy[1]);
	}

    private double _userScore = 0.0f;
    private double _enemyScore = 0.0f;
	public void UpdateScoreStats(PBMsgAVASocket.PBMsgAVASocket msg )
    {
		if(msg == null || KBN.Alliance.singleton == null)
		{
			return;
		}

		List<long> para = msg.para;
		if (para == null || para.Count < 3 || msg.result == null)
        {
            return;
        }
        // 0 : server id
        // 2 : alliance id
        // 3 : score

        if (para[0] == (long)KBN.Datas.singleton.worldid() && para[1] == (long)KBN.Alliance.singleton.MyAllianceId())
        {
            _userScore = System.Convert.ToDouble(para[2]);
            UserScore = para[2];
			for(int i=0;i<msg.result.Count;i++)
			{
				if(msg.result[i].key == "incRate")
				{
					MyIncreaseRate = KBN._Global.FLOAT(msg.result [i].value);
					break;
				}
			}

        }
        else
        {
            _enemyScore = System.Convert.ToDouble(para[2]);
            EnemyScore = para[2];
			for(int i=0;i<msg.result.Count;i++)
			{
				if(msg.result[i].key == "incRate")
				{
					EnemyIncreaseRate = KBN._Global.FLOAT(msg.result [i].value);
					break;
				}
			}
        }
	
        UpdateUI();
    }

    private void UpdateUI()
    {
        AvaMainChrome avaMainChrome = KBN.MenuMgr.instance.getMenu("AvaMainChrome") as AvaMainChrome;
        if (avaMainChrome != null)
        {
            avaMainChrome.UpdateMarchScoreStats();
        }
    }
}
