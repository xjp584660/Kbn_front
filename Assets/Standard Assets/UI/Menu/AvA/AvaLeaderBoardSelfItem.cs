using UnityEngine;
using System.Collections;

public class AvaLeaderBoardSelfItem : UIObject
{
    public Label l_Background;
    public Label l_Rank;
    public Label l_Score;
    public Label l_language;

    #region alliance
    public Label l_AllianceName1;
    public Label l_World;
    #endregion alliance

    #region individual
    public Label l_PlayerName;
    public Label l_AllianceName2;
    #endregion individual

    public AllianceEmblem emblem;

    #region tip
    public SimpleLabel l_Tip;
    #endregion tip

    private int mType = 0;
    private PBMsgAVALeaderBoard.PBMsgAVALeaderBoard mRank = null;

    public override void Init()
    {
        base.Init();

        l_Background.Init();
        if (l_Background.mystyle.normal.background == null)
        {
            l_Background.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_tiao", TextureType.DECORATION);
        }

        l_Tip.txt = KBN.Datas.getArString("AVA.leaderboard_noalliancenote");
        l_Tip.SetVisible(false);
    }

    public void SetItemUIData(int type, object data)
    {
        mType = type;
        mRank = data as PBMsgAVALeaderBoard.PBMsgAVALeaderBoard;

        if (KBN.Alliance.singleton.hasGetAllianceInfo)
        {
            pri_setUIData();
        }
        else
        {
            KBN.Alliance.singleton.reqAllianceInfo(pri_setUIData);
        }
    }

    public override int Draw()
    {
        GUI.BeginGroup(rect);
		if(l_Background != null)
		{
			l_Background.Draw();
		}
		if(l_Rank != null)
		{
			l_Rank.Draw();
		}
		if(l_language != null)
		{
			l_language.Draw();
		}
		if(l_PlayerName != null)
		{
			l_PlayerName.Draw();
		}
		if(l_AllianceName1 != null)
		{
			l_AllianceName1.Draw();
		}
		if(l_AllianceName2 != null)
		{
			l_AllianceName2.Draw();
		}
		if(l_World != null)
		{
			l_World.Draw();
		}
		if(emblem != null)
		{
			emblem.Draw();
		}
		if(l_Score != null)
		{
			l_Score.Draw();
		}
		if(l_Tip != null)
		{
			l_Tip.Draw();
		}
		GUI.EndGroup();
		return -1;
	}
	
	private void pri_setUIData()
	{
		if (KBN.Alliance.singleton.MyAllianceId() <= 0)
		{
			l_AllianceName1.SetVisible(false);
			l_PlayerName.SetVisible(false);
			l_AllianceName2.SetVisible(false);
			l_World.SetVisible(false);
            if(l_language!=null)
                l_language.SetVisible(false);
            emblem.SetVisible(false);

            l_Rank.SetVisible(false);
            l_Score.SetVisible(false);

            l_Tip.SetVisible(true);
        }
        else
        {
            l_Tip.SetVisible(false);

            l_Rank.SetVisible(true);
            l_Score.SetVisible(true);
            emblem.SetVisible(true);
            if(l_language!=null)
                l_language.SetVisible(true);

            if (mRank != null)
            {
                if(l_language!=null){
                    KBN.DataTable.AllianceLanguage gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_Alliancelanguage>().GetItemById(mRank.languageId);
                    l_language.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds==null?"":gds.flagicon,TextureType.ALLIANCELANGUAGE);
                }
                

                if (mType == 0) // alliance
                {
                    l_AllianceName1.SetVisible(true);
                    l_World.SetVisible(true);
                    l_PlayerName.SetVisible(false);
                    l_AllianceName2.SetVisible(false);

                    l_AllianceName1.txt = KBN.Alliance.singleton.MyAllianceName();
                    l_World.txt = mRank.serverName;
                    l_Rank.txt = mRank.position < 0 ? "---" : mRank.position.ToString();
                    l_Score.txt = mRank.score < 0 ? "---" : mRank.score.ToString();
                    
                    emblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
                }
                else if (mType == 1) // individual
                {
                    l_AllianceName1.SetVisible(false);
                    l_World.SetVisible(false);
                    l_PlayerName.SetVisible(true);
                    l_AllianceName2.SetVisible(true);
                    
                    l_PlayerName.txt = KBN.GameMain.singleton.getSeed()["players"]["u" + KBN.Datas.singleton.tvuid()]["n"].Value.ToString();
                    l_AllianceName2.txt = KBN.Alliance.singleton.MyAllianceName();

                    
                    l_Rank.txt = mRank.position < 0 ? "---" : mRank.position.ToString();
                    l_Score.txt = mRank.score < 0 ? "---" : mRank.score.ToString();
                    
                    emblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
                }
            }
        }
    }
}
