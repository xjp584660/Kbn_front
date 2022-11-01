/*
 * @FileName:		MistExpeditionSceneMenuBattleEventResult.js
 * @Author:			lisong
 * @Date:			2022-04-02 05:31:44
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 战斗事件 - 战斗结果
 *
*/


public class MistExpeditionSceneMenuBattleEventResult extends KBNMenu {

	@Space(30) @Header("---------- MistExpedition SceneMenu Result ----------") 


	@Header("----------language key")
	@SerializeField private var langKey_victory: String;
	@SerializeField private var langKey_defeat: String;
	@SerializeField private var langKey_descVictory: String;
	@SerializeField private var langKey_descDefeat: String;
	@SerializeField private var langKey_descVictoryBoss: String;
	@SerializeField private var langKey_descDefeatBoss: String;
	@SerializeField private var langKey_descSettlement: String;

	@Space(10)
	@SerializeField private var langKey_noTroopTipsInfo: String;

	@Space(20)



	@Space(20)
	@SerializeField private var shake: Shake;


	@Space(20)
	@SerializeField private var mask: Label;

	@Space(20)
	@SerializeField private var leftTopImg: Label;
	@SerializeField private var leftBottomImg: Label;

	@SerializeField private var rightTopImg: Label;
	@SerializeField private var rightBottomImg: Label;


	@Space(20)
	@SerializeField private var flowerL: BlowUpLabel;
	@SerializeField private var flowerR: BlowUpLabel;

	@Space(20)
	@SerializeField private var backImg: Label; 
	@SerializeField private var backFrameImg: Label; 
	@SerializeField private var backFrameMarginImg: Label; 
	

	@Space(20)
	@SerializeField private var headImage: Label;
	@SerializeField private var headImageDefeatColor = Color.white;
	@SerializeField private var lightBackTop: Label;
	@SerializeField private var rotateSpeed: float;
	private var lightRotater: Rotate;

	@Space(20)
	@SerializeField private var star1: PveResultStar;
	@SerializeField private var star2: PveResultStar;
	@SerializeField private var star3: PveResultStar;

	@SerializeField private var backStar1: Label;
	@SerializeField private var backStar2: Label;
	@SerializeField private var backStar3: Label;

	@Space(20)
	@SerializeField private var resultLabel: Label;
	@SerializeField private var rewardLabel: Label;
	@SerializeField private var dividLineImg: Label;

	@Space(20)
	@SerializeField private var rewardCoinLabel: Label;
	@SerializeField private var rewardInfoLabel: Label;
	@SerializeField private var confirmBtn: BlowUpButton;


	private var curMenuState: ANIME_MENUSTATE;
	private var animeStateDictionary = new System.Collections.Generic.Dictionary.<ANIME_MENUSTATE, AnimeStateNode>();


	private var isVictory = false;

	private var showStarCount = 0;

 

	private var isNeedReset= false;/* 是否是重置远征 。玩家主动结束远征时需要重置，通关远征时，会在玩家领取boss宝箱时重置数据*/
	private var isTotalStatement = false;/* 是否是总结算 */
	private var isExpeditionFinished = false;/* 是否是远征探索结束 */




	public function Init() {

		shake.Init();

		mask.Init();

		leftTopImg.setBackground("win-top", TextureType.DECORATION);
		leftBottomImg.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);

		rightTopImg.setBackground("win-top", TextureType.DECORATION);
		rightBottomImg.setBackground("bossinfo-bg-bottom", TextureType.DECORATION);

		var texMgr = TextureMgr.instance();

		if (backImg.mystyle.normal.background == null) {
			backImg.mystyle.normal.background = texMgr.LoadTexture("ui_paper_bottom", TextureType.BACKGROUND);
		}

