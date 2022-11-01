using UnityEngine;
using System.Collections;

public class AvALeaderBoardIndividualItem : FullClickItem
{
	public Label l_Rank;
	public Label l_Name;
	public Label l_AllianceName;
	public Label l_Score;
    public AllianceEmblem emblem;

    private PBMsgAVALeaderBoard.PBMsgAVALeaderBoard.LeaderBoardItemData itemData = null;

	public override void Init ()
	{
		base.Init();

        btnDefault.alpha = 0.3f;
	}

	public override void SetRowData (object data)
	{
        itemData = data as PBMsgAVALeaderBoard.PBMsgAVALeaderBoard.LeaderBoardItemData;
        pri_setRank(itemData.rank);
		l_Name.txt = itemData.userName;
		l_AllianceName.txt = itemData.allianceName;
		l_Score.txt = itemData.score.ToString();
        if (itemData.emblem != null)
        {
            emblem.Data = new AllianceEmblemData(
                itemData.emblem.curBanner,
                itemData.emblem.curStyle,
                itemData.emblem.curStyleColor,
                itemData.emblem.curSymbol,
                itemData.emblem.curSymbolColor
                );
        }

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

	public override int Draw ()
	{
		base.Draw();

		GUI.BeginGroup(rect);
		l_Rank.Draw();
		l_Name.Draw();
		l_AllianceName.Draw();
		emblem.Draw();
		l_Score.Draw();
		GUI.EndGroup();
		return -1;
	}

	private void OnClickItem(System.Object param)
	{
	}
}
