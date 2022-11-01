#pragma strict

public class DailyQuestContent extends UIObject
{
    @SerializeField
    private var itemTemplate : DailyQuestListItem;
    @SerializeField
    private var scrollList : ScrollList;
    @SerializeField
    private var emptyLabel : SimpleLabel;

    @SerializeField
    private var emptyTextKey : String;
    
    private var empty : boolean;
    private var hasGotList : boolean;
    
    public function Init() : void
    {
        Clear();
        scrollList.Init(itemTemplate);

        emptyLabel.mystyle.normal.background = TextureMgr.instance().
            LoadTexture("square_black2" , TextureType.DECORATION);
        emptyLabel.txt = Datas.getArString(emptyTextKey);
    }
    
    public function ReqUpdateData() : void
    {
        Clear();
        DailyQuestManager.Instance.ReqUpdateData();
    }
    
    public function Draw() : int
    {
        if (!visible || !hasGotList)
        {
            return -1;
        }

        if (empty)
        {
            emptyLabel.Draw();
        }
        else
        {
            scrollList.Draw();
        }

        return -1;
    }
    
    public function Update() : void
    {
        if (!empty && hasGotList)
        {
            scrollList.Update();
        }
    }
    
    public function OnPopOver() : void
    {
        Clear();
    }
    
    public function HandleNotification(type : String, body : System.Object) : void
    {
        switch (type)
        {
        case Constant.Notice.DailyQuestDataUpdated:
        case Constant.Notice.DailyQuestRewardClaimed:
            UpdateDisplay();
            hasGotList = true;
            MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
            break;
        case Constant.Notice.DailyQuestDataUpdateFailed:
            hasGotList = true;
            break;
        case Constant.Notice.DailyQuestProgressIncreased:
            if (hasGotList)
            {
                UpdateDisplay();
            }
            break;
        default:
            break;
        }
    }
    
    private function UpdateDisplay() : void
    {
        var data : DailyQuestDataAbstract[] = DailyQuestManager.Instance.UnclaimedQuests;
        scrollList.SetData(data);
        scrollList.ResetPos();
        empty = (data.Length <= 0);
    }
    
    private function Clear() : void
    {
        scrollList.Clear();
        empty = true;
        hasGotList = false;
    }
}
