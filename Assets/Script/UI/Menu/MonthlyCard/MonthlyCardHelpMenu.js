class MonthlyCardHelpMenu extends PopMenu
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
        //title.txt = Datas.getArString("Newresource.tile_help_title");
        scrollView.Init();
    }

    public function OnPush(param : Object)
    {
    	checkIphoneXAdapter();
		// rect = new Rect(25,20,590,920);
  //   	frameSimpleLabel.rect.height = 927;
    	var contentString:String;	

    	title.txt = Datas.getArString("MonthlyCard.Introduction");
    	contentString=Datas.getArString("MonthlyCard.IntroductionDetail");	

	    resetLayout();
	    
        var rulesContentCopy : Label = Instantiate(rulesContent) as Label;
        rulesContentCopy.txt = contentString;
        rulesContentCopy.rect.width = scrollView.rect.width;
        var rulesContentHeight : float = rulesContentCopy.mystyle.CalcHeight(new GUIContent(contentString), rulesContentCopy.rect.width);
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