class BossMenu extends KBNMenu
{
	enum Menu_Type
	{
		MENU_TYPE_BOSS_INFO = 0,
		MENU_TYPE_ATTACK_WITHOUT_SCORE,
		MENU_TYPE_ATTACK_WHITH_SCORE,
		MENU_TYPE_IN_ATTACK,
		MENU_TYPE_ANOTHER,
		MENU_TYPE_ALLIANCEBOSS
	};
	
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	@SerializeField private var frameRect:Rect;
	
	@SerializeField private var menuType :Menu_Type;
	
	//background begin
	@SerializeField private var leftTopImg :Label;
	@SerializeField private var leftMiddleImg :Label;
	@SerializeField private var leftBottomImg :Label;
	
	@SerializeField private var rightTopImg :Label;
	@SerializeField private var rightMiddleImg :Label;
	@SerializeField private var rightBottomImg :Label;
	
	@SerializeField private var mask:SimpleLabel;
	@SerializeField private var line:Label;
	
	@SerializeField private var backImage:SimpleLabel;
	//background end

	@SerializeField private var star1 :Label;
	@SerializeField private var star2 :Label;
	@SerializeField private var star3 :Label;
	
	@SerializeField private var blackStar1 :SimpleLabel;
	@SerializeField private var blackStar2 :SimpleLabel;
	@SerializeField private var blackStar3 :SimpleLabel;
	
	@SerializeField private var score :Label;
	
	@SerializeField private var bossIcon :Label;
	@SerializeField private var dialogBtn :Button;
	@SerializeField private var bossName :Label;
	@SerializeField private var bossDesc :Label;
	@SerializeField private var might :Label;
	@SerializeField private var mightTxt :Label;
	@SerializeField private var level :Label;
	@SerializeField private var levelTxt :Label;
	
	@SerializeField private var infoBtn :Button;
	@SerializeField private var leftBtn :Button;
	@SerializeField private var rightBtn :Button;
	@SerializeField private var pageNum :Label;
	
	//chance to find begin
	@SerializeField private var rewardList:ScrollList;
	@SerializeField private var rewardItem:ListItem;
	//chance to find end
	
	@SerializeField private var attackBtn :Button;
	
	@SerializeField private var march:ProgressBar;
	@SerializeField private var marchFrame:Label;
	@SerializeField private var speedupBtn :Button;
	@SerializeField private var timeIcon :Label;
	@SerializeField private var timeText :Label;
	
	@SerializeField private var topLoop :Label;
	@SerializeField private var bossBack :Label;
	
	@SerializeField private var frameSimpleLabel:SimpleLabel;
	
	@SerializeField private var bossLeftTime :Label;
	
	@SerializeField private var needEnergy :Label;
	
	@SerializeField private var roundBack:SimpleLabel;
	@SerializeField private var health:ProgressBar;
	@SerializeField private var healthFrame:SimpleLabel;
	@SerializeField private var healthFrameRect1:Rect;
	@SerializeField private var healthFrameRect2:Rect;
	@SerializeField private var mightRect1:Rect;
	@SerializeField private var mightRect2:Rect;
	@SerializeField private var mightNumRect1:Rect;
	@SerializeField private var mightNumRect2:Rect;
	@SerializeField private var winTimes:Label;
	
	private var levelID :int;
	private var bossData:KBN.PveLevelInfo;
		
	private var marchData:KBN.PveMarchData;
	
	private var hidenBossData:KBN.HidenBossUiInfo;
	
	private var isHIdeBossInfo:int = 0;
	private var isAllianceBoss:int = 0;
	
	@SerializeField private var allianceBossToolbar: ToolBar;
	@SerializeField private var troops:SimpleLabel;
	@SerializeField private var fought:SimpleLabel;
	@SerializeField private var backLine:SimpleLabel;
	@SerializeField private var troopList:ScrollList;
	@SerializeField private var troopItem:ListItem;
	@SerializeField private var headRect:Rect;

	@SerializeField private var verifyLeftTime :Label;
	
	private var isBossIconGray : boolean;
	
