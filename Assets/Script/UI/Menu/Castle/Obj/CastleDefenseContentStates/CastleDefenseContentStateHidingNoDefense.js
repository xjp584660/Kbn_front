#pragma strict

public class CastleDefenseContentStateHidingNoDefense extends CastleDefenseContentStateBase
{
    public function OnEnter() : void
    {
        super.OnEnter();
        owner.HideTroopsDetailTip.SetNormalTxtColor(FontColor.BEGIN);
        owner.HideTroopsDetailTip.txt = Datas.getArString("SelectiveDefense.Tips_1");
    }

    public function OnHideTroopsSuccess(result : HashObject) : void
    {
        super.OnHideTroopsSuccess(result);
        owner.GoToState(owner.StateType.Unhiding);
    }

    public function GetStateType() : CastleDefenseContent.StateType
    {
        return CastleDefenseContent.StateType.HidingNoDefense;
    }

    public function Draw() : void
    {
        super.Draw();
        owner.HideTroopsDetailTip.Draw();
        owner.DefenseAmount.Draw();
        owner.ChooseTroopsButton.Draw();
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
    
    public function OnDismissSuccess() : void
    {
        // Ignore this message
    }
}
