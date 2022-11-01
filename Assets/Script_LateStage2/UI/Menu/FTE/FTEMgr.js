public class FTEMgr extends KBN.FTEMgr implements IEventHandler
{	
//	public static var MoblieID:String;
	public var fteEnabled:boolean = true;					//set it false while trapped with old mobileID.


	private var commitRetry:int = 3;
	private var didFTE:boolean = false;
	private var lastNT:int = 0;
	
	private var m_pfnUpdate : function();

	public static function getInstance():FTEMgr
	{
		return _instance as FTEMgr;
	}
	
	private var fteLS : FTELocalServer;
	private var fteDlg	:FTEDialog;
	
	protected var _maxStep:int;
	protected var _rollStep:int = 0;
	
	protected var _curSVO:StepVO;

    public function FTEMgr()
    {
        _instance = this;
    }

	public function PreInit()
	{
		GameMain.instance().resgisterRestartFunc(function(){
			_instance = null;
		});
			
		_status = 0;
	}
	public function Init():void
	{
		isPAD = false;
		//
		if(Screen.width > 640) 
			isPAD = true;
			
		if(_status == 0)
		{
			checkFTE(); // set _isFinished..
		}			
		
//		GCThread.getInstance().startThread();
	}
	
	public function get isDidFTE():boolean
	{
		return didFTE;
	}
	
	public function FixedUpdate()
	{	
		if(fteDlg && _status >= ST_STARTED && _status < ST_LASTEND)
			fteDlg.FixedUpdate();
	}
	public function Update()
	{
		if(fteDlg && _status >= ST_STARTED && _status < ST_LASTEND)
			fteDlg.Update();
		if ( m_pfnUpdate )
			m_pfnUpdate();
	}
	public function Draw()
	{
		if(fteDlg && _status >= ST_STARTED  && _status < ST_LASTEND)	//ST_INVALID
			fteDlg.Draw();
	}
    
	public function get isInited():boolean
	{
		return _status >= ST_INITED;
	}
	/*
		notice arrived. 
	*/
	public function startFTE():void
	{
		if(_status == ST_INITED)
		{
//			this.freeRAM();
			MenuMgr.getInstance().MainChrom.chromBtnsScroll.scrollAble = false;		
			
			_status = ST_STARTED;
			loadStep(_curStep);
		}
		else
		{
			if(this.isFinished)
			{
				clearFTE();
			}
		}
	}
	/// step  as the step that will goto.
	public function checkNextFTE(steps:int[]):void
	{
		if(steps == null)
			return;
		var step:int;
		for(var i:int = 0; i<steps.length; i++)
		{
			step = steps[i];
			if(checkNextFTE(step))
				break;
		}
	}
	public function checkNextFTE(curStep:int,step:int):void
	{
		if(this.curStep == curStep)
			this.checkNextFTE(step);
	}
	
	public function hideFTE(step:int):void
	{
		if(fteDlg && step == curStep)
			fteDlg.hideStep();
	}
	public function showFTENext(steps:int[]):void
	{
		for(var step:int in steps)
			showFTENext(step);
	}
	public function showFTENext(step:int):void
	{
		if(fteDlg && step == curStep)
			fteDlg.showNext();
	}
	
	public function checkNextFTE(step:int):boolean
	{
		var nt:int = isNextStep(curStep,step);
		
		switch(nt)
		{
			case 1:	//next
					if(lastNT != 2)
						sendCurBI();	
						
					_curStep = step;
					this.loadStep(curStep);
				break;
			case 2:	//skip some.  virtual assistant step.
					lastNT = nt;
					_curStep = step;
					this.handlerStepAction(step,null);	
				
				return  true;							
				
			default:
				break;
		}
		lastNT = nt;
		
		if( isNextStep(curStep,step) )
		{
			_curStep = step;
			this.loadStep(curStep);
			return true;
		}
		return false;
	}
	
	public function getNextStepBy(step:int):int
	{
		var obj:Hashtable = FTEConstant.FTE_Steps();
		var n:int = 0;
		if(obj && obj["step" + step])
		{
			obj = obj["step" + step];						
			n = _Global.INT32(obj["nextStep"]);			
		}
		else		
			n = -1;
			
		n = (n == 0) ? (step + 1) : n;		
		return n;
	}
	
	public function getRollStepBy(step:int):int
	{
		var obj:Hashtable = FTEConstant.FTE_Steps();
		var n:int = 0;
		if(obj)
			n = _Global.INT32(obj["rollStep"]);
		else
			n = step;		
		return n;
	}
	
	public function handleItemAction(action:String,params:Object)
	{
		switch(action)
		{
			case FTEConstant.Action.Next:
				handlerStepAction(_curStep,params);
				break;
			case "end":
				_status = ST_LASTEND;
				sendCurBI();
				clearFTE();
				break;
			case FTEConstant.Action.Show_GlobalMask:
				fteDlg.globalMask = (params == true);
				break;
			case FTEConstant.Action.SkipToEnd:
				_curStep = FTEConstant.Step.FTE_SKIP2_STEP;
				this.fteLS.firstInitSeed(FTEConstant.Step.FTE_SKIPFROM_STEP);
				LevelUp.instance().reInit();
				this.loadStep(_curStep);
//				fteDlg.globalMask = false;
				break;
		}
	}
	
	protected function isNextStep(curStep:int,nStep:int):int
	{
		// TODO...
		if(_curSVO && _curSVO.curStep == curStep)
		{			
			if(nStep == _curSVO.nextStep)
				return 1;
			if(_curSVO.nextSteps && _Global.IsValueInArray(_curSVO.nextSteps, nStep) )
				return 2;
		}
		//for virtual step
		if(this.getNextStepBy(curStep) == nStep)
			return 1;
		if( nStep == curStep+1)
			return 1;
			
		return 0;
	}
	
	
	//protected private functions.
	//TODO...
	protected function checkFTE():void
	{
		_status = ST_CHECKING;
		
		//_Global.Log("FTE: check FTE Status ..."); 
		
		if( !fteEnabled)
		{
			_curStep = FTEConstant.Step.COMPLETE_STEP;
//			localChecked = true;
			checkFTECallBack(new HashObject({"fte":{"completed":true,"step":0}}) );
		}
		else
		{
			var seed:HashObject;
			seed = GameMain.instance().getSeed();
			checkFTECallBack(seed);			
		}
	}
	//here no init seed. just check
	protected function checkFTECallBack(result:HashObject):void
	{
		_status = ST_INITED;
		//_Global.Log("FTE: check FTE Status Completed.");
		var v:HashObject = Datas.getValue(result,"fte.completed") as HashObject;
		didFTE = false;
		var lv:int = Datas.getIntValue(result,"xp.lvl");
		if( (v && v.Value == true)  || lv > 2 ) // if level > 2 ..skip FTE;
		{
			_Global.Log("lv:" + lv);
			_status = ST_LASTEND;
			_curStep = FTEConstant.Step.COMPLETE_STEP;
			this.saveLocalStep(_curStep);
		}
		else	//Init FTE..
		{
			var fteNode : HashObject = result["fte"];
			var fteVersion : int = 0;
			if ( fteNode["useNewFte"] != null )
				fteVersion = _Global.INT32(fteNode["useNewFte"]);
			FTEConstant.SetFteVersion(fteVersion);
			_status = ST_INITED;
			if(!debugStep)			
				_curStep = this.getLocalStep();
			else
				_curStep = FTE_INIT_STEP;
				
			if(_curStep <=0)
			{
				_curStep = _Global.INT32(Datas.getValue(result,"fte.step"));				
			}
			_curStep = calcReallFirstStep(_curStep);
			
			fteLS = FTELocalServer.getInstance();
			fteLS.setMgr(this);
			
			fteDlg = new FTEDialog();
			fteDlg.Init(this);				
		}
		
		GameMain.instance().OnFTEInited();		
		
		
		if(!isFinished)
		{
			fteLS.HackDataConfig();
			didFTE = true;
		}
		/*
		else
		{
			clearFTE();
		}
		*/
	}
	protected function checkFinished():void
	{
		if(isFinished)
		{
			//_Global.Log("FTE:Completed ....didFTE:" + didFTE);	
			setUserDoneFTE(Datas.instance().tvuid());
			MenuMgr.getInstance().MainChrom.chromBtnsScroll.scrollAble = true;		
			GameMain.instance().OnFTEComplete(didFTE);
		}
	}
	// just call once .. for change 
	protected function calcReallFirstStep(step:int):int
	{
		var obj:Hashtable = FTEConstant.FTE_Steps();
		obj = obj["step"+step];
		if(obj)
		{
			var rt:int = _Global.INT32(obj["rollStep"]);		
			rt = rt>0? rt : step;
		}
		else
		{	
			//no exists any more? 
			rt = FTEConstant.Step.FTE_FIRST_STEP;
		}
		return rt;
	}
	public function firstInitStep():void
	{
		if(isFinished)
			return;		
		
		var scene:int = fteLS.firstInitSeed();
		Datas.instance().setScenceLevelWithOutSave(scene);		
//		GameMain.instance().loadLevel(scene);		
	}
	
	public function Debug_SkipTo(step:int):void
	{
		var tstep:int = _curStep;
		var scene:int;
		while(tstep >= 0)
		{
			fteLS.fillSeedByStep(tstep);			
			if(tstep == step)
				break;
			tstep = this.getNextStepBy(tstep);			
		}
		_curStep = step;
		this.loadStep(step);
	}
	protected function loadStep(step:int):void
	{
		var cityId =GameMain.instance().getCurCityId();

		if(step == FTEConstant.Step.COMPLETE_STEP )
		{
			if(_status != ST_COMPLETED )
			{
				_status = ST_COMPLETED;
				fteDlg.clearStep();
				
				commitFTE();
			}
			return;
		}
		if( curStep == FTEConstant.Step.FTE_FIRST_STEP && !FTEMgr.isUserStartFTE( Datas.instance().tvuid(), Datas.instance().worldid() ) ){
			UnityNet.SendBI(Constant.BIType.FTE,100,0);
		}
		this.saveLocalStep(curStep);	//write to local file .
		this.readyForNextStep(curStep);		
		_curSVO = fteDlg.loadStep(curStep);		
		UnityNet.reqWWW("fte.php",{"cid":cityId,"step":step,"act":""},stepSendOk,null);
		
	}	
	
	protected function stepSendOk(result:Object):void
	{
		
	}
	protected function commitFTE():void
	{
		var cityId =GameMain.instance().getCurCityId();
		UnityNet.reqWWW("fte.php",{"cid":cityId,"step":curStep,"act":"finish"},commitSucess,commitFailed);
	}
	protected function commitSucess(result:Object):void
	{
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setDefautLayout();		
		fteLS.fillFTEEndData(result);
		//UpdateSeed.instance().update_seed_ajax(true,null);
		GameMain.instance().seedUpdate(true);
		_curSVO = fteDlg.loadStep(FTEConstant.Step.COMPLETE_STEP);
		
	}
	protected function commitFailed(result:Object):void
	{
		var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
		commitRetry --;
		if(commitRetry > 0)
		{
			ErrorMgr.instance().PushError(Datas.getArString("FTE.Commit_Title_Failed"),Datas.getArString("FTE.Commit_Content_Retry"),false ,Datas.getArString("FTE.Retry"),commitFTE);			

		}
		else
		{			
			ErrorMgr.instance().PushError(Datas.getArString("FTE.Commit_Title_Failed"),Datas.getArString("FTE.Commit_Content_Restart"),false, Datas.getArString("FTE.Restart"),restartGame);
		}
	}
	protected function restartGame():void	
	{
		GameMain.instance().restartGame();
	}
	protected function saveLocalStep(step:int):void
	{
		var uid:int = Datas.instance().tvuid();
		var wid:int = Datas.instance().worldid();
		
		//_Global.Log("FTE Save Local Step worldId:" + wid + "  uid: " + uid + "  Step: "+ step);
		PlayerPrefs.SetInt("FTE_"+wid+"_" + uid,step);
	}

	public static function setUserDoneFTE(uid:int):boolean
	{
		if ( uid == Datas.instance().tvuid() )
		{
			var seed:HashObject = GameMain.instance().getSeed();
			if ( seed == null || seed["fte"] == null )
				return false;
			if ( seed["fte"]["completed"] == null )
				seed["fte"]["completed"] = new HashObject(true);
			else
				seed["fte"]["completed"].Value = true;
		}
		var key:String = "FTE_DONE_" + uid;
		PlayerPrefs.SetInt(key,1);
		return true;
	}

	protected function getLocalStep():int
	{
		var uid:int = Datas.instance().tvuid();
		var wid:int = Datas.instance().worldid();
		
		var key:String = "FTE_"+wid+"_" + uid;
		var step:int = 0;
		if(PlayerPrefs.HasKey(key))
			step = PlayerPrefs.GetInt(key);			
		return step;
	}
	
	protected function clearFTE():void
	{
		fteDlg = null; //
//		_curStepVO = null;
		
//		Resources.UnloadUnusedAssets();
//		System.GC.Collect();
		
		checkFinished();
	}
	
	protected function handlerStepAction(step:int,params:Object):void
	{
		var next:boolean = true;
		var nextStep:int = getNextStepBy(step);
		this._rollStep = getRollStepBy(step);
		
		var menuMgr:MenuMgr = MenuMgr.getInstance();
		var createBuildingMenu:CreatBuilding = menuMgr.getMenu("CreatBuilding") as CreatBuilding;
		var inventoryMenu:InventoryMenu = menuMgr.getMenu("InventoryMenu") as InventoryMenu;
		var missionMenu:Mission = menuMgr.getMenu("Mission") as Mission;
		var academyBuildingMenu:AcademyBuilding = menuMgr.getMenu("AcademyBuilding") as AcademyBuilding;
		var StandardBuildingMenu:StandardBuilding = menuMgr.getMenu("StandardBuilding") as StandardBuilding;
		var levelUpMenu:LevelupMenu = menuMgr.getMenu("LevelupMenu") as LevelupMenu;
		var levelRewardsMenu:LevelRewards = menuMgr.getMenu("LevelRewards") as LevelRewards;
		var speedupMenu:SpeedUpMenu = menuMgr.getMenu("SpeedUpMenu") as SpeedUpMenu;
		
		var cityId =GameMain.instance().getCurCityId();
		var mitem:Mission.MissionItem;
		switch(step)
		{
			case 0:
				// Build a Building. waiting it complete.
//				next = false;
				break;		
			case 201:	
			case 301:
				this.handleItemAction(FTEConstant.Action.Show_GlobalMask,false);				
				break;
			case FTEConstant.Step.MAP_5:
//					this.freeRAM();	//call it after FTE.
				break;
/*************** Build Cottage ******************/
			case FTEConstant.Step.BUILD_HOUSE_CLICK_SLOT:
					GameMain.instance().onHitSlot( FTEConstant.Data.Slot_House);	
				break;
			case FTEConstant.Step.BUILD_HOUSE_CLICK_NEXT:
					createBuildingMenu.gotoCreatBuilding(Constant.Building.VILLA);
				break;
			case FTEConstant.Step.BUILD_HOUSE_CLICK_BUILD:
					createBuildingMenu.st2_btn_build.Click();
				break;
			case FTEConstant.Step.BUILD_HOUSE_WAIT:
					MenuMgr.getInstance().MainChrom.chromBtnsScroll.MoveToTop();
					//do nothing		
				break;
//			case FTEConstant.Step.BUILD_HOUSE_COMPLETE:				
				
/*************** Quest 1 see FTEDEV.doc FTEMgr part.******************/
			case FTEConstant.Step.TASK_1_CLICK_QUESTS:	
					fteLS.readyForNextFTEModule(FTEConstant.Module.TASK_1);			
					MenuMgr.getInstance().MainChrom.OpenMission();
				break;
			case FTEConstant.Step.TASK_1_CLICK_NEXT:
					mitem = new Mission.MissionItem();
					mitem.id = FTEConstant.Data.Quest_Comoplete_Id1;
					mitem.isFinished = true;
					missionMenu.pushSubMenu(mitem);
					m_pfnUpdate = function()
					{
						missionMenu.Update();
					};
				break;
			case FTEConstant.Step.TASK_1_CLICK_REWARD:
					missionMenu.missionItemObj.btnGetReward.Click();
				break;
			case FTEConstant.Step.TASK_1_CLICK_DETAIL:
					mitem = new Mission.MissionItem();
					mitem.id = FTEConstant.Data.Quest_Detail_Id1;
					mitem.isFinished = false;
					missionMenu.pushSubMenu(mitem);
				break;
			case FTEConstant.Step.TASK_1_CLICK_HOME:
					m_pfnUpdate = null;
					missionMenu.close();
				break;
			
/************** change view   ******************/
			case FTEConstant.Step.VIEW_CHANGE:
					//change 2 field.
					GameMain.instance().loadLevel(GameMain.FIELD_SCENCE_LEVEL);
					next = false;
				break;
/************** upgrade fram ******************/			
			case FTEConstant.Step.UP_BUILD_CLICK_FARM:
					GameMain.instance().onHitSlot(FTEConstant.Data.Slot_Farm);	
				break;
			case FTEConstant.Step.UP_BUILD_CLICK_UPGRADE:
					StandardBuildingMenu.ClickBuildUpgrade();
				break;
			case FTEConstant.Step.UP_BUILD_WAIT	:
					//do nothing
				break;

			case FTEConstant.Step.UP_BUILD_SPEED_UP_CLICK:
				fteLS.readyForNextFTEModule(FTEConstant.Module.SPEED_UP);
				var upgradeElement:QueueItem = BuildingQueueMgr.instance().first(cityId);
				//var element:QueueItem = Research.instance().getItemAtQueue(0,cityId);
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",upgradeElement, "trans_pop");
				menuMgr.getMenuAndCall("SpeedUpMenu", function(menu : KBNMenu) {
					var speedupMenu:SpeedUpMenu = menu as SpeedUpMenu;
					if( speedupMenu ) {
						speedupMenu.listView.updateable = false;
					}
				});
				break;

			case FTEConstant.Step.UP_BUILD_SPEED_UP_MENU:
				var upgradeElementData:QueueItem = BuildingQueueMgr.instance().first(cityId);
				//var r:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,cityId);
				if(upgradeElementData != null)
				{
					SpeedUp.instance().apply(SpeedUp.PLAYER_ACTION_CONSTRUCT, FTEConstant.Data.SpeedUp_ItemId, upgradeElementData.id,upgradeElementData,null);
				}
				if( speedupMenu ) {
					speedupMenu.close();
					speedupMenu.listView.updateable = true;	
				}
				break;

			case FTEConstant.Step.UP_BUILD_SPEED_WAIT_FOR_LVUP:	//	type1 only
				fteLS.readyForNextFTEModule(FTEConstant.Module.LEVEL_UP);
				LevelUp.instance().check();	//
				break;

			case FTEConstant.Step.UP_BUILD_SPEED_2_LEVELUP:	//virtual step.just for step skipped.					
				break;

//			case FTEConstant.Step.UP_BUILD_COMPLETE:			
/**************  Quest;	******************/
			case FTEConstant.Step.TASK_2_CLICK_QUEST :
					if(GameMain.instance().curSceneLev() != GameMain.FIELD_SCENCE_LEVEL)
					{
						GameMain.instance().loadLevel(GameMain.FIELD_SCENCE_LEVEL);
					}
					fteLS.readyForNextFTEModule(FTEConstant.Module.TASK_2);
					MenuMgr.getInstance().MainChrom.OpenMission();
					m_pfnUpdate = function()
					{
						var mn : Mission = MenuMgr.getInstance().getMenu("Mission") as Mission;
						if ( mn == null )
							return;
						mn.btnClaim.mystyle.normal.background = null;
						mn.btnClaim.SetVisible(true);
					};
				break;
			/*				
			case FTEConstant.Step.TASK_2_CLICK_NEXT:					
					menuMgr.Mission.pushSubMenu({"id":FTEConstant.Data.Quest_Comoplete_Id2, "isFinished":true});
				break;
			*/
			case FTEConstant.Step.TASK_2_CLICK_REWARD:			
					//menuMgr.Mission.missionItemObj.btnGetReward.Click();
					m_pfnUpdate = null;
					missionMenu.btnClaim.Click();
				break;
			case FTEConstant.Step.TASK_2_CLICK_HOME:
					missionMenu.close();
				break;
			case FTEConstant.Step.TASK_2_CLICK_SWITCH:
					GameMain.instance().loadLevel(GameMain.CITY_SCENCE_LEVEL); // for next FTE.
					next = false;
				break;
/************** create alchemy	******************/
			case FTEConstant.Step.BUILD_ACADEMY_CLICK_SLOT:
					GameMain.instance().onHitSlot(FTEConstant.Data.Slot_Academy);
				break;
			case FTEConstant.Step.BUILD_ACADEMY_CLICK_NEXT:
					createBuildingMenu.gotoCreatBuilding(Constant.Building.ACADEMY);
				break;
			case FTEConstant.Step.BUILD_ACADEMY_CLICK_BUILD:
					createBuildingMenu.st2_btn_build.Click();
				break;
			case FTEConstant.Step.BUILD_ACADEMY_CLICK_WAIT:
					//no thing.
				break;
			case FTEConstant.Step.BUILD_ACADEMY_COMPLETE:
					//nothing
				break;
			
/************** Research 	******************/
			case FTEConstant.Step.UP_TECH_CLICK_ACADEMY :
					GameMain.instance().onHitSlot(FTEConstant.Data.Slot_Academy);		
				break;
			case FTEConstant.Step.UP_TECH_CLICK_TAB:
					academyBuildingMenu.toolBar.selectedIndex = 1;
				break;
			case FTEConstant.Step.UP_TECH_CLICK_NEXT:
					academyBuildingMenu.showTechnologyContent(Constant.Research.IRRIGATION);
				break;
			case FTEConstant.Step.UP_TECH_CLICK_RESEARCH:
					academyBuildingMenu.technologyContent.btn_research.Click();
				break;		
			case FTEConstant.Step.UP_TECH_WAIT:
					// TODO .nothing ? ...					
				break;
				
/************** SPEEDUP -> link...******************/
			case FTEConstant.Step.SPEED_UP_OPEN:				
					fteLS.readyForNextFTEModule(FTEConstant.Module.SPEED_UP);
					var element:QueueItem = Research.instance().getItemAtQueue(0,cityId);
					MenuMgr.getInstance().PushMenu("SpeedUpMenu",element, "trans_pop");	
					menuMgr.getMenuAndCall("SpeedUpMenu", function(menu : KBNMenu) {
						var speedupMenu:SpeedUpMenu = menu as SpeedUpMenu;
						if( speedupMenu ) {
							speedupMenu.listView.updateable = false;
						}
					});
				break;
			case FTEConstant.Step.SPEED_UP_CLICK_INSTANT:										
//					var si:SpeedUpItem = menuMgr.SpeedUp.listView.GetItem(0);
//					si.btnSelect.OnClick();	
					//method 2			
					var r:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,cityId);
					if(r)
					{						
						SpeedUp.instance().apply(SpeedUp.PLAYER_ACTION_RESEARCH, FTEConstant.Data.SpeedUp_ItemId, r.id,r,null);
					}
					if( speedupMenu ) {
						speedupMenu.close();
						speedupMenu.listView.updateable = true;	
					}
					
					break;
			case FTEConstant.Step.SPEED_UP_COMPLETE:
					fteLS.readyForNextFTEModule(FTEConstant.Module.LEVEL_UP);
					LevelUp.instance().check();	//
					
					break;
			case FTEConstant.Step.SPEED_UP_2_OPEN_LEVELUP:	//virtual step.just for step skipped.					
					
					break;
				
/************** Levelup 	******************/				
			case FTEConstant.Step.LEVEL_UP_CLAIM:
					levelUpMenu.bntClaim.Click();
//					menuMgr.levelUp.close();
				break;
			case FTEConstant.Step.LEVEL_UP_OK:				
					MenuMgr.getInstance().MainChrom.chromBtnsScroll.MoveToTop();
					levelRewardsMenu.bntClaim.Click();
				break;
				
/************** ITEMS 	******************/	
			case FTEConstant.Step.ITEMS_CLICK_ITEMS:
					fteLS.readyForNextFTEModule(FTEConstant.Module.ITEMS);	
					menuMgr.PushMenu("InventoryMenu",{"selectedTab":0});
				break;
			case FTEConstant.Step.ITEMS_CLICK_TAB_1:
					inventoryMenu.itemShop.selectedIndex = 1;
					inventoryMenu.listbar.selectedIndex = 0;
				break;
			case FTEConstant.Step.ITEMS_CLICK_TAB_2:
					inventoryMenu.listbar.selectedIndex = 4;
				break;
			case FTEConstant.Step.ITEMS_CLICK_USE:
					MyItems.instance().Use(FTEConstant.Data.Used_ItemId);
					inventoryMenu.close();
				break;
/************** END 	******************/					
			case FTEConstant.Step.END_NPC_1:
				if(inventoryMenu != null)				
					inventoryMenu.listbar.selectedIndex = 0;		
				break;
			case FTEConstant.Step.END_NPC_2:
				Quests.instance().getReward(FTEConstant.Data.Quest_UseChestId,null);
				Quests.instance().getReward(FTEConstant.Data.Quest_ResearchId,null);
				Quests.instance().getReward(FTEConstant.Data.Quest_Comoplete_Id2,null);
				var seed:HashObject = GameMain.instance().getSeed();
 				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm][_Global.ap + 1].Value = "2";
 				seed["tech"]["tch" + Constant.Research.IRRIGATION].Value = "1";
				menuMgr.MainChrom.StopQuestAnimation();
				Quests.instance().checkForBuilding();
				break;
		}
		//

		if(next)
		{
			checkNextFTE(nextStep);
		}
		else
		{
			//sendCurBI();
		}
	}
	
	protected function sendCurBI():void
	{
		if(_curSVO && _curSVO.biVO)
		{
			UnityNet.SendBI(Constant.BIType.FTE,_curSVO.biVO.step,_curSVO.biVO.slice);
		}
	}
	protected function readyForNextStep(step:int):void
	{
		switch(step)
		{
			case 201:
					this.handleItemAction(FTEConstant.Action.Show_GlobalMask,true);
				break;			
			case FTEConstant.Step.LEVEL_UP_CLAIM:
					//
					MenuMgr.getInstance().MainChrom.Update();
					fteLS.readyForNextFTEModule(FTEConstant.Module.LEVEL_UP);
					LevelUp.instance().check();	// add rewards.
				break;
		}
	}
	
	protected function freeRAM():void	
	{
		Resources.UnloadUnusedAssets();
		System.GC.Collect();
	}
}
