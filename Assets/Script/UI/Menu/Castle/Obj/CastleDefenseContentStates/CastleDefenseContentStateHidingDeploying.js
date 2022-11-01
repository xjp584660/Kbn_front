#pragma strict
import System.Collections.Generic;

public class CastleDefenseContentStateHidingDeploying extends CastleDefenseContentStateBase
{
    private var trainInfo : Barracks.TrainInfo;
    private var coverMaterial : Material;
    private var coverTexture : Texture2D;
    
    private var haveGotScrollViewScreenRect : boolean;
    private var haveUpdatedAmount : boolean;

    public function GetStateType() : CastleDefenseContent.StateType
    {
        return CastleDefenseContent.StateType.HidingDeploying;
    }

    public function OnHideTroopsSuccess(result : HashObject) : void
    {
        super.OnHideTroopsSuccess(result);
        owner.GoToState(owner.StateType.Unhiding);
    }

    public function Draw() : void
    {
        super.Draw();
        owner.DefenseAmount.Draw();
        owner.TheTrainItem.Draw();
        owner.TheScrollView.Draw();
        if (!haveGotScrollViewScreenRect)
        {
            UpdateScrollViewScreenRectForItems();
            haveGotScrollViewScreenRect = true;
        }
        owner.RechooseTroopsButton.Draw();
        owner.DismissTroopsButton.Draw();
    }

    public function OnSelectiveDefenseCountChanged() : void
    {
        // Update only once to prevent bugs.
        if (haveUpdatedAmount)
        {
            return;
        }
        
        super.OnSelectiveDefenseCountChanged();
        haveUpdatedAmount = true;
    }


    protected function CalculateSelectiveDefenseAmount() : int
    {
        var queue : List.<SelectiveDefenseQueueItem> = SelectiveDefenseQueueMgr.instance().Queue();
        var amount : int = 0;
        for (var queueItem : SelectiveDefenseQueueItem in queue)
        {
            amount += queueItem.TotalUnit;
        }
        return amount;
    }
    
    public function OnEnter() : void
    {
        haveUpdatedAmount = false;
        super.OnEnter();
        InitProgressCoverParams();
        InitDisplay();
        PopulateScrollView();
        haveGotScrollViewScreenRect = false;
    }
    
    public function OnExit() : void
    {
        owner.TheScrollView.clearUIObject();
        super.OnExit();
    }
    
    public function Update() : void
    {
        super.Update();
        owner.TheScrollView.Update();
        owner.TheTrainItem.Update();
        var queue : List.<SelectiveDefenseQueueItem> = SelectiveDefenseQueueMgr.instance().Queue();
        if (queue.Count > 0)
        {
            var item : SelectiveDefenseQueueItem = queue[0];
            if (trainInfo == null)
            {
                trainInfo = new Barracks.TrainInfo();
                trainInfo.timeRemaining = item.timeRemaining;
                trainInfo.needed = item.needed;
                trainInfo.startTime = item.startTime;
                trainInfo.endTime = item.endTime;
                trainInfo.classType = QueueType.HealQueue;
                trainInfo.id = item.id;
                owner.TheTrainItem.progress.Init(trainInfo,0.0f,trainInfo.needed);
                owner.TheTrainItem.SetTrainInfo(trainInfo);
            }
            else
            {
                trainInfo.timeRemaining = item.timeRemaining;
            }
            UpdateProgress();
        }
        else
        {
            owner.GoToState(owner.StateType.HidingDefense);
        }
    }
    
    private function InitProgressCoverParams()
    {
        coverMaterial = new Material(Shader.Find("Script/RingPercentPainter"));
        coverTexture = TextureMgr.instance().LoadTexture("item_progress_cover", TextureType.ICON_ELSE);
        coverMaterial.SetColor("_MainColor", new Color(1f, 1f, 1f, .5f));
        coverMaterial.SetTexture("_MainTex", coverTexture);
    }
    
    private function InitDisplay() : void
    {
        owner.TheTrainItem.rect.y = owner.SplitLine.rect.yMax + owner.SpaceBetweenSplitLineAndBelow + owner.ItemToDefendHeight;
        owner.TheScrollView.rect.y = owner.TheTrainItem.rect.y + owner.YOffsetForScrollView;
        owner.TheScrollView.rect.height = owner.BottomView.rect.y - owner.TheScrollView.rect.y;
        owner.TheScrollView.MakeNeedScreenRectOnce();
    }
    
