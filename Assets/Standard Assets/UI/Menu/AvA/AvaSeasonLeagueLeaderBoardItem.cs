using UnityEngine;
using System.Collections;
using KBN;
public class AvaSeasonLeagueLeaderBoardItem : FullClickItem
{
	public Label l_Rank;
	public Label l_Name;
	public Label l_World;
	public Label l_Score;
	public Label l_ScoreDiff;
	public Label l_language;
	public AllianceEmblem emblem;
	public Label l_bg;
	
	private PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League itemData = null;
	
	public override void Init ()
	{
		base.Init();
		
		btnDefault.alpha = 0.3f;
	}
	
	public override void SetRowData (object data)
	{
		itemData = data as PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League;
		pri_setRank(itemData.leagueRank);
		l_Name.txt = itemData.allianceName;
		l_Score.txt = _Global.NumSimlify(itemData.score);
		l_World.txt = itemData.serverName;
		KBN.DataTable.AllianceLanguage gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_Alliancelanguage>().GetItemById(itemData.languageId);
		if(l_language!=null)
        	l_language.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds==null?"":gds.flagicon,TextureType.ALLIANCELANGUAGE);
		if(itemData.curBattleRank > itemData.preBattleRank)
		{
			l_ScoreDiff.txt = (itemData.preBattleRank - itemData.curBattleRank).ToString ();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			l_ScoreDiff.txt = "+" + (itemData.preBattleRank - itemData.curBattleRank).ToString ();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Green);
		}
		l_ScoreDiff.SetVisible (itemData.preLeagueLevel != 0 && itemData.preBattleRank != itemData.curBattleRank);
		
		emblem.Data = new AllianceEmblemData(
			itemData.emblem.curBanner, 
			itemData.emblem.curStyle, 
			itemData.emblem.curStyleColor, 
			itemData.emblem.curSymbol, 
			itemData.emblem.curSymbolColor
			);
		
		btnSelect.OnClick = new System.Action<System.Object>(OnClickItem);
	}
	
	private void pri_setRank(int rank)
	{
		if (rank == 1)
		{
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank1_s", TextureType.ICON);
		}
		else if (rank == 2)
		{
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank2_s", TextureType.ICON);
		} 
		else if (rank == 3)
		{
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank3_s", TextureType.ICON);
		} 
		else
		{
			l_Rank.image = null;
			l_Rank.txt = itemData.leagueRank.ToString();
		}
	}
	
	public override void DrawItem()
	{
		base.DrawItem();
//		GUI.BeginGroup(rect);
		l_bg.Draw ();
		l_Rank.Draw();
		l_Name.Draw();
		l_World.Draw();
		l_Score.Draw();
		l_ScoreDiff.Draw ();
		if(l_language!=null)
			l_language.Draw();
		emblem.Draw();
//		GUI.EndGroup();
//		return -1;
	}
	
	private void OnClickItem(System.Object param)
	{
	}
	public override void SetIndexInList(int index)
	{
		if (l_bg == null)
			return;
		if(index % 2 == 0)
		{
			l_bg.setBackground("rank_single_background", TextureType.FTE);
			l_bg.SetVisible(true);
		}
		else
		{
			l_bg.SetVisible(false);
			//lblBackGround.setBackground("rank_double_background", TextureType.FTE);
		}
	}
}
