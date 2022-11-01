
class TrainTroop extends SubMenu
{
	public var attack:StarRating;
	public var health:StarRating;
	public var load:Label;
	public var speed:Label;
	public var owned:Label;
	public var slider:Slider;
	
	public var trainCnt:InputText;
	
	public var btnTrain:Button;
	public var trainTime:Label;
	public var icon:Label;
	public var troopName:Label;
	
	public var description:SimpleLabel;
	public var propertyBack:SimpleLabel;
	public var trainAreaBack:SimpleLabel;
//	public var trainAreaBorder:SimpleLabel;
	public var reconBack:SimpleLabel;
	public var unitUnlock:SimpleLabel;
	public var reqCon:RequireContent;
	public var tab:ToolBar;
	public var win:Label;
	public var lose:Label;
	public var upkeepTitle:Label;
	public var upkeep:Label;
	public var might:Label;
	public var level:StarRating;
	public var l_type:Label;
	public var l_ribbon:Label;
	protected var troopInfo:Barracks.TroopInfo;
	protected var maxTroop:int;
	
	protected var selectedTab:int = 0;
	protected var lastTab:int = 0;
	private   var bValide:boolean;
	private   var trainNum:	long; 
	
	// protected var confirmDialog:ConfirmDialog;
//	function Start()
//	{
//		super.Start();
//		Init();
//	}
	
	function Init()
	{
		// confirmDialog = MenuMgr.getInstance().getConfirmDialog(); 
		
		var train:String = Datas.getArString("Common.Train");
	//	btnTrain.txt = Datas.getArString("Common.Train");
		var dismiss:String = Datas.getArString("Common.Dismiss");
		tab.toolbarStrings = [train, dismiss];
		unitUnlock.txt = Datas.getArString("Common.UnitLocked");
		upkeepTitle.txt = Datas.getArString("Common.UpKeep") + ": ";
		upkeep.rect.x = upkeepTitle.rect.x + upkeepTitle.GetWidth() + 10;
		btnTrain.txt = train;
		btnTrain.OnClick = Train;
        reqCon.setMaxShowNum(5);
		reqCon.Init();
		reqCon.setFrameVisible(true);
		tab.Init();
		
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btnBack.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btnBack.rect.width = 85;
		}
		else
		{
			btnBack.rect.width = 75;
		}
		btnBack.rect.height = 64;
//		trainAreaBorder.setBackground("frame_metal_square", TextureType.DECORATION);
		
		
		if(RuntimePlatform.Android == Application.platform)
		{
			trainCnt.hidInput = false;
			trainCnt.type = TouchScreenKeyboardType.NumberPad;
		}
		trainCnt.filterInputFunc = handlerFilterInputFunc;
		trainCnt.inputDoneFunc = handlerInputDoneFunc;
		trainCnt.Init();
		
		slider.valueChangedFunc = handlerSliderValueChanged;
		icon.useTile = true;
//		icon.tile.spt = TextureMgr.instance().UnitSpt(); // 
		reqCon.scroll.SetResposeAngle(60.0);
		tab.indexChangedFunc = ChangeTab;
		l_type.useTile = true;
		l_type.drawTileByGraphics = true;
		l_type.tile = TextureMgr.instance().UnitSpt().GetTile(null);
		level.Text = "";
		
