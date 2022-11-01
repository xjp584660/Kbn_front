class TrainItem extends ListItem
{
	public var trainTime:Label;
	public var leftTime:Label;
	
	protected var troopInfo:Barracks.TrainInfo;
	public  var owned:Label;
	public  var seperateLine:Label;
	public  var btnCancel:Button;
	public  var progress:ProgressBar;
	public  var wait:SimpleLabel;
	@SerializeField private  var l_ratio:Label;
	@SerializeField private  var l_progressShine:Label;
	@SerializeField private var ratioBackground1: Label;
	@SerializeField private var ratioBackground2: Label;

	public var ratioBtn:SimpleButton;
	public var ratioIcon:SimpleLabel;
	
	protected var bWait:boolean;
	
	function Init()
	{
//		var arStrings:Object = Datas.instance().arStrings();
		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnSelect.txt = Datas.getArString("Common.Speedup");
		
		if( ratioBackground1 != null )
			ratioBackground1.setBackground("Orange_AndDown_gradient", TextureType.DECORATION);
		if( ratioBackground2 != null )
			ratioBackground2.setBackground("Brown_Gradients", TextureType.DECORATION);
		if(	l_progressShine != null )
			l_progressShine.setBackground("Progress_Glow", TextureType.DECORATION);
	
		
		seperateLine.setBackground("between line_list_small", TextureType.DECORATION);
		progress.setBackground("progress_bar_bottom",TextureType.DECORATION);		
		
		icon.useTile = true;
		
		btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
		btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
		btnSelect.mystyle.border.left = 0;
		btnSelect.mystyle.border.right = 0;
		btnSelect.mystyle.border.top = 0;
		btnSelect.mystyle.border.bottom = 0;

		ratioBtn.SetVisible(false);
		ratioIcon.SetVisible(false);
		ratioBtn.OnClick=MoveCityDialog;
//		
	}
	//使用增产道具
	private function UseBonusTroopItem(){
		MyItems.instance().Use(2501);
	}

	private function MoveCityDialog()
    {
		var confirmStr:String=Datas.getArString("ConscriptHotKey.Confirm");
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setLayout(600,450);
		cd.setTitleY(0);
		cd.setContentRect(70,80,0,100);
		cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
		MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", UseBonusTroopItem, null,true,2501,1);
    }

	public function SetRowData(data:Object)
	{
		troopInfo = data as Barracks.TrainInfo;
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = troopInfo.itemName;
	//	description.txt = data.description;
		owned.txt =  Datas.getArString("Common.Train") + ":" + troopInfo.quant;
		btnSelect.clickParam = troopInfo;
		btnSelect.OnClick = function(param:Object)
		{
		//	MenuMgr.getInstance().PushMenu();
		//	BarrackMenu.instance.ClickTroop(param);
		};
		
		btnCancel.SetVisible(troopInfo.canCancel);

		if (troopInfo.realRatio > 0)
		{
			ratioBackground1.SetVisible(true);
			ratioBackground2.SetVisible(true);
			l_progressShine.SetVisible(true);
			owned.rect.x = l_ratio.rect.x - owned.rect.width - 10;
			// owned.rect.x=410;
			l_ratio.txt = "x" + troopInfo.realRatio.ToString();
			l_ratio.rect.width = 70;

			progress.thumb.setBackground("payment_Progressbar_Orange", TextureType.DECORATION);
			title.SetNormalTxtColor(FontColor.Button_White);

			var techRatio: float = Barracks.instance().GetTechGetIncreaseNumOfBarracks() * 0.0001 + 1;
			if (troopInfo.ratio > 0) {
				owned.image = TextureMgr.instance().LoadTexture("buff_i2501", TextureType.ICON);
			}

		}
		else
		{
			ratioBackground1.SetVisible(false);
			ratioBackground2.SetVisible(false);
			l_progressShine.SetVisible(false);
			owned.rect.x = 430;
			l_ratio.txt = null;
			owned.image = null;
			progress.thumb.setBackground("progress_bar2_rate", TextureType.DECORATION);
			title.SetNormalTxtColor(FontColor.Title);	

		}

		ratioBtn.SetVisible(troopInfo.ratio <= 0);	
		ratioIcon.SetVisible(troopInfo.ratio <= 0);
		
		btnCancel.OnClick = CancelTrain;
		btnSelect.OnClick = SpeedUp;
		bWait = troopInfo.startTime > GameMain.unixtime();
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
	public function SetTrainInfo(info:Barracks.TrainInfo)
	{
		troopInfo = info;
	}
	public function Draw()
	{
		if(troopInfo == null)
			return;
	//	DrawBackGround();
		GUI.BeginGroup(rect);
	//	DrawTitle();
		
		if( troopInfo.startTime <= GameMain.unixtime() )
		{
			if( ratioBackground1!=null )
				ratioBackground1.Draw();
			if( ratioBackground2!=null )
				ratioBackground2.Draw();
			if( l_ratio!=null ) 				
				l_ratio.Draw();
			if( l_progressShine!=null )  
				l_progressShine.Draw();
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
		title.Draw();
		icon.Draw();
		owned.Draw();
		btnCancel.Draw();
		seperateLine.Draw();
		ratioBtn.Draw();
		ratioIcon.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	function CancelTrain(param:Object)
	{
//		_Global.Log("cancel trainning");
		
		var	okCallback:Function = function(){
			MenuMgr.getInstance().sendNotification(Constant.Notice.CANCEL_TRAINING, null);
		};
		
		Barracks.instance().removeTraining(troopInfo.id, troopInfo.cityId , troopInfo.itemType, 
										troopInfo.quant, troopInfo.endTime, troopInfo.startTime, 
										troopInfo.needed, okCallback);
	}
	
	function SpeedUp(param:Object)
	{
		MenuMgr.getInstance().PushMenu("SpeedUpMenu",troopInfo, "trans_zoomComp");
	}
	
	function Update()
	{
		if(troopInfo != null && troopInfo.startTime <= GameMain.unixtime() )
		{
			var time:long = troopInfo.timeRemaining;
			leftTime.txt = _Global.timeFormatStr(time);
			progress.SetCurValue(troopInfo.needed - troopInfo.timeRemaining);
		}else{
			ratioBtn.SetVisible(false);	
			ratioIcon.SetVisible(false);
		}
	}
}

