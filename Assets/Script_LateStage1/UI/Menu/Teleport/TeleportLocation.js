class TeleportLocation extends PopMenu
{

	public var xLabel:SimpleLabel;
	public var yLabel:SimpleLabel;
	public var xField:TextField;
	public var yField:TextField;
	
	public var btnSubmit:Button;
	public var btnCancel:Button;
	public var notify:SimpleLabel;
	public var newCoord:SimpleLabel;

	public var curCoord:SimpleLabel;
	public var icon:Label;
	
	public var line:SimpleLabel;
	private var m_itemID : int;
	
	function Init()
	{
		super.Init();
//		var arStrings:Object = Datas.instance().arStrings();
		btnSubmit.txt = Datas.getArString("Common.Submit");
		btnCancel.txt = Datas.getArString("Common.Cancel_Button");
		btnCancel.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PopMenu("");
		};
		btnSubmit.OnClick = function(param:Object)
		{
			var confirmStr:String = Datas.getArString("Teleport.TeleportConfirm");
			confirmStr = confirmStr + "\n" + "(" + xField.txt + "," +  yField.txt+")";
			
			var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
//			cd.setDefautLayout();
			cd.setLayout(600,380);
//			cd.setContentRect(30,19,540,342);
			cd.setTitleY(120);
			cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
			MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", StartTeleport, null);
		};
		xLabel.txt = Datas.getArString("Common.X");
		yLabel.txt = Datas.getArString("Common.Y");
		newCoord.txt = Datas.getArString("Common.NewCoordinates");
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i912", TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i912");	
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile("i912");
		//icon.tile.name = "i912";
		icon.drawTileByGraphics = true;
		notify.txt = Datas.getArString("Teleport.TeleportCondition");
		title.txt = Datas.getArString("itemName.i912");
		
		if(RuntimePlatform.Android == Application.platform)
		{
			xField.type = TouchScreenKeyboardType.NumberPad;
			yField.type = TouchScreenKeyboardType.NumberPad;
			xField.hidInput = false;
			yField.hidInput = false;
		}
	}
	
	function DrawItem()
	{
		icon.Draw();
		curCoord.Draw();
		line.Draw();
		newCoord.Draw();
		xLabel.Draw();
		yLabel.Draw();
		xField.Draw();
		yField.Draw();
		notify.Draw();
		btnSubmit.Draw();
		btnCancel.Draw();
	}
	
	function OnPush(param:Object)
	{
		var itemID : int = param;
		m_itemID = itemID;
		var iconTileName = Datas.instance().getImageName(itemID);
		if( iconTileName == "" )
			iconTileName = "i"+ itemID.ToString();
		icon.tile.name = iconTileName;
		title.txt = Datas.getArString("itemName.i" + itemID.ToString());

	//	var arStrings:Object = Datas.instance().arStrings();
		var curCityId:int = GameMain.instance().getCurCityId();
		var cityInfo:HashObject = GameMain.instance().GetCityInfo(curCityId);
		var citycoord:String;
		if(cityInfo)
		{
			citycoord = "(" + cityInfo[_Global.ap+2].Value + ", "+ cityInfo[_Global.ap+3].Value+")";	
		}
		curCoord.txt = Datas.getArString("Common.CurrentCoordinates") + "\n" + citycoord;
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i912", TextureType.ICON_ITEM);
	}
	
	function Update()
	{
		CheckCoordinate(xField);	
		CheckCoordinate(yField);				
	}
	
	private function CheckCoordinate( checkField:TextField )
	{

		if( checkField.txt == null || checkField.txt.Length < 1 ){
			checkField.txt = "1";
		}else{
			var intValue:int ;
			int.TryParse(checkField.txt,intValue);
			
			if( intValue <= 0 ){
				checkField.txt = "1";
			}else if( intValue > Constant.Map.WIDTH ){
				checkField.txt = "" + Constant.Map.WIDTH;
			}
		}
	}
	
	function StartTeleport()
	{
		var x:int = _Global.INT32(xField.txt);
		var y:int = _Global.INT32(yField.txt);
		MyItems.instance().useTeleportDo(m_itemID, x, y);
	}
}

