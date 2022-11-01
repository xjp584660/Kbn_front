class JoinAllianceDes extends UIObject
{
	public var title:Label;
	public var line:Label;	
	public var icon:Label;	
	public var infor:Label;
	public var bgLabel:Label;
	public var tip:JoinAllianceTipItem;
	public var composeObj:ComposedUIObj;
	public var tipCompose:ComposedUIObj;
	
	private var tipStrArr:Array;
	private var borderX:int = 40/30;
	private var curWidth:int;
	
	function Init()
	{
		icon.Init();
		title.Init();
		line.Init();
		infor.Init();
		bgLabel.Init();
		tip.Init();
		composeObj.Init(); 
		tipCompose.Init();
		
		title.txt = Datas.getArString("AllianceJoiner.JoinAlliance");
		infor.txt = Datas.getArString("AllianceJoiner.IntroSentence");
		
//		tipStrArr = new Array();		
//		tipStrArr.Add(Datas.getArString("AllianceJoiner.TipsList"));
//		tipStrArr.Add(Datas.getArString("AllianceJoiner.Tips2"));
//		tipStrArr.Add(Datas.getArString("AllianceJoiner.Tips3"));
//		tipStrArr.Add(Datas.getArString("AllianceJoiner.Tips4"));
//		tipStrArr.Add(Datas.getArString("AllianceJoiner.Tips5"));	

		generateDesTips();
	}
	
	private function generateDesTips():void
	{
		var des:String = Datas.getArString("AllianceJoiner.TipsList");
		tipStrArr = new Array();		
		des = des.Replace("\r", "@");
		tipStrArr = des.Split("@"[0]);
	}

	public function SetLayout(menuName:String):void
	{
		curWidth = rect.width;
		composeObj.rect.width = curWidth;
		
		composeObj.clearUIObject(false, false);		
		switch(menuName)
		{
			case "AllianceMenu":
				composeObj.addUIObject(title);
				composeObj.addUIObject(icon);
				composeObj.addUIObject(tipCompose);
				
				borderX = 30;
				
				title.SetNormalTxtColor(FontColor.Button_White);
				title.SetFont(FontSize.Font_20,FontType.TREBUC);
				break;
			case "ChatMenu":
				composeObj.addUIObject(icon);
				composeObj.addUIObject(tipCompose);	
				
				borderX = 30;
						
				break;
			case "PopMenu":
				composeObj.addUIObject(title);
				composeObj.addUIObject(line);
				composeObj.addUIObject(icon);
				composeObj.addUIObject(infor);
				composeObj.addUIObject(tipCompose);
				
				borderX = 40;
				
				title.SetNormalTxtColor(FontColor.Grey);
				title.SetFont(FontSize.Font_25,FontType.GEORGIAB);						
				break;
		}
		
		tipCompose.rect = new Rect(borderX, 0, curWidth - 2 * borderX, tipCompose.rect.height);
		title.rect		= new Rect(0, 0, curWidth, title.rect.height);
		infor.rect		= new Rect(borderX, 0, curWidth - 2 * borderX, infor.GetTxtHeight() + 20);
		icon.rect.x 	= (curWidth - icon.rect.width) / 2;
		
		createTips(tipStrArr);
		
		composeObj.AutoLayout();
		
		bgLabel.rect = tipCompose.rect;
	}
	
	private function createTips(arr:Array):void
	{
		tipCompose.clearUIObject();
		
		tip.SetWidth(tipCompose.rect.width);
		
		if(arr != null && arr.length > 0)
		{			
			for(var a:int = 0; a < arr.length; a++)
			{
				var tipObj:JoinAllianceTipItem = Instantiate(tip);	
				tipObj.resetDisplay(arr[a]);
				
				if(a == (arr.length - 1))
				{
					tipObj.line.SetVisible(false);
				}
				
				tipCompose.addUIObject(tipObj);
			}
		}
		
		tipCompose.AutoLayout();
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		bgLabel.Draw();
		composeObj.Draw();
		GUI.EndGroup();
	}
	
	function Clear()
	{
		tipCompose.clearUIObject();
	}
}