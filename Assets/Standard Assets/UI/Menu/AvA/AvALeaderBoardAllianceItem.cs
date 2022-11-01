using UnityEngine;
using System.Collections;

public class AvALeaderBoardAllianceItem : FullClickItem
{
	public Label l_Rank;
	public Label l_Name;
    public Label l_World;
	public Label l_Score;
	public Label l_ScoreDiff;
	public Label l_language;
    public AllianceEmblem emblem;
	public Label l_bg;

    private PBMsgAVALeaderBoard.PBMsgAVALeaderBoard.LeaderBoardItemData itemData = null;

	public override void Init ()
	{
		base.Init();

        btnDefault.alpha = 0.3f;

//		if(KBN._Global.isIphoneX()){
//			DistNormal.y = 70;
//			l_bg.rect.height = 70;
//		}
//		else
//		{
//			DistNormal.y = 75;
//			l_bg.rect.height = 75;
//		}
	}
	
	public override void SetRowData (object data)
	{
        itemData = data as PBMsgAVALeaderBoard.PBMsgAVALeaderBoard.LeaderBoardItemData;
        pri_setRank(itemData.rank);
        l_Name.txt = itemData.allianceName;
        l_World.txt = itemData.serverName;
        l_Score.txt = itemData.score.ToString();

        
		if(l_language!=null){
			KBN.DataTable.AllianceLanguage gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_Alliancelanguage>().GetItemById(itemData.languageId);
        	l_language.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds==null?"":gds.flagicon,TextureType.ALLIANCELANGUAGE);
		}

		if(itemData.scoreDiff < 0)
		{
			l_ScoreDiff.txt = itemData.scoreDiff.ToString ();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			l_ScoreDiff.txt = "+" + itemData.scoreDiff.ToString ();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Green);
		}
		l_ScoreDiff.SetVisible (itemData.scoreDiff != 0);

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
            l_Rank.txt = itemData.rank.ToString();
        }
    }
	
	public override void DrawItem()
	{
		base.DrawItem();
//		GUI.BeginGroup(rect);
		if(l_bg != null)
		{
			l_bg.Draw ();
		}

		l_Rank.Draw();
		l_Name.Draw();
        l_World.Draw();
		l_Score.Draw();
		if(l_language!=null)
			l_language.Draw();
		l_ScoreDiff.Draw ();
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
