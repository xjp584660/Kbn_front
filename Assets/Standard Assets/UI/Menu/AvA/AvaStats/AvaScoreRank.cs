using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AvaScoreRank : UIObject
{
    public SimpleLabel userRank;
    public SimpleLabel userScore;

	public Label l_Bg;
	public Label l_ColumnTipsBg;

	public Label l_RankTip;
	public Label l_NameTip;
	public Label l_ScoreTip;

	public FullClickItem itemTemplate;
	public KBN.ScrollList scrollList;

	public SimpleButton btnRewards;

	public Input2Page page_navigator;

    private const int PAGESIZE = 10;

	public override void Init ()
	{
		base.Init ();

        userRank.txt = KBN.Datas.getArString("AVA.chrome_stats_yourownrank");
        userScore.txt = KBN.Datas.getArString("Campaign.ReportScore");

        InitTips();

        page_navigator.Init();
        page_navigator.pageChangedHandler = new System.Action<int>(pageIndexChanged);

		itemTemplate.Init();
		scrollList.Init(itemTemplate);

		btnRewards.Init();
		btnRewards.mystyle.normal.background = TextureMgr.singleton.LoadTexture("avareward_icon_item", TextureType.BUTTON);
		btnRewards.OnClick = new System.Action(OnBtnRewards);

        requestScoreRank(1);
	}

    private void InitTips()
    {
        l_RankTip.txt = KBN.Datas.getArString("AVA.chrome_stats_scoreranktab");
        l_NameTip.txt = KBN.Datas.getArString("Common.Name");
        l_ScoreTip.txt = KBN.Datas.getArString("AVA.chrome_stats_scoretab");
    }

	public override int Draw ()
	{
		base.Draw ();

        userRank.Draw();
        userScore.Draw();

		l_Bg.Draw();
		l_ColumnTipsBg.Draw();

		l_RankTip.Draw();
		l_NameTip.Draw();
		l_ScoreTip.Draw();

		scrollList.Draw();

		btnRewards.Draw();

		page_navigator.Draw();

		return -1;
	}

	public override void Update ()
	{
		base.Update ();

		scrollList.Update();
	}

	public override void OnPopOver ()
	{
		scrollList.Clear();

		base.OnPopOver ();
	}

    private void pageIndexChanged(int index)
    {
        requestScoreRank(index);
    }

    private void requestScoreRank(int index)
    {
        PBMsgReqAVA.PBMsgReqAVA request = constructScoreRankRequest(index);

        KBN.UnityNet.RequestForGPB("ava.php", request, OnGetScoreRankOK, null, false);
    }

    private PBMsgReqAVA.PBMsgReqAVA constructScoreRankRequest(int index)
    {
        PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 1;
        request.subcmd = 6;
        request.scoreRank = new PBMsgReqAVA.PBMsgReqAVA.ScoreRank();
        request.scoreRank.page = index;
        request.scoreRank.pageSize = PAGESIZE;

        return request;
    }

    private void OnGetScoreRankOK(byte[] data)
    {
        PBMsgAVAScoreRank.PBMsgAVAScoreRank scoreRank = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAScoreRank.PBMsgAVAScoreRank>(data);

        userRank.txt = KBN.Datas.getArString("AVA.chrome_stats_yourownrank") + scoreRank.userRank.ToString();
        userScore.txt = System.String.Format(KBN.Datas.getArString("Campaign.ReportScore"), scoreRank.userScore.ToString());

        scrollList.SetData(scoreRank.players);
        scrollList.ResetPos();

        int _total = scoreRank.totals;
        int _pageCount = Mathf.CeilToInt(System.Convert.ToSingle(_total) / System.Convert.ToSingle(PAGESIZE));
        int _curPage = scoreRank.page;
        if (_pageCount <= 0)
        {
            _pageCount = 0;
            _curPage = 0;
        }
        page_navigator.setPages(_curPage, _pageCount);

       // Debug.Log("[OnGetScoreRankOK]");
    }

	private void OnBtnRewards()
	{
		KBN.MenuMgr.instance.PushMenu("AvaRewardsPreview", null, "trans_zoomComp");
	}
}
