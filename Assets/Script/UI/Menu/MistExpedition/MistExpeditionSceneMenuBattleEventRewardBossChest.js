/*
 * @FileName:		MistExpeditionSceneMenuBattleEventRewardBossChest.js
 * @Author:			lisong
 * @Date:			2022-08-08 10:25:59
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 战斗 - boss 奖励
 *
*/


public class MistExpeditionSceneMenuBattleEventRewardBossChest extends KBNMenu {

	@Space(30) @Header("---------- MistExpedition - BattleEvent - Reward BossChest ----------")


	/*-----------------*/
	@Space(20)
	@SerializeField private var bg: Label;
	@SerializeField private var backFrame: Label;

	/*--------- chest --------*/
	@Space(20)
	@SerializeField private var chest:Label;
	@SerializeField private var chestLight: FlashLabel;
	/*--------- chest item --------*/
	@SerializeField private var chestItemPrefab: GameObject;

	/*-----------------*/
	@Space(20)
	@SerializeField private var confirmBtn: BlowUpButton;

	
	/*----------chset anime -------*/
	@Space(20) @Header("---------- chset anime ----------")
	@SerializeField private var showChestTime: float = 1.0f;
	@SerializeField private var showChestItemSpanTime: float = 0.1f;
	@SerializeField private var mulSpeed: float = 1.0f;
	@SerializeField private var chestFromScale = Vector2.one;
	@SerializeField private var chestToScale = Vector2.one;

	@Space(20) @Header("---------- chset item anime ----------")
	@SerializeField private var chestItemFromScale = Vector2.zero;
	@SerializeField private var chestItemToScale = Vector2.one;

	@Space(20)
	@SerializeField private var chestItemColumnCount: int = 3;
	@SerializeField private var chestItemCenter: Vector2 = Vector2.zero;
	@SerializeField private var chestItemSpacing: Vector2 = Vector2.zero;

	/*-----------------*/
#if UNITY_EDITOR
	@Space(20) @Header("---------- Editor Test ----------")
	@SerializeField private var isTest= false;
	@SerializeField private var showChestItemCount: int = 5;
#endif

	/*-----------------*/

	private var timer: float = 0f;
	private var chestAnimeStep: int = 0;
	private var chestItemActiveIndex: int = 0;
	private var chestItemAnimeTimer: float = 0f;


	private var itemCount :int = 0;
	private var itemList: List.<MistExpeditionSceneMenuBattleEventRewardBossChestItem> = null;






	public function Init() {
		 

		chest.Init();
		chest.mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box", TextureType.BUTTON);

		chestLight.Init();
		chestLight.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light", TextureType.DECORATION);
		chestLight.From = 0.4f;
		chestLight.To = 1.0f;
		chestLight.Times = 1f;
		chestLight.Begin();

	



		/*-----------------*/

		bg.Init();
		backFrame.Init();

		bg.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent", TextureType.DECORATION);
		bg.rect = new Rect(0, -20, rect.width, rect.height + 40);

		confirmBtn.Init();
		confirmBtn.OnClick = OnConfirmBtnClick;
		confirmBtn.txt = Datas.getArString("Common.OK_Button");
		confirmBtn.setNorAndActBG("button_60_blue_normalnew", "button_60_blue_downnew");
	}






	protected function DrawBackground() {
		if (!visible) return;

		bg.Draw();
		backFrame.Draw();


	}



	function DrawItem() {
		if (!visible) return;

		chestLight.Draw();
		chest.Draw();

		if (itemList != null) {
			for (var i: int = 0; i < itemList.Count; i++) {
				itemList[i].Draw();
			}
		}

		confirmBtn.Draw();

	}


