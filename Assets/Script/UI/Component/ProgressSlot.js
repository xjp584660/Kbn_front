
class ProgressSlot extends ListItem
{
	public var progressBar:ProgressBar;
	public var level:int;
	public var buildingName:String;
	public var btnExtra:Button;
	public var l_star1:Label;
	public var l_star2:Label;
	public var l_star3:Label;
	public var l_buff1:SimpleLabel;
	public var l_buff2:SimpleLabel;
	public var l_buff3:SimpleLabel;
	public var l_buff4:SimpleLabel;
	@SerializeField private  var l_ratio:Label;
	
	private	var	element:QueueItem;
	private var timmer:float=2;
	private var reqCount:int=0;
	
	public	static var	carmotElement:QueueItem;
	
	private static var STAR_WIDTH:int = 25;
	private static var STAR_OFFSET:int = 14;
	
    private var timeRemaining : int = 0;
    
	public function Awake()
	{
		super.Awake();
		btnSelect.OnClick = buttonHandler;
		btnExtra.OnClick = extraButtonHandler;
	}
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
//		progressBar.SetCurValue(element.needed - element.timeRemaining);
		progressBar.SetRemainingValue(timeRemaining);
	
		progressBar.Draw();
		l_buff1.Draw();
		l_buff2.Draw();
		l_buff3.Draw();
		l_buff4.Draw();
		
		title.Draw();
//		if( element.classType != QueueType.ScoutQueue )
		btnSelect.Draw();
		
		if(btnExtra)
			btnExtra.Draw();
			
		l_ratio.Draw();
		
		l_star1.Draw();
		l_star2.Draw();
		l_star3.Draw();
		