    private function PopulateScrollView() : void
    {
        owner.TheScrollView.clearUIObject();
        var queueItem : SelectiveDefenseQueueItem = SelectiveDefenseQueueMgr.instance().Queue()[0];
        var displayDataList : List.<TroopListItem.DisplayData> = new List.<TroopListItem.DisplayData>();
        for (var pair : KeyValuePair.<int, int> in queueItem.GetUnitsData())
        {
            var displayData = new TroopListItem.DisplayData(pair.Key, pair.Value);
            displayDataList.Add(displayData);
        }
        displayDataList.Sort(function(l : TroopListItem.DisplayData, r : TroopListItem.DisplayData)
        {
            return l.troopId < r.troopId ? -1 : 1;
        });
        
        for (var i : int = 0; i < displayDataList.Count; i = i + 2)
        {
            var leftData : TroopListItem.DisplayData = displayDataList[i];
            var rightData : TroopListItem.DisplayData = (i + 1 < displayDataList.Count ? displayDataList[i + 1] : null);
        
            var pair : TroopListItemPair = UnityEngine.Object.Instantiate(owner.ItemPairTemplate);
            pair.Init();
            pair.SetData(leftData, rightData);
            pair.Left.CoverIsVisible = true;
            pair.Left.CoverTexture = coverTexture;
            pair.Left.CoverMaterial = coverMaterial;
            pair.Right.CoverIsVisible = true;
            pair.Right.CoverTexture = coverTexture;
            pair.Right.CoverMaterial = coverMaterial;
            owner.TheScrollView.addUIObject(pair);
        }
        
        owner.TheScrollView.addUIObject(owner.KnightPositionButton);
        owner.TheScrollView.AutoLayout();
        owner.TheScrollView.MoveToTop();
    }
    
    public function OnRechooseTroops() : void
    {
        AskPlayerToBuyInstantFinish();
    }
    
    public function OnDismissTroops() : void
    {
        AskPlayerToBuyInstantFinish();
    }
    
    public function OnHideTroopsSwitch() : void
    {
        owner.HideTroopsSwitch.SetOn(!owner.HideTroopsSwitch.on);
        AskPlayerToBuyInstantFinish();
    }
    
    private function AskPlayerToBuyInstantFinish() : void
    {
        var biType : int = Constant.BIType.INSTANT_DEFENSE_DEPLOYING;
        
        var queue : List.<SelectiveDefenseQueueItem> = SelectiveDefenseQueueMgr.instance().Queue();
        if (queue.Count <= 0)
        {
            return;
        }
        
        var item : SelectiveDefenseQueueItem = queue[0];
        
        var costTime : long = item.timeRemaining;
        var gemsCost : int = SpeedUp.instance().getTotalGemCost(costTime);
        var msg : String = Datas.getArString("SelectiveDefense.Popup");
        
        Utility.instance().InstantFinishEvent(costTime, gemsCost, msg, biType,
            function(directBuyFlag : int, curPrice : int, paymentDat : Payment.PaymentElement)
        {
            var itemList : String = SpeedUp.instance().getItemListString(costTime);
            SpeedUp.instance().useInstantSpeedUp(SpeedUp.PLAYER_ACTION_SELECTIVE_DEFENSE,
                gemsCost, itemList, item.id, owner.CurrentCityId);
        });
    }
    
    private function UpdateScrollViewScreenRectForItems() : void
    {
        owner.TheScrollView.forEachNewComponentObj(function(uiObj : UIObject)
        {
            var pair : TroopListItemPair = uiObj as TroopListItemPair;
            if (pair == null)
            {
                return;
            }
            
            pair.Left.ClipScreenRect = owner.TheScrollView.ScreenRect;
            pair.Right.ClipScreenRect = owner.TheScrollView.ScreenRect;
        });
    }
    
    private function UpdateProgress() : void
    {
        var timeRemaining : float = trainInfo.timeRemaining;
        var totalTime : float = trainInfo.endTime - trainInfo.startTime;
        var progress : float = 1 - timeRemaining / totalTime;
        
        owner.TheScrollView.forEachNewComponentObj(function(uiObj : UIObject)
        {
            var pair : TroopListItemPair = uiObj as TroopListItemPair;
            if (pair == null)
            {
                return;
            }
            
            pair.Left.Progress = progress;
            pair.Right.Progress = progress;
        });
    }
}
