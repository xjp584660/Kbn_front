
class WallTrainTroop extends SubMenu
{
	public var attack:StarRating;
	public var health:StarRating;
	public var load:Label;
//	public var speed:Label;
	public var owned:Label;
	public var slider:Slider;

	public var trainCount:InputText;
	
	public var btnTrain:Button;
	public var trainTime:Label;
	public var icon:Label;
	public var troopName:Label;
	public var trainLabel:Label;
	public var LimitLabel:Label;
	
	public var unitUnlock:SimpleLabel;
	
	public var reqCon:RequireContent;
//	public var tab:ToolBar;
	protected var troopInfo:Walls.TroopInfo;
	protected var maxTroop:int;
	
//	protected var selectedTab:int = 0;
	protected var lastTab:int = 0;
	private   var bValide:boolean;
	
	public var description:SimpleLabel;
	public var propertyBack:SimpleLabel;
//	public var trainAreaBack:SimpleLabel;
	public var trainAreaBorder:SimpleLabel;
	public var win:Label;
	public var lose:Label;
	public var level:StarRating;
	public var l_type:Label;
	public var l_ribbon:Label;
	
	private   var trainNum:int;
	
	
	public	function	Init(){
		var train:String = Datas.getArString("Common.Train");
		unitUnlock.txt = Datas.getArString("Common.UnitLocked");
		btnTrain.txt = train;
		btnTrain.OnClick = Train;
		
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
		
		trainCount.type = TouchScreenKeyboardType.NumberPad;
		trainCount.filterInputFunc = handlerFilterInputFunc;
		trainCount.inputDoneFunc = handlerInputDoneFunc;
		trainCount.Init();
		
		slider.valueChangedFunc = handlerSliderValueChanged;
		
		reqCon.Init();
		icon.useTile = true;
		icon.tile = TextureMgr.instance().UnitSpt().GetTile(null);
		reqCon.scroll.SetResposeAngle(60.0);
		l_type.useTile = true;
		l_type.drawTileByGraphics = true;
		l_type.tile = TextureMgr.instance().UnitSpt().GetTile(null);
		level.Text = "";
		
		l_ribbon.useTile = true;
		l_ribbon.tile = TextureMgr.instance().UnitSpt().GetTile("level_system_bg");
		//l_ribbon.TileName = "level_system_bg";
		//l_ribbon.tile.SetSpriteEdge(1);
		l_ribbon.drawTileByGraphics = true;
		
//		trainAreaBack.setBackground("square_black",TextureType.DECORATION);
		trainAreaBorder.setBackground("square_blackorg",TextureType.DECORATION);
	}
	
	protected function handlerSliderValueChanged(val:long)
	{
		trainCount.txt = "" + val;
	}
	
