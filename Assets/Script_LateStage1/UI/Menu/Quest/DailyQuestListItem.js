#pragma strict

public class DailyQuestListItem extends ListItem
{
    @SerializeField
    private var questIcon : Label;
    @SerializeField
    private var iconBg : SimpleLabel;
    @SerializeField
    private var completeRibbon : SimpleLabel;
    @SerializeField
    private var descLabel : SimpleLabel;
    @SerializeField
    private var rewardLabel : SimpleLabel;
    @SerializeField
    private var rewardBg : SimpleLabel;
    @SerializeField
    private var gotoOrClaimBtn : Button;
    @SerializeField
    private var splitLine : SimpleLabel;
    
    @SerializeField
    private var rewardIconRect : Rect;
    @SerializeField
    private var rewardCountRect : Rect;
    @SerializeField
    private var rewardCountMarginFromIcon : int;

    @SerializeField
    private var rewardBgXOffset : int;
    @SerializeField
    private var progressColorType : FontColor;
    @SerializeField
    private var rewardBgXMax : int;
    @SerializeField
    private var iconOffsetRatio : float;
    
    private var rewardIcons : List.<SimpleLabel> = new List.<SimpleLabel>();
    
    private var rewardCountLabels : List.<SimpleLabel> = new List.<SimpleLabel>();
    
    private var data : DailyQuestDataAbstract;
    
    private final static var MaxIconDisplayCount : int = 3;
    
    public function Init() : void
    {
        Clear();
        rewardLabel.txt = Datas.getArString("Common.Rewards") + ":";
        rewardLabel.SetFont();
        rewardLabel.rect.width = rewardLabel.mystyle.CalcSize(new GUIContent(rewardLabel.txt)).x;

        gotoOrClaimBtn.Init();
        gotoOrClaimBtn.changeToBlueNew();
        gotoOrClaimBtn.OnClick = OnGotoOrClaimBtn;
        
        splitLine.rect.y = rect.yMax - splitLine.rect.height;
        splitLine.mystyle.normal.background = TextureMgr.instance().
            LoadTexture("mail_Split-line", TextureType.DECORATION);
            
        completeRibbon.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_Completed", TextureType.DECORATION);
        rewardBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        rewardBg.rect.x = rewardLabel.rect.xMax + rewardBgXOffset;
        rewardBg.rect.width = rewardBgXMax - rewardBg.rect.x;
        
        iconBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_default_bg", TextureType.ICON);
        iconBg.rect = questIcon.rect;
    }
    
    public function SetRowData(rawData : System.Object)
    {
        Clear();
        data = rawData as DailyQuestDataAbstract;
        data.PopulateImageInfo(questIcon);
        if (data.DoneCount < data.RequestedCount)
        {
            var color = FontMgr.GetColorFromTextColorEnum(progressColorType);
            descLabel.txt = String.Format("{3} <color={2}>({0}/{1})</color>", data.DoneCount, data.RequestedCount,
                _Global.ColorToString(color), data.Desc);
        }
        else
        {
            descLabel.txt = data.Desc;
        }
        gotoOrClaimBtn.txt = Datas.getArString(data.CanClaim ? "EventCenter.ClaimBtn" : "Common.GO");
        completeRibbon.SetVisible(data.CanClaim);
        PopulateRewards();
    }
    
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }
        
        GUI.BeginGroup(rect);
        rewardBg.Draw();
        DrawQuestIcon();
        descLabel.Draw();
        rewardLabel.Draw();
        DrawRewards();
        gotoOrClaimBtn.Draw();
        splitLine.Draw();
        completeRibbon.Draw();
        GUI.EndGroup();
        return -1;
    }
    
    public function OnPopOver() : void
    {
        Clear();
    }
    
    private function Clear() : void
    {
        rewardIcons.Clear();
        rewardCountLabels.Clear();
    }
    
    private function DrawQuestIcon() : void
    {
        iconBg.Draw();
        GUI.BeginGroup(questIcon.rect);
        var cachedRect = questIcon.rect;
        questIcon.rect.x = questIcon.rect.y = 0;
        questIcon.Draw();
        questIcon.rect = cachedRect;
        GUI.EndGroup();
    }
    
    private function DrawRewards() : void
    {
        for (var i : int = 0; i < rewardIcons.Count; ++i)
        {
            rewardIcons[i].Draw();
            rewardCountLabels[i].Draw();
        }
    }
    
    private function PopulateRewards() : void
    {
        var count : int = 0;
        var iconOffset : float = rewardBg.rect.width / (iconOffsetRatio * MaxIconDisplayCount + 1);
        var iconMargin : float = iconOffset * iconOffsetRatio;
        for (var reward : DailyQuestDataAbstract.Reward in data.Rewards)
        {
            ++count;
            if (count > MaxIconDisplayCount)
            {
                break;
            }
            
            var lbl : SimpleLabel = new SimpleLabel();
            lbl.useTile = true;
            if (MystryChest.IsMystryChest_Temp(reward.ItemId))
            {
                lbl.tile = TextureMgr.instance().IconSpt().GetTile(Constant.DefaultChestTileName);
                MystryChest.singleton.AddLoadMystryChestCallback(function() : void
                {
                    var imageName : String = MystryChest.singleton.GetChestImage(reward.ItemId);
                    lbl.tile = TextureMgr.instance().IconSpt().GetTile(imageName);
                });
            }
            else
            {
                lbl.tile = TextureMgr.instance().LoadTileOfItem(reward.ItemId);
            }
            lbl.rect = rewardIconRect;
            lbl.rect.x = rewardBg.rect.x + iconOffset + (count - 1) * iconMargin;
            rewardIcons.Add(lbl);
            
            var countLabel : SimpleLabel = new SimpleLabel();
            countLabel.SetNormalTxtColor(FontColor.Milk_White);
            countLabel.txt = "x" + reward.ItemCount;
            countLabel.rect = rewardCountRect;
            countLabel.rect.x = lbl.rect.x + rewardCountMarginFromIcon;
            rewardCountLabels.Add(countLabel);
        }
    }
    
    private function OnGotoOrClaimBtn(param : System.Object) : void
    {
        if (data.HasCompleted)
        {
            ReqClaimRewards();
        }
        else
        {
            GoForQuest();
        }
    }
    
    private function ReqClaimRewards() : void
    {
        DailyQuestManager.Instance.ReqClaimQuestReward(data.Id, null);
    }
    
    private function GoForQuest() : void
    {
        MenuMgr.getInstance().PopMenu("Mission");
        data.RunLink();
    }
}
