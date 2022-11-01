#pragma strict 

import System.Collections;  
import System.Collections.Generic;
 
class BlackSmithMenu extends ComposedMenu
{
	public var prefabStandBuilding:StandardBuildingContent;
	@HideInInspector public var buildingTab:StandardBuildingContent;
	
	public var equipTab:BlackSmithEquipTab;
	
	//----------------------------------------------------------------
	// Tips
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	
	//--------------------------------------------------------
	private var buildInfo:Building.BuildingInfo; 
	private var needRebuildEquips:boolean = true;
	
	public override function Init()
	{
		super.Init(false);  
		
		InitTabControl();
		InitStandardBuilding();
		
		equipTab.Init();
		
		InitVariables(); 
		tip.CompareRequire = false;
		super.tabArray = [buildingTab, equipTab];
	}
	
	private function InitStandardBuilding()
	{
		buildingTab = Instantiate(prefabStandBuilding);
		buildingTab.Init();
	}
	
	private function InitTabControl()
	{
		super.titleTab.indexChangedFunc = OnMenuTabChanged;
		
		var toolBarNames = new String[2];
		toolBarNames[0] = Datas.getArString("Common.Details");
		toolBarNames[1] = Datas.getArString("Common.BlacksmithEquipTab");
		titleTab.toolbarStrings = toolBarNames;
	}
	
	private function InitVariables()
	{ 
		buildInfo = null; 
		needRebuildEquips = true;
	}
	
	//--------------------------------------------------------
	public override function Update()
	{
		super.Update();

        switch (selectedTab)
        {
            case 0:
                buildingTab.Update();
                break;
		    case 1:
                equipTab.Update();
                break;
            default:
                break;
        }
	}
	
    private static var tabNameToIndex : Hashtable =
    {
        "detail": 0,
        "equipment": 1
    };
    
	public override function OnPush(param:Object)
	{
		super.OnPush(param);
        buildInfo = GetBuildingInfo(param);
		SetMenuHead(buildInfo); 
		SetBuildingInfo(buildInfo);
        SelectTabFromPushParam(param as Hashtable);
	}
	
    private function GetBuildingInfo(param : Object) : Building.BuildingInfo
    {
        if (param instanceof Building.BuildingInfo)
        {
            return param;
        }
        
        var paramDict : Hashtable = param as Hashtable;
        return paramDict["buildingInfo"] as Building.BuildingInfo;
    }
    
    private function SelectTabFromPushParam(paramDict : Hashtable)
    {
        if (paramDict == null)
        {
            SetDefaultLayout();
            SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
            return;
        }
        
        var tabName : String = paramDict["tabName"] as String;
        var tabIndex = -1;
        if (tabNameToIndex.Contains(tabName))
        {
            tabIndex = tabNameToIndex[tabName];
        }
        
        if (tabIndex == 1)
        {
            super.titleTab.selectedIndex = 1;
        }
        else
        {
            SetDefaultLayout();
            SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
        }
    }
    
	private function SetDefaultLayout()
	{
		super.titleTab.selectedIndex = 0; 
		ShowEquipmentTab(false);
	}
	
	private function SetMenuHead(info:Building.BuildingInfo)
	{ 
		super.menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(info.typeId, info.curLevel);	
		super.menuHead.setTitle(info.buildName, prestigeData["level"].Value, prestigeData["prestige"].Value);
	}
	
	private function SetBuildingInfo(info:Building.BuildingInfo)
	{
		buildingTab.rect.y = super.menuHead.rect.height;
		buildingTab.UpdateData(info);
	}
	
	public override function OnPopOver()
	{
		super.OnPopOver();
		
		buildingTab.Clear();
		TryDestroy(buildingTab);
		buildingTab = null;
		
		equipTab.OnClear();
	} 
	
	public function OnPop()
	{
		super.OnPop();
//		GearData.Instance().BlackSmithLastTab = super.titleTab.selectedIndex;
	}
	
	private function OnMenuTabChanged(index:int)
	{  
		ShowEquipmentTab(index == 1);
		
		// Because the Toolbar's index change check maybe skip the same index
		if (index == 1)
		{
			SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.BlackSmith);					
			equipTab.OnMenuTabChanged(index);
		} // if (index == 1)
	}
	 
	private function ShowEquipmentTab(show:boolean)
	{
		equipTab.SetVisible(show);
	}
	 
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
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
		if(buildInfo == null || qItem == null )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildInfo.slotId)
		{
			this.close();
		}
		else
		{	
			buildInfo = Building.instance().buildingInfo(buildInfo.slotId, buildInfo.typeId);
			UpdateBuildingInfo(buildInfo);
		}
	}
	
	private function OnTopMenuChanged(body:Object)
	{
		var array:Array = body as Array;
		if(array == null) return;
	
		var oldMenuName:String = array[0];
		var newMenuName:String = array[1];
		var tag:String = array[2];
		
		if(tag == "pop" && oldMenuName.Equals("ArmMenu"))
		{
			if (super.titleTab.selectedIndex == 1)
			{
				equipTab.OnTopMenuChanged();
			}
		}
	}
	
	private function UpdateBuildingInfo(iInfo:Building.BuildingInfo)
	{
		SetMenuHead(iInfo); 
		SetBuildingInfo(iInfo);	
	}
}