/*
 * @FileName:		MistExpeditionMapController.js
 * @Author:			lisong
 * @Date:			2022-03-29 03:21:56
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 地图控制器
 *
*/

#pragma strict


public class MistExpeditionMapController extends SlotBuildController {

	@Space(30) @Header("---------- MistExpedition Map Controller ----------")

	@SerializeField private var slotPosTrans: Transform;


	private var lastSceneLevel: int;

	private var mapSlotDic: System.Collections.Generic.Dictionary.<String, MistExpeditionMapSlot>;












	public function Awake() {
		super.Awake();

		curCamera = gameObject.Find("MistExpeditionMapCamera").GetComponent.<Camera>();
		viewRect = curCamera.pixelRect;

		Init();
		GameMain.instance().onLevelLoaded(GameMain.MISTEXPEDITION_LEVEL, this);
	}


	public function Init() {
		mapSlotDic = System.Collections.Generic.Dictionary.<String, MistExpeditionMapSlot>();
 
		for (var i: int = 1; i <= MistExpeditionManager.SLOT_ROW_COUNT; i++) {
			for (var j: int = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {

				var slotName = i + "_" + j;
				var trans = slotPosTrans.Find(slotName);

				if (trans == null || IsSlotExist(slotName))
					continue;

				var mapSlot = trans.GetComponent.<MistExpeditionMapSlot>();
				mapSlotDic.Add(slotName, mapSlot);
				mapSlot.Init(this);
			}
		}
	}

	public function toFront() {

		ResetState();

		gameObject.SetActiveRecursively(true);
		curCamera.gameObject.SetActive(true);

		updateCloudRange();
		updateBirdRange(curScaleFactor);
		SetLevelObjsVisible(false);

		RefreshMap();

		EnableAllMapSlotClickEvent();
		KBN.Game.Event.RegisterHandler(KBN.EventId.MistExpeditionMapRefresh, OnEvent_MistExpeditionMapRefresh);
		KBN.Game.Event.RegisterHandler(KBN.EventId.MistExpeditionBattling, OnEvent_MistExpeditionBattling);
	}


	public function	toBack() {
		super.toBack();
		KBN.Game.Event.UnregisterHandler(KBN.EventId.MistExpeditionMapRefresh, OnEvent_MistExpeditionMapRefresh);
		KBN.Game.Event.UnregisterHandler(KBN.EventId.MistExpeditionBattling, OnEvent_MistExpeditionBattling);
	}

	public function OnHitSlot(slotId: int) {

	}


/*----------------------------------- public ----------------------------------------------*/

	public function hitSlot(raycastHit: RaycastHit) {

		var slotID: String = raycastHit.transform.parent.name;


		if (IsSlotExist(slotID)) {

			mapSlotDic[slotID].OnClick();

		}

	}





	/* 存储 加载 迷雾远征场景之前的 场景 */
	public function SetLastSceneLevel(level: int) {
		lastSceneLevel = level;
	}

	/* 获得 迷雾远征 返回时的场景 */
	public function GetBackToSceneLevel(): int {
		if (lastSceneLevel >= KBN.GameMain.CITY_SCENCE_LEVEL && lastSceneLevel <= KBN.GameMain.WORLD_SCENCE_LEVEL) {
			return lastSceneLevel;
		}
		else {
			return KBN.GameMain.CITY_SCENCE_LEVEL;
		}
	}

	/* 启用 map slot 的点击 */
	public function EnableMapSlotClickEvent(slotID: String) {
		SetMapSlotClickState(slotID, true);
	}

	/* 启用 所有的 map slot 的点击 */
	public function EnableAllMapSlotClickEvent() {
		for (var i: int = 1; i <= MistExpeditionManager.SLOT_ROW_COUNT; i++) {
			for (var j: int = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				EnableMapSlotClickEvent(i + "_" + j);
			}
		}
	}

	/*禁止 map slot 的点击 */
	public function DisableMapSlotClickEvent(slotID: String) {
		SetMapSlotClickState(slotID, false);
	}

	/* 禁止所有的 map slot 的点击 */
	public function DisableAllMapSlotClickEvent() {
		for (var i: int = 1; i <= MistExpeditionManager.SLOT_ROW_COUNT; i++) {
			for (var j: int = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				DisableMapSlotClickEvent(i + "_" + j);
			}
		}
	}


	

	/*----------------------------------- private ----------------------------------------------*/
	/* 事件广播-更新地图显示状态 */
	private function OnEvent_MistExpeditionMapRefresh(Sender: Object, e: GameFramework.GameEventArgs) {
		 
		RefreshMap();
	}

	/* 事件广播 - 战斗进行中 */
	private function OnEvent_MistExpeditionBattling(Sender: Object, e: GameFramework.GameEventArgs) {
		var args = e as KBN.MistExpeditionBattleAnimeEventArgs;

		var slotId = MistExpeditionManager.GetInstance().GetMapSlotIdByEventPointId(args.EventPointId);

		SetSlotBattleAnimeState(slotId, args.IsBattling);
	}
	

	/* 设置 map slot 的 点击触发状态 */
	private function SetMapSlotClickState(slotName: String, isState: boolean) {
		if (IsSlotExist(slotName)) {
			mapSlotDic[slotName].SetColliderState(isState);
		}

	}


 


 


	/* 地图结构
	 *  
	 *	缩略图			  编号结构图
	 *	
	 *	  #		|			15_3
	 *			|
	 *   # #	|		14_2	14_4
	 *			|
	 *  # # #	|	13_1	13_3	13_5
	 *			|
	 *   # #	|		12_2	12_4
	 *			|
	 *  # # #	|	11_1	11_3	11_5
	 *			|
	 *   # #	|		10_2	10_4
	 *			|
	 *  # # #	|	9_1		9_3		9_5
	 *			|
	 *   # #	|		8_2		8_4
	 *			|
	 *  # # #	|	7_1		7_3		7_5
	 *			|
	 *   # #	|		6_2		6_4
	 *			|
	 *  # # #	|	5_1		5_3		5_5
	 *			|
	 *   # #	|		4_2		4_4
	 *			|
	 *  # # #	|	3_1		3_3		3_5
	 *			|
	 *   # #	|		2_2		3_4
	 *			|
	 *  # # #	|	1_1		1_3		1_5
	 *
	 *  
	 * */







	/*
	 *
	 *
	 * =====================
	 *
	 * 构建 迷雾远征 的 map
	 *
	 * =====================
	 *
	 *
	 * */
	private function RefreshMap() {


		/* 在后端传的数据有问题的情况下，仍然把所有的 slot 都显示，去掉时间点内容  */
		if (mapSlotDic != null) {
			for (var keyValue: KeyValuePair.<String, MistExpeditionMapSlot> in mapSlotDic) {
				var mapSlot = keyValue.Value as MistExpeditionMapSlot;
				mapSlot.ShowSlot();
				mapSlot.ForbidSlot();

			}
		}
		/*-----------------------------------------------------------------*/



		var slotPosInfo = MistExpeditionManager.GetInstance().GetCurrentSlotPosInfo();
		var layer = slotPosInfo[0];
		var index = slotPosInfo[1];
		var currentSlotID = MistExpeditionManager.GetInstance().GetCurrentSlotID();
		/* 已经选择了slot */
		var currentSlotState = MistExpeditionManager.GetInstance().GetSelectSlotStateBySlotID(currentSlotID);

		var i: int = 0;
		var j: int = 0;
		var slotID: String = String.Empty;





		/* --------------------- 当前 current id 层以下  */
		var selectedList = MistExpeditionManager.GetInstance().GetSelectedSlotList();
		var lastFinishedSlotID = String.Empty;
		/* 如果当前的 slot 完成了，那么最后的完成 slot 就是当前的 slot*/
		if (currentSlotState.win) {
			lastFinishedSlotID = currentSlotID;
		} else {
			/*否则的话就是 完成路径点的倒数第2个点 */
			if (selectedList.Count > 1) {
				lastFinishedSlotID = selectedList[selectedList.Count - 2];
			}
		}
		

		for (i = 1; i < layer; i++) {
			for (j = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				slotID = i + "_" + j;

				if (!IsSlotExist(slotID))
					continue;

				/* 已经完成的slot的路径的显示 */
				if (selectedList.Contains(slotID)) {
					mapSlotDic[slotID].ClearSlot();
					mapSlotDic[slotID].ForbidSlot();

					/* 将 flag 放在最后完成的 slot 上*/
					if (String.Equals(lastFinishedSlotID, slotID)) {
						mapSlotDic[slotID].AddSlotFlagObj();
					}

				} else {
					mapSlotDic[slotID].HideSlot();

				}
			}
		}


		/* ---------------------当前层  */

		if (layer == 0) {
			/* 初次进入迷雾远征，初始化地图即可 */
			for (j = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				slotID = 1 + "_" + j;

				if (!IsSlotExist(slotID))
					continue;

				mapSlotDic[slotID].ClearSlot();
				mapSlotDic[slotID].CreateSlot(MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID));
				mapSlotDic[slotID].AddSlotArrowObj();
				mapSlotDic[slotID].ActiveSlot();
			}

		} else {
		
			if (currentSlotState.pointId == 1) {
				Debug.LogError(" 选择列表中没有 该 slot id:" + currentSlotID + " ，后端数据出现错误！！！！！");
				 
			} else {
				i = layer;
				for (j = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
					slotID = i + "_" + j;

					if (!IsSlotExist(slotID))
						continue;

					if (String.Equals(currentSlotID, slotID)) {

						if (!currentSlotState.win) {
							/* 事件没有完成 */
							mapSlotDic[slotID].CreateSlot(MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID));

							mapSlotDic[slotID].SelectSlot();
						} else {
							/* 事件已经完成 */
							mapSlotDic[slotID].ClearSlot();
							mapSlotDic[slotID].AddSlotFlagObj();

							/* 奖励已经领取 */
							if (currentSlotState.reward) {
								mapSlotDic[slotID].ForbidSlot();
							} else {
								var eventType = MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID);
								mapSlotDic[slotID].SetSlotEventType(MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID));
								mapSlotDic[slotID].UncompleteSlot();
								/* 显示出奖励宝箱*/
								/*if (eventType == MistExpeditionMapSlotEventType.Battle_Boss)*/
								{
									mapSlotDic[slotID].AddSlotChestRewardObj();
									mapSlotDic[slotID].DeleteSlotEventObj();
								}
							}
						}

					} else {
						
						/* 如果当前的 slot 事件已将已完成，就需要将其他的 slot 事件隐藏 */
						if (currentSlotState.win) {
							mapSlotDic[slotID].HideSlot();
						} else {
							mapSlotDic[slotID].ClearSlot();
							mapSlotDic[slotID].ForbidSlot();
						}

					}
				}
			}

			/* --------------------- 当前层的上 1 层, 可选择的层 */
			/* 当只有已经选择了事件点后，才会出现对之后一层的状态的设置操作 */
			var isNextCanSelect = currentSlotState.win && currentSlotState.reward;

			i = layer + 1;

			for (j = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				slotID = i + "_" + j;

				if (!IsSlotExist(slotID))
					continue;

				mapSlotDic[slotID].CreateSlot(MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID));

					/* 当可以激活时，只激活相邻的 slot */
				if (isNextCanSelect && (index + 1 == j || index - 1 == j)) {

					mapSlotDic[slotID].AddSlotArrowObj();
					mapSlotDic[slotID].ActiveSlot();
				}
				else {
					mapSlotDic[slotID].DeleteSlotArrowObj();
					mapSlotDic[slotID].InactiveSlot();
				}
			}


		}


		

		/* ---------------------当前层的上 2 层及以上, 其余尚未激活的层 */

		for (i = layer + 2; i <= MistExpeditionManager.SLOT_ROW_COUNT; i++) {
			for (j = 1; j <= MistExpeditionManager.SLOT_IN_ROW_MAX_COUNT; j++) {
				slotID = i + "_" + j;
				if (!IsSlotExist(slotID))
					continue;

				mapSlotDic[slotID].ClearSlot();
				mapSlotDic[slotID].CreateSlot(MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID));
				mapSlotDic[slotID].InactiveSlot();
			}
		}

	}

	/*
	 * 设置 slot 在战斗事件中的显示
	 * 战斗中是需要显示战斗动画，战斗结束后需要隐藏动画
	 */
	private function SetSlotBattleAnimeState(slotId: String, isBattling: boolean) {

		if (!IsSlotExist(slotId)) return;

		if (isBattling) {
			mapSlotDic[slotId].AddSlotBattleAnimeObj();
			mapSlotDic[slotId].DeleteSlotEventObj();
			mapSlotDic[slotId].DeleteSlotArrowObj();

		} else {
			mapSlotDic[slotId].CreateSlotByCurrentEventType();
			mapSlotDic[slotId].AddSlotArrowObj();
			mapSlotDic[slotId].DeleteSlotBattleAnimeObj();
		}

	}

	/* slot 是否存在 */
	private function IsSlotExist(slotID: String): boolean {
		return mapSlotDic.ContainsKey(slotID);
	}

}


