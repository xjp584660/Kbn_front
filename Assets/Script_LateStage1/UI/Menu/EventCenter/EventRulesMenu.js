class EventRulesMenu extends PopMenu
{
    @SerializeField
    private var scrollView : ScrollView;
    @SerializeField
    private var rulesContent : Label;
    @SerializeField
    private var bgLine : Label;
    
    public function Init()
    {
        super.Init();
        rulesContent.Init();
        title.txt = Datas.getArString("EventCenter.Rules");
        scrollView.Init();
    }

    public function OnPush(param : Object)
    {
        SetRuleContent(param as String);
    }
    
    private function SetRuleContent(txt : String)
    {
        var rulesContentCopy : Label = Instantiate(rulesContent) as Label;
        rulesContentCopy.txt = txt;
        rulesContentCopy.rect.width = scrollView.rect.width;
        var rulesContentHeight : float = rulesContentCopy.mystyle.CalcHeight(new GUIContent(txt), rulesContentCopy.rect.width);
        rulesContentCopy.rect.height = rulesContentHeight;
        scrollView.addUIObject(rulesContentCopy);
        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }
    
    public function DrawItem()
    {
        scrollView.Draw();
        bgLine.Draw();
    }
    
    public function Update()
    {
        scrollView.Update();
    }
    
    public function OnPopOver()
    {
        Clear();
    }
    
    private function Clear()
    {
        scrollView.clearUIObject();
    }
}