		if (backFrameImg.mystyle.normal.background == null) {
			backFrameImg.mystyle.normal.background = texMgr.LoadTexture("ui_paper_bottom", TextureType.BACKGROUND);
		}
		if (backFrameMarginImg.mystyle.normal.background == null) {
			backFrameMarginImg.mystyle.normal.background = texMgr.LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);
		}

		
		if (headImage.mystyle.normal.background == null) {
			headImage.mystyle.normal.background = texMgr.LoadTexture("win-flag", TextureType.DECORATION);
		}

		flowerL.Init();
		flowerR.Init();
		flowerL.setBackground("trumpet", TextureType.DECORATION);
		flowerR.setBackground("trumpet", TextureType.DECORATION);

		lightBackTop.setBackground("payment_light", TextureType.DECORATION);
		lightRotater = new Rotate();
		lightRotater.init(lightBackTop, EffectConstant.RotateType.LOOP, Rotate.RotateDirection.CLOCKWISE, 0.0f, 0.0f);
		lightRotater.rotateMultiple = rotateSpeed;
		lightRotater.playEffect();

		/* //星星的动画显示
		backStar1.mystyle.normal.background = texMgr.LoadTexture("win-blackstar", TextureType.ICON);
		backStar2.mystyle.normal.background = texMgr.LoadTexture("win-blackstar", TextureType.ICON);
		backStar3.mystyle.normal.background = texMgr.LoadTexture("win-blackstar", TextureType.ICON);

		star1.Init("tongyongbaopo000", 7);
		star2.Init("tongyongbaopo000", 7);
		star3.Init("tongyongbaopo000", 7);
		star1.setBackground("BIGstar", TextureType.ICON);
		star2.setBackground("BIGstar", TextureType.ICON);
		star3.setBackground("BIGstar", TextureType.ICON);
		if (backStar1.mystyle.normal.background == null) {
			backStar1.mystyle.normal.background = texMgr.LoadTexture("win-blackstar", TextureType.ICON);
		}

		if (backStar2.mystyle.normal.background == null) {
			backStar2.mystyle.normal.background = texMgr.LoadTexture("win-blackstar", TextureType.ICON);
		}

		if (backStar3.mystyle.normal.background == null) {
			backStar3.mystyle.normal.background = TextureMgr.instance().LoadTexture("win-blackstar", TextureType.ICON);
		}
		*/
		rewardLabel.txt = Datas.getArString("Common.Rewards");


		dividLineImg.Init();
		rewardLabel.Init();
		resultLabel.Init();

		rewardCoinLabel.Init();
		rewardInfoLabel.Init();


		confirmBtn.Init();
		confirmBtn.OnClick = OnConfirmBtnClick;
		confirmBtn.txt = Datas.getArString("Common.OK_Button");
		confirmBtn.setNorAndActBG("button_60_blue_normalnew", "button_60_blue_downnew");

	}




	protected function DrawBackground() {
		if (!visible) return;

		if (isVictory) {
			lightRotater.drawItems();
		}

		if (isVictory)
			shake.ShakeMatrixBegin();

		backImg.Draw();

		backFrameImg.Draw();
		backFrameMarginImg.Draw();

		leftTopImg.Draw();
		leftBottomImg.Draw();

		rightTopImg.Draw();
		rightBottomImg.Draw();
 

		if (isVictory) {
			flowerL.Draw();
			flowerR.Draw();
			headImage.Draw();
		} else {
			var oldColor = GUI.color;
			GUI.color = headImageDefeatColor;
			headImage.Draw();
			GUI.color = oldColor;
		}


		if (isVictory)
			shake.ShakeMatrixEnd();
	}


	public function DrawItem() {

		if (!visible) return;

		if (isVictory)
			shake.ShakeMatrixBegin();
		/* //星星的动画显示
		backStar1.Draw();
		backStar3.Draw();
		backStar2.Draw();

		if (isVictory) {
			if (showStarCount == 3) {
				star1.Draw();
				star2.Draw();
				star3.Draw();
			} else if (showStarCount == 2) {
				star1.Draw();
				star2.Draw();
			} else if (showStarCount == 1) {
				star1.Draw();
			} 
		}
		*/

		dividLineImg.Draw();
		resultLabel.Draw();
		rewardLabel.Draw();

		rewardCoinLabel.Draw();
		rewardInfoLabel.Draw();

		confirmBtn.Draw();

		
		if (isVictory)
			shake.ShakeMatrixEnd();

	}





	private var maskColor = new Color(0, 0, 0, 0.5);
	public function DrawMask() {
		if (!visible) return;

		var oldColor: Color = GUI.color;
		GUI.color = maskColor;
		mask.Draw();
		GUI.color = oldColor;
	}



	public function Update() {
		
		if (isVictory) {
			shake.Update();
			lightRotater.updateEffect();
		}

		confirmBtn.Update();
		flowerR.Update();
		flowerL.Update();
		/* //星星的动画显示
		star1.Update();
		star3.Update();
		star2.Update();
		*/
	}


	

	public function OnPush(param: Object) {

		isNeedReset = false;
		isTotalStatement = false;
		isExpeditionFinished = false;

		var infoArr = (param as String).Split("_"[0]);
		isNeedReset = String.Equals(infoArr[0], "1");
		isTotalStatement = String.Equals(infoArr[1],"1");
		isExpeditionFinished = String.Equals(infoArr[2], "1");

		var eventPointId = MistExpeditionManager.GetInstance().GetExpeditionCurrentEventPointId();


		var coinCount = 0;
	
		if (isTotalStatement) {

			rewardLabel.txt = Datas.getArString(langKey_descSettlement);

			isVictory = isExpeditionFinished;
			showStarCount = isVictory ? 3 : 0;
			var consume = MistExpeditionManager.GetInstance().GetCurrentExpeditionConsumeCoinCount();
			var remain = MistExpeditionManager.GetInstance().GetCurrentExpeditionResidueCoinCount();

			if (isVictory)
				rewardInfoLabel.txt = String.Format(Datas.getArString(langKey_descVictoryBoss), consume, remain);
			else
				rewardInfoLabel.txt = String.Format(Datas.getArString(langKey_descDefeatBoss), consume, remain);


		} else {

			var data: HashObject = MistExpeditionManager.GetInstance().GetBattleResultDataByEventId(eventPointId);

			coinCount = _Global.INT32(data["coin"]);
			isVictory = _Global.GetBoolean(data["victory"]);
			showStarCount = _Global.INT32(data["star"]);

			if (isVictory) {
				resultLabel.txt = Datas.getArString(langKey_victory);
				resultLabel.SetNormalTxtColor(FontColor.TabDown);
				rewardInfoLabel.txt = Datas.getArString(langKey_descVictory);

			} else {
				resultLabel.txt = Datas.getArString(langKey_defeat);
				resultLabel.SetNormalTxtColor(FontColor.Sale_Gray);
				rewardInfoLabel.txt = Datas.getArString(langKey_descDefeat);
			}

		}

		if (isVictory) {
			resultLabel.txt = Datas.getArString(langKey_victory);
			resultLabel.SetNormalTxtColor(FontColor.TabDown);

			CreateStateDictionary();
			MenuStateBegin();
		} else {
			resultLabel.txt = Datas.getArString(langKey_defeat);
			resultLabel.SetNormalTxtColor(FontColor.Sale_Gray);

			confirmBtn.DefaultShow();

		}

		rewardCoinLabel.txt = coinCount + "";
		rewardCoinLabel.SetVisible(!isTotalStatement);

	}


	public function OnPopOver() {
		super.OnPopOver();

		headImage.mystyle.normal.background = null;
		leftTopImg.Background = null;
		leftBottomImg.Background = null;

		rightTopImg.Background = null;
		rightBottomImg.Background = null;

		flowerL.Background = null;
		flowerR.Background = null;
		/* //星星的动画显示
		star1.Background = null;
		star2.Background = null;
		star3.Background = null;
		backStar1.mystyle.normal.background = null;
		backStar2.mystyle.normal.background = null;
		backStar3.mystyle.normal.background = null;
		*/
		lightBackTop.Background = null;
		confirmBtn.setNorAndActBG("none", "none");

	}


	/* 确认按钮 */
	private function OnConfirmBtnClick() {

		if (isTotalStatement) {
			/* 初始化 远征数据 */
			var okFunc: Function = function (result: HashObject) {
				MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult);
				
				/* 切换场景 */
				GameMain.instance().ExitMistExpeditionScene();

			};

			if (isNeedReset) {
				/* 重置远征数据 */
				UnityNet.reqMistExpeditionMapInitData(okFunc, null);
			} else {
				okFunc(null);
			}


		} else {
			MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult);

			if (isVictory) {
				/* 普通、精英战斗胜利 */
				if (!MistExpeditionManager.GetInstance().IsBossBattle()) {
					var eventPointId = MistExpeditionManager.GetInstance().GetExpeditionCurrentEventPointId();
					MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventReward, eventPointId, "trans_zoomComp");
				} else {
				/* 显示 boss 宝箱 打开动画界面*/

					MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventRewardBossChest, null, "trans_zoomComp");

				}



			} else {
				/* 是否全军覆没，没有部队 */
				if (!MistExpeditionManager.GetInstance().IsHaveTroop()) {
					var confirmFunc = function () {
						MenuMgr.getInstance().PopMenu("");
						/* 最后结算、退出迷雾远征 */
					};
					MistExpeditionMenuManager.PopupConfirmDialog("", langKey_noTroopTipsInfo, confirmFunc, null);
				}
			}
		}

	}