	public function Init()
	{
		btnClose.OnClick = handleBack;
		star1.useTile = true;
		star2.useTile = true;
		star3.useTile = true;
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		star1.tile = iconSpt.GetTile("button_star_chapter");
		star2.tile = star1.tile;
		star3.tile = star1.tile;		
		
		infoBtn.OnClick = handleClickInfo;
		dialogBtn.OnClick = handleClickDialog;
		dialogBtn.setNorAndActBG("button_talk_normal","button_talk_down");
		leftBtn.setNorAndActBG("button_flip_left_normal","button_flip_left_down");
		leftBtn.OnClick = OnClickLeft;
		rightBtn.setNorAndActBG("button_flip_right_normal","button_flip_right_down");
		rightBtn.OnClick = OnClickRight;
		attackBtn.txt = Datas.getArString("Common.Attack");//"ATTACK";
		attackBtn.OnClick = OnClickAttack;
		
		topLoop.setBackground("bossinfo-bg3",TextureType.DECORATION);
		bossBack.setBackground("bossinfo-bg-lv2",TextureType.PVEBOSS);
		
		march.Init();
		march.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		
		health.Init();
		health.thumb.setBackground("task_list_red",TextureType.DECORATION);	
		healthFrame.setBackground("hiddenboss-blood-bg",TextureType.DECORATION);
		
		timeIcon.setBackground("icon_time",TextureType.ICON);
		speedupBtn.setNorAndActBG("button_60_green_normalnew","button_60_green_downnew");
		speedupBtn.txt = Datas.getArString("Common.Speedup");
		speedupBtn.OnClick = OnClickSpeedUp;
		
		
		//back
		leftTopImg.setBackground("bossinfo-bg1",TextureType.DECORATION);
		leftMiddleImg.setBackground("bossinfo-bg2",TextureType.DECORATION);
		leftBottomImg.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
		bossLeftTime.setBackground("Orange_Gradients",TextureType.DECORATION);
		
		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black",TextureType.BACKGROUND);
		}
		
		if(backImage.mystyle.normal.background == null)
		{
			backImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}
		
		blackStar1.useTile = true;
		blackStar2.useTile = true;
		blackStar3.useTile = true;
		blackStar1.tile = iconSpt.GetTile("bossinfo-blackstar");
		blackStar2.tile = blackStar1.tile;
		blackStar3.tile = blackStar1.tile;
		
		line.setBackground("between line",TextureType.DECORATION);
		level.setBackground("Button_UserInfo_lv",TextureType.DECORATION);
		
		rightTopImg.setBackground("bossinfo-bg1",TextureType.DECORATION);
		rightMiddleImg.setBackground("bossinfo-bg2",TextureType.DECORATION);
		rightBottomImg.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
		
		bossName.setBackground("hiddenbossname",TextureType.DECORATION);
		marchFrame.setBackground("progress_bar_bottom",TextureType.DECORATION);
		
		roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("Button_UserInfo_Crown",TextureType.DECORATION);
		
		frameSimpleLabel.Sys_Constructor();
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		
		marginT = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		resetLayout();
		
		allianceBossToolbar.Init();
		allianceBossToolbar.indexChangedFunc = SelectTab;
		allianceBossToolbar.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_normal", TextureType.BUTTON);
		allianceBossToolbar.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_down", TextureType.BUTTON);
		
		allianceBossToolbar.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
		allianceBossToolbar.SetOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		allianceBossToolbar.toolbarStrings = [Datas.getArString("Common.Rewards"),Datas.getArString("Common.Troops")];//["Rewards", "Troops"];
		
		troops.txt = Datas.getArString("Common.Troops");//"Troops";
		fought.txt = Datas.getArString("Dungeon.Boss_Troop");//"Fought";
		if( backLine.mystyle.normal.background == null )
		{
			backLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		}
		troopList.Init(troopItem);

