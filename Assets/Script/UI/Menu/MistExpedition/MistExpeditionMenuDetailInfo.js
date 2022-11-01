/*
 * @FileName:		MistExpeditionMenuDetailInfo.js
 * @Author:			lisong
 * @Date:			2022-03-29 01:13:50
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 详情信息
*/


public class MistExpeditionMenuDetailInfo extends UIObject {

	@Space(30) @Header("----------MistExpedition - DetailInfo----------")

	@Header("----------language key")
	@SerializeField private var langKey_time: String;
	@SerializeField private var langKey_ruleDesc: String;
	@SerializeField private var langKey_expeditionBtn: String;
	@SerializeField private var langKey_expeditionBtnFree: String;
	@SerializeField private var langKey_expeditionBtnContinue: String;
	@SerializeField private var langKey_dailyLimit: String;
	@Space(20)



	@SerializeField private var themeDescBG: Label;
	@SerializeField private var themeImg: Label;
	@SerializeField private var timeBG_Back: Label;
	@SerializeField private var timeBG_Front: Label;
	@SerializeField private var timeLabel: Label;

	@Space(20)
	@SerializeField private var descLabel: Label;
	@SerializeField private var scroll: ScrollView;

	@Space(20)
	@SerializeField private var expeditionConditionLabel: Label;
	@SerializeField private var expeditionLimitLabel: Label;
	@SerializeField private var expeditionBtn: Button;

	private var expeditionCount = 0;/* 每日已经远征的次数 */
	private var expeditionLimitCount = 0;/* 每日远征限制的次数 */
	private var expeditionHornHaveCount = 0;/* 拥有的远征号角数量 */

	private var limitLabelPreStr = "";
	private var endTime: long = 0;

	/* 是否需要通过 接口获取该界面的数据，当已经获取过，就不需要再次获取 */
	private var isHaveRefreshOnce = false;

	/*是否 是免费 次数 进入 游戏 玩法 场景*/
	private var isFreeTicket: boolean = false;


#if UNITY_EDITOR
	@Space(20)
	@Header("----------远征号角购买测试（仅在Editor下可用）")
	@SerializeField private var isTestExpeditionHorn = false;
	@Header("远征次数（test）")
	@SerializeField private var testExpeditionCount = 0;
	@Header("远征限制次数（test）")
	@SerializeField private var testExpeditionLimitCount = 5;
#endif



	public function Init() {

		isHaveRefreshOnce = false;

		themeDescBG.Init();
		themeImg.Init();
		timeBG_Back.Init();
		timeBG_Front.Init();
		timeLabel.Init();

		
		descLabel.Init();

		expeditionConditionLabel.Init();
		expeditionLimitLabel.Init();
		expeditionBtn.Init();

		expeditionBtn.txt = Datas.getArString(langKey_expeditionBtn);
		expeditionBtn.OnClick = OnExpeditionBtnClickHandler;

		expeditionConditionLabel.SetNormalTxtColor(FontColor.Red);
		descLabel.txt = Datas.getArString(langKey_ruleDesc);

		var decLabelTxtLenght: int = descLabel.txt.length;
		descLabel.maxChar = decLabelTxtLenght;
		descLabel.rect.height = descLabel.GetTxtHeight() + 50;

		themeImg.mystyle.normal.background = TextureMgr.instance().LoadTexture("mistexpedition_detail_theme_img", TextureType.MISTEXPEDITION);

	}



	public function Draw() {
		if (!visible) return;


		themeDescBG.Draw();
		themeImg.Draw();


		timeBG_Back.Draw();
		timeBG_Front.Draw();
		timeLabel.Draw();

		scroll.Draw();

		/* 每日第一次远征是免费的，所以 扣除的“远征号角”不需要显示 */
		if (!isFreeTicket) {
			expeditionConditionLabel.Draw();
		}

		expeditionLimitLabel.Draw();
		expeditionBtn.Draw();

	}

	public function Update() {
		UpdateLimitTime();

		scroll.Update();
	}


