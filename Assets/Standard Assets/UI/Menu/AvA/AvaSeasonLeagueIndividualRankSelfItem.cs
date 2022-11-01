using UnityEngine;
using System.Collections;
using System;
using KBN;
public class AvaSeasonLeagueIndividualRankSelfItem : UIObject
{
	public Label l_Background;
	public Label l_Rank;
	public Label l_Score;

	
	#region individual
	public Label l_PlayerName;
	#endregion individual

	private PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo m_Data = null;
	
	
	
	public override void Init()
	{
		base.Init();
		
		l_Background.Init();
		if (l_Background.mystyle.normal.background == null)
		{
			l_Background.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_tiao", TextureType.DECORATION);
		}
	}
	
	public void SetItemUIData(object data)
	{
		m_Data = data as PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard.LeagueUserInfo;
		
		pri_setUIData ();
	}
	
	public override int Draw()
	{
		if (!isVisible())
			return -1;
		GUI.BeginGroup(rect);
		l_Background.Draw();
		l_Rank.Draw();
		l_PlayerName.Draw();
		l_Score.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	private void pri_setUIData()
	{
		l_Rank.txt = m_Data.rank <= 0 ? "---" : m_Data.rank.ToString();
		l_PlayerName.txt = KBN.GameMain.singleton.getSeed()["players"]["u" + KBN.Datas.singleton.tvuid()]["n"].Value.ToString();
		l_Score.txt = m_Data.battleScore <= 0 ? "---" : _Global.NumSimlify(m_Data.battleScore);
	}

}
