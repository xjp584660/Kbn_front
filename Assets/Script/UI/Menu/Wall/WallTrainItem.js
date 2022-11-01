class WallTrainItem extends ListItem
{
	
	public var trainTime:Label;
	public var leftTime:Label;
	
	protected var troopInfo:Walls.TrainInfo;
	public  var owned:Label;
	public  var seperateLine:Label;
	public  var btnCancel:Button;
	public  var progress:ProgressBar;
	public  var wait:SimpleLabel;
//	protected var bWait:boolean;

	function Init()
	{
//		var arStrings:Object = Datas.instance().arStrings();
		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnSelect.txt = Datas.getArString("Common.Speedup");
		btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
		btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew", TextureType.BUTTON);
		icon.useTile = true;
		
		seperateLine.setBackground("between line_list_small", TextureType.DECORATION);
		seperateLine.rect.height = 4;
		progress.setBackground("progress_bar_bottom",TextureType.DECORATION);
//		icon.tile.spt = TextureMgr.instance().UnitSpt();
	}
	
	public function SetRowData(data:Object)
	{
		troopInfo = data as Walls.TrainInfo;
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = troopInfo.itemName;
	//	description.txt = data.description;
		owned.txt =  Datas.getArString("Common.Train") + ":" + troopInfo.quant;
		btnSelect.clickParam = troopInfo;
//		btnSelect.OnClick = function(param:Object)
//		{
//		//	MenuMgr.getInstance().PushMenu();
//		//	BarrackMenu.instance.ClickTroop(param);
//		};
		
		btnCancel.SetVisible(troopInfo.canCancel);
		btnCancel.OnClick = CancelTrain;
		btnSelect.OnClick = SpeedUp;
//		bWait = troopInfo.startTime > GameMain.unixtime();
		trainTime.txt = _Global.timeFormatStr(troopInfo.needed);
		var iconPath:String = "ui_"+ troopInfo.itemType;
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		icon.tile = TextureMgr.instance().UnitSpt().GetTile(iconPath);
		//icon.tile.name = iconPath;
		progress.Init(troopInfo, 0, troopInfo.needed);
		//description.txt = data.description;
		description.txt = trainTime.txt;
		wait.txt = Datas.getArString("OpenBarracks.TroopsWaitTraining");
	}
	
	public function Draw()
	{
		if(troopInfo == null)
			return;
	//	DrawBackGround();
		GUI.BeginGroup(rect);
	//	DrawTitle();
		title.Draw();
		icon.Draw();		
		
		owned.Draw();
		
		if( troopInfo.startTime <= GameMain.unixtime() )
		{
			btnSelect.Draw();
			progress.Draw();			
			leftTime.Draw();
		}
		else
		{	
			description.Draw();
		//	trainTime.Draw();
			wait.Draw();
		}
		btnCancel.Draw();
		seperateLine.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	function CancelTrain(param:Object)
	{
//		_Global.Log("cancel trainning");

		var	okCallback:Function = function(){
			MenuMgr.getInstance().sendNotification(Constant.Notice.CANCEL_TRAINING, null);
		};
		
		Walls.instance().removeFortifications(troopInfo.id, troopInfo.cityId , troopInfo.itemType, troopInfo.quant, 
										troopInfo.endTime, troopInfo.startTime, troopInfo.needed, okCallback);
	}
	
	function SpeedUp(param:Object)
	{
		MenuMgr.getInstance().PushMenu("SpeedUpMenu",troopInfo, "trans_zoomComp");
	}
	
	function Update()
	{
		if( troopInfo.startTime <= GameMain.unixtime() )
		{
//			_Global.Log("id:" + troopInfo.id + "quant:" + troopInfo.quant + " starttime:" + troopInfo.startTime + " unixtime:" + GameMain.unixtime());
			var time:long = troopInfo.timeRemaining;
			leftTime.txt = _Global.timeFormatStr(time);
			progress.SetCurValue(troopInfo.needed - troopInfo.timeRemaining);
		}	
	}
}