	private function UpdateLimitTime() {

		var curTime: long = GameMain.unixtime();
		var str = limitLabelPreStr + (endTime < curTime ? _Global.timeFormatStr(0) : _Global.timeFormatStr(endTime - curTime));

		timeLabel.txt = str;
	}


	public function SetData(): void {
		limitLabelPreStr = Datas.getArString(langKey_time);
		
		if (!isHaveRefreshOnce) {
			endTime = MistExpeditionManager.GetInstance().GetExpeditionRefreshTime();
			expeditionConditionLabel.txt = "-1";
		}

		RefreshExpeditionLimitLabel();

		scroll.component = [];
		scroll.clearUIObject();
		scroll.addUIObject(descLabel);
		scroll.AutoLayout();
		scroll.MoveToTop();

		RequestMistExpeditionMapInfo();

	}



	public function OnPop() {

	}


	private function GotoMistExpeditionScene(result: HashObject) {


		if (result != null) {

			var data: HashObject = result["result"] as HashObject;

			var mapDetailsData = "";

			mapDetailsData = data["mapDetails"].Value as String;

			if (String.IsNullOrEmpty(mapDetailsData)) {
				mapDetailsData = data["mapDetails"].ToString();

			}

			if (String.IsNullOrEmpty(mapDetailsData)) {

				PopupConfirmDialog("Expedition.Scene_EmptyMap_Title",
					"Expedition.Scene_EmptyMap_Text", "FTE.Retry", "", UnityEngine.TextAnchor.UpperLeft, false, function () {

						MenuMgr.getInstance().PopMenu("");
						MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(GotoMistExpeditionScene);

					}, function () {

						MenuMgr.getInstance().PopMenu("");
						MistExpeditionManager.GetInstance().RequestMistExpeditionEntranceInfo(RequestMistExpeditionInfo);

					});

			}
			else {
				GameMain.instance().GotoMistExpeditionScene();
			}
		} else {

			PopupConfirmDialog("Expedition.Scene_EmptyMap_Title",
				"Expedition.Scene_EmptyMap_Text", "FTE.Retry", "", UnityEngine.TextAnchor.UpperLeft, false, function () {

					MenuMgr.getInstance().PopMenu("");
					MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(GotoMistExpeditionScene);

				}, function () {

					MenuMgr.getInstance().PopMenu("");
					MistExpeditionManager.GetInstance().RequestMistExpeditionEntranceInfo(RequestMistExpeditionInfo);

				});

		}

	}

	private function OnExpeditionBtnClickHandler() {

#if UNITY_EDITOR
		if (isTestExpeditionHorn) {
			MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_ExpeditionBuyHorn, GotoMistExpeditionScene, "trans_zoomComp");
			return;
		}
#endif

		var okFunc: Function = function (result: HashObject) {
			if (result != null && result.Contains("result") && _Global.GetBoolean(result["result"])) {

				var itemsMgr: MyItems = MyItems.instance();
				itemsMgr.MistExpeditionSubtractItem(4700,1);/* 使用 入场劵 成功 使背包 减去 一个 入场劵 道具 */
				MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(GotoMistExpeditionScene);

			} else if (result == null) {
				/*继续 或者 免费*/
				MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(GotoMistExpeditionScene);

			} else {
				Debug.Log("<color= #E79400FF>后端 返回 结果 " + result.ToString() + "</color>");
			}

		};

		var errorFunc: Function = function (data: HashObject) {
			Debug.Log("<color= #E79400FF>远征 场景 进入 失败</color>");
		};

