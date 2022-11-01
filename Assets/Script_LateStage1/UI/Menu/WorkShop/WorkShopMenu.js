import System.Threading;

public class WorkShopMenu extends KBNMenu implements IEventHandler
{
	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;
	public var toolBar :ToolBar;
	public var craftSubToolBar:ToolBar;
	public var clone_content  : StandardBuildingContent;
	public var craftList : CraftList;
	public var rubyList : CraftList;
	public var sapphireList : CraftList;
	public var emeraldList : CraftList;
	public var diamondList : CraftList;
	public var l_right1:Label;
	public var l_right2:Label;
	public var l_right3:Label;
	public var l_right4:Label;
	public var studyContect:StudyContent;
	public var craftContent:CraftContent;
	protected var buildingContent : StandardBuildingContent;
	
	private var buildInfo : Building.BuildingInfo;
	
	protected var _curShowObject  :UIObject;
	protected var selectedIndex:int = 0;
	protected var sub_index:int = 0;
	protected var t_index:int = 0;
	protected var nc:NavigatorController;
	private   var updateTListThread:Thread;
	private   var isUpdateTList = false;
	private var m_RubyListData:Array;
	private var m_SapphireListData:Array;
	private var m_EmeraldListData:Array;
	private var m_DiamondListData:Array;
	
	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		buildingContent = Instantiate(clone_content);
		menuHead.Init();
		menuHead.SetVisible(true);	
		toolBar.Init();
		toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Crafting") ];
		toolBar.indexChangedFunc =   ChangeMainTab;
		craftSubToolBar.Init();
		craftSubToolBar.toolbarStrings = [Datas.getArString("Common.Ruby"), Datas.getArString("Common.Sapphire"), Datas.getArString("Common.Emerald"), Datas.getArString("Common.Diamond") ];
		craftSubToolBar.indexChangedFunc = ChangeSubTab;
		buildingContent.Init();
		nc = new NavigatorController();
		
		this.craftList.scroll.itemDelegate = this;
		craftList.Init();
		this.rubyList.scroll.itemDelegate = this;
		rubyList.Init();
		this.sapphireList.scroll.itemDelegate = this;
		sapphireList.Init();
		this.emeraldList.scroll.itemDelegate = this;
		emeraldList.Init();
		this.diamondList.scroll.itemDelegate = this;
		diamondList.Init();
		craftList = rubyList;
		
		rubyList.Clear();
		sapphireList.Clear();
		emeraldList.Clear();
		diamondList.Clear();
		
		studyContect.Init();
		studyContect.f_click_callBack = showCraftList;
		
		craftContent.Init();
		craftContent.f_click_callBack = showCraftList;
		
		m_RubyListData = WorkShop.instance().getRubyListData();
		m_SapphireListData = WorkShop.instance().getSapphireListData();
		m_EmeraldListData = WorkShop.instance().getEmeraldListData();
		m_DiamondListData = WorkShop.instance().getDiamondListData();
		
