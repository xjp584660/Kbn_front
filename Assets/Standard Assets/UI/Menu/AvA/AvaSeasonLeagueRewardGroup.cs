using UnityEngine;
using System.Collections;
using KBN;
using LeagueRewardData = KBN.GDS_SeasonLeague.LeagueReward;
using RewardItem = AvaSeasonLeagueRewardItem;

public class AvaSeasonLeagueRewardGroup : UIObject {

	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbLogoBg;
	[SerializeField]
	private SimpleLabel lbLogoBgL;
	[SerializeField]
	private SimpleLabel lbLogoBgR;
	[SerializeField]
	private SimpleLabel lbLogo;
	
	[SerializeField]
	private SimpleLabel lbTitleBg;
	[SerializeField]
	private SimpleLabel lbTitle;
	
	[SerializeField]
	private UIList itemList;

	[SerializeField]
	private RewardItem itemTemplate;

	public override void Init ()
	{
		base.Init();
		lbFrame.setBackground("square_black2", TextureType.DECORATION);
//		lbLogoBg
		lbLogoBgL.setBackground("huwen_new", TextureType.DECORATION);
		lbLogoBgR.setBackground("huwen_new", TextureType.DECORATION);

		lbTitleBg.setBackground("Orange_Gradients", TextureType.DECORATION);

		itemList.Init();
		itemTemplate.Init();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;
		base.Draw ();

		GUI.BeginGroup(rect);
		lbFrame.Draw();
		lbLogoBg.Draw();
		lbLogoBgL.Draw();
		lbLogoBgR.Draw();
		lbLogo.Draw();
		
		lbTitleBg.Draw();
		lbTitle.Draw();
		
		itemList.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void SetUIData (object data)
	{
		base.SetUIData(data);

		var leagueReward = data as LeagueRewardData;
		string league_name = Datas.getArString("LeagueName.League_" + leagueReward.Level);

		lbLogo.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(leagueReward.Level), TextureType.DECORATION);
		lbTitle.txt = league_name;

		string[] itemData = leagueReward.Items.Split('_');
		
		for (int i = 0 ; i < itemData.Length; i++)
		{
			RewardItem item = Instantiate(itemTemplate) as RewardItem;
			
			item.SetUIData(itemData[i]);
			itemList.AddItem(item);
		}
		
		lbFrame.rect.height = itemList.rect.yMax + 10;
		rect.height = lbFrame.rect.yMax;
	}

	public override void OnClear ()
	{
		base.OnClear();
		itemList.Clear(true);
	}

}
