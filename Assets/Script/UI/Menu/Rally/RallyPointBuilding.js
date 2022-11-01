public class RallyPointBuilding extends KBNMenu implements IEventHandler
{
	//AllTab
	public static var ACTION_2March:String = "2march";

	public var clone_menuHead : MenuHead;
	public var menuHead  	:MenuHead;
	public var btn_2March 	:Button;
	
	public var toolBar:ToolBar;
	public var bottom_Texture : Texture2D;
	public var btY:float = 800;
	
	public var blankTip:Label;
	//Tab1
	public var clone_content : StandardBuildingContent;
	
	protected var detailContent : StandardBuildingContent;
	//Tab2
	
	public var con2_troopScroll :ScrollList;
	public var ins_troopItem 	:RallyTroopItem;
	
	//Tab3
	public var con3_moveScroll	:ScrollList;
	public var ins_moveItem		:RallyMoveItem;
	
	public var rmInfo :RallyMarchInfo;
	
	//Data.
	protected var viewIndex:int = 0;
	protected var buildInfo:Building.BuildingInfo;
	protected var nc:NavigatorController;
	
	protected var tlist:Array;
	protected var mlist:Array;
	public var bottomTile :Tile;

	public function Awake()
	{
		super.Awake();

		
	}
	
	function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		detailContent = Instantiate(clone_content);
		//detailContent = clone_content;
		nc = new NavigatorController();
		nc.push(con3_moveScroll);
 		nc.pushedFunc = priv_onPushed;
	
		btn_2March.OnClick = buttonHandler;
		btn_2March.clickParam = ACTION_2March;
		btn_2March.txt = Datas.getArString("OpenRallyPoint.MarchTroops");
		con2_troopScroll.Init(ins_troopItem);
		con3_moveScroll.Init(ins_moveItem);	
		con3_moveScroll.rect.x = 20;
		toolBar.Init();
		toolBar.toolbarStrings=[Datas.getArString("Common.Details"),Datas.getArString("OpenRallyPoint.MyTroops"), Datas.getArString("OpenRallyPoint.TroopMovement") ];
		toolBar.indexChangedFunc = this.changeTab;
		detailContent.Init();
		
		rmInfo.Init(nc);
		rmInfo.rect.x = 0;
		con3_moveScroll.itemDelegate = this;
		
		
		bottomTile = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
//		bottomTile.rect = bottomTile.spt.GetTileRect("tool bar_bottom");
		bottomTile.rect.x=  0 ;
		bottomTile.rect.y = 855;
		bottomTile.rect.width = 640;
		//bottomTile.name = "tool bar_bottom";
		
		frameTop.rect = Rect( 0, 131, frameTop.rect.width, frameTop.rect.height);
	}
	
	public function DrawItem()
	{
//		toolBar.Draw();	//in DrawTitle..
		/**
		btn_detail.Draw();
		btn_mytroop.Draw();
		btn_movement.Draw();
		**/
		this.drawTexture(bottom_Texture,0,btY);
		switch(viewIndex)
		{
			case 0:
				detailContent.Draw();
				break;
			case 1:
				con2_troopScroll.Draw();
				blankTip.Draw();
				break;
			case 2:
//				con3_moveScroll.Draw();
				nc.DrawItems();
				blankTip.Draw();
				break;
		}
				
		btn_2March.Draw();

	}
	function FixedUpdate()
	{
		switch(viewIndex)
		{
			case 2:
				nc.u_FixedUpdate();	
				break;
		}
	}
	public function Update()
	{
		menuHead.Update();
		switch(viewIndex)
		{
			case 0:
				detailContent.Update();
				break;
			case 1:
				con2_troopScroll.Update();
				break;
			case 2:
				nc.u_Update();
				break;		
		}
	}
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
		toolBar.selectedIndex = 0;
		viewIndex = 0;
		
		rmInfo.rect.y = 150;
		viewMarchVO = null;
		updateData(param);
		detailContent.rect.y = Constant.UIRect.MENUHEAD_H2;		
		//
		nc.pop2Root();
		con3_moveScroll.ResetPos();
		SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
	}
	
	protected function updateData(buildingInfo:Object):void
	{
		this.buildInfo = buildingInfo as Building.BuildingInfo;
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
		menuHead.setTitle(buildInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
		detailContent.UpdateData(buildingInfo);
		refreshData();		
	}
	////
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.ON_MARCH_OK:
			case Constant.Notice.MARCH_ITEM_REMOVED:					
			case Constant.Notice.SPEED_MARCH_OK:
			case Constant.Notice.SPEED_WILDER_OK:
			case Constant.Notice.PVE_SPEED_MARCH_OK:
					this.refreshData();		// 
				break;
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				detailContent.setWaitingFlagTrue();
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
		}
	}
	
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(buildInfo == null  || qItem == null )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildInfo.slotId)
		{
			this.close();
		}
		else
		{	
			this.updateData(Building.instance().buildingInfo(buildInfo.slotId,buildInfo.typeId) );			
		}
	}
	
	
	public function refreshData():void
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		//Tab2
		tlist = Barracks.instance().GetTroopListWithOutZero();		
		con2_troopScroll.SetData(tlist);				
		refreshMoveMent();
		
		updateBlankTip();
	}
	
	protected var viewMarchVO:MarchVO;
	private function refreshMoveMent():void
	{
			
		var curCityId:int = GameMain.instance().getCurCityId();	
		mlist = RallyPoint.instance().getMoveMentList(curCityId);
		
		con3_moveScroll.ResetPos();
		con3_moveScroll.SetData(mlist);
		//Detail ......
		var popInfo:boolean = true;
		if(viewMarchVO  && mlist && nc.topUI == rmInfo)
		{
			for(var i:int = 0; i< mlist.length; i++)
			{
				if( (mlist[i] as MarchVO).NIDX == viewMarchVO.NIDX )
				{
					popInfo = false;
					break;
				}	
			}
			if(popInfo)
				nc.pop();
		}
		
	}
	
	private function priv_onPushed(navCtrl : NavigatorController, uiObj : UIObject)
	{
		var rm : RallyMarchInfo = navCtrl.topUI as RallyMarchInfo;
		if ( rm == null )
			return;
		rm.didShowed();
	}
	
	public function DrawTitle()
	{
		menuHead.Draw();
		toolBar.Draw();
		btn_2March.SetVisible(viewIndex != 2 || nc.topUI!= rmInfo );
	}
	
	public function DrawBackground()
	{
		super.DrawBackground();
		
		//if(this.background)
		//	DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, 150, background.width, background.height), rotation);

		frameTop.Draw();

		if(bottomTile.IsValid)
			bottomTile.Draw(true);
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		
		switch(clickParam)
		{
			case ACTION_2March:
				if(checkMarch()) {
					//MenuMgr.getInstance().PushMenu("MarchMenu",null,"trans_zoomComp");
					MarchDataManager.instance().SetData(null);
				}
					
				break;				
		
		}
	}
	
	private	function	checkMarch():boolean{
		if( !Attack.instance().checkOverMarch() )
		{
//			var rallyMaxLevel:int = Building.instance().getMaxLevelForType(Constant.Building.RALLY_SPOT,GameMain.instance().getCurCityId() );
//			var curMaxMarchSlot:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,rallyMaxLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);
			var curMaxMarchSlot:int = Building.instance().getMaxMarchCount();
			if(curMaxMarchSlot  == (10 + Technology.instance().getTechAddMaxMarchCount()))
			{
				ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.MaxMarchLimit"));
			}
			else
			{
				ErrorMgr.instance().PushError("", Datas.getArString("ModalAttack.OverMarch"));
			}
			return false;
		}
		return true;
	}
	
	
	protected function changeTab(index:int):void
	{
		this.viewIndex = index;
		
		updateBlankTip();
	}
	
	protected function updateBlankTip():void
	{
		blankTip.SetVisible(false);
		switch(viewIndex)
		{
			case 1:
				if(!tlist || tlist.length == 0)
				{
					blankTip.SetVisible(true);
					blankTip.txt = Datas.getArString("March.NO_Troop");
				}
				break;
			case 2:
				if(!mlist || mlist.length == 0)
				{
					blankTip.SetVisible(true);
					blankTip.txt = Datas.getArString("March.NO_MoveMent");
				}
				break;
		}
	}
	
	public function handleItemAction(action:String,params:Object)
	{	
		rmInfo.resetNC(nc);
		nc.push(rmInfo);
		viewMarchVO = params as MarchVO;
		rmInfo.showMarchInfo(params);
	}
	
	public function OnPopOver()
	{
		con2_troopScroll.Clear();
		con3_moveScroll.Clear();
		rmInfo.Clear();
		detailContent.Clear();
		TryDestroy(detailContent);
		detailContent = null;
		TryDestroy(menuHead);
		menuHead = null;
	}
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
	
}
