class MigrateConfirmHelp extends PopMenu
{
	public var btnAgree:Button;
	public var btnCancel:Button;
	public var titleBacklabel:Label;
//	public var divideLine2:Label;
	public var scrollView:ScrollView;
	public var description:Label;
	
	private var account : String;
	private var password : String;
	private var selectServerId : int;
	private var needItemCount : int;
	private var migrateTime : String;
	public var frameOffset : RectOffset;
	
	public function Init():void
	{
		super.Init();
		
		btnAgree.Init();
		btnCancel.Init();
		titleBacklabel.Init();
//		divideLine2.Init();
		scrollView.Init();
		description.Init();
				
		btnAgree.txt = Datas.getArString("Common.Agree");
		btnCancel.txt = Datas.getArString("Common.Cancel");
		
		title.txt = Datas.getArString("Migrate.Confirm2_Title");
		var des:String = Datas.getArString("Migrate.Confirm2_Text");
		// var des:String = Datas.getArString("please be \n\n1.only li\nherar\nlost\n]n2 your\nnew word\n\n3 your won\nfor 7\n\n4 your account\nwilebe");
//		title.txt = Datas.getArString("Migrate.Help_Title");
//		var des:String = Datas.getArString("Migrate.Help_Text");
		description.maxChar = des.Length;
		description.txt = des;		
		description.SetFont(); 
		var _height:int = description.mystyle.CalcHeight(GUIContent(description.txt), description.rect.width);
		description.rect.height = _height; 
		
		
		btnAgree.OnClick = handleBtnAgree;
		btnCancel.OnClick = handleBtnCancel;
		
//		divideLine1.setBackground("between line", TextureType.DECORATION);	
//		divideLine2.setBackground("between line", TextureType.DECORATION);	

		scrollView.addUIObject(description);
	}
	
	private function handleBtnAgree():void
	{
		var okFunc:Function = function(result:HashObject)
		{
			if (result["ok"].Value) {				
				MenuMgr.getInstance().PopMenu("");
				migrateTime = result["migrateFinishTime"].Value.ToString();
				var lTime : long = _Global.INT64(migrateTime);
				var sTime : String = _Global.DateTimeChatFormat2(lTime);
				MenuMgr.getInstance().PushMenu("MigrateDialog", {"type":0,"time":sTime}, "trans_zoomComp"); 
			}
		};
		
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};

		UnityNet.Migrate(migrateTime, selectServerId, needItemCount, account, password, okFunc, errorFunc);
	}
	
	private function handleBtnCancel():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
//		bgOffesetY=30;
//		frameSimpleLabel.rect = new Rect(0, bgOffesetY, rect.width, rect.height -bgOffesetY+4);
		ResetLayoutWithRectOffset(frameOffset);
		btnClose.rect.y=16;
	   	var paramDict : Hashtable = param as Hashtable;
    	account = _Global.GetString(paramDict["account"]);
    	password = _Global.GetString(paramDict["password"]);    	
    	selectServerId = _Global.INT32(paramDict["selectServerId"]);
	    needItemCount = _Global.INT32(paramDict["needItemCount"]);
		migrateTime = _Global.GetString(paramDict["migrateTime"]);
		
		scrollView.AutoLayout();
	}
		
	public function OnPop()
	{
		super.OnPop();
	}
	
	function Update() 
	{
//		scrollView.Update();
	}
	
	public function DrawItem()
	{
		btnAgree.Draw();
		btnCancel.Draw();
		
//		divideLine2.Draw();
		scrollView.Draw();	
	}
	public function DrawLastItem()
	{
		titleBacklabel.Draw();
		DrawTitle();
	}
}