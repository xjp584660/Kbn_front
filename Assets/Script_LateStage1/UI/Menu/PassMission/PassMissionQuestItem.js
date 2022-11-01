#pragma strict

public class PassMissionQuestItem extends ListItem
{
    public var bg : Label;
    public var questIcon : Label;
    public var questDes : Label;
    public var rewardIcon : Label;
    public var rewardCount : Label;
    public var refreshBtn : Button;
    public var claimBtn : Button;
    public var redPoint : Label;

    public var quest : PassMissionQuestDataAbstract;

    
    public function Init() : void
    {
        refreshBtn.Init();
        //gotoOrClaimBtn.changeToBlueNew();
        refreshBtn.OnClick = OnRefreshBtn;
        claimBtn.Init();
        claimBtn.OnClick = OnClaimBtn;
    }

    private function OnRefreshBtn(param : System.Object) : void
    {
        var comparedData : ComparedData = new ComparedData();
        comparedData.callBack = function()
        {
            PassMissionQuestManager.Instance().RefreshRandomQuest(quest.Id);
        };
        comparedData.msgTxt = Datas.getArString("PassMission.RefreshCaution");
        MenuMgr.getInstance().PushMenu("MigrateComparedDialog", comparedData , "trans_zoomComp");    
    }

    private function OnClaimBtn(param : System.Object) : void
    {
        PassMissionQuestManager.Instance().ClaimQuestReward(quest.Id);
    }

    public function ClaimedFixedQuestReward()
    {
        quest.RewardClaimed = true;
        claimBtn.changeToGreyNew();
        claimBtn.txt = Datas.getArString("PassMission.Claimed");
        redPoint.SetVisible(false);
    }
    
    public function SetRowData(rawData : System.Object)
    {
        quest = rawData as PassMissionQuestDataAbstract;
        questDes.txt = String.Format(Datas.getArString(quest.DesKey), quest.DoneCount, quest.RequestedCount);

        questIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(quest.IconName, TextureType.PASSMISSIONN);

        rewardCount.txt = "X " + quest.reward.ItemCount;

        // todo 根据刷新时间判断
        refreshBtn.SetVisible(quest.questType != PassMissionQuestType.FixedQuestType);
        refreshBtn.txt = Datas.getArString("PassMission.Refresh");
        claimBtn.txt = Datas.getArString("PassMission.Claim");
        claimBtn.SetDisabled(true);
        redPoint.SetVisible(false);
        if(quest.HasCompleted)
        {
            claimBtn.SetDisabled(false);
            claimBtn.changeToBlueNew();
            redPoint.SetVisible(true);
        }
        else
        {
            claimBtn.changeToGreyNew();
        }

        if(quest.RewardClaimed)
        {
            redPoint.SetVisible(false);
            claimBtn.changeToGreyNew();
            claimBtn.txt = Datas.getArString("PassMission.Claimed");
        }
    }
    
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }
        
        GUI.BeginGroup(rect);
        
        this.bg.Draw();
        this.questIcon.Draw();
        this.questDes.Draw();
        this.rewardIcon.Draw();
        this.rewardCount.Draw();
        this.refreshBtn.Draw();
        this.claimBtn.Draw();
        this.redPoint.Draw();

        GUI.EndGroup();
        return -1;
    }
}
