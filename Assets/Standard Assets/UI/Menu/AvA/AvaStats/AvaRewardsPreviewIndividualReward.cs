using UnityEngine;
using System.Collections;
using KBN;
using RewardData = KBN.GDS_AvaReward.AvaReward;
using RewardItem = AvaRewardsPreviewIndividualRewardItem;
using ModeRewardData = KBN.GDS_AvaModeReward.AvaModeReward;
using LeagueRewardData = KBN.GDS_SeasonLeague.LeagueReward;

public class AvaRewardsPreviewIndividualReward : UIObject {


	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbTitle;

	[SerializeField]
	private SimpleLabel lbEapBg;
	[SerializeField]
	private SimpleLabel lbEap;
	[SerializeField]
	private Vector2 eapTextOffset = new Vector2(46, 0);

	[SerializeField]
	private UIList itemList;

	[SerializeField]
	private RewardItem itemTemplate;

	public override void Init ()
	{
		base.Init ();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Quest_kuang", TextureType.DECORATION);

		lbTitle.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_strips2", TextureType.DECORATION);

		lbEapBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Brown_Gradients", TextureType.DECORATION);

		lbEap.mystyle.normal.background = TextureMgr.singleton.LoadTexture("AP_icon", TextureType.DECORATION);

		itemList.Init();
		itemTemplate.Init();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbFrame.Draw();
		lbTitle.Draw();
		lbEapBg.Draw();
		lbEap.Draw();
		itemList.Draw();

		GUI.EndGroup();

		return -1;
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		var avaReward = data as RewardData;
		var leagueReward = data as LeagueRewardData;

		if (avaReward != null)
		{
			lbTitle.txt = string.Format(Datas.getArString("AVA.Reward_Preview_BattleScore"), avaReward.MinScore, avaReward.MaxScore);
			
			lbEap.mystyle.normal.background = TextureMgr.singleton.LoadTexture("AP_icon", TextureType.DECORATION);
			lbEap.mystyle.contentOffset = eapTextOffset;
			lbEap.txt = string.Format(Datas.getArString("AVA.Reward_Preview_IM"), avaReward.EAP);
			lbEap.rect.x = (520 - (eapTextOffset.x + lbEap.mystyle.CalcSize(new GUIContent(lbEap.txt)).x)) * 0.5f;
		}
		else
		{
			string league_name = Datas.getArString("LeagueName.League_" + leagueReward.Level);
			lbTitle.txt = string.Format(Datas.getArString("AVA.LeagueInfo_RankRange"), league_name, leagueReward.MaxRank, leagueReward.MinRank);
			
			lbEap.mystyle.normal.background = null;
			lbEap.mystyle.contentOffset = Vector2.zero;
			lbEap.txt = string.Format(Datas.getArString("AVA.LeagueInfo_Buff_Desc"), leagueReward.Buff + "%");
			lbEap.rect.x = (520 - (lbEap.mystyle.CalcSize(new GUIContent(lbEap.txt)).x)) * 0.5f;
		}

		string[] itemData = (avaReward != null) ? avaReward.Items.Split('|') : leagueReward.Items.Split('_');

		for (int i = 0 ; i < itemData.Length; i++)
		{
			RewardItem item = Instantiate(itemTemplate) as RewardItem;

			item.SetUIData(itemData[i]);
			itemList.AddItem(item);
		}

		lbFrame.rect.height = itemList.rect.yMax + 10;
		rect.height = lbFrame.rect.yMax;
	}

	public void SetModeUIData(object data)
	{
		var avaReward = data as ModeRewardData;

		if (avaReward != null)
		{
			lbTitle.txt = string.Format(Datas.getArString("AVA.Reward_Preview_BattleScore"), avaReward.MinScore, avaReward.MaxScore);
			
			lbEap.mystyle.normal.background = TextureMgr.singleton.LoadTexture("AP_icon", TextureType.DECORATION);
			lbEap.mystyle.contentOffset = eapTextOffset;
			lbEap.txt = string.Format(Datas.getArString("AVA.Reward_Preview_IM"), avaReward.EAP);
			lbEap.rect.x = (520 - (eapTextOffset.x + lbEap.mystyle.CalcSize(new GUIContent(lbEap.txt)).x)) * 0.5f;
		}

		string[] itemData = avaReward.Items.Split('|');

		for (int i = 0 ; i < itemData.Length; i++)
		{
			RewardItem item = Instantiate(itemTemplate) as RewardItem;

			item.SetUIData(itemData[i]);
			itemList.AddItem(item);
		}

		lbFrame.rect.height = itemList.rect.yMax + 10;
		rect.height = lbFrame.rect.yMax;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		itemList.Clear(true);
	}
}
