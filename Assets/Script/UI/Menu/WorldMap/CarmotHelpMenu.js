class CarmotHelpMenu extends PopMenu
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
        SetRuleContent(param as String);
    }
    
    private function SetRuleContent(type : String)
    {
    	rect = new Rect(25,20,590,920);
    	frameSimpleLabel.rect.height = 927;
    	var contentString:String;
	    if(type=="carmot"){
	    	title.txt = Datas.getArString("Newresource.tile_help_title");
            contentString=Datas.getArString("Newresource.tile_help_content");
        }
        else if(type=="Newresource")
        {
            title.txt = Datas.getArString("Newresource.NewHelpTile");
            contentString=Datas.getArString("Newresource.NewHelpContent");
        }
        else if(type=="migrate"){
	    	title.txt = Datas.getArString("Migrate.Help_Title");
	    	contentString=Datas.getArString("Migrate.Help_Text");
	    } else if(type=="camp"){
	    	title.txt = Datas.getArString("MapView.BarbarianCityHelpTitle");
	    	contentString=Datas.getArString("MapView.BarbarianCityHelpText");
	    }
       	else if(type=="Impeach"){
	    	title.txt = Datas.getArString("Impeach.Help_Title");
	    	var chancellorInactiveTime : String = GameMain.instance().getChancellorInactiveTime();
	    	var getDeadLine : String = GameMain.instance().getDeadLine();
	    	var getJoinTime : String = GameMain.instance().getJoinTimes();
	    	contentString = String.Format(Datas.getArString("Impeach.Help_Text"),chancellorInactiveTime, getDeadLine,getJoinTime);
	    	rect = new Rect(25,105,590,750);
	    	frameSimpleLabel.rect.height = 765;
	    }
	    else{
	    	title.txt = "";
	    	contentString="";
	    }
	    
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