		GUI.EndGroup();
	   	return -1;
	}
	
	public function willBeRemoved():boolean
	{
		return element == null || element.willBeRemoveFromBar;
	}
	
	public function UpdateData()
	{
		this.priv_updateTitleText();
		this.updateBuffIcons();
		btnSelect.SetVisible(element.showSpeedUp);
		btnExtra.SetVisible(element.showExtraButton);
		
		var texMgr : TextureMgr = TextureMgr.instance();//element.marchId
         timeRemaining = element.timeRemaining;
		
        if (element.classType == QueueType.MarchQueue)
        {
         var mvo:MarchVO = element as MarchVO;
          
            if (mvo.marchStatus == Constant.MarchStatus.DEFENDING || 
                mvo.marchStatus == Constant.MarchStatus.WAITING_FOR_REPORT ||
                mvo.marchStatus == Constant.MarchStatus.SITUATION_CHANGED )
            {
//            	if(mvo.marchType==Constant.MarchType.REINFORCE && mvo.marchStatus == Constant.MarchStatus.SITUATION_CHANGED)
//            	{
            		timeRemaining = element.timeRemaining;
//            	}else 
//            	timeRemaining = 0;
            }
            if((mvo.marchType==Constant.MarchType.COLLECT || mvo.marchType == Constant.MarchType.COLLECT_RESOURCE) && (mvo.marchStatus==2 || mvo.marchStatus==5) )
            {
	        	var key:String=mvo.toXCoord+"_"+mvo.toYCoord;
	        	var key1:String=mvo.marchId+"";
	        	var mflag:int=0;
	        	var begainTime:long=0;
				var endTime:long=0;

	        	if(mflag==0){
		        	 begainTime=_Global.INT64(mvo.marchUnixTime);
		        	 endTime=_Global.INT64(mvo.destinationUnixTime);
	        	}
        	
	    		var curTime:long=GameMain.unixtime();
				timeRemaining=endTime-curTime;
				if(timeRemaining<=0)
				{
					progressBar.SetMaxValue(100);
					timeRemaining=0;
					element.showTime=false;
					if(mflag<2) chenckUpdateCarmotState();
				}else{
					progressBar.SetMaxValue(endTime-begainTime);
					element.showTime=true;
				}
        	}
        }
        
		if(element.btnStr && (element.classType == QueueType.MarchQueue || (element.classType == QueueType.WildernessQueue && element.btnStr == Datas.getArString("Common.ManageButton")) ))
		{
			if(btnSelect.mystyle.normal.background.name != "button_speed_up_Brown_normal")
			{
				var texture:Texture2D = texMgr.LoadTexture("button_speed_up_Brown_normal",TextureType.BUTTON);
				btnSelect.mystyle.normal.background = texture;
				texture = texMgr.LoadTexture("button_speed_up_Brown_down",TextureType.BUTTON);
				btnSelect.mystyle.active.background = texture;
			}
			btnSelect.txt = element.btnStr;
		}
		else if(element.btnStr && element.btnStr == Datas.getArString("Common.Speedup")&& element.classType == QueueType.WildernessQueue)
		{
			if(btnSelect.mystyle.normal.background.name != "button_speed up_green_normal")
			{
				texture = texMgr.LoadTexture("button_speed up_green_normal",TextureType.DECORATION);
				btnSelect.mystyle.normal.background = texture;
				texture = texMgr.LoadTexture("button_speed up_green_down",TextureType.DECORATION);
				btnSelect.mystyle.active.background = texture;
			}		
		}
		if(element.btnStr == Datas.getArString("Newresource.march_button_operate"))
		{
			if(btnSelect.mystyle.normal.background.name != "button_speed up_green_normal")
			{
				texture = texMgr.LoadTexture("button_speed up_green_normal",TextureType.DECORATION);
				btnSelect.mystyle.normal.background = texture;
				texture = texMgr.LoadTexture("button_speed up_green_down",TextureType.DECORATION);
				btnSelect.mystyle.active.background = texture;
			}		
		}
		if(element.btnStr )
			btnSelect.txt = element.btnStr;
		
		if(element.extraBtnStr)
		{
			btnExtra.mystyle.active.background = texMgr.LoadTexture("March_down",TextureType.BUTTON);
			if(element.extraBtnStr == Datas.getArString("Common.Stop"))
			{
				if ( btnExtra.mystyle.normal.background == null || btnExtra.mystyle.normal.background.name != "March_Stop" )
					btnExtra.mystyle.normal.background = texMgr.LoadTexture("March_Stop",TextureType.BUTTON);
			}
			else
			{
				if ( btnExtra.mystyle.normal.background == null || btnExtra.mystyle.normal.background.name != "March_Survey" )
					btnExtra.mystyle.normal.background = texMgr.LoadTexture("March_Survey",TextureType.BUTTON);		
			}
		}

		if( !element.showSpeedUp)
		{
			progressBar.rect.width = rect.width;
			if(element.classType == QueueType.MarchQueue && btnExtra)
			{
				progressBar.rect.width = rect.width - btnExtra.rect.width;
			}			
		}
		else
		{
			progressBar.rect.width = btnSelect.rect.x + 2;
			if(element.classType == QueueType.MarchQueue && btnExtra)
			{
				progressBar.rect.width = btnSelect.rect.x + 2 - btnExtra.rect.width;
			}
		}
		
	}
	//限制最多一次连续请求3次
	function chenckUpdateCarmotState()
	{
		if(reqCount>3) return;
		timmer+=Time.deltaTime;
		if(timmer>=2){
			timmer=0;
			reqCount++;
			GameMain.instance().dealyCallUpdateSeed(1);
		}
	
	}
	
	private function priv_updateTitleText()
	{
		var barracksTroop : Barracks.TrainInfo = Barracks.instance().Queue.First();
		var troopRatio : float = 0;
		if (barracksTroop != null)
			troopRatio = barracksTroop.ratio;
		var minWidth : float = 0.0f;
		var maxWidth : float = 0.0f;
		var restTime:int = element.timeRemaining;	
		var restTimeStr : String = _Global.timeFormatStr(timeRemaining);
		var appendString : String = null;
		if(element.titleStr)
		{
			if(element.showTime) 
				title.txt = element.titleStr + " " + restTimeStr;
			else if(element.titleStr == Datas.getArString("Newresource.march_gathering"))
				title.txt="";
			else
				title.txt = element.titleStr;
			/////////////
			return;
		}

		if(element.classType == QueueType.TrainningQueue || element.classType == QueueType.WallTrainingQueue)
		{
			var trainItem:Object = element;
			var quant:int;
			if(element.classType == QueueType.TrainningQueue)
				quant = (trainItem as Barracks.TrainInfo).quant;
			else
				quant = (trainItem as Walls.TrainInfo).quant;	
			if(element.classType == QueueType.TrainningQueue && troopRatio>0)
			{
				
				title.txt = element.itemName + " (" + quant ;
				title.mystyle.CalcMinMaxWidth(GUIContent(title.txt), minWidth, maxWidth);
				l_ratio.rect.x = title.rect.x + Mathf.Ceil(maxWidth);
				l_ratio.rect.y = title.rect.y;
				l_ratio.rect.height = title.rect.height;
				l_ratio.txt="x"+troopRatio.ToString();
				title.txt=priv_leaveBlank(l_ratio,")")+" "+ restTimeStr;
				l_ratio.SetVisible(true);
			}
			else
			{
				l_ratio.SetVisible(false);
				//appendString= " "+ restTimeStr;
				title.txt = element.itemName + " (" + quant +")"+" "+ restTimeStr;
			}
			//title.txt += appendString;
		}
		else if ( element.classType == QueueType.HealQueue )
		{
			var healItem: HealQueue.HealQueueItem = element as HealQueue.HealQueueItem;
			var totalCnt : int = healItem.TotalHeal;
			title.txt = String.Format("{0} ({1}) {2}", healItem.itemName, totalCnt.ToString(), restTimeStr);
		}
		else if(level > 0)
			title.txt = buildingName  + " (" + Datas.getArString("Common.Lv") + level + ") " + restTimeStr;
		else	//deconstruct Building.
			title.txt = buildingName  + " " + restTimeStr;
			
		if(element.classType == QueueType.BuildingQueue)
		{
			var buildingTypeId:int = element.itemType;
			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,level);
			var prestige:int = prestigeData["prestige"].Value;
			var tranLv:int = prestigeData["level"].Value;

			if(prestige >= 1)
			{
				title.txt = buildingName  + " (" + Datas.getArString("Common.Lv") + tranLv + ") " + restTimeStr;
				title.rect.x = (STAR_WIDTH + (prestige-1)*STAR_OFFSET + 5);
				l_star1.rect.x = title.rect.x - l_star1.rect.width - 5;
				l_star2.rect.x = l_star1.rect.x - STAR_OFFSET;
				l_star3.rect.x = l_star2.rect.x - STAR_OFFSET;
			}
			else
			{
				title.rect.x = 5;
			}

			l_star1.SetVisible(prestige>=1);
			l_star2.SetVisible(prestige>=2);
			l_star3.SetVisible(prestige>=3);
			
		}
	}
	
	function updateBuffIcons()
	{
		var marchVO : MarchVO = element as MarchVO;
		if (element.classType == QueueType.MarchQueue && marchVO != null)
		{
			if (marchVO.marchStatus == Constant.MarchStatus.OUTBOUND && marchVO.marchType != Constant.MarchType.SURVEY && marchVO.buffs != null)
			{
				var x = progressBar.rect.xMax;
				
				l_buff1.SetVisible(marchVO.buffs.Count > 0);
				l_buff2.SetVisible(marchVO.buffs.Count > 1);
				l_buff3.SetVisible(marchVO.buffs.Count > 2);
				l_buff4.SetVisible(marchVO.buffs.Count > 3);
				
				l_buff1.rect.x = x - marchVO.buffs.Count * l_buff1.rect.width;
				l_buff2.rect.x = x - (marchVO.buffs.Count - 1) * l_buff1.rect.width;
				l_buff3.rect.x = x - (marchVO.buffs.Count - 2) * l_buff1.rect.width;
				l_buff4.rect.x = x - (marchVO.buffs.Count - 3) * l_buff1.rect.width;
				
				if (marchVO.buffs.Count > 0) l_buff1.tile = MarchBuffItem.GetBuffTileByItemId(marchVO.buffs[0]);
				if (marchVO.buffs.Count > 1) l_buff2.tile = MarchBuffItem.GetBuffTileByItemId(marchVO.buffs[1]);
				if (marchVO.buffs.Count > 2) l_buff3.tile = MarchBuffItem.GetBuffTileByItemId(marchVO.buffs[2]);
				if (marchVO.buffs.Count > 3) l_buff4.tile = MarchBuffItem.GetBuffTileByItemId(marchVO.buffs[3]);
			}
			else
			{
				l_buff1.SetVisible(false);
				l_buff2.SetVisible(false);
				l_buff3.SetVisible(false);
				l_buff4.SetVisible(false);
			}
		}
	}

	function Init(updateData:QueueItem)
	{
		element = updateData;
		carmotElement = updateData;
		buildingName = updateData.itemName;
		level = updateData.level;
		btnSelect.txt = Datas.getArString("Common.Speedup");//Datas.getArString("Market.SpeedUpTitle");
		var texture:Texture2D = TextureMgr.instance().LoadTexture("button_speed up_green_normal",TextureType.DECORATION);
		btnSelect.mystyle.normal.background = texture;
		texture = TextureMgr.instance().LoadTexture("button_speed up_green_down",TextureType.DECORATION);
		btnSelect.mystyle.active.background = texture;

		//prestige
		l_star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star1.SetVisible(false);
		l_star2.SetVisible(false);
		l_star3.SetVisible(false);
		
		l_ratio.SetVisible(false);
		
		l_buff1.useTile = true;
		l_buff2.useTile = true;
		l_buff3.useTile = true;
		l_buff4.useTile = true;
		l_buff1.SetVisible(false);
		l_buff2.SetVisible(false);
		l_buff3.SetVisible(false);
		l_buff4.SetVisible(false);
		l_buff1.rect = new Rect(0, 0, rect.height, rect.height);
		l_buff2.rect = new Rect(0, 0, rect.height, rect.height);
		l_buff3.rect = new Rect(0, 0, rect.height, rect.height);
		l_buff4.rect = new Rect(0, 0, rect.height, rect.height);
	
			
		var min:long = updateData.startTime;
		var max:long = updateData.endTime;

		//btnExtra.txt = "Survey";

		this.priv_updateTitleText();
		this.updateBuffIcons();

		if(updateData.btnStr)
			btnSelect.txt = updateData.btnStr;

		if(updateData.extraBtnStr)
		{ 
			btnExtra.mystyle.active.background = TextureMgr.instance().LoadTexture("March_down",TextureType.BUTTON);
			if(updateData.extraBtnStr == Datas.getArString("Common.Stop"))
				btnExtra.mystyle.normal.background = TextureMgr.instance().LoadTexture("March_Stop",TextureType.BUTTON);
			else
				btnExtra.mystyle.normal.background = TextureMgr.instance().LoadTexture("March_Survey",TextureType.BUTTON);
		}
		
				
		if ( _Global.IsLargeResolution() )
		{
			btnExtra.rect.width = 68;
			if(element.classType == QueueType.MarchQueue || element.classType == QueueType.ScoutQueue)
			{
				this.rect.width = 933;
				progressBar.rect.x = btnExtra.rect.width;
				if(title)
					title.rect.x = btnExtra.rect.width + 6;
			}
			else
			{
				progressBar.rect.x = 0;
				if(title)
					title.rect.x = 6;
				this.rect.width = 865;
			}
			
			title.SetFont(FontSize.Font_32);
			title.rect.width = 510;
			btnSelect.SetFont(FontSize.Font_32);
			btnSelect.rect.width=170;
			btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		}
		else
		{
			btnExtra.rect.width = 57;
			if(element.classType == QueueType.MarchQueue || element.classType == QueueType.ScoutQueue)
			{
				this.rect.width = 545;
				progressBar.rect.x = btnExtra.rect.width;
				if(title)
					title.rect.x = btnExtra.rect.width + 6;
			}
			else
			{
				progressBar.rect.x = 0;
				if(title)
					title.rect.x = 6;
				this.rect.width = 490;
			}
			title.SetFont(FontSize.Font_18);
			title.rect.width = 380;
			btnSelect.SetFont(FontSize.Font_20);
			btnSelect.rect.width=110;
			btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		}

		this.rect.height = btnExtra.rect.width;
		if(btnSelect)
			btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		progressBar.rect.width = this.rect.width - btnSelect.rect.width - progressBar.rect.x;
		progressBar.rect.height = this.rect.height;
		btnSelect.rect.height = this.rect.height;
		title.rect.height = this.rect.height;
		l_ratio.rect.y = title.rect.y;
		l_ratio.rect.height = title.rect.height;
		btnExtra.rect.height = btnExtra.rect.width;
		//l_star1.rect.height = this.rect.height;
		progressBar.Init(updateData, 0, updateData.endTime - updateData.startTime);
        timeRemaining = updateData.endTime - updateData.startTime;
	}
	
	public function changeBackground(_background:Texture2D):void
	{
		if(_background)
		{
			progressBar.thumb.mystyle.normal.background = _background;
		}
	}	

	private function GoHome(){
		var cd:ConfirmDialog = MenuMgr.instance.getConfirmDialog();
        cd.setLayout(600, 380);
        cd.setTitleY(120);
        cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));
        var okFunc:System.Action = function()
			{
				GoHomeAction();
				cd.close();
			};

		if (element.classType == QueueType.MarchQueue)
		{
			var mvo:MarchVO = element as MarchVO;
			
			if(mvo != null && mvo.marchType==Constant.MarchType.COLLECT)
			{
				MenuMgr.instance.PushConfirmDialog(Datas.getArString("CarmotMarch.ReturnConfirm"), "", okFunc, null);
			}
			else//mvo.marchType == Constant.MarchType.COLLECT_RESOURCE
			{
				MenuMgr.instance.PushConfirmDialog(Datas.getArString("ResearchCollect.CancelNotice"), "", okFunc, null);
			}
		}        
	}

	private function GoHomeAction() {
		// body...
		var mvo:MarchVO = element as MarchVO;
		RallyPoint.instance().recall(mvo.marchId, mvo.marchType, mvo.cityId, null);
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		//TODO..
//		MenuMgr.getInstance().PushMenu("SpeedUpMenu",{"type":"bdg", "targetId":element.id});
		if(element.showSpeedUp)
		{
			switch(element.btnAction)
			{
				case "RECALL":
					GoHomeAction();
					break;
				case "GOHOME":
					//////
					GoHome();
					break;
				case "OPENREWARD":
					var mvo1:MarchVO = element as MarchVO;
					March.instance().openSurveyReward(mvo1,mvo1.marchId, mvo1.marchType, mvo1.cityId, March.instance().surveyError);
					//March.instance().openSurveyRewardDone(mvo1.marchId, mvo1.cityId);
					break;
				case "JUMPTOCASAL":
					var cityId:int = GameMain.instance().getCurCityId();
			    	var buildingInfor:Building.BuildingInfo = Building.instance().buildingInfo(0 , Constant.Building.PALACE);	    	
			    	var hash:HashObject = new HashObject({"toolbarIndex":2, "infor":buildingInfor});
			    	MenuMgr.getInstance().PushMenu("NewCastleMenu", hash);    	
					break;
				case "OPERATE":
//				
//					var mvo2:MarchVO = element as MarchVO;
//					var data: AvaSpeedUp.AvaSpeedUpData = new AvaSpeedUp.AvaSpeedUpData ();
//					data.type = Constant.AvaSpeedUpType.AvaMarchSpeedUp;
//					data.id = mvo2.marchId;
//					data.endTime = mvo2.returnUnixTime;
//					data.startTime = mvo2.marchUnixTime;
//					data.origTotalTime = mvo2.destinationUnixTime;
			    	MenuMgr.getInstance().PushMenu("CollectSpeedUpMenu",element,"trans_zoomComp");   	
					break;
				default:
					MenuMgr.getInstance().PushMenu("SpeedUpMenu",element, "trans_zoomComp");	
					break;
			}
		}
	}
	
	protected function extraButtonHandler(clickParam:Object):void
	{
		if(element.showExtraButton)
		{
			var mvo:MarchVO = element as MarchVO;
			switch(element.extraBtnAction)
			{
				case "SURVEY":
					March.instance().startSurvey(mvo,mvo.marchId, mvo.marchType, mvo.cityId, March.instance().surveyError);
					break;
				case "CANCEL":
				 	var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
 					confirmDialog.setLayout(600,320);		
					confirmDialog.setContentRect(70,75,0,140);
					confirmDialog.setButtonText(Datas.getArString("Common.Confirm"),Datas.getArString("Common.Close_Button"));
					var okFunc:System.Action = function()
					{
						March.instance().cancelSurvey(mvo,mvo.marchId, mvo.marchType, mvo.cityId, null);
						confirmDialog.close();
					};

					MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("MessagesModal.CancelSurvey"),"",okFunc,null);	
					break;
				case "RALLY_CANCEL":
					UnityNet.rallyCancel(mvo.rallyId, null, null);
					break;
				default:
					break;
			}
		}
	}
	
	public function getElement():QueueItem
	{
		return element;
	}
	
	public function clearElement():QueueItem
	{
		element = null;
	}
	
	private function priv_leaveBlank(l_fill: Label,endStr:String): String 
	{
		if(endStr == null || l_fill.txt == null)
			return title.txt;
		var returnStr :String=title.txt;
		var returnWidth : float = 0.0f;
		var minWidth : float = 0.0f;
		l_fill.mystyle.CalcMinMaxWidth(GUIContent(l_fill.txt), minWidth, returnWidth);
		returnWidth += l_fill.rect.x;
		var maxWidth :float = 0.0f;
		while(maxWidth<returnWidth)
		{
			returnStr+=" ";
			title.mystyle.CalcMinMaxWidth(GUIContent(returnStr+endStr), minWidth, maxWidth);
		}
		l_fill.rect.width = maxWidth - l_fill.rect.x;
		return returnStr+endStr;
	}
}

