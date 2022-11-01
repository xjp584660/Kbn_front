import System.Threading;

public class AcademyBuilding extends KBNMenu implements IEventHandler
{
	public static var TAB_BUILD:String = "build";
	public static var TAB_TECHNOLOGY : String = "technology";
	
	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;
//	public var btn_building  :Button;
//	public var btn_technology:Button;
	public var toolBar :ToolBar;
	public var clone_content  : StandardBuildingContent;
	protected var buildingContent : StandardBuildingContent;
	public var technologyList : TechnologyList;
	public var technologyContent : TechnologyContent;
	
	protected var _curShowObject  :UIObject;
	
		
	//data .. .buildData & technoloty Data.
	private var buildInfo : Building.BuildingInfo;
	private var tch_list:Array;
	
	protected var selectedIndex:int = 0;
	protected var t_index:int = 0;	
	protected var nc:NavigatorController;
	
	private   var updateTListThread:Thread;
	private   var isUpdateTList = false;

	public static var gm_startPageIndex : int = -1;
//	public function Awake()
//	{
//		super.Awake();
//
//		
//	}
	
	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		buildingContent = Instantiate(clone_content);
		//buildingContent = clone_content;
		
		menuHead.Init();
		menuHead.SetVisible(true);	
		toolBar.Init();
		toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Technology") ]; //["Detail","Technology"];

		technologyList.Init();
		buildingContent.Init();
		this.technologyList.scroll.itemDelegate = this;
		technologyContent.Init();
		this.technologyContent.f_click_callBack = this.showTechnologyList;
		technologyContent.uiName = "TECHNOLOGYCONTENT";
		
		nc = new NavigatorController();
		nc.pushedFunc = pushedFunc;
		nc.push(technologyList);
		isUpdateTList = false;
	//	this.updateTList();
		var cityId:int = GameMain.instance().getCurCityId();
		tch_list = Research.instance().getTechnologyList(cityId);
		
		nc.popedFunc = popedFunc;
	}
	
	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		showTechnologyList();
		if(technologyContent != null)
		{
			technologyContent.ClearScrollListOfRequireCon();
		}
	}
	
	public function DrawItem():void	
	{
		
//		btn_building.Draw();
//		btn_technology.Draw();

		

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
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	function Update()
	{
		menuHead.Update();
//		nc.u_FixedUpdate();
		nc.u_Update();
		if(selectedIndex == 0)
		{
			buildingContent.Update();
		}
		/*
		if(curShowObject == technologyList)
			technologyList.scroll.Update();
		*/
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		buildInfo = param as Building.BuildingInfo;
		
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;

		if ( gm_startPageIndex < 0 )
			toolBar.selectedIndex = 0;
		else
			toolBar.selectedIndex = gm_startPageIndex;
		gm_startPageIndex = -1;
//		this.selectedIndex = 0;			//

		t_index = 0;
		nc.pop2Root();
		this.updateShow();
		if(!tch_list)
		{
			tch_list = new Array();
		}
		this.technologyList.updateData(tch_list);
		this.UpdateData(param);

		SoundMgr.instance().PlayOpenBuildMenu(buildInfo.typeId);
	}
	
	public function OnPopOver()
	{
		technologyList.clear();
		technologyContent.Clear();
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		TryDestroy(menuHead);
		menuHead = null;
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case  Constant.Notice.RESEARCH_START:
					close();
				break;
			case  Constant.Notice.RESEARCH_COMPLETE:
					technologyContent.updateData(null);
//					updateTList();
					UpdateData(null);
//					if(tch_list)
//						this.technologyList.updateData(tch_list);
					
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				if(selectedIndex == 0)
					buildingContent.setWaitingFlagTrue();
				else
					technologyContent.setWaitingFlagTrue();
				break;
		}
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case Constant.Action.ACADEMY_TECH_ITEM_NEXT:
				this.showTechnologyContent(param as TechVO);
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
	protected function updateTList()
	{
		if(isUpdateTList)
			return;
		isUpdateTList= true;
		var cityId:int = GameMain.instance().getCurCityId();
		tch_list = Research.instance().getTechnologyList(cityId);	
		Research.instance().updateAllTVO();		
		isUpdateTList = false;
		
		this.technologyList.updateData(tch_list);
		
		if(nc.topUI.uiName  == technologyContent.uiName)
		{
			technologyContent.updateData(null);
		}
	}
	
	public function UpdateData(param:Object):void
	{
		if(param)
		{
			buildInfo = param;
			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
			this.menuHead.setTitle(buildInfo.buildName,prestigeData["level"].Value,prestigeData["prestige"].Value);
			buildingContent.UpdateData(param);
		}
		updateTList();		
//		updateTListThread = new Thread(new ThreadStart(this.updateTList));
//   		updateTListThread.Start();
	
	}
	
	public function showTechnologyContent(tid:int):void
	{
		for(var tvo:TechVO in tch_list)
		{
			if(tvo.tid == tid)
			{
				showTechnologyContent(tvo);
				return;
			}
		}
	}
	public function showTechnologyContent(vo:TechVO)
	{
		t_index = 1;
		technologyContent.updateData(vo);
		this.updateShow();
	}
	
	public function showTechnologyList()
	{
		t_index = 0;
		this.updateShow();
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
					this.curShowObject = this.buildingContent;
				break;
				
			case 1:				
				switch(t_index)
				{
					case 0:						
							this.curShowObject =  this.technologyList;
							nc.pop(technologyContent);
						break;
					case 1:
							this.curShowObject = this.technologyContent;
							nc.push(technologyContent);
						break;
				}
				break;
		}
	}
	
	//TODO.. clear some data if close the dialog.
	protected function set curShowObject(value:UIObject)
	{
		_curShowObject = value;
	}
	
	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		KBN.FTEMgr.getInstance().showFTENext(FTEConstant.Step.UP_TECH_CLICK_RESEARCH);		
	}
	
	protected function get curShowObject():UIObject
	{
		return _curShowObject;
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		
		//if(this.background)
		//	DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, 150, background.width, background.height), rotation);
		
		/*if(frameTop.spt)
		{
			frameTop.rect = Rect( 0, 146, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw(true);
		//	DrawTextureClipped(frameTop, new Rect( 0, 0, frameTop.width, frameTop.height), Rect( 0, 146, frameTop.width, frameTop.height), rotation);
		}*/
		
		frameTop.Draw();
	}
	
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
}
