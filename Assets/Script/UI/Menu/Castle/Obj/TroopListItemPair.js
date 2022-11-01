#pragma strict

public class TroopListItemPair extends UIObject
{
    @SerializeField
    private var left : TroopListItem;
    public function get Left() : TroopListItem
    {
        return left;
    }
    
    @SerializeField
    private var right : TroopListItem;
    public function get Right() : TroopListItem
    {
        return right;
    }
    
    public function Init() : void
    {
        left.Init();
        right.Init();
        InitRect();
    }
    
    private function InitRect() : void
    {
        rect.x = left.rect.x;
        rect.y = left.rect.y;
        rect.width = right.rect.xMax - rect.x;
        rect.height = left.rect.height;
    }
    
    public function SetData(leftData : TroopListItem.DisplayData, rightData : TroopListItem.DisplayData)
    {
        left.SetRowData(leftData);
        if (rightData == null)
        {
            right.SetVisible(false);
            return;
        }
        right.SetRowData(rightData);
    }
    
    public function Draw() : int
    {
        if (visible)
        {
            GUI.BeginGroup(rect);
            left.Draw();
            right.Draw();
            GUI.EndGroup();
        }
        return -1;
    }
}