		frameTop.rect = Rect( 0, 130, frameTop.rect.width, frameTop.rect.height);
		l_right1.SetVisible(false);
		l_right2.SetVisible(false);
		l_right3.SetVisible(false);
		l_right4.SetVisible(false);
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		bgStartY = 130;
		frameTop.Draw();		
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
		craftSubToolBar.Draw();
		l_right1.Draw();
		l_right2.Draw();
		l_right3.Draw();
		l_right4.Draw();
	}
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	function Update()
	{
		menuHead.Update();
		nc.u_Update();
		if(selectedIndex == 1 && t_index == 0)
		{
			craftSubToolBar.SetVisible(true);
			l_right1.SetVisible(hasSatisfyItem(m_RubyListData));
			l_right2.SetVisible(hasSatisfyItem(m_SapphireListData));
			l_right3.SetVisible(hasSatisfyItem(m_EmeraldListData));
			l_right4.SetVisible(hasSatisfyItem(m_DiamondListData));
			//
		}
		else
		{
			if(selectedIndex == 0)
			{
				buildingContent.Update();
			}
			craftSubToolBar.SetVisible(false);
			l_right1.SetVisible(false);
			l_right2.SetVisible(false);
			l_right3.SetVisible(false);
			l_right4.SetVisible(false);
		}
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		buildInfo = param as Building.BuildingInfo;
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;
		toolBar.selectedIndex = 0;
		craftSubToolBar.SetVisible(false);
		t_index = 0;
		sub_index = 0;
		nc.pop2Root();
		
		UpdateCraftData();
		UpdateList();
		this.UpdateData(param); 

		SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
	}
	
	protected function ChangeMainTab(index:int)
	{
		selectedIndex = index; 
		t_index = 0;
		switch(selectedIndex)
		{
			case 0:
				nc.clear();
				break;
			case 1:
				UpdateList();
				UpdateCraftData();
				nc.push(craftList);
		}
	}
	
	protected function ChangeSubTab(index:int)
	{
		sub_index = index;
		UpdateList();
		nc.switchRootUI(craftList);
	}
	
	public function UpdateList()
	{
		switch(sub_index)
		{
			case 0:
				craftList = rubyList;
				break;
			case 1:
				craftList = sapphireList;
				break;
			case 2:
				craftList = emeraldList;
				break;
			case 3:
				craftList = diamondList;
				break;
			default:
				craftList = rubyList;
				break;
		}
	}
	
	public function UpdateCraftData()
	{
		rubyList.updateData(m_RubyListData);
		sapphireList.updateData(m_SapphireListData);
		emeraldList.updateData(m_EmeraldListData);
		diamondList.updateData(m_DiamondListData);
	}
	
	public function UpdateData(param:Object):void
	{
		if(param)
		{
			buildInfo = param;		
			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
			menuHead.setTitle(buildInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
			buildingContent.UpdateData(param);
		}
		
	}
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			case Constant.Action.CRAFT_ITEM_NEXT:
				var recipe:HashObject = param as HashObject;
				if(recipe !=null && recipe["recipeId"]!=null)
				{
					var recipeId:String = _Global.GetString(recipe["recipeId"]);
					var needStudy:boolean = WorkShop.instance().needStudyRecipe(recipeId);
					var hasStudy:boolean = WorkShop.instance().hasStudyRecipe(recipeId);
					if(needStudy == false || (needStudy == true && hasStudy == true))
					{
						showCraftContent(param);
					}
					else
					{
						showStudyContent(param);
					}
				}
				break;
		}	
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				buildingContent.setWaitingFlagTrue();
				break;
			case  Constant.Notice.CRAFTRECIPE_STUDY_COMPLETE:
					UpdateData(null);
					
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
			this.UpdateData(Building.instance().buildingInfo(buildInfo.slotId,buildInfo.typeId) );
		}
	}
	
	public function showCraftList(param:int)
	{
		if(param == 1)
		{
			nc.pop(studyContect);
		}
		else if(param == 2)
		{
			nc.pop(craftContent);
		}
		t_index = 0;
		UpdateCraftData();
	}
	
	protected function showStudyContent(param:Object)
	{
		t_index = 1;
		curShowObject = studyContect;
		studyContect.updateData(param);
		nc.push(studyContect);
	}
	
	protected function showCraftContent(param:Object)
	{
		t_index = 2;
		curShowObject = craftContent;
		craftContent.updateData(param);
		nc.push(craftContent);
	}
	
	protected function set curShowObject(value:UIObject)
	{
		_curShowObject = value;
	}
	
	protected function get curShowObject():UIObject
	{
		return _curShowObject;
	}
	
	public function OnPopOver():void
	{
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		craftList.Clear();
		rubyList.Clear();
		sapphireList.Clear();
		emeraldList.Clear();
		diamondList.Clear();
		studyContect.Clear();
		craftContent.Clear();
		TryDestroy(menuHead);
		menuHead = null;
	}
	
	public function hasSatisfyItem(list:Array):boolean
	{
		var bRet = false;
		var hashItem:HashObject;
		var recipeId:String;
		if(list!=null)
		{
			for(var i:int=0;i<list.length;i++)
			{
				hashItem = list[i] as HashObject;
				if(hashItem != null)
				{
					recipeId = _Global.GetString(hashItem["recipeId"]);
					var needStudy:boolean = WorkShop.instance().needStudyRecipe(recipeId);
					var hasStudy:boolean = WorkShop.instance().hasStudyRecipe(recipeId);
					if(!needStudy || (needStudy && hasStudy))
					{
						if(WorkShop.instance().isCraftCostResEnough(recipeId) && WorkShop.instance().isCraftCostItemsEnough(recipeId))
						{
							bRet = true;
							return bRet;
						}
					}
				}
			}
		}
		return bRet;
	}
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
	
	
}
