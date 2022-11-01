using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

public class AvaRallyAttackDetail : UIObject
{
    [SerializeField]
    private SimpleButton btnBack;
    [SerializeField]
    private SimpleButton btnTarget;
    [SerializeField]
    private SimpleLabel lbCount;
    [SerializeField]
    private SimpleButton btnJoin;

    [SerializeField]
    private SimpleLabel lbLeaveTime;

    [SerializeField]
    private ProgressBar progressBar;
    [SerializeField]
    private SimpleLabel lbTime;

    [SerializeField]
    private SimpleLabel lbSeparator;

    [SerializeField]
    private ScrollView scrollView;

    [SerializeField]
    private AvaRallyAttackListItem listItem;

    public Action OnGoBack { get; set; }

    private AvaRallyDetailInfo cachedData;

    public override void Init()
    {
        base.Init();
        
        btnBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_back2_normal", TextureType.BUTTON);
        btnBack.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_back2_down", TextureType.BUTTON);
        btnBack.OnClick = new Action(OnBackButton);

        btnJoin.txt = Datas.getArString("Common.HeroJoinButton");
        btnJoin.OnClick = new Action<object>(OnClickJoin);

        lbLeaveTime.txt = Datas.getArString("AVA.coop_ralllyinfo_marchsetouttime");

        progressBar.setBackground("progress_bar_bottom", TextureType.DECORATION);
        progressBar.thumb.setBackground("payment_Progressbar_Orange", TextureType.DECORATION);
        progressBar.Init();

        lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);

