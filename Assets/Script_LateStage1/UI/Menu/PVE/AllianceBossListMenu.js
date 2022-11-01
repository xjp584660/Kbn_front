class AllianceBossListMenu extends ComposedMenu
{
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	//top
	@SerializeField private var topBackImage:Label;
	@SerializeField private var backImg1 :SimpleLabel;
	@SerializeField private var backImg2 :SimpleLabel;
	@SerializeField private var topTips1 :SimpleLabel;
	@SerializeField private var topTips2 :SimpleLabel;
	@SerializeField private var topInfoBtn :Button;
	@SerializeField private var topLine :SimpleLabel;
	//middle
	@SerializeField private var allianceBossLevelList :ScrollList;
	@SerializeField private var allianceBossLevelItem:ListItem;
	@SerializeField private var middleTips :SimpleLabel;
	@SerializeField private var buffBtn :CircleButtonItem;
	@SerializeField private var rankBtn :CircleButtonItem;
	@SerializeField private var reportBtn :CircleButtonItem;
//	@SerializeField private var troopBtn :CircleButtonItem;
	@SerializeField private var rewardBtn :CircleButtonItem;
	@SerializeField private var blackImage :SimpleLabel;
	@SerializeField private var blackImage2 :SimpleLabel;
	@SerializeField private var bgTop1 :SimpleLabel;
	@SerializeField private var bgTop2 :SimpleLabel;
	@SerializeField private var bgTop3 :SimpleLabel;
	@SerializeField private var bgTop4 :SimpleLabel;
	@SerializeField private var bgBottom1 :SimpleLabel;
	@SerializeField private var bgBottom2 :SimpleLabel;
	@SerializeField private var bgBottom3 :SimpleLabel;
	@SerializeField private var bgBottom4 :SimpleLabel;
	//bottom
	@SerializeField private var itemChat :ChatItem;
	@SerializeField private var listOffSet :int = 2;
	
	public function Init()
	{
		super.Init();
		
		allianceBossLevelList.Init(allianceBossLevelItem);
		btnClose.OnClick = handleBack;
		topInfoBtn.OnClick = handleInfo;
		topInfoBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		topInfoBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		topBackImage.useTile = true;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		topBackImage.tile = TileSprite.CreateTile (img, "ui_bg_wood");
		//topBackImage.tile = TextureMgr.instance().BackgroundSpt().GetTile("ui_bg_wood");
		if(bgTop1.mystyle.normal.background == null)
		{
			bgTop1.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgTop2.mystyle.normal.background == null)
		{
			bgTop2.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgTop3.mystyle.normal.background == null)
		{
			bgTop3.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgTop4.mystyle.normal.background == null)
		{
			bgTop4.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgBottom1.mystyle.normal.background == null)
		{
			bgBottom1.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgBottom2.mystyle.normal.background == null)
		{
			bgBottom2.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgBottom3.mystyle.normal.background == null)
		{
			bgBottom3.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(bgBottom4.mystyle.normal.background == null)
		{
			bgBottom4.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-bg1",TextureType.DECORATION);
		}
		if(backImg1.mystyle.normal.background == null)
		{
			backImg1.mystyle.normal.background = TextureMgr.instance().LoadTexture("Decorative_strips2",TextureType.DECORATION);
		}
		if(backImg2.mystyle.normal.background == null)
		{
			backImg2.mystyle.normal.background = TextureMgr.instance().LoadTexture("Decorative_strips2",TextureType.DECORATION);
		}
		if(topLine.mystyle.normal.background == null)
		{
			topLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		}
		if(blackImage.mystyle.normal.background == null)
		{
			blackImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("black-Gradual-change",TextureType.DECORATION);
		}
		if(blackImage2.mystyle.normal.background == null)
		{
			blackImage2.mystyle.normal.background = TextureMgr.instance().LoadTexture("black-Gradual-change",TextureType.DECORATION);
		}
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		repeatTimes = (topBackImage.rect.height - 15) / UI_BG_WOOD_WEN_HEIGHT+1;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		itemChat.Init();
		buffBtn.Init();
		buffBtn.tile = TextureMgr.instance().ElseIconSpt().GetTile("rank_icon_citysiege");
		buffBtn.OnClick = handleClickBuff;
		rankBtn.Init();
		rankBtn.txt = "";
		rankBtn.Image = TextureMgr.instance().LoadTexture("button_icon_leaderboard", TextureType.BUTTON);
		rankBtn.OnClick = handleClickRank;
		reportBtn.Init();
		reportBtn.txt = "";
		reportBtn.Image = TextureMgr.instance().LoadTexture("fuction_icon_smallMail1", TextureType.DECORATION);
		reportBtn.OnClick = handleClickReport;
//		troopBtn.Init();
//		troopBtn.txt = "";
//		troopBtn.Image = TextureMgr.instance().LoadTexture("troop_restore_report_icon", TextureType.MAP17D3A_UI);
//		troopBtn.OnClick = handleClickTroopInfo;
		rewardBtn.Init();
		rewardBtn.txt = "";
		rewardBtn.tile = TextureMgr.instance().ItemSpt().GetTile("BuyJisong_icon");
		rewardBtn.OnClick = handleClickReward;
	}
	
	public function DrawItem()
	{
		bgTop1.Draw();
		bgTop2.Draw();
		bgTop3.Draw();
		bgTop4.Draw();
		//top
		topBackImage.Draw();
//		Graphics.DrawTexture(Rect(0, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//		Graphics.DrawTexture(Rect(640 - 23, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
		GUI.DrawTextureWithTexCoords(new Rect(0, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.DrawTextureWithTexCoords(new Rect(640 - 23, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		var oldColor:Color = GUI.color;
		backImg1.Draw();
		backImg2.Draw();
		topTips1.Draw();
		topTips2.Draw();
		topInfoBtn.Draw();
		topLine.Draw();
		btnClose.Draw();
		//middle
		allianceBossLevelList.Draw();
		blackImage2.Draw();
//		middleTips.Draw();
		buffBtn.Draw();
		rankBtn.Draw();
		reportBtn.Draw();
//		troopBtn.Draw();
		rewardBtn.Draw();
		blackImage.Draw();
		bgBottom1.Draw();
		bgBottom2.Draw();
		bgBottom3.Draw();
		bgBottom4.Draw();
		//bottom
		itemChat.Draw();
	}
	
	function Update() 
	{
		UpdateEventTime();
		buffBtn.Update();
		rankBtn.Update();
		reportBtn.Update();
//		troopBtn.Update();
		rewardBtn.Update();
		allianceBossLevelList.Update();
		itemChat.Update();
	}
	
	private function UpdateEventTime()
	{
		var hashDate:Hashtable = KBN.AllianceBossController.instance().GetShowTime() as Hashtable;
		var timeTemp:int = _Global.INT32(hashDate["time"]);
		switch(_Global.INT32(hashDate["type"]))
		{
		case KBN.AllianceBossController.EVENT_TIME_STATE.NOT_START:
			topTips1.txt = String.Format(Datas.getArString("Dungeon.Countdown1"),_Global.timeFormatShortStrNotNull(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.START:
			topTips1.txt = String.Format(Datas.getArString("Dungeon.Countdown2"),_Global.timeFormatShortStrNotNull(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.OVER:
			topTips1.txt = Datas.getArString("Event.End_Title");
		}
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		topTips2.txt = Datas.getArString("Dungeon.Desc");//"The North is in crisis! Join the RoundTable Knights and defend Camelot right now!";
		
		// to refresh "isHaveReward"
		if (KBN.AllianceBossController.instance().EventState == KBN.AllianceBossController.EVENT_TIME_STATE.OVER)
			KBN.LeaderBoardController.instance().ReqAllianceBossDamageLeaderBoard(KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT, 0);
		
		UpdateMenu(true);
	}
	
	public function UpdateMenu(isResetPos:boolean)
	{
		if(KBN.AllianceBossController.instance().isHaveReward)
			rankBtn.BeginNotice();
		else
			rankBtn.EndNotice();
			
		var list = KBN.AllianceBossController.instance().layerList;
		allianceBossLevelList.Clear();
		allianceBossLevelList.SetData(list.ToArray());
		allianceBossLevelList.UpdateData();
		allianceBossLevelList.ResetPos();
		if(isResetPos && KBN.AllianceBossController.instance().curLayer >= allianceBossLevelList.rowPerPage-2)
		{
			var curStartIndex:int = Mathf.Clamp(KBN.AllianceBossController.instance().curLayer-listOffSet, 
												0, 
												Mathf.Max(0, list.Count - allianceBossLevelList.rowPerPage));
			allianceBossLevelList.SetOffSet(-1*allianceBossLevelList.rowDist*curStartIndex);
		}
		middleTips.txt = String.Format(Datas.getArString("Dungeon.JoinedPlayer"), KBN.AllianceBossController.instance().joinPlayerNum);//join player
		var buff:float = KBN.AllianceBossController.instance().buff/10.0f;
		buffBtn.txt = "+"+buff.ToString("f1")+"%";
		itemChat.UpdateMessage();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
        allianceBossLevelList.Clear();
    }
    
    public function OnPop()
	{
		super.OnPop();
		KBN.AllianceBossController.instance().SendSocketUnRegister();
		GameMain.instance().loadLevel(GameMain.CAMPAIGNMAP_SCENE_LEVEL);
	}
    
    private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossListMenu");
	}
	
	private function handleInfo():void
	{
		var setting : InGameHelpSetting = new InGameHelpSetting();
		setting.name = Datas.getArString("IngameHelp.Dungeon_Title");
		setting.type = "one_context";
		setting.key = Datas.getArString("IngameHelp.Dungeon_Text");

		MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
	}
	
	private function handleClickRank():void
	{
		MenuMgr.getInstance().PushMenu("AllianceBossLeaderBoardMenu", null, "trans_zoomComp");
	}
	
	private function handleClickBuff():void
	{
		MenuMgr.getInstance().PushMenu("AllianceBossBuffLeaderBoardMenu", null, "trans_zoomComp");
	}
	
	private function handleClickReport()
	{
//		MenuMgr.getInstance().PushMenu("PveResultMenu","alliance_boss","trans_down" );	

		Message.getInstance().viewAllianceBossReport(onAllianceBossReportDataRedy,10);
	}
	
	private function handleClickTroopInfo()
	{
		KBN.AllianceBossController.instance().ReqAllianceBossTroopInfo();
	}
	
	private function handleClickReward()
	{
		KBN.AllianceBossController.instance().ReqAllianceBossReward();
	}
	
	private function onAllianceBossReportDataRedy(resultList: System.Collections.Generic.List.<Hashtable>)
	{
		if(resultList.Count>0)
		{
			var data:Hashtable = {"AllianceBoss":1, "data":resultList};
			MenuMgr.getInstance().PushMenu("SubEmailDetail", data, "trans_zoomComp");
		}
		else
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("Dungeon.Report_EmptyToaster"));
		}
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.ALLIANCE_BOSS_REPORT:
				if(MenuMgr.getInstance().GetCurMenuName() == this.menuName)
					reportBtn.BeginShake();
				break;
			case Constant.Notice.ALLIANCE_BOSS_RESET:
				if(body as String == "second")
				{
					for(var i:int = 0;;i++)
					{
						var listItem:AllianceBossLevelListItem = allianceBossLevelList.GetItem(i) as AllianceBossLevelListItem;
						if(listItem==null)break;
						listItem.ShowAnimation();
					}
					var buff:float = KBN.AllianceBossController.instance().buff/10.0f;
					buffBtn.txt = "+"+buff.ToString("f1")+"%";
				}
				break;
			case Constant.Notice.ALLIANCE_BOSS_JOINPLAYER:
				middleTips.txt = String.Format(Datas.getArString("Dungeon.JoinedPlayer"), KBN.AllianceBossController.instance().joinPlayerNum);//join player
				break;
			case Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH:
				if(KBN.AllianceBossController.instance().isHaveReward)
					rankBtn.BeginNotice();
				else
					rankBtn.EndNotice();
				break;
			case Constant.Notice.PVE_UPDATE_MARCH_DATA:
			case Constant.Notice.ALLIANCE_BOSS_MSG:
			case Constant.Notice.ALLIANCE_BOSS_OTHER_ATTACK:
				if(MenuMgr.getInstance().GetCurMenuName() == this.menuName)
					UpdateMenu(true);
				break;
			case Constant.Notice.SOCKET_RE_CONNECT:
			case Constant.Notice.ALLIANCE_BOSS_ERROR:
				KBN.AllianceBossController.instance().ReqAllianceBossInfo();
				break;
			case Constant.Notice.SOCKET_ERROR:
				handleBack();
				break;
		}
	}
	
	function OnBack(preMenuName:String)
	{
		if(preMenuName != "AllianceBossResetMenu")
			UpdateMenu(true);
	}
}