import System.Collections.Generic;
public class MuseumBuilding extends KBNMenu
{
	//index ==1
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var toolBar:ToolBar;
	public var clone_content:StandardBuildingContent;
	private var buildingContent:StandardBuildingContent;

	//index == 2
	public var lblTips:Label;
	public var lblLine:Label;
	public var lblComing:Label;
	public var scrollView:ScrollView;

	public var comUIObjList:ComposedUIObj;
	public var eventDetail:EventDetail;

	public var artifactTemplate:ArtifactItemDetail;

	//protected var naviCtrl:NavigatorController = new NavigatorController();
	private var controls2:UIObject[];
	private var selectedIndex:int = 0;
	private var buildInfo : Building.BuildingInfo;

	private var showDetail:boolean = false;
//	public function Awake()
//	{
//		super.Awake();
//	}

	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		eventDetail.Init();
		toolBar.Init();

		lblLine.setBackground("between line", TextureType.DECORATION);
		
		toolBar.indexChangedFunc = indexChange;
		selectedIndex = 0;
		buildingContent = Instantiate(clone_content);
		buildingContent.Init();
		lblTips.txt = Datas.getArString("artifactCategory.c20400");
		lblComing.txt = Datas.getArString("Museum.ArtifactComingSoon");
		lblComing.SetFont(FontSize.Font_BEGIN);
		controls2 = [lblTips,lblLine,scrollView];
		
		comUIObjList.component = [lblTips,lblLine,scrollView];
		frameTop.rect = Rect( 0, 131, frameTop.rect.width, frameTop.rect.height);

		InitTip();
	}
	
	public function DrawItem():void	
	{
		switch(selectedIndex)
		{
			case 0:
				buildingContent.Draw();
				break;
			case 1:
				// comUIObjList.Draw();
				eventDetail.Draw();
				break;
			case 2:
				eventDetail.Draw();
		}
		DrawTip();
	}
	
	private function indexChange(index:int):void
	{
		selectedIndex = index;
		
		switch(selectedIndex)
		{
			case 0:
				break;
			case 1:
				eventDetail.hideSelf();
				if(canGetEvent)
				{
					Museum.instance().GetArtifacts(artifactDetailDelegate);
				}
				break;
			case 2:
//				if(Museum.singleton.HasEvent)
//				{
					eventDetail.hideSelf();
//				}
//				else
//				{
//					eventDetail.showDescription();
//				}
				
				if(canGetEvent)
				{
					Museum.instance().GetEvents(eventDetailDelegate);
				}
				
				break;
		}
	}	
	
	private function artifactDelegate(arr:List.<KBN.Artifact>):void
	{
	
		scrollView.clearUIObject();
		
		var artifactsSetting:List.<KBN.Artifact> = arr;
		for(var i=0; i<artifactsSetting.Count; i++)
		{
			var artifact:ArtifactItemDetail = Instantiate(artifactTemplate) as ArtifactItemDetail;
			artifact.Init();		
			artifact.SetData(artifactsSetting[i]);
			artifact.SetVisible(true);
			scrollView.addUIObject(artifact);
		}
		scrollView.addUIObject(lblComing);
//		for(i=artifactsSetting.Length;i<artifacts.length;i++)
//		{
//			if(artifacts[i])
//			{
//				artifacts[i].SetVisible(false);
//			}
//		}
		scrollView.AutoLayout();		
	}
	
	public function resetArtifacts():void
	{
		for(var i:int = 0;i<scrollView.numUIObject;i++)
		{
			var artifact:ArtifactItemDetail = scrollView.getUIObjectAt(i) as ArtifactItemDetail;
			if(null != artifact && artifact.isVisible())
			{
				artifact.resetArtifactItem();
			}
		}
		Museum.instance().ArifactPriority();
//		Museum.instance().GetArtifacts(artifactDelegate);	
	}
	
	private function eventDetailDelegate(arr:List.<KBN.EventEntity>):void
	{
		if(Museum.singleton.HasEvent)
		{
			toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Artifacts"), Datas.getArString("Common.Events") + "(" + Museum.singleton.eventNum + ")"];
		}
		else
		{
			toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Artifacts"), Datas.getArString("Common.Events")];
		}
		eventDetail.TAB_TYPE=1;
		eventDetail.setDisplay(arr);
	}
	private function artifactDetailDelegate(arr:List.<KBN.EventEntity>):void
	{
		eventDetail.TAB_TYPE=0;
		eventDetail.setDisplay(arr);
	}

	
	public function DrawTitle():void
	{
		menuHead.Draw();
		toolBar.Draw();
	}
	
	function FixedUpdate()
	{
		
	}

	public var isCanTimeCounter:boolean=false;
	private var tipCanHideCounter:float = 0;
	function Update()
	{
		toolBar.Update();
		menuHead.Update();
		switch(selectedIndex)
		{
			case 0:
				buildingContent.Update();
				break;
			case 1:	
				// for(var item in controls2)
				// {
				// 	item.Update();
				// }
				eventDetail.Update();
				break;
			case 2:
				eventDetail.Update();	
		}
		if (isCanTimeCounter) {
			tipCanHideCounter+=Time.deltaTime;
		}

		if (IsTouched() && null != gearTip && (!gearTip.IsShowRingBase&&gearTip.IsShowTip() && tipCanHideCounter >= 0.55f))
		{
			CloseShowGearTip();
		}
	}
	private function CloseShowGearTip(){
		isCanTimeCounter = false;
		tipCanHideCounter = 0;
		
		ClearSelectEquipItem();
	}
	private function ClearSelectEquipItem():void
	{
		if (null != gearTip)
		{
			gearTip.CloseTip();
		}
		
		// if (selectItem)
		// {
		// 	selectItem.itemIcon.Darken();
		// }
		// selectItem = null;
	}
