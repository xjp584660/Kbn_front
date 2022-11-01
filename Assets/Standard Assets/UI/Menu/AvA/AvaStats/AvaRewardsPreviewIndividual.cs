using UnityEngine;
using System.Collections;
using KBN;

public class AvaRewardsPreviewIndividual : UIObject {

	[SerializeField]
	private SimpleLabel lbTitleBg;
	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbDesc;

	public override void Init ()
	{
		base.Init ();
		
		lbTitleBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_frame", TextureType.DECORATION);
		lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Individual");
		
		lbDesc.txt = Datas.getArString("AVA.Reward_Preview_Individual_Description");
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		var table = data as Hashtable;
		if (null != table && _Global.GetBoolean(table["league"]))
		{
			lbTitle.txt = Datas.getArString("AVA.LeagueInfo_RankRewardsTitle");
			lbDesc.txt = Datas.getArString("AVA.LeagueInfo_RankRewardsDesc");
		}
		else
		{
			lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Individual");
			lbDesc.txt = Datas.getArString("AVA.Reward_Preview_Individual_Description");
		}
	}
	
	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		lbTitleBg.Draw();
		lbTitle.Draw();
		lbDesc.Draw();
		GUI.EndGroup();
		
		return -1;
	}
}
