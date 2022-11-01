using UnityEngine;
using System.Collections;
using KBN;
public class AvaSeasonLeagueIndividualRankItem : FullClickItem
{
	public Label l_Rank;
	public Label l_Name;
	public Label l_World;
	public Label l_Score;
	public Label l_ScoreDiff;
	public AllianceEmblem emblem;
	
	private PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo itemData = null;
	
	public override void Init ()
	{
		base.Init();
		
		btnDefault.alpha = 0.3f;
	}
	
	public override void SetRowData (object data)
	{
		itemData = data as PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo;
		pri_setRank(itemData.rank);
		l_Name.txt = itemData.userName;
		l_Score.txt = _Global.NumSimlify(itemData.battleScore);
	}
	
	private void pri_setRank(int rank)
	{
		l_Rank.txt = rank.ToString();
	}
	
	public override int Draw ()
	{
		base.Draw();
		GUI.BeginGroup(rect);
		l_Rank.Draw();
		l_Name.Draw();
		l_Score.Draw();
		GUI.EndGroup();
		return -1;
	}

}
