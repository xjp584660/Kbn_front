using UnityEngine;
using System.Collections;
using KBN;
using LeagueRewardData = KBN.GDS_SeasonLeague.LeagueReward;

public class AvaSeasonLeagueHelpItem : ListItem {

	[SerializeField]
	private SimpleLabel lbLogo;
	[SerializeField]
	private SimpleLabel lbRank;
	[SerializeField]
	private SimpleLabel lbBuff;


	public override void Init ()
	{
		base.Init ();
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);

		var leagueReward = data as LeagueRewardData;

		lbLogo.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(leagueReward.Level), TextureType.DECORATION);
		try
		{
			string league_name = Datas.getArString("LeagueName.League_" + leagueReward.Level);
			lbRank.txt = string.Format(Datas.getArString("AVA.LeagueInfo_RankRange"), league_name, leagueReward.MaxRank, leagueReward.MinRank);
			lbBuff.txt = string.Format(Datas.getArString("AVA.LeagueInfo_Buff_Desc"), leagueReward.Buff + "%");
		}
		catch
		{
			lbRank.txt = string.Format("Battle Rank: {0}-{1}", leagueReward.MaxRank, leagueReward.MinRank);
			lbBuff.txt = string.Format("League Buff: Training Speed +{0}", leagueReward.Buff + "%");
		}
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		lbLogo.Draw();
		lbRank.Draw();
		lbBuff.Draw();
		GUI.EndGroup();

		return -1;
	}

}
