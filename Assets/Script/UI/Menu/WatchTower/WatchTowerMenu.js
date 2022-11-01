
class WatchTowerMenu extends ComposedMenu
{
    //public var i:int;
	public var clone_content : StandardBuildingContent;
	private var content : StandardBuildingContent;
 	public var buildingInfo : Building.BuildingInfo;
 	public var attackList:ScrollList;
 	public var attackItem:AttackItem;
 	public var comingAttack:ComingAttackDetail;
// 	static var instance:WatchTowerMenu;
 	public var attackNote:NotifyBug;
 	public var hide:ItemHide;
 	public var itemBack:SimpleLabel;
 	public var l_back:Label;
 	public var l_inComing:Label;
 	public var antiScoutTime:SimpleLabel;
 	public var attackTab:ComposedUIObj;
 	private var noted:boolean = false;
 	private var strAtkInc:String;
 //	var items:ComposedUIObj;
	
	function Init()
	{
		super.Init();
		//menuHead.Init();
		attackList.Init(attackItem);
		attackTab.component = [l_back, l_inComing, attackList];
		content = Instantiate(clone_content);
		tabArray = [content, attackTab]; 
		comingAttack.Init();

//		instance = this;
		content.Init();
		noted = false;
		strAtkInc = Datas.getArString("WatchTower.IncomingAttacks");
	}
	
 	public function OnPush(param:Object)
	{
		super.OnPush(param);
		this.buildingInfo = param as Building.BuildingInfo;		
		UpdateData(param);		
		var detail:String = Datas.getArString("Common.Details");
		var incoming:String =  Datas.getArString("WatchTower.IncomingAttacks");
		titleTab.toolbarStrings = [detail, incoming];
		attackList.SetData(Watchtower.instance().GetAttackList());
		
		
//		var newItem:AttackItem;
//		items =  new ComposedUIObj();
//		for(var i:int = 0; i<20; i++)
//		{
//			newItem = new AttackItem();
//			newItem.Copy(attackItem);
//			items.addUIObject(newItem);
//		}
//		items.AutoLayout();
		hide.title.txt = Datas.getArString("WatchTower.AntiScouting");
		hide.description.txt = Datas.getArString("WatchTower.AntiScoutDesc");
		hide.btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
		hide.price.txt = "5";
		hide.icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("buff_2_icon",TextureType.ICON);
		hide.progress.Init(null, 0, 24*3600);
		hide.progress.setBackground("progress_bar_bottom",TextureType.DECORATION);
		hide.btnSelect.OnClick = function(param:Object)
		{
			Watchtower.instance().useHide();
		};
		content.rect.y =150;
		menuHead.rect.height = 150;
		l_inComing.txt = strAtkInc + ": " + Watchtower.instance().GetAttackNumOfCurCity();
		attackNote.SetCnt(Watchtower.instance().GetAttackNumOfCurCity());
		SoundMgr.instance().PlayOpenBuildMenu(this.buildingInfo.typeId);
	}
	
	public	function	OnPopOver():void
	{
		content.Clear();
		TryDestroy(content);
		content = null;
		attackList.Clear();
		comingAttack.Clear();
		super.OnPopOver();
	}
	
	function Update()
	{
		super.Update();
		if(selectedTab == 1)		
		{
			 if( subMenuStack.Count < 1)
				attackList.Update();			
		}
		else
		{
			content.Update();
		}
//		antiScoutTime.txt = _Global.timeFormatStr( Watchtower.instance().remainingAntiScoutingTime );
		hide.Update();
		var attackQuant:int = Watchtower.instance().GetAttackNumOfCurCity();
		l_inComing.txt = strAtkInc + ": " + attackQuant;
		attackNote.SetCnt(attackQuant);
	}
	
	public function DrawTitle()
	{					
		selectedTab = titleTab.Draw();
		if( lastTab != selectedTab)
		{
			ClearMenuStack();
			lastTab = selectedTab;
			if( !noted && selectedTab == 1)
			{
				MenuMgr.getInstance().PushMessage(Datas.getArString("WatchTower.ItemNote"));
				noted = true;
			}
		}
		attackNote.Draw();
		
	}
	
	public function DrawItem()
	{
		super.DrawItem();
		if(selectedTab == 0)
		{			
			itemBack.Draw();			
			hide.Draw();			
		}
	}
	
	
	function ClickAttackItem(param)
	{
		PushSubMenu(comingAttack, param);
	}
	
	public function UpdateData(param:Object)
	{
		this.buildingInfo = param as Building.BuildingInfo;//	;			
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
			case Constant.Notice.ATTACKINFO:
				handlAttackUpdate(body);
				break;	
		}
	}
	
	protected function handlAttackUpdate(body:Object)
	{
		attackList.SetData(Watchtower.instance().GetAttackList());
		if(subMenuStack.Count > 0)
			comingAttack.handleNotification(Constant.Notice.ATTACKINFO, body);
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
}

