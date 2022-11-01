
class	WallTroops extends	UIObject{
	public var introBg:SimpleLabel;
	public var limit1:SimpleLabel;
	public var limit2:SimpleLabel;
	public var limit3:SimpleLabel;
	
	public var limitDesc:SimpleLabel;
	
	
	public var troopList:ScrollList;
	public var troopItem:ListItem;
	public var troopData:Array;
	
	public	function	Init(){
		troopItem.Init();
		troopList.Init(troopItem);
		troopData = Walls.instance().GetTroopListInCurCity().slice(0);
		troopData.Sort(Walls.TroopInfo.CompareByLevelAndType);
	}
	
//	public	function	InitAfterChangeCity(){
//		troopData = Walls.instance().GetTroopList();
//	}
	
	public	function	Update(){
		troopList.Update();
	}
	
	public	function	Draw(){
		GUI.BeginGroup(rect);
			introBg.Draw();
			limit1.Draw();
			limit2.Draw();
			limit3.Draw();
			limitDesc.Draw();
			troopList.Draw();
		GUI.EndGroup();
	}
	
	public	function	UpdateData(){
		troopList.UpdateData();
		updateLimit();
	}
	
	public	function	checRequirement(){
		var common:Utility = Utility.instance();
		for(var i:int = 0; i < troopData.length; i++)
		{
			var troopData:Walls.TroopInfo = troopData[i] as Walls.TroopInfo;
			troopData.requirements = common.checkreq("f", troopData.typeId, 1);
			troopData.bLocked = false;
			for(var j:int = 0; j < troopData.requirements.length; j++)
			{
				var requirement:Requirement = troopData.requirements[j] as Requirement;
				if( !requirement.ok )//&& requirement.typeId < 0 )
				{
					troopData.bLocked = true;
					break;
				}	
			}
		}
		
		SetTroopList();	
	}
	
	public	function SetTroopList()
	{
		troopList.SetData(troopData);
		troopList.ResetPos();
		
		updateLimit();
		
	}
	
	private	function	updateLimit(){
		var curCityId:int = GameMain.instance().getCurCityId();
		var	wallLevel:int = Building.instance().getMaxLevelForType(Constant.Building.WALL, curCityId);
		var	l1:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T1_LIMIT);
		var	l2:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T2_LIMIT);
		var l3:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T3_LIMIT);
		
		var walltaken:Array = Walls.instance().spaceCalc(1);
		

//		var arStrings:Object = Data.instance().arStrings();
		if(_Global.INT32(walltaken[0]) > l1)
		{
			limit1.txt = Datas.getArString("Wall.Limit1") + ": " +  "<color=#f3143eFF>" + walltaken[0] + "</color>" + "/" + l1;
		}
		else
		{
			limit1.txt = Datas.getArString("Wall.Limit1") + ": " +  walltaken[0] + "/" + l1;
		}
		if(_Global.INT32(walltaken[1]) > l2)
		{
			limit2.txt = Datas.getArString("Wall.Limit2") + ": " +  "<color=#f3143eFF>" + walltaken[1] + "</color>" + "/" + l2;
		}
		else
		{
			limit2.txt = Datas.getArString("Wall.Limit2") + ": "  + walltaken[1] + "/" + l2;
		}
		if(_Global.INT32(walltaken[2]) > l3)
		{
			limit3.txt = Datas.getArString("Wall.Limit3") + ": " +  "<color=#f3143eFF>" + walltaken[2] + "</color>" + "/" + l3;
		}
		else
		{
			limit3.txt = Datas.getArString("Wall.Limit3") + ": " + walltaken[2] + "/" + l3;
		}
		
		
		
		limitDesc.txt = Datas.getArString("Wall.LimitDesc");

	}
	
	public	function	Clear()
	{
		troopList.Clear();
	}
}
