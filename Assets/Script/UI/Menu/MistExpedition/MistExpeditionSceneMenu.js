/*
 * @FileName:		MistExpeditionSceneMenu.js
 * @Author:			lisong
 * @Date:			2022-03-31 02:53:04
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:		迷雾远征 场景 menu
 * 
*/


public class MistExpeditionSceneMenu extends KBNMenu {

	@Space(30) @Header("----------MistExpedition Scene Menu----------")


	@Header("----------language key")
	@SerializeField private var langKey_menuTitle: String;
	@SerializeField private var langKey_exitMistExpeditionTips: String;
	@SerializeField private var langKey_btnTroopInfoText: String;
	@SerializeField private var langKey_btnBuffText: String;
	@SerializeField private var langKey_btnReportText: String;
	@Space(20)

	/* ---------- 顶部 菜单按钮 ---------- */

	@SerializeField private var menuHead_prefab: MenuHead;
	private var menuHead: MenuHead;

	@Space(10)

	@SerializeField private var mistExpeditionCoinImgBG: Label;
	@SerializeField private var mistExpeditionCoinImg: Label;
	@SerializeField private var mistExpeditionCoinLabel: Label;
	/* ------------------------- */
	@Space(10)

	/* ---------- chat ---------- */
	public var chatText: SimpleButton;
	@SerializeField
	private var btnChat: Button;
	public var chatText1: Label;
	public var chatText2: Label;
	public var chatIcon1: Label;
	public var chatIcon2: Label;
	public var weeklyLimit: Label;

	public var TextureGlobal: Texture2D;
	public var TextureAlliance: Texture2D;
	public var TextureWhisper: Texture2D;

	@SerializeField
	private var redColor: Color;
	@SerializeField
	private var blackColor: Color;

	private var g_countForChattext: long = 0;
	private var g_curTime: long = 0;
	private var g_updateChatInterval: int = 1;

	/* ---------- chat ---------- */ 
	@Space(10)

	/* ---------- btn ---------- */
	@SerializeField private var btnBG: Label;
	@SerializeField private var btnExit: Button;
	@SerializeField private var btnTroopInfo: Button;
	@SerializeField private var btnBuff: Button;
	@SerializeField private var btnReport: Button;
	@SerializeField private var btnEventPoints: Button;
	/* ------------------------- */

	@SerializeField private var height: float = 66f;
	@SerializeField private var autoShowLeaderSelectDelayTime: float= 2f;







	function Init(): void {


		if (menuHead_prefab != null)
			menuHead = Instantiate(menuHead_prefab);

		if (menuHead != null) {
			menuHead.Init();
			menuHead.backTile.rect.height = height;
			menuHead.btn_back.OnClick = OnBackBtnClick;
			menuHead.btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_back2_normal", TextureType.BUTTON);
			menuHead.btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_back2_down", TextureType.BUTTON);
		}
		mistExpeditionCoinImgBG.Init();
		mistExpeditionCoinImg.Init();
		mistExpeditionCoinLabel.Init();

		btnChat.Init();
		weeklyLimit.Init();
		chatText1.Init();
		chatText2.Init();
		chatIcon1.Init();
		chatIcon2.Init();

		btnBG.Init();
		btnExit.Init();
		btnTroopInfo.Init();
		btnBuff.Init();
		btnReport.Init();
		btnEventPoints.Init();



		weeklyLimit.txt = "";
		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;
		chatIcon2.mystyle.normal.background = null;
		chatText.OnClick = OpenChat;
		btnChat.OnClick = OpenChat;

		btnExit.OnClick = OnExitMistExpedition;
		btnTroopInfo.OnClick = OpenTroopDetailMenu;
		btnBuff.OnClick = OpenBuffMenu;
		btnReport.OnClick = OpenReportMenu;
		btnEventPoints.OnClick = OpenEventPoints;

		btnTroopInfo.txt = Datas.getArString(langKey_btnTroopInfoText);
		btnBuff.txt = Datas.getArString(langKey_btnBuffText);
		btnReport.txt = Datas.getArString(langKey_btnReportText);
		btnEventPoints.txt = Datas.getArString("");

		UpdateMessage();
	}

 

	function OnPush(param: Object): void {
		checkIphoneXAdapter();

		MistExpeditionManager.GetInstance().AddExpeditionDataUpdateCallback(RefreshMistExpeditionCoin);
		MistExpeditionManager.GetInstance().AddExpeditionDataUpdateCallbackDic("RefreshMistExpeditionCoin", RefreshMistExpeditionCoin);

		var mainChrom: MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		if (mainChrom != null)
			mainChrom.SetVisible(false);

		menuHead.setTitle(Datas.getArString(langKey_menuTitle));
		RefreshMistExpeditionCoin();

		Invoke("CheckLeaderSelectState", autoShowLeaderSelectDelayTime);

	}

	public function OnPopOver() {

		MistExpeditionManager.GetInstance().RemoveExpeditionDataUpdateCallback(RefreshMistExpeditionCoin);
		MistExpeditionManager.GetInstance().RemoveExpeditionDataUpdateCallbackDic("RefreshMistExpeditionCoin");

		if (menuHead_prefab != null && menuHead != null) {
			TryDestroy(menuHead);
			menuHead = null;
		}

	}


	function OnBack() {
		UpdateMessage();
	}

