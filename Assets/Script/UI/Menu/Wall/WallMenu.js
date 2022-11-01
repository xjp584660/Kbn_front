
class WallMenu extends ComposedMenu
{
	public var clone_content : StandardBuildingContent;
	private var content : StandardBuildingContent;
 	public var buildingInfo : Building.BuildingInfo;

	public var wallTroops:WallTroops;
// 	public var troopList:ScrollList;
 	public var trainningList:ScrollList;
// 	public var troopData:Array;
// 	public var troopItem:ListItem;
 	public var trainItem:ListItem;
 	public var menuTrainTroop:WallTrainTroop;
 	public var trainTab:ComposedUIObj;
 	public var trainBack:Label;
 	public var trainEmpty:Label;
 	
 	public	function	Init(){
 		super.Init();
 		//menuHead.Init();
 		wallTroops.Init();
// 		troopList.Init(troopItem);
		trainningList.Init(trainItem);
		trainTab.component = [trainningList, trainBack, trainEmpty];
		content = Instantiate(clone_content);
		tabArray = [content, wallTroops, trainTab]; //[content, troopList, trainTab]; 
		menuTrainTroop.Init();
 		content.rotation = this.rotation;
		content.Init();
		
//		var arStrings:Object = Datas.instance().arStrings();
		var detail:String = Datas.getArString("Common.Details");
		var train:String = Datas.getArString("Wall.TrainDefenses");
		var inTrainning:String = Datas.getArString("OpenBarracks.InTraining");
		titleTab.toolbarStrings = [detail, train, inTrainning];
		trainEmpty.txt = Datas.getArString("Common.NoTrainning");
//		troopData = Walls.instance().GetTroopList();	
 	}
 	
// 	public	function	InitAfterChangeCity(){
// 		wallTroops.InitAfterChangeCity();
//	}
 	
	public function OnPush(param:Object)
	{
		super.OnPush(param);

//		SetTroopList();	
//		wallTroops.SetTroopList();	
		this.buildingInfo = param as Building.BuildingInfo;//	as BuildingInfo;		
		content.UpdateData(param,true);	
		
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
		trainningList.SetData(Walls.instance().Queue.GetTraiQueue());
		trainningList.ResetPos();
		
		wallTroops.checRequirement();	
		SoundMgr.instance().PlayOpenBuildMenu(this.buildingInfo.typeId);
	}
	
	public	function	OnPopOver()
	{
		trainningList.Clear();
		wallTroops.Clear();
		menuTrainTroop.Clear();
		content.Clear();
		TryDestroy(content);
		content = null;
		super.OnPopOver();
	}
	
	public function Update()
	{
		if(subMenuStack.Count > 0)
		{
			(subMenuStack[subMenuStack.Count-1] as KBNMenu).Update();
			return;
		}

        if (selectedTab == 0)
        {
            content.Update();
        }
		else if (selectedTab == 1)
		{
			wallTroops.Update();
		}
		else if(selectedTab == 2)
		{
			trainningList.Update();
			if( Walls.instance().Queue.GetTraiQueue().length != 0 )
			{
				trainBack.SetVisible(false);
				trainEmpty.SetVisible(false);
			}
			else
			{
				trainBack.SetVisible(true);
				trainEmpty.SetVisible(true);
			}
		}
	}
	
	public function UpdateData(param:Object)
	{
		this.buildingInfo = param ;//	as BuildingInfo;			
		content.UpdateData(param,true);		
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
	}
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				content.setWaitingFlagTrue();
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
				
			case Constant.Notice.WALL_UNITS_CNT_UP:
				wallTroops.UpdateData();
				break;
				
			case Constant.Notice.Train:
			case Constant.Notice.CANCEL_TRAINING:
				wallTroops.checRequirement();
				break;
		}
	}
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(buildingInfo == null || qItem == null )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildingInfo.slotId)
		{
			this.close();
		}
		else
		{	
			UpdateData(Building.instance().buildingInfo(buildingInfo.slotId,buildingInfo.typeId) );			
		}
	}
	//end  notification 
	
	
//	function SetTroopList()
//	{
//		troopList.SetData(troopData);
//		troopList.ResetPos();
//	}

	function ClickTroop(param:Object)
	{
		PushSubMenu(menuTrainTroop, param);
		SoundMgr.instance().PlayEffect( "modal_open", /*TextureType.AUDIO*/"Audio/" );

	}
	
	function OnDismissOk()
	{
		if(subMenuStack.Count > 0)
		{ 
			menuTrainTroop.UpdateData();
		}
//		troopList.UpdateData();
		wallTroops.UpdateData();
	}
	
	function SwitchToTrainList()
	{
		titleTab.SelectTab(2);
		trainningList.SetData(Walls.instance().Queue.GetTraiQueue());
	}
	
	function UpdateData()
	{
//		troopList.UpdateData();
		wallTroops.UpdateData();
		menuTrainTroop.UpdateData();
	}
	
}

