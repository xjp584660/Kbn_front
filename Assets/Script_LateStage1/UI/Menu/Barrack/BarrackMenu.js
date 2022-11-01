import	System.Threading;
class BarrackMenu extends ComposedMenu
{
	public var clone_content : StandardBuildingContent;
	private var content : StandardBuildingContent;
 	public var buildingInfo : Building.BuildingInfo;
 //	public var menuHead:MenuHead;
 //	public var buildingInfo:StandardBuilding;
	public var 	troopTab:ComposedUIObj;
	public var troopList:ScrollList;
	
	private var troopList_Detail:int = 0;
 	public var troopList_L:ScrollList;
 	public var troopList_H:ScrollList;
 	public var trainningList:ScrollList;
 	public var troopSubTab:ToolBar;
 	public var troopData_L:Array;
 	public var troopData_H:Array;
 	public var troopItem:ListItem;
 	public var trainItem:ListItem;
 	public var menuTrainTroop:TrainTroop;
 	public var checkReqThread:Thread;
 	public var trainBack:Label;
 	public var trainEmpty:Label;
 	public var trainTab:ComposedUIObj;
 	
 	private var isCheck:boolean = false;
 	
 	public var  troopArray:ListItem[];
 	public var  trainArray:ListItem[];
 
 //city troop upper limit
 	public var bottomDec:Tile;
	public var labelTip:Label;
 //city troop upper limit

// 	static var instance:BarrackMenu;
// 	public function Awake()
//	{
//		super.Awake();
//		Init();
//	}	
	
	function Init()
	{
		super.Init();
		//menuHead.Init();
		troopList.Init(troopItem);
		troopList_L.Init(troopItem);
		troopList_H.Init(troopItem);
		troopSubTab.Init();
		trainningList.Init(trainItem);
		trainTab.component = [trainningList, trainBack, trainEmpty,labelTip];
		
		if(KBN._Global.IsLargeResolution ())
		{
			troopList_L.rect = new Rect(15,215,640,780);	
			troopList_H.rect = new Rect(15,215,640,780);	
		}
		else
		{
			troopList_L.rect = new Rect(15,192,640,780);	
			troopList_H.rect = new Rect(15,192,640,780);							
		}

		content = Instantiate(clone_content);
		tabArray = [content, troopTab, trainTab];
		content.rotation = this.rotation;
		content.Init();
		menuTrainTroop.Init();
//		instance = this;
		selectedTab = 0;
		titleTab.SelectTab(0);
		titleTab.indexChangedFunc = TitleTabChanged;
		
//		var arStrings:Object = Datas.instance().arStrings();
		var detail:String =  Datas.getArString("Common.Details");
		var train:String = Datas.getArString("OpenBarracks.TrainTroops");
		var inTrainning:String = Datas.getArString("OpenBarracks.InTraining");
		trainEmpty.txt = Datas.getArString("Common.NoTrainning");
		labelTip.txt = Datas.getArString("Common.NoTrainning");
		
		titleTab.toolbarStrings = [detail, train, inTrainning];
		troopData_L = new Array();
		troopData_H = new Array();
		getTrainableTrooplist();
		trainBack.SetVisible(false);
		trainEmpty.SetVisible(false);
		labelTip.SetVisible(false);
		troopList = troopList_L;
		troopTab.component = [troopList,troopSubTab];
		troopSubTab.toolbarStrings = [Datas.getArString("OpenBarracks.LowTier"),Datas.getArString("OpenBarracks.HighTier")];
		troopSubTab.indexChangedFunc = TroopSubTabChanged;
		
		bottomDec = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
		bottomDec.rect = new Rect( 0, rect.height -105 , 640, 105);
		labelTip.Init();
		labelTip.setBackground("tool bar_bottom",TextureType.DECORATION);
			labelTip.SetVisible(true);
			var finalForm:WWWForm = new WWWForm();
			var cityID:int = GameMain.instance().getCurCityId();
			finalForm.AddField("cid", cityID);
			var cmdString : String = null;
			cmdString = "getTroopLimit.php";
			var useOK : Function = function(result : HashObject)
			{
				if ( result["ok"].Value  )
				{
					labelTip.txt=String.Format(Datas.getArString("TroopUpperLimit.Barrack"),_Global.NumFormat(_Global.INT64(result["data"].Value)));
				}
			};
			UnityNet.DoRequest(cmdString, finalForm, useOK, null);
	}
	
//	public	function	InitAfterChangeCity(){
//		getTrainableTrooplist();
//		trainBack.SetVisible(false);
//		trainEmpty.SetVisible(false);
//	}
	
// 	function Start()
// 	{
// 		super.Start();		
// 	}
 	
