using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AvaResultMenu : KBNMenu, IEventHandler
{
    public enum AvaResultType
    {
        LastResult,
        CurrentResult,
        None
    }

    public SimpleLabel topFlag;
    public SimpleLabel topScore;

    public Rect frameRect;

    public SimpleLabel frameSimpleLabel;

    public SimpleLabel backImage;
    public SimpleLabel bottomLeftImage;
    public SimpleLabel bottomRightImage;
    public SimpleLabel topLeftImage;
    public SimpleLabel topRightImage;

    public SimpleLabel mask;

    public SimpleLabel scoreBg;
    public SimpleLabel scoreTitle;
    public SimpleLabel scoreVS;

	public SimpleLabel yourScore;

    public SimpleLabel yourEmblem;
    public SimpleLabel yourAllianceName;
    public SimpleLabel yourAllianceScore;
//    public SimpleLabel yourScoreChangeLabel;

    public SimpleLabel enemyEmblem;
    public SimpleLabel enemyAllianceName;
    public SimpleLabel enemyAllianceScore;
//    public SimpleLabel enemyScoreChangeLabel;

    public ToolBar toolBar;

    public Button btnBattleRank;

    #region ToolBar Index 1
	public AllianceIcon allianceIcon;
    public SimpleLabel allianceExp;
    public SimpleLabel eapIcon;
    public SimpleLabel eapTxt;
    public SimpleLabel hpIcon;
    public SimpleLabel hpTxt;

    public SimpleLabel lineSeperator;
	public SimpleLabel allianceRewardsBg;
	public ProgressBar allianceExpProgress;
	public SimpleLabel allianceExpProgressTxt;

    public KBN.ScrollList rewardList;
    public AvaRewardItem rewardItemTemplate;
    #endregion ToolBar Index 1

    #region ToolBar Index 2
    public SimpleLabel tipColumnBg;
    public SimpleLabel tipType;
    public SimpleLabel tipDead;
    public SimpleLabel tipBruise;
    public SimpleLabel tipHospital;

    public KBN.ScrollList troopReportList;
    public AvaTroopReportItem troopItemTemplate;
    #endregion ToolBar Index 2


    private int m_currentIndex = 0;
    private AvaResultType mCurType = AvaResultType.None;

    private const int UI_BG_WOOD_WEN_HEIGHT = 20;

    public override void Init()
    {
        base.Init();

        btnClose.Init();
        btnClose.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("AvaResultMenu");
        });
        btnClose.SetVisible(false);

        btnBattleRank.Init();
        btnBattleRank.txt = KBN.Datas.getArString("AVA.Combatresulttable_battlerank");
        btnBattleRank.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("AvaResultMenu");
            KBN.MenuMgr.instance.PushMenu("AvaLastRankMenu", null, "trans_zoomComp");
            if (mCurType == AvaResultType.CurrentResult)
            {
                ClaimAvaReward();
            }
        });

        InitFlag();
        InitImage();
        InitBackground();

        InitToolBar();

        InitInformation();

        InitIcon();

        InitScrollList();

        resetLayout();

        m_currentIndex = toolBar.selectedIndex;

        if (yourEmblem.image == null)
        {
            yourEmblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
        }
        if (enemyEmblem.image == null)
        {
            enemyEmblem.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
        }
    }

    private void InitFlag()
    {
        if (topFlag.mystyle.normal.background == null)
        {
			topFlag.mystyle.normal.background = TextureMgr.singleton.LoadTexture("win_flag_new", TextureType.DECORATION);
        }
    }

    private void InitImage()
    {
        if (mask.mystyle.normal.background == null)
        {
            mask.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.BACKGROUND);
        }

        frameSimpleLabel.Init();
        frameSimpleLabel.useTile = true;
        frameSimpleLabel.tile = TextureMgr.singleton.IconSpt().GetTile("popup1_transparent");

        if (backImage.mystyle.normal.background == null)
        {
            backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom", TextureType.BACKGROUND);
        }

        if (bottomLeftImage.mystyle.normal.background == null)
        {
            bottomLeftImage.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);
        }

        if (bottomRightImage.mystyle.normal.background == null)
        {
            bottomRightImage.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);
        }

        if (topLeftImage.mystyle.normal.background == null)
        {
			topLeftImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("trumpet_new", TextureType.DECORATION);
        }

        if (topRightImage.mystyle.normal.background == null)
        {
			topRightImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("trumpet_new", TextureType.DECORATION);
        }
		allianceExpProgress.Init();
		allianceExpProgress.setBackground("progress_bar_bottom",TextureType.DECORATION);
		allianceExpProgress.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);
    }

    private void InitBackground()
    {
        if (scoreBg.mystyle.normal.background == null)
        {
            scoreBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang", TextureType.DECORATION);
        }

        if (lineSeperator.mystyle.normal.background == null)
        {
            lineSeperator.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
        }
		allianceRewardsBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_chat_white1", TextureType.DECORATION);
    }

    private void InitToolBar()
    {
        toolBar.toolbarStrings = new string[] { KBN.Datas.getArString("AVA.Combatresulttable_resulttab"), KBN.Datas.getArString("AVA.Combatresulttable_troopsreportbtn") };
        toolBar.indexChangedFunc = new System.Action<int>(toolBarIndexChanged);
    }

    private void InitInformation()
    {
		scoreTitle.txt = KBN.Datas.getArString("AVA.Combatresulttable_alliancescoretitle");
        scoreVS.txt = "VS";
//        yourAllianceName.txt = KBN.Datas.getArString("AVA.Combatresulttable_youralliancescore");
//
//        enemyAllianceName.txt = KBN.Datas.getArString("AVA.Combatresulttable_enemyscore");
    }

    private void InitIcon()
    {
        if (eapIcon.mystyle.normal.background == null)
        {
            eapIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("AP_icon", TextureType.DECORATION);
        }

        if (hpIcon.mystyle.normal.background == null)
        {
            hpIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("HP_icon", TextureType.DECORATION);
        }
		allianceIcon.Init();
    }

    private void InitScrollList()
    {
        rewardItemTemplate.Init();
        rewardList.Init(rewardItemTemplate);
        rewardList.itemDelegate = this;

        if (tipColumnBg.mystyle.normal.background == null)
        {
            tipColumnBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        }
        tipType.txt = KBN.Datas.getArString("Common.Troops");
        tipDead.txt = KBN.Datas.getArString("Common.Fought");
        tipBruise.txt = KBN.Datas.getArString("Common.Survived");
        tipHospital.txt = KBN.Datas.getArString("Common.Injured");

        troopItemTemplate.Init();
        troopReportList.Init(troopItemTemplate);
        troopReportList.itemDelegate = this;
    }

    public void resetLayout()
    {
        repeatTimes = System.Convert.ToInt32((frameRect.height - 15) / UI_BG_WOOD_WEN_HEIGHT);
        frameSimpleLabel.rect.Set(frameRect.x, frameRect.y, frameRect.width, frameRect.height - 3);
    }

    private void toolBarIndexChanged(int index)
    {
        m_currentIndex = index;
    }

    protected override void DrawBackground()
    {
        GUI.BeginGroup(frameRect);
        backImage.rect.Set(13, 13, frameRect.width-26, frameRect.height-26);
        backImage.Draw();
        GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
        GUI.DrawTextureWithTexCoords(new Rect(frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
        GUI.EndGroup();

        frameSimpleLabel.Draw();

        bottomLeftImage.Draw();
        bottomRightImage.Draw();

        topLeftImage.Draw();
        topRightImage.Draw();

        topFlag.Draw();

    }

    protected override void DrawTitle()
    {
        title.Draw();
        topScore.Draw();
    }

    protected override void DrawItem()
    {
        scoreBg.Draw();
        scoreTitle.Draw();
        scoreVS.Draw();
		yourScore.Draw ();

        yourEmblem.Draw();
        yourAllianceName.Draw();
        yourAllianceScore.Draw();
//        yourScoreChangeLabel.Draw();

        enemyEmblem.Draw();
        enemyAllianceName.Draw();
        enemyAllianceScore.Draw();
//        enemyScoreChangeLabel.Draw();

        btnClose.Draw();

        toolBar.Draw();

        btnBattleRank.Draw();

        if (m_currentIndex == 0)
        {
            pri_DrawReward();
        } 
        else if (m_currentIndex == 1)
        {
            pri_DrawTroopReport();
        }
    }

    public override void DrawMask()
    {
        Color _originColor = GUI.color;
        GUI.color = new Color(0, 0, 0, 0.5f);
        mask.Draw();
        GUI.color = _originColor;
    }

    private void pri_DrawReward()
    {
		allianceRewardsBg.Draw ();
        allianceExp.Draw();
		allianceExpProgress.Draw ();
		allianceExpProgressTxt.Draw ();
        eapIcon.Draw();
        eapTxt.Draw();

        hpIcon.Draw();
        hpTxt.Draw();
		allianceIcon.Draw ();
        lineSeperator.Draw();
        rewardList.Draw();
    }

    private void pri_DrawTroopReport()
    {
        tipColumnBg.Draw();
        tipType.Draw();
        tipDead.Draw();
        tipBruise.Draw();
        tipHospital.Draw();

        troopReportList.Draw();
    }

    public override void Update()
    {
        base.Update();

        if (m_currentIndex == 0)
        {
            rewardList.Update();
        } 
        else if (m_currentIndex == 1)
        {
            troopReportList.Update();
        }
    }

    public override void OnPush(object param)
    {
        base.OnPush(param);

        HashObject _param = (HashObject)param;
        mCurType = (AvaResultMenu.AvaResultType)(_param["type"].Value);
        byte[] data = (byte[])(_param["data"].Value);
        pri_setUIData(data);
    }

    public override void OnPushOver()
    {
        base.OnPushOver();

//        CoroutineMgr.Run(AnimationScore());
//        StartCoroutine(AnimationScore());
    }

    public override void OnPopOver()
    {
        base.OnPopOver();

//        frameSimpleLabel.mystyle.normal.background = null;
//
//        backImage.mystyle.normal.background = null;
//        bottomLeftImage.mystyle.normal.background = null;
//        bottomRightImage.mystyle.normal.background = null;
//        topLeftImage.mystyle.normal.background = null;
//        topRightImage.mystyle.normal.background = null;
//
//        topFlag.mystyle.normal.background = null;
//
//        scoreBg.mystyle.normal.background = null;
//
//        lineSeperator.mystyle.normal.background = null;
//
//        tipColumnBg.mystyle.normal.background = null;

        rewardList.Clear();

        troopReportList.Clear();

//        CoroutineMgr.Stop(AnimationScore());
//        StopCoroutine(AnimationScore());

//        topFlag.mystyle.normal.background = null;
    }

    public void handleItemAction(string action, object param)
    {
    }

    public static void requestAvaResult(AvaResultType resultType, KBN.OKHandler okFunc)
    {
        PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 1;
        request.subcmd = 7;
        request.avaResult = new PBMsgReqAVA.PBMsgReqAVA.AvAResult();
        request.avaResult.previous = (resultType == AvaResultType.LastResult ? 1 : 0);

        KBN.UnityNet.RequestForGPB("ava.php", request, okFunc, null, false);
    }

    private void pri_setUIData(byte[] data)
    {
        if (data != null)
        {
            PBMsgAVAResult.PBMsgAVAResult result = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAResult.PBMsgAVAResult>(data);
            
            SetTitleInformation(result);
            SetAllianceInformation(result);
            
            SetRewardData(result);
            SetTroopReportData(result);
        }
        else
        {
            KBN.MenuMgr.instance.PopMenu("AvaResultMenu");
        }
    }

    private void SetTitleInformation(PBMsgAVAResult.PBMsgAVAResult result)
    {
        if (result.winOrLost == 1) // win
        {
            title.txt = KBN.Datas.getArString("Campaign.Report_Win");
        }
        else if (result.winOrLost == 0) // lose
        {
            title.txt = KBN.Datas.getArString("Campaign.Report_Lose");
        }
		yourScore.txt = KBN.Datas.getArString("AVA.Combatresulttable_yourscore") + result.userScore.ToString();
    }

    private void SetAllianceInformation(PBMsgAVAResult.PBMsgAVAResult result)
    {
        PBMsgAVAResult.PBMsgAVAResult.AllianceScore yourScore = null;
        PBMsgAVAResult.PBMsgAVAResult.AllianceScore enemyScore = null;
		allianceIcon.txt = KBN.GameMain.Ava.Alliance.Level+"";
		if(result == null || result.alliances == null)
		{
			enemyAllianceName.txt = "---";
			enemyAllianceScore.txt = "---";
			//            enemyScoreChangeLabel.SetVisible(false);
			_animateEnemyScore = false;
			return;
		}

        for (int i = 0; i < result.alliances.Count; ++i)
        {
            if ((result.alliances[i].allianceId == KBN.Alliance.singleton.MyAllianceId()) &&
                (result.alliances[i].serverId == KBN.Datas.singleton.worldid()))
            {
                if (yourScore == null)
                {
                    yourScore = result.alliances[i];
                }
                else
                {
                    Debug.LogWarning("Duplicate player's score");
                }
            }
            else
            {
                if (enemyScore == null)
                {
                    enemyScore = result.alliances[i];
                }
                else
                {
                    Debug.LogWarning("Duplicate enemy's score");
                }
            }
        }
		if(yourScore == null)
		{
			enemyAllianceName.txt = "---";
			enemyAllianceScore.txt = "---";
			//            enemyScoreChangeLabel.SetVisible(false);
			_animateEnemyScore = false;
			return;
		}


		long scoreDiff = yourScore.score - yourScore.initScore;
		if(scoreDiff >= 0)
		{
			topScore.txt = KBN.Datas.getArString("AVA.lastAVArank_score") + " +" + scoreDiff.ToString();
		}
		else
		{
			topScore.txt = KBN.Datas.getArString("AVA.lastAVArank_score") + scoreDiff.ToString();
		}
        topScore.SetVisible(KBN._Global.INT32(KBN.GameMain.Ava.Event.CurAvaType) == 0);

        _yourScoreChange = 0;
        _enemyScoreChange = 0;

        if (yourScore != null)
        {
            yourAllianceName.txt = yourScore.allianceName;

            if (mCurType == AvaResultType.CurrentResult)
            {
                _yourScore = yourScore.initScore;
                _yourScoreChange = yourScore.score - yourScore.initScore;
				yourAllianceScore.txt = yourScore.avaScore.ToString();  //_yourScore.ToString();
//                yourScoreChangeLabel.txt = (result.winOrLost == 1) ? "+" + _yourScoreChange.ToString() : _yourScoreChange.ToString();
//                yourScoreChangeLabel.SetNormalTxtColor((result.winOrLost == 1) ? FontColor.Green : FontColor.Red);
//                yourScoreChangeLabel.SetVisible(false);
                _animateYourScore = true;
            }
            else if (mCurType == AvaResultType.LastResult)
            {
				yourAllianceScore.txt = yourScore.avaScore.ToString();
//                yourScoreChangeLabel.SetVisible(false);
                _animateYourScore = false;
            }
        }
        else
        {
            yourAllianceName.txt = "---";
            yourAllianceScore.txt = "---";
//            yourScoreChangeLabel.SetVisible(false);
            _animateYourScore = false;
        }

        if (enemyScore != null)
        {
            enemyAllianceName.txt = enemyScore.allianceName;
            enemyAllianceScore.txt = enemyScore.score.ToString();

            if (mCurType == AvaResultType.CurrentResult)
            {
                _enemyScore = enemyScore.initScore;
                _enemyScoreChange = enemyScore.score - enemyScore.initScore;
				enemyAllianceScore.txt = enemyScore.avaScore.ToString();
//                enemyScoreChangeLabel.txt = (result.winOrLost == 0) ? "+" + _enemyScoreChange.ToString() : _enemyScoreChange.ToString();
//                enemyScoreChangeLabel.SetNormalTxtColor((result.winOrLost == 0) ? FontColor.Green : FontColor.Red);
//                enemyScoreChangeLabel.SetVisible(false);
                _animateEnemyScore = true;
            }
            else if (mCurType == AvaResultType.LastResult)
            {
                enemyAllianceScore.txt = enemyScore.avaScore.ToString();
//                enemyScoreChangeLabel.SetVisible(false);
                _animateEnemyScore = false;
            }
        }
        else
        {
            enemyAllianceName.txt = "---";
            enemyAllianceScore.txt = "---";
//            enemyScoreChangeLabel.SetVisible(false);
            _animateEnemyScore = false;
        }
    }

    private void SetRewardData(PBMsgAVAResult.PBMsgAVAResult result)
    {
        allianceExp.txt = KBN.Datas.getArString("AVA.Combatresulttable_allianceEXP") + " +" + result.allianceGainedEAP;
        
        eapTxt.txt = KBN.Datas.getArString("AVA.Combatresulttable_EXP") + " +" + result.allianceGainedEAP.ToString();
        hpTxt.txt = KBN.Datas.getArString("AVA.Combatresulttable_HP") + " +" + result.userGainedEAP.ToString();

		allianceExpProgress.SetCurValue ((float)result.allianceEXP/(float)result.allianceEXPNext);
		allianceExpProgressTxt.txt = result.allianceEXP.ToString () + "/" + result.allianceEXPNext.ToString ();
        if (mCurType == AvaResultType.CurrentResult)
        {
            KBN.GameMain.Ava.Alliance.ExpendablePoint += System.Convert.ToInt64(result.allianceGainedEAP);
            KBN.GameMain.Ava.Player.ExpendablePoint += result.userGainedEAP;
        }

        rewardList.SetData(result.rewards);
        rewardList.ResetPos();
    }

    private void SetTroopReportData(PBMsgAVAResult.PBMsgAVAResult result)
    {
        troopReportList.SetData(result.troops);
        troopReportList.ResetPos();
    }

    #region animation
    private long _yourScore = 0;
    private long _enemyScore = 0;
    private long _yourScoreChange = 0;
    private long _enemyScoreChange = 0;
    private bool _animateYourScore = false;
    private bool _animateEnemyScore = false;

	IEnumerator AnimationScore_deprecate()
	{
//        if (_animateYourScore)
//        {
//            yourScoreChangeLabel.rect = new Rect(145, 350, 150, 25);
//            yourScoreChangeLabel.SetVisible(true);
//        }
//
//        if (_animateEnemyScore)
//        {
//            enemyScoreChangeLabel.rect = new Rect(414, 350, 150, 25);
//            enemyScoreChangeLabel.SetVisible(true);
//        }
        yield return new WaitForSeconds(0.25f);

        if (_animateYourScore)
        {
            Color _color = yourAllianceScore.GetColor();
            _color.a = 0;
            yourAllianceScore.SetColor(_color);
            yourAllianceScore.SetVisible(true);
        }

        if (_animateEnemyScore)
        {
            Color _color = enemyAllianceScore.GetColor();
            _color.a = 0;
            enemyAllianceScore.SetColor(_color);
            enemyAllianceScore.SetVisible(true);
        }

        float elapsedTime = 0;
        while (elapsedTime < 0.5f)
        {
            float deltaTime = Time.deltaTime;
            if (deltaTime + elapsedTime > 0.5f)
            {
                elapsedTime = 0.5f;
            }
            else
            {
                elapsedTime += deltaTime;
            }

//            if (_animateYourScore)
//            {
//                yourScoreChangeLabel.rect = new Rect(145, 350 + 20 * 2 * elapsedTime, 150, 25);
//            }
//            if (_animateEnemyScore)
//            {
//                enemyScoreChangeLabel.rect = new Rect(414, 350 + 20 * 2 * elapsedTime, 150, 25);
//            }

            yield return null;
        }

        yield return new WaitForSeconds(0.25f);

        elapsedTime = 0;
        Color _yourScoreColor = yourAllianceScore.GetColor();
        Color _enemyScoreColor = enemyAllianceScore.GetColor();
        while (elapsedTime < 0.5f)
        {
            float deltaTime = Time.deltaTime;
            if (deltaTime + elapsedTime > 0.5f)
            {
                elapsedTime = 0.5f;
            }
            else
            {
                elapsedTime += deltaTime;
            }

            if (_animateYourScore)
            {
                _yourScoreColor.a = 2 * elapsedTime;
                yourAllianceScore.SetColor(_yourScoreColor);
            }

            if (_animateEnemyScore)
            {
                _enemyScoreColor.a = 2 * elapsedTime;
                enemyAllianceScore.SetColor(_enemyScoreColor);
            }

            yield return null;
        }

        int _yourScoreIncr = 0;
        int _enemyScoreIncr = 0;
        int _yourScoreIncrStep = _yourScoreChange > 0 ? 1 : -1;
        int _enemyScoreIncrStep = _enemyScoreChange > 0 ? 1 : -1;
        while (_yourScoreChange != 0 || _enemyScoreChange != 0)
        {
            if (_yourScoreChange != 0)
            {
                _yourScoreChange -= _yourScoreIncrStep;
                _yourScore += _yourScoreIncrStep;
                yourAllianceScore.txt = _yourScore.ToString();
            }

            if (_enemyScoreChange != 0)
            {
                _enemyScoreChange -= _enemyScoreIncrStep;
                _enemyScore += _enemyScoreIncrStep;
                enemyAllianceScore.txt = _enemyScore.ToString();
            }

            yield return null;
        }

//        if (_animateYourScore)
//        {
//            yourScoreChangeLabel.SetVisible(false);
//        }
//
//        if (_animateEnemyScore)
//        {
//            enemyScoreChangeLabel.SetVisible(false);
//        }
    }
    #endregion animation

    #region Claim Ava 
    private void ClaimAvaReward()
    {
        PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 1;
        request.subcmd = 8;
        
        KBN.UnityNet.RequestForGPB("ava.php", request, OnClaimAvaRewardOK, null, true);

        // set the has ava reward flag to false after requesting reward
        KBN.GameMain.singleton.HasAvAReward = false;
    }

    private void OnClaimAvaRewardOK(byte[] data)
    {
        PBMsgAVAReward.PBMsgAVAReward reward = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAReward.PBMsgAVAReward>(data);
        int cnt = reward.items.Count;
        for (int i = 0; i < cnt; ++i)
        {
            KBN.MyItems.singleton.AddItemWithCheckDropGear(reward.items[i].itemId, reward.items[i].itemCount);
        }

        KBN._Global.Log("[OnClaimAvaRewardOK]");
    }
    #endregion Claim Ava
}
