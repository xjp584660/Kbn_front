#pragma strict

public class CastleDefenseContentStateUnhiding extends CastleDefenseContentStateBase
{
    public function OnEnter() : void
    {
        super.OnEnter();
        owner.HideTroopsSwitch.SetOn(false);
        owner.HideTroopsDetailTip.SetNormalTxtColor(FontColor.Red);
        owner.HideTroopsDetailTip.txt = Datas.getArString("SelectiveDefense.Tips_2");
    }

    public function OnHideTroopsSuccess(result : HashObject) : void
    {
        super.OnHideTroopsSuccess(result);
        owner.GoToState(owner.StateType.HidingNoDefense);
    }

    public function GetStateType() : CastleDefenseContent.StateType
    {
        return CastleDefenseContent.StateType.Unhiding;
    }

    public function Draw()
    {
        super.Draw();
        owner.HideTroopsDetailTip.Draw();
    }
}
