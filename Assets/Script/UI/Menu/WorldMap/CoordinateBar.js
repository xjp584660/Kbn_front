
class	CoordinateBar extends	UIObject{
	public	var bgLabel:Label;
	public	var	xLabel:Label;
	public	var yLabel:Label;
	
	public  var textInputX:InputText;
	public  var textInputY:InputText; 

	public	var searchBtn:Button;
	public	var	myCityBtn:Button;
	public	var	bookmarkBtn:Button;
	public	var showLevelBtn:Button;
	public	var showMarchLineBtn:Button;
	
	//private	var	keyboard:iPhoneKeyboard;
	//private	var	curTextField:Button;
	
	public	function	Init(){
//		var arStrings:Object = Datas.instance().arStrings();
		xLabel.txt = Datas.getArString("Common.X");
		yLabel.txt = Datas.getArString("Common.Y");
		searchBtn.OnClick = onSearchBtnClick;
		bookmarkBtn.OnClick = onBookmarkBtnClick;
		myCityBtn.OnClick = onMyCityBtnClick;
		showLevelBtn.OnClick = onShowLevelBtnClick;
		showMarchLineBtn.OnClick = onShowMarchLineBtnClick;
		
		//bgLabel.tile.spt  = TextureMgr.instance().BackgroundSpt();
		//bgLabel.tile.name = "small_bar_bottom";
		//bgLabel.useTile = true;
		
		var texMgr : TextureMgr = TextureMgr.instance();
		var texNormal : Texture = texMgr.LoadTexture("map_icon_button", TextureType.BUTTON);
		var texDown : Texture = texMgr.LoadTexture("map_icon_button_down", TextureType.BUTTON);
		searchBtn.mystyle.normal.background = texNormal;
		myCityBtn.mystyle.normal.background = texNormal;
		bookmarkBtn.mystyle.normal.background = texNormal;
		showLevelBtn.mystyle.normal.background = texNormal;
		showMarchLineBtn.mystyle.normal.background = texNormal;

		searchBtn.mystyle.active.background = texDown;
		myCityBtn.mystyle.active.background = texDown;
		bookmarkBtn.mystyle.active.background = texDown;
		showLevelBtn.mystyle.active.background = texDown;
		showMarchLineBtn.mystyle.active.background = texDown;
		/*
		xTextField.clickParam = xTextField;
		xTextField.OnClick = openNumKeyboard;
		
		yTextField.clickParam = yTextField;
		yTextField.OnClick = openNumKeyboard;
		*/
		textInputX.filterInputFunc = handlerFilterInputFunc;
		textInputY.filterInputFunc = handlerFilterInputFunc;
		
		textInputX.inputDoneFunc = handlerInputDoneFunc;		
		textInputY.inputDoneFunc = handlerInputDoneFunc;
				
		textInputX.type = TouchScreenKeyboardType.NumberPad;
		textInputY.type = TouchScreenKeyboardType.NumberPad;
		
		textInputX.Init();
		textInputY.Init();
		
		priv_initFrame();
	}
	
	//public	function	Draw(){
		//TODO: change the button to inputtext
		/*
		if(keyboard && keyboard.done ){
			curTextField = null;
		}
		if( keyboard && keyboard.active ){
			if( curTextField ){
				var checkStr:String = _Global.FilterStringToNumberStr(keyboard.text);//keyboard.text;
				if( checkStr == null || checkStr.Trim().Length < 1 ){
					checkStr = "1";
				}else{
					var intValue:int = int.Parse(checkStr);
					if( intValue <= 0 ){
						checkStr = "1";
					}else if( intValue > Constant.Map.WIDTH ){
						keyboard.text = "" + Constant.Map.WIDTH;
						checkStr = keyboard.text;
					}else{
						checkStr = "" + intValue;
					}
				}
				curTextField.txt = checkStr;
				
				
			}
		}
		*/
	//	GUI.BeginGroup(rect);
	//		bgLabel.Draw();
	//		xLabel.Draw();
	//		yLabel.Draw();
	//		textInputX.Draw();
	//		textInputY.Draw();
			
	//		searchBtn.Draw();
	//		bookmarkBtn.Draw();
	//		myCityBtn.Draw();
	//	GUI.EndGroup();
	//}
	
	public	function	setXFieldContent(str:String){
		textInputX.txt = str;
	}
	
	public	function	setYFieldContent(str:String){
		textInputY.txt = str;
	}
	public	function	onShowLevelBtnClick( clickParam:Object ) {
		GameMain.instance().toggleShowTileLevel();
	}
	