		l_ribbon.useTile = true;
		l_ribbon.tile = TextureMgr.instance().UnitSpt().GetTile("level_system_bg");
		//l_ribbon.TileName = "level_system_bg";
		//l_ribbon.tile.SetSpriteEdge(1);
		l_ribbon.drawTileByGraphics = true;
		troopInfo = null;
	}
	
	public function OnPush(param:Object)
	{
//		var startTime:long  = GameMain.unixtime();
		troopInfo = param as Barracks.TroopInfo;
//		var arStrings:Object = Datas.instance().arStrings();
	//	attack.txt = Datas.getArString("Common.Attack")+ ": " + param.attack;
		attack.Text = Datas.getArString("Common.Attack")+ ": ";
		if( troopInfo.attackRate == 0)
		{
			attack.Text = attack.Text + "-";
		}
		attack.Rate = troopInfo.attackRate;//troopInfo.attack/100;

		health.Text = Datas.getArString("Common.Life") + ": " ;
		if(troopInfo.lifeRate == 0)
		{
			health.Text = health.Text + "-";
		}
		health.Rate = troopInfo.lifeRate;//Mathf.Ceil(troopInfo.health/200.0);
		load.txt = Datas.getArString("Common.Load") + ": " + troopInfo.load;
		speed.txt = Datas.getArString("Common.Speed") + ": " + troopInfo.speed;
		might.txt = Datas.getArString("Common.Might") + ": " + troopInfo.might;
		upkeep.txt = troopInfo.upkeep.ToString();
		troopInfo.requirements = Utility.instance().checkreq("u", troopInfo.typeId, 1);
		reqCon.showRequire(troopInfo.requirements, true);
		bValide = reqCon.req_ok;
		troopName.txt = troopInfo.troopName;
		maxTroop = Barracks.instance().trainMax(troopInfo.typeId);
		trainNum = maxTroop;
		trainCnt.txt = "" + maxTroop;
		owned.txt = Datas.getArString("Common.youOwn") + "\n" + troopInfo.owned;
		slider.Init(maxTroop);
		slider.SetCurValue(maxTroop);

		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();

		var troopId : String = troopInfo.typeId.ToString();
		var iconPathH : String = String.Format("ui_{0}_H", troopId);
		icon.tile = iconSpt.FindTile(iconPathH);
		if ( icon.tile == null )
		{
			var iconPath : String = String.Format("ui_{0}", troopId);
			icon.tile = iconSpt.GetTile(iconPath);
		}

	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		
		//icon.tile.name = iconPath;
		
		trainNum =  slider.GetCurValue();
		var time:int = Barracks.instance().trainTime(troopInfo.typeId, trainNum);
		trainTime.txt = _Global.timeFormatStr( time);
		btnBack.OnClick = function( parram:Object )
		{
//			BarrackMenu.instance.PopSubMenu();
			var barrackMenu:BarrackMenu = MenuMgr.getInstance().getMenu("BarrackMenu") as BarrackMenu;
			if( barrackMenu ) {
				barrackMenu.PopSubMenu();
			}
		};
		tab.SelectTab(0);
		trainTime.SetVisible(true);

		btnTrain.OnClick = Train;
		btnTrain.txt = Datas.getArString("Common.Train");
		slider.Init(maxTroop);
		slider.SetCurValue(maxTroop);
		trainCnt.txt = "" + maxTroop;

		
//		_Global.Log("train push time:"+ (GameMain.unixtime() - startTime) );
		description.txt = troopInfo.description;
		var startY:int = lose.rect.y;
		if(Datas.IsExistString("UnitCharacter.u"+troopInfo.typeId + "_lose"))
		{
			lose.txt = Datas.getArString("UnitCharacter.u"+troopInfo.typeId + "_lose");
			lose.rect.height = lose.GetTxtHeight();
			startY += lose.rect.height + 5;
		}
		else
		{
			lose.txt = "";
		}
		
		if(Datas.IsExistString("UnitCharacter.u"+troopInfo.typeId + "_win"))
		{
			win.txt = Datas.getArString("UnitCharacter.u"+troopInfo.typeId + "_win");
			win.rect.y = startY;
			win.rect.height = win.GetTxtHeight();
		}
		else
		{
			win.txt = "";
		}
		level.Rate = troopInfo.level;
		l_type.TileName = "troop_type"+ troopInfo.actType;
	}

	function DrawItem()
	{
		troopName.Draw();
		description.Draw();
		btnBack.Draw();
		
		trainAreaBack.Draw();
		
		DrawStats();
		
		DrawTab();
		DrawTrainArea();

		icon.Draw();
		l_ribbon.Draw();
		l_type.Draw();
		level.Draw();
		if(tab.selectedIndex == 0 || troopInfo.bLocked)
		{
			reqCon.Draw();				
		}	
		
//		trainAreaBorder.Draw();

	}
	
	function DrawTab()
	{
		selectedTab = tab.Draw();
	}	
	
	function ChangeTab()
	{
		if(tab.selectedIndex == 0 )
		{
				btnTrain.OnClick = Train;
				btnTrain.txt = Datas.getArString("Common.Train");
				slider.Init(maxTroop);
				slider.SetCurValue(maxTroop);
				trainCnt.txt = "" + maxTroop;
				trainTime.SetVisible(true);
		}
		else
		{
				btnTrain.OnClick = DisMiss;
				btnTrain.txt = Datas.getArString("Common.Dismiss");
				slider.Init(troopInfo.owned);
				slider.SetCurValue(0);
				trainCnt.txt = "0";
				trainTime.SetVisible(false);
		}	
	}
	function DrawStats()
	{
		attack.Draw();
		health.Draw();
		load.Draw();
		speed.Draw();
		upkeepTitle.Draw();
		upkeep.Draw();
		might.Draw();
		lose.Draw();
		win.Draw();
	}
	
	function DrawTrainArea()
	{
		if(bValide || tab.selectedIndex == 1)
		{
			slider.Draw();
			//trainCnt.txt = "" + slider.GetCurValue();
	
			trainCnt.Draw();
			
			btnTrain.Draw();
			if(tab.selectedIndex == 0 )
				trainTime.Draw();
			owned.Draw();
		}		
		else
		{
			unitUnlock.Draw();
		}		
	}
	
	function Update()
	{
		if(trainNum !=  slider.GetCurValue())
		{
			trainNum =  slider.GetCurValue();
			var time:int = Barracks.instance().trainTime(troopInfo.typeId, trainNum);
			trainTime.txt = _Global.timeFormatStr(time);
		}
		reqCon.ForceUpdate(true);
	}
	
	function DrawBackground()
	{
//		GUI.Box( Rect(0, 0, rect.width, rect.height), background);
		propertyBack.Draw();

	}
	
	function Train(param:Object)
	{
		if(slider.GetCurValue() <= 0)
			return;
		
		var	okCallback:Function = function(){
			MenuMgr.getInstance().OnTrain();
			MenuMgr.getInstance().UpdateTrainProgress();
		};
		
		Barracks.instance().trainUnit(troopInfo.typeId, slider.GetCurValue(), 0, okCallback);
	}
	
	function DisMiss(param:Object)
	{
		if(slider.GetCurValue() <= 0)
			return; 
		
		// setConfirmDialogLayout();
		// confirmDialog.setButtonText(Datas.getArString("Common.Dismiss"), Datas.getArString("Common.Cancel") );
		// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("MessagesModal.DismissTroops"),"",Confirm_Dismiss,null);
			
		var confirmDialog:ConfirmDialog = PushCustomDialog(Datas.getArString("MessagesModal.DismissTroops"),"",Confirm_Dismiss,null);
		confirmDialog.setButtonText(Datas.getArString("Common.Dismiss"), Datas.getArString("Common.Cancel") );
	}
	
	function UpdateData()
	{
	
		if(!troopInfo)
			return;
		if(tab.selectedIndex == 0 )
		{
			maxTroop = Barracks.instance().trainMax(troopInfo.typeId);
			btnTrain.OnClick = Train;
			slider.Init(maxTroop);
			slider.SetCurValue(trainNum);
			trainCnt.txt = "" + trainNum;
		}
		else
		{
			btnTrain.OnClick = DisMiss;
			slider.Init(troopInfo.owned);
			slider.SetCurValue(0);
			trainCnt.txt = "0";
			owned.txt = Datas.getArString("Common.youOwn") + "\n" + troopInfo.owned;
		}
	}
	protected function handlerSliderValueChanged(val:long)
	{
		trainCnt.txt = "" + val;
	}
	protected function handlerFilterInputFunc(oldStr:String,newStr:String):String
	{	
		var max:long = maxTroop;
		if(tab.selectedIndex != 0 )
		{
			max = troopInfo.owned;
		}
		var input = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input != "")
		{
			count = _Global.INT64(input);
		}
		count = count <=0 ? 0:count;
		count = count >= max ? max : count;
		slider.SetCurValue(count);
		return count <= 0 ? "": "" + count;
	}
	public function handlerInputDoneFunc(input:String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			slider.SetCurValue(0);
			trainCnt.txt = "0";
			return "0";
		}
		else
		{
			return input;
		}
	}
	
	protected function PushCustomDialog(content:String, title:String, okFun:System.Action.<System.Object>, cancelFun:System.Action.<System.Object>):ConfirmDialog
	{
		var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		
		confirmDialog.setLayout(600,320);		
		confirmDialog.setContentRect(70,75,0,140);
		confirmDialog.setDefaultButtonText(); 
		
		MenuMgr.getInstance().PushConfirmDialog(content, title, okFun, cancelFun); 
		return confirmDialog;
	}
	
	// protected function setConfirmDialogLayout():void
	// {
	// 	confirmDialog.setLayout(600,320);		
	// 	confirmDialog.setContentRect(70,75,0,140);
	// 	confirmDialog.setDefaultButtonText();
	// }
	
	protected function Confirm_Dismiss():void
	{
		MenuMgr.getInstance().PopMenu("");
		Barracks.instance().dismissDo (troopInfo.typeId, slider.GetCurValue());
	}
	
	public	function	Clear()
	{
		reqCon.Clear();
	}
}