	public function Update() {


		timer += Time.deltaTime;

		if (chestAnimeStep == 0 && timer >= showChestTime){
			chestAnimeStep = 1;
			chest.SetVisible(true);
			chestLight.SetVisible(true);

		} else if (chestAnimeStep == 1) {
			DoChestAnime();

		} else if (chestAnimeStep == 2 && timer >= chestItemAnimeTimer) {

			chestItemAnimeTimer = timer + showChestItemSpanTime;

			if (chestItemActiveIndex < itemList.Count && itemList[chestItemActiveIndex] != null) {
				itemList[chestItemActiveIndex].Active();
				itemList[chestItemActiveIndex].SetVisible(true);
			}

			chestItemActiveIndex++;

			if (chestItemActiveIndex >= itemList.Count) {
				chestAnimeStep = -1;
				setBoxDisable();
			}

		}

			



		if (chestLight.visible) {
			chestLight.rect.x = chest.rect.x - 50;
			chestLight.rect.y = chest.rect.y - 50;
			chestLight.rect.width = chest.rect.width + 100;
			chestLight.rect.height = chest.rect.height + 100;
			chestLight.Update();
		}

		if (itemList != null) {
			for (var i: int = 0; i < itemList.Count; i++) {
				itemList[i].Update();
			}
		}

		if (confirmBtn.visible)
			confirmBtn.Update();
		
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


	public function OnPush(param: Object) {

		var dataDict = MistExpeditionManager.GetInstance().GetBossChestRewardData();

		itemList = new List.<MistExpeditionSceneMenuBattleEventRewardBossChestItem>();

#if UNITY_EDITOR
		if (isTest) {
			dataDict = new Dictionary.<String, int>();
			for (var i: int = 0; i < showChestItemCount; i++) {
				dataDict.Add(i+"",99);
			}
		}
#endif

		for (var kv: KeyValuePair.<String, int> in dataDict) {
			var item = GameObject.Instantiate(chestItemPrefab).GetComponent.<MistExpeditionSceneMenuBattleEventRewardBossChestItem>();
			item.Init();
			item.SetVisible(false);

			item.SetData(kv.Key, kv.Value);

			item.SetAnimeForm(new Vector2(chest.rect.x, chest.rect.y), chestItemFromScale);
			item.animeCallback = OnItemAnimePlayFinish;

			itemList.Add(item);

			/* 直接 添加到背包里面 */
			var id: int = _Global.INT32(kv.Key);
			var count: int = kv.Value;

			MyItems.instance().AddItem(id, count);


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
				}

			}

		}




		itemCount = itemList.Count;


		timer = 0.0f;
		chestAnimeStep = 0;
		chestItemActiveIndex = 0;

		chest.scaleX = chestFromScale.x;
		chest.scaleY = chestFromScale.y;


	}








	/* 宝箱动画 */
	private function DoChestAnime() {
		var val = mulSpeed * Time.deltaTime;

	
		chest.scaleX = Mathf.Lerp(chest.scaleX, chestToScale.x, val);
		chest.scaleY = Mathf.Lerp(chest.scaleY, chestToScale.y, val);


		if (Mathf.Abs(chest.scaleX - chestToScale.x) < 0.001f){
			chest.mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box_open", TextureType.BUTTON);		
			chestAnimeStep = 2;
			chestItemAnimeTimer = timer + showChestItemSpanTime;
			chestItemActiveIndex = 0;

			/* 没有物品数据，则直接显示 确认按钮 */
			if (itemList.Count <= 0) {
				OnItemAnimePlayFinish();
			}
		}
	}

	private function setBoxDisable() {
		chest.SetVisible(false);
		chestLight.SetVisible(false);

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

#if UNITY_EDITOR
		if(isTest){
			MenuMgr.instance.PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventRewardBossChest);
			return;
		}
#endif
		

		var okFunc: Function = function (result: HashObject) {
			MenuMgr.instance.PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventRewardBossChest);
			/* 更新 当前远征的 远征币数量 */
			MistExpeditionManager.GetInstance().UpdateExpeditioneCoinState(result);
			/* 显示完成远征的最后结算、退出迷雾远征 */
			MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult, "0_1_1", "trans_zoomComp");
		};

		UnityNet.reqMistExpeditionSettlement(okFunc,null);
	}



	/*------------------------------------*/

	public class ChestItemList {
		public var list  = new List.<MistExpeditionSceneMenuBattleEventRewardBossChestItem>();

	}

}
