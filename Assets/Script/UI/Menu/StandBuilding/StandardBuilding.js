class StandardBuilding extends KBNMenu
{
	
	protected var menuHead:MenuHead;
	public var clone_menuHead:MenuHead;
	
	public var clone_content : StandardBuildingContent;
	private var buildingContent : StandardBuildingContent;

 	public var buildInfo : Building.BuildingInfo;
	
	protected var oldY:int;
	
	public function DrawItem()
	{
		
		buildingContent.Draw();	
			
	}
	
	public function ClickBuildUpgrade()
	{
		buildingContent.sc_btn1.Click();
	}
//	public function Start()
//	{
//		super.Start();		
//		Init();
//
//		//
//	
//	}
	
	public function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		if(!background)
			this.background = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.DECORATION);
		
		/*if(!frameTop.spt)
		{
		//	this.frameTop = Resources.Load("Textures/UI/decoration/frame_metal_top");
			frameTop.spt = TextureMgr.instance().BackgroundSpt();
			frameTop.rect = frameTop.spt.GetTileRect("frame_metal_top");
			frameTop.name = "frame_metal_top";
		}*/

		frameTop.rect = Rect( 0, 69, frameTop.rect.width, frameTop.rect.height);

		buildingContent = this.Instantiate(clone_content);
		buildingContent.rotation = this.rotation;
		buildingContent.Init();		
	}
	//
	public function UpdateData(param:Object)
	{
		this.buildInfo = param as Building.BuildingInfo;//	as BuildingInfo;	
		
		buildingContent.UpdateData(param);		
//		var mTitle:String = buildInfo.buildName + "(" + Datas.getArString("Common.Lv") + buildInfo.curLevel + ")";
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
		menuHead.setTitle(buildInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
	}
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
				
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				buildingContent.setWaitingFlagTrue();
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
	//end  notification 
	
	public function Update()
	{
		menuHead.Update();
		
		this.buildingContent.Update();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
//		menuHead.rect.height = Constant.UIRect.MENUHEAD_H1;
		oldY = buildingContent.rect.y;
		rect.y = 0;
		
		buildingContent.rect.y = 90;	//menuHead.rect.height;
		
		
		UpdateData(param);

		SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
	}
	
	function DrawBackground()
	{
		menuHead.Draw();

//		if(this.background)
//			DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, 90, background.width, background.height), rotation);
		bgStartY = 70;
		DrawMiddleBg();		
		/*if(frameTop.spt)
		{
			frameTop.rect = Rect( 0, 86, frameTop.rect.width, frameTop.rect.height);*/
			frameTop.Draw();
		//	DrawTextureClipped(frameTop, new Rect( 0, 0, frameTop.width, frameTop.height), Rect( 0, 86, frameTop.width, frameTop.height), rotation);
		//}
	}
	
	public function OnPop()
	{
		super.OnPop();
		buildingContent.rect.y = 150;		
	}
	
	public function OnPopOver()
	{
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		TryDestroy(menuHead);
		menuHead = null;
	}
	
}
