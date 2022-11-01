import System.Collections.Generic;

public class PassMissionQuest extends UIObject
{
    @SerializeField
    private var itemTemplate : PassMissionQuestItem;
    @SerializeField
    private var fixedScrollList : ScrollList;
    @SerializeField
    private var randomScrollList : ScrollList;

    public var fixedQuestTitle : Label;
    public var fixedQuestLine : Label;
   
    public var randomQuestTitle : Label;
    public var randomQuestLine : Label;
    public var randomQuestDec : Label;
    public var helpBtn : Button;

    public function Init() : void
    {
        fixedQuestTitle.SetVisible(false);
        randomQuestTitle.txt = Datas.getArString("PassMission.RandomQuest");

        Clear();
        fixedScrollList.Init(itemTemplate);
        randomScrollList.Init(itemTemplate);
        helpBtn.OnClick = OnHelpClick;

        randomQuestDec.SetVisible(false);
    }

    private function OnHelpClick(param : Object) : void
    {
        var temprect:Rect = helpBtn.GetAbsoluteRect();
		if (temprect!=null)
		{
		    var x:float = temprect.x + (temprect.width/2);
			var y:float = temprect.y + (temprect.height/2);
			
			var msg : String = Datas.getArString("PassMission.Help");
			MenuMgr.getInstance().PushTips(msg, x,y);
		}
    } 
    
    public function ReqUpdateData() : void
    {
        Clear();
        PassMissionQuestManager.Instance().ReqQuestsData();
    }
    
    public function Draw() : int
    {
        if (!visible)
        {
            return -1;
        }

        randomQuestLine.Draw();
        randomQuestTitle.Draw();      
        randomQuestDec.Draw();
        helpBtn.Draw();
        randomScrollList.Draw();

        fixedQuestLine.Draw();
        fixedQuestTitle.Draw();       
        fixedScrollList.Draw();

        return -1;
    }
    
    public function Update() : void
    {
        // fixedScrollList.Update();
        // randomScrollList.Update();

        randomQuestDec.txt = PassMissionQuestManager.Instance().FormatTimeTipText();
    }
    
    public function OnPopOver() : void
    {
        Clear();
    }
    
    public function HandleNotification(type : String, body : System.Object) : void
    {
        switch (type)
        {
            case Constant.Notice.PassMissionRefreshRandomQuest:
            case Constant.Notice.PassMissionClaimRandomQuestReward:
                UpdateRandomQuestsDisplay();
                break;
            case Constant.Notice.PassMissionClaimFixedQuestReward:
                ClaimedFixedQuestReward(body);
                break;
            case Constant.Notice.PassMissionReqQuestsData:
                UpdateRandomQuestsDisplay();
                UpdateFixedQuestsDisplay();
                break;
            default:
                break;
        }
    }

    private function ClaimedFixedQuestReward(body : System.Object) : void
    {
        var questId : int = _Global.INT32(body);
        var fixedQuestItems : List.<ListItem> = fixedScrollList.GetItemLists();
        for(var i : int = 0; i < fixedQuestItems.Count; ++i)
        {
            var item : ListItem = fixedScrollList.GetItem(i);
            if(item != null)
            {
                var passMissionQuestItem : PassMissionQuestItem = item as PassMissionQuestItem;
                if(passMissionQuestItem == null)
                {
                	continue;
                }
                if(passMissionQuestItem.quest.Id == questId)
                {
                    passMissionQuestItem.ClaimedFixedQuestReward();
                    break;
                }
            }
        }

        SetFixedQuestTitle();
    }

    private function SetFixedQuestTitle()
    {
        var completedCount : int = PassMissionQuestManager.Instance().GetCompletedQuestsCount();
        var allCount : int = PassMissionQuestManager.Instance().GetFixedQuestsCount();
        fixedQuestTitle.txt = String.Format(Datas.getArString("PassMission.Mllestone"), completedCount, allCount);
        fixedQuestTitle.SetVisible(true);
    }
    
    private function UpdateFixedQuestsDisplay() : void
    {
        fixedScrollList.Clear();
        var fixed : PassMissionQuestDataAbstract[] = PassMissionQuestManager.Instance().GetFixedQuests();
        fixedScrollList.SetData(fixed);
        fixedScrollList.ResetPos();

        SetFixedQuestTitle();
    }

    private function UpdateRandomQuestsDisplay() : void
    {
        randomScrollList.Clear();
        var random : PassMissionQuestDataAbstract[] = PassMissionQuestManager.Instance().GetRandomQuests();
        randomScrollList.SetData(random);
        randomScrollList.ResetPos();

        randomQuestDec.txt = PassMissionQuestManager.Instance().FormatTimeTipText();
        randomQuestDec.SetVisible(true);
    }
    
    private function Clear() : void
    {
        fixedScrollList.Clear();
        randomScrollList.Clear();
    }
}