        scrollView.Init();
    }

    public override int Draw()
    {
        if (!visible)
            return -1;

        GUI.BeginGroup(rect);
        btnBack.Draw();
        btnTarget.Draw();
        lbCount.Draw();
        btnJoin.Draw();
        lbLeaveTime.Draw();

        progressBar.Draw();
        lbTime.Draw();
        
        lbSeparator.Draw();

        scrollView.Draw();
        GUI.EndGroup();

        return -1;
    }

    public override void Update()
    {
        base.Update();

        scrollView.Update();
        UpdateProgress();
    }

    private float progressLastUpdateTime = 0f;
    public const float progressUpdatePeriod = .5f;

    private void UpdateProgress()
    {
        if (Time.time - progressLastUpdateTime < progressUpdatePeriod)
        {
            return;
        }

        progressLastUpdateTime = Time.time;
        var curTime = GameMain.unixtime();
        var timeLeft = cachedData.LeavingTime - curTime;

        float progress = 1f;

        if (timeLeft >= 0)
        {
            lbLeaveTime.txt = Datas.getArString("AVA.coop_ralllyinfo_marchsetouttime");
            if (cachedData.WaitingDuration != 0)
            {
                progress = 1f - ((float)timeLeft) / cachedData.WaitingDuration;
            }
        }
        else
        {
            timeLeft = cachedData.BattleTime - curTime;
            timeLeft = timeLeft > 0 ? timeLeft : 0;
            lbLeaveTime.txt = Datas.getArString("AVA.Coop_MarchArriveIn");
            if (cachedData.OrigMarchDuration != 0)
            {
                progress = 1f - ((float)timeLeft) / cachedData.OrigMarchDuration;
            }
        }

        progressBar.SetCurValue(progress);

        lbTime.txt = _Global.timeFormatStr(timeLeft);
    }
    
    public override void SetUIData(object data)
    {
        base.SetUIData(data);
        SetUIDataInternal(data, true);
    }

    private void SetUIDataInternal(object data, bool moveToTop)
    {
        cachedData = data as AvaRallyDetailInfo;

        string targetDesc = Datas.GetFormattedString("AVA.coop_ralllyinfo_rallyattackbufftitlecoodinate", cachedData.TargetTileTypeName);
        btnTarget.txt = string.Format("{2} <color={3}>({0},{1})</color>", cachedData.TargetCoordX, cachedData.TargetCoordY, targetDesc,
                                      _Global.FontColorEnumToString(FontColor.Blue));

        btnTarget.OnClick = new Action<object>(OnTargetButton);
        lbCount.txt = string.Format("{0} ({1}/{2})",
                                    Datas.getArString("AVA.coop_ralllyinfo_marchslots"),
                                    cachedData.CurMarchSlotCnt, cachedData.MaxMarchSlotCnt);

        SetJoinButton();
        scrollView.clearUIObject();

        for (int i = 0; i < cachedData.Count; i++) {
            AvaRallyAttackListItem item = Instantiate(listItem) as AvaRallyAttackListItem;
            item.Init();
            item.SetRowData(cachedData[i]);
            scrollView.addUIObject(item);
        }

        scrollView.AutoLayout();
        if (moveToTop)
        {
            scrollView.MoveToTop();
        }
        UpdateProgress();

        //_Global.LogWarning(string.Format("leaveTime: {0}, arriveTime: {1}, oneWaySecond: {2}", cachedData.LeavingTime, cachedData.BattleTime, cachedData.OrigMarchDuration));
    }

    public override void OnPopOver()
    {
        base.OnPopOver();

        scrollView.clearUIObject();
    }

    private void OnBackButton()
    {
        if (null != OnGoBack)
            OnGoBack();
    }

    private void SetJoinButton()
    {
        if (cachedData.IsStartedByMe)
        {
            btnJoin.SetVisible(false);
        }
        else
        {
            btnJoin.SetVisible(true);

            if (cachedData.HasLeft || cachedData.IsSupportedByMe || cachedData.CurMarchSlotCnt >= cachedData.MaxMarchSlotCnt)
            {
                btnJoin.EnableBlueButton(false);
            }
            else
            {
                btnJoin.EnableBlueButton(true);
            }
        }
    }

    private void OnClickJoin(object param)
    {
        // MenuMgr.instance.PushMenu("MarchMenu", new Hashtable
        // {
        //     { "x", this.cachedData.StarterCoordX },
        //     { "y", this.cachedData.StarterCoordY },
        //     { "ava", 1 },
        //     { "type", Constant.AvaMarchType.RALLYREINFORCE },
        //     { "rallyAttackId", this.cachedData.Id },
        // }, "trans_zoomComp");
        KBN.GameMain.singleton.SetMarchData(
            new Hashtable
            {
                { "x", this.cachedData.StarterCoordX },
                { "y", this.cachedData.StarterCoordY },
                { "ava", 1 },
                { "type", Constant.AvaMarchType.RALLYREINFORCE },
                { "rallyAttackId", this.cachedData.Id },
            }
        );
    }

    private void OnTargetButton(object param)
    {
        if (MenuMgr.instance.hasMenuByName("AvaMainChrome"))
        {
            MenuMgr.instance.pop2Menu("AvaMainChrome");
        }
        GameMain.singleton.setSearchedTileToHighlight2(cachedData.TargetCoordX, cachedData.TargetCoordY);
        GameMain.singleton.gotoMap2(cachedData.TargetCoordX, cachedData.TargetCoordY);
    }

    public void HandleNotification(string type, object body)
    {
        switch (type)
        {
        case Constant.Notice.AvaUseSpeedUpItemOk:
            var speedUpData = body as AvaSpeedUp.AvaSpeedUpData;
            OnSpeedUpOk(speedUpData);
            break;
        case Constant.Notice.AvaGetMarchListOK:
            OnTryJoinRallyOk();
            break;
        case Constant.Notice.AvaCoopRallyDetailRefreshed:
            RefreshUI();
            break;
        }
    }

    private void OnTryJoinRallyOk()
    {
        GameMain.Ava.RallyShare.RefreshRallyDetailInfo(cachedData.Id);
    }

    private void RefreshUI()
    {
        if (GameMain.Ava.RallyShare.CurrentDetail == null)
        {
            // TODO: Better error handling if needed.
            return;
        }

        this.SetUIDataInternal(GameMain.Ava.RallyShare.CurrentDetail, false);
    }

    private void OnSpeedUpOk(AvaSpeedUp.AvaSpeedUpData speedUpData)
    {
        if (speedUpData == null || speedUpData.type != Constant.AvaSpeedUpType.AvaMarchSpeedUp)
        {
            return;
        }

        foreach (var player in cachedData.Players)
        {
            if (player.MarchId == speedUpData.id)
            {
                player.ArrivalTime = speedUpData.endTime;
                break;
            }
        }
    }
}
