class PveResultMenu extends KBNMenu
{
	@Space(30) @Header("---------- PveResultMenu ----------") 


	@SerializeField private var shake:Shake;
	enum MENU_STATE
	{
		NONE,
		BTN_BLOW_UP,
		FLOWER_BLOW_UP,
		SCORE_TRANS,
		CUP_BLOW_UP,
		STAR1,
		STAR2,
		STAR3
	};
	
	class StateNode
	{
		function StateNode(_curState:MENU_STATE, _nextState:MENU_STATE, _initFuncton:Function, 
			_overFunction:Function, _uiObj:PveMenuState, _additionalFuncton:Function, _canDoFuncton:Function)
		{
			curState = _curState;
			nextState = _nextState;
			initFuncton = _initFuncton;
			overFunction = _overFunction;
			uiObj = _uiObj;
			additionalFuncton = _additionalFuncton;
			canDoFuncton = _canDoFuncton;
		}
		
		var curState:MENU_STATE;
		var nextState:MENU_STATE;
		var initFuncton:Function;
		var overFunction:Function;
		var uiObj:PveMenuState;
		var additionalFuncton:Function;
		var canDoFuncton:Function;
	}
	var curMenuState:MENU_STATE;
	var stateDictionary:System.Collections.Generic.Dictionary.<MENU_STATE, StateNode> = new System.Collections.Generic.Dictionary.<MENU_STATE, StateNode>();
	
	enum Menu_Type
	{
		MENU_TYPE_WIN,
		MENU_TYPE_NEW_RECORD,
		MENU_TYPE_LOST
	};
	
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	@SerializeField private var frameRect:Rect;
	
	@SerializeField private var menuType :Menu_Type;
	
	//background begin
	@SerializeField private var leftTopImg :Label;
	@SerializeField private var leftBottomImg :Label;
	
	@SerializeField private var rightTopImg :Label;
	@SerializeField private var rightBottomImg :Label;
	
	@SerializeField private var flowerL :BlowUpLabel;
	@SerializeField private var flowerR :BlowUpLabel;
	
	@SerializeField private var mask:SimpleLabel;
	
	//background end

	@SerializeField private var star1 :PveResultStar;
	@SerializeField private var star2 :PveResultStar;
	@SerializeField private var star3 :PveResultStar;
	
	@SerializeField private var backStar1 :SimpleLabel;
	@SerializeField private var backStar2 :SimpleLabel;
	@SerializeField private var backStar3 :SimpleLabel;
	
	@SerializeField private var score :TransNumLabel;
	@SerializeField private var headTilte :TransNumLabel;
	
	//reward begin
	@SerializeField private var reward :Label;
	@SerializeField private var money :Label;
	@SerializeField private var food :Label;
	@SerializeField private var wood :Label;
	@SerializeField private var stone :Label;
	@SerializeField private var ore :Label;
	
	@SerializeField private var moneyTxt :Label;
	@SerializeField private var foodTxt :Label;
	@SerializeField private var woodTxt :Label;
	@SerializeField private var stoneTxt :Label;
	@SerializeField private var oreTxt :Label;
	
	@SerializeField private var noReward :Label;
	@SerializeField private var noReward2 :Label;
	//reward end
	
	//chance to find begin
	@SerializeField private var rewardList:ScrollList;
	@SerializeField private var rewardItem:ListItem;
	//chance to find end
	
	@SerializeField private var okBtn :BlowUpButton;
	@SerializeField private var cupIcon :PveCup;
	
	private var resultData:KBN.PveResultData;
	
	@SerializeField private var frameSimpleLabel:SimpleLabel;
	@SerializeField private var backImage:SimpleLabel;
	@SerializeField private var headImage:SimpleLabel;
	@SerializeField private var line:SimpleLabel;
	@SerializeField private var myColor:Color = new Color();
	
	@SerializeField private var lightBackTop:Label;
	@SerializeField private var rotateSpeed:float;
	
	@SerializeField private var headTilteRect1:Rect;
	@SerializeField private var headTilteRect2:Rect;
	private var m_rotate:Rotate;
	
	@SerializeField private var tipsMoreStar :Label;
	@SerializeField private var tipsMoreStarIcon :Button;
	@SerializeField private var tipsMoreStarBack :SimpleLabel;
	