		if (MistExpeditionManager.GetInstance().GetExpeditionFreeTicket()) {

			okFunc(null);
			return;
		} 
		else {
			if (MistExpeditionManager.GetInstance().GetExpeditionHornHaveCount() <= 0 && !MistExpeditionManager.GetInstance().IsMistExpeditionContinue()) {

				MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_ExpeditionBuyHorn, function () {
					UnityNet.reqMistExpeditionSceneEntranceInfo(okFunc, errorFunc);
				}, "trans_zoomComp");
				return;
			} else {
				if (MistExpeditionManager.GetInstance().IsMistExpeditionContinue()) {
					okFunc(null);
					return;
				} else {
					UnityNet.reqMistExpeditionSceneEntranceInfo(okFunc, errorFunc);
					return;
				}
			}
		}

	}


	/* 更新远征按钮的文本内容显示 */
	private function RefreshBtnText() {
		var keyStr = "";

		if (MistExpeditionManager.GetInstance().GetExpeditionFreeTicket()) {
			if (MistExpeditionManager.GetInstance().IsMistExpeditionContinue())
				keyStr = langKey_expeditionBtnContinue;
			else
				keyStr = langKey_expeditionBtnFree;
		} else {
			if (MistExpeditionManager.GetInstance().IsMistExpeditionContinue())
				keyStr = langKey_expeditionBtnContinue;
			else
				keyStr = langKey_expeditionBtn;
		}



		expeditionBtn.txt = Datas.getArString(keyStr);
		RefreshExpeditionLimitLabel();
	}

	/* 刷线远征按钮的点击状态 */
	private function RefreshExpeditionBtnState() {
	/* 当已经完成了每日的所有远征时，需要禁止远征按钮的点击 */
		var isContinue = MistExpeditionManager.GetInstance().IsMistExpeditionContinue();
		var isEnable = expeditionCount < expeditionLimitCount || isContinue || expeditionLimitCount == -1;
		expeditionBtn.EnableBlueButton(isEnable);
	}


	private function RefreshExpeditionLimitLabel() {
		expeditionCount = MistExpeditionManager.GetInstance().GetExpeditionCount();
		expeditionLimitCount = MistExpeditionManager.GetInstance().GetExpeditionLimitCount();
		expeditionHornHaveCount = -1;



#if UNITY_EDITOR
		if (isTestExpeditionHorn) {
			expeditionCount = testExpeditionCount;
			expeditionLimitCount = testExpeditionLimitCount;
			expeditionHornHaveCount = -1;
		}
#endif
		expeditionLimitLabel.txt = String.Format(Datas.getArString(langKey_dailyLimit), expeditionCount, expeditionLimitCount);

		RefreshExpeditionBtnState();
	}



	private function RequestMistExpeditionMapInfo() {
		var okFunc: Function = function (result: HashObject) {
			RefreshBtnText();

			endTime = MistExpeditionManager.GetInstance().GetExpeditionRefreshTime();
			expeditionConditionLabel.txt = expeditionHornHaveCount + "";
			isFreeTicket = MistExpeditionManager.GetInstance().GetExpeditionFreeTicket();
		};

		if (MistExpeditionManager.GetInstance().IsHaveExpeditionEntranceData() && isHaveRefreshOnce) {
			okFunc(null);
		} else {
			isHaveRefreshOnce = true;
			MistExpeditionManager.GetInstance().RequestMistExpeditionEntranceInfo(okFunc);
		}

	}




	private function RequestMistExpeditionInfo() {

		var okFunc: Function = function (result: HashObject) {
			RefreshBtnText();

			endTime = MistExpeditionManager.GetInstance().GetExpeditionRefreshTime();
			expeditionConditionLabel.txt = expeditionHornHaveCount + "";
			isFreeTicket = MistExpeditionManager.GetInstance().GetExpeditionFreeTicket();
		};

		MistExpeditionManager.GetInstance().RequestMistExpeditionEntranceInfo(okFunc);
	}




	private function PopupConfirmDialog(titleStrKey: String, tipsInfoStrKey: String, okBtnStrKey: String, cancelBtnStrKey: String, msgAlignment: UnityEngine.TextAnchor, cancelAble: boolean,
		okFunc: System.Action.<Object>, cancelFunc: System.Action.<Object>) {

		var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();

		dialog.setLayout(600, 380);

		dialog.setTitleY(60);

		dialog.m_msg.mystyle.alignment = msgAlignment;

		dialog.setContentRect(70, 140, 0, 100);

		dialog.SetCancelAble(cancelAble);

		dialog.btnClose.OnClick = cancelFunc;

		dialog.setButtonText(Datas.getArString(okBtnStrKey), Datas.getArString(cancelBtnStrKey));

		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString(tipsInfoStrKey), Datas.getArString(titleStrKey), okFunc, cancelFunc);
	}





}