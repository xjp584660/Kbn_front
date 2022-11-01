/*
 * @FileName:		MistExpeditionSceneMenuBattleEventReward.js
 * @Author:			lisong
 * @Date:			2022-05-05 02:34:59
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 战斗 - 奖励
 *
*/


public class MistExpeditionSceneMenuBattleEventReward extends PopMenu {
	@Space(30) @Header("---------- MistExpedition - BattleEvent - Reward ----------")

	@Header("----------language key")
	@SerializeField private var langKey_menuTitle: String;
	@SerializeField private var langKey_MistExpeditionFinshedTipsInfo: String;
	@Space(20) 

	@Space(20)
	@SerializeField private var divideLine: Label;
	@SerializeField private var confirmBtn: Button;
	@SerializeField private var scrollList: ScrollList;

	@Space(20)
	@SerializeField private var item: MistExpeditionSceneMenuBattleEventRewardItem;



	private var itemList: System.Collections.Generic.List.<MistExpeditionSceneMenuBattleEventRewardItem>;

	private var eventPointId = 0;
	private var currentSelectedBuffId = String.Empty;







	public function Init(): void {
		super.Init();
		btnClose.Init();
		btnClose.OnClick = OnCloseMenu;
		title.Init();

		divideLine.Init();
		divideLine.setBackground("between line", TextureType.DECORATION);

		confirmBtn.Init();
		confirmBtn.txt = Datas.getArString("Common.OK_Button");
		confirmBtn.OnClick = OnConfirmBtnClick;

		item.Init();
		scrollList.Init(item);

	}


	public function DrawItem() {
		scrollList.Draw();

		divideLine.Draw();
		confirmBtn.Draw();
	}

	
    function FixedUpdate() {
	if (scrollList != null)
		scrollList.Update();
	}

	public function OnPush(param: Object) {
		title.txt = Datas.getArString(langKey_menuTitle);

		checkIphoneXAdapter();
		showIphoneXFrame = false;

		SetData(param);


	}

	public function OnPopOver(): void {
		scrollList.Clear();
	}


	/* 设置 buff 的列表数据 */
	private function SetData(param: Object): void {
		eventPointId = _Global.INT32(param);
		var array: Array = MistExpeditionManager.GetInstance().GetRewardDataArrayByEventPointId(eventPointId);

		scrollList.Clear();
		scrollList.SetData(array);
		scrollList.ResetPos();


		/* 设置 item 的按钮的点击回调 */
		var itemArr: Array = scrollList.GetItemLists().ToArray();
		itemList = new System.Collections.Generic.List.<MistExpeditionSceneMenuBattleEventRewardItem>();
		for (var i = 0; i < itemArr.Count; i++) {
			var item = itemArr[i] as MistExpeditionSceneMenuBattleEventRewardItem;
			itemList.Add(item);
			item.SetViewMenu(this);
		}

		currentSelectedBuffId = String.Empty;
		/* 初始化 选中状态 */
		OnItemSelectedFunc(currentSelectedBuffId);

		SetConfirmBtnClickableState();

	}

	/* 获得当前选中的 id */
	public function GetCurrentSelectedID(): String {
		return currentSelectedBuffId;
	}



	/* 处理 刷新 item 的选中状态 */
	public function OnRefreshSelectStateFunc(itemID: String): boolean {
		return String.Equals(currentSelectedBuffId, itemID);
	}


	/* 处理 item 的选中 状态 */
	public function OnItemSelectedFunc(selectedItemID: String): void {

		if (String.Equals(currentSelectedBuffId, selectedItemID))
			return;

		currentSelectedBuffId = selectedItemID;
		for (var i = 0; i < itemList.Count; i++) {
			itemList[i].SetSelectState(String.Equals(selectedItemID, itemList[i].ItemID));
		}

		SetConfirmBtnClickableState();
	}

	/* 设置确认按钮的当前可点击状态 */
	private function SetConfirmBtnClickableState() {
		confirmBtn.EnableBlueButton(!String.IsNullOrEmpty(currentSelectedBuffId));
	}


	private function OnCloseMenu(): void {
		MenuMgr.instance.PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventReward);
	}

	/* 点击 确认按钮 */
	private function OnConfirmBtnClick(): void {


		var okFunc: Function = function (result: HashObject) {

			var okFunc2: Function = function (result2: HashObject) {
				KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());
				OnCloseMenu();

			};
			/*更新 远征数据*/
			MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(okFunc2);

		};

		/* 告知服务器，领取奖励 */
		UnityNet.reqMistExpeditionEventReceiveReward(false, eventPointId, currentSelectedBuffId, okFunc, null);

		

	}




}