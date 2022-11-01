using UnityEngine;
using System.Collections;
using KBN;

public class AvaRewardsPreviewAlliance : UIObject {

	[SerializeField]
	private SimpleLabel lbTitleBg;
	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbDesc;
	
	[SerializeField]
	private SimpleLabel lbReward1Bg;
	[SerializeField]
	private SimpleLabel lbReward1;
	[SerializeField]
	private SimpleLabel lbReward2Bg;
	[SerializeField]
	private SimpleLabel lbReward2;
	[SerializeField]
	private SimpleLabel lbReward3Bg;
	[SerializeField]
	private SimpleLabel lbReward3;

	[SerializeField]
	private SimpleLabel lbIcon1;
	[SerializeField]
	private SimpleLabel lbIcon2;

	[SerializeField]
	private AvaRewardsPreviewIndividualRewardItem rewardItem;
	[SerializeField]
	private SimpleLabel line1;
	[SerializeField]
	private SimpleLabel line2;

	public override void Init ()
	{
		base.Init ();

		lbTitleBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_frame", TextureType.DECORATION);
		lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Alliance");

		lbDesc.txt = Datas.getArString("AVA.Reward_Preview_Alliance_Description");

		lbReward1Bg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Orange_Gradients", TextureType.DECORATION);
		lbReward1.txt = Datas.getArString("AVA.Reward_Preview_Glory");
		lbReward2Bg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Orange_Gradients", TextureType.DECORATION);
		lbReward2.txt = Datas.getArString("AVA.Reward_Preview_EXP");
		lbReward3Bg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Orange_Gradients", TextureType.DECORATION);
		lbReward3.txt = Datas.getArString("AVA.Reward_Preview_AM");
		
		lbIcon1.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_icon_Allise", TextureType.BUTTON);
		lbIcon2.mystyle.normal.background = TextureMgr.singleton.LoadTexture("HP_icon", TextureType.DECORATION);

		rewardItem.Init();
		line1.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
		line2.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
	}

	public void SetModeUIData(object data)
	{
		// lbReward1Bg.SetVisible(false);
		// lbReward1.SetVisible(false);
		// // lbReward2Bg.SetVisible(true);
		// // lbReward2.SetVisible(!isLeague);
		// // lbReward3Bg.SetVisible(!isLeague);
		// // lbReward3.SetVisible(!isLeague);
		// lbReward2Bg.rect = new Rect(0, 135, 520, 40);
		// lbReward2.rect = new Rect(0, 135, 520, 40);
		// lbReward3Bg.rect = new Rect(0, 180, 520, 40);
		// lbReward3.rect = new Rect(0, 180, 520, 40);
		// lbIcon1.rect = new Rect(430, 135, 40, 40);
		// lbIcon2.rect = new Rect(430, 180, 40, 40);
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		if (null == data || null == data as Hashtable) return;
		var table = data as Hashtable;
		bool isLeague = _Global.GetBoolean(table["league"]);

		if (isLeague)
		{
			rewardItem.SetUIData(table["special"]);
			lbTitle.txt = Datas.getArString("AVA.LeagueInfo_SpecialRewards_Title");
			lbDesc.txt = Datas.getArString("AVA.LeagueInfo_SpecialRewards_Desc");
		}
		else
		{
			lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Alliance");
			lbDesc.txt = Datas.getArString("AVA.Reward_Preview_Alliance_Description");
		}

		lbReward1Bg.SetVisible(!isLeague);
		lbReward1.SetVisible(!isLeague);
		lbReward2Bg.SetVisible(!isLeague);
		lbReward2.SetVisible(!isLeague);
		lbReward3Bg.SetVisible(!isLeague);
		lbReward3.SetVisible(!isLeague);
		
		lbIcon1.SetVisible(!isLeague);
		lbIcon2.SetVisible(!isLeague);

		rewardItem.SetVisible(isLeague);
		line1.SetVisible(isLeague);
		line2.SetVisible(isLeague);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		lbTitleBg.Draw();
		lbTitle.Draw();
		lbDesc.Draw();

		lbReward1Bg.Draw();
		lbReward1.Draw();
		lbReward2Bg.Draw();
		lbReward2.Draw();
		lbReward3Bg.Draw();
		lbReward3.Draw();
		
		lbIcon1.Draw();
		lbIcon2.Draw();

		rewardItem.Draw();
		
		line1.Draw();
		line2.Draw();

		GUI.EndGroup();

		return -1;
	}
}
