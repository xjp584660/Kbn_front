#pragma strict

public class EventInfoSpendNGet extends UIObject
{
    @SerializeField
    private var iconLabel : SimpleLabel;
    @SerializeField
    private var nameLabel : SimpleLabel;
    @SerializeField
    private var descLabel : SimpleLabel;
    @SerializeField
    private var timerLabel : SimpleLabel;
    @SerializeField
    private var helpBtn : Button;
    @SerializeField
    private var progressComponent : GameEventSpendNGetProgressComponent;
    @SerializeField
    private var scrollView : ScrollView;
    @SerializeField
    private var rewardTip : Label;
        
    @SerializeField
    private var perMilestoneRewardTemplate : GameEventSpendNGetRewardItem;
    
    @SerializeField
    private var timerLabelFormat : String = "{0} <color={1}>{2}</color>";
    @SerializeField
    private var scrollViewTopMargin : float = 5f;
    
    private var nc : NavigatorController;
    private var data : GameEventDetailInfoSpendNGet;
    private var updateHelper : TimeBasedUpdateHelper;
    private var timeColorCode : String;
    
    public function Init(nc : NavigatorController)
    {
        resetNC(nc);
        progressComponent.Init();
        scrollView.Init();
        rewardTip.txt = Datas.getArString("SpendCurrency.RewardDesc");
        timeColorCode = _Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Red));
        InitHelpButton();
        InitLayout();
    }
    
    public function Update() : void
    {
        if (updateHelper != null)
        {
            updateHelper.Update();
        }
        
        scrollView.Update();
    }
    
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }
        GUI.BeginGroup(rect);
        iconLabel.Draw();
        nameLabel.Draw();
        descLabel.Draw();
        timerLabel.Draw();
        progressComponent.Draw();
        scrollView.Draw();
        helpBtn.Draw();
        GUI.EndGroup();
        return -1;
    }
    
    public function Clear() : void
    {
        scrollView.clearUIObject();
        progressComponent.Clear();
    }
    
    public function resetNC(nc : NavigatorController)
    {
        this.nc = nc;
    }
    
    public function SetData(mainData : HashObject, detailInfo : HashObject)
    {
        data = new GameEventDetailInfoSpendNGet(mainData, detailInfo);
        iconLabel.tile = TextureMgr.instance().ItemSpt().GetTile(data.ImageName);
        nameLabel.txt = data.Name;
        timerLabel.txt = String.Empty;
        descLabel.txt = data.Desc1;
        InitUpdateHelper();
        progressComponent.SetData(data);
        SetScrollViewData();
        nc.popedFunc = OnPopOver;
    }

    private function InitHelpButton() : void
    {
        helpBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i", TextureType.DECORATION);
        helpBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("icon_down", TextureType.BUTTON);
        helpBtn.OnClick = OnHelp;
    }
    
    private function OnHelp(param : System.Object) : void
    {
        MenuMgr.getInstance().PushMenu("EventRulesMenu", data.Desc2, "trans_zoomComp");
    }
    
    private function InitLayout() : void
    {
        scrollView.rect.y = progressComponent.rect.yMax + scrollViewTopMargin;
        scrollView.rect.height = this.rect.yMax - scrollView.rect.y;
    }
    
    private function SetScrollViewData() : void
    {
        scrollView.clearUIObject();
        scrollView.addUIObject(rewardTip);
        
        for (var i : int = 0; i < data.Milestones.Count; ++i)
        {
            var item : GameEventSpendNGetRewardItem = Instantiate(perMilestoneRewardTemplate) as GameEventSpendNGetRewardItem;
            item.Init();
            item.SetRowData({"eventId": data.Id, "milestone": data.Milestones[i]});
            scrollView.addUIObject(item);
        }
        
        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }
    
    private function OnPopOver(nc : NavigatorController, uiObj : UIObject)
    {
        Clear();
        nc.popedFunc = null;
    }
    
    private function InitUpdateHelper()
    {
        var timePoints : long[] = [data.StartTime, data.EndTime, data.RewardEndTime];
        var initMethods : System.Action.<long>[] = [
            new System.Action.<long>(InitForUpdateBeforeStart),
            new System.Action.<long>(InitForUpdateEventOngoing),
            new System.Action.<long>(InitForUpdateRewardTime),
            new System.Action.<long>(InitForUpdateRewardEnd)
            ];
        var updateMethods : System.Action.<long>[] = [
            new System.Action.<long>(UpdateBeforeStart),
            new System.Action.<long>(UpdateEventOngoing),
            new System.Action.<long>(UpdateRewardTime),
            new System.Action.<long>(UpdateRewardEnd)
            ];
        updateHelper = new TimeBasedUpdateHelper(timePoints, initMethods, updateMethods);
    }
    
    private function InitForUpdateBeforeStart(curTime : long)
    {
        // Empty
    }
    
    private function UpdateBeforeStart(curTime : long)
    {
        timerLabel.txt = String.Format(timerLabelFormat,
            Datas.getArString("EventCenter.StartsIn"), 
            timeColorCode, _Global.timeFormatShortStr(data.StartTime - curTime,true));
    }
    
    private function InitForUpdateEventOngoing(curTime : long)
    {
        // Empty
    }
    
    private function UpdateEventOngoing(curTime : long)
    {
        timerLabel.txt = String.Format(timerLabelFormat,
            Datas.getArString("EventCenter.EndsIn"), 
            timeColorCode, _Global.timeFormatShortStr(data.EndTime - curTime,true));
    }
    
    private function InitForUpdateRewardTime(curTime : long)
    {
        // Empty
    }
    
    private function UpdateRewardTime(curTime : long)
    {
        switch (data.PrizeStatus)
        {
        case Constant.EventCenter.PrizeStatus.NOPRIZE:
            if(data.Status == Constant.EventCenter.PRIZEOPEN)
            {
                timerLabel.txt  = Datas.getArString("EventCenter.NoPrize");
            }
            else
            {
                timerLabel.txt  = Datas.getArString("EventCenter.ProcessingResults");
            }
            break;
        case Constant.EventCenter.PrizeStatus.PRIZE:
            timerLabel.txt = String.Format(timerLabelFormat,
                Datas.getArString("EventCenter.WonPrize"), 
                timeColorCode, _Global.timeFormatShortStr(data.RewardEndTime - curTime,true));
            break;
        case Constant.EventCenter.PrizeStatus.HAVEGOTPRIZE:
            timerLabel.txt = Datas.getArString("EventCenter.AlreadyClaimed");
            break;
        default:
            break;
        }
    }
    
    private function InitForUpdateRewardEnd(curTime : long)
    {
        // Empty
    }
    
    private function UpdateRewardEnd()
    {
        this.SetVisible(false);
    }
}