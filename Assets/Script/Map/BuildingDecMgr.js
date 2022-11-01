class BuildingDecMgr
{
	class DecrationInfor
	{
		public var slotId:int;
		public var buildingType:int;
		public var textureName:String;
		public var sceneLevel:int;
		public var priority:int;
	}


	private var decDic: System.Collections.Generic.Dictionary.<int, DecrationInfor>;

	public static var instance:BuildingDecMgr;
	
	public function BuildingDecMgr()
	{
		decDic = new System.Collections.Generic.Dictionary.<int, DecrationInfor>();
	}

	public static function getInstance():BuildingDecMgr
	{
		if(instance == null)
		{
			instance = new BuildingDecMgr();
		}
		
		return instance;
	}
	
	public function addDecration(infor:DecrationInfor):void	
	{
		if (!decDic.ContainsKey(infor.buildingType))
		{
			decDic.Add(infor.buildingType, infor);
			
			var controller:SlotBuildController = chooseController(infor.sceneLevel);	
			if(controller != null)
			{
				controller.showDecration(infor, null);
			}
		}
	}
	
	public function delDecration(buildingType:int):void
	{
		if (decDic.ContainsKey(buildingType))
		{
			var dec: DecrationInfor = decDic[buildingType];

			//if(dec.slotId < 0)
			//{
			//	dec.slotId = Building.instance().getPositionForType(dec.buildingType);
			//}

			var controller:SlotBuildController = chooseController(dec.sceneLevel);
			if(controller != null)
			{
				controller.hideDecration(dec, null);
			}
			
			decDic.Remove(buildingType);
		}
	}
	
	private function chooseController(sceneLevel:int):SlotBuildController
	{
		var controller:SlotBuildController;
		switch(sceneLevel)
		{
			case GameMain.CITY_SCENCE_LEVEL:
				controller = GameMain.instance().getCityController();
				break;
			case GameMain.FIELD_SCENCE_LEVEL:
				controller = GameMain.instance().getFieldController();
				break;
		}
		
		return controller;		
	}
	
	public function needDecration(buildingType:int):DecrationInfor
	{
		var dec:DecrationInfor;
		if (decDic.ContainsKey(buildingType))
		{
			dec = decDic[buildingType];
		}
		
		return dec;
	}

	
	public function checkIsConditionReach(buildingType:int):void
	{
		switch(buildingType)
		{
			case Constant.Building.BLACKSMITH:
			case Constant.Building.GENERALS_QUARTERS:
				checkForGearSys();
				break;
		}
	}

	private var gearDecoInforKey:String = "gearDecoInfor";
	private function saveGearDecoInfor(infoArr:Array):void
	{
		if(infoArr.length == Enum.GetNames(typeof(GearDecoType)).Length)
		{
			PlayerPrefs.SetString(gearDecoInforKey, infoArr.Join(","));
		}
	}

    // TODO: This part needs refactoring!!
	private function getGearDecoInfor():Array
	{
		var arr:Array = new Array();
		var str:String = PlayerPrefs.GetString(gearDecoInforKey, "");
		
		arr = str.Split(","[0]);
		
        while (arr.length < Enum.GetNames(typeof(GearDecoType)).Length)
        {
            arr.Push("0");
        }
        
		return arr;
	}

	enum GearDecoType
	{
		GearSystem = 0,
		GearSwallow,
		GearStrengthen,
		GearMount
		//GearReset
	}
	
	public function deleteDecoWithType(gearDecoType:int):void
	{
		var arrInfor:Array = getGearDecoInfor();
		
		switch(gearDecoType)				
		{
			case GearDecoType.GearSystem:
				delDecration(Constant.Building.GENERALS_QUARTERS);
				break;
			case GearDecoType.GearSwallow:
			case GearDecoType.GearStrengthen:
			case GearDecoType.GearMount:
			//case GearDecoType.GearReset:
				delDecration(Constant.Building.BLACKSMITH);
				break;
		}
		
		arrInfor[gearDecoType] = "1";
		
		saveGearDecoInfor(arrInfor);
		
		checkForGearSys();
	}
	
	public function resetDecoForGear():void
	{
		delDecration(Constant.Building.GENERALS_QUARTERS);
		delDecration(Constant.Building.BLACKSMITH);
	}
	
	public function addWorldBossDecration() : void
	{
		var decInfor:DecrationInfor = new BuildingDecMgr.DecrationInfor();
		decInfor.buildingType = Constant.Building.NOTICEPAD;
		decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
		decInfor.slotId = Constant.Building.NOTICEPAD;
		decInfor.textureName = "RoundTower_icon2";
		addDecration(decInfor);
	}
	
	public function delWorldBossDecration() : void 
	{
		delDecration(Constant.Building.NOTICEPAD);
	}

	public function checkForHospitalHaveWounded() : void
	{
		var wounded : System.Collections.Generic.List.<HospitalMenu.WoundedInfo> = HospitalMenu.GetWoundedInHospital();
		if ( wounded.Count == 0 )
		{
			delDecration(Constant.Building.HOSPITAL);
			return;
		}

		var decInfor:DecrationInfor = new BuildingDecMgr.DecrationInfor();
		decInfor.buildingType = Constant.Building.HOSPITAL;
		decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
		decInfor.slotId = -1;
		decInfor.textureName = "Hospital_icon1";
		addDecration(decInfor);
		return;
	}

	public function checkForGearSys():void
	{		
		var arrInfor:Array = getGearDecoInfor();
		var decInfor:DecrationInfor;

		if(arrInfor[GearDecoType.GearSystem] != "1")
		{
			if(GearSysController.IsOpenGearSys() && GearSysController.IsGearSysUnlocked())
			{
				decInfor = new BuildingDecMgr.DecrationInfor();
				decInfor.buildingType = Constant.Building.GENERALS_QUARTERS;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.GENERALS_QUARTERS);	
				addDecration(decInfor);				
			}
		}
		
		if(arrInfor[GearDecoType.GearSwallow] != "1")
		{
			if(GearSysController.IsOpenSwallow() && GearSysController.IsSwallowUnlocked())
			{
				decInfor = new BuildingDecMgr.DecrationInfor();
				decInfor.buildingType = Constant.Building.BLACKSMITH;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);	
				addDecration(decInfor);				
			}			
		}
		
		if(arrInfor[GearDecoType.GearStrengthen] != "1")
		{
			if(GearSysController.IsOpenStrengthen() && GearSysController.IsStrengthenUnlocked())
			{
				decInfor = new BuildingDecMgr.DecrationInfor();
				decInfor.buildingType = Constant.Building.BLACKSMITH;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);	
				addDecration(decInfor);
			}			
		}

		if(arrInfor[GearDecoType.GearMount] != "1")
		{
			if(GearSysController.IsOpenMount() && GearSysController.IsMountUnlocked())
			{
				decInfor = new DecrationInfor();
				decInfor.buildingType = Constant.Building.BLACKSMITH;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);	
				addDecration(decInfor);				
			}			
		}
		/*
		if(arrInfor[GearDecoType.GearReset] != "1")
		{
			if(GearSysController.IsOpenGacha() && GearSysController.IsGachaUnlocked())
			{
				decInfor = new DecrationInfor();
				decInfor.buildingType = Constant.Building.BLACKSMITH;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);	
				addDecration(decInfor);				
			}			
		}
		*/

	}
}