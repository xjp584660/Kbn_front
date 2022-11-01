public class StandardBuildingContent extends UIObject
{
	private static var ACTION_CANCEL		:String = "cancel";
	private static var ACTION_INSTANTBUILD	:String = "instand_build";
	private static var ACTION_UPGRADE		:String = "upgrade";
	private static var ACTION_SPEEDUP		:String = "speed_up";
	private static var ACTION_BUILD			:String = "build";
	private static var ACTION_PRESTIGE		:String = "prestige";
	
	public var content : ComposedUIObj;
	
	public var l_bg1	:Label;
	public var l_bg2	:Label;
	
	public var con_btn_destroy : Button;
	public var con_btn_desconstruct:Button;
	public var con_img :Label;
	public var con_title1:Label;
	public var con_title2:Label;
	public var l_NextLevel:Label;
	public var l_Prestige:Label;
	public var l_star1:Label;
	public var l_star2:Label;
	public var l_star3:Label;
	public var con_tc1:Label;
	public var con_tc2:Label;
	
	
	public var statuscon : ComposedUIObj;
	public var sc_btn1	:Button;
	public var sc_btn2	:Button;
	public var sc_l_status:Label;
	public var sc_l_time :Label;
	public var sc_l_price:Label;
	public var sc_l_saleComp:SaleComponent;
	public var sc_l_instanttip:Label;
	
	public var sc_l_bg : Label;
	public var sc_l_err:Label;

	public var clone_requirecon : RequireContent;

	private var requirecon : RequireContent;
	public var btnHelp:Button;

	public var bgTexture : Texture2D;
	public var lineTexture1:Texture2D;
	public var lineTexture2:Texture2D;
	
	
	private var l_time:Label;
	/// data ...
	
	protected var buildingInfo:Building.BuildingInfo;	//BuildingInfo;
	protected var req_ok:boolean;
	protected var req_res:String;
	
	private var isWaitingBuild:boolean;

	public  var rotation:UIRotation;
	
	// protected var confirmDialog:ConfirmDialog; 
	
	public var BTN_BUILD_X1:int = 140;
	public var BTN_BUILD_X2:int = 420;
	public var Adjust_Rect:boolean = true;
	
	private var resourceToGems:float = 0;
	private var _PayItem:Payment.PaymentElement;
	private var _CurPrice:int;
	private static var NEXTLEVEL_X:int = 25;
	private static var STAR_WIDTH:int = 25;
	private static var STAR_OFFSET:int = 14;
//	public var Test_Leve10:boolean = false;
	
	private var isStatus_time:boolean;
	
	public function HideDestroyAndDeconstructBtn()
	{
		con_btn_destroy.SetVisible(false);
		con_btn_desconstruct.SetVisible(false);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		this.DrawBackground();
		if(l_bg1)
		{
			l_bg1.Draw();
			l_bg2.Draw();
		}
		
		content.Draw();
		btnHelp.Draw();
		if(buildingInfo!=null && buildingInfo.queueStatus!=null && (buildingInfo.queueStatus as BuildingQueueMgr.QueueElement).timeRemaining >= 0 )		
			sc_l_time.txt = _Global.timeFormatStrPlus((buildingInfo.queueStatus as BuildingQueueMgr.QueueElement).timeRemaining );
		if(isStatus_time && buildingInfo!= null && buildingInfo.otherQueueStatus!=null)
			sc_l_status.txt = Datas.getArString("ModalBuild.AvailableTime") + _Global.timeFormatStrPlus((buildingInfo.otherQueueStatus as BuildingQueueMgr.QueueElement).timeRemaining); ;

		
		sc_l_err.Draw();
		sc_l_instanttip.Draw();
		statuscon.Draw();
		requirecon.Draw();
		sc_l_saleComp.Draw();
		GUI.EndGroup();
	}
//	public function Start()
//	{
//		//super.Start();
//
////		requirecon.SetVisible(true);			
//		Init();
//	}
	
	function Init()
	{
		content.Init();
		content.show = true;
		statuscon.Init();
		statuscon.show = true;	
		
		//adjust all standBuildingContent;
		if(Adjust_Rect)
		{
			statuscon.rect.x = 0;
//			sc_btn2.rect.x = 352;
			sc_l_status.rect.width = 400;
			sc_l_time.rect.width = 500;
			sc_l_price.rect.width = 250;
			//sc_l_err;
			sc_l_err.rect.width = 373.7;
			sc_l_err.rect.height= 106;
			sc_l_err.rect.y = statuscon.rect.y + 11.7;
			sc_l_err.mystyle.padding.right = 10;
			sc_l_instanttip.rect.y = statuscon.rect.y + 11.7;
		}
		this.rect.y = 150;	//default 150.
		requirecon = Instantiate(clone_requirecon);		
		requirecon.Init();		

		sc_l_saleComp.Init();

		con_tc1.SetVisible(false);
		con_title1.SetVisible(false);
		
		con_btn_destroy.txt = Datas.getArString("Common.Salvage_Button");
		con_btn_desconstruct.txt = Datas.getArString("Common.Demolish_Button");
		
//		sc_l_price.rect.x = 289;
		sc_l_price.mystyle.clipping = TextClipping.Overflow;

		l_star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star1.SetVisible(false);
		l_star2.SetVisible(false);
		l_star3.SetVisible(false);
		
		sc_l_price.SetFont(FontSize.Font_18,FontType.TREBUC);
		sc_l_price.SetNormalTxtColor(FontColor.Button_White);
		sc_l_time.SetFont(FontSize.Font_18,FontType.TREBUC);
		sc_l_time.SetNormalTxtColor(FontColor.Button_White);

		isWaitingBuild = false;
	}
	//
	public function UpdateData(param:Object):void
	{
		UpdateData(param, true);
	}
	public function UpdateData(param:Object,requireAutoSize:boolean)
	{
		this.buildingInfo = param as Building.BuildingInfo;//	as BuildingInfo;
		showRequire(requireAutoSize);

		req_ok = this.requirecon.req_ok;
		showContent();
		
		// setConfirmDialogLayout();
		btnHelp.visible = HasHelp();
	}
	
	
	private function HasHelp():boolean
	{
		if(buildingInfo.typeId == Constant.Building.WORKSHOP||buildingInfo.typeId == Constant.Building.STABLE||buildingInfo.typeId ==  Constant.Building.BLACKSMITH)
		{
			return false;
		}
		return true;
	}
	
	public function Update()
	{
		requirecon.Update();
		if(sc_l_saleComp && sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.Update();
	}
	

	protected function PushCustomDialog(content:String, title:String, okFun:System.Action.<Object>, cancelFun:System.Action.<Object>):ConfirmDialog
	{
		var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		
		confirmDialog.setLayout(600,320);		
		confirmDialog.setContentRect(70,75,0,140);
		confirmDialog.setDefaultButtonText(); 
		
		MenuMgr.getInstance().PushConfirmDialog(content, title, okFun, cancelFun); 
		return confirmDialog;
	}
	
	// protected function setConfirmDialogLayout():void
	// {
	// 	confirmDialog.setLayout(600,320);		
	// 	confirmDialog.setContentRect(70,75,0,140);
	// 	confirmDialog.setDefaultButtonText();
	// }
	
	protected function showContent():void
	{
		//params ..
		if(!buildingInfo) 
			return;
		if(buildingInfo.slotId == 0)
		{
			requirecon.rect.y = 422;
		}
		else
		{
			requirecon.rect.y = 360;
		}	
		
		var label : Label;
		label = content.getChildByID("l_description") as Label;
		label.txt = buildingInfo.description;
		
		label = content.getChildByID("l_content1") as Label;
		label.txt = buildingInfo.curLevel_description;
		
		label = content.getChildByID("l_content2") as Label;
		label.txt = buildingInfo.nextLevel_description;
		
		label = content.getChildByID("img_building") as Label;
		label.useTile = true;
		label.tile = TextureMgr.instance().BuildingSpt().GetTile(buildingInfo.buildingTexturePath);
		//var texture:Texture2D;
		//label.tile.name = buildingInfo.buildingTexturePath;
//		if(texture)
//		{
//			label.mystyle.normal.background = texture;
//		}

		
		// buttons .
		var btn1:Button;
		var btn2:Button;		
				
		btn1 = statuscon.getChildByID("btn_ac1") as Button;				
		btn2 = statuscon.getChildByID("btn_ac2") as Button;			
		btn2.changeToGreenNew();
		btn1.OnClick = callStausAction;
		btn2.OnClick = callStausAction;
		
		//labels.
		var l_status:Label = statuscon.getChildByID("l_status") as Label;
		l_time = statuscon.getChildByID("l_time") as Label;
		
		// status ...
		// check requirements.
		
		var hasQueue:boolean;
		var canInstant:boolean;
//		canInstant = Test_Leve10;
		canInstant = Player.getInstance().CanBuyInstantBuildOrResearch;
		
		var cityId:int = GameMain.instance().getCurCityId();
		
		hasQueue = BuildingQueueMgr.instance().first(cityId) != null ;
		
		req_ok = req_ok && !buildingInfo.isOtherUpgrade && !buildingInfo.isTopLevel;
		
		btn1.SetVisible(req_ok);
		btn2.SetVisible(req_ok);
		l_time.SetVisible(req_ok);
		sc_l_price.SetVisible(req_ok);
		sc_l_status.SetVisible(req_ok);
		
		var showBotton2BTN:boolean = true;
		
		sc_l_err.SetVisible(false);
		sc_l_bg.SetVisible(false);
		sc_l_instanttip.SetVisible(false);
		
		con_title2.SetVisible(!buildingInfo.isTopLevel);
		if(l_bg1)
			this.l_bg1.SetVisible(!buildingInfo.isTopLevel);
			
		con_title2.txt = Datas.getArString("BuildingModal.NextLevel") + " " +(buildingInfo.curLevel + 1);
		
		btn1.changeToBlueNew();
		btn1.rect.x = BTN_BUILD_X1;
		isStatus_time = false;
		sc_l_price.rect.x = btn2.rect.x;
		sc_l_saleComp.rect.x = btn2.rect.x + 2;
		sc_l_saleComp.SetVisible(false);
		l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
		var seed:HashObject = GameMain.instance().getSeed();
		var rate:float = _Global.FLOAT(seed["buyUpgradRateBuilding"].Value);
		var rateSale:HashObject = seed["upgradeRate"];
		if(buildingInfo.queueStatus != null) // in the queue(building,upgrading,destroying).
		{
			if(buildingInfo.isDestorying)
			{
				l_status.txt = Datas.getArString("ModalBuild.ST_Destorying");
			}
			else
			{
				l_status.txt = Datas.getArString("ModalBuild.ST_Upgrading");
			}
			btn1.SetVisible(true);
		
			btn1.clickParam = ACTION_CANCEL;
			btn1.txt =  Datas.getArString("Common.Cancel");
			btn2.clickParam = ACTION_SPEEDUP;
			btn2.txt = Datas.getArString("Common.Speedup");
			
//			btn1.rect.x = 0;
			
			sc_l_status.rect.x = btn1.rect.x;
			sc_l_time.rect.x = btn2.rect.x;
			
			l_status.SetVisible(true);
			l_time.SetVisible(true);
			btn1.SetVisible(true);
			btn2.SetVisible(true);
			sc_l_price.SetVisible(false);
			sc_l_saleComp.SetVisible(false);
		}		
		else
		if(buildingInfo.isTopLevel)
		{
			//sc_l_err.txt = Datas.getArString("ModalBuild.TopLv_Tip");
		}
		else
		if(requirecon.req_ok) // requirement met 
		{
			btn1.txt = Datas.getArString("ModalBuild.ManualUpgrade");

			if(hasQueue) // another is building/upgrading
			{
				sc_l_err.SetVisible(!canInstant);
				btn1.SetVisible(true);
				
				l_time.SetVisible(!canInstant);
				sc_l_status.SetVisible(canInstant);

				btn2.SetVisible(canInstant);
				sc_l_price.SetVisible(canInstant);
				
				var splicTest:int = 0;
				if(seed["directbuyType"])
					splicTest = _Global.INT32(seed["directbuyType"]);
				
				if(splicTest == 0)	
				{
					btn1.changeToGreyNew();
				}
				btn1.OnClick = openDirectBuy;
				l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");	//red
				
				if(canInstant)
				{
					btn1.rect.x = BTN_BUILD_X1;
					
					btn2.clickParam = ACTION_INSTANTBUILD;	
					btn2.txt = Datas.getArString("ModalBuild.InstantBuild");
				
					sc_l_status.rect.x = btn1.rect.x;
					isStatus_time = true;
					if(buildingInfo.otherQueueStatus != null)
						sc_l_status.txt = Datas.getArString("ModalBuild.AvaiableTime") + _Global.timeFormatStrPlus((buildingInfo.otherQueueStatus as BuildingQueueMgr.QueueElement).timeRemaining); 
					

					var tmpTimeceil:int = _Global.INT32(Building.instance().getInstantBuildGem(buildingInfo.typeId,buildingInfo.curLevel + 1) *_Global.INT32(rate*10000) + 9999)/10000;
					var initialPrice:int = _Global.INT32(Building.instance().getInstantBuildGem(buildingInfo.typeId,buildingInfo.curLevel + 1));
					
					if(rateSale != null && rateSale["building"] && rateSale["building"]["isShow"] && _Global.INT32(rateSale["building"]["isShow"]) == 1)
					{
						sc_l_saleComp.setData(initialPrice,tmpTimeceil, _Global.INT64(rateSale["building"]["startTime"]), _Global.INT64(rateSale["building"]["endTime"]), 1, false);
						sc_l_price.SetVisible(false);
						sc_l_saleComp.SetVisible(canInstant);
					}
					else
					{
						sc_l_price.SetVisible(canInstant);
						sc_l_saleComp.SetVisible(false);
						sc_l_price.txt = "" + tmpTimeceil;						
					}
				}
				else
				{
					btn1.rect.x = BTN_BUILD_X2;
					l_time.rect.x = BTN_BUILD_X2;
					l_time.txt = _Global.timeFormatStrPlus( buildingInfo.buildtime );
					
					sc_l_err.txt =  Datas.getArString("ModalBuild.BuildOneAtTime") ;
				}
			}
			else	// normal ...
			{
				sc_l_err.SetVisible(false);
				sc_l_instanttip.SetVisible(false);
				
				btn2.SetVisible(false);
				btn2.clickParam = ACTION_INSTANTBUILD;	
				btn2.txt = Datas.getArString("ModalBuild.InstantBuild");
				
				btn1.rect.x = BTN_BUILD_X1;
				btn1.clickParam = ACTION_UPGRADE;
			
				l_time.txt= Datas.getArString("ModalBuild.BuildTime") + _Global.timeFormatStrPlus( buildingInfo.buildtime );
				sc_l_time.rect.x = btn1.rect.x - 4;
				sc_l_status.txt = "";
				
				if(canInstant)
				{
					btn2.SetVisible(true);
				}
				
				var tmpTimeceil1:int = _Global.INT32(Building.instance().getInstantBuildGem(buildingInfo.typeId,buildingInfo.curLevel + 1)*_Global.INT32(rate*10000) + 9999)/10000;
				var initialPrice1:int = _Global.INT32(Building.instance().getInstantBuildGem(buildingInfo.typeId,buildingInfo.curLevel + 1));
				
				if(rateSale != null && rateSale["building"] && rateSale["building"]["isShow"] && _Global.INT32(rateSale["building"]["isShow"]) == 1)
				{
					sc_l_saleComp.setData(initialPrice1,tmpTimeceil1, _Global.INT64(rateSale["building"]["startTime"]), _Global.INT64(rateSale["building"]["endTime"]), 1, false);
					sc_l_price.SetVisible(false);
					sc_l_saleComp.SetVisible(canInstant);
				}
				else
				{
					sc_l_price.SetVisible(canInstant);
					sc_l_saleComp.SetVisible(false);
					sc_l_price.txt = "" + tmpTimeceil1;						
				}
		
			}
		}
		else	//requirement not met
		{
			if(Utility.instance().checkInstantRequire(buildingInfo.requirements) && canInstant)
			{
				btn2.SetVisible(true);
				btn2.clickParam = ACTION_INSTANTBUILD;	
				btn2.txt = Datas.getArString("ModalBuild.InstantUpgrade");
				
				btn1.SetVisible(false);
				btn1.changeToGreyNew();
				btn1.OnClick = null;
				
				sc_l_price.SetVisible(true);
				var timePrice:int = Building.instance().getInstantBuildGem(buildingInfo.typeId,buildingInfo.curLevel + 1);
				var RsPrice:float = Utility.instance().calResouceToGems("b",buildingInfo.requirements,buildingInfo.curLevel,buildingInfo.typeId);
				
				var totalCost:int = _Global.INT32(timePrice*_Global.INT32(rate*10000) + 9999)/10000+ Mathf.Ceil(RsPrice*_Global.FLOAT(seed["buyUpgradRateBuilding"].Value));
				
				if(rateSale != null && rateSale["building"] && rateSale["building"]["isShow"] && _Global.INT32(rateSale["building"]["isShow"]) == 1)
				{
					sc_l_saleComp.setData(timePrice + Mathf.Ceil(RsPrice),totalCost, _Global.INT64(rateSale["building"]["startTime"]), _Global.INT64(rateSale["building"]["endTime"]), 1, false);
					sc_l_saleComp.SetVisible(canInstant);
					sc_l_price.SetVisible(false);
				}
				else
				{
					sc_l_price.SetVisible(canInstant);
					sc_l_saleComp.SetVisible(false);
					sc_l_price.txt = "" + totalCost;						
				}
				sc_l_instanttip.SetVisible(true);
				sc_l_instanttip.txt = Datas.getArString("ModalBuild.InstantDesc") ;
			}
			else
			{
				btn1.rect.x = l_time.rect.x = BTN_BUILD_X2;
				btn1.txt = Datas.getArString("ModalBuild.ManualUpgrade");
				
				sc_l_price.SetVisible(false);
				sc_l_saleComp.SetVisible(false);
				btn2.SetVisible(false);
				/////
				sc_l_err.SetVisible(true);
				sc_l_err.txt =  Datas.getArString("ModalBuild.ReqNotMet") ;
				
				l_time.SetVisible(true);
				l_time.txt= /*Datas.getArString("ModalBuild.BuildTime") + */ _Global.timeFormatStrPlus( buildingInfo.buildtime );
				l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");	//red
				
				btn1.SetVisible(true);
				btn1.changeToGreyNew();
				btn1.OnClick = null;
			}									
		}
		
		//////////////
		showBotton2BTN = buildingInfo.canbeDestoryed && !buildingInfo.isOtherUpgrade && !buildingInfo.queueStatus ;
		
		btn1 = content.getChildByID("btn_destroy") as Button;			
		btn1.OnClick = callDestory;
		btn1.SetVisible(showBotton2BTN);
		
		
		btn1 = content.getChildByID("btn_deconstruct") as Button;			
		btn1.OnClick = callDesconstruct;		
		btn1.SetVisible(showBotton2BTN && buildingInfo.curLevel > 1 );
		
		if(sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.cutTimeLeftLabel();
		
		if(buildingInfo.isTopLevel)
		{
			con_btn_destroy.rect.y = con_btn_desconstruct.rect.y = 250; 
			sc_l_bg.SetVisible(false);
			sc_l_err.SetVisible(false);
			sc_l_instanttip.SetVisible(false);			
		}
		else
		{
			con_btn_destroy.rect.y = con_btn_desconstruct.rect.y = requirecon.rect.y + requirecon.rect.height + 20;
		}
		
		btnHelp.OnClick = OpenInGameHelp;
	
		if(!hasQueue && isWaitingBuild)
		{
			callStausAction(ACTION_UPGRADE);
			isWaitingBuild = false;
		}
		
		//prestige
		SetPrestigeRelativeComponent();
		
		if(buildingInfo.queueStatus == null)//not in destroying, building, upgrading status
		{
			CheckPrestigeOnOff();
			CheckCitySwitch();
		}
	}
    
    public function OpenInGameHelp()
    {
        var setting:InGameHelpSetting = new InGameHelpSetting();
        setting.type = "building";
        setting.key = buildingInfo.typeId + "";
        setting.name = buildingInfo.buildName;
        
        MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
    }
		
	public function setWaitingFlagTrue():void
	{
		isWaitingBuild = true;
	}
	// init require...	
	protected function showRequire()
	{	
		showRequire(false);
	}
	protected function showRequire(autoSize:boolean)
	{
		if(buildingInfo)
		{
			requirecon.SetVisible(!buildingInfo.isTopLevel);
			requirecon.showRequire(buildingInfo.requirements.ToArray(),autoSize);	
		}
	}
	
	private function openDirectBuy():void
	{
		var element:QueueItem = BuildingQueueMgr.instance().first(GameMain.instance().getCurCityId());
		var gems:int = SpeedUp.instance().getTotalGemCost(element.timeRemaining);
		
		Utility.instance().instantFinishPreQueue(element, gems, SpeedUp.PLAYER_ACTION_CONSTRUCT);
	}
	
	/// call servers.
	function callDestory(param:Object):void
	{
		checkBuilding(1,realDestory);
		
	}
	protected function realDestory()
	{	 
		PushCustomDialog(Datas.getArString("ModalBuild.Confirm_Destory"),"",confirm_Destory,null);
		
		// setConfirmDialogLayout();
		// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("ModalBuild.Confirm_Destory"),"",confirm_Destory,null);
	}
	protected function confirm_Destory():void
	{
		Building.instance().deleteAction(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId);
		toMainChrome();
	}
	function callDesconstruct(param:Object):void // immediately.
	{		
		if(MyItems.instance().countForItem(9) == 0)
		{
			// TODO..popup dialog.
			//var cd:ConfirmDialog = MenuMgr.getInstance().confirmDialog;	
			//var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
			ErrorMgr.instance().PushError("",Datas.getArString("ModalBuildDemolish.DestroyDesc"),true, Datas.getArString("Common.Buy"),call_getmore );
			
			MenuMgr.getInstance().PopMenu("");
		}
		else
		{		
			checkBuilding(2,realDesconstruct);
		}
	}
	
	protected function realDesconstruct():void	//instant.
	{ 
		PushCustomDialog(Datas.getArString("ModalBuild.Confirm_Demolish"),"",confirm_Desconstruct,null);
		
		// setConfirmDialogLayout();
		// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("ModalBuild.Confirm_Demolish"),"",confirm_Desconstruct,null);		
	}
	protected function confirm_Desconstruct():void
	{
		Building.instance().destructAction(buildingInfo.slotId);
		toMainChrome();
	}
	
	protected function checkBuilding(type:int,callback:Function):void
	{
		var call:boolean = true;
		// is upgrading now?
		
		if(buildingInfo.queueStatus || BuildingQueueMgr.instance().first(buildingInfo.cityId) )
		{
			if(type == 2)	//demolish
				ErrorMgr.instance().PushError("",Datas.getArString("ModalBuildDemolish.CannotDetroyWithOthers") );
			else	//salvate
				ErrorMgr.instance().PushError("",Datas.getArString("DeconstructBuilding.DeconstructInvalid") );
			return;
		}
		
		switch(buildingInfo.typeId)
		{
		//can't be deleted.
			case Constant.Building.WALL:
				call = false;
				//open...
				break;
		//can't be deleted while it has some interactive with others..
			case Constant.Building.RALLY_SPOT:
				
				break;
			case Constant.Building.EMBASSY:
				//
				if(Alliance.getInstance().hasAllianceInSeed() )
				{
					call = false;
					ErrorMgr.instance().PushError("",Datas.getArString("ModalBuildDemolish.EmbassyWithAlliance") );
				}
				break;
		}
		
		if(call && callback!=null)
			callback();
	}
	
	protected function call_getmore():void
	{
		MenuMgr.getInstance().PushMenu("InventoryMenu",{"selectedTab":0,"selectedList":0});
	}
	
	function callStausAction(param:Object):void
	{
		// upgrade, instant_build, cancel,speed_up,
		var seed:HashObject = GameMain.instance().getSeed();
		switch(param)
		{
			case ACTION_CANCEL:
				// setConfirmDialogLayout();
				// confirmDialog.setButtonText(Datas.getArString("Common.Confirm"), Datas.getArString("Common.Close") );
				// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("ModalBuild.Confirm_Cancel"),"",confirm_cancel,null); 
				
				var confirmDialog:ConfirmDialog = PushCustomDialog(Datas.getArString("ModalBuild.Confirm_Cancel"),"",confirm_cancel,null); 
				confirmDialog.setButtonText(Datas.getArString("Common.Confirm"), Datas.getArString("Common.Close") );
				confirmDialog.setCurNotificationType(1);
				break;
			
			case ACTION_INSTANTBUILD:
				if(buildingInfo.slotId == 0 && buildingInfo.curLevel == 4 && _Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]) > GameMain.unixtime() )
				{ 
					PushCustomDialog(Datas.getArString("ModalBuild.CastleUpgrade"),"",function(){
									MenuMgr.getInstance().PopMenu("");
									realInstantUpgrade();
					},null);
					
					// setConfirmDialogLayout();
					// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("ModalBuild.CastleUpgrade"),"",function(){
					// 	MenuMgr.getInstance().PopMenu("");
					// 	realInstantUpgrade();
					// },null);
				}
				else
				{
					realInstantUpgrade();
				}
				
				//close = Building.instance().instantBuild(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId);
				break;
								
			case ACTION_UPGRADE:
				if(buildingInfo.slotId == 0 && buildingInfo.curLevel == 4 && _Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]) > GameMain.unixtime() ) 
				{ 
					PushCustomDialog(Datas.getArString("ModalBuild.CastleUpgrade"),"",realUpgrade,null);
					// setConfirmDialogLayout();
					// MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("ModalBuild.CastleUpgrade"),"",realUpgrade,null);
				}
				else
				{
					realUpgrade();
				}
				
//				Building.instance().upgradeAction(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId);
				break;
				
			case ACTION_SPEEDUP:
				//TODO
				//Building.instance().speedUPAction(buildingInfo.slotId);
				//POPUP a window to select an item for use.
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",BuildingQueueMgr.instance().first(GameMain.instance().getCurCityId()), "trans_zoomComp");
				break;
			case ACTION_BUILD:
				Building.instance().buildAction(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId);
				toMainChrome();
				break;
			case ACTION_PRESTIGE:
				MenuMgr.getInstance().PushMenu("PrestigeConfirmMenu",buildingInfo, "trans_zoomComp");
				break;
			
		}
	}
	
	protected function confirm_cancel():void
	{
		Building.instance().cancelAction(buildingInfo.curLevel,buildingInfo.slotId);
		toMainChrome();
	}
	
	//upgrade & instantupgrade.
	protected function realUpgrade():void
	{
		Building.instance().upgradeAction(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId);
		toMainChrome();
	}
	protected function realInstantUpgrade():void
	{
		var aditionGems:float = 0f;//Utility.instance().calResouceToGems("b",buildingInfo.requirements,buildingInfo.curLevel,buildingInfo.typeId);
		if(Utility.instance().checkInstantRequire(buildingInfo.requirements))
		{
			aditionGems = Utility.instance().calResouceToGems("b",buildingInfo.requirements,buildingInfo.curLevel,buildingInfo.typeId);
		}
		var success:boolean = Building.instance().instantBuild(buildingInfo.typeId,buildingInfo.curLevel,buildingInfo.slotId,aditionGems);
		if( success ){
			//toMainChrome();
		}
	}

	function DrawBackground()
	{
//		if(bgTexture)
//			DrawTextureClipped(bgTexture, new Rect( 0, 0, bgTexture.width, bgTexture.height), Rect( 0, content.rect.y, bgTexture.width, bgTexture.height), rotation);
		
//		DrawTextureClipped(lineTexture1, new Rect( 0, 0, lineTexture1.width, lineTexture1.height), Rect( 0, 420, lineTexture1.width, lineTexture1.height), rotation);
//		DrawTextureClipped(lineTexture2, new Rect( 0, 0, lineTexture2.width, lineTexture2.height), Rect( 0, 700, lineTexture2.width, lineTexture2.height), rotation);
	}	
	
	public	function 	toMainChrome(){
		MenuMgr.getInstance().SwitchMenu("MainChrom",null);
	}
	
	public function Clear()
	{
		requirecon.Clear();
		TryDestroy(requirecon);
		requirecon = null;
	}
	
	private function SetPrestigeRelativeComponent()
	{
		var reqPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingInfo.typeId,buildingInfo.curLevel + 1);
		var prestige:int = _Global.INT32(reqPrestigeData["prestige"]);
		var nextlevel:int = _Global.INT32(reqPrestigeData["level"]);
		var bIsPrestigeLevel:boolean = GameMain.GdsManager.GetGds.<GDS_Building>().isPrestigeLevel(buildingInfo.typeId,buildingInfo.curLevel);
		var btn1:Button = statuscon.getChildByID("btn_ac1") as Button;			
		var btn2:Button = statuscon.getChildByID("btn_ac2") as Button;
		
		
		if(bIsPrestigeLevel)//is prestigelevel 
		{
			var label:Label = content.getChildByID("l_content2") as Label;
			var str:String = Datas.getArString("Prestige.BuildingModalDesc");
			str = str.Replace("{0}",buildingInfo.buildName);
			label.txt = str;
			
			sc_l_price.SetVisible(false);
			sc_l_saleComp.SetVisible(false);
			sc_l_instanttip.SetVisible(false);
			con_title2.SetVisible(false);
			l_NextLevel.SetVisible(false);
			l_star1.SetVisible(false);
			l_star2.SetVisible(false);
			l_star3.SetVisible(false);
			l_Prestige.SetVisible(true);
			
			if(buildingInfo.queueStatus == null)//not in destroying, building or upgrading status
			{
				btn1.OnClick = callStausAction;
				btn1.clickParam = ACTION_PRESTIGE;
				btn1.rect.x = BTN_BUILD_X2;
				btn1.SetVisible(true);
				btn2.SetVisible(false);
				btn1.txt = Datas.getArString("Common.PrestigeBtn");
				sc_l_time.rect.x = btn1.rect.x;
				sc_l_time.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
				if(buildingInfo.isOtherUpgrade && buildingInfo.buildtime > 0)//prestige time > 0 && another building is building or upgrading now
				{
					sc_l_time.SetVisible(false);
					sc_l_status.SetVisible(true);
					sc_l_status.rect.x = btn1.rect.x;
					btn1.changeToGreyNew();
				}
				else
				{
					sc_l_time.SetVisible(true);
					sc_l_status.SetVisible(false);
					if(requirecon.req_ok)
					{
						btn1.changeToBlueNew();
					}
					else 
					{
						btn1.changeToGreyNew();
					}
				}
			}
			else
			{
				btn1.changeToBlueNew();
				btn2.changeToGreenNew();
			}
		}
		else
		{
			l_Prestige.SetVisible(false);
			con_title2.SetVisible(!buildingInfo.isTopLevel);
			l_NextLevel.SetVisible(!buildingInfo.isTopLevel);
			
			if(!buildingInfo.isTopLevel)
			{
				l_star1.SetVisible(prestige>=1);
				l_star2.SetVisible(prestige>=2);
				l_star3.SetVisible(prestige>=3);
				if(prestige >= 1)
				{
					l_NextLevel.rect.x = NEXTLEVEL_X + (STAR_WIDTH + (prestige-1)*STAR_OFFSET + 5)/2 -5;
					var txtWidth:int = l_NextLevel.GetWidth();
					var txtX:int = l_NextLevel.rect.x + l_NextLevel.rect.width/2 - txtWidth/2;
					l_star1.rect.x = txtX - l_star1.rect.width - 5;
					l_star2.rect.x = l_star1.rect.x - STAR_OFFSET;
					l_star3.rect.x = l_star2.rect.x - STAR_OFFSET;
				}
				else
				{
					l_NextLevel.rect.x = NEXTLEVEL_X;
				}
			}
			else
			{
				l_star1.SetVisible(false);
				l_star2.SetVisible(false);
				l_star3.SetVisible(false);
			}
			
		}
		
		if(l_bg1)
			this.l_bg1.SetVisible(!buildingInfo.isTopLevel);
		
		l_Prestige.txt = Datas.getArString("Common.Prestige");
		con_title2.txt = Datas.getArString("BuildingModal.NextLevel");
		l_NextLevel.txt = nextlevel.ToString();
	}
	
	public function CheckPrestigeOnOff():void
	{
		var btn1:Button = statuscon.getChildByID("btn_ac1") as Button;			
		var btn2:Button = statuscon.getChildByID("btn_ac2") as Button;
		if( GameMain.instance().getPrestigeOnOff()==0 && buildingInfo.curLevel >= GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeLevel(buildingInfo.typeId,1) 
			&&GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeLevel(buildingInfo.typeId,1) != Constant.INVALID_PRESTIGELV)
		{
			btn1.changeToGreyNew();
			btn2.changeToGreyNew();
			var label:Label = content.getChildByID("l_content2") as Label;
			label.txt = Datas.getArString("Prestige.ComingSoon");
		}
	}
	
	public function CheckCitySwitch():void
	{
		var btn1:Button = statuscon.getChildByID("btn_ac1") as Button;			
		var btn2:Button = statuscon.getChildByID("btn_ac2") as Button;
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		if(! Building.instance().CanBuildInThisCity(buildingInfo.typeId,buildingInfo.curLevel+1,curCityOrder))
		{
			btn1.changeToGreyNew();
			btn2.changeToGreyNew();
		}
	}
}
