public class TechnologyContent extends UIObject
{

	public static var ACTION_RESEARCH:String = "research";
	public static var ACTION_CANCEL:String = "cancel";
	public static var ACTION_SPEEDUP:String = "speed_up";
	public static var ACTION_INSTANT:String = "Instant";
	public static var ACTION_RESEARCH_PREVIOUS:String = "previous_research";
	
	public var btn_back  :Button;
	public var l_title : Label;
	public var l_icon : Label;
	public var l_description : Label;
	
	public var status_con1	:ComposedUIObj;
	public var btn_research :Button;
	public var l_cm_time  	:Label;
	
	public var status_con2	:ComposedUIObj;
	public var btn_cancel 	:Button;
	public var btn_speedup	:Button;
	public var btn_instantResearch	:Button;
	public var l_up_status	:Label;
	public var l_up_time	:Label;
	public var l_price		:Label;
	public var sc_l_saleComp:SaleComponent;
	
	public var status_con3	:ComposedUIObj;
	public var l_notmet		:Label;
	public var l_bg			:Label;
	
	public var status_con4	:ComposedUIObj;
	public var l_instanttip :Label;
	
	public var clone_requirecon:RequireContent;
	protected var requirecon:RequireContent;
	
	public var cur_statuc_con : ComposedUIObj;
	
	public var f_click_callBack:Function;
	
	protected var requirements:Array;
	protected var tvo:TechVO;
	protected var req_ok:boolean;
	private	  var isWaitingTech:boolean = false;
	
//	public function Awake()
//	{
//		super.Awake();
//		Init();
//	}
	
