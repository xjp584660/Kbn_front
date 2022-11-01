import System.Threading;

public class TechnologyTreeBuilding extends KBNMenu implements IEventHandler
{

	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;

	public var toolBar :ToolBar;
	public var clone_content  : StandardBuildingContent;
	protected var buildingContent : StandardBuildingContent;
	private var buildInfo : Building.BuildingInfo;

	protected var nc:NavigatorController;
	public var technologySkillPanel : TechnologySkillPanel;
	
	protected var selectedIndex : int = 0;
	public static var TAB_BUILD:String = "build";
	public static var TAB_TECHNOLOGY : String = "technology";

	public static var gm_startPageIndex : int = -1;

	public function SetPreposeSkillDownLine(skillID : int, isUnlock : boolean) : void
	{
		if(technologySkillPanel == null)
			return;

		technologySkillPanel.GetSkillPanel().SetPreposeSkillDownLine(skillID,isUnlock);
	}

	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		
		menuHead.Init();
		menuHead.SetVisible(true);	
		toolBar.Init();
		toolBar.toolbarStrings = [Datas.getArString("DivinationLab.Title_Text1"), Datas.getArString("DivinationLab.Title_Text2") ]; //["Detail","Technology"];
        toolBar.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;
		toolBar.selectedIndex = 0;

		buildingContent = Instantiate(clone_content);
		buildingContent.Init();

		technologySkillPanel.Init();
		nc = new NavigatorController();
		nc.pushedFunc = pushedFunc;
		nc.popedFunc = popedFunc;
	}

	public function toolBarTypes_SelectedIndex_Changed(index : int):void
	{
		toolBar.selectedIndex = index;		
	
		if(index == 0)
		{	
			ClearTechnologySkillPanel();
		}
		else if(index == 1)
		{		
			technologySkillPanel.updateData(technologySkillPanel.GetSkillPanelTabIndex());
			nc.push(technologySkillPanel);
		}
	}

	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		//KBN.FTEMgr.getInstance().showFTENext(FTEConstant.Step.UP_TECH_CLICK_RESEARCH);		
	}

	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		ClearTechnologySkillPanel();
	}

	private function ClearTechnologySkillPanel():void
	{
		if(technologySkillPanel != null)
		{
			technologySkillPanel.Clear();
		}
	}

	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;

		if ( gm_startPageIndex < 0 )
			toolBar.selectedIndex = 0;
		else
			toolBar.selectedIndex = gm_startPageIndex;
		gm_startPageIndex = -1;

		nc.pop2Root();
		buildInfo = param as Building.BuildingInfo;

		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
		this.menuHead.setTitle(buildInfo.buildName,prestigeData["level"].Value,prestigeData["prestige"].Value);
		buildingContent.UpdateData(param);
		buildingContent.HideDestroyAndDeconstructBtn();
		
		SoundMgr.instance().PlayOpenBuildMenu(buildInfo.typeId);
		updateTList();
	}

	public function DrawItem():void	
	{
		switch(selectedIndex)
		{
			case 0:
				buildingContent.Draw();
				break;
			case 1:
				nc.DrawItems();
				break;
		}
	}

	public function DrawTitle():void
	{
		menuHead.Draw();		
		selectedIndex = toolBar.Draw();
		this.updateShow();
	}
	
	function DrawBackground()
	{
		super.DrawBackground();

		frameTop.Draw();
	}

	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}

	function Update()
	{
		menuHead.Update();

		if(selectedIndex == 0)
		{
			buildingContent.Update();
		}

		nc.u_Update();
	}

	public function UpdateData(param:Object):void
	{
		if(param)
		{
			buildInfo = param;
			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
			this.menuHead.setTitle(buildInfo.buildName,prestigeData["level"].Value,prestigeData["prestige"].Value);
			buildingContent.UpdateData(param);
			buildingContent.HideDestroyAndDeconstructBtn();
		}
		updateTList();		
	}

	protected function updateTList()
	{
		var cityId:int = GameMain.instance().getCurCityId();

		Technology.instance().InitTechnologyList();
	}

	public function OnPopOver()
	{
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		TryDestroy(menuHead);
		menuHead = null;
		ClearTechnologySkillPanel();
	}

	public function handleNotification(type : String, body : Object):void
	{
		switch(type)
		{
			case  Constant.Action.TECHNOLOGY_SKILL_ON_CLICK:
					popTechnologyUpgrate(body);
				break;
			case  Constant.Action.TECHNOLOGY_START:
					close();
				break;
			case  Constant.Action.TECHNOLOGY_COMPLETE:
					technologySkillPanel.completeResearch(technologySkillPanel.GetSkillPanelTabIndex());
					nc.push(technologySkillPanel);
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
		}
	}

	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(null == buildInfo || null == qItem  )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildInfo.slotId )
		{
			this.close();
		}
		else
		{	
			//
			this.UpdateData(Building.instance().buildingInfo(buildInfo.slotId,buildInfo.typeId) );
		}
	}

	// 打开升级界面
	private function popTechnologyUpgrate(param : Object)
	{
		MenuMgr.getInstance().PushMenu("TechnologyUpgrate", param, "trans_zoomComp");
	}

	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			// case Constant.Action.ACADEMY_TECH_ITEM_NEXT:
			// 	this.showTechnologyContent(param as TechVO);
			// 	break;
		}	
	}

	protected function buttonHandler(clickParam:String)
	{
		switch(clickParam)
		{
			case TAB_BUILD:
				this.selectedIndex = 0;
				break;
			case TAB_TECHNOLOGY:
				this.selectedIndex = 1;
				break;
		}
		this.updateShow();
	}

	private function updateShow():void
	{
		switch(selectedIndex)
		{
			case 0:
				break;
				
			case 1:			
				//var skills : System.Collections.Generic.List.<OneRowSkill> = GameMain.GdsManager.GetGds.<GDS_TechnologyShow>().GetRowSkills(1);	
				//technologySkillPanel.updateData(skills);
				//nc.push(technologySkillPanel);
				break;
		}
	}
}