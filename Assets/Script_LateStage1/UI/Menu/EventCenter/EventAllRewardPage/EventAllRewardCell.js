#pragma strict

public class EventAllRewardCell extends UIObject {
    @SerializeField private var iconDefaultBg : Label;
    @SerializeField private var icon : Label;
    @SerializeField private var nameLabel : Label;
    @SerializeField private var qtyLabel : Label;

    public function Init(cellData : EventCenterGroupRewardItem) {
        if (cellData == null) {
            SetAllComponentsVisible(false);
            return;
        }

        SetAllComponentsVisible(true);
        iconDefaultBg.useTile = true;
        iconDefaultBg.tile = TextureMgr.instance().BackgroundSpt().GetTile("icon_default_bg");
        icon.useTile = true;
        icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(cellData.Id);
        nameLabel.txt = Datas.getArString(String.Format("itemName.i{0}", cellData.Id));
        qtyLabel.txt = String.Format("X {0}", cellData.Qty);
    }

    private function SetAllComponentsVisible(visible : boolean) {
        this.visible = visible;
        iconDefaultBg.SetVisible(visible);
        icon.SetVisible(visible);
        nameLabel.SetVisible(visible);
        qtyLabel.SetVisible(visible);
    }

    public function Draw() {
        if (!visible) return;
        GUI.BeginGroup(this.rect);
        iconDefaultBg.Draw();
        icon.Draw();
        nameLabel.Draw();
        qtyLabel.Draw();
        GUI.EndGroup();
    }
}