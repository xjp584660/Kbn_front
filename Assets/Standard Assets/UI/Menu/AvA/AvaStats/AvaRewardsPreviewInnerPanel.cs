using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaRewardsPreviewInnerPanel : UIObject {

	[SerializeField]
	private AvaRewardsPreviewAlliance alliancePanel;
	[SerializeField]
	private AvaRewardsPreviewIndividual individualPanel;
	[SerializeField]
	private AvaRewardsPreviewIndividualReward rewardTemplate;

	private List<AvaRewardsPreviewIndividualReward> rewards;

	public override void Init ()
	{
		base.Init ();

		alliancePanel.Init();
		individualPanel.Init();

		rewardTemplate.Init();
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		var table = data as Hashtable;
		bool isLeague = null != table && table.ContainsKey("league") && _Global.GetBoolean(table["league"]);

		rewards = new List<AvaRewardsPreviewIndividualReward>();
		
		float y = individualPanel.rect.yMax;

		if (isLeague) 
		{
			GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
			List<GDS_SeasonLeague.LeagueReward> rewardsData = gds.GetItems();

			table["special"] = rewardsData[0].Special;
			alliancePanel.SetUIData(table);
			individualPanel.SetUIData(table);
			
			for (int i = 0; i < rewardsData.Count; i++)
			{
				var reward = Instantiate(rewardTemplate) as AvaRewardsPreviewIndividualReward;
				reward.SetUIData(rewardsData[i]);
				reward.rect.y = y;
				y = reward.rect.yMax + 10;
				rewards.Add(reward);
			}
		}
		else
		{
			alliancePanel.SetUIData(null);
			individualPanel.SetUIData(null);

			GDS_AvaReward gds = GameMain.GdsManager.GetGds<GDS_AvaReward>();
			List<GDS_AvaReward.AvaReward> rewardsData = gds.GetItems();


			for (int i = 0; i < rewardsData.Count; i++)
			{
				var reward = Instantiate(rewardTemplate) as AvaRewardsPreviewIndividualReward;
				reward.SetUIData(rewardsData[i]);
				reward.rect.y = y;
				y = reward.rect.yMax + 10;
				rewards.Add(reward);
			}
		}

		rect.height = y;
	}

	public void SetModeUIData (object data)
	{
		rewards = new List<AvaRewardsPreviewIndividualReward>();
		
		float y = individualPanel.rect.yMax;

		alliancePanel.SetModeUIData(null);
		individualPanel.SetUIData(null);

		GDS_AvaModeReward gds = GameMain.GdsManager.GetGds<GDS_AvaModeReward>();
		List<GDS_AvaModeReward.AvaModeReward> rewardsData = gds.GetItems();


		for (int i = 0; i < rewardsData.Count; i++)
		{
			var reward = Instantiate(rewardTemplate) as AvaRewardsPreviewIndividualReward;
			reward.SetModeUIData(rewardsData[i]);
			reward.rect.y = y;
			y = reward.rect.yMax + 10;
			rewards.Add(reward);
		}

		rect.height = y;
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		alliancePanel.Draw();
		individualPanel.Draw();

		if (null != rewards)
		{
			for (int i = 0; i < rewards.Count; i++)
			{
				rewards[i].Draw();
			}
		}

		GUI.EndGroup();

		return -1;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		if (null != rewards)
		{
			for (int i = 0; i < rewards.Count; i++)
			{
				rewards[i].OnPopOver();
				TryDestroy(rewards[i]);
			}
		}
	}
}