	public function OnPush(param:Object)
	{
//		var	arStrings:Object = Datas.instance().arStrings();
		troopInfo = param as Walls.TroopInfo;
		
		attack.Text = Datas.getArString("Common.Attack")+ ": ";
		if(troopInfo.attackRate == 0)
		{
			attack.Text = attack.Text + "-";
		}
		attack.Rate = troopInfo.attackRate;
		health.Text = Datas.getArString("Common.Life")  + ": ";
		if(troopInfo.lifeRate == 0)
		{
			health.Text = health.Text + "-";
		}
		health.Rate = troopInfo.lifeRate;//Mathf.Ceil(troopInfo.health/200.0);
		load.txt = Datas.getArString("Common.Might") + ":" + troopInfo.might;
//		speed.txt = ":" + param.speed;
		troopInfo.requirements = Utility.instance().checkreq("f", troopInfo.typeId, 1);
		reqCon.showRequire(troopInfo.requirements.ToBuiltin(typeof(Requirement)));
		bValide = reqCon.req_ok;
		troopName.txt = troopInfo.troopName;
		
		trainLabel.txt = Datas.getArString("Common.Train");
		
		maxTroop = Walls.instance().trainMax(troopInfo.typeId);
		LimitLabel.txt = Datas.getArString("Common.Limit") + ":" + maxTroop;
		trainNum = maxTroop;
		
		trainCount.txt = "" + maxTroop;
		owned.txt = Datas.getArString("Common.youOwn") + "\n" + troopInfo.owned;
		slider.Init(maxTroop);
		slider.SetCurValue(maxTroop);
		
		var iconPath:String = "ui_"+ troopInfo.typeId;
	//	icon.image = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		icon.tile.name = iconPath;
		trainNum =  slider.GetCurValue();
		var time:int = Walls.instance().trainTime(troopInfo.typeId, trainNum);
		trainTime.txt = _Global.timeFormatStr( time);
		
		btnBack.OnClick = function( parram:Object )
		{
			var wallMenu:WallMenu = MenuMgr.getInstance().getMenu("WallMenu") as WallMenu;
			if( wallMenu ){
				wallMenu.PopSubMenu();
			}
		};
		
		description.txt = troopInfo.description;
		
		var startY:int = lose.rect.y;
		if(Datas.getArString("fortCharacter."+"f"+troopInfo.typeId + "_lose"))
		{
			lose.txt = Datas.getArString("fortCharacter."+"f"+troopInfo.typeId + "_lose");
			lose.rect.height = lose.GetTxtHeight();
			startY += lose.rect.height + 5;
		}
		else
		{
			lose.txt = "";
		}
		
		if(Datas.getArString("fortCharacter."+"f"+troopInfo.typeId + "_win"))
		{
			win.txt = Datas.getArString("fortCharacter."+"f"+troopInfo.typeId + "_win");
			win.rect.y = startY;
			win.rect.height = win.GetTxtHeight();
		}
		else
		{
			win.txt = "";
		}
		
		level.Rate = troopInfo.level;
		l_type.tile.name = "troop_type"+ troopInfo.actType;
		level.rect.x = 505 + (70 - level.starWidth*troopInfo.level)/2;
	}
	
	function DrawItem()
	{
		troopName.Draw();
		description.Draw();
		btnBack.Draw();
//		trainAreaBack.Draw();
		
		trainAreaBorder.Draw();	
		
		DrawStats();
	   	if(!troopInfo.bLocked)
	    {
			DrawTrainArea();
		}else {
			unitUnlock.Draw();
		}
		icon.Draw();
		l_ribbon.Draw();
		l_type.Draw();
		level.Draw();
		reqCon.Draw();	
	}
		
	function DrawStats()
	{
		attack.Draw();
		health.Draw();
		load.Draw();
		lose.Draw();
		win.Draw();
//		speed.Draw();
	}
	
	function DrawTrainArea()
	{
		
		trainLabel.Draw();
		LimitLabel.Draw();
		slider.Draw();

		//trainCount.txt =  "" + slider.GetCurValue();
		trainCount.Draw();
		
		
		btnTrain.Draw();
		
		trainTime.Draw();
		owned.Draw();
		
	}
	
	function DrawBackground()
	{
		propertyBack.Draw();//GUI.Box( Rect(0, 0, rect.width, rect.height), background);
	}
	
	function Train(param:Object)
	{
		if(slider.GetCurValue() <= 0)
			return;
			
		var	okCallback:Function = function(){
			MenuMgr.getInstance().OnTrain();
			MenuMgr.getInstance().UpdateTrainProgress();
		};
		Walls.instance().trainDefense(troopInfo.typeId, slider.GetCurValue(), 0, okCallback);
	}
	
	function Update()
	{
		if(trainNum !=  slider.GetCurValue())
		{
			trainNum =  slider.GetCurValue();
			var time:int = Walls.instance().trainTime(troopInfo.typeId, trainNum);
			trainTime.txt = _Global.timeFormatStr(time);
		}
		reqCon.ForceUpdate(true);
	}
	
	function UpdateData()
	{
		if(!troopInfo)
			return;
		
		maxTroop = Walls.instance().trainMax(troopInfo.typeId);
		slider.Init(maxTroop);
		slider.SetCurValue(maxTroop);
	}
	
	protected function handlerFilterInputFunc(oldStr:String,newStr:String):String
	{
		var input = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input != "")
		{
			count = _Global.INT64(input);
		}
		count = count <= 0 ? 0:count;
		count = count > maxTroop ? maxTroop : count;
		slider.SetCurValue(count);
		return count == 0 ? "":"" + count;
	}
	
	public function handlerInputDoneFunc(input:String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			slider.SetCurValue(0);
			trainCount.txt = "0";
			return "0";
		}
		else
		{
			return input;
		}
	}
	
	public	function	Clear()
	{
		reqCon.Clear();
	}
}