	@SerializeField private var allianceBossTime :SimpleLabel;
	@SerializeField private var allianceBossFailTips1 :SimpleLabel;
	@SerializeField private var allianceBossFailTips2 :SimpleLabel;
	@SerializeField private var allianceBossWinTips :SimpleLabel;
	private var isAllianceBoss:boolean = false;
	
	public function Init()
	{
		shake.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();

		rewardList.Init(rewardItem);
		okBtn.Init();
		okBtn.OnClick = handleBack;
		okBtn.txt = Datas.getArString("Common.OK_Button");//"OK";
		okBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		//back
		flowerL.Init();
		flowerR.Init();
		flowerL.setBackground("trumpet",TextureType.DECORATION);
		flowerR.setBackground("trumpet",TextureType.DECORATION);
		
		if(mask.mystyle.normal.background == null)
		{
			mask.mystyle.normal.background = texMgr.LoadTexture("square_black",TextureType.BACKGROUND);
		}
		
		reward.txt = Datas.getArString("Campaign.ReportSubTitle");//"Rewards";
		
		money.setBackground("resource_Gold_icon",TextureType.ICON);
		food.setBackground("resource_Food_icon",TextureType.ICON);
		wood.setBackground("resource_Wood_icon",TextureType.ICON);
		stone.setBackground("resource_Stone_icon",TextureType.ICON);
		ore.setBackground("resource_Ore_icon",TextureType.ICON);

		cupIcon.Init();
		cupIcon.setBackground("cup_new-record",TextureType.DECORATION);
		
		frameSimpleLabel.Sys_Constructor();
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		
		if(backImage.mystyle.normal.background == null)
		{
			backImage.mystyle.normal.background = texMgr.LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}

		if(line.mystyle.normal.background == null)
		{
			line.mystyle.normal.background = texMgr.LoadTexture("between line",TextureType.DECORATION);
		}
		
		if(headImage.mystyle.normal.background == null)
		{
			headImage.mystyle.normal.background = texMgr.LoadTexture("win-flag",TextureType.DECORATION);
		}
		
		if( backStar1.mystyle.normal.background == null )
		{
			backStar1.mystyle.normal.background = texMgr.LoadTexture("win-blackstar",TextureType.ICON);
		}
		
		if( backStar2.mystyle.normal.background == null )
		{
			backStar2.mystyle.normal.background = texMgr.LoadTexture("win-blackstar",TextureType.ICON);
		}

		if( backStar3.mystyle.normal.background == null )
		{
			backStar3.mystyle.normal.background = texMgr.LoadTexture("win-blackstar",TextureType.ICON);
		}
		allianceBossTime.mystyle.normal.background = texMgr.LoadTexture("Decorative_strips2",TextureType.DECORATION);

		leftTopImg.setBackground("win-top",TextureType.DECORATION);
		leftBottomImg.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
			
		rightTopImg.setBackground("win-top",TextureType.DECORATION);
		rightBottomImg.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
		
		star1.Init("tongyongbaopo000",7);
		star2.Init("tongyongbaopo000",7);
		star3.Init("tongyongbaopo000",7);
		star1.setBackground("BIGstar",TextureType.ICON);
		star2.setBackground("BIGstar",TextureType.ICON);
		star3.setBackground("BIGstar",TextureType.ICON);
		
		marginT = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		
		lightBackTop.setBackground("payment_light",TextureType.DECORATION);
		m_rotate = new Rotate();
		m_rotate.init(lightBackTop,EffectConstant.RotateType.LOOP,Rotate.RotateDirection.CLOCKWISE,0.0f,0.0f);
		m_rotate.playEffect();
		
		tipsMoreStar.txt = Datas.getArString("Campaign.Report_Tip");//"With fewer troops can get more stars";
		var _size:Vector2 = tipsMoreStar.mystyle.CalcSize(GUIContent(tipsMoreStar.txt));
		tipsMoreStarIcon.mystyle.normal.background = texMgr.LoadTexture("infor_icon", TextureType.DECORATION);
		tipsMoreStarIcon.mystyle.active.background = texMgr.LoadTexture("infor_icon", TextureType.DECORATION);
		tipsMoreStarIcon.rect.x = (640 - _size.x)/2 - 40;
		tipsMoreStarIcon.OnClick = TipsMoreStarOnClick;
		tipsMoreStarBack.setBackground("Brown_Gradients2",TextureType.DECORATION);
		var RectX:int = tipsMoreStarIcon.rect.x + 30;
		if(RectX<0)RectX=0;
		tipsMoreStarBack.rect.x = RectX;
		tipsMoreStarBack.rect.width = 640 - 2*RectX;
		
		resetLayout();
	}
	
