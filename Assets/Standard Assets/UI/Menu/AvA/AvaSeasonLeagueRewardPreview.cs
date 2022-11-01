using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaSeasonLeagueRewardPreview : PopMenu {

	[SerializeField]
	private SimpleLabel lbSeparator;
	[SerializeField]
	private SimpleLabel lbImageBg;
	[SerializeField]
	private SimpleLabel lbBannerBg;
	[SerializeField]
	private SimpleLabel lbBannerIcon;
	[SerializeField]
	private SimpleLabel lbBannerTitle;
	[SerializeField]
	private SimpleLabel lbItemIconBg1;
	[SerializeField]
	private SimpleLabel lbItemIconBg2;
	[SerializeField]
	private SimpleLabel lbItemIcon;
	[SerializeField]
	private SimpleLabel lbItemName;
	[SerializeField]
	private SimpleLabel lbItemCount;

	[SerializeField]
	private ScrollView scrollView;
	[SerializeField]
	private AvaSeasonLeagueRewardGroup itemTemplate;
	[SerializeField]
	private SimpleLabel lbFrameBg;
	[SerializeField]
	private SimpleLabel lbFrameTitle;

	[SerializeField]
	private int intervalSize;

	public override void Init ()
	{
		base.Init ();

		title.txt = Datas.getArString("AVA.LeagueInfo_Title");
		lbSeparator.setBackground("between line", TextureType.DECORATION);
		lbImageBg.setBackground("pvp_new", TextureType.DECORATION);
		lbBannerBg.setBackground("chat_announcement_light", TextureType.DECORATION);
		lbBannerIcon.setBackground("league_1", TextureType.DECORATION);
		lbBannerTitle.txt = Datas.getArString("AVA.LeagueInfo_SpecialRewards_Title");
		lbItemIconBg1.setBackground("light_box", TextureType.DECORATION);
		lbItemIconBg2.setBackground("lizisankai_0002", TextureType.DECORATION);

		lbFrameBg.setBackground("Quest_kuang2", TextureType.DECORATION);
		lbFrameTitle.txt = Datas.getArString("AVA.LeagueInfo_RankRewardsTitle");

		lbBannerTitle.SetFont();
		Vector2 size = lbBannerTitle.mystyle.CalcSize(new GUIContent(lbBannerTitle.txt));
		lbBannerIcon.rect.x = (rect.width - size.x - lbBannerIcon.rect.width - 5) * 0.5f;
		lbBannerTitle.rect.x = lbBannerIcon.rect.xMax + 5;

		itemTemplate.Init();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
		List<GDS_SeasonLeague.LeagueReward> rewardsData = gds.GetItems();

		string[] datas = rewardsData[0].Special.Split(':');
		
		int itemId = _Global.INT32(datas[0]);
		int count = _Global.INT32(datas[1]);

		lbItemIcon.useTile = true;
		lbItemIcon.tile = TextureMgr.singleton.LoadTileOfItem(itemId);

		lbItemName.txt = Datas.getArString("itemName.i" + itemId);
		lbItemCount.txt = "X " + count;

		scrollView.clearUIObject();
		scrollView.IntervalSize = intervalSize;

		for (int i = 0; i < rewardsData.Count; i++)
		{
			var group = Instantiate(itemTemplate) as AvaSeasonLeagueRewardGroup;
			group.SetUIData(rewardsData[i]);
			scrollView.addUIObject(group);
		}

		scrollView.AutoLayout();
		scrollView.MoveToTop();
	}
	
	public override void Update ()
	{
		base.Update ();

		scrollView.Update();
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lbSeparator.Draw();
		lbImageBg.Draw();
		lbItemIconBg1.Draw();
		lbItemIconBg2.Draw();
		lbItemIcon.Draw();
		lbItemName.Draw();
		lbItemCount.Draw();
		
		scrollView.Draw();

		lbFrameBg.Draw();
		lbFrameTitle.Draw();
	}

	protected override void DrawLastItem ()
	{
		base.DrawLastItem ();

		lbBannerBg.Draw();
		lbBannerIcon.Draw();
		lbBannerTitle.Draw();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollView.clearUIObject();
	}
}
