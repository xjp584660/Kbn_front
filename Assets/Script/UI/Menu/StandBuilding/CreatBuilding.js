public class CreatBuilding extends KBNMenu
{
	public var clone_menuHead : MenuHead;
	public var menuHead  :MenuHead;
	
	public var buildingList : ScrollList;	
	public var ins_buildingItem : CreatBuildingItem;
	
	public var con2:SubContainer;
	
	public var st2_l_bg1		:Label;
	public var st2_l_bg2		:Label;
	public var st2_l_img		:Label;
//	public var st2_l_title		:Label;
	public var st2_l_description :Label;
	public var st2_l_level		:Label;
	public var st2_l_level_des	:Label;
	public var st2_l_time		:Label;
	public var st2_l_price		:Label;
	
	public var st2_btn_buildnow :Button;
	public var st2_btn_build	:Button;
	public var st2_requirecon	:RequireContent;
	public var st2_l_error		:Label;
	public var sc_l_instanttip	:Label;
	public var sc_l_saleComp	:SaleComponent;
	
//	public var btn_back : Button;
	
	protected var curView:UIObject;
	protected var trans:TransHorMove= new TransHorMove();
	protected var _viewIndex:int = 0;
	protected var curState:int = 0;
	public var bgTexture : Texture2D;
	
	//data ..
	protected var slotId:int;
	protected var bd_list : Building.BuildingInfo[];
	protected var nc:NavigatorController;
	
	///prefab data
	private var isStatus_time:boolean;
	
	public var BTN_BUILD_X1:int=140;
	public var BTN_BUILD_X2:int=420;
	
	public var Test_Lv10:boolean;
	
	private var buildingInfo:Building.BuildingInfo;
	private var isWaitingBuild:boolean = false;
	
//	public function Awake()
//	{
//		super.Awake();
//
//		Init();
//	}
	

	public function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		
		frameTop.rect = Rect( 0, 69, frameTop.rect.width, frameTop.rect.height);
		
		nc = new NavigatorController();
		nc.Init();
		
		buildingList.Init(ins_buildingItem);
		curView = buildingList;
//		con2 = new SubContainer();
		
		con2.addChild(st2_l_bg1);
		con2.addChild(st2_l_bg2);
		con2.addChild(st2_l_img);
//		con2.addChild(st2_l_title);
		con2.addChild(st2_l_description);
		con2.addChild(st2_l_level);
		con2.addChild(st2_l_level_des);
//		con2.addChild(st2_l_title);
		con2.addChild(st2_l_error);
		con2.addChild(st2_l_time);
		con2.addChild(st2_btn_build);
		con2.addChild(st2_btn_buildnow);
		con2.addChild(st2_requirecon);
		con2.addChild(st2_l_price);
		con2.addChild(sc_l_instanttip);
		con2.addChild(sc_l_saleComp);
//		con2.addChild(btn_back);
		
//		con2.Init();
		con2.uiName = "CON2";
		
//		btn_back.OnClick = btnHandler;
//		btn_back.clickParam = "back";
		st2_btn_build.OnClick = btnHandler;		
		st2_btn_build.clickParam = "build";

		st2_requirecon.Init();

		
		st2_btn_buildnow.OnClick = btnHandler;
		st2_btn_buildnow.clickParam = "buildnow";
		
		st2_btn_build.txt = Datas.getArString("ModalBuild.ManualBuild");
		st2_btn_buildnow.txt = Datas.getArString("ModalBuild.InstantBuild");
		var t:String = Datas.getArString("ModalTitle.Create_Building");
		
//		st2_l_error.txt = "Other is Building ...";
		
		nc.pushedFunc = pushedFunc;
		
		nc.push(buildingList);
		st2_l_img.useTile = true;
		isWaitingBuild = false;
	}
	
	public function DrawItem()
	{
		/**
		switch(viewIndex)
		{
			case 0:
				buildingList.Draw();
				break;
			case 1:
				con2.Draw();
				st2_l_time.Draw();
				st2_l_img.Draw();
				st2_l_title.Draw();
				st2_l_description.Draw();
				st2_l_level.Draw();
				st2_l_level_des.Draw();
				st2_btn_build.Draw();
				st2_btn_buildnow.Draw();
				st2_requirecon.Draw();
				btn_back.Draw();				
				break;
		}
//		**/
//		if(curState != Constant.State.Normal )
//		{
//			buildingList.Draw();
//			con2.Draw();				
//		}
//		else
//		{
//			curView.Draw();
//		}
		if(isStatus_time && buildingInfo!= null && buildingInfo.otherQueueStatus != null)
			st2_l_time.txt = Datas.getArString("ModalBuild.AvailableTime") + _Global.timeFormatStrPlus(( buildingInfo.otherQueueStatus as BuildingQueueMgr.QueueElement).timeRemaining); ;
		nc.DrawItems();
		
//		ins_buildingItem.Draw();
	}
	
	public function Start()
	{
		super.Start();
		menuHead.SetVisible(true);
	}
	
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
		if(sc_l_saleComp && sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.Update();
	}
	
	function Update()
	{
		menuHead.Update();
		//if(viewIndex == 0)
			//buildingList.Update();
		nc.u_Update();
		if(nc.topUI.uiName == con2.uiName)
		{
			st2_requirecon.Update();			
		}
	}
	/*
	function FixedUpdate()
	{
		super.FixedUpdate();
		if(curState == Constant.State.Push)
		{
			trans.FadeinUpdate();
			if(trans.IsFin())
			{
				curState = Constant.State.Normal;
			}
		}
		else if(curState == Constant.State.Pop)
		{
			trans.FadeoutUpdate();
			if(trans.IsFin())
			{
				curState = Constant.State.Normal;
			}
		}
	}
	*/
	protected function get viewIndex():int
	{
		return _viewIndex;
	}
	
	protected function set viewIndex(value:int)
	{
//		if(value != _viewIndex)
//		{
//			_viewIndex = value;
//			if(value == 1)
//			{
//				curState = Constant.State.Push;
//				trans.StartTrans(buildingList,con2);
//				curView = con2;
//			}
//			else
//			{
//				curState = Constant.State.Pop;
//				trans.StartTrans(con2,buildingList);
//				curView  = buildingList;
//			}		
//		}
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		nc.pop2Root();
		this.buildingList.rect.x = 0;
		con2.rect.x = 0;
		
		viewIndex = 0;
		st2_requirecon.rect.y = 320;
		
		updateTitle();
		
		st2_btn_buildnow.SetVisible(Player.getInstance().CanBuyInstantBuildOrResearch);		
		UpdateData(param);
		
		//
		
		//
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
				setWaitingFlagTrue();
				break;
		}
	}
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(null == buildingInfo || null == qItem )
		{
			return;
		}
		if(nc.topUI.uiName == con2.uiName)
			this.gotoStandardBuilding(null);
		 
	}
	//end  notification 
	
	public function gotoCreatBuilding(typeId:int):void
	{
		var buildingInfo:Building.BuildingInfo;
		for(buildingInfo in bd_list)
		{
			if(buildingInfo.typeId == typeId)
			{
				this.gotoStandardBuilding(buildingInfo);
				return;
			}
		}
	}
	
	public function UpdateData(param:Object)
	{
		slotId = _Global.INT32(param);
		// scrollList ..
		var cityId :int = GameMain.instance().getCurCityId();		
		bd_list = Building.instance().getCreatBuildingList(cityId,slotId);		
		var idata:Building.BuildingInfo;
		
		for(var i:int=0; i<bd_list.length; i++)
		{
			idata = bd_list[i] as Building.BuildingInfo;
			idata.callBack = gotoStandardBuilding;
			idata.slotId = slotId; // for standardbuilding creat..
		}		
		buildingList.ResetPos();
		buildingList.SetData(bd_list);
		
//		ins_buildingItem.SetRowData(bd_list[0]);
	}
	
	function DrawBackground()
	{
		menuHead.Draw();

		//if(this.background)
		//	DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, 90, background.width, background.height), rotation);
		bgStartY = 70;
		DrawMiddleBg();

		frameTop.Draw();
	}
	
	protected function gotoStandardBuilding(buildingInfo:Building.BuildingInfo):void
	{
//		viewIndex = 1;
		if(nc.topUI.uiName != con2.uiName)
		{
			nc.push(con2);
		}
		var seed:HashObject = GameMain.instance().getSeed();
		menuHead.leftHandler = menuLeft;
		if(buildingInfo != null)
			this.buildingInfo = buildingInfo; 
		// st2...
		st2_l_img.tile = TextureMgr.instance().BuildingSpt().GetTile(this.buildingInfo.buildingTexturePath);
		//st2_l_img.tile.name = this.buildingInfo.buildingTexturePath;
//		st2_l_img.mystyle.normal.background = TextureMgr.instance().LoadTexture(buildingInfo.buildingTexturePath, TextureType.ICON_BUILDING);//Resources.Load(buildingInfo.buildingTexturePath);
		selectBuildingInfo = this.buildingInfo;
//		st2_l_title.txt = buildingInfo.buildName;
		st2_l_description.txt = this.buildingInfo.description;
		st2_l_level.txt = Datas.getArString("Common.Lv") + " 1";
		st2_l_level_des.txt = this.buildingInfo.curLevel_description;
		st2_l_time.txt = Datas.getArString("ModalBuild.BuildTime") + _Global.timeFormatStr(this.buildingInfo.buildtime); 
		st2_requirecon.SetVisible(true);
		st2_requirecon.showRequire(this.buildingInfo.requirements.ToArray());
		sc_l_instanttip.SetVisible(false);
		st2_l_time.SetVisible(true);
		sc_l_saleComp.rect.x = st2_btn_buildnow.rect.x + 2;
		sc_l_saleComp.SetVisible(false);
		
		//check if other is building ..
		var hasQueue:boolean;
		var canInstant:boolean;
		canInstant = Player.getInstance().CanBuyInstantBuildOrResearch;
//		canInstant = Test_Lv10;
		
		var cityId:int = GameMain.instance().getCurCityId();
		
		hasQueue = BuildingQueueMgr.instance().first(cityId) != null ;
		
		st2_btn_build.rect.x = BTN_BUILD_X1;
		st2_l_time.rect.x = BTN_BUILD_X1;
		st2_l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
	
		st2_btn_build.SetVisible(true);
		st2_btn_build.changeToBlueNew();
		st2_btn_build.OnClick = btnHandler;
		isStatus_time = false;
		var rateSale:HashObject = seed["upgradeRate"];
		var rate:float = _Global.FLOAT(seed["buyUpgradRateBuilding"].Value);
		
		var tmpTimeceil:int = _Global.INT32(Building.instance().getInstantBuildGem(this.buildingInfo.typeId,1) *_Global.INT32(rate*10000) + 9999)/10000;
		var initialPrice:int = _Global.INT32(Building.instance().getInstantBuildGem(this.buildingInfo.typeId,1));
		st2_l_price.txt = "" + tmpTimeceil;

		st2_btn_buildnow.txt = Datas.getArString("ModalBuild.InstantBuild");
		if(st2_requirecon.req_ok) // requirement met
		{
			if(hasQueue) // another is building/upgrading
			{
				st2_l_error.SetVisible(!canInstant);
				st2_l_error.txt =  Datas.getArString("ModalBuild.BuildOneAtTime");
				
				st2_l_price.SetVisible(canInstant);
				st2_btn_buildnow.SetVisible(canInstant);
				sc_l_saleComp.SetVisible(canInstant);
				
				var splicTest:int = 0;
				if(seed["directbuyType"])
					splicTest = _Global.INT32(seed["directbuyType"]);
				
				if(splicTest == 0)	
					st2_btn_build.changeToGreyNew();
				
				//st2_btn_build.changeToGrey();
				st2_btn_build.OnClick = openDirectBuy;
				
				st2_l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");

				if(canInstant)
				{
					isStatus_time = true;
					if(this.buildingInfo.otherQueueStatus != null)
						st2_l_time.txt = Datas.getArString("ModalBuild.AvaiableTime") + _Global.timeFormatStrPlus((this.buildingInfo.otherQueueStatus as BuildingQueueMgr.QueueElement).timeRemaining);
					
					resetSaleComponent(rateSale,initialPrice, tmpTimeceil);
				}
				else
				{
					st2_btn_build.rect.x = BTN_BUILD_X2;
					st2_l_time.rect.x = BTN_BUILD_X2;
					st2_l_time.txt = _Global.timeFormatStrPlus(this.buildingInfo.buildtime);	// no build.
				}
			}
			else	// normal.
			{
				//st2_l_time : white font.
				st2_l_error.SetVisible(false);
				st2_btn_buildnow.SetVisible(canInstant);		
				
				if(canInstant)
				{
					resetSaleComponent(rateSale,initialPrice,tmpTimeceil);
				}
				else
				{
					st2_l_error.SetVisible(false);
					st2_btn_buildnow.SetVisible(canInstant);
					st2_l_price.SetVisible(canInstant);
				}
			}
		}
		else	//requirement not met
		{
			if(Utility.instance().checkInstantRequire(this.buildingInfo.requirements) && canInstant)
			{
				st2_btn_buildnow.SetVisible(true);
				st2_btn_buildnow.txt = Datas.getArString("ModalBuild.InstantUpgrade");
				
				st2_btn_build.SetVisible(false);
				st2_btn_build.OnClick = null;
				
				st2_l_price.SetVisible(true);
				
				var timePrice:int = Building.instance().getInstantBuildGem(this.buildingInfo.typeId,this.buildingInfo.curLevel + 1);
				var RsPrice:float = Utility.instance().calResouceToGems("b",this.buildingInfo.requirements,this.buildingInfo.curLevel,this.buildingInfo.typeId);
				
				var totalCost:int = _Global.INT32(timePrice*_Global.INT32(rate*10000) + 9999)/10000+ Mathf.Ceil(RsPrice*rate);
				
				resetSaleComponent(rateSale,timePrice + Mathf.Ceil(RsPrice), totalCost);

				sc_l_instanttip.SetVisible(true);
				sc_l_instanttip.txt = Datas.getArString("ModalBuild.InstantDesc") ;
				
				st2_l_error.SetVisible(false);
				st2_l_time.SetVisible(false);
			}
			else
			{
				st2_l_price.SetVisible(false);
				sc_l_saleComp.SetVisible(false);
				st2_btn_buildnow.SetVisible(false);
				/////
				st2_l_error.SetVisible(true);
				st2_l_time.SetVisible(true);
				
				st2_btn_build.SetVisible(true);
				st2_btn_build.changeToGreyNew();
				st2_btn_build.OnClick = null;
				st2_btn_build.rect.x = BTN_BUILD_X2;
				st2_l_time.rect.x = BTN_BUILD_X2;
				st2_l_time.txt = _Global.timeFormatStrPlus(this.buildingInfo.buildtime);	// no build.
				st2_l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");
				
				st2_l_error.txt =  Datas.getArString("ModalBuild.ReqNotMet") ;
			}		
		}
		
		if(sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.cutTimeLeftLabel();
			
		if(!hasQueue && isWaitingBuild)
		{
			Building.instance().buildAction(selectBuildingInfo.typeId,selectBuildingInfo.curLevel,selectBuildingInfo.slotId);
			isWaitingBuild = false;
			close();
		}
//		
//		st2_l_price.SetVisible(st2_btn_buildnow.isVisible());
		
	}
	
	public function setWaitingFlagTrue():void
	{
		isWaitingBuild = true;
	}
	
	private function resetSaleComponent(rateSale:HashObject, initialPrice:int, tmpTimeceil:int):void
	{
		var canInstant:boolean = Player.getInstance().CanBuyInstantBuildOrResearch;
		if(rateSale != null && rateSale["building"] && rateSale["building"]["isShow"] && _Global.INT32(rateSale["building"]["isShow"]) == 1)
		{			
			sc_l_saleComp.setData(initialPrice,tmpTimeceil, _Global.INT64(rateSale["building"]["startTime"]), _Global.INT64(rateSale["building"]["endTime"]), 1, false);
			st2_l_price.SetVisible(false);
			sc_l_saleComp.SetVisible(canInstant);
		}
		else
		{
			st2_l_price.SetVisible(canInstant);
			sc_l_saleComp.SetVisible(false);
			st2_l_price.txt = "" + tmpTimeceil;						
		}
	}
	
	private function openDirectBuy():void
	{
		var element:QueueItem = BuildingQueueMgr.instance().first(GameMain.instance().getCurCityId());
		var gems:int = SpeedUp.instance().getTotalGemCost(element.timeRemaining);
		
		Utility.instance().instantFinishPreQueue(element, gems, SpeedUp.PLAYER_ACTION_CONSTRUCT);
	}
	
	private var selectBuildingInfo:Building.BuildingInfo;
	protected function btnHandler(param:Object):void
	{		
		switch(param)
		{			
			case "back":
//				viewIndex = 0;
				
				nc.pop(con2);
				break;
			case "build":
				Building.instance().buildAction(selectBuildingInfo.typeId,selectBuildingInfo.curLevel,selectBuildingInfo.slotId);
				close();
				break;
			case "buildnow":
				var aditionGems:float = 0f;//Utility.instance().calResouceToGems("b",buildingInfo.requirements,buildingInfo.curLevel,buildingInfo.typeId);
				if(Utility.instance().checkInstantRequire(buildingInfo.requirements))
				{
					aditionGems = Utility.instance().calResouceToGems("b",selectBuildingInfo.requirements,selectBuildingInfo.curLevel,selectBuildingInfo.typeId);
				}
				
				Building.instance().instantBuild(selectBuildingInfo.typeId,selectBuildingInfo.curLevel,selectBuildingInfo.slotId,aditionGems);
				close();
		}
	}
	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		updateTitle();
	}
	protected function updateTitle()
	{
		switch(nc.topUI)
		{
			case buildingList:
				menuHead.setTitle( Datas.getArString("ModalTitle.Create_Building") );
				break;				
			case con2:
				menuHead.setTitle(selectBuildingInfo.buildName);
				break;
		}
		
		KBN.FTEMgr.getInstance().showFTENext(FTEConstant.Step.BUILD_HOUSE_CLICK_BUILD);
	}
	protected function menuLeft():void
	{
		menuHead.leftHandler = null;
		nc.pop(con2);
		updateTitle();
	}
	
	public function OnPop()
	{
		menuLeft();	
	}
	
	public	function OnPopOver():void{
		buildingList.Clear();
		st2_requirecon.Clear();
		con2.ClearChild();
		TryDestroy(menuHead);
		menuHead = null;
	}
	
	public function close()
	{
		if( MenuMgr.getInstance().GetCurMenu() == this ){
			MenuMgr.getInstance().PopMenu("");
		}
	}
	
	public function getmyNacigator():NavigatorController
	{
		return nc;
	}
	
}





