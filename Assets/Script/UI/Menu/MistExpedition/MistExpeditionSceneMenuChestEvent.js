/*
 * @FileName:		MistExpeditionSceneMenuChestEvent.js
 * @Author:			lisong
 * @Date:			2022-04-02 05:31:17
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 宝箱
 *
*/


public class MistExpeditionSceneMenuChestEvent extends PopMenu {


	@Space(30) @Header("---------- MistExpedition - SceneMenu - ChestEvent ----------")


	@Header("----------language key")
	@SerializeField private var langKey_menuTitle: String;
	@Space(20)

	@SerializeField private var divideLine: Label;
	@SerializeField private var scrollList: ScrollList;
	@SerializeField private var confirmBtn: Button;

	@Space(20)
	@SerializeField private var item: MistExpeditionSceneMenuChestEventItem;


	private var eventPointId = 0;

	private var itemList: System.Collections.Generic.List.<MistExpeditionSceneMenuChestEventItem>;
	private var currentSelectedID = String.Empty;






	public function Init(): void {
		super.Init();
		btnClose.Init();
		btnClose.OnClick = OnCloseMenu;
		title.Init();

		divideLine.Init();
		divideLine.setBackground("between line", TextureType.DECORATION);

		confirmBtn.Init();
		confirmBtn.OnClick = OnConfirmBtnClick;
		confirmBtn.txt = Datas.getArString("Common.OK_Button");

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


		/* 设置 buff 的列表数据 */
		eventPointId = MistExpeditionManager.GetInstance().GetExpeditionCurrentEventPointIdBySlotId(param as String);

		MistExpeditionManager.GetInstance().GetChestItemCacheData(eventPointId, function (dataArray: Array) {


			scrollList.Clear();
			scrollList.SetData(dataArray);
			scrollList.ResetPos();


			/* 设置 item 的按钮的点击回调 */
			var itemArr: Array = scrollList.GetItemLists().ToArray();
			itemList = new System.Collections.Generic.List.<MistExpeditionSceneMenuChestEventItem>();
			for (var i = 0; i < itemArr.Count; i++) {
				var item = itemArr[i] as MistExpeditionSceneMenuChestEventItem;
				itemList.Add(item);
				item.SetViewMenu(this);
			}

			currentSelectedID = String.Empty;
			/* 初始化 选中状态 */
			OnItemSelectedFunc(currentSelectedID);

			SetConfirmBtnClickableState();

		});
	}

	public function OnPopOver(): void {
		scrollList.Clear();
	}




	/* 获得当前选中的 id */
	public function GetCurrentSelectedID(): String {
		return currentSelectedID;
	}



	/* 处理 刷新 item 的选中状态 */
	public function OnRefreshSelectStateFunc(itemID: String): boolean {
		return String.Equals(currentSelectedID, itemID);
	}


	/* 处理 item 的选中 状态 */
	public function OnItemSelectedFunc(selectedItemID: String): void {

		if (String.Equals(currentSelectedID, selectedItemID))
			return;

		currentSelectedID = selectedItemID;
		for (var i = 0; i < itemList.Count; i++) {
			itemList[i].SetSelectState(String.Equals(selectedItemID, itemList[i].ItemID));
		}
		SetConfirmBtnClickableState();

	}

	/* 设置确认按钮的当前可点击状态 */
	private function SetConfirmBtnClickableState() {
		confirmBtn.EnableBlueButton(!String.IsNullOrEmpty(currentSelectedID));
	}


	private function OnCloseMenu(): void {
		MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_ChestEvent);
	}

	/* 点击 确认按钮 */
	private function OnConfirmBtnClick(): void {

		var okFunc: Function = function (result: HashObject) {

			MistExpeditionManager.GetInstance().ClearChestItemCacheData();

			var callbackFunc: Function = function (res: HashObject) {

				KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());
				OnCloseMenu();
			};
			/*更新 远征数据*/
			MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(callbackFunc);
		};

		/* 领取奖励 */
		UnityNet.reqMistExpeditionEventReceiveReward(false, eventPointId, currentSelectedID, okFunc, null);

	}


}