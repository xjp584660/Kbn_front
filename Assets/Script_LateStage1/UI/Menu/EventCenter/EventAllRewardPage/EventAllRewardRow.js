#pragma strict

public class EventAllRewardRow extends UIObject {
    @SerializeField private var leftCell : EventAllRewardCell;
    @SerializeField private var rightCell : EventAllRewardCell;

    public function Init(leftData : EventCenterGroupRewardItem, rightData : EventCenterGroupRewardItem) {
        leftCell.Init(leftData);
        rightCell.Init(rightData);
    }

    public function Draw() {
        GUI.BeginGroup(this.rect);
        leftCell.Draw();
        rightCell.Draw();
        GUI.EndGroup();
    }
}