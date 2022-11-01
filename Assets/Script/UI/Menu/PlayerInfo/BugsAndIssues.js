class BugsAndIssues extends PopMenu
{
	public var btnBug:Button;
	public var btnKnowledge:Button;
	public var divideLine1:Label;
	public var divideLine2:Label;
	public var scrollView:ScrollView;
	public var description:Label;
	private static var instance:BugsAndIssues;
	
	public static function getInstance():BugsAndIssues
	{
		return instance;	
	}
	
	public function Init():void
	{
		super.Init();
		
		btnBug.Init();
		btnKnowledge.Init();
		divideLine1.Init();
		divideLine2.Init();
		scrollView.Init();
		description.Init();
		
		instance = this;	
		
		title.txt = Datas.getArString("BugsAndIssues.Title");
		btnBug.txt = Datas.getArString("BugsAndIssues.ButtonReportBugs");
		btnKnowledge.txt = Datas.getArString("BugsAndIssues.ButtonKnowledgeBase");
		
		var des:String = "";
		
		if(RuntimePlatform.Android == Application.platform)
		{
			if(Datas.GetPlatform() == Datas.AppStore.Amazon)
				des = Datas.getArString("BugsAndIssues.Description_amazon");
			else
				des = Datas.getArString("BugsAndIssues.Description_google");
		}
		else if(RuntimePlatform.IPhonePlayer == Application.platform)
		{
			des = Datas.getArString("BugsAndIssues.Description");
		}
			
		description.maxChar = des.Length;
		description.txt = des;
		
		description.SetFont(); // This will change the font size in the next draw call somehow, which will
								// lead to the inconsistence to the description height calculated here. So
								// we call it in advance to fix the issue.
		var _height:int = description.mystyle.CalcHeight(GUIContent(description.txt), description.rect.width);
		description.rect.height = _height; 
		
		
		btnBug.OnClick = handleBtnBug;
		btnKnowledge.OnClick = handleBtnKnowledge;
		
		divideLine1.setBackground("between line", TextureType.DECORATION);	
		divideLine2.setBackground("between line", TextureType.DECORATION);	

		scrollView.addUIObject(description);
		
		
		GameMain.instance().resgisterRestartFunc(function(){
			instance = null;
		});		
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
		scrollView.AutoLayout();
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	function Update() 
	{
		scrollView.Update();
	}
	
	public function DrawItem()
	{
		btnBug.Draw();
		btnKnowledge.Draw();
		divideLine1.Draw();
		divideLine2.Draw();
		scrollView.Draw();	
	}
	
	private function handleBtnBug():void
	{
		UnityNet.GetHelp(2, GetHlepOk, null);
	}
	
	private function handleBtnKnowledge():void
	{
		UnityNet.GetHelp(1, GetHlepOk, null);
	}
	
	private function GetHlepOk(result:HashObject)
	{
		Application.OpenURL(result["url"].Value);
	}	
}