	public	function	onShowMarchLineBtnClick( clickParam:Object ) {
		GameMain.instance().toggleShowTournamentInfo();
	}
	
	public	function	onSearchBtnClick(clickParam:Object){
		var x:int;
		var y:int;
		
		x = _Global.INT32(textInputX.txt);
		y = _Global.INT32(textInputY.txt);
		if(x < 1) x = 1;
		if(x > Constant.Map.WIDTH) x = Constant.Map.WIDTH;
		if(y < 1) y = 1;
		if(y > Constant.Map.HEIGHT) y = Constant.Map.HEIGHT;
		GameMain.instance().hideTileInfoPopup();
		GameMain.instance().searchWorldMap(x,y);
	}
	
	private	function	onBookmarkBtnClick(clickParam:Object){
//		var	bookmark:Bookmark = Bookmark.instance();
//		bookmark.reqServerBookmarks(bookamrkOk);
		MenuMgr.getInstance().PushMenu("BookmarkMenu", null);
	}
	
	private	function	onMyCityBtnClick(clickParam:Object){
		var gMain:GameMain = GameMain.instance();
		var curCityInfo:HashObject = gMain.GetCityInfo(gMain.getCurCityId());
		var x:int = _Global.INT32(curCityInfo[_Global.ap + 2]);
		var y:int = _Global.INT32(curCityInfo[_Global.ap + 3]);
		
		gMain.hideTileInfoPopup();
		gMain.searchWorldMap(x, y);
	}
	
//	private	function	bookamrkOk(){
//		MenuMgr.getInstance().PushMenu("BookmarkMenu", null);
//	}
	
	/*
	private	function	openNumKeyboard(param:Object){
		GameMain.instance().hideTileInfoPopup();
//		if( keyboard == null || !keyboard.active ){
//			var	button:Button = param as Button;
//			keyboard = iPhoneKeyboard.Open(button.txt, iPhoneKeyboardType.NumberPad);
//			curTextField = button;
//		}

		var	button:Button = param as Button;
		if( keyboard == null  ){
			keyboard = iPhoneKeyboard.Open(button.txt, iPhoneKeyboardType.NumberPad);
		}else if( !keyboard.active ){
			keyboard.active = true;
			keyboard.text = button.txt;
		}
		
		curTextField = button;
	}
	*/
	public function handlerFilterInputFunc(oldStr:String,newStr:String)
	{
		var max:int =  Constant.Map.WIDTH;
		var input = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input == "")
		{
			count = 0;
		}
		else
		{
			count = _Global.INT64(input);
		}
		count = count < 0 ? 0:count;
		count = count >= max ? max : count;
		return count == 0 ? "":"" +count;
	}
	public function handlerInputDoneFunc(input:String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			return "1";
		}
		else
		{
			return input;
		}
	}
	
	
	private var m_topFrame : UILayout.UIFrame = null;
	public function get UIFrame() : UILayout.UIFrame
	{
		return m_topFrame;
	}

	private function priv_initFrame()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var textResource : TextAsset;
		if ( _Global.IsLargeResolution() )
			textResource = texMgr.LoadUILayout("CoordinateBar.high");
		else
			textResource = texMgr.LoadUILayout("CoordinateBar.low");

		var memStream : System.IO.Stream = new System.IO.MemoryStream(textResource.bytes);
		var initPropList : System.Collections.Generic.Dictionary.<String, Object> = new System.Collections.Generic.Dictionary.<String, Object>();
		initPropList["@ThisMenu"] = this;
		m_topFrame = UILayout.XAMLResReader.ReadFile(memStream, initPropList) as UILayout.UIFrame;
		
		//_Global.LogWarning("priv_initFrame  showMarchLineBtn.rect.y : " + showMarchLineBtn.rect.y);
	}
	
	private function priv_addUIObj(uiPnt : UILayout.Grid, uiObj : UIObject, index : uint, lockType : UIObjContainForLayout.LockType) : UIObjContainForLayout
	{
		var uiContain : UIObjContainForLayout = new UIObjContainForLayout();
		uiContain.AddItem(ObjToUI.Cast(uiObj), 0, UIObjContainForLayout.FillHorizon.Center, UIObjContainForLayout.FillVertical.Center, lockType);
		uiPnt.AddItem(uiContain, index, 1);
		if ( lockType == UIObjContainForLayout.LockType.LockSize || lockType == UIObjContainForLayout.LockType.LockWidth )
			uiPnt.Col(index).Value = uiObj.rect.width;
		return uiContain;
	}
}
