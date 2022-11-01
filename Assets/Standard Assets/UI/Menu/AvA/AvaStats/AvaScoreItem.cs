using UnityEngine;
using System.Collections;

public class AvaScoreItem : FullClickItem
{
	public Label l_Rank;
	public Label l_Name;
	public Label l_Score;

    public SimpleLabel emblem;

	public override void Init ()
	{
		base.Init ();

        btnDefault.alpha = 0.3f;

		btnSelect.OnClick = new System.Action<System.Object>(OnClickItem);
	}

	public override void SetRowData (object data)
	{
        PBMsgAVAScoreRank.PBMsgAVAScoreRank.SignalPlayer _data = data as PBMsgAVAScoreRank.PBMsgAVAScoreRank.SignalPlayer;
        if (_data != null)
        {
            l_Rank.txt = _data.rank.ToString();
            l_Name.txt = _data.userName;
            l_Name.SetNormalTxtColor(FontColor.Title); // change font color by design

            if (_data.allianceId != KBN.Alliance.singleton.MyAllianceId())
            {
                emblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
            }
            else
            {
                if (_data.serverId != KBN.Datas.singleton.worldid())
                {
                    emblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
                }
                else if (KBN.Datas.singleton.tvuid() == _data.userId)
                {
                    emblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_yellow_0", TextureType.ICON_ELSE);
                }
                else
                {
                    emblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
                }
            }
            l_Score.txt = KBN._Global.NumSimlify(_data.score, 3, false);//_data.score.ToString();
        }
	}

	public override int Draw ()
	{
		base.Draw ();

		GUI.BeginGroup (rect);
		l_Rank.Draw();
		l_Name.Draw();
		l_Score.Draw();
        emblem.Draw();
        GUI.EndGroup();

		return -1;
	}

	private void OnClickItem(System.Object param)
	{
	}
}