	public function OnPush(param:Object)
	{
//		var startTime:long  = GameMain.unixtime();
		super.OnPush(param);
		
		var barrackLevel:int =  Building.instance().getMaxLevelForType(Constant.Building.BARRACKS, GameMain.instance().getCurCityId());
		var tabLevel:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.BARRACKS,barrackLevel,Constant.BuildingEffectType.EFFECT_TYPE_UNLOCK_UNIT_TYPE);
		SetTroopList();	
		SetTroopSubTab(tabLevel);
		this.buildingInfo = param as Building.BuildingInfo;//	as BuildingInfo;		
		content.UpdateData(param);	
//		var mTitle:String = buildingInfo.buildName + "(LV" + buildingInfo.curLevel + ")";
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		trainningList.SetData(Barracks.instance().Queue.GetTraiQueue());
		trainningList.ResetPos();
		content.rect.y =150;
		menuHead.rect.height = 150;
		
		// Not use the thread, gui is not execute in other thread
		// checkReqThread = new Thread(new ThreadStart(this.CheckTroopReq));
   		// checkReqThread.Start(); 
   		getTrainableTrooplist();
   		CheckTroopReq();
   		
		SoundMgr.instance().PlayOpenBuildMenu(this.buildingInfo.typeId);
//		_Global.Log("barrack push time:"+ (GameMain.unixtime() - startTime) );
	}
	
	
	public	function	OnPopOver()
	{
		troopList_L.Clear();
		troopList_H.Clear();
		troopList.Clear();
		trainningList.Clear();
		menuTrainTroop.Clear();
		content.Clear();
		TryDestroy(content);
		content = null;
		super.OnPopOver();
	}

	private function CheckTroopReq()
	{
		if(isCheck)
			return;
		isCheck= true;
		var common:Utility = Utility.instance();
		var i:int;
		var j:int;
		var requirement:Requirement;
		for(i = 0; i < troopData_L.length; i++)
		{
			var troopL:Barracks.TroopInfo = troopData_L[i] as Barracks.TroopInfo;
			troopL.requirements = common.checkreq("u", troopL.typeId, 1);
			troopL.bLocked = false;
			for(j = 0; j < troopL.requirements.length; j++)
			{
				requirement = troopL.requirements[j] as Requirement;
				if( !requirement.ok /*&& troopData[i].requirements[j].typeId < 0*/ )
				{
					troopL.bLocked = true;
					break;
				}	
			}
		}	
		troopList_L.SetData(troopData_L);
		
		for(i = 0; i < troopData_H.length; i++)
		{
			var troopH:Barracks.TroopInfo = troopData_H[i] as Barracks.TroopInfo;
			troopH.requirements = common.checkreq("u", troopH.typeId, 1);
			troopH.bLocked = false;
			for(j = 0; j < troopH.requirements.length; j++)
			{
				requirement = troopH.requirements[j] as Requirement;
				if( !requirement.ok /*&& troopData[i].requirements[j].typeId < 0*/ )
				{
					troopH.bLocked = true;
					break;
				}	
			}
		}	
		troopList_H.SetData(troopData_H);
		
		isCheck= false;
	}
	
	public function Update()
	{
		super.Update();
		if(subMenuStack.Count > 0)
		{
			( subMenuStack[subMenuStack.Count-1] as SubMenu).Update();
			return;
		}	
		if( curState == State.Normal)
		{

			if(selectedTab == 0)
			{
				content.Update();				
			}
			if(selectedTab == 1)
			{
				troopList.Update();
			}
			else if(selectedTab == 2)
			{

				trainningList.Update();
				if( Barracks.instance().Queue.GetTraiQueue().length != 0 )
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
	}
	public function UpdateData(param:Object)
	{
		this.buildingInfo = param ;//	as BuildingInfo;			
		content.UpdateData(param);		
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
			case Constant.Notice.BARRACK_UNITS_CNT_UP:
				troopList.UpdateData();
				menuTrainTroop.UpdateData();
				break;
			case Constant.Notice.Train:
			case Constant.Notice.CANCEL_TRAINING:
				getTrainableTrooplist();
				CheckTroopReq();
				break;
			case Constant.Notice.USE_RADIO:
				UseRadioSucess();
				break;
						
		}
	}
	private function UseRadioSucess(){
		trainningList.SetData(Barracks.instance().Queue.GetTraiQueue());
		trainningList.ResetPos();
	}
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(!buildingInfo || !qItem )
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
	

	
	
	function SetTroopList()
	{
		troopList_L.Clear();
		troopList_H.Clear();
		troopList_L.Init(troopItem);
		troopList_H.Init(troopItem);
		troopList_L.SetData(troopData_L);
		troopList_L.ResetPos();
		troopList_H.SetData(troopData_H);
		troopList_H.ResetPos();
	}
	
	function GetTrainningList()
	{
	}
	
	function ClickTroop(param:Object)
	{
		PushSubMenu(menuTrainTroop, param);
		//
		var troopInfo : Barracks.TroopInfo = param as Barracks.TroopInfo;
		if ( troopInfo != null )
		{
			var sndMgr : SoundMgr = SoundMgr.instance();
			sndMgr.PlaySoundOnSelectTroop(troopInfo.typeId);
		}
		//SoundMgr.instance().PlayEffect( "modal_open", /*TextureType.AUDIO*/"Audio/" );
		troopList_Detail = 1;
//			labelTip.SetVisible(false);
		
	}
	
	function OnDismissOk()
	{
		if(subMenuStack.Count > 0)
		{ 
			menuTrainTroop.UpdateData();
		}
		troopList_L.UpdateData();
	}
	
	function SwitchToTrainList()
	{
		titleTab.SelectTab(2);
		trainningList.SetData(Barracks.instance().Queue.GetTraiQueue());
	}
	
	function UpdateData()
	{
		troopList.UpdateData();
		menuTrainTroop.UpdateData();
	}
	
	function getTrainableTrooplist():void
	{
		troopData_L.Clear();
		troopData_H.Clear();
		var temptroopData:Array = Barracks.instance().GetTroopListInCurCity();
		for(var i:int =0; i<temptroopData.length; i++)
		{
			var troopInfo:Barracks.TroopInfo = temptroopData[i] as Barracks.TroopInfo;
			if(troopInfo != null && troopInfo.trainable)
			{
				if(troopInfo.appearTab == 1)
				{
					troopData_L.push(temptroopData[i] as Barracks.TroopInfo);
				}
				else if(troopInfo.appearTab == 2)
				{
					troopData_H.push(temptroopData[i] as Barracks.TroopInfo);
				}
			}
		}

		troopData_L.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		troopData_H.Sort(Barracks.TroopInfo.CompareByLevelAndType);
	}
	
	public function TitleTabChanged(index:int)
	{
		if(index == 1)
		{
			getTrainableTrooplist();
   			CheckTroopReq();
   			SetTroopList();	
		}
	}

	public function TroopSubTabChanged(index:int)
	{
		switch(index)
		{
			case 0:
				troopList = troopList_L;
				troopTab.component = [troopList,troopSubTab];
			break;
			case 1:
				troopList = troopList_H;
				troopTab.component = [troopList,troopSubTab];
			break;
		}
	}
	
	public function PopSubMenu()
	{
		super.PopSubMenu();
		troopList_Detail = 0;
		getTrainableTrooplist();
   		CheckTroopReq();
   		SetTroopList();	
	}
	
	public function SetTroopSubTab(tabLevel:int)
	{
		if(tabLevel == 0)
		{
			troopSubTab.SetVisible(false);
			troopList.SetVisible(false);
		}
		else if(tabLevel == 1)
		{
			troopSubTab.SetVisible(false);
			troopList.SetVisible(true);
			troopList = troopList_L;
		}
		else if(tabLevel == 2)
		{
			troopSubTab.SetVisible(false);
			troopList.SetVisible(true);
			troopList = troopList_H;
		}
		else
		{
			troopSubTab.SetVisible(true);
			troopList.SetVisible(true);
			troopList = troopList_L;
		}
		if(troopData_L.length == 0 || troopData_H.length == 0)
		{
			troopSubTab.SetVisible(false);
		}
		troopTab.component =[troopList,troopSubTab];
	}
}