/*----------------------- anime ------------------------------------------------------*/
	/* 创建动画流程 */
	private function CreateStateDictionary() {
		/* menu state begin */
		curMenuState = ANIME_MENUSTATE.NONE;
		animeStateDictionary.Clear();
		/* //星星的动画显示
		animeStateDictionary.Add(ANIME_MENUSTATE.FLOWER_BLOW_UP, new AnimeStateNode(ANIME_MENUSTATE.FLOWER_BLOW_UP, ANIME_MENUSTATE.STAR1, flowerL.Begin, OnMenuStateOver, flowerL, FlowerRBegin, CanDoFlowerBlowUp));
		animeStateDictionary.Add(ANIME_MENUSTATE.STAR1, new AnimeStateNode(ANIME_MENUSTATE.STAR1, ANIME_MENUSTATE.STAR2, star1.Begin, OnPveStarOver, star1, null, CanDoStar1));
		animeStateDictionary.Add(ANIME_MENUSTATE.STAR2, new AnimeStateNode(ANIME_MENUSTATE.STAR2, ANIME_MENUSTATE.STAR3, star2.Begin, OnPveStarOver, star2, null, CanDoStar2));
		animeStateDictionary.Add(ANIME_MENUSTATE.STAR3, new AnimeStateNode(ANIME_MENUSTATE.STAR3, ANIME_MENUSTATE.BTN_BLOW_UP, star3.Begin, OnPveStarOver, star3, null, CanDoStar3));
		animeStateDictionary.Add(ANIME_MENUSTATE.BTN_BLOW_UP, new AnimeStateNode(ANIME_MENUSTATE.BTN_BLOW_UP, ANIME_MENUSTATE.NONE, confirmBtn.Begin, OnMenuStateOver, confirmBtn, null, CanDoBtnBlowUp));
		*/
		animeStateDictionary.Add(ANIME_MENUSTATE.FLOWER_BLOW_UP, new AnimeStateNode(ANIME_MENUSTATE.FLOWER_BLOW_UP, ANIME_MENUSTATE.BTN_BLOW_UP, flowerL.Begin, OnMenuStateOver, flowerL, FlowerRBegin, CanDoFlowerBlowUp));
		animeStateDictionary.Add(ANIME_MENUSTATE.BTN_BLOW_UP, new AnimeStateNode(ANIME_MENUSTATE.BTN_BLOW_UP, ANIME_MENUSTATE.NONE, confirmBtn.Begin, OnMenuStateOver, confirmBtn, null, CanDoBtnBlowUp));

	}

	private function OnMenuStateOver() {
		if (animeStateDictionary.ContainsKey(curMenuState)) {
			var curStateNode = animeStateDictionary[curMenuState] as AnimeStateNode;
			if (curStateNode.nextState != ANIME_MENUSTATE.NONE) {
				SetMenuState(curStateNode.nextState);
			}
		}
	}

	private function SetMenuState(_state: ANIME_MENUSTATE) {
		curMenuState = _state;

		if (animeStateDictionary.ContainsKey(curMenuState)) {
			var curStateNode = animeStateDictionary[curMenuState] as AnimeStateNode;

			if (curStateNode.canDoFuncton != null) {
				var canDo: boolean = curStateNode.canDoFuncton();
				if (!canDo) {
					OnMenuStateOver();
					return;
				}
			}

			curStateNode.initFuncton();

			if (curStateNode.additionalFuncton != null) curStateNode.additionalFuncton();
			if (curStateNode.uiObj != null) {
				curStateNode.uiObj.OverFuncton = curStateNode.overFunction;
			}
		}
	}


	private function FlowerRBegin() {
		flowerR.Begin();
		SoundMgr.instance().PlayEffect("kbn_pve_rewards", "Audio/Pve/");
	}

	private function CanDoFlowerBlowUp(): boolean {

		return isVictory;
	}

	/* //星星的动画显示
	private function OnPveStarOver() {
		OnMenuStateOver();
		shake.Begin();
	}

	private function CanDoStar1(): boolean {
		return showStarCount > 0;
	}

	private function CanDoStar2(): boolean {
		return showStarCount > 1;

	}

	private function CanDoStar3(): boolean {
		return showStarCount > 2;

	}
	*/

	private function CanDoBtnBlowUp(): boolean {
		return true;
	}

	private function MenuStateBegin() {
		SetMenuState(ANIME_MENUSTATE.FLOWER_BLOW_UP);
	}


	private enum ANIME_MENUSTATE {
		NONE,
		BTN_BLOW_UP,
		FLOWER_BLOW_UP,
		STAR1,
		STAR2,
		STAR3
	};

	private class AnimeStateNode {

		public function AnimeStateNode(
			_curState: ANIME_MENUSTATE,
			_nextState: ANIME_MENUSTATE,
			_initFuncton: Function,
			_overFunction: Function,
			_uiObj: PveMenuState,
			_additionalFuncton: Function,
			_canDoFuncton: Function)
		{
			curState = _curState;
			nextState = _nextState;
			initFuncton = _initFuncton;
			overFunction = _overFunction;
			uiObj = _uiObj;
			additionalFuncton = _additionalFuncton;
			canDoFuncton = _canDoFuncton;
		}

		public var curState: ANIME_MENUSTATE;
		public var nextState: ANIME_MENUSTATE;
		public var initFuncton: Function;
		public var overFunction: Function;
		public var uiObj: PveMenuState;
		public var additionalFuncton: Function;
		public var canDoFuncton: Function;
	}


/*----------------------- anime ------------------------------------------------------*/



}