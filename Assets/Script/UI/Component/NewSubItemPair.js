#pragma strict

// Used for ScrollView
public class NewSubItemPair extends UIObject
{
    @SerializeField
    private var left : NewSubItem;
    public function get Left() : NewSubItem
    {
        return left;
    }
    
    @SerializeField
    private var right : NewSubItem;
    public function get Right() : NewSubItem
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
    
    public function SetData(leftData : System.Object, rightData : System.Object)
    {
        left.SetRowData(leftData);
        if (rightData == null)
        {
            right.SetVisible(false);
            return;
        }
        right.SetVisible(true);
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