	protected function DrawItem() {
		if (!visible)
			return;

		frameTop.Draw();


		mistExpeditionCoinImgBG.Draw();
		mistExpeditionCoinImg.Draw();
		mistExpeditionCoinLabel.Draw();

		chatText.Draw();
		btnChat.Draw();
		chatText1.Draw();
		chatText2.Draw();
		chatIcon1.Draw();
		chatIcon2.Draw();
		weeklyLimit.Draw();

		btnBG.Draw();
		btnExit.Draw();
		btnTroopInfo.Draw();
		btnBuff.Draw();
		btnReport.Draw();
		btnEventPoints.Draw();
	}

	protected function DrawBackground() {
		menuHead.Draw();

	}



	public function Update() {
		if (!visible)
			return;

		menuHead.Update();

		var chatMenu = MenuMgr.getInstance().Chat as ChatMenu;
		if (chatMenu.whetherGetChat(false)) {
			chatMenu.getChat(true);
		}

		g_curTime = GameMain.unixtime();
		if (g_curTime - g_countForChattext >= g_updateChatInterval) {
			g_countForChattext = g_curTime;

			if (chatMenu.isNeedUpdateMes) {
				UpdateMessage();
			}
		}
		 
	}

	

	private function UpdateMessage() {

		var tempArray: Array = (MenuMgr.getInstance().Chat as ChatMenu).generateMesForMainChrom();

		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;
		chatIcon2.mystyle.normal.background = null;

		if (tempArray.length > 0) {
			chatText1.txt = (tempArray[0] as Hashtable)["message"];
			chatIcon1.mystyle.normal.background = getTextureByType((tempArray[0] as Hashtable)["type"].ToString());
			if (((tempArray[0] as Hashtable)["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION) {
				chatText1.mystyle.normal.textColor = redColor;
			}
			else {
				chatText1.mystyle.normal.textColor = blackColor;
			}
		}

		if (tempArray.length > 1) {
			chatText2.txt = (tempArray[1] as Hashtable)["message"];
			chatIcon2.mystyle.normal.background = getTextureByType((tempArray[1] as Hashtable)["type"].ToString());

			if (((tempArray[1] as Hashtable)["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION) {
				chatText2.mystyle.normal.textColor = redColor;
			}
			else {
				chatText2.mystyle.normal.textColor = blackColor;
			}
		}
	}


	/* 刷洗界面上的远征币的显示 */
	private function RefreshMistExpeditionCoin() {
		mistExpeditionCoinLabel.txt = MistExpeditionManager.GetInstance().GetCurrentExpeditionResidueCoinCount() + "";
	}



	public function handleNotification(type: String, body: Object): void {
		switch (type) {
	
			 
		}
	}


	public function isHitUI(pos: Vector2): boolean {
		
			return false;
	}

	/* 退出 迷雾远征 场景 */
	public function OnBackBtnClick() {
		GameMain.instance().ExitMistExpeditionScene();

	}


	public function OnBackButton(): boolean {
		OnBackBtnClick();
		return true;
	}

	private function OpenChat() {
		MenuMgr.getInstance().PushMenu("ChatMenu", null);
	}

	public function getTextureByType(_type: String): Texture2D {
		switch (_type) {
			case Constant.ChatType.CHAT_GLOBLE:
				return TextureGlobal;
			case Constant.ChatType.CHAT_WHISPER:
				return TextureWhisper;
			case Constant.ChatType.CHAT_ALLIANCE:
			case Constant.ChatType.CHAT_ALLIANCE_OFFICER:
			case Constant.ChatType.HELP_FOUNDER_INITIATE:
			case Constant.ChatType.HELP_HELPER_CONFIRM:
			case Constant.ChatType.CHAT_ALCREQUEST:
			case Constant.ChatType.CHAT_ALCRQANSWER:
				return TextureAlliance;
			case Constant.ChatType.CHAT_EXCEPTION:
				return null;
		}
	}

	/*退出按钮 直接调用 远征最终结算*/
	private function OnExitMistExpedition() {

		MistExpeditionMenuManager.PopupConfirmDialog(
			""
			, langKey_exitMistExpeditionTips
			, function () {				
				var okFunc: Function = function (result: HashObject) {
					MenuMgr.getInstance().PopMenu("");
					/* 更新 当前远征的 远征币数量 */
					MistExpeditionManager.GetInstance().UpdateExpeditioneCoinState(result);
					/* 显示完成远征的最后结算、退出迷雾远征 */
					MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult, "0_1_1", "trans_zoomComp");

					MistExpeditionManager.GetInstance().MistExpeditionShopCoinDicClear(); /*清除 缓存的远征商人 Coin 物品信息*/
					MistExpeditionManager.GetInstance().MistExpeditionShopPayDicClear(); /*清除 缓存的远征商人 gmes 物品信息*/
				};

				UnityNet.reqMistExpeditionSettlement(okFunc, null);

			}, null);

	}

	private function OpenEventPoints() {
		if (!CheckLeaderSelectState())
			return;
		MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_EventPoints, null, "trans_zoomComp");
	}

	private function OpenTroopDetailMenu() {
		if (!CheckLeaderSelectState())
			return;
		MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_TroopInfo, null, "trans_zoomComp");
	}

	private function OpenBuffMenu() {
		if (!CheckLeaderSelectState())
			return;
		MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_Buff, null, "trans_zoomComp");
	}

	private function OpenReportMenu() {
		if (!CheckLeaderSelectState())
			return;
		var obj: Hashtable = { "PveOpenReport": "true" };
		MenuMgr.getInstance().PushMenu("EmailMenu", obj);
	}

	private function CheckLeaderSelectState(): boolean {
		/*打开领袖选择界面*/
		if (!MistExpeditionManager.GetInstance().IsHaveLeader()) {
			MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSelect, null, "trans_pop");
			return false;
		}
		return true;

	}

}