import System.Threading;

public class WarHallBuilding extends KBNMenu implements IEventHandler
{
	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;

	public var toolBar :ToolBar;
	public var clone_content  : StandardBuildingContent;
	protected var buildingContent : StandardBuildingContent;
	private var buildInfo : Building.BuildingInfo;

	protected var nc : NavigatorController;
	public var rallyPanel : RallyPanel;
	public var rallyDetailedInfo : RallyDetailedInfo;
	
	protected var selectedIndex : int = 0;
	public static var TAB_BUILD:String = "build";
	public static var TAB_Rally : String = "rally";

	public var isRallyDetailedPanelPush : boolean = false;
	public var curSelectDetailedRallyId : int = -1;

	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		
		menuHead.Init();
		menuHead.SetVisible(true);	
		toolBar.Init();
		toolBar.toolbarStrings = [Datas.getArString("Bulding.Warhall"), Datas.getArString("WarHall.Rally") ]; //["Detail","Rally"];
        toolBar.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;
		toolBar.selectedIndex = 0;

		buildingContent = Instantiate(clone_content);
		buildingContent.Init();

		//technologySkillPanel.Init();
		nc = new NavigatorController();
		nc.Init();
		nc.pushedFunc = pushedFunc;
		nc.popedFunc = popedFunc;
		
		rallyDetailedInfo.Init(nc);
	}

	public function toolBarTypes_SelectedIndex_Changed(index : int):void
	{
		toolBar.selectedIndex = index;		
	
		if(index == 0)
		{	
			ClearRallyPanel();
			nc.clear();
			curSelectDetailedRallyId = -1;
		}
		else if(index == 1)
		{		
			rallyPanel.updateData();
			nc.push(rallyPanel);
		}
	}

	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		switch(nc.topUI)
		{
			case rallyDetailedInfo:
				isRallyDetailedPanelPush = true;
				break;		
			case rallyPanel:
				curSelectDetailedRallyId = -1;
				isRallyDetailedPanelPush = false;
				rallyDetailedInfo.Clear();
				break;			
		}	
	}

	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		ClearRallyPanel();
	}

	private function ClearRallyPanel():void
	{
		if(rallyPanel != null)
		{
			rallyPanel.Clear();
		}

		if(rallyDetailedInfo != null)
		{
			rallyDetailedInfo.Clear();
		}
	}

	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;

		var data : Hashtable = param as Hashtable;
		toolBar.selectedIndex = _Global.INT32(data["selectIndex"]);
		if(toolBar.selectedIndex == 1)
		{
			this.menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
			menuHead.btn_back.OnClick = new System.Action(handleBack);
		}
		curSelectDetailedRallyId = -1;

		nc.pop2Root();
		if(data["buildInfo"] != null)
		{
			buildInfo = data["buildInfo"] as Building.BuildingInfo;

			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
			this.menuHead.setTitle(buildInfo.buildName,prestigeData["level"].Value,prestigeData["prestige"].Value);		
			buildingContent.UpdateData(data["buildInfo"]);
			buildingContent.HideDestroyAndDeconstructBtn();
			
			SoundMgr.instance().PlayOpenBuildMenu(buildInfo.typeId);

			KBN.RallyController.instance().getRallList();	
		}	
	}

	private function handleBack():void
	{
		MenuMgr.instance.PopMenu("");
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
	}

	public function OnPopOver()
	{
		if(buildingContent != null)
		{
			buildingContent.Clear();
			TryDestroy(buildingContent);
			buildingContent = null;
		}

		if(menuHead != null)
		{
			TryDestroy(menuHead);
			menuHead = null;
		}

		if(rallyDetailedInfo != null)
		{
			rallyDetailedInfo.Clear();
		}
				
		ClearRallyPanel();
		isRallyDetailedPanelPush = false;
	}

	public function handleNotification(type : String, body : Object):void
	{
		switch(type)
		{
			case  Constant.Action.RALLY_DATA_UPDATE: // 集结列表更新
					rallyPanel.updateData();
					if(isRallyDetailedPanelPush)
					{
						var rallyInfo : PBMsgRallySocket.PBMsgRallySocket = body as PBMsgRallySocket.PBMsgRallySocket;
						if(curSelectDetailedRallyId == rallyInfo.rallyId)
						{
							KBN.RallyController.instance().getRallyDetailedInfo(rallyInfo.rallyId);
						}
					}
				break;
			case  Constant.Action.RALLY_REQUEST_DETAILED_INFO:
					var rallyID : int = _Global.INT32(body);					
					KBN.RallyController.instance().getRallyDetailedInfo(rallyID);
				break;
			case  Constant.Action.RALLY_DETAILED_INFO_PUSH:
					popRallyDetailedInfo(body);
				break;
			case  Constant.Action.RALLY_CHANGE_MARCH_ITEM:
					var pbMarch : PBMsgMarchInfo.PBMsgMarchInfo = body as PBMsgMarchInfo.PBMsgMarchInfo;
					March.instance().changeRallyMarchItem(pbMarch);
				break;
			case  Constant.Action.RALLY_DETAILED_INFO_POP:
					rallyPanel.updateData();
					nc.push(rallyPanel);
				break;
			case  Constant.Action.RALLY_DATA_REMOVE:
					if(isRallyDetailedPanelPush)
					{
						var removeRallyId : int = _Global.INT32(body);
						rallyDetailedInfo.rallyDataRemove(removeRallyId);
						curDetailedData = null;
					}
				break;
			case  Constant.Action.RALLY_SELECT_PARNER:
					if(isRallyDetailedPanelPush)
					{
						var partnerInfo : KBN.RallyPartnerInfo = body as KBN.RallyPartnerInfo;
						if(curDetailedData != null && partnerInfo.rallyId == curDetailedData.pBMsgRallySocket.rallyId)
						{
							if(curDetailedData.partnerInfos.ContainsKey(partnerInfo.fromUserId))
							{
								curDetailedData.partnerInfos[partnerInfo.fromUserId].isSelected = partnerInfo.isSelected;
								rallyDetailedInfo.OnPush(curDetailedData);
							}
						}
					}
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

	public var curDetailedData : KBN.RallyDetailedData;
	// 打开详情界面
	private function popRallyDetailedInfo(param : Object)
	{
		var detailedData : KBN.RallyDetailedData = param as KBN.RallyDetailedData;
		if(curDetailedData != null)
		{
			if(curDetailedData.pBMsgRallySocket.rallyId == detailedData.pBMsgRallySocket.rallyId)
			{
				for (var info in curDetailedData.partnerInfos) 
				{
					var parInfo : KBN.RallyPartnerInfo = info.Value;
					if(parInfo.isSelected)
					{
						if(detailedData.partnerInfos.ContainsKey(parInfo.fromUserId))
						{
							detailedData.partnerInfos[parInfo.fromUserId].isSelected = true;
						}
					}
				}	
			}		
		}
		curDetailedData = detailedData;
		
		curSelectDetailedRallyId = detailedData.pBMsgRallySocket.rallyId;
		rallyDetailedInfo.OnPush(detailedData);
		nc.push(rallyDetailedInfo);
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
			case TAB_Rally: 
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
				break;
		}
	}
}