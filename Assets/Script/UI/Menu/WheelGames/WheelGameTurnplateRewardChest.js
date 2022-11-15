/*
 * @FileName:		WheelGameTurnplateRewardChest.js
 * @Author:			xue
 * @Date:			2022-11-04 05:22:47
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 宝箱自动打开事件点
 *
*/


public class WheelGameTurnplateRewardChest extends KBNMenu {

	@Space(30) @Header("---------- WheelGame - Turnplate - Reward - Chest ----------")


	/*-----------------*/
	@Space(20)
	@SerializeField private var bg: Label;
	@SerializeField private var backFrame: Label;

	/*--------- chest item --------*/
	@SerializeField private var chestItemPrefab: GameObject;

	/*-----------------*/
	@Space(20)
	@SerializeField private var confirmBtn: BlowUpButton;

	@Space(20) @Header("---------- chset item anime ----------")
	@SerializeField private var chestItemFromScale = Vector2.zero;
	@SerializeField private var chestItemToScale = Vector2.one;

	@Space(20)
	@SerializeField private var chestItemColumnCount: int = 3;
	@SerializeField private var chestItemCenter: Vector2 = Vector2.zero;
	@SerializeField private var chestItemSpacing: Vector2 = Vector2.zero;

	private var itemCount: int = 0;
	private var itemList: List.<WheelGameTurnplateRewardChestItem> = null;
	private var callBack: Function;
	@SerializeField private var m_type: int;


	public function Init() {

		bg.Init();
		backFrame.Init();

		bg.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent", TextureType.DECORATION);
		bg.rect = new Rect(0, -20, rect.width, rect.height + 40);

		confirmBtn.Init();
		confirmBtn.OnClick = OnConfirmBtnClick;
		confirmBtn.txt = Datas.getArString("Common.OK_Button");
		confirmBtn.setNorAndActBG("button_60_blue_normalnew", "button_60_blue_downnew");
	}


	public function Update() {
		if (itemList != null) {
			for (var i: int = 0; i < itemList.Count; i++) {
				itemList[i].Update();
			}
		}
		if (confirmBtn.visible)
			confirmBtn.Update();
	}


	public function OnPush(param: Object) {

		var data: HashObject = param as HashObject;
		itemList = new List.<WheelGameTurnplateRewardChestItem>();
		callBack = data["callBack"].Value as Function;
		m_type = _Global.INT32(data["type"]);

		if (m_type == 0) {
			var dataDict = data["Dic"].Value as Dictionary.<String, int>;
			for (var kv: KeyValuePair.<String, int> in dataDict) {
				var item = GameObject.Instantiate(chestItemPrefab).GetComponent.<WheelGameTurnplateRewardChestItem>();
				item.Init();

				item.SetData(kv.Key, kv.Value);

				item.animeCallback = OnItemAnimePlayFinish;

				itemList.Add(item);

				/* 直接 添加到背包里面 */
				var dict_Id: int = _Global.INT32(kv.Key);
				var count: int = kv.Value;
				MyItems.instance().AddItem(dict_Id, count);
			}
			chestItemSpacing.x = 150;
			chestItemSpacing.y = 150;
		}
		else if (m_type == 9) {
			var dataArray = data["array"].Value as Array;
			for (var ii: int = 0; ii < dataArray.length; ii++) {

				var item2 = GameObject.Instantiate(chestItemPrefab).GetComponent.<WheelGameTurnplateRewardChestItem>();
				item2.Init();

				var arrayKey: String = dataArray[ii].ToString();
				item2.SetData(arrayKey, 0);

				item2.animeCallback = OnItemAnimePlayFinish;

				itemList.Add(item2);

				/* 直接 添加到背包里面 */
				var array_Id: int = _Global.INT32(arrayKey);
				MyItems.instance().AddItem(array_Id, 1);
			}
			chestItemSpacing.x = 200;
			chestItemSpacing.y = 200;
		}


		var columnList = new List.<ChestItemList>();
		var addCloumnIndex = -1;

		/* 将 item 进行分组 */
		for (var j: int = 0; j < itemList.Count; j++) {
			var val = j / chestItemColumnCount;
			if (addCloumnIndex == val) {
				columnList[addCloumnIndex].list.Add(itemList[j]);
			} else {
				addCloumnIndex = val;
				var cil = new ChestItemList();
				cil.list.Add(itemList[j]);
				columnList.Add(cil);
			}
		}

		if (columnList.Count > 0) {
			var centerYIndex = columnList.Count / 2;

			/* 当是 偶数行时，需要将每行的item向下位移，居中对齐 */
			var tempY: float = 0f;
			if (columnList.Count % 2 == 0) {
				tempY = chestItemSpacing.y / 2;
			}

			/* 针对每一行的 item yicenterPos 为中心，进行设置位置 */
			for (var k: int = 0; k < columnList.Count; k++) {
				var posY = (k - centerYIndex) * chestItemSpacing.y + chestItemCenter.y + tempY;

				var columnCenterXIndex = columnList[k].list.Count / 2;

				var tempX = 0f;
				/* 当是 偶数个时，需要将当前行的item向右位移，居中对齐 */
				if (columnList[k].list.Count % 2 == 0)
					tempX = chestItemSpacing.x / 2f;

				var n: int = 0;
				for (n = 0; n < columnList[k].list.Count; n++) {
					var toPos = new Vector2((n - columnCenterXIndex) * chestItemSpacing.x + chestItemCenter.x + tempX, posY);

					columnList[k].list[n].SetAnimeTo(toPos, chestItemToScale);
					columnList[k].list[n].DoAnime();
				}

			}

		}

	}


	protected function DrawBackground() {
		if (!visible) return;

		bg.Draw();
		backFrame.Draw();


	}


	public function DrawItem() {
		if (!visible) return;


		if (itemList != null) {
			for (var i: int = 0; i < itemList.Count; i++) {
				itemList[i].Draw();
			}
		}

		confirmBtn.Draw();

	}

	/* 物品的动画显示完成后在显示 确认按钮 */
	private function OnItemAnimePlayFinish() {
		itemCount--;
		if (itemCount <= 0) {
			confirmBtn.DefaultShow();
		}

	}



	/* 确认按钮 */
	private function OnConfirmBtnClick() {

		if (callBack != null) {
			callBack();
			MenuMgr.instance.PopMenu("WheelGameTurnplateRewardChest");
		} else {
		#if UNITY_EDITOR
			Debug.Log("<color=#FF008EFF> callBack为空 </color>");
		#endif
		}
	}

	/*------------------------------------*/

	public class ChestItemList {
		public var list = new List.<WheelGameTurnplateRewardChestItem>();

	}


	public function OnPopOver() {
		super.OnPopOver();


		if (itemList != null) {
			for (var i: int = 0; i < itemList.Count; i++) {
				Destroy(itemList[i].gameObject);
			}
		}
		itemList.Clear();
		itemList = null;

		confirmBtn.setNorAndActBG("none", "none");

	}

}