	public	function Init()
	{
		requirecon = Instantiate(clone_requirecon);
		requirecon.rect.y = 255;
		
		sc_l_saleComp.Init();
		
		btn_research.clickParam = ACTION_RESEARCH;
		btn_speedup.clickParam = ACTION_SPEEDUP;
		btn_cancel.clickParam = ACTION_CANCEL;		
		btn_instantResearch.clickParam = ACTION_INSTANT;
		
		btn_research.OnClick = this.buttonHandler;
		btn_cancel.OnClick = this.buttonHandler;
		btn_speedup.OnClick = this.buttonHandler;
		btn_instantResearch.OnClick = this.buttonHandler;
		
		btn_cancel.txt = Datas.getArString("Common.Cancel");
		btn_speedup.txt = Datas.getArString("Common.Speedup");
		btn_research.txt = Datas.getArString("Common.Research");
		btn_instantResearch.txt = Datas.getArString("OpenAcademy.InstantResearch");
		requirecon.Init();
		
		l_up_status.SetVisible(false);
		btn_cancel.SetVisible(false);
		
		l_icon.useTile = true;
		isWaitingTech = false;
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btn_back.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btn_back.rect.width = 85;
		}
		else
		{
			btn_back.rect.width = 75;
		}
		btn_back.rect.height = 64;
	}
	
	public function Update()
	{
		requirecon.Update();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		btn_back.Draw();
		l_title.Draw();
		l_icon.Draw();
		l_description.Draw();
				
		if(tvo && tvo.queueStatus)
		{
			l_up_time.txt = Datas.getArString("Common.TimeRemining") +  _Global.timeFormatStr(tvo.queueStatus.timeRemaining);
		}	
		else
		{
			var curCitySearchItem:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,GameMain.instance().getCurCityId());
			if(curCitySearchItem != null)
				l_cm_time.txt = Datas.getArString("ModalBuild.AvailableTime") + _Global.timeFormatStrPlus(curCitySearchItem.timeRemaining );
		}
		
		if(cur_statuc_con)
			cur_statuc_con.Draw();
		requirecon.Draw();
		
		GUI.EndGroup();
	}
	
	public function setWaitingFlagTrue():void
	{
		isWaitingTech = true;
	}
	
	public function updateData(param:Object)
	{
		btn_back.OnClick = onClick;
		if(param)
			tvo = param as TechVO;
		if(!tvo)
			return;	//no enter & inited.
		//
		this.requirements = Research.instance().getTechnologyRequirements(tvo);		
		this.requirecon.showRequire(requirements.ToBuiltin(typeof(Requirement)));
		
		tvo.need_time = Research.getResearchAloneTime(tvo.tid,tvo.level);
		var seed:HashObject = GameMain.instance().getSeed();
		
		l_description.txt = tvo.description;
		l_title.txt = tvo.name + " (" + Datas.getArString("Common.Lv") + tvo.level + ")";
		l_cm_time.txt = Datas.getArString("Common.Time") + ":" +  _Global.timeFormatStr(tvo.need_time);
		
	//	l_icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(tvo.texturePath, TextureType.ICON_RESEARCH);//Resources.Load(tvo.texturePath);
		
		l_icon.tile = TextureMgr.instance().ResearchSpt().GetTile(tvo.texturePath);
		//l_icon.tile.name  = tvo.texturePath;
		//check..
		req_ok = requirecon.req_ok;
		
		var rate:float = _Global.FLOAT(seed["buyUpgradeRateTech"].Value);
		var rateSale:HashObject = seed["upgradeRate"];
		
		var tmpTimeceil:int = _Global.INT32(Research.instance().getInstantResearchGold(tvo.tid,tvo.level) *_Global.INT32(rate*10000) + 9999)/10000;
		var initialPrice:int = _Global.INT32(Research.instance().getInstantResearchGold(tvo.tid,tvo.level));
		l_price.txt = "" + tmpTimeceil;
		
		btn_instantResearch.txt = Datas.getArString("OpenAcademy.InstantResearch");
		
		if(tvo.name == Datas.getArString("techName.t6"))
		{
			requirecon.SetVisible(tvo.level < 11);
		}
		else
			requirecon.SetVisible(tvo.level < 10);
		

		var curCid:int = GameMain.instance().getCurCityId();
		var curCitySearchItem:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,curCid);
		var isCurTechResearchAtOtherCity:boolean = Research.instance().otherCityIsResearching(tvo.tid);
		
		tvo.queueStatus = null;
		
		if(isCurTechResearchAtOtherCity)	//current tech research in other city
		{
			cur_statuc_con = this.status_con3;
			setStatusConData(5);
		
		}
		else
		if(curCitySearchItem != null && curCitySearchItem.id == tvo.tid)
		{
//			if(curCitySearchItem.id == tvo.tid)	//current tech research in current city
//			{
//				cur_statuc_con = this.status_con1;
//				tvo.queueStatus = curCitySearchItem;
//			 	setStatusConData(2);
//			}
//			else	//other tech research in current city
//			{
				cur_statuc_con = this.status_con2;
			 	setStatusConData(2);
			 	tvo.queueStatus = curCitySearchItem;
//			}
		}
		/**
		if(tvo.isOtherUpgrading)
		{
			if(tvo.queueStatus) // upgrading..
			{
				cur_statuc_con = this.status_con2;
			 	setStatusConData(2);
			 }
			 else	 // other is upgrading..
			 {			 	
			 	cur_statuc_con = this.status_con3;
			 	setStatusConData(4);
			 }
		}***/
		else	//
		{
			if(req_ok) // you can upgrade it.
			{
				var splicTest:int = 0;
				btn_research.SetVisible(true);
				btn_research.changeToBlueNew();
				
				if(curCitySearchItem != null)
				{
					if(seed["directbuyType"] != null )
					splicTest = _Global.INT32(seed["directbuyType"]);
				
					if(splicTest == 0)	
					{
						btn_research.changeToGreyNew();
					}
				
					btn_research.clickParam = ACTION_RESEARCH_PREVIOUS;
					l_cm_time.mystyle.normal.textColor = _Global.ARGB("0xFFFB3C48");
				}
				else
				{
					btn_research.clickParam = ACTION_RESEARCH;
					l_cm_time.mystyle.normal.textColor = _Global.ARGB("0xFFFFFFFF");
				}
				cur_statuc_con = this.status_con1;
				btn_research.rect.x = 115;
				
				if(Player.getInstance().CanBuyInstantBuildOrResearch && curCitySearchItem == null)
				{
//					btn_research.rect.x = 100;
					btn_instantResearch.SetVisible(true);
					btn_instantResearch.changeToGreenNew();
					resetSaleComponent(rateSale, initialPrice, tmpTimeceil);
				}
				else
				{
//					btn_research.rect.x = btn_instantResearch.rect.x;
					btn_instantResearch.SetVisible(false);
					l_price.SetVisible(false);
					sc_l_saleComp.SetVisible(false);
				}
				
				l_cm_time.rect.x = btn_research.rect.x + 4;
				l_price.rect.x = btn_instantResearch.rect.x;
				sc_l_saleComp.rect.x = btn_instantResearch.rect.x + 2;
				if(tvo.name != Datas.getArString("techName.t6")&&tvo.level==10)
				{
					btn_instantResearch.SetVisible(false);
					l_price.SetVisible(false);
					sc_l_saleComp.SetVisible(false);
					cur_statuc_con = this.status_con3;
					setStatusConData(3);
				}
				else
				{
					setStatusConData(1);
				}
			}
			else	//not met ..
			{
				if(Utility.instance().checkInstantRequire(this.requirements.ToBuiltin(typeof(Requirement))) && Player.getInstance().CanBuyInstantBuildOrResearch && curCitySearchItem == null)
				{
					//cur_statuc_con = this.status_con1;
					btn_research.rect.x = 115;
					btn_instantResearch.txt = Datas.getArString("ModalBuild.InstantUpgrade");
					btn_instantResearch.SetVisible(true);
					btn_instantResearch.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
					btn_instantResearch.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
					
					var timePrice:int = Research.instance().getInstantResearchGold(tvo.tid,tvo.level);
					var RsPrice:float = Utility.instance().calResouceToGems("t",this.requirements.ToBuiltin(typeof(Requirement)),tvo.level,tvo.tid);
					
					var totalCost:int = _Global.INT32(timePrice*_Global.INT32(rate*10000) + 9999)/10000+ Mathf.Ceil(RsPrice*rate);
				
					resetSaleComponent(rateSale,timePrice + Mathf.Ceil(RsPrice), totalCost);
					
					l_cm_time.rect.x = btn_research.rect.x + 4;
					l_price.rect.x = btn_instantResearch.rect.x;
					sc_l_saleComp.rect.x = btn_instantResearch.rect.x + 2;
					
					if(tvo.name != Datas.getArString("techName.t6")&&tvo.level==10)
					{
						btn_instantResearch.SetVisible(false);
						l_price.SetVisible(false);
						sc_l_saleComp.SetVisible(false);
						cur_statuc_con = this.status_con3;
						setStatusConData(3);
					}
					else
					{
						l_instanttip.txt = Datas.getArString("ModalBuild.InstantDesc") ;
						cur_statuc_con = this.status_con4;
					}
				}
				else
				{
//					var ownDummy = MyItems.instance().countForItem(4123);
//					if(tvo.name == Datas.getArString("techName.t6") && ownDummy<100)
//					{
//						btn_research.SetVisible(false);
//						btn_instantResearch.txt = Datas.getArString("ModalBuild.InstantUpgrade");
//						btn_instantResearch.SetVisible(true);
//						btn_instantResearch.changeToGrey();
//						btn_instantResearch.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normal",TextureType.BUTTON);
//						btn_instantResearch.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normal",TextureType.BUTTON);
//						l_price.SetVisible(false);
//						l_instanttip.txt = Datas.getArString("ModalBuild.InstantDesc2") ;
//						cur_statuc_con = this.status_con4;
//					}
//					else
//					{
						btn_instantResearch.SetVisible(false);
						l_price.SetVisible(false);
						sc_l_saleComp.SetVisible(false);
						cur_statuc_con = this.status_con3;
						setStatusConData(3);
//					}
				}
			}
		}
		
		if(sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.cutTimeLeftLabel();
		if(curCitySearchItem == null && isWaitingTech)
		{
			Research.instance().upgrade(tvo.tid,tvo.level + 1);
			isWaitingTech = false;
		}
	}
	
	function FixedUpdate()
	{
		if(sc_l_saleComp.gethasCutSale())
			sc_l_saleComp.Update();
	}
	
	private function resetSaleComponent(rateSale:HashObject, initialPrice:int, tmpTimeceil:int):void
	{
		var canInstant:boolean = Player.getInstance().CanBuyInstantBuildOrResearch;
		if(rateSale != null && rateSale["research"] && rateSale["research"]["isShow"] && _Global.INT32(rateSale["research"]["isShow"]) == 1)
		{
			sc_l_saleComp.setData(initialPrice,tmpTimeceil, _Global.INT64(rateSale["research"]["startTime"]), _Global.INT64(rateSale["research"]["endTime"]), 1, false);
			l_price.SetVisible(false);
			sc_l_saleComp.SetVisible(canInstant);
		}
		else
		{
			l_price.SetVisible(canInstant);
			sc_l_saleComp.SetVisible(false);
			l_price.txt = "" + tmpTimeceil;						
		}
	}
	protected function setStatusConData(conIndex:int)
	{
		switch(conIndex)
		{
			case 1:
				//this.l_cm_time.txt  = "";
				
				break;				
			case 2:
				this.l_up_status.txt = Datas.getArString("OpenAcademy.CurrentlyResearching");
//				this.l_up_time.txt = "";
				
				break;				
			case 3:
				if(tvo && tvo.level == 10 && tvo.name != Datas.getArString("techName.t6"))
					this.l_notmet.txt = Datas.getArString("BuildingModal.TopLevel");
				else if(tvo && tvo.level == 11 && tvo.name == Datas.getArString("techName.t6"))
					this.l_notmet.txt = Datas.getArString("BuildingModal.TopLevel");
				else
					this.l_notmet.txt = Datas.getArString("OpenAcademy.ReqNotMet");
					break;
			case 4:
				this.l_notmet.txt = Datas.getArString("OpenAcademy.ReseachAtOneTime");
				break;
			case 5:
				this.l_notmet.txt = Datas.getArString("OpenAcademy.ReseachAtOtherCity");
				break;
		}
	}
	
	protected function buttonHandler(param:Object)
	{
		switch(param)
		{
			case ACTION_RESEARCH:	//upgrade ..
				
				Research.instance().upgrade(tvo.tid,tvo.level + 1);
				break;
			case ACTION_CANCEL:
				// NO CANCEL......
				break;
			case ACTION_SPEEDUP:
				//POPUP an window to select ITEM for use .
				var curCid:int = GameMain.instance().getCurCityId();
				var curCitySearchItem:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,curCid);
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",curCitySearchItem, "trans_zoomComp");
				break;				
			case ACTION_INSTANT:
				var	aditionGems:float = Utility.instance().checkInstantRequire(this.requirements)?Utility.instance().calResouceToGems("t",this.requirements.ToBuiltin(typeof(Requirement)),tvo.level,tvo.tid):0;
				Research.instance().instantResearch(tvo.tid,tvo.level + 1,playEndSound,this.requirements,aditionGems);
				break;
				
			case ACTION_RESEARCH_PREVIOUS:
				var element:QueueItem = Research.instance().getItemAtQueue(0,GameMain.instance().getCurCityId());
				var gems:int = SpeedUp.instance().getTotalGemCost(element.timeRemaining);
				Utility.instance().instantFinishPreQueue(element, gems, SpeedUp.PLAYER_ACTION_RESEARCH);
				break;
			
			default:
				break;
		}
		
	}
	private function playEndSound():void
	{
		Invoke("playSound",1.5);
	}
	private function playSound():void
	{
		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/");
	}
	
	private function onClick(param:Object)
	{
		if(f_click_callBack != null)
			f_click_callBack();
	}
	
	public function Clear()
	{
		requirecon.Clear();
		TryDestroy(requirecon);
	}
	
	public function ClearScrollListOfRequireCon():void
	{
		requirecon.Clear();
	}
}
