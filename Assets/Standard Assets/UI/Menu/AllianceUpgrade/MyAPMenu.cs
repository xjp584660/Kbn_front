using UnityEngine;
using KBN;
class MyAPMenu : PopMenu
{
	[SerializeField] private Button claimBtn;
	[SerializeField] private FlowerFrameItem myAp;
	[SerializeField] private FlowerFrameItem allianceAp;
	[SerializeField] private FlowerFrameItem alliesAp;

	[SerializeField] private SimpleLabel pointIcon1;
	[SerializeField] private SimpleLabel pointDesc1;
	[SerializeField] private SimpleLabel pointIcon2;
	[SerializeField] private SimpleLabel pointDesc2;

	[SerializeField] private SimpleLabel bottomDesc;
	[SerializeField] private SimpleLabel bottomDescBack;
	[SerializeField] private SimpleLabel bottomIcon;
	public override void Init()
	{
		base.Init();
		title.txt = Datas.getArString("Alliance.moreap_myloyaltypointstitle");

		myAp.Init ();
		myAp.SetIcon ("HP_icon", TextureType.DECORATION);
		myAp.title = Datas.getArString ("Alliance.moreap_myloyaltypoints");
		myAp.desc = Datas.getArString("Alliance.moreap_myloyaltypointsdesc");

		allianceAp.Init ();
		allianceAp.SetIcon ("AP_icon", TextureType.DECORATION);
		allianceAp.title = Datas.getArString ("Alliance.moreap_alliancepoints");
		allianceAp.desc = Datas.getArString("Alliance.moreap_alliancepointsdesc");

		alliesAp.Init ();
		alliesAp.SetIcon ("button_icon_Allise", TextureType.BUTTON);
		alliesAp.title = Datas.getArString ("Alliance.moreap_loyaltypointsfrommyallies");
		alliesAp.desc = Datas.getArString("Alliance.moreap_loyaltypointsfrommyalliesdesc");

		claimBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		claimBtn.txt = Datas.getArString ("Alliance.moreap_claimbtn");
		claimBtn.OnClick = new System.Action(handleClick);

		pointIcon1.useTile = true;
		pointIcon1.tile = TextureMgr.instance().IconSpt().GetTile("Multi_city_icon_Green");
		pointDesc1.txt = string.Format(Datas.getArString("Alliance.moreap_rewardreport"), 0);

		pointIcon2.useTile = true;
		pointIcon2.tile = TextureMgr.instance().IconSpt().GetTile("Multi_city_icon_Green");
		pointDesc2.txt = string.Format(Datas.getArString("Alliance.moreap_rewardreport"), 0);

		bottomDesc.txt = Datas.getArString ("Alliance.moreap_unclaimLPreport");
		bottomDescBack.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("Brown_Gradients2", TextureType.DECORATION);
		bottomIcon.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("HP_icon", TextureType.DECORATION);

		GameMain.Ava.Alliance.OnEapChanged += OnEapChanged;
	}

	protected override void DrawItem()
	{
		myAp.Draw();
		allianceAp.Draw();
		alliesAp.Draw();

		pointIcon1.Draw();
		pointDesc1.Draw();
		pointIcon2.Draw();
		pointDesc2.Draw();

		bottomDescBack.Draw();
		bottomDesc.Draw();
		bottomIcon.Draw();

		claimBtn.Draw();
	}

	public override void Update() 
	{
	}

	public override void OnPush(object param)
	{
		RefreshMenu ();
	}

	private void RefreshMenu()
	{
		myAp.title = Datas.getArString("Alliance.moreap_myloyaltypoints") + GameMain.Ava.Player.ExpendablePoint;
		allianceAp.title = Datas.getArString("Alliance.moreap_alliancepoints") + GameMain.Ava.Alliance.ExpendablePoint;
		
		pointDesc1.txt = string.Format(Datas.getArString("Alliance.moreap_rewardreport"), GameMain.Ava.Player.SelfPurchaseAp);
		pointDesc2.txt = string.Format(Datas.getArString("Alliance.moreap_rewardbyalliesreport"), GameMain.Ava.Player.AlliesPurchaseAp);
		
		if (GameMain.Ava.Player.UnclaimedPoint>0) 
		{
			bottomDesc.txt = GameMain.Ava.Player.UnclaimedPoint + "";
			claimBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			claimBtn.SetNormalTxtColor(FontColor.Button_White);
			claimBtn.SetDisabled(false);
		}
		else
		{
			bottomDesc.txt = Datas.getArString ("Alliance.moreap_unclaimLPreport");
			claimBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			claimBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			claimBtn.SetDisabled(true);
		}
	}

	public override void OnPop()
	{
		base.OnPop();
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver ();

		GameMain.Ava.Alliance.OnEapChanged -= OnEapChanged;
	}

	public void handleClick()
	{
		int dPoint = GameMain.Ava.Player.UnclaimedPoint;
		AvaPlayer.OnClaimOk OkFunc = delegate ()
		{
			RefreshMenu();

			MenuMgr.instance.PushMessage(string.Format(Datas.getArString("Toaster.ClaimAP"),dPoint));
		};
		GameMain.Ava.Player.Claim (OkFunc);
	}

	private void OnEapChanged(long oldEap, long newEap)
	{
		RefreshMenu();
	}
}