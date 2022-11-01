class StoreHouseMenu extends KBNMenu implements IEventHandler
{
	public var toolBar:ToolBar;
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var itemTreasure:TreasureItem;
	public var treasureList:ScrollList;
	public var lockIcon:Label;
	public var lockDes:Label;
	public var treasureDes:Label;
	public var clone_content:StandardBuildingContent;
	protected var buildingContent:StandardBuildingContent;	
	
	private var selectedIndex:int;
	private var buildInfor : Building.BuildingInfo;			
							
	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		buildingContent = Instantiate(clone_content);
		//buildingContent = clone_content;		
		buildingContent.Init();	
		
		menuHead.Init();
		menuHead.SetVisible(true);	

		itemTreasure.Init();
		treasureList.Init(itemTreasure);
		treasureDes.Init();
		
		lockIcon.Init();
		lockDes.Init();
		
		lockIcon.useTile = true;
		lockIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("Multi_city_Lock");
		//lockIcon.tile.name = "Multi_city_Lock";	
		toolBar.Init();	
	}

	function Update()
	{
		menuHead.Update();
		if(selectedIndex)
		{
			treasureList.Update();			
		}
		else
		{
			buildingContent.Update();
		}		
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		buildingContent.rect.y = menuHead.rect.height;
		
		var isUnlock:boolean = March.instance().isSurveyOpen();
		
		lockIcon.SetVisible(!isUnlock);
		lockDes.SetVisible(!isUnlock);
		
		treasureDes.SetVisible(isUnlock);
		
		if(isUnlock)
		{
			treasureList.rect.y = 243;
			treasureList.rect.height = 720;
		}
		else
		{
			treasureList.rect.y = 285;
			treasureList.rect.height = 670;
		}
		
		lockDes.txt = Datas.getArString("MessagesModal.SurveyingLevel15");
	
		toolBar.selectedIndex = 0;
		resetTreasureList();
		
		frameTop.rect = new Rect(0, 130, 640, 52);	
		
		UpdateData(param);
		SoundMgr.instance().PlayOpenBuildMenu(this.buildInfor.typeId);
	}
	
	public function DrawTitle():void
	{
		menuHead.Draw();
		selectedIndex = toolBar.Draw();
	}				
	
	public function DrawItem():void	
	{
		lockIcon.Draw();	
	
		if(selectedIndex)
		{
			treasureDes.Draw();
			treasureList.Draw();

			lockDes.Draw();		
		}
		else
		{
			buildingContent.Draw();
		}
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		frameTop.Draw();
	}
	
	public function handleNotification(type:String, body:Object):void	
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				buildingContent.setWaitingFlagTrue();
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
				handleComplete(body as BuildingQueueMgr.QueueElement);
				break;		
			case "updateTreasureItems":
				resetTreasureList();
				break;
		}			
	}
	
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(!buildInfor || !qItem)
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildInfor.slotId )
		{
			this.close();
		}
		else
		{				
			UpdateData(Building.instance().buildingInfo(buildInfor.slotId, buildInfor.typeId));						
		}
	}
	
	protected function UpdateData(buildingInfo:Object):void
	{
		buildInfor = buildingInfo as Building.BuildingInfo;
		
		toolBar.toolbarStrings = [buildInfor.buildName, Datas.getArString("Common.Treasure") ];			

		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfor.typeId,buildInfor.curLevel);	
		menuHead.setTitle(buildInfor.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
		buildingContent.UpdateData(buildInfor);		
	}		
	
	private function resetTreasureList():void
	{
		var myItems:MyItems =  MyItems.instance();
		
		myItems.updateTreasureChest();
		var _treasureChests:System.Collections.Generic.List.<InventoryInfo> = myItems.GetList(MyItems.Category.TreasureChest);
		var _treasureItems:System.Collections.Generic.List.<InventoryInfo> = myItems.GetList(MyItems.Category.TreasureItem);
		var arr:System.Collections.Generic.List.<InventoryInfo> = new System.Collections.Generic.List.<InventoryInfo>();
		
		for(var b:int = 0; b < _treasureChests.Count; b++)
		{
			arr.Add(_treasureChests[b]);
		}
		
		for(var a:int = 0; a < _treasureItems.Count; a++)
		{
			arr.Add(_treasureItems[a]);
		}		
		
		if(_treasureChests.Count == 0)
		{
			treasureDes.txt = Datas.getArString("MainChrome.TreasureTabDesc");
		}	
		else
		{
			treasureDes.txt = Datas.getArString("MainChrome.TreasureTabDesc2");
		}
		
		var height:float = treasureDes.mystyle.CalcHeight(GUIContent(treasureDes.txt), treasureDes.rect.width);
		treasureDes.rect.height = height;
		
		//treasureList.rect.y = treasureDes.rect.y + treasureDes.rect.height + 15;

		treasureList.SetData(arr);		
		treasureList.ResetPos();		
	} 
	
	public	function	OnPopOver()
	{
		treasureList.Clear();
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		
		TryDestroy(menuHead);
		menuHead = null;
	}
																																																																																																																																											
}
