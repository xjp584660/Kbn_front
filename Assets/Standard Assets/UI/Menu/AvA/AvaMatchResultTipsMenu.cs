using UnityEngine;
using System.Collections;
using KBN;
public class AvaMatchResultTipsMenu : PopMenu 
{
	public NormalTipsBar tip;

	public SimpleLabel tipTitle;
	public SimpleLabel myAllianceName;
	public SimpleLabel myAllianceScore;
	public SimpleLabel myAllianceRank;
	public SimpleLabel VS;
	public SimpleLabel avaScore;
	public SimpleLabel avaRank;
	public SimpleLabel enemyAllianceName;
	public SimpleLabel enemyAllianceScore;
	public SimpleLabel enemyAllianceRank;

	public float DEADTIME;
	private float deadTime;

	public override void Init ()
	{
		tip.Init();
		deadTime = 0.0f;
	}

	public override int Draw ()
	{
		tip.Draw ();
		GUI.BeginGroup (rect);
		tipTitle.Draw ();
		myAllianceName.Draw ();
		myAllianceScore.Draw ();
		myAllianceRank.Draw ();
		VS.Draw ();
		avaScore.Draw ();
		avaRank.Draw ();
		enemyAllianceName.Draw ();
		enemyAllianceScore.Draw ();
		enemyAllianceRank.Draw ();
		GUI.EndGroup ();
		return 1;
	}

	public override void Update ()
	{
		tip.Update();
		rect = tip.rect;
		if(!tip.IsShow() || tip.stopTime <= 0)
		{
			KBN.MenuMgr.instance.PopMenu("");
		}
		deadTime += Time.deltaTime;
		if(deadTime >= DEADTIME)
		{
			KBN.MenuMgr.instance.PopMenu("");
		}
	}

	public override void OnPush(object param)
	{
		PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult result = param as PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult;
		if (null == result)
			return;
		myAllianceName.txt = result.myAllianceName;
		myAllianceScore.txt = result.myAllianceScore.ToString ();
		myAllianceRank.txt = result.myAllianceRank.ToString ();
		if(string.IsNullOrEmpty(result.enemyAllianceName))
		{
			enemyAllianceName.txt = Datas.getArString("Chrome.match_noAlliance");
		}
		else
		{
			enemyAllianceName.txt = result.enemyAllianceName;
		}
		if(string.IsNullOrEmpty(result.enemyAllianceName))
		{
			myAllianceScore.txt = Datas.getArString("Chrome.match_basedOnScore");
            enemyAllianceScore.txt = string.Empty;
		}
		else
		{
			enemyAllianceScore.txt = result.enemyAllianceScore.ToString ();
		}
		if(string.IsNullOrEmpty(result.enemyAllianceName))
		{
			myAllianceRank.txt = Datas.getArString("Chrome.match_automaticVictory");
			enemyAllianceRank.txt = string.Empty;
		}
		else
		{
			enemyAllianceRank.txt = result.enemyAllianceRank.ToString ();
		}

		tipTitle.txt = Datas.getArString ("AVA.matchmakingresult_AVAeventstartstitle");
		VS.txt = Datas.getArString ("AVA.matchmakingresult_VS");
		avaScore.txt = Datas.getArString ("AVA.matchmakingresult_AVAScore");
		avaRank.txt = Datas.getArString ("AVA.matchmakingresult_AVARank");
		tip.Show();
	}


}