//	public function OnPop()
//	{
//		super.OnPop();
//		scrollView.clearUIObject();
//	}
// Tips
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	private function InitTip()
	{
		gearTip = new GearArmTip();
		gearTip.tip = tip;
		gearTip.Init();
	}
	private function DrawTip()
	{
		if (null != gearTip)
			gearTip.Draw();
	}

	private function IsTouched():boolean
	{
		var clicked:boolean = false;
#if (UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR
		if (Input.touchCount > 0)
		{
		 	var touch:Touch = Input.touches[0];
		 	if (touch.phase == TouchPhase.Began)
			{
				clicked = true;
			}
			else if (touch.phase == TouchPhase.Canceled)
			{
				clicked = false;
			}
		 }
#elif UNITY_EDITOR
		if (Input.GetMouseButtonDown(0))
			clicked = true;
#endif
		return clicked;
	}

	public	function	OnPopOver()
	{
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		scrollView.clearUIObject();
		eventDetail.Clear();
		TryDestroy(menuHead);
		PlayerPrefs.SetInt("RoundPowerToolBar",toolBar.selectedIndex);
		menuHead = null;

		if (null != gearTip)
			gearTip.OnPopOver();
	}

	private var startIndex:int = 0;
	private var canGetEvent:boolean = false;
	
	public function OnPush(param:Object):void
	{
		
		if(param as Building.BuildingInfo)
		{
			buildInfo = param as Building.BuildingInfo;	
			startIndex = PlayerPrefs.GetInt("RoundPowerToolBar",0);
		}
		else
		{			
			var hash:HashObject = param as HashObject;
			startIndex = _Global.INT32(hash["toolbarIndex"].Value);
			buildInfo = (hash["infor"].Value) as Building.BuildingInfo;
			eventDetail.SetVisible(false);
		}
		
		if(Museum.singleton.HasEvent)
		{
			toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Artifacts"), Datas.getArString("Common.Events") + "(" + Museum.singleton.eventNum + ")"];
		}
		else
		{
			toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Common.Artifacts"), Datas.getArString("Common.Events")];
		}


		
		canGetEvent = false;		

		super.OnPush(buildInfo);
	
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;
		toolBar.selectedIndex = startIndex;
		selectedIndex = startIndex;
		this.buildingContent.UpdateData(buildInfo);
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
		menuHead.setTitle(buildInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
				
		//Setting();
		//refresh inventory
		MyItems.instance().getInventoryData(Resetting);
		SoundMgr.instance().PlayOpenBuildMenu(this.buildInfo.typeId);
	}
	
	private function Resetting()
	{
		canGetEvent = true;
		
		if(startIndex == 2){			
			Museum.instance().GetEvents(eventDetailDelegate);
		}else if (startIndex==1) {
			Museum.instance().GetArtifacts(artifactDetailDelegate);
		}
	}
	
	function DrawBackground()
	{
		super.DrawBackground();

		frameTop.Draw();		
	}
	
	public function UpdateData(param:Object)
	{
		this.buildInfo = param ;//	as BuildingInfo;	
		
		buildingContent.UpdateData(param);
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
		menuHead.setTitle(buildInfo.buildName, prestigeData["level"].Value,prestigeData["prestige"].Value);	
		
	}
	
	/***  hanle notifications ..**/
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
			case Constant.Notice.OnMutiClaimOK:
//				eventDetail.resetDisplay(0);
				break;
			case "MutiClaimSucess":
				eventDetail.resetDisplay(body);
				break;
			case "OnShowTip":
				OnShowTip(body as Arm);
				break;
			case "CloseShowGearTip":
				CloseShowGearTip();
				break;

		}
	}

	private function OnShowTip(arm:Arm){
		if (null != gearTip && gearTip.IsShowTip()) {
			return;
		}
		gearTip.SetIsShowCompare(false);
		gearTip.ShowTip(arm);

		isCanTimeCounter=true;
		tipCanHideCounter=0;
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
			UpdateData(Building.instance().buildingInfo(buildInfo.slotId,buildInfo.typeId) );			
		}
	}
	//end  notification
}
