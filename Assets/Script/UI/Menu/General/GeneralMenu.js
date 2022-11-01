
class GeneralMenu extends ComposedMenu
{
	public var clone_content : StandardBuildingContent;
	private var content : StandardBuildingContent;
 	public var buildingInfo : Building.BuildingInfo;
 	
// 	public var generalItem:GeneralItem;
 	public var positionItem:PositionItem;
 	//public var positionArray:PositionItem[];
 	
// 	public var generalList:ScrollList;
 	public var positionList:ScrollList;
 	public var generalTab:GeneralTabContent;
 	
 	public var newFuncIcon:UIObject;
 	
 	function Init()
 	{
 		super.Init(false);
 		// 		generalList.Init(generalItem);
 		//menuHead.Init();
 		positionList.Init(positionItem);
 		content = Instantiate(clone_content);
 		tabArray = [content, generalTab, positionList]; 
 		content.rotation = this.rotation;
		content.Init();
		generalTab.Init();
		titleTab.indexChangedFunc = OnTabIndexChanged;
		
		newFuncIcon.Init();
		newFuncIcon.SetVisible(false);
 	}
 	
 	private function OnTabIndexChanged(index:int)
 	{
 		if(index == 2)
 		{
 			positionList.SetData(General.instance().getLeaders());
 		}
 	}
 	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
        if (param instanceof Building.BuildingInfo)
        {
            this.buildingInfo = param as Building.BuildingInfo;
        }
        else
        {
            var data : Hashtable = param as Hashtable;
            this.buildingInfo = data["info"] as Building.BuildingInfo;
            if (data.ContainsKey("tabIndex"))
            {
                General.instance().LastTab = data["tabIndex"];
            }
        }
        
		content.UpdateData(this.buildingInfo);	
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel);	
		menuHead.setTitle(buildingInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
		
//		var arStrings:Object = Datas.instance().arStrings();
		var detail:String = Datas.getArString("Common.Details");
		var general:String = Datas.getArString("Common.Generals");
		var position:String = Datas.getArString("Common.Position");
		titleTab.toolbarStrings = [detail, general, position];
		titleTab.selectedIndex = General.instance().LastTab;
//		generalList.SetData(General.instance().getGenerals());
		generalTab.setListData(General.instance().getGenerals());
		
		positionList.SetData(General.instance().getLeaders());
		positionList.ResetPos();
		
		SoundMgr.instance().PlayOpenBuildMenu(this.buildingInfo.typeId);
	}

	public function OnPushOver()
	{
		CheckNewFuncIcon();
	}
	
	public	function OnPop()
	{
		super.OnPop();
		newFuncIcon.SetVisible(false);
		General.instance().LastTab = titleTab.selectedIndex;
	}
	
	public	function	OnPopOver()
	{
		content.Clear();
		TryDestroy(content);
		content = null;
		positionList.Clear();
		generalTab.Clear();
		super.OnPopOver();
	}

	public function Draw()
	{
		super.Draw();
		newFuncIcon.Draw();
	}
	
	private function CheckNewFuncIcon()
	{
		if (NewFteMgr.Instance().IsAllFteCompleted)
		{
			newFuncIcon.SetVisible(false);
		}
		else
		{
			var isFteDone:boolean = NewFteMgr.Instance().IsFteCompleted(NewFteConstants.FteIds.ChangeEquipFteId);
			if (isFteDone)
			{
				newFuncIcon.SetVisible(false);
			}
			else
			{
				var isVisible:boolean = GearSysController.IsOpenGearSys();
				isVisible &= GearSysController.IsGearSysUnlocked();
				newFuncIcon.SetVisible(isVisible);
			}
		}
	}
	
	public function Update()
	{
		super.Update();
		if(selectedTab == 1)
		{
//			generalList.Update();
			generalTab.generalList.Update();
		}
		else if(selectedTab == 2)
		{
			positionList.Update();
		}
		else if(selectedTab == 0)
		{
			content.Update();
		}
		
		CheckNewFuncIcon();
	}
	
	public function UpdateData(param:Object)
	{
		this.buildingInfo = param as Building.BuildingInfo;//	as BuildingInfo;	
		
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
			case Constant.Notice.TOP_MENU_CHANGE:
				OnTopMenuChanged(body);
				break;
		}
	}
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(buildingInfo == null  || qItem == null )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildingInfo.slotId)
		{
			this.close();
		}
		else
		{	
			this.UpdateData(Building.instance().buildingInfo(buildingInfo.slotId,buildingInfo.typeId) );			
		}
	}
	//end  notification

	private function OnTopMenuChanged(body:Object)
	{
		var array:Array = body as Array;
		if(array == null) return;
	
		var oldMenuName:String = array[0];
		var newMenuName:String = array[1];
		var tag:String = array[2];
		
		if(tag == "pop" && oldMenuName.Equals("GearMenu"))
		{	
			// Clear the fake knight data
			General.instance().ClearFteKnights();
			
			generalTab.Clear();
			generalTab.setListData(General.instance().getGenerals());
		}
	}
	public function OnBackButton():boolean
	{
		if(NewFteMgr.Instance().IsDoingFte)
			return true;
		return super();
	}	
	
}

