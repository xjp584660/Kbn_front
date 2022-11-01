class ActListItem extends ListItem
{
	public var backPic:Label;
	public var leftPic:Label;
	public var actStart:Label;
	public var actDescript:Label;
	public var actTitlePic:Label;
	public var actTitle:Label;
	public var fakeBtnImage:Label;
	private var actType:int;
	private var lastUpdateTime:int;
	public var btnDefault:SimpleButton;
	
	private var isActivityTurnedOn:boolean;
	
	public function Init()
	{
		super.Init();
		
		btnDefault.mystyle.normal.background = TextureMgr.instance().LoadTexture("a_0_square",TextureType.BACKGROUND);
		btnDefault.mystyle.active.background = TextureMgr.instance().LoadTexture("square_black_button_mask",TextureType.MAP17D3A_UI);
		actStart.txt = "";
	}
	
	public function SetRowData(data:Object)
	{
		var tmpdata:ActListData=new ActListData();
		tmpdata=(data as ActListData);
		actType = tmpdata.actType;
		backPic.setBackground("event_Background",TextureType.DECORATION);
		isActivityTurnedOn=tmpdata.isActivityTurnedOn;
		actTitlePic.setBackground("event_BackgroundBanner",TextureType.DECORATION);
		var seed:HashObject = GameMain.instance().getSeed();
		var allianceID = _Global.INT32(seed["player"]["allianceId"].Value);
		
		fakeBtnImage.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_flip_right_normal",TextureType.BUTTON);
		if(actType==0)//PVP
		{
			leftPic.setBackground("icon_pvp",TextureType.ICON);
			actStart.txt=KBN.TournamentManager.getInstance().getTournamentTimeNotice();
			actDescript.txt=Datas.getArString("Board.PVP_Info");
			actTitle.txt=Datas.getArString("PVP.Event_Title");/////////test
			btnDefault.OnClick = function()
			{
				if( allianceID == 0 ) {
					MenuMgr.instance.PushMessage( Datas.getArString( "PVP.Battle_FailToaster" ) );
				} else {
					NoticePadMenu.backButtonMotifIsHome = false;
					PvPToumamentInfoData.instance().PopUpNoticePad(0);
				}
			};		
			if(tmpdata.isActivityTurnedOn)
		    {
		    	onActivityTurnOn();
		    }
		    else
			{
				onActivityTurnOff();
			}
		}
		else if(actType==1)//PVE AllianceBoss
		{
			leftPic.setBackground("icon_pve",TextureType.ICON); 
			actStart.txt=Datas.getArString("Board.Dungeon_Countdown");
			actDescript.txt=Datas.getArString("Board.Dungeon_Info");
			actTitle.txt=Datas.getArString("Dungeon.Event_Title");/////////test
			if(!GameMain.instance().IsPveOpened()) 
	    	{
	    		ErrorMgr.instance().PushError("", Datas.getArString("Common.Campaign_ShutDownDesc"), true, "OK", null);
	    		onActivityTurnOff();
	    		return;
	    	}
	    	btnDefault.OnClick = function()
			{
				if( allianceID == 0 ) {
					MenuMgr.instance.PushMessage( Datas.getArString( "PVP.Battle_FailToaster" ) );
				} else {
			    	var seed:HashObject = GameMain.instance().getSeed();
			    	var playerLevel:int = _Global.INT32(seed["xp"]["lvl"].Value);
			    	if(playerLevel<KBN.PveController.instance().GetPveMinLevel())
			    	{
			    		ErrorMgr.instance().PushError("", Datas.getArString("Common.Campaign_UnactiveDesc"), true, "OK", null);
			    		return;
			    	}
			    	
			    	GameMain.instance().hideTileInfoPopup();
			    	MenuMgr.getInstance().SwitchMenu ("MainChrom",null);
			    	SetVisible(false);
			    	GameMain.singleton.TouchForbidden = true;
			    	GameMain.singleton.ForceTouchForbidden = true;
			    	GameMain.instance().GotoCampaignScene();
			    }
		    };
		    if(tmpdata.isActivityTurnedOn)
		    {
		    	onActivityTurnOn();
		    }
		    else
			{
				onActivityTurnOff();
			}
		}
		else if(actType == 2)
		{
			//AvA Event
			leftPic.setBackground("icon_event_ava",TextureType.ICON); 
			actStart.txt=GameMain.Ava.Event.GetLeftTimeTips();
			actDescript.txt = GameMain.Ava.Event.GetEventDesc();
			actTitle.txt=Datas.getArString("Event.AVA_AVAactivitytitle");
			
			btnDefault.OnClick = function()
			{
				MenuMgr.getInstance().PushMenu("AvAEventMenu", null);
			};
			if(tmpdata.isActivityTurnedOn)
		    {
		    	onActivityTurnOn();
		    }
		    else
			{
				onActivityTurnOff();
			}
			
		}else if (actType == 3) {
			//world boss
			leftPic.setBackground("icon_worldboss",TextureType.ICON); 
			//actStart.txt=GameMain.Ava.Event.GetLeftTimeTips();
			actDescript.txt = Datas.getArString("WorldBoss.Event_Desc");
			actTitle.txt=Datas.getArString("WorldBoss.Event_Title");
			
			btnDefault.OnClick = function()
			{
				var eventId:int=GameMain.singleton.GetCurBossEventId();
				if (eventId!=0) {
					EventCenter.getInstance().reqGetBossEventDetailInfo(eventId,ViewBossEventDetail);
				}
			};
			if(tmpdata.isActivityTurnedOn)
		    {
		    	onActivityTurnOn();
		    }
		    else
			{
				onActivityTurnOff();
			}
		}
	}

	private function ViewBossEventDetail(detail:HashObject,rankData:HashObject[]):void{
		_Global.Log("打开世界boss detail"+detail.ToString());
		// _Global.Log("打开世界boss detail"+rankData.ToString());
		_Global.OpenWorldBossEventType=0;
		MenuMgr.getInstance().PushMenu("WorldBossEventMenu", detail);
	}
	
	public function Update()
	{
		var now = GameMain.unixtime();
		if( now != lastUpdateTime )
		{
			lastUpdateTime = now;
			var latestTurningOnInSeed : boolean = KBN.TournamentManager.getInstance().isTournamentTurnedOn();
			if(actType == 0)
			{
				latestTurningOnInSeed = KBN.TournamentManager.getInstance().isTournamentTurnedOn();
			}
			else if(actType == 1)
			{
				latestTurningOnInSeed = (KBN.AllianceBossController.instance().rewardEndTime!=0);
			}
			if( isActivityTurnedOn )
			{
				if( actType == 0 ) // PVP
				{
					actStart.txt=KBN.TournamentManager.getInstance().getTournamentTimeNotice();
				}
				else if( actType == 1 )// PVE
				{
					UpdatePveTime();
				}
				// Just switched off
				if( actType != 2 && !latestTurningOnInSeed )
				{
					onActivityTurnOff();
					isActivityTurnedOn = latestTurningOnInSeed;
				}
			}
			else
			{
				// Just switched on
				if( actType != 2 && latestTurningOnInSeed )
				{
					onActivityTurnOn();
					isActivityTurnedOn = latestTurningOnInSeed;
				}
			}
			
			if(actType == 2)
			{
				//Ava
				actStart.txt = GameMain.Ava.Event.GetLeftTimeTips();
				actDescript.txt = GameMain.Ava.Event.GetEventDesc();
			}

			if (actType==3) {
				updateWorldBossEvent();
			}
			
		}
	}
	var isHaveWolrdBoss:boolean=false;
	private function updateWorldBossEvent(){
		isHaveWolrdBoss=GameMain.singleton.IsHaveBossEvent();
		if(isActivityTurnedOn)
		{	
			if (!isHaveWolrdBoss) {
				onActivityTurnOff();
			}
		}
		else
		{
			if (isHaveWolrdBoss) {
				onActivityTurnOn();
			}
		}
		
		actStart.txt =GameMain.singleton.GetWorldBossTimeTip();
		
	}

	
	private function onActivityTurnOn()
	{
		fakeBtnImage.visible = true;
		btnDefault.SetVisible( true );
	}
	
	private function onActivityTurnOff()
	{
		fakeBtnImage.visible = false;
		btnDefault.SetVisible( false );
		if(actType != 2)
		{
			//not ava
			actStart.txt="";
		}
	}
	
	private function UpdatePveTime()
	{
		var hashDate:Hashtable = KBN.AllianceBossController.instance().GetShowTime() as Hashtable;
		var timeTemp:int = _Global.INT32(hashDate["time"]);
		switch(_Global.INT32(hashDate["type"]))
		{
		case KBN.AllianceBossController.EVENT_TIME_STATE.NOT_START:
			actStart.txt = String.Format(Datas.getArString("Dungeon.Countdown1"),_Global.timeFormatShortStrEx(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.START:
			actStart.txt = String.Format(Datas.getArString("Dungeon.Countdown2"),_Global.timeFormatShortStrEx(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.OVER:
			actStart.txt = Datas.getArString("Event.End_Title");
		}
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		backPic.Draw();
		actTitlePic.Draw();
		leftPic.Draw();
		actStart.Draw();
		actDescript.Draw();
		actTitle.Draw();
		fakeBtnImage.Draw();
		btnDefault.Draw();
		GUI.EndGroup();
	}
}