	private function initNormalStateDictionary()
	{
		//menu state begin
		curMenuState = MENU_STATE.NONE;
		stateDictionary.Clear();
//		stateDictionary.Add(MENU_STATE					,new StateNode(curState						, nextState						, initFuncton		, overFunction		, uiObj		, additionalFuncton		, _canDoFuncton			));
		stateDictionary.Add(MENU_STATE.FLOWER_BLOW_UP	,new StateNode(MENU_STATE.FLOWER_BLOW_UP	, MENU_STATE.STAR1				, flowerL.Begin		, OnMenuStateOver	, flowerL	, FlowerRBegin			, CanDoFlowerBlowUp		));
		stateDictionary.Add(MENU_STATE.STAR1			,new StateNode(MENU_STATE.STAR1				, MENU_STATE.STAR2				, star1.Begin		, OnPveStarOver		, star1		, null					, CanDoStar1			));
		stateDictionary.Add(MENU_STATE.STAR2			,new StateNode(MENU_STATE.STAR2				, MENU_STATE.STAR3				, star2.Begin		, OnPveStarOver		, star2		, null					, CanDoStar2			));
		stateDictionary.Add(MENU_STATE.STAR3			,new StateNode(MENU_STATE.STAR3				, MENU_STATE.SCORE_TRANS		, star3.Begin		, OnPveStarOver		, star3		, null					, CanDoStar3			));
		stateDictionary.Add(MENU_STATE.SCORE_TRANS		,new StateNode(MENU_STATE.SCORE_TRANS		, MENU_STATE.CUP_BLOW_UP		, score.Begin		, OnMenuStateOver	, score		, TitleBegin			, CanDoScoreTrans		));
		stateDictionary.Add(MENU_STATE.CUP_BLOW_UP		,new StateNode(MENU_STATE.CUP_BLOW_UP		, MENU_STATE.BTN_BLOW_UP		, cupIcon.Begin		, OnMenuStateOver	, cupIcon	, null					, CanDoCupBlowUp		));
		stateDictionary.Add(MENU_STATE.BTN_BLOW_UP		,new StateNode(MENU_STATE.BTN_BLOW_UP		, MENU_STATE.NONE				, okBtn.Begin		, OnMenuStateOver	, okBtn		, null					, CanDoBtnBlowUp		));
	
	}
	
	private function initHidenBossStateDictionary()
	{
		//menu state begin
		curMenuState = MENU_STATE.NONE;
		stateDictionary.Clear();
//		stateDictionary.Add(MENU_STATE					,new StateNode(curState						, nextState						, initFuncton		, overFunction		, uiObj		, additionalFuncton		, _canDoFuncton			));
		stateDictionary.Add(MENU_STATE.FLOWER_BLOW_UP	,new StateNode(MENU_STATE.FLOWER_BLOW_UP	, MENU_STATE.BTN_BLOW_UP		, flowerL.Begin		, OnMenuStateOver	, flowerL	, FlowerRBegin			, CanDoFlowerBlowUp		));
		stateDictionary.Add(MENU_STATE.BTN_BLOW_UP		,new StateNode(MENU_STATE.BTN_BLOW_UP		, MENU_STATE.NONE				, okBtn.Begin		, OnMenuStateOver	, okBtn		, null					, CanDoBtnBlowUp		));
	
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
		if(menuType != Menu_Type.MENU_TYPE_LOST)
			m_rotate.drawItems();
		
		shake.ShakeMatrixBegin();
		
		GUI.BeginGroup(frameRect);
			backImage.rect = Rect(13, 13, frameRect.width-26, frameRect.height-26);
			backImage.Draw();
//			Graphics.DrawTexture(Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
			GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
			GUI.DrawTextureWithTexCoords(new Rect(frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
		frameSimpleLabel.Draw();
		
		leftTopImg.Draw();
		leftBottomImg.Draw();
		
		rightTopImg.Draw();
		rightBottomImg.Draw();
		
		var oldColor:Color = GUI.color;
		if(menuType == Menu_Type.MENU_TYPE_LOST)
			GUI.color = myColor;
		flowerL.Draw();
		flowerR.Draw();
		headImage.Draw();
		GUI.color = oldColor;
		
		shake.ShakeMatrixEnd();
	}
	
	public function DrawItem()
	{	
		shake.ShakeMatrixBegin();
		
		backStar1.Draw();
		backStar3.Draw();
		backStar2.Draw();
		
		star1.Draw();
		star2.Draw();
		star3.Draw();
		headTilte.Draw();
		score.Draw();
		
		reward.Draw();
		money.Draw();
		food.Draw();
		wood.Draw();
		stone.Draw();
		ore.Draw();
		
		moneyTxt.Draw();
		foodTxt.Draw();
		woodTxt.Draw();
		stoneTxt.Draw();
		oreTxt.Draw();
		noReward.Draw();
		noReward2.Draw();
		
		rewardList.Draw();
		rewardItem.Draw();
	
		okBtn.Draw();
		
		cupIcon.Draw();
		
		line.Draw();
		
		tipsMoreStarBack.Draw();
		tipsMoreStar.Draw();
		tipsMoreStarIcon.Draw();
		
		allianceBossTime.Draw();
		allianceBossFailTips1.Draw();
		allianceBossFailTips2.Draw();
		allianceBossWinTips.Draw();
		
		shake.ShakeMatrixEnd();
	}
	
	
	
	function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		isAllianceBoss = false;
		if(param as String == "alliance_boss")
		{
			AllianceBossResultPush();
			return;
		}
		ClearAllianceBossUI();
		resultData = KBN.PveController.instance().GetResultInfo() as KBN.PveResultData;
		if(resultData == null) return;
			
		GetMenuType();
		score.Init(Datas.getArString("Campaign.ReportScore"),0,resultData.score,"lizisankai_000",5);
		
		var tech : float = Technology.instance().getIncreaseNumOfResInCampaign();
		moneyTxt.txt = _Global.NumSimlify(resultData.gold * (1 + tech))+"";
		foodTxt.txt = _Global.NumSimlify(resultData.food * (1 + tech))+"";
		woodTxt.txt = _Global.NumSimlify(resultData.wood * (1 + tech))+"";
		stoneTxt.txt = _Global.NumSimlify(resultData.stone * (1 + tech))+"";
		oreTxt.txt = _Global.NumSimlify(resultData.ore * (1 + tech))+"";
		

		var tempDictionary:System.Collections.Generic.Dictionary.<int,int> = new System.Collections.Generic.Dictionary.<int,int>();
		for(var i:int = 0; i<resultData.itemList.Count; i++)
		{
			var itemID = resultData.itemList[i];
			if( tempDictionary.ContainsKey(itemID) )
			{
				tempDictionary[ itemID ] = tempDictionary[ itemID ] + 1;
			}
			else
			{
				tempDictionary.Add(itemID, 1);
			}
		}
		var listData:System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
		for( var item : System.Collections.Generic.KeyValuePair.<int, int> in tempDictionary )
		{
			var temData:Hashtable = new Hashtable();
			temData.Add("type", 1);
			temData.Add("itemID", item.Key);
			temData.Add("itemNum", item.Value);
			listData.Add(temData);
		}
		
		switch(menuType)
		{
		case Menu_Type.MENU_TYPE_WIN:
			headTilte.Init(Datas.getArString("Campaign.Report_Win"),-1,-1,"",0);
			headTilte.SetNormalTxtColor(FontColor.TabDown);
			
			star1.SetVisible(resultData.star>=1);
			star2.SetVisible(resultData.star>=2);
			star3.SetVisible(resultData.star>=3);
			
			rewardList.Clear();
			rewardList.SetData(listData.ToArray());
			rewardList.UpdateData();
			rewardList.ResetPos();
			
			SetItemsVisable(true);
			noReward.SetVisible(false);
			noReward2.SetVisible(false);
			cupIcon.SetVisible(false);
			line.SetVisible(true);
			break;
		case Menu_Type.MENU_TYPE_NEW_RECORD:
			headTilte.Init(Datas.getArString("Campaign.Report_Win"),-1,-1,"",0);
			headTilte.SetNormalTxtColor(FontColor.TabDown);
			
			star1.SetVisible(resultData.star>=1);
			star2.SetVisible(resultData.star>=2);
			star3.SetVisible(resultData.star>=3);
			
			rewardList.Clear();
			rewardList.SetData(listData.ToArray());
			rewardList.UpdateData();
			rewardList.ResetPos();
			
			SetItemsVisable(true);
			noReward.SetVisible(false);
			noReward2.SetVisible(false);
			cupIcon.SetVisible(true);
			line.SetVisible(true);
			break;
		case Menu_Type.MENU_TYPE_LOST:
			SoundMgr.instance().PlayEffect("kbn_pve_failed", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
			headTilte.Init(Datas.getArString("Campaign.Report_Lose"),-1,-1,"",0);
			headTilte.SetNormalTxtColor(FontColor.Sale_Gray);
			
			star1.SetVisible(resultData.star>=1);
			star2.SetVisible(resultData.star>=2);
			star3.SetVisible(resultData.star>=3);
			
			SetItemsVisable(false);
			noReward.SetVisible(true);
			noReward2.SetVisible(true);
			noReward.txt = "";//"You did not get an item this time.";
			noReward2.txt = Datas.getArString("Campaign.Report_LoseText");//Try things below to achieve victory:
			
			cupIcon.SetVisible(false);
			line.SetVisible(false);

			headTilte.DefaultShow();
			score.DefaultShow();
			okBtn.DefaultShow();
			break;
		default:
				break;
		}
		
		// beacause the require is changed...
		if(resultData.type == Constant.PveType.NORMAL || resultData.type == Constant.PveType.ELITE)
		{
			headTilte.rect = headTilteRect1;
			headTilte.SetFont(FontSize.Font_32);
			initNormalStateDictionary();
			score.SetVisible(true);
			backStar1.SetVisible(true);
			backStar2.SetVisible(true);
			backStar3.SetVisible(true);
		}
		else if(resultData.type == Constant.PveType.HIDDENBOSS || resultData.type == Constant.PveType.EVENTBOSS || resultData.type == Constant.PveType.SOURCEBOSS)
		{
			headTilte.rect = headTilteRect2;
			headTilte.SetFont(FontSize.Font_44);
			star1.SetVisible(false);
			star2.SetVisible(false);
			star3.SetVisible(false);
			score.SetVisible(false);
			cupIcon.SetVisible(false);
			backStar1.SetVisible(false);
			backStar2.SetVisible(false);
			backStar3.SetVisible(false);
			headTilte.NormalShow();

			initHidenBossStateDictionary();
		}
		
		tipsMoreStar.SetVisible(false);
		tipsMoreStarIcon.SetVisible(false);
		tipsMoreStarBack.SetVisible(false);
		if((resultData.type == Constant.PveType.NORMAL || resultData.type == Constant.PveType.ELITE) 
			&& resultData.star>=1 && resultData.star<3)
		{
			tipsMoreStar.SetVisible(true);
			tipsMoreStarIcon.SetVisible(true);
			tipsMoreStarBack.SetVisible(true);
		}
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		rewardList.Clear();
		tipsMoreStarIcon.mystyle.normal.background = null;
		tipsMoreStarIcon.mystyle.active.background = null;
		tipsMoreStarBack.mystyle.normal.background = null;
		
		okBtn.setNorAndActBG("none","none");
        flowerL.Background = null;
        flowerR.Background = null;
		mask.mystyle.normal.background = null;
        
        money.Background = null;
        food.Background = null;
        wood.Background = null;
        stone.Background = null;
        ore.Background = null;
        
        cupIcon.Background = null;
        
		frameSimpleLabel.mystyle.normal.background = null;
        
		backImage.mystyle.normal.background = null;

		line.mystyle.normal.background = null;

		headImage.mystyle.normal.background = null;
        
		backStar1.mystyle.normal.background = null;
        
		backStar2.mystyle.normal.background = null;

		backStar3.mystyle.normal.background = null;

        leftTopImg.Background = null;
        leftBottomImg.Background = null;
            
        rightTopImg.Background = null;
        rightBottomImg.Background = null;
        
        star1.Background = null;
        star2.Background = null;
        star3.Background = null;
        
        lightBackTop.Background = null;
        
        if(isAllianceBoss)
        {
        	if(menuType == Menu_Type.MENU_TYPE_WIN)
        		MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_OTHER_ATTACK,null);
        	else
        		MenuMgr.instance.sendNotification (Constant.Notice.PVE_UPDATE_MARCH_DATA,"updateAttackBtn");
        }
	}
	
	public function OnPop()
	{
		super.OnPop();
		if(!isAllianceBoss)
		{
			var levelData:KBN.PveLevelInfo = KBN.PveController.instance().GetPveLevelInfo(resultData.levelID) as KBN.PveLevelInfo;
			if(menuType ==Menu_Type.MENU_TYPE_LOST)
			{
				if(levelData.failStoryID > 0)
				{
					var hash:HashObject = new HashObject({"storyID":levelData.failStoryID,"heroID":0,"chapterID":0});
					MenuMgr.getInstance().PushMenu("StoryMenu",hash,"trans_immediate" );
				}
			}
			else 
			{
				if(resultData.isFirstWin)//the first
				{
					var chapterID:int = resultData.levelID/1000000;
					
					var lastLevelID:int = KBN.PveController.instance().GetLastLevelID(chapterID);
					if(lastLevelID != resultData.levelID || levelData.type != Constant.PveType.NORMAL && levelData.type!=Constant.PveType.ELITE)
						chapterID = 0;
					
					var flg:boolean = true;
					if(levelData.successStoryID>0)
					{
						var hash2:HashObject = new HashObject({"storyID":levelData.successStoryID,"heroID":resultData.unlockHeroID,"chapterID":chapterID,"isWin":true});
						MenuMgr.getInstance().PushMenu("StoryMenu",hash2,"trans_immediate" );
						flg = false;
					}
					else if(resultData.unlockHeroID>0)
					{
						var hash3:HashObject = new HashObject({"heroID":resultData.unlockHeroID,"chapterID":chapterID,"isWin":true});
						MenuMgr.getInstance().PushMenu("UnlockHeroMenu", hash3, "trans_zoomComp");
						flg = false;
					}
					else if(chapterID>0)//chapter
					{
						var hash4:HashObject = new HashObject({"chapterID":chapterID,"isWin":true});
						MenuMgr.getInstance().PushMenu("LevelupMenu", hash4, "trans_zoomComp");
						KBN.PveController.instance().PushUnlockEliteChapterMsg(chapterID);
						flg = false;
					}
					
					if(flg)
					{
						KBN.PveController.instance().CheckUnlockNext();
						GameMain.instance().onPveResultMenuPopUp();
					}
				}
				else
				{
					KBN.PveController.instance().CheckUnlockNext();
					GameMain.instance().onPveResultMenuPopUp();
				}
			}
		}
	}
	
	public function Update()
	{
		shake.Update();
		
		rewardList.Update();
		
		okBtn.Update();
		flowerR.Update();
		flowerL.Update();
		score.Update();
		headTilte.Update();
		cupIcon.Update();

		star1.Update();
		star3.Update();
		star2.Update();
		
		if(menuType != Menu_Type.MENU_TYPE_LOST)
		{
			m_rotate.rotateMultiple = rotateSpeed;
			m_rotate.updateEffect();
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
		MenuMgr.getInstance().PopMenu("PveResultMenu");
	}
	
	function getTestDate():Hashtable
	{
		var testData :Hashtable = 
		{
			"score":"5677299",
			"gold":-9999,
			"food":-9999,
			"wood":-9999,
			"stone":-9999,
			"ore":-9999
		};
		return testData;
	}
	
	function getTestListDate():System.Collections.ArrayList
	{
		var testDate1:Hashtable  = {
			"Icon":"BIGstar",
			"Desc1":"Divine Inspration",
			"Desc2":"Allows you upgrade a building from Lv.9 to Lv.10."
		};
		var testDate2:Hashtable  = {
			"Icon":"BIGstar",
			"Desc1":"Divine Inspration",
			"Desc2":"Allows you upgrade a building from Lv.9 to Lv.10."
		};	
		var testDate3:Hashtable  = {
			"Icon":"BIGstar",
			"Desc1":"Divine Inspration",
			"Desc2":"Allows you upgrade a building from Lv.9 to Lv.10."
		};	
		
		var array:System.Collections.ArrayList = new System.Collections.ArrayList();
		
		array.Add(testDate1);
		array.Add(testDate2);
		array.Add(testDate3);
		
		return array;
	}
	
	function SetItemsVisable(isVisable:boolean)
	{
		rewardList.SetVisible(isVisable);
		reward.SetVisible(isVisable);
		money.SetVisible(isVisable);
		food.SetVisible(isVisable);
		wood.SetVisible(isVisable);
		stone.SetVisible(isVisable);
		ore.SetVisible(isVisable);
		moneyTxt.SetVisible(isVisable);
		foodTxt.SetVisible(isVisable);
		woodTxt.SetVisible(isVisable);
		stoneTxt.SetVisible(isVisable);
		oreTxt.SetVisible(isVisable);
	}
	
	private function GetMenuType()
	{
		if(resultData.star <= 0){
			menuType = Menu_Type.MENU_TYPE_LOST;
		}
		else{
			if(resultData.isNewrecord)
				menuType = Menu_Type.MENU_TYPE_NEW_RECORD;
			else
				menuType = Menu_Type.MENU_TYPE_WIN;
		}
	}
	
	public function SetMenuState(_state:MENU_STATE)
	{
		curMenuState = _state;
		
		if(stateDictionary.ContainsKey(curMenuState))
		{
			var curStateNode:StateNode = stateDictionary[curMenuState] as StateNode;
			
			if(curStateNode.canDoFuncton!=null)
			{
				var canDo:boolean = curStateNode.canDoFuncton();
				if(!canDo)
				{
					OnMenuStateOver();
					return;
				}
			}
				
			curStateNode.initFuncton();
			
			if(curStateNode.additionalFuncton!=null)curStateNode.additionalFuncton();
			if(curStateNode.uiObj!=null)
			{
				curStateNode.uiObj.OverFuncton = curStateNode.overFunction;
			}
		}
	}
	
	public function MenuStateBegin()
	{
		SetMenuState(MENU_STATE.FLOWER_BLOW_UP);
	}
	
	public function OnMenuStateOver()
	{
		if(stateDictionary.ContainsKey(curMenuState))
		{
			var curStateNode:StateNode = stateDictionary[curMenuState] as StateNode;
			if(curStateNode.nextState != MENU_STATE.NONE)
			{
				SetMenuState(curStateNode.nextState);
			}
		}
	}
	private function FlowerRBegin()
	{
		flowerR.Begin();
		SoundMgr.instance().PlayEffect("kbn_pve_rewards", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
	}
	
	private function TitleBegin()
	{
		headTilte.Begin();
	}
	
	public function OnPveStarOver()
	{
		OnMenuStateOver();
		shake.Begin();
	}
	
	private function CanDoFlowerBlowUp():boolean
	{
		if(isAllianceBoss)
		{
			if(menuType == Menu_Type.MENU_TYPE_WIN)
				return true;
			return false;
		}
		if(resultData.star <= 0) return false;
		return true;
	}
	
	private function CanDoStar1():boolean
	{
		if(resultData.star <= 0) return false;
		return true;
	}
	
	private function CanDoStar2():boolean
	{
		if(resultData.star <= 1) return false;
		return true;
	}
	
	private function CanDoStar3():boolean
	{
		if(resultData.star <= 2) return false;
		return true;
	}
	
	private function CanDoScoreTrans():boolean
	{
		if(resultData.star <= 0) return false;
		return true;
	}
	
	private function CanDoCupBlowUp():boolean
	{
		if(resultData.star <= 0) return false;
		if(!resultData.isNewrecord) return false;
		return true;
	}
	
	private function CanDoBtnBlowUp():boolean
	{
		if(isAllianceBoss)
		{
			if(menuType == Menu_Type.MENU_TYPE_WIN)
				return true;
			return false;
		}
		if(resultData.star <= 0) return false;
		return true;
	}
	
	public function OnFadeinEnd()
	{
		if(menuType != Menu_Type.MENU_TYPE_LOST)
			MenuStateBegin();
	}
	
	private function SetStarsOriginMatrix()
	{
		star1.SetOriginMatrix();
		star2.SetOriginMatrix();
		star3.SetOriginMatrix();
	}
	
	private function TipsMoreStarOnClick()
	{
		MenuMgr.getInstance().PushMenu("PveRuleSmallMenu",null,"trans_zoomComp" );
	}
	
	private function ClearAllianceBossUI()
	{
		allianceBossTime.SetVisible(false);
		allianceBossFailTips1.SetVisible(false);
		allianceBossFailTips2.SetVisible(false);
		allianceBossWinTips.SetVisible(false);
	}
	
	private function AllianceBossResultPush()
	{
		isAllianceBoss = true;
		resultData = null;
		score.Init(Datas.getArString("Dungeon.Report_SubTitle"),KBN.AllianceBossController.instance().curDamage,KBN.AllianceBossController.instance().curDamage,"lizisankai_000",5);
		
		headTilte.rect = headTilteRect2;
		headTilte.SetFont(FontSize.Font_44);
		star1.SetVisible(false);
		star2.SetVisible(false);
		star3.SetVisible(false);
		score.DefaultShow();
		score.SetVisible(true);
		cupIcon.SetVisible(false);
		backStar1.SetVisible(false);
		backStar2.SetVisible(false);
		backStar3.SetVisible(false);
		tipsMoreStarIcon.SetVisible(false);
		tipsMoreStarBack.SetVisible(false);
		tipsMoreStar.SetVisible(false);
		if(KBN.AllianceBossController.instance().IsFail())
		{
			SetItemsVisable(false);
			score.SetVisible(false);
			reward.SetVisible(false);
			line.SetVisible(false);
			menuType = Menu_Type.MENU_TYPE_LOST;
			headTilte.Init(Datas.getArString("Campaign.Report_Lose"),-1,-1,"",0);
			allianceBossWinTips.SetVisible(false);
			allianceBossTime.SetVisible(true);
			allianceBossFailTips1.SetVisible(false);
			allianceBossFailTips2.SetVisible(true);
			var leftTime :long = KBN.AllianceBossController.instance().eventEndTime - GameMain.instance().unixtime();
			if (leftTime > 0)
				allianceBossTime.txt = String.Format(Datas.getArString("Dungeon.Countdown"),_Global.timeFormatShortStrNotNull(leftTime,false));
			else
				allianceBossTime.txt = Datas.getArString("Dungeon.Countdown_BossEventEnd");
				
			allianceBossFailTips1.txt = String.Format(Datas.getArString("Dungeon.Report_SubTitle"),KBN.AllianceBossController.instance().curDamage);//"fighting xxxxxx";
			allianceBossFailTips2.txt = Datas.getArString("Dungeon.Report_Fail_Desc");
			noReward.SetVisible(false);
			noReward2.SetVisible(false);
			okBtn.DefaultShow();
		}
		else
		{
			menuType = Menu_Type.MENU_TYPE_WIN;
			headTilte.Init(Datas.getArString("Dungeon.Report_Succeed_Title"),-1,-1,"",0);
			SetItemsVisable(true);
			reward.SetVisible(true);
			line.SetVisible(true);
			allianceBossTime.SetVisible(false);
			allianceBossFailTips1.SetVisible(false);
			allianceBossFailTips2.SetVisible(false);
			allianceBossWinTips.SetVisible(true);
			allianceBossWinTips.txt = Datas.getArString("Dungeon.Report_Succeed_Desc");
			
			var levelInfo:Hashtable = KBN.AllianceBossController.instance().GetPreLevelInfo();
			var levelID:int = _Global.INT32(levelInfo["levelID"]);
			var factor:float = (_Global.INT32(levelInfo["factor"])+100)/100;
			var bossData:KBN.PveLevelInfo = KBN.PveController.instance().GetPveLevelInfo(levelID) as KBN.PveLevelInfo;//levelid
			moneyTxt.txt = _Global.NumSimlify(bossData.gold*factor)+"";
			foodTxt.txt = _Global.NumSimlify(bossData.food*factor)+"";
			woodTxt.txt = _Global.NumSimlify(bossData.wood*factor)+"";
			stoneTxt.txt = _Global.NumSimlify(bossData.stone*factor)+"";
			oreTxt.txt = _Global.NumSimlify(bossData.ore*factor)+"";
			
			if(KBN.AllianceBossController.instance().rewardItem != null)
			{
				var itemList:System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
				for(var strItem:String in KBN.AllianceBossController.instance().rewardItem.Keys)
				{
					var numCount:int = _Global.INT32(KBN.AllianceBossController.instance().rewardItem[strItem]);
					
					var temData:Hashtable = new Hashtable();
					temData.Add("type", 1);
					temData.Add("itemID", _Global.INT32(strItem));
					temData.Add("itemNum", numCount);
					itemList.Add(temData);
				}
				
				rewardList.Clear();
				rewardList.SetData(itemList.ToArray());
				rewardList.UpdateData();
				rewardList.ResetPos();
			}
		}
		initHidenBossStateDictionary();
		headTilte.NormalShow();
	}
}
