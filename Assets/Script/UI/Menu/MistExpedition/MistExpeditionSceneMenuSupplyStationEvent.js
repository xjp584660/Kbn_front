/*
 * @FileName:		MistExpeditionSceneMenuSupplyStationEvent.js
 * @Author:			lisong
 * @Date:			2022-04-02 05:31:52
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 补给点
 *
*/


public class MistExpeditionSceneMenuSupplyStationEvent extends PopMenu {

	@Space(30) @Header("---------- MistExpedition - SceneMenu - SupplyStationEvent ----------")


	@Space(5) @Header("----------language key")
	@SerializeField private var langKey_menuTitle_Choose: String;
	@SerializeField private var langKey_menuTitle_Claim: String;
	@SerializeField private var langKey_comfire_btn: String;
	@Space(20)

	@SerializeField private var divideLine: Label;
	@SerializeField private var scrollList: ScrollList;
	@SerializeField private var confirmBtn: Button;


	@Space(20) @Header("1个item的时候的 界面、边框以及确认按钮的大小布局")
	@SerializeField private var oneItemRectY: float;
	@SerializeField private var oneItemRectH: float;
	@Space(5)
	@SerializeField private var oneItemFrameRectY: float;
	@SerializeField private var oneItemFrameRectH: float;
	@Space(5)
	@SerializeField private var oneItemConfirmBtnRectY: float;
	@SerializeField private var oneItemConfirmBtnRectH: float;
	@Space(10)
	@SerializeField private var item: MistExpeditionSceneMenuSupplyStationEventItem;



	/* 多个item时候的 界面大小布局 以及确认按钮的大小布局 */
	private var menuRectY: float;
	private var menuRectH: float;
	private var frameRectY: float;
	private var frameRectH: float;
	private var confirmBtnRectY: float;
	private var confirmBtnRectH: float;

	private var itemCount: int = 0;

	private var itemList: System.Collections.Generic.List.<MistExpeditionSceneMenuSupplyStationEventItem>;
	private var currentSelectedID = String.Empty;

	private var eventPointId = 0;





	public function Init(): void {
		super.Init();

		menuRectY = this.rect.y;
		menuRectH = this.rect.height;

		frameRectY = frameSimpleLabel.rect.y;
		frameRectH = frameSimpleLabel.rect.height;

		confirmBtnRectY = confirmBtn.rect.y;
		confirmBtnRectH = confirmBtn.rect.height;



		btnClose.Init();
		btnClose.OnClick = OnCloseMenu;
		title.Init();

		divideLine.Init();
		divideLine.setBackground("between line", TextureType.DECORATION);

		confirmBtn.Init();
		confirmBtn.OnClick = OnConfirmBtnClick;
		confirmBtn.txt = Datas.getArString(langKey_comfire_btn);

		item.Init();
		scrollList.Init(item);
		
	}


	public function DrawItem() {
		scrollList.Draw();

		divideLine.Draw();
		confirmBtn.Draw();
	}

	
    function FixedUpdate() {
		if (itemCount > 1  && scrollList != null)
			scrollList.Update();
	}

	public function OnPush(param: Object) {


		SetData(param);

		SetMenuSize();

		checkIphoneXAdapter();
	}

	public function OnPopOver(): void {
		scrollList.Clear();

		this.rect.y = menuRectY;
		this.rect.height = menuRectH;

		frameSimpleLabel.rect.y = frameRectY;
		frameSimpleLabel.rect.height = frameRectH;

		confirmBtn.rect.y = confirmBtnRectY;
		confirmBtn.rect.height = confirmBtnRectH;
	}


	/* 设置 buff 的列表数据 */
	private function SetData(param: Object): void {
		eventPointId = _Global.INT32(param);

		itemCount = 0;

		var array: Array = MistExpeditionManager.GetInstance().GetSupplyStationDataToArrByEventId(eventPointId);

		scrollList.Clear();
		scrollList.SetData(array);
		scrollList.ResetPos();

		itemCount = array.length;

		/* 设置 item 的按钮的点击回调 */
		var itemArr: Array = scrollList.GetItemLists().ToArray();
		itemList = new System.Collections.Generic.List.<MistExpeditionSceneMenuSupplyStationEventItem>();
		for (var i = 0; i < itemArr.Count; i++) {
			var item = itemArr[i] as MistExpeditionSceneMenuSupplyStationEventItem;
			itemList.Add(item);
			item.SetViewMenu(this);
		}

		currentSelectedID = String.Empty;
		/* 初始化 选中状态 */
		OnItemSelectedFunc(currentSelectedID);

		/* 当只有1个 item 时候，直接显示领取的状态 */
		if (itemCount == 1) {
			var data = array[0] as HashObject;
			currentSelectedID = data["itemid"].Value.ToString();
			if (itemList.Count >= 1) {
				itemList[0].HideSelectBtn();
			}

			SetConfirmBtnClickableState();
		}


	}

	/* 当只有1个 item 时候，直接显示领取的状态，界面也相应的做出调整 */
	private function SetMenuSize() {
		if (itemCount == 1) {
			title.txt = Datas.getArString(langKey_menuTitle_Claim);

			this.rect.y = oneItemRectY;
			this.rect.height = oneItemRectH;

			frameSimpleLabel.rect.y = oneItemFrameRectY;
			frameSimpleLabel.rect.height = oneItemFrameRectH;

			confirmBtn.rect.y = oneItemConfirmBtnRectY;
			confirmBtn.rect.height = oneItemConfirmBtnRectH;


		} else { 
			title.txt = Datas.getArString(langKey_menuTitle_Choose);

			this.rect.y = menuRectY;
			this.rect.height = menuRectH;

			frameSimpleLabel.rect.y = frameRectY; 
			frameSimpleLabel.rect.height = frameRectH;

			confirmBtn.rect.y = confirmBtnRectY;
			confirmBtn.rect.height = confirmBtnRectH;

			
		}
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
	private function SetConfirmBtnClickableState(){
		 confirmBtn.EnableBlueButton(!String.IsNullOrEmpty(currentSelectedID));
	}


	private function OnCloseMenu(): void {
		MenuMgr.instance.PopMenu(Constant.MistExpeditionConst.SceneMenu_SupplyStationEvent);
	}

	/* 点击 确认按钮 */
	private function OnConfirmBtnClick(): void {

		var okFunc: Function = function (result: HashObject) {

			var callbackFunc: Function = function (res: HashObject) {
				KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());
				OnCloseMenu();
			};

			/*更新 远征数据*/
			MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(callbackFunc);
		};

		/* 支援点/补给站 回复兵力 */
		UnityNet.reqMistExpeditionSupplyStation(eventPointId, okFunc, null);
	}

}