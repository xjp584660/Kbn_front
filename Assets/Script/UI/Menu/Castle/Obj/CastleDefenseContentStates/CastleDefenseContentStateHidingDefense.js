#pragma strict
import System.Collections.Generic;

public class CastleDefenseContentStateHidingDefense extends CastleDefenseContentStateBase
{
    public function GetStateType() : CastleDefenseContent.StateType
    {
        return CastleDefenseContent.StateType.HidingDefense;
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
        owner.TheScrollView.Draw();
        owner.RechooseTroopsButton.Draw();
        owner.DismissTroopsButton.Draw();
    }
    
    public function OnEnter() : void
    {
        super.OnEnter();
        InitDisplay();
        PopulateScrollView();
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
    }
    
    private function InitDisplay() : void
    {
        owner.TheScrollView.rect.y = owner.SplitLine.rect.yMax + owner.SpaceBetweenSplitLineAndBelow + owner.ItemToDefendHeight;
        owner.TheScrollView.rect.height = owner.BottomView.rect.y - owner.TheScrollView.rect.y;
    }
    
    private function PopulateScrollView() : void
    {
        owner.TheScrollView.clearUIObject();
        var displayDataList : List.<TroopListItem.DisplayData> = new List.<TroopListItem.DisplayData>();
        
        var defenseNode : HashObject = owner.Seed["selective_defense"];
        if (defenseNode == null)
        {
            defenseNode = new HashObject();
        }
        
        var currentCityDefense : HashObject = defenseNode["c" + owner.CurrentCityId];
        if (currentCityDefense == null)
        {
            currentCityDefense = new HashObject();
        }
        
        var keys : String[] = _Global.GetObjectKeys(currentCityDefense);
        
        for (var key : String in keys)
        {
            if (!key.StartsWith("u"))
            {
                continue;
            }
            var troopId : int = _Global.INT32(key.Substring(1));
            var troopCount : int = _Global.INT32(currentCityDefense[key]);
            if (troopId > 0 && troopCount > 0)
            {
                var displayData = new TroopListItem.DisplayData(troopId, troopCount);
                displayDataList.Add(displayData);
            }
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
            pair.Left.CoverIsVisible = false;
            pair.Right.CoverIsVisible = false;
            owner.TheScrollView.addUIObject(pair);
        }
        
        owner.TheScrollView.addUIObject(owner.KnightPositionButton);
        owner.TheScrollView.AutoLayout();
        owner.TheScrollView.MoveToTop();
    }
    
    public function OnRechooseTroops() : void
    {
        owner.OnChooseTroops(null);
    }
    
    public function OnDismissTroops() : void
    {
        RequestDismissTroops();
    }
    
    private function RequestDismissTroops() : void
    {
        var url : String = "dismissCityDefense.php";
        var payload : Hashtable = new Hashtable();
        payload.Add("cid", owner.CurrentCityId.ToString());
        UnityNet.reqWWW(url, payload, owner.OnDismissSuccess, null);
        //// Debug TODO: change to reqWWW
        //owner.OnDismissSuccess(new HashObject({"ok": true}));
    }
    
    public function OnDismissSuccess()
    {
        MoveSelectiveDefenseBackToCityUnits();
        MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.RecallDefnse"));
        owner.GoToState(owner.StateType.HidingNoDefense);
    }
    
    public function OnChooseTroops() : void
    {
        if (MenuMgr.getInstance().hasMenuByName("ChooseDefenseTroopsPopMenu"))
        {
            return;
        }
        var data:Hashtable = {
    		"count":owner.DefenseCapacity
    	};
        MenuMgr.getInstance().PushMenu("ChooseDefenseTroopsPopMenu", data, "trans_zoomComp");
    }
    
    public function OnDeployStarted() : void
    {
        owner.GoToState(owner.StateType.HidingDeploying);
    }
    
    public function OnSelectiveDefenseCountChanged() : void
    {
        super.OnSelectiveDefenseCountChanged();
        
        if (!Castle.instance().HasSelectiveDefense())
        {
            owner.GoToState(owner.StateType.HidingNoDefense);
            return;
        }
        // Refresh the scroll view
        PopulateScrollView();
    }
}