		rewardList.Init(rewardItem);

	}
	
	public function resetLayout()
	{
		repeatTimes = (frameRect.height - 15) / UI_BG_WOOD_WEN_HEIGHT;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		frameSimpleLabel.rect.x = frameRect.x;
		frameSimpleLabel.rect.y = frameRect.y;
		frameSimpleLabel.rect.width = frameRect.width;
		frameSimpleLabel.rect.height = frameRect.height - 3;
	}
	
	protected function DrawBackground()
	{	
		if(Event.current.type != EventType.Repaint)
			return;
			
		GUI.BeginGroup(frameRect);
			backImage.rect = Rect(13, 13, frameRect.width-26, frameRect.height-26);
			backImage.Draw();
//			Graphics.DrawTexture(Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
			//GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
			//GUI.DrawTextureWithTexCoords(new Rect(frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
		frameSimpleLabel.Draw();

		GUI.BeginGroup(headRect);
			bossBack.Draw();
		GUI.EndGroup();
		topLoop.Draw();
		
		if(isBossIconGray)
		{
			var oldColor : Color = GUI.color;
			GUI.color = new Color(0.4f, 0.4f, 0.4f, 1f);
			bossIcon.Draw();
			GUI.color = oldColor;
		}
		else
		{
			bossIcon.Draw();
		}		
		
		leftTopImg.Draw();
		leftBottomImg.Draw();
		rightTopImg.Draw();
		rightBottomImg.Draw();		
		needEnergy.Draw();	
	}
	
	public function DrawItem()
	{	
		line.Draw();
		leftMiddleImg.Draw();
		rightMiddleImg.Draw();
		bossLeftTime.Draw();
		bossName.Draw();

		blackStar1.Draw();
		blackStar2.Draw();
		blackStar3.Draw();
		
		star1.Draw();
		star2.Draw();
		star3.Draw();
		score.Draw();

		healthFrame.Draw();
		health.Draw();
		might.Draw();
		mightTxt.Draw();
		roundBack.Draw();
		levelTxt.Draw();
		bossDesc.Draw();
		infoBtn.Draw();
		leftBtn.Draw();
		rightBtn.Draw();
		pageNum.Draw();
		dialogBtn.Draw();
		
		attackBtn.Draw();
		winTimes.Draw();
		btnClose.Draw();
		
		rewardList.Draw();
		
		marchFrame.Draw();
		march.Draw();
		timeIcon.Draw();
		timeText.Draw();

		speedupBtn.Draw();
		
		allianceBossToolbar.Draw();
		backLine.Draw();
		troops.Draw();
		fought.Draw();
		troopList.Draw();
		verifyLeftTime.Draw();
	}
	
	function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		SoundMgr.instance().PlayEffect("kbn_pve_levelinterface", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		UpdateBossMenu(param);
		
		if ((levelID + 1) % 5 == 0 || bossData!= null && bossData.type != Constant.PveType.NORMAL && bossData.type != Constant.PveType.ELITE)
		{
			GameMain.instance().PlayMusic("PVE Boss Level",TextureType.AUDIO_PVE);
		}
	}
	
	private function UpdateBossMenu(param:Object)
	{
		SetVisible(false,false,false,false,false,false,false,false,false,false,false,false);
		
		var hash:HashObject = param as HashObject;
		if(hash == null)return;
		levelID = _Global.INT32(hash["levelID"]);
		isHIdeBossInfo = _Global.INT32(hash["isHIdeBossInfo"]);
		isAllianceBoss = _Global.INT32(hash["isAllianceBoss"]);

		bossData = KBN.PveController.instance().GetPveLevelInfo(levelID) as KBN.PveLevelInfo;//levelid
		marchData = KBN.PveController.instance().GetPveMarchInfo() as KBN.PveMarchData;

		if (bossData == null || marchData == null) return;
		
		var totalData : KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo() as KBN.PveTotalData;
		if(totalData.isNew)
		{
			needEnergy.setBackground("newStamina",TextureType.ICON);
		}
		else
		{
			needEnergy.setBackground("stamina",TextureType.ICON);
		}
		
		//so wo do not need to store levelid in boss menu
		KBN.PveController.instance().curSelecteLevelID = levelID;
		
		getMenuType();
		
		bossName.txt = Datas.getArString(bossData.bossName);
		var mightNum:long = TroopMgr.instance().GetLevelMight(levelID);
		might.txt = Datas.getArString("Campaign.Level_BossMight");
		mightTxt.txt = _Global.NumSimlify(mightNum)+"";
		score.txt = String.Format(Datas.getArString("Campaign.LevelScore"), bossData.score);
		levelTxt.txt = bossData.bossLevel+"";
		bossDesc.txt = Datas.getArString(bossData.desc);
		
		bossLeftTime.txt = "";
		
		needEnergy.txt = "-"+bossData.enery;
		
		var tex:Texture2D = TextureMgr.instance().LoadTexture(bossData.bossIcon,TextureType.PVEBOSS);
		if(tex == null)
			bossIcon.setBackground("potrait_NoPic",TextureType.PVEBOSS);
		else
			bossIcon.setBackground(bossData.bossIcon,TextureType.PVEBOSS);
			
		bossBack.setBackground(bossData.bossBackImg,TextureType.PVEBOSS);

		var listItem:System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
		for(var i:int = 0; i<bossData.itemIDList.Count; i++)
		{
			var temData:Hashtable = new Hashtable();
			temData.Add("type", 1);
			temData.Add("itemID", bossData.itemIDList[i]);
			temData.Add("itemNum", 1);
			listItem.Add(temData);
		}
		var headData:Hashtable = new Hashtable();
		headData.Add("type", 0);
		listItem.Insert( 0, headData ); // Insert a "resource loot head" in the list
		rewardList.rect.y = 514;
		rewardList.rect.height = 277;
		rewardList.Init(rewardItem);
		rewardList.SetData(listItem.ToArray());
		
		leftMiddleImg.rect.height = 60;
		rightMiddleImg.rect.height = 60;
		line.rect.y = 498;
		bossDesc.SetVisible(true);
		rewardList.SetVisible(true);
		
		rewardList.UpdateData();
		rewardList.ResetPos();
		
		allianceBossToolbar.SetVisible(false);
		troops.SetVisible(false);
		fought.SetVisible(false);
		backLine.SetVisible(false);
		switch(menuType)
		{
		case Menu_Type.MENU_TYPE_ALLIANCEBOSS:
			SetVisible(false,false,false,false,false,true,false,false,false,false,false,false);
			var curHp:float = _Global.FLOAT(hash["curHp"]);
			health.SetCurValue(curHp);
			bossLeftTime.SetVisible(false);
			bossDesc.SetVisible(false);
			leftMiddleImg.rect.height = 18;
			rightMiddleImg.rect.height = 18;
			rewardList.Clear();
			rewardList.rect.y = 463;
			rewardList.rect.height = 328;
			rewardList.Init(rewardItem);
			rewardList.SetData(listItem.ToArray());
			line.rect.y = 442;
			blackStar1.SetVisible(false);
			blackStar2.SetVisible(false);
			blackStar3.SetVisible(false);
			allianceBossToolbar.SetVisible(true);
			var factor:int = _Global.INT32(hash["factor"]);
			rewardList.ForEachItem(
				function (_itemList:ListItem)
				{
					var itemList:BossRewardItem = _itemList as BossRewardItem;
					itemList.RefreshData(factor/100f);
				}
			);
			mightTxt.txt = _Global.NumSimlify(mightNum*factor/100)+"";
			levelTxt.txt = bossData.bossLevel*factor/100+"";
			var listBossTroop:System.Collections.Generic.List.<KBN.BossTroopInfo> = KBN.PveController.instance().GetBossTroopInfo(levelID,factor) as System.Collections.Generic.List.<KBN.BossTroopInfo>;
			troopList.Clear();
			troopList.SetData(listBossTroop.ToArray());
			rewardList.UpdateData();
			rewardList.ResetPos();
			SelectTab(0);
			var canAttack:int = _Global.INT32(hash["canAttack"]);
			if(canAttack == 1)
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
			break;
		case Menu_Type.MENU_TYPE_BOSS_INFO:
			SetVisible(false,false,false,false,false,false,true,true,true,false,false,false);
			
			InitHidenBoss();
			break;
		case Menu_Type.MENU_TYPE_ATTACK_WITHOUT_SCORE:
			SetVisible(false,false,false,true,false,true,false,false,false,false,false,true);
			attackBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			attackBtn.SetNormalTxtColor(FontColor.Button_White);
			attackBtn.SetDisabled(false);
			break;
		case Menu_Type.MENU_TYPE_ATTACK_WHITH_SCORE:
			SetVisible(true,true,true,true,true,true,false,false,false,false,false,true);
			attackBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			attackBtn.SetNormalTxtColor(FontColor.Button_White);
			attackBtn.SetDisabled(false);
			break;
		case Menu_Type.MENU_TYPE_IN_ATTACK:
			SetVisible(true,true,true,true,false,false,false,false,false,true,true,false);
			var curNum:float = GameMain.instance().unixtime() - marchData.marchTime;
			var maxNum:float = marchData.marchEndTime - marchData.marchTime;
			march.SetCurValue(curNum/maxNum);
			break;
		case Menu_Type.MENU_TYPE_ANOTHER:
			SetVisible(true,true,true,true,false,true,false,false,false,false,false,false);
			
			attackBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			attackBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			attackBtn.SetDisabled(true);
			break;
			
			
		default:
			SetVisible(true,true,true,true,true,true,true,true,true,true,true,true);
		}
			
		if(bossData.maxAttackTimes > 0 && bossData.curAttackTimes >= bossData.maxAttackTimes)
		{
			attackBtn.changeToGreyNew();
		}	
		UpdateBossLeftTime();
		UpdateWinTimes();
	}
	
	private function UpdateWinTimes()
	{
		if(bossData.type != Constant.PveType.ELITE)
		{
			winTimes.SetVisible(false);
		}
		else
		{
			winTimes.SetVisible(true);
			if(bossData.curAttackTimes >= bossData.maxAttackTimes)
			{
				winTimes.SetNormalTxtColor(FontColor.Red);
			}
			else
			{
				winTimes.SetNormalTxtColor(FontColor.Title);
			}
			winTimes.txt = String.Format(Datas.getArString("Campaign.Encouragement_ChallengeChance"),bossData.curAttackTimes,bossData.maxAttackTimes);
		}
	}
	
	private function SetVisible(param1:boolean,param2:boolean,param3:boolean,param4:boolean,param5:boolean,param6:boolean,
		param7:boolean,param8:boolean,param9:boolean,param10:boolean,param11:boolean,param12:boolean)
	{
		if(bossData!=null && (bossData.type == Constant.PveType.NORMAL || bossData.type == Constant.PveType.ELITE))
		{
			star1.SetVisible(param1?bossData.star>=1:false);
			star2.SetVisible(param2?bossData.star>=2:false);
			star3.SetVisible(param3?bossData.star>=3:false);
			blackStar1.SetVisible(true);
			blackStar2.SetVisible(true);
			blackStar3.SetVisible(true);
			score.SetVisible(param4);
			var levelData:KBN.PveLevelData = KBN.PveController.instance().FindLeveData(levelID) as KBN.PveLevelData;
			if(levelData!=null && levelData.highestScore>0)
				infoBtn.SetVisible(true);
			else
				infoBtn.SetVisible(false);
			dialogBtn.SetVisible(bossData.startStoryID>0);
			
			health.SetVisible(false);
			healthFrame.rect = healthFrameRect1;
			might.rect = mightRect1;
			mightTxt.rect = mightNumRect1;
		}
		else
		{
			star1.SetVisible(false);
			star2.SetVisible(false);
			star3.SetVisible(false);
			blackStar1.SetVisible(false);
			blackStar2.SetVisible(false);
			blackStar3.SetVisible(false);
			score.SetVisible(false);
			infoBtn.SetVisible(false);
			dialogBtn.SetVisible(false);
			
			if(isHIdeBossInfo == 0)
			{
				healthFrame.rect = healthFrameRect2;
				might.rect = mightRect2;
				mightTxt.rect = mightNumRect2;
				health.SetVisible(true);
			}
			else
			{
				healthFrame.rect = healthFrameRect1;
				might.rect = mightRect1;
				mightTxt.rect = mightNumRect1;
				health.SetVisible(false);
			}
		}
		
		attackBtn.SetVisible(param6);
		leftBtn.SetVisible(param7);
		rightBtn.SetVisible(param8);
		pageNum.SetVisible(param9);
		march.SetVisible(param10);
		timeIcon.SetVisible(param10);
		timeText.SetVisible(param10);
		marchFrame.SetVisible(param10);
		speedupBtn.SetVisible(param11);
		
		needEnergy.SetVisible(param12);
		
		
		var curChapterID:int = levelID/1000000;
		var hidenData:KBN.HidenBossInfo = KBN.PveController.instance().GetHidenBossItemData(curChapterID) as KBN.HidenBossInfo;
		if(isHIdeBossInfo == 0 && hidenData != null && bossData!=null && bossData.type != Constant.PveType.NORMAL && bossData.type != Constant.PveType.ELITE)//event boss or hiden boss
		{
			bossLeftTime.SetVisible(true);
			var totalNum:float = hidenData.totalHP;
			var curNum:float = hidenData.curHP;
			if(totalNum==0)totalNum=1;
			health.SetCurValue(curNum/totalNum);
			mightTxt.txt = _Global.NumSimlify(hidenData.curHP)+"";
		}
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		rewardList.Clear();
		troopList.Clear();
		
		if((levelID+1)%5 == 0 || (bossData.type != Constant.PveType.NORMAL && bossData.type != Constant.PveType.ELITE))
		{
			GameMain.instance().RefreshSceneMusic();
		}
	}
	
	public function Update()
	{
		if(menuType == Menu_Type.MENU_TYPE_IN_ATTACK)
		{
			var curNum:float = GameMain.instance().unixtime() - marchData.marchTime;
			var maxNum:float = marchData.marchEndTime - marchData.marchTime;
			march.SetCurValue(curNum/maxNum);
			var leftTime:long = marchData.marchEndTime - GameMain.instance().unixtime();
			
			timeText.txt = _Global.timeFormatStrPlus(leftTime);
		}
		rewardList.Update();
		troopList.Update();
			
		UpdateBossLeftTime();	
		
		UpdateVerifyTime();
	}
	function UpdateVerifyTime(){
		var time:int=KBN.PveController.instance().VerifyStatusLeftTime-GameMain.unixtime();

		if(time<=0){
			time=0;
			verifyLeftTime.SetVisible(false);
			attackBtn.txt = Datas.getArString("Common.Attack");
		}else{
			verifyLeftTime.SetVisible(true);
			verifyLeftTime.txt = Datas.getArString("PVE.Verification_LimitTime",[_Global.timeFormatStrPlus(time)]);
			attackBtn.txt = "";
		}
		
	}
	
	function UpdateBossLeftTime()
	{
		var curChapterID:int = levelID/1000000;
			
		var hidenData:KBN.HidenBossInfo = KBN.PveController.instance().GetHidenBossItemData(curChapterID) as KBN.HidenBossInfo;
		if(isHIdeBossInfo == 0 && hidenData != null && bossData.type != Constant.PveType.NORMAL && bossData.type != Constant.PveType.ELITE)//event boss or hiden boss
		{
			var curTime:long = GameMain.unixtime();
			var hideBossLeftTime:long = hidenData.endTime - curTime;
			if(bossData.type == Constant.PveType.SOURCEBOSS)
			{
				if(hideBossLeftTime <= 0)
				{
					var activeDuration : int = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetChapterActiveDuration(curChapterID);
					var activehour : int = activeDuration / 3600;
					bossLeftTime.txt = String.Format(Datas.getArString("Campaign.RecouseBoss_Text1"), activehour);
					isBossIconGray = false;
					attackBtn.SetDisabled(false);
					attackBtn.changeToBlueNew();
				}
				else
				{
					isBossIconGray = true;
					bossLeftTime.txt = String.Format(Datas.getArString("Campaign.Level_CountDownTime"), _Global.timeFormatShortStrEx(hideBossLeftTime,false));
					attackBtn.SetDisabled(true);
					attackBtn.changeToGreyNew();
				}
			}
			else
			{
				if(hideBossLeftTime <= 0)
					MenuMgr.getInstance().PopMenu("BossMenu");
				attackBtn.SetDisabled(false);
				attackBtn.changeToBlueNew();
				bossLeftTime.txt = String.Format(Datas.getArString("Campaign.Level_CountDownTime"), _Global.timeFormatShortStrEx(hideBossLeftTime,false));
			}
		}
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		mask.Draw();
		GUI.color = oldColor;
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("BossMenu");
	}
	
	function getMenuType()
	{	
		if(isHIdeBossInfo != 0)
			menuType = Menu_Type.MENU_TYPE_BOSS_INFO;
		else if(isAllianceBoss > 0)
			menuType = Menu_Type.MENU_TYPE_ALLIANCEBOSS;
		else
		{	
			if(marchData.levelID > 0)
			{
				if(marchData.levelID == levelID)
					menuType = Menu_Type.MENU_TYPE_IN_ATTACK;
				else
					menuType = Menu_Type.MENU_TYPE_ANOTHER;
			}
			else
			{
				if(bossData.score <= 0)
					menuType = Menu_Type.MENU_TYPE_ATTACK_WITHOUT_SCORE;
				else
					menuType = Menu_Type.MENU_TYPE_ATTACK_WHITH_SCORE;
			}
		}
	}
	
	function OnClickAttack()
	{
		// var verifyStatus:PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus =KBN.PveController.instance().VerifyStatus;
		// if(verifyStatus==null)
		// 	return;
		// if (verifyStatus.status==1)  //普通战斗
		// {
			if(!KBN.PveController.instance().CheckStamina(levelID))
			{
				MenuMgr.getInstance().PushMenu("RefillStaminaMenu",null,"trans_zoomComp" );
				return;
			}
			handleBack();
			if(Menu_Type.MENU_TYPE_ALLIANCEBOSS == menuType){

				//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":-1, "y":-1, "type":Constant.MarchType.ALLIANCEBOSS},"trans_zoomComp" );
				MarchDataManager.instance().SetData({"x":-1, "y":-1, "type":Constant.MarchType.ALLIANCEBOSS});
			}
			else{
				//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":-1, "y":-1, "type":Constant.MarchType.PVE},"trans_zoomComp" );
				MarchDataManager.instance().SetData({"x":-1, "y":-1, "type":Constant.MarchType.PVE});
			}
		// }
		// else if (verifyStatus.status==2)   //验证
		// {
		// 	handleBack();
		// 	KBN.PveController.instance().Verify();
		// }else if (verifyStatus.status==3)   //等待验证，倒计时
		// {
		// 	handleBack();
		// 	KBN.PveController.instance().WaitVerify();
		// }
	}
	
	function handleClickDialog()
	{
		if(bossData.startStoryID > 0)
		{
			var hash:HashObject = new HashObject({"storyID":bossData.startStoryID,"heroID":0,"chapterID":0});
			MenuMgr.getInstance().PushMenu("StoryMenu",hash,"trans_immediate" );
		}
	}
	
	function handleClickInfo()
	{
		var hash:HashObject = new HashObject({"levelID":bossData.levelID});
		MenuMgr.getInstance().PushMenu("ReportMenu",hash,"trans_zoomComp" );
	}
	
	function OnClickLeft()
	{
		if(hidenBossData==null)return;
		if(hidenBossData.curHidenBossIndex<=1)
		{
			return;
		}
		var hidenBossDictionary:System.Collections.Generic.Dictionary.<int, KBN.HidenBossInfo> = KBN.PveController.instance().GetHidenBossList() as System.Collections.Generic.Dictionary.<int, KBN.HidenBossInfo>;
		var hash:HashObject = new HashObject({"levelID":hidenBossDictionary[hidenBossData.lastChapterID].lastLevelID, "isHIdeBossInfo":1});
		UpdateBossMenu(hash);
	}
	
	function OnClickRight()
	{
		if(hidenBossData==null)return;
		if(hidenBossData.curHidenBossIndex>=hidenBossData.unlockHidenBossNum)
		{
			return;
		}
		var hidenBossDictionary:System.Collections.Generic.Dictionary.<int, KBN.HidenBossInfo> = KBN.PveController.instance().GetHidenBossList() as System.Collections.Generic.Dictionary.<int, KBN.HidenBossInfo>;
		var hash:HashObject = new HashObject({"levelID":hidenBossDictionary[hidenBossData.nextChapterID].lastLevelID, "isHIdeBossInfo":1});
		UpdateBossMenu(hash);
	}
	
	function OnClickSpeedUp()
	{
		MenuMgr.getInstance().PopMenu("BossMenu");
		var queItem:MarchVO = March.instance().getPveQueItem();
		
		MenuMgr.getInstance().PushMenu("SpeedUpMenu",queItem, "trans_zoomComp");	
	}
	
	private function InitHidenBoss()
	{
		var curChapterID:int = levelID/1000000;
		hidenBossData = KBN.PveController.instance().GetHidenBossUiInfo(curChapterID);
		
		pageNum.txt = hidenBossData.curHidenBossIndex+"/"+hidenBossData.unlockHidenBossNum;
	}
	
	public function SelectTab(index:int)
	{
		if(index == 0)
		{
			rewardList.SetVisible(true);
			troops.SetVisible(false);
			fought.SetVisible(false);
			backLine.SetVisible(false);
			troopList.SetVisible(false);
		}
		else if(index == 1)
		{
			rewardList.SetVisible(false);
			troops.SetVisible(true);
			fought.SetVisible(true);
			backLine.SetVisible(true);
			troopList.SetVisible(true);
		}
	}
}