class WorldBossHelpMenu extends PopMenu
{
    @SerializeField
    private var scrollView : ScrollView;
    @SerializeField
    private var rulesContent : Label;
    @SerializeField
    private var rulesSmallTitle : Label;
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
        SetRuleContent(param as String);
    }
    
    private function SetContent(content : String)
    {
		var rulesCopy2 : Label = Instantiate(rulesContent) as Label;
		rulesCopy2.txt = content;
    	rulesCopy2.rect.width = scrollView.rect.width;
        var rulesContentHeight : float = rulesCopy2.mystyle.CalcHeight(new GUIContent(content), rulesCopy2.rect.width);
        rulesCopy2.rect.height = rulesContentHeight;
        scrollView.addUIObject(rulesCopy2);
    }
    
    private function SetTitle(title : String)
    {
    	var titleCopy2 : Label = Instantiate(rulesSmallTitle) as Label;
    	titleCopy2.txt = title;
    	titleCopy2.rect.width = scrollView.rect.width;
        var titleHeight : float = titleCopy2.mystyle.CalcHeight(new GUIContent(title), titleCopy2.rect.width);
        titleCopy2.rect.height = titleHeight;
        scrollView.addUIObject(titleCopy2);
    }
    
    private function SetRuleContent(type : String)
    {
    	rect = new Rect(25,20,590,920);
    	frameSimpleLabel.rect.height = 927;
    	var contentString:String;
	    if(type=="bossEvent"){
	    	title.txt = Datas.getArString("WorldBoss.Rule_Text1");
	    	resetLayout();
	    	//contentString=Datas.getArString("WorldBoss.Rule_Text1");
	    	var content2 : String = Datas.getArString("WorldBoss.Rule_Text2");
	    	SetContent(content2);
	    	
	    	var title3 : String = Datas.getArString("WorldBoss.Rule_Text3");
	    	SetTitle(title3);
	    	
	    	var content4 : String = Datas.getArString("WorldBoss.Rule_Text4");
	    	SetContent(content4);
	    	
	    	var title5 : String = Datas.getArString("WorldBoss.Rule_Text5");
	    	SetTitle(title5);
	    	
	    	var content6 : String = Datas.getArString("WorldBoss.Rule_Text6");
	    	SetContent(content6);	
	    	
	    	scrollView.AutoLayout();
	        scrollView.MoveToTop();
	    	    	
	    }else if(type=="bossInfo"){
	    	title.txt = Datas.getArString("WorldBoss.AttackBoss_Text3");
	    	contentString=Datas.getArString("WorldBoss.AttackBoss_Text4");
	    	
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
	    else{
	    	title.txt = "";
	    	contentString="";
	    }	    
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