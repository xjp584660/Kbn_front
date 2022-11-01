class AllianceBossMenu extends KBNMenu
{
	enum BOSS_CHANGE_TYPE{
		LEFT,
		RIGHT,
		MIDDLE,
		SHAKE,
		NONE
	};
	private var _bossChangeType :BOSS_CHANGE_TYPE = BOSS_CHANGE_TYPE.NONE;
	private function get bossChangeType():BOSS_CHANGE_TYPE
	{
		return _bossChangeType;
	}
	private function set bossChangeType(value:BOSS_CHANGE_TYPE)
	{
		_bossChangeType = value;
		if(_bossChangeType == BOSS_CHANGE_TYPE.NONE)
			bossBtn.SetDisabled(false);
		else
			bossBtn.SetDisabled(true);
	}
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	@SerializeField private var shake:Shake;
	@SerializeField private var shake2:Shake;
	//top
	@SerializeField private var backBtn :Button;
	@SerializeField private var topBackImage:Label;
	@SerializeField private var backImg1 :SimpleLabel;
	@SerializeField private var backImg2 :SimpleLabel;
	@SerializeField private var topTips :SimpleLabel;
	@SerializeField private var topTips2 :SimpleLabel;
	@SerializeField private var topLine :SimpleLabel;
	//middle
	@SerializeField private var buffBtn :CircleButtonItem;
	@SerializeField private var rankBtn :CircleButtonItem;
	@SerializeField private var reportBtn :CircleButtonItem;
//	@SerializeField private var troopBtn :CircleButtonItem;
	@SerializeField private var attackBtn :Button;
	@SerializeField private var speedUpBtn :Button;
	@SerializeField private var marchTime :SimpleLabel;
	@SerializeField private var disappearTip :SimpleLabel;
	@SerializeField private var disappearTime :FlickerLabel;
	@SerializeField private var disappearTimeBack :Label;
	@SerializeField private var attackTimesTip :SimpleLabel;
	@SerializeField private var attackTimes :FlickerLabel;
	@SerializeField private var attackTimesBack :Label;
	@SerializeField private var tipsBg :SimpleLabel;
	@SerializeField private var redWarning :FlickerLabel;
	@SerializeField private var infoBtn :Button;
	@SerializeField private var chatBalloon:ChatBalloon;
	@SerializeField private var leftBtn :Button;
	@SerializeField private var rightBtn :Button;
	@SerializeField private var bossIndex :SimpleLabel;
	@SerializeField private var allianceBossList :ScrollList;
	@SerializeField private var allianceBossItem :AllianceBossListItem;
	@SerializeField private var killInfo :SimpleLabel;
	@SerializeField private var otherAttackInfo :RiseTips;

	@SerializeField private var bgTop1 :SimpleLabel;
	@SerializeField private var bgTop2 :SimpleLabel;
	@SerializeField private var bgTop3 :SimpleLabel;
	@SerializeField private var bgTop4 :SimpleLabel;
	@SerializeField private var bgBottom1 :SimpleLabel;
	@SerializeField private var bgBottom2 :SimpleLabel;
	@SerializeField private var bgBottom3 :SimpleLabel;
	@SerializeField private var bgBottom4 :SimpleLabel;
	
	@SerializeField private var damageTips :RiseTips;
	@SerializeField private var animLabel:AnimationLabel;
	//bottom
	@SerializeField private var itemChat :ChatItem;
	@SerializeField private var bossBtn :Button;
	
	@SerializeField private var damageTipsSpeed1:float;
	@SerializeField private var damageTipsSpeed2:float;
	@SerializeField private var damageTipsPauseTime1:float;
	@SerializeField private var damageTipsPauseTime2:float;
	private var curLayer:int;
	private var curLayerData:KBN.AllianceBossLayerInfo;
	private var curSelectLevel:int;
	private var curSelectLevelIndex:int;
	private var levelUnlockCount:int;
	private var toucher:Toucher = new Toucher();
	private var marchData:KBN.PveMarchData;
	private var curHp :float;
	
	public function Init()
	{
		super.Init();
		
		shake.Init();
		shake2.Init();
		shake2.SetNextFunction(OnShake2Next);
		animLabel.Init("tongyongbaopo000", 6, AnimationLabel.LABEL_STATE.ANIMATION);
		animLabel.Stop();
		bossChangeType = BOSS_CHANGE_TYPE.NONE;
		toucher.Init(toucherLeft, toucherRight, null, null, 30);
		allianceBossItem.Init();
		allianceBossList.Init(allianceBossItem);
		backBtn.OnClick = handleBack;
		topBackImage.useTile = true;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		topBackImage.tile = TileSprite.CreateTile (img, "ui_bg_wood");
		//topBackImage.tile = TextureMgr.instance().BackgroundSpt().GetTile("ui_bg_wood");
		infoBtn.OnClick = handleInfo;
		bossBtn.OnClick = handleInfo;
		infoBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		infoBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		backBtn.setNorAndActBG("button_back2_normal","button_back2_down");
		attackBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		speedUpBtn.setNorAndActBG("button_60_green_normalnew","button_60_green_downnew");
		speedUpBtn.txt = Datas.getArString("Common.Speedup");
		speedUpBtn.OnClick = handleSpeedUp;
		DisableSpeedUpBtn(false);
		if(marchTime.mystyle.normal.background == null)
		{
			marchTime.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_time",TextureType.ICON);
		}
		attackBtn.txt = Datas.getArString("Common.Attack");
		attackBtn.OnClick = handleAttack;
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
		redWarning.Init();
		redWarning.setBackground("Attack_warning_red",TextureType.DECORATION);
		if(bossIndex.mystyle.normal.background == null)
		{
			bossIndex.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenbossname",TextureType.DECORATION);
		}
		if(tipsBg.mystyle.normal.background == null)
		{
			tipsBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("pve-cave-Hexagon-bg",TextureType.DECORATION);
		}
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		repeatTimes = (topBackImage.rect.height - 15) / UI_BG_WOOD_WEN_HEIGHT+1;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		itemChat.Init();
		buffBtn.Init();
		buffBtn.txt = "";
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
		chatBalloon.Init();
		chatBalloon.SetMaxLength(KBN.AllianceBossController.instance().MAX_MSG_LENGTH);
		chatBalloon.setOnInputFunction(SendMsg);
		chatBalloon.ShowDetailBtn(CanInput());
		leftBtn.setNorAndActBG("gear_button_flip_left_normal","gear_button_flip_left_down");
		rightBtn.setNorAndActBG("gear_button_flip_right_normal","gear_button_flip_right_down");
		leftBtn.OnClick = handleClickLeft;
		rightBtn.OnClick = handleClickRight;
		damageTips.Init();
		otherAttackInfo.Init();
	}
	
	public function DrawItem()
	{
		bgTop1.Draw();
		bgTop2.Draw();
		bgTop3.Draw();
		bgTop4.Draw();
		bgBottom1.Draw();
		bgBottom2.Draw();
		bgBottom3.Draw();
		bgBottom4.Draw();
		redWarning.Draw();
		topBackImage.Draw();
//		Graphics.DrawTexture(Rect(0, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//		Graphics.DrawTexture(Rect(640 - 23, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
		GUI.DrawTextureWithTexCoords(new Rect(0, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.DrawTextureWithTexCoords(new Rect(640 - 23, 0, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		var oldColor:Color = GUI.color;
		backImg1.Draw();
		backImg2.Draw();
		topTips.Draw();
		topTips2.Draw();
		backBtn.Draw();
		damageTips.Draw();
		allianceBossList.Draw();
		bossIndex.Draw();
		infoBtn.Draw();
		bossBtn.Draw();
		attackBtn.Draw();
		speedUpBtn.Draw();
		marchTime.Draw();
		chatBalloon.Draw();
		
		tipsBg.Draw();
		shake.ShakeMatrixBegin();
		shake2.ShakeMatrixBegin();
		disappearTip.Draw();
		disappearTimeBack.Draw();
		disappearTime.Draw();
		attackTimesTip.Draw();
		attackTimesBack.Draw();
		attackTimes.Draw();
		shake2.ShakeMatrixEnd();
		shake.ShakeMatrixEnd();
		
		itemChat.Draw();
		leftBtn.Draw();
		rightBtn.Draw();
		killInfo.Draw();
		otherAttackInfo.Draw();
		animLabel.Draw();
		
		buffBtn.Draw();
		rankBtn.Draw();
		reportBtn.Draw();
//		troopBtn.Draw();
		topLine.Draw();
	}
	
	function Update() 
	{
		UpdateDisappearTime();
		UpdateEventTime();
		buffBtn.Update();
		rankBtn.Update();
		reportBtn.Update();
//		troopBtn.Update();
		itemChat.Update();
		chatBalloon.Update();
		toucher.Update();
		
		if(marchData.isAllianceBoss)
		{
			var leftTime:long = marchData.marchEndTime - GameMain.instance().unixtime();
			marchTime.txt = _Global.timeFormatStrPlus(leftTime);
			if(leftTime<=0)
				DisableSpeedUpBtn(true);
		}
		else if(speedUpBtn.isVisible())
		{
			DisableSpeedUpBtn(true);
			marchTime.txt = _Global.timeFormatStrPlus(0);
		}
		
		shake.Update();
		shake2.Update();
	}
	
	private function UpdateEventTime()
	{
		var hashDate:Hashtable = KBN.AllianceBossController.instance().GetShowTime() as Hashtable;
		var timeTemp:int = _Global.INT32(hashDate["time"]);
		switch(_Global.INT32(hashDate["type"]))
		{
		case KBN.AllianceBossController.EVENT_TIME_STATE.NOT_START:
			topTips.txt = String.Format(Datas.getArString("Dungeon.Countdown1"),_Global.timeFormatShortStrNotNull(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.START:
			topTips.txt = String.Format(Datas.getArString("Dungeon.Countdown2"),_Global.timeFormatShortStrNotNull(timeTemp,false));//"Event end time"
			break;
		case KBN.AllianceBossController.EVENT_TIME_STATE.OVER:
			topTips.txt = Datas.getArString("Event.End_Title");
			DisableSpeedUpBtn(true);
			break;
		}
	}

	private function UpdateDisappearTime() 
	{
		if(!KBN.AllianceBossController.instance().IsInProgress())
			return;
		var curAttackLayer:int = KBN.AllianceBossController.instance().curLayer;
		if(curLayer == curAttackLayer && curSelectLevelIndex == levelUnlockCount-1)
		{
			var leftTime:long = KBN.AllianceBossController.instance().disappearTime - GameMain.instance().unixtime();
			var isTimeWarning:boolean = KBN.AllianceBossController.instance().WARNING_TIME >= leftTime;
			var isAttackNumWarning:boolean = KBN.AllianceBossController.instance().WARNING_ATTACK_NUM >= KBN.AllianceBossController.instance().leftAttackNum;
			if(!KBN.AllianceBossController.instance().IsFail() && 
				!KBN.AllianceBossController.instance().IsOver() && 
				( isTimeWarning || isAttackNumWarning ) &&
				!(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0)
			)
			{
				redWarning.SetVisible(true);
				if(disappearTimeBack.isVisible && isTimeWarning)
					disappearTime.SetVisible(true);
				else
					disappearTime.SetVisible(false);
				if(attackTimesBack.isVisible && isAttackNumWarning)
					attackTimes.SetVisible(true);
				else
					attackTimes.SetVisible(false);
			}
			else
			{
				redWarning.SetVisible(false);
				disappearTime.SetVisible(false);
				attackTimes.SetVisible(false);
			}
			disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(leftTime,false);
			disappearTime.txt = _Global.timeFormatShortStrNotNull(leftTime,false);
		}
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		curLayer = _Global.INT32(param);
		curLayerData = KBN.AllianceBossController.instance().GetLayerData(curLayer) as KBN.AllianceBossLayerInfo;
		if(curLayerData == null)
			return;
		marchData = KBN.PveController.instance().GetPveMarchInfo() as KBN.PveMarchData;
		GetCurSelectLevel();
		OnBossItemClick(curSelectLevel, curSelectLevelIndex);
		if(KBN.AllianceBossController.instance().isHaveReward)
			rankBtn.BeginNotice();
		else
			rankBtn.EndNotice();
		topTips2.txt = Datas.getArString("Dungeon.Desc");//"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
		disappearTip.txt = String.Format(Datas.getArString("Dungeon.Boss_Countdown"),"");//"Disappears in:";
		var _size:Vector2 = disappearTip.mystyle.CalcSize(GUIContent(disappearTip.txt));
		disappearTime.rect.x = disappearTimeBack.rect.x = disappearTip.rect.x + _size.x + 5;
		disappearTime.Init();
		
		attackTimesTip.txt = String.Format(Datas.getArString("Dungeon.Boss_Chance"), "");
		var _size2:Vector2 = attackTimesTip.mystyle.CalcSize(GUIContent(attackTimesTip.txt));
		attackTimes.rect.x = attackTimesBack.rect.x = attackTimesTip.rect.x + _size2.x + 5;
		attackTimes.Init();
		
		var buff:float = KBN.AllianceBossController.instance().buff/10.0f;
		buffBtn.txt = "+"+buff.ToString("f1")+"%";
		killInfo.txt = "";
		GameMain.instance().getAllianceBossController().ShowEffect();
		GameMain.instance().getAllianceBossController().ShowSecondBg();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
		allianceBossList.Clear();
		if(GameMain.instance().curSceneLev() == GameMain.ALLIANCE_BOSS_LEVEL)
		{
			GameMain.instance().getAllianceBossController().HideBoss();
			GameMain.instance().getAllianceBossController().HideEffect();
			GameMain.instance().getAllianceBossController().ShowFirstBg();
			GameMain.instance().getAllianceBossController().ClearBossHead();
		}
		chatBalloon.OnPopOver();
    }
    
    private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossMenu");
	}
	
	private function handleInfo():void
	{
		if(bossChangeType != BOSS_CHANGE_TYPE.NONE)
			return;
		var canAttack:int = 0;
		if(CanAttack())
			canAttack = 1;
		var param:HashObject = new HashObject({"levelID":curSelectLevel, "isHIdeBossInfo":0, "isAllianceBoss":1, "factor":curLayerData.factor, "canAttack":canAttack, "curHp":curHp});
		MenuMgr.getInstance().PushMenu("BossMenu", param,"transition_BlowUp");
	}
	
	private function GetCurSelectLevel():void
	{
		var curAttackLayer:int = KBN.AllianceBossController.instance().curLayer;
		if(curLayer < curAttackLayer)
		{
			levelUnlockCount = curLayerData.levelList.Count;
			curSelectLevelIndex = levelUnlockCount-1;
			curSelectLevel = curLayerData.levelList[curSelectLevelIndex];
		}
		else if(curLayer == curAttackLayer)
		{
			levelUnlockCount = KBN.AllianceBossController.instance().curLevelIndex+1;
			curSelectLevelIndex = levelUnlockCount-1;
			curSelectLevel = curLayerData.levelList[curSelectLevelIndex];
		}
		else
		{
			levelUnlockCount = 1;
			curSelectLevelIndex = 0;
			curSelectLevel = curLayerData.levelList[curSelectLevelIndex];
		}
	}
	
	public function OnBossItemClick(clickLevel:int, clickLevelIndex:int)
	{
		curSelectLevelIndex = clickLevelIndex;
		curSelectLevel = clickLevel;
		ShowCurrentBoss();
	}
	
	public function ShowCurrentBoss()
	{
		var arrayTmp:Array = new Array();
		var nIndex:int = 0;
		curLayerData.levelList.ForEach(
			function(level:int)
			{
				var tempHash:Hashtable = {
					"levelID":level,
					"index":nIndex,
					"curSelectLevelIndex":curSelectLevelIndex,
					"curAttackLevelIndex":levelUnlockCount-1,
					"totalLevelCount":curLayerData.levelList.Count
				};
				arrayTmp.Add(tempHash);
				nIndex++;
			}
		);
		allianceBossList.SetData(arrayTmp);
		allianceBossList.rect.x = (640 - allianceBossList.colDist*arrayTmp.length)/2;
		bossIndex.txt = curSelectLevelIndex+1+"";
		GameMain.instance().getAllianceBossController().ShowBoss(curSelectLevel, curLayerData.factor, curSelectLevelIndex);
		
		if(curSelectLevelIndex<=curLayerData.leaveMsg.Count-1)
		{
			chatBalloon.txt = curLayerData.leaveMsg[curSelectLevelIndex];
			if(curSelectLevelIndex<=curLayerData.avatar.Count-1)
			{
				chatBalloon.HeadTile = curLayerData.avatar[curSelectLevelIndex];
			}
		}
		else
		{
			chatBalloon.txt = "";
			chatBalloon.HeadTile = "";
		}
			
		RefreshDisappearTime();
		updateAttackBtn();
		
		leftBtn.SetVisible(true);
		rightBtn.SetVisible(true);
		if(curSelectLevelIndex == 0)
			leftBtn.SetVisible(false);
		if(curSelectLevelIndex == curLayerData.levelList.Count-1)
			rightBtn.SetVisible(false);
	}
	
	private function RefreshDisappearTime()
	{
		var curAttackLayer:int = KBN.AllianceBossController.instance().curLayer;
		var bossInfo : KBN.DataTable.PveBoss = GameMain.GdsManager.GetGds.<KBN.GDS_PveBoss>().GetItemById( curSelectLevel );
		if(bossInfo == null)throw new System.ApplicationException("AllianceBossMenu ShowCurrentBoss Error.");
		redWarning.SetVisible(false);
		disappearTime.SetVisible(false);
		attackTimes.SetVisible(false);
		if(curLayer < curAttackLayer)
		{
			curHp = 0;
			GameMain.instance().getAllianceBossController().SetHp(0,1);
			disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
			disappearTime.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
			disappearTimeBack.SetVisible(false);
			attackTimesBack.SetVisible(false);
		}
		else if(curLayer == curAttackLayer)
		{
			if(curSelectLevelIndex == levelUnlockCount-1)
			{
				curHp = KBN.AllianceBossController.instance().curBossHp/_Global.DOULBE64(KBN.AllianceBossController.instance().totalBossHp);
				GameMain.instance().getAllianceBossController().SetHp(KBN.AllianceBossController.instance().curBossHp,KBN.AllianceBossController.instance().totalBossHp);
				disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(KBN.AllianceBossController.instance().disappearTime - GameMain.instance().unixtime(),false);
				disappearTime.txt = _Global.timeFormatShortStrNotNull(KBN.AllianceBossController.instance().disappearTime - GameMain.instance().unixtime(),false);
				if(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0)
				{
					disappearTimeBack.SetVisible(false);
					attackTimesBack.SetVisible(false);
				}
				else
				{
					disappearTimeBack.SetVisible(true);
					attackTimesBack.SetVisible(true);
				}
			}
			else if(curSelectLevelIndex < levelUnlockCount-1)
			{
				curHp = 0;
				GameMain.instance().getAllianceBossController().SetHp(0,1);
				disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
				disappearTime.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);	
				disappearTimeBack.SetVisible(false);
				attackTimesBack.SetVisible(false);
			}
			else if(curSelectLevelIndex > levelUnlockCount-1)
			{
				curHp = 1;
				GameMain.instance().getAllianceBossController().SetHp(1,1);
				disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
				disappearTime.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
				disappearTimeBack.SetVisible(true);
				attackTimesBack.SetVisible(true);
			}
		}
		else
		{
			curHp = 1;
			GameMain.instance().getAllianceBossController().SetHp(1,1);
			disappearTimeBack.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
			disappearTime.txt = _Global.timeFormatShortStrNotNull(bossInfo.DISPPEAR_TIME,false);
			disappearTimeBack.SetVisible(true);
			attackTimesBack.SetVisible(true);
		}
		
		attackTimesBack.txt = attackTimes.txt = bossInfo.ATTACK_NUM+"";
		if(bossInfo.ATTACK_NUM<=0 || KBN.AllianceBossController.instance().EventState != KBN.AllianceBossController.EVENT_TIME_STATE.START)
		{
			attackTimesBack.SetVisible(false);
		}
		else
		{
			attackTimesBack.SetVisible(true);
		}
		if(bossInfo.DISPPEAR_TIME<=0 || KBN.AllianceBossController.instance().EventState != KBN.AllianceBossController.EVENT_TIME_STATE.START)
			disappearTimeBack.SetVisible(false);
		else
			disappearTimeBack.SetVisible(true);
	}
	
	private function handleClickRank():void
	{
		MenuMgr.getInstance().PushMenu("AllianceBossLeaderBoardMenu", null, "trans_zoomComp");
	}
	
	private function handleClickTroopInfo()
	{
		KBN.AllianceBossController.instance().ReqAllianceBossTroopInfo();
	}
	
	private function handleClickBuff():void
	{
		MenuMgr.getInstance().PushMenu("AllianceBossBuffLeaderBoardMenu", null, "trans_zoomComp");
	}
	
	private function handleAttack():void
	{
		if(bossChangeType != BOSS_CHANGE_TYPE.NONE)
			return;
		if(!CanAttack())
			return;
		//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":-1, "y":-1, "type":Constant.MarchType.ALLIANCEBOSS},"trans_zoomComp" );
		MarchDataManager.instance().SetData({"x":-1, "y":-1, "type":Constant.MarchType.ALLIANCEBOSS});
	}
	
	private function toucherLeft():void
	{
		if(handleClickRight())
			SoundMgr.instance().PlayEffect( "on_tap", "Audio/");
	}
	
	private function toucherRight():void
	{
		if(handleClickLeft())
			SoundMgr.instance().PlayEffect( "on_tap", "Audio/");
	}
	
	private function handleClickLeft():boolean
	{
		if(bossChangeType != BOSS_CHANGE_TYPE.NONE)
			return false;
		if(curSelectLevelIndex>0)
		{
			bossChangeType = BOSS_CHANGE_TYPE.LEFT;
			curSelectLevelIndex--;
			GameMain.instance().getAllianceBossController().PlayAnimationRightOut();
			UiRightTransOut();
			return true;
		}
		return false;
	}
	
	private function handleClickRight():boolean
	{
		if(bossChangeType != BOSS_CHANGE_TYPE.NONE)
			return false;
		if(curSelectLevelIndex<curLayerData.levelList.Count-1)
		{
			bossChangeType = BOSS_CHANGE_TYPE.RIGHT;
			curSelectLevelIndex++;
			GameMain.instance().getAllianceBossController().PlayAnimationLeftOut();
			UiLeftTransOut();
			return true;
		}
		return false;
	}
	
	private function TestDamageTipsEndFunc()
	{
		damageTips.txt = String.Format(Datas.getArString("Dungeon.Report_SubTitle"), "123")+"          "+Datas.getArString("Dungeon.Buff_Subtitle3")+"+"+"11"+"%";
		damageTips.Begin();
	}
	
	private function handleClickReport()
	{
		Message.getInstance().viewAllianceBossReport(onAllianceBossReportDataRedy,10);
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
			case Constant.Notice.PVE_UPDATE_MARCH_DATA:
				OnMarchChange(body);
				break;
			case Constant.Notice.ALLIANCE_BOSS_ANIMATION_NOTICE:
				OnBossAnimationOver(body);
				break;
			case Constant.Notice.ALLIANCE_BOSS_REPORT:
				reportBtn.BeginShake();
				break;
			case Constant.Notice.ALLIANCE_BOSS_MSG:
				OnMsgChange(body);
				break;
			case Constant.Notice.ALLIANCE_BOSS_OTHER_ATTACK:
				OnOtherAttack();
				break;
			case Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH:
				if(KBN.AllianceBossController.instance().isHaveReward)
					rankBtn.BeginNotice();
				else
					rankBtn.EndNotice();
				break;
			case Constant.Notice.ALLIANCE_BOSS_STATE_CHANGE:
				updateAttackBtn();
				RefreshDisappearTime();
				break;
			case Constant.Notice.ALLIANCE_BOSS_RESET:
			case Constant.Notice.SOCKET_ERROR:
			case Constant.Notice.SOCKET_RE_CONNECT:
			case Constant.Notice.ALLIANCE_BOSS_ERROR:
				handleBack();
				break;
		}
	}
	
	private function updateAttackBtn()
	{
		if(marchData.isAllianceBoss)
		{
			marchTime.txt = _Global.timeFormatStrPlus(marchData.marchEndTime - GameMain.instance().unixtime());
			marchTime.SetVisible(true);
			speedUpBtn.SetVisible(true);
			attackBtn.SetVisible(false);
			DisableSpeedUpBtn(false);
		}
		else
		{
			marchTime.SetVisible(false);
			speedUpBtn.SetVisible(false);
			attackBtn.SetVisible(true);
		}

		if(CanAttack())
		{
			attackBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			attackBtn.SetNormalTxtColor(FontColor.Button_White);
			attackBtn.SetDisabled(false);
		}
		else
		{
			attackBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			attackBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			attackBtn.SetDisabled(true);
		}
		
		if(KBN.AllianceBossController.instance().curLayer == curLayer && 
			KBN.AllianceBossController.instance().curLevelIndex == curSelectLevelIndex)
			attackTimes.txt = attackTimesBack.txt = KBN.AllianceBossController.instance().leftAttackNum+"";
	}
	
	private function RefreshCurrentBoss()
	{
		if(KBN.AllianceBossController.instance().curLevelIndex == 0)
		{
			var dataHash:Hashtable = new Hashtable();
			dataHash["overFunction"] = OnChangeMenuClose as System.Action;
			MenuMgr.getInstance().PushMenu("AllianceBossChangeMenu", dataHash, "trans_zoomComp");
		}
		else
		{
			bossChangeType = BOSS_CHANGE_TYPE.MIDDLE;
			GameMain.instance().getAllianceBossController().PlayAnimationMiddleOut();
			UiLeftTransOut();
			ShowDamageInfo();
		}
	}
	
	private function OnChangeMenuClose()
	{
		bossChangeType = BOSS_CHANGE_TYPE.MIDDLE;
		GameMain.instance().getAllianceBossController().PlayAnimationMiddleOut();
		UiLeftTransOut();
		ShowDamageInfo();
	}
	
	private function OnMsgChange(param:Object)
	{
		var hashData:Hashtable = param as Hashtable;
		var layer:int = _Global.INT32(hashData["layer"]);
		var levelIndex:int = _Global.INT32(hashData["levelIndex"]);
		if(layer == curLayer && curSelectLevelIndex == levelIndex)
		{
			chatBalloon.txt = _Global.ToString(hashData["msg"]);
			chatBalloon.HeadTile = _Global.ToString(hashData["avatar"]);
		}
	}
	
	private function OnBossAnimationOver(param:Object)
	{
		var type :String = param as String;
		switch(type)
		{
		case "Over":
			bossChangeType = BOSS_CHANGE_TYPE.NONE;
			GameMain.instance().getAllianceBossController().PlayAnimationDefalt();
			break;
		case "LeftOut":
			OnBossItemClick(curLayerData.levelList[curSelectLevelIndex], curSelectLevelIndex);
			GameMain.instance().getAllianceBossController().PlayAnimationRightIn();
			UiRightTransIn();
			break;
		case "RightOut":
			OnBossItemClick(curLayerData.levelList[curSelectLevelIndex], curSelectLevelIndex);
			GameMain.instance().getAllianceBossController().PlayAnimationLeftIn();
			UiLeftTransIn();
			break;
		case "ShakeOver":
			bossChangeType = BOSS_CHANGE_TYPE.NONE;
			GameMain.instance().getAllianceBossController().PlayAnimationDefalt();
			OnAttackOver();
			ShowDamageInfo();
			break;
		case "DieOver":
			OnAttackOver();
			ShowCurAttackBoss();
			GameMain.instance().getAllianceBossController().PlayAnimationRightIn();
			animLabel.Start();
			UiRightTransIn();
			break;
		}
	}
	
	private function OnMarchChange(param:Object)
	{
		var type :String = param as String;
		switch(type)
		{
		case "over":
			bossChangeType = BOSS_CHANGE_TYPE.SHAKE;
			GameMain.instance().getAllianceBossController().PlayAnimationShake();
			break;
		case "start":
		case "updateAttackBtn":
			updateAttackBtn();
			break;
		}
	}
	
	private function handleSpeedUp()
	{
		if(marchData.isAllianceBoss)
		{
			var queItem:MarchVO = March.instance().getPveQueItem();
			MenuMgr.getInstance().PushMenu("SpeedUpMenu",queItem, "trans_zoomComp");	
		}
	}
	
	private function OnAttackOver()
	{
		GetCurUnlockCount();
		updateAttackBtn();
		curHp = KBN.AllianceBossController.instance().curBossHp/_Global.DOULBE64(KBN.AllianceBossController.instance().totalBossHp);
		GameMain.instance().getAllianceBossController().SetHp(KBN.AllianceBossController.instance().curBossHp,KBN.AllianceBossController.instance().totalBossHp);
	}
	
	private function ShowDamageInfo()
	{
		if(KBN.AllianceBossController.instance().attackerName == GameMain.instance().getUserName())
		{
			var damage:long = KBN.AllianceBossController.instance().curDamage;
			speedUpBtn.SetDisabled(true);
			var increbuff:float = KBN.AllianceBossController.instance().increbuff/10.0f;
			var totalbuff:float = KBN.AllianceBossController.instance().buff/10.0f;
//			if(increbuff>0)
//				buffBtn.PlayTipsAni("+"+(totalbuff-increbuff).ToString("f1")+"%", "+"+increbuff.ToString("f1")+"%", "+"+totalbuff.ToString("f1")+"%");
			if(KBN.AllianceBossController.instance().attackerName == GameMain.instance().getUserName())
			{
				if(!KBN.AllianceBossController.instance().isBossDie || KBN.AllianceBossController.instance().IsLast())
				{
					damageTips.RiseSpeed = damageTipsSpeed1;
					damageTips.PauseTime = damageTipsPauseTime1;
				}
				else
				{
					damageTips.RiseSpeed = damageTipsSpeed2;
					damageTips.PauseTime = damageTipsPauseTime2;
				}
				damageTips.txt = String.Format(Datas.getArString("Dungeon.Report_SubTitle"), damage+"")+"          "+Datas.getArString("Dungeon.Buff_Subtitle3")+"+"+increbuff+"%";
				damageTips.Begin();
			}
		}
	}
	
	private function ShowPreAllianceBoss()
	{
		var preData:Hashtable = KBN.AllianceBossController.instance().GetPreLevelInfo() as Hashtable;
		if(preData!=null)
		{
			curLayer = _Global.INT32(preData["layerID"]);
			curSelectLevel = _Global.INT32(preData["levelID"]);
			curSelectLevelIndex = _Global.INT32(preData["leveIndex"]);
			levelUnlockCount = curSelectLevelIndex+1;
			curLayerData = KBN.AllianceBossController.instance().GetLayerData(curLayer) as KBN.AllianceBossLayerInfo;
			if(curLayerData!=null)
				ShowCurrentBoss();	
		}
	}
	
	private function ShowCurAttackBoss()
	{
		curLayer = KBN.AllianceBossController.instance().curLayer;
		curSelectLevel = KBN.AllianceBossController.instance().curLevel;
		curSelectLevelIndex = KBN.AllianceBossController.instance().curLevelIndex;
		levelUnlockCount = curSelectLevelIndex+1;
		curLayerData = KBN.AllianceBossController.instance().GetLayerData(curLayer) as KBN.AllianceBossLayerInfo;
		ShowCurrentBoss();
	}
	
	private function CanAttack():boolean
	{
		if(!KBN.AllianceBossController.instance().IsFail() && 
			KBN.AllianceBossController.instance().IsInProgress() &&
			KBN.AllianceBossController.instance().curLayer == curLayer && 
			KBN.AllianceBossController.instance().curLevelIndex == curSelectLevelIndex &&
			KBN.PveController.instance().GetPveMarchInfo().marchID<0 &&
			!(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0))
			return true;
		return false;
	}
	
	private function OnOtherAttack()
	{
		MenuMgr.getInstance().PopMenu("SpeedUpMenu");
		var increbuff:float = KBN.AllianceBossController.instance().increbuff/10.0f;
		var totalbuff:float = KBN.AllianceBossController.instance().buff/10.0f;
		if(increbuff>0)
			buffBtn.PlayTipsAni("+"+(totalbuff-increbuff).ToString("f1")+"%", "+"+increbuff.ToString("f1")+"%", "+"+totalbuff.ToString("f1")+"%");
		if(KBN.AllianceBossController.instance().isBossDie)
		{
			if(KBN.AllianceBossController.instance().attackerName != GameMain.instance().getUserName())
			{
				otherAttackInfo.txt = String.Format(Datas.getArString("Dungeon.Kill"), KBN.AllianceBossController.instance().attackerName);
				otherAttackInfo.Begin();
			}
			if(KBN.AllianceBossController.instance().IsLast() && KBN.AllianceBossController.instance().curBossHp<=0)
			{
				OnLastLevelOver();
			}
			else
			{
				ShowPreAllianceBoss();
				RefreshCurrentBoss();
			}
		}
		else
		{
			if(KBN.AllianceBossController.instance().attackerName != GameMain.instance().getUserName())
			{
				otherAttackInfo.txt = String.Format(Datas.getArString("Dungeon.Damage"), KBN.AllianceBossController.instance().attackerName, KBN.AllianceBossController.instance().curDamage);
				otherAttackInfo.Begin();
			}
			
			if(bossChangeType == BOSS_CHANGE_TYPE.SHAKE || bossChangeType == BOSS_CHANGE_TYPE.MIDDLE)
			{
				ShowDamageInfo();
			}
			else
			{
				ShowCurAttackBoss();
				bossChangeType = BOSS_CHANGE_TYPE.SHAKE;
				GameMain.instance().getAllianceBossController().PlayAnimationShake();
			}
		}
	}
	
	private function UiLeftTransOut()
	{
		shake.SetNextType(Shake.NEXT_TYPE.PAUSE);
		shake.Begin();
//		chatBalloon.FoldByStatus(FoldablePanel.FoldingDirection.LEFT);
	}
	
	private function UiRightTransIn()
	{
		shake.SetNextType(Shake.NEXT_TYPE.NOT_PAUSE);
		shake.ForceNext();
		shake.RecoverShake();
//		chatBalloon.UnfoldByStatus();
	}
	
	private function UiRightTransOut()
	{
		shake2.SetNextType(Shake.NEXT_TYPE.PAUSE);
		shake2.Begin();
//		chatBalloon.FoldByStatus(FoldablePanel.FoldingDirection.LEFT);
	}
	
	private function UiLeftTransIn()
	{
		shake2.SetNextType(Shake.NEXT_TYPE.NOT_PAUSE);
		shake2.RecoverShake();
//		chatBalloon.UnfoldByStatus();
	}
	
	private function SendMsg(msg:String)
	{
		KBN.AllianceBossController.instance().ReqAllianceBossMsg(msg, curSelectLevel, curLayer+1);
	}
	
	private function CanInput():boolean
	{
		if ( Alliance.singleton.MyAllianceId() != 0 && Alliance.singleton.IsHaveRights(AllianceRights.RightsType.AllianceBossMsg) )
			return true;
		return false;
	}
	
	private function OnShake2Next(index:int)
	{
		if(index == 1)
			shake2.ForceNext();
	}
	
	private function DisableSpeedUpBtn(disable:boolean)
	{
		if(disable)
		{
			speedUpBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			speedUpBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			speedUpBtn.SetDisabled(true);
			speedUpBtn.SetDisabled(true);
		}
		else
		{
			speedUpBtn.setNorAndActBG("button_60_green_normalnew","button_60_green_downnew");
			speedUpBtn.SetNormalTxtColor(FontColor.Button_White);
			speedUpBtn.SetDisabled(false);
			speedUpBtn.SetDisabled(false);
		}
	}
	
	private function GetCurUnlockCount():void
	{
		var curAttackLayer:int = KBN.AllianceBossController.instance().curLayer;
		if(curLayer < curAttackLayer)
		{
			levelUnlockCount = curLayerData.levelList.Count;
		}
		else if(curLayer == curAttackLayer)
		{
			levelUnlockCount = KBN.AllianceBossController.instance().curLevelIndex+1;
		}
		else
		{
			levelUnlockCount = 1;
		}
	}
	
	private function OnLastLevelOver()
	{
		var dataHash:Hashtable = new Hashtable();
		dataHash["overFunction"] = OnChangeMenuCloseLast as System.Action;
		MenuMgr.getInstance().PushMenu("AllianceBossChangeMenu", dataHash, "trans_zoomComp");
	}
	private function OnChangeMenuCloseLast()
	{
		ShowDamageInfo();
		OnAttackOver();
	}
}