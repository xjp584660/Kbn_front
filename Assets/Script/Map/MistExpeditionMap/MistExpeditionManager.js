/*
 * @FileName:		MistExpeditionManager.js
 * @Author:			lisong
 * @Date:			2022-05-09 12:40:50
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 部队数据 的管理器
 *
*/

import System.Collections.Generic;

public class MistExpeditionManager {
	private static var instance: MistExpeditionManager = null;

	public static function GetInstance(): MistExpeditionManager {
		if (instance == null) {
			instance = new MistExpeditionManager();
		}
		return instance;
	}

	public static function Free() {
		instance = null;
	}







	/* 远征数据更新时，执行的回调方法 */
	private var expeditionDataUpdateCallbackList: List.<Function> = null;

	public function AddExpeditionDataUpdateCallback(func: Function) {
		if (expeditionDataUpdateCallbackList == null)
			expeditionDataUpdateCallbackList = new List.<Function>(); 

		if (!expeditionDataUpdateCallbackList.Contains(func))
			expeditionDataUpdateCallbackList.Add(func);
	}


	public function RemoveExpeditionDataUpdateCallback(func: Function) {
		if (expeditionDataUpdateCallbackList == null)
			expeditionDataUpdateCallbackList = new List.<Function>();

		if (expeditionDataUpdateCallbackList.Contains(func))
			expeditionDataUpdateCallbackList.Remove(func);
	}

	private var expeditionDataUpdateCallbackDic: Dictionary.<String, Function> = null;
	public function AddExpeditionDataUpdateCallbackDic(funcName : String , func: Function) {

		if (expeditionDataUpdateCallbackDic == null)
			expeditionDataUpdateCallbackDic = new Dictionary.<String, Function>();

		if (!expeditionDataUpdateCallbackDic.ContainsKey(funcName)) {
			expeditionDataUpdateCallbackDic[funcName] = func;
		}
	}

	public function RemoveExpeditionDataUpdateCallbackDic(funcName: String) {
		if (expeditionDataUpdateCallbackDic == null)
			expeditionDataUpdateCallbackDic = new Dictionary.<String, Function>();


		if (expeditionDataUpdateCallbackDic.ContainsKey(funcName)) {
			expeditionDataUpdateCallbackDic.Remove(funcName);
		}
	}

	/*执行回掉方法*/
	public function ExecuteExpeditionDataUpdateCallbackDic(funcName: String) {
		if (expeditionDataUpdateCallbackDic.ContainsKey(funcName)) {
			expeditionDataUpdateCallbackDic[funcName]();
		}
	}





	/*--------------------------- 解析远征入口数据 ----------------------------------*/
	/* 迷雾远征 入口 数据集合 */
	private var expeditionEntranceData: HashObject = null;

	/* 请求远征基础数据 */
	public function RequestMistExpeditionEntranceInfo(okFuncCallback: Function) {
		var okFunc: Function = function (result: HashObject) {
			expeditionEntranceData = result["result"];

			if (okFuncCallback != null)
				okFuncCallback(result);
		};

		var errorFunc: Function = function (errorMsg: String, errorCode: String) {
			Debug.Log("<color= #E79400FF>入口 数据 初始化 失败 </color>");
		};

		UnityNet.reqMistExpeditionEntranceInfo(okFunc, errorFunc);
	}


	/* 已经有了远征 入口 的缓存数据 */
	public function IsHaveExpeditionEntranceData(): boolean {
		return expeditionEntranceData != null;

	}


	/* 是否是 免费 次数  */
	public function GetExpeditionFreeTicket(): boolean {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("isFree"))
			return _Global.INT32(expeditionEntranceData["isFree"]) == 1;
		else
			return false;
	}


	/*当前 是否是 继续 远征*/
	public function IsMistExpeditionContinue(): boolean {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("isContinue"))
			return _Global.INT32(expeditionEntranceData["isContinue"]) == 1;
		else
			return false;
	}

	/*--------------------------- expedition time 下次刷新时间 ----------------------------------*/
	public function GetExpeditionRefreshTime(): long {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("nextRefreshTime"))
			return _Global.INT64(expeditionEntranceData["nextRefreshTime"]);
		else
			return 0;
	}



	/*--------------------------- expedition horn 远征号角 ----------------------------------*/


	/* 获得 远征号角 拥有的数量 */
	public function GetExpeditionHornHaveCount(): int {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("ticketCount"))
			return _Global.INT32(expeditionEntranceData["ticketCount"]);
		else
			return 0;

	}

	/*--------------------------- expedition count 远征次数 ----------------------------------*/


	/* 获得 远征 次数 */
	public function GetExpeditionCount(): int {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("FrequencyCount")) {


			if (expeditionData != null && expeditionData.Contains("FrequencyCount")) {

				expeditionEntranceData["FrequencyCount"] = expeditionData["FrequencyCount"];
				return _Global.INT32(expeditionEntranceData["FrequencyCount"]);

			} else {

				return _Global.INT32(expeditionEntranceData["FrequencyCount"]);

			}

		}
		else
			return 0;

	}

	/* 获得 远征号角 价格 */
	public function GetExpeditionHornHavePrice(): int {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("ticketCost"))
			return _Global.INT32(expeditionEntranceData["ticketCost"]);
		else
			Debug.Log("<color=#E79400FF> shadowgems 有问题 1086  </color>");

		return 30;
	}



	/* 获得 远征 总次数/限制次数 */
	public function GetExpeditionLimitCount(): int {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("limitCount"))
			return _Global.INT32(expeditionEntranceData["limitCount"]);
		else
			return 0;
	}

	/* 获得 远征 所有 带出 的远征币 数量 */
	public function GetExpeditionEntranceCoinCount(): int {
		if (expeditionEntranceData != null && expeditionEntranceData.Contains("totalCoin"))
			return _Global.INT32(expeditionEntranceData["totalCoin"]);
		else
			return 0;
	}




	/*
	 * =======================================================================================================================
	/* =======================================================================================================================
	*/

	/*--------------------------- 解析远征基础数据 ----------------------------------*/

	/* 迷雾远征数据集合 */
	private var expeditionData: HashObject = null;

	/* 请求远征基础数据 */
	public function RequestMistExpeditionMapInfo(okFuncCallback: Function) {
		var okFunc: Function = function (result: HashObject) {
			HandleExpeditionInitData(result);

			if (expeditionDataUpdateCallbackList != null) {
				for (var i: int = 0; i < expeditionDataUpdateCallbackList.Count; i++) {
					if (expeditionDataUpdateCallbackList[i] != null)
						expeditionDataUpdateCallbackList[i]();
				}
			}

			if (okFuncCallback != null)
				okFuncCallback(result);
		};

		var errorFunc: Function = function (errorMsg: String, errorCode: String) {
			if (okFuncCallback != null)
				okFuncCallback(null);
			Debug.Log("errorCode: " + errorCode + "\terrorMsg: " + errorMsg);
		};

		UnityNet.reqMistExpeditionMapInfo(okFunc, errorFunc);
	}

	/* 解析远征基础数据 */
	private function HandleExpeditionInitData(result: HashObject) {

		if (result != null) {
			expeditionData = result["result"];
			UpdateExpeditionMapData();
			UpdateLeaderID();
			UpdateTroopInfoFromRawData();
			UpdateExpeditionRouteState();
		}

	}

	/*--------------------------- expedition 缓存  数据 ----------------------------------*/


	/* 已经有了远征的缓存数据 */
	public function IsHaveExpeditionData(): boolean {
		return expeditionData != null;

	}


	/*--------------------------- expedition coin 远征金币----------------------------------*/

	/*
	 * --------------------
	 * 所有的远征 的远征币
	 * --------------------
	 */

	/* 获得远征币数量 */
	public function GetExpeditionCoinCount(): int {

		var totalCoin = 0;
		if (expeditionData != null && expeditionData.Contains("totalCoin"))
			totalCoin = _Global.INT32(expeditionData["totalCoin"].Value);

		return totalCoin;
	}
	

	/* 获得 消耗远征币 数量 */
	public function GetExpeditionConsumeCoinCount(): int {
		var consumeCoin = 0;

		if (expeditionData != null && expeditionData.Contains("consumeCoin"))
			consumeCoin = _Global.INT32(expeditionData["consumeCoin"].Value);

		return consumeCoin;
	}


	/* 获得 剩余远征币 数量 */
	public function GetExpeditionResidueCoinCount(): int {

		var residueCoin = 0;

		if (expeditionData != null && expeditionData.Contains("residueCoin"))
			residueCoin = _Global.INT32(expeditionData["residueCoin"].Value);

		return residueCoin;
	}


	/*
	 * --------------------
	 * 当前 远征的 远征币
	 * --------------------
	 */


	/* 获得 当前远征币数量 */
	public function GetCurrentExpeditionCoinCount(): int {

		var coin = 0;
		if (expeditionData != null && expeditionData.Contains("currentExpeditionTotalCoin"))
			coin = _Global.INT32(expeditionData["currentExpeditionTotalCoin"].Value);

		return coin;
	}


	/* 获得 当前远征消耗远征币 数量 */
	public function GetCurrentExpeditionConsumeCoinCount(): int {
		var coin = 0;

		if (expeditionData != null && expeditionData.Contains("currentExpeditionConsumeCoin"))
			coin = _Global.INT32(expeditionData["currentExpeditionConsumeCoin"].Value);

		return coin;
	}


	/* 获得 当前远征剩余远征币 数量 */
	public function GetCurrentExpeditionResidueCoinCount(): int {

		var coin = 0;

		if (expeditionData != null && expeditionData.Contains("currentExpeditionResidueCoin"))
			coin = _Global.INT32(expeditionData["currentExpeditionResidueCoin"].Value);

		return coin;
	}

	/*修改 当前远征剩余远征币 数量 */
	public function SetCurrentExpeditionResidueCoinCount(coin: int) {
		if (expeditionData != null && expeditionData.Contains("currentExpeditionResidueCoin"))
			expeditionData["currentExpeditionResidueCoin"].Value = coin.ToString();

	}

	/*	更新 当前远征的 远征币数量 */
	public function UpdateExpeditioneCoinState(result: HashObject) {
		if (result.Contains("result")) {
			if (result["result"].Contains("data")) {
				var data = result["result"]["data"];

				if (data.Contains("currentExpeditionTotalCoin") && expeditionData.Contains("currentExpeditionTotalCoin")) {
					expeditionData["currentExpeditionTotalCoin"] = data["currentExpeditionTotalCoin"];
				}

				if (data.Contains("currentExpeditionConsumeCoin") && expeditionData.Contains("currentExpeditionConsumeCoin")) {
					expeditionData["currentExpeditionConsumeCoin"] = data["currentExpeditionConsumeCoin"];
				}

				if (data.Contains("currentExpeditionResidueCoin") && expeditionData.Contains("currentExpeditionResidueCoin")) {
					expeditionData["currentExpeditionResidueCoin"] = data["currentExpeditionResidueCoin"];
				}

			}

		}
	}

	/* =======================================================================================================================
	*  ============================================ Expedition Map =========================================================
	*  =======================================================================================================================
	*
	*/


	private var expeditionMapConfigDataList : List.<KBN.DataTable.ExpeditionMap> = null;

	/* 更新远征地图数据
	 */
	private function UpdateExpeditionMapData() {

		if (expeditionMapConfigDataList == null)
			expeditionMapConfigDataList = new List.<KBN.DataTable.ExpeditionMap>();
		else
			expeditionMapConfigDataList.Clear();

		var mapDetailsData = "";
		if (expeditionData != null) {
			mapDetailsData = expeditionData["mapDetails"].Value as String;
			if (String.IsNullOrEmpty(mapDetailsData))
				mapDetailsData = expeditionData["mapDetails"].ToString();
		}



		if (String.IsNullOrEmpty(mapDetailsData))
			return;

		/* 解析数据
		 * "mapDetails": "{\"1090101\":[\"1090101\",\"9\",\"1\",\"1\",\"1\",\"\"],\"1090103\":[\"1090103\",\"9\",\"1\",\"3\",\"1\",\"\"],.....};

		 */

		var data: HashObject = JSONParse.defaultInst().Parse(mapDetailsData);

		for (var key: String in data.Table.Keys) {
			var state = new KBN.DataTable.ExpeditionMap();


			state.ID		= _Global.INT32(data[key][KBN._Global.ap + 0].Value);
			state.RANDOMID	= _Global.INT32(data[key][KBN._Global.ap + 1].Value);
			state.RCORD		= _Global.INT32(data[key][KBN._Global.ap + 2].Value);
			state.CCORD		= _Global.INT32(data[key][KBN._Global.ap + 3].Value);
			state.TYPE		= _Global.INT32(data[key][KBN._Global.ap + 4].Value);
			state.DROP		= data[key][KBN._Global.ap + 5].Value.ToString();

			expeditionMapConfigDataList.Add(state);

		}
	}





	/* 获得当前迷雾远征地图 配置数据 */
	public function GetCurrentMapConfigData(): List.<KBN.DataTable.ExpeditionMap> {
		if (expeditionMapConfigDataList == null)
			UpdateExpeditionMapData();

		return expeditionMapConfigDataList;
	}


/*
 * 获得对应战斗事件的 远征币奖励的数量
 *------------------------------------------
 *	battleEventTypeIntVal: 战斗事件类型（普通、精英、boss）的 int 值
 *	layer: slot id 中的layer id 值
 *
 *	GDS 中对应的 关卡ID 值格式如下:
 *	例如：112
 *
		a：关卡类型

		1.普通战斗
		2.精英战斗
		7.BOSS战斗
		9.玩家初始部队

		bc：层数
 */

	public function GetRewardExpeditionCoinCountBySlotID(battleEventTypeIntVal: int, slotID: String): int {
		return GetRewardExpeditionCoinCountBySlotLayerID(battleEventTypeIntVal, GetSlotPosInfo(slotID)[0]);
	}

	public function GetRewardExpeditionCoinCountBySlotID(battleEventType: MistExpeditionMapSlotEventType, slotID: String): int {
		return GetRewardExpeditionCoinCountBySlotLayerID(GetEventTypeIntValue(battleEventType), GetSlotPosInfo(slotID)[0]);
	}


	public function GetRewardExpeditionCoinCountBySlotLayerID(battleEventType: MistExpeditionMapSlotEventType, layer: int): int {
		return GetRewardExpeditionCoinCountBySlotLayerID(GetEventTypeIntValue(battleEventType), layer);
	}

	public function GetRewardExpeditionCoinCountBySlotLayerID(battleEventTypeIntVal: int, layer: int): int {
		var id = battleEventTypeIntVal * 100 + layer;
		var info = GetExpeditionBattleGDSInfo(id);
		var count = 0;
		if (info != null)
			count = info.REWARD_COIN;

		return count;
	}

	/*-------------------------------*/


	/*--------------------------- expedition event point 远征事件点 ----------------------------------*/


	/* 根据slot id 获得当前的对应 event point id */
	public function GetExpeditionCurrentEventPointIdBySlotId(slotId: String): int {
		var list = GetSlotPosInfo(slotId);
		var id = 1000000 + GetCurrentMapID() * 10000 + list[0] * 100 + list[1];
		return id;
	}


	/*-----------当前的 event point id -----------*/

	public function GetExpeditionCurrentEventPointId(): int {
		var currentEventPointId = 0;

		if (expeditionData != null) {
			var routeList = GetSelectedEventPointRouteList();
			if (routeList.Count > 0)
				currentEventPointId = routeList[routeList.Count - 1].pointId;
		}

		return currentEventPointId;
	}




	/*--------------------------- slot 地图块 ----------------------------------*/

	/* 地图中的 slot 的层数 */
	public static var SLOT_ROW_COUNT = 15;
	/* 每层中的 slot 的最大位置 */
	public static var SLOT_IN_ROW_MAX_COUNT = 5;





	/* 获得当前位置的 slot id */
	public function GetCurrentSlotID(): String {
		var eventPointId = GetExpeditionCurrentEventPointId();

		var currentSlotID = "0_0";
		if (eventPointId != 0) {
			currentSlotID = GetMapSlotIdByEventPointId(eventPointId);
		}

		return currentSlotID;
	}

	/* 获得当前的 slotID 的位置信息 */
	public function GetCurrentSlotPosInfo(): System.Collections.Generic.List.<int> {
		return GetSlotPosInfo(GetCurrentSlotID());
	}



	/* 是否是 boss战 */
	public function IsBossBattle(): boolean {
		return GetCurrentSlotPosInfo()[0] == SLOT_ROW_COUNT;
	}


	/*---------------------------  已经选中的slot的路由集合 seleted slot route list ----------------------------------*/


	/* 已经完成的路径集合 */
	public function GetSelectedEventPointRouteList(): List.<MistExpeditionEventPointState> {
		if(expeditionRouteList == null)
			UpdateExpeditionRouteState();

		return expeditionRouteList;
	}


	/*-----------------------------------------------------------------------------------------------*/


	/* 获得已经选择的slot 的集合，只要选择了的slot都会出现在这个集合中，无论完成与否 */
	public function GetSelectedSlotList(): List.<String>{
		var list = List.<String>();

		var routeList = GetSelectedEventPointRouteList();
		 
		for (var i = 0; i < routeList.Count; i++) {
			list.Add(GetMapSlotIdByEventPointId(routeList[i].pointId));
		}

		return list;
	}


	/* 获得 被选择的 slot ID 对应的 数据状态  */
	public function GetSelectSlotStateBySlotID(slotID: String): MistExpeditionEventPointState {

		var routeList = GetSelectedEventPointRouteList();

		for (var i = 0; i < routeList.Count; i++) {
			if (String.Equals(GetMapSlotIdByEventPointId(routeList[i].pointId), slotID)) {

				return routeList[i];
			}
		}

		return new MistExpeditionEventPointState();
	}

	/* 获得已经完成的被选择的slot 的集合 */
	public function IsSelectedSlotListContains(slotId: String): boolean {
	
		return GetSelectedSlotList().Contains(slotId);
	}

 
	/*
	 * 获得 slot 的事件类型
	 */
	public function GetCurrentMapSlotEventType(slotID: String): MistExpeditionMapSlotEventType {
		var eventPointId = GetCurrentMapEventPointIdBySlotId(slotID);

		var mapDataList = GetCurrentMapConfigData();

		for (var item: KBN.DataTable.ExpeditionMap in mapDataList) {
			if (item.ID == eventPointId)
				return GetEventTypeFromIntValue(item.TYPE);
		}

		return MistExpeditionMapSlotEventType.None;
	}





	/* 获得迷雾远征地图拼块 slot 的位置信息 */
	public static function GetSlotPosInfo(slotIDStr: String): System.Collections.Generic.List.<int> {
		var infoArr = slotIDStr.Split("_"[0]);

		var list = System.Collections.Generic.List.<int>();
		/* layer */
		list.Add(_Global.INT32(infoArr[0]));
		/* index */
		list.Add(_Global.INT32(infoArr[1]));

		return list;
	}




	/* 获得迷雾远征事件类型的 int 值 */
	public static function GetEventTypeIntValue(eventType: MistExpeditionMapSlotEventType): int {
		switch (eventType) {
			case MistExpeditionMapSlotEventType.Battle_Normal:
				return 1;
			case MistExpeditionMapSlotEventType.Battle_Elite:
				return 2;
			case MistExpeditionMapSlotEventType.Merchant:
				return 3;
			case MistExpeditionMapSlotEventType.SupplyStation:
				return 4;
			case MistExpeditionMapSlotEventType.Random:
				return 5;
			case MistExpeditionMapSlotEventType.Chest:
				return 6;
			case MistExpeditionMapSlotEventType.Battle_Boss:
				return 7;
			default:
				return 0;
		}

		return 0;
	}

	/* 通过 int 值获得迷雾远征事件类型 */
	public static function GetEventTypeFromIntValue(eventTypeIntVal: int): MistExpeditionMapSlotEventType {

		switch (eventTypeIntVal) {
			case 1:
				return MistExpeditionMapSlotEventType.Battle_Normal;
			case 2:
				return MistExpeditionMapSlotEventType.Battle_Elite;
			case 3:
				return MistExpeditionMapSlotEventType.Merchant;
			case 4:
				return MistExpeditionMapSlotEventType.SupplyStation;
			case 5:
				return MistExpeditionMapSlotEventType.Random;
			case 6:
				return MistExpeditionMapSlotEventType.Chest;
			case 7:
				return MistExpeditionMapSlotEventType.Battle_Boss;
			default:
				return MistExpeditionMapSlotEventType.None;
		}

		return MistExpeditionMapSlotEventType.None;
	}


	/* 获得 事件总数量 */
	public static function GetEventTypeCount(): int {
		return 7;
	}


	/* 将本地的slot id （15_3）转换成 MxpeditionMap 的 GDS 表中对应的 ID (1011503) */
	public function GetCurrentMapEventPointIdBySlotId(slotId: String): int {
		var mapID = GetCurrentMapID();
		var slotPos = GetSlotPosInfo(slotId);
		var row = slotPos[0] > 9 ? "" + slotPos[0] : "0" + slotPos[0];
		var column = slotPos[1] > 9 ? "" + slotPos[1] : "0" + slotPos[1];
		slotId = (mapID > 9 ? "1" + mapID : "10" + mapID) + row + column;

		return _Global.INT32(slotId);
	}

	/* 通过 event point Id 获得对应的 slot Id  */
	public function GetMapSlotIdByEventPointId(eventPointId: int): String {
		return GetMapSlotIdByEventPointId(eventPointId + "");
	}

	/* 通过 event point Id 获得对应的 slot Id  */
	public function GetMapSlotIdByEventPointId(eventPointId: String): String {
		/*从第3个开始是slot id */
		/* 转化成int 的目的是为了去除掉 小于10的数字的 0 */
		return _Global.INT32(eventPointId.Substring(3, 2)) + "_" + _Global.INT32(eventPointId.Substring(5, 2));
	}

	/*--------------------------- GDS 配置数据 ----------------------------------*/

	/* 获得 迷雾远征战斗事件点  的GDS配置数据 */
	public function GetExpeditionBattleGDSInfo(id: int): KBN.DataTable.ExpeditionBattle {
		var data = GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionBattle>();

		var info: KBN.DataTable.ExpeditionBattle = null;
		if (data != null) {
			info = data.GetItemById(id);
		}

		return info;
	}



	/* 获得当前远征地图的ID */
	public function GetCurrentMapID(): int {
		var mapID = 0;

		if (expeditionData != null) {
			mapID = _Global.INT32(expeditionData["towerMapId"].Value);
		}

		return mapID;
	}

	


	/* 获得 迷雾远征地图 的GDS配置数据 */
	public function GetMapConfigDataByMapID(id: int): List.<KBN.DataTable.ExpeditionMap> {
		var data = GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionMap>();

		var list: List.<KBN.DataTable.ExpeditionMap> = null;
		if (data != null) {
			list = data.GetMapConfigDataByMapID(id);
		}

		return list;
	}


	/* 获得 迷雾商人 的GDS配置数据 */
	public function GetMerChantDic(): Dictionary.<String, KBN.DataTable.IDataItem> {

		var gds = GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionMerChant>();
		if (gds != null) {
			return gds.GetItemDictionary();
		}
		return null;
	}



	/*--------------------------- March ID----------------------------------*/

	/* 获得已经创建过的 march id，新的战斗请求时会创建，战斗完成后会清除掉 */
	public function GetCurrentMarchID(): int {
		var marchId = 0;
		if (expeditionData != null) {
			marchId = _Global.INT32(expeditionData["march"].Value);
		}

		return marchId;
	}



	/*--------------------------- leader 领袖 ----------------------------------*/

	/* 领队id */
	private var leaderID: int = 0;

	/* 刷新 laeder id */
	private function UpdateLeaderID() {

		if (expeditionData != null && expeditionData.Contains("heroId"))
			leaderID = _Global.INT32(expeditionData["heroId"].Value);
	}
	/*  获得 leader 的 id */
	public function GetLeaderID(): int {
		return leaderID;
	}

	/* 设置 leader 的 id */
	public function SetLeaderID(id: int) {

		leaderID = id;
	}

	public function IsHaveLeader(): boolean {
		return GetLeaderID() != 0;
	}


	/* 获得当前的leader 的数据信息 */
	public function GetCurrentLeaderInfo(): MistExpeditionLeaderInfo {

		return GetLeaderInfoByID(GetLeaderID());
	}

	/* 通过 id 获得 量leader 的数据 信息 */
	public function GetLeaderInfoByID(id: int): MistExpeditionLeaderInfo {
		var leaderInfo: MistExpeditionLeaderInfo = new MistExpeditionLeaderInfo();
		var Dic: Dictionary.<String, KBN.DataTable.IDataItem> = GetLeaderDic();
		if (Dic != null) {
			var leaderID: String = id.ToString(); 
			if (Dic.ContainsKey(leaderID)) {
				var expeditionLeader: KBN.DataTable.ExpeditionLeader = Dic[leaderID] as KBN.DataTable.ExpeditionLeader;
				leaderInfo.ID = expeditionLeader.ID;
				leaderInfo.Head = expeditionLeader.ICON;
				leaderInfo.HeadBack = expeditionLeader.HEADBACKGROUND_ICON;
				leaderInfo.Name = expeditionLeader.NAME;
				leaderInfo.Description = expeditionLeader.DESCRIPTION;
				leaderInfo.Skill = expeditionLeader.BUFFS;
				leaderInfo.HeadIcon = expeditionLeader.HEAD_ICON;
				leaderInfo.alreadyOwned = true;
			}
		}

		return leaderInfo;
	}








	/*--------------------------- troop count 部队数量 ----------------------------------*/

 
	/*  获得派遣部队 troop 的总数量 */
	public function GetTroopTotalCount(): long {
		/* 901 是领袖战斗部队的数据ID */
		var total: long = _Global.INT64(GetExpeditionBattleGDSInfo(901).SENDTROOP_LIMIT);
		var buffDic: Dictionary.<String, KBN.DataTable.IDataItem> = GetBuffDic();
		var troopsIncreaseList: List.<int> = GetBuffTroopsIncrease();/*获取当前所有的派兵上限buffID*/
		var buffTotal: long;
		for (var i: int = 0; i < troopsIncreaseList.Count; i++) {
			var key: String = troopsIncreaseList[i].ToString();
			if (buffDic.ContainsKey(key)) {
				var troopsIncreaseBuff: KBN.DataTable.ExpeditionBuff = buffDic[key] as KBN.DataTable.ExpeditionBuff;
				buffTotal = buffTotal + _Global.INT32(troopsIncreaseBuff.VALUE);
			} else {
				#if UNITY_EDITOR
				Debug.Log("<color=#E79400FF>GetTroopTotalCount 获取当前所有的派兵上限buffID，有问题。查看742行</color>");
				#endif
			}
		}
		/*数值是 所有行军上限buff 叠加到一起 之后在算百分比*/
		total = total + (total * (buffTotal / 100f));/*行军上限这里的数值也是叠加的，不是乘奥*/

		return total;
	}
	

	/* 获得 当前已经选择部队的总数量 */
	public function GetChooseTroopCount(): long {

		var sum: long = 0;
		var dic = GetTroopInfoDic();
		for (var kv: KeyValuePair.<int, Barracks.TroopInfo> in dic) {
			sum += kv.Value.selectNum;

		}

		return sum;
	}


	/* 是否还有部队存在 */
	public function IsHaveTroop(): boolean {
		var sum: long = 0;
		var dic = GetTroopInfoDic();

		for (var kv: KeyValuePair.<int, Barracks.TroopInfo> in dic)
			sum += kv.Value.owned;

		return sum > 0;

	}

	/*--------------------------- troop info 部队信息 ------------------------------------------------*/

	private var troopInfoDic : Dictionary.< int, Barracks.TroopInfo> = null;
	/*
	 * 记录 所有的 部队选择的数量 保存在本地的数据 
	 */
	private static var local_mist_expedition_troop_select_cache_data_Dict = new System.Collections.Generic.Dictionary.<String, int>();




	private function UpdateTroopInfoFromRawData() {

		if (troopInfoDic != null)
			troopInfoDic.Clear();
		else
			troopInfoDic = new Dictionary.<int, Barracks.TroopInfo>();

		/* 没有远征领袖，表示远征还未开始，所以需要将缓存清空掉 */
		if (!IsHaveLeader())
			local_mist_expedition_troop_select_cache_data_Dict.Clear();

		var troopUnits: String = null;
		if (expeditionData != null) {
			troopUnits = expeditionData["survivedPlayerUnits"].Value as String;
			/* 上面的方式可能获得的 troopUnits 仍然为空，所以保险起见，需要使用下面的方式再获取下 */
			if (String.IsNullOrEmpty(troopUnits))
				troopUnits = expeditionData["survivedPlayerUnits"].ToString();
		}

		/* 数据是 空的，或者是 {} ，都不处理 */
		if (!String.IsNullOrEmpty(troopUnits) && !troopUnits.Equals("{}") && !troopUnits.Equals("{ }")) {
			/* "survivedPlayerUnits": "{\"31\":\"1000\",\"32\":\"1000\",\"33\":\"1000\"}",*/
			var data: HashObject = JSONParse.defaultInst().Parse(troopUnits);

			for (var key: String in data.Table.Keys) {
				var troop = new Barracks.TroopInfo();
				var count = _Global.INT32(data[key]);

				troop.typeId = _Global.INT32(key);
				troop.owned = count;

				var local_cache_key = "local_mist_expedition_troop_select_" + troop.typeId;
				if (local_mist_expedition_troop_select_cache_data_Dict.ContainsKey(local_cache_key))
					troop.selectNum = local_mist_expedition_troop_select_cache_data_Dict[local_cache_key];
				else
					troop.selectNum = 0;

				troop.troopName = Datas.getArString("unitName." + "u" + troop.typeId);
				troop.troopTexturePath = "ui_" + troop.typeId;

				if (!troopInfoDic.ContainsKey(troop.typeId))
					troopInfoDic.Add(troop.typeId, troop);
				else
					troopInfoDic[troop.typeId] = troop;


			}
		}


		CheckSelectNumAndUpdateLocalTroopInfo();

	}




	/*获取所有的 troop 列表信息的 字典数据*/
	public function GetTroopInfoDic(): Dictionary.<int, Barracks.TroopInfo> {

		if (troopInfoDic == null)
			UpdateTroopInfoFromRawData();

		return troopInfoDic;
	}


	/*获取所有的 troop 列表信息的 列表数据*/
	public function GetTroopInfoList(): List.<Barracks.TroopInfo> {
		var list = new List.<Barracks.TroopInfo>();
		var dic = GetTroopInfoDic();

		for (var kv: KeyValuePair.<int, Barracks.TroopInfo> in dic) {
			list.Add(kv.Value);
		}

		return list;
	}

	/*获取所有的 troop 列表信息的 数组数据*/
	public function GetTroopInfoArr(): Barracks.TroopInfo[] {
		var list = GetTroopInfoList();
		if (list != null)
			return list.ToArray();
		else
			return null;
	}




	/*获得 单条 troop 列表信息*/
	public function GetTroopInfoByID(id: int): Barracks.TroopInfo {
		var dic = GetTroopInfoDic();
		if (dic.ContainsKey(id)) {
			return dic[id];
		}

		else
			return null;
	}

	/*存储 troop 列表信息*/
	public function UpdateTroopInfo(troop: Barracks.TroopInfo) {
		var id = troop.typeId;
		var dic = GetTroopInfoDic();

		if (!dic.ContainsKey(id)) {
			dic.Add(id, troop);
		}
		else {
			dic[id].owned = troop.owned;
			dic[id].selectNum = troop.selectNum;
			dic[id].troopName = troop.troopName;
			dic[id].troopTexturePath = troop.troopTexturePath;
		}

		CheckSelectNumAndUpdateLocalTroopInfo();
	}



	/*
	 * 检测选择的兵力
	 * 然后 更新 本地记录的部队选择的兵力数据情况
	 *
	 * */
	private function CheckSelectNumAndUpdateLocalTroopInfo() {
		var keyStr = "local_mist_expedition_troop_select_";
		var dic = GetTroopInfoDic();

		/* 清除 本地缓存的 部队选中的数据信息 */
		local_mist_expedition_troop_select_cache_data_Dict.Clear();


		for (var kv: KeyValuePair.<int, Barracks.TroopInfo> in dic) {
			var troopKey = keyStr + kv.Value.typeId;

			/* 只记录 部队是有剩余兵量的 */
			if (kv.Value.owned > 0) {
				/* 选择的兵量 */
				var selectCount = kv.Value.selectNum;

				/* 是否超过了拥有的兵量（战斗中兵死了，减少了），超过就将其置为 拥有的兵量 */
				if (selectCount > kv.Value.owned)
					selectCount = kv.Value.owned;

				kv.Value.selectNum = selectCount;

				/* 更新本地缓存的数据 */
				if (!local_mist_expedition_troop_select_cache_data_Dict.ContainsKey(troopKey))
					local_mist_expedition_troop_select_cache_data_Dict.Add(troopKey, selectCount);
				else
					local_mist_expedition_troop_select_cache_data_Dict[troopKey] = selectCount;


			} else {
				kv.Value.selectNum = kv.Value.owned;

			}

		}
	}

	/* =======================================================================================================================
	 * ============================================ Expedition Route =========================================================
	 * =======================================================================================================================
	 * 
	*/
	private var expeditionRouteList: List.<MistExpeditionEventPointState> = null;

	/*更新远征的路径结果
	 *
	 * pointId：			事件点 id
	 * win：				是否完成（战斗胜利）
	 * rewardList：		战斗奖励列表
	 * rewardBuffId：	玩家选择的奖励 buff id
	 * reward：			玩家是否领取了奖励
	 */
	private function UpdateExpeditionRouteState() {

		if (expeditionRouteList == null)
			expeditionRouteList = new List.<MistExpeditionEventPointState>();
		else
			expeditionRouteList.Clear();

		var towerRouteData = "";
		if (expeditionData != null) {
			towerRouteData = expeditionData["towerRoute"].Value as String;
			if (String.IsNullOrEmpty(towerRouteData))
				towerRouteData = expeditionData["towerRoute"].ToString();
		}



		if (!String.IsNullOrEmpty(towerRouteData)) {
			/* 解析路径点数据
			 * "towerRoute": "[{\"pointId\":\"1080103\",\"win\":1,\"rewardList\":\"{\\\"6\\\":\\\"10231\\\",\\\"17\\\":\\\"10521\\\",\\\"15\\\":\\\"10441\\\"}\",\"rewardBuffId\":0,\"reward\":0}]",
			 */

			var data: HashObject = JSONParse.defaultInst().Parse(towerRouteData);

			for (var key: String in data.Table.Keys) {
				var state = new MistExpeditionEventPointState();
				state.pointId = _Global.INT32(data[key]["pointId"]);
				state.win = _Global.INT32(data[key]["win"]) != 0;	/* 只要不是0 ，就代表获胜 */
				state.reward = _Global.INT32(data[key]["reward"]) == 1;
				state.rewardBuffId = data[key]["rewardBuffId"].ToString();

				var routeDataStr = data[key]["rewardList"].Value as String;
				if (String.IsNullOrEmpty(routeDataStr))
					routeDataStr = data[key]["rewardList"].ToString();

				state.rewardList = new List.<String>();
				/* 检测最终是否有数据，然后再处理 */
				if (!String.IsNullOrEmpty(routeDataStr)) {
					var rewardListData: HashObject = JSONParse.defaultInst().Parse(routeDataStr);

					for (var key2: String in rewardListData.Table.Keys) {
						state.rewardList.Add(rewardListData[key2].Value as String);
					}
				}

				expeditionRouteList.Add(state);

			}
		}
		
		

		/*	------- “事件点选中” -------
		 * 由于开发设计问题，未对选中事件点做记录处理，所以现在的处理方式可行但是不规范
		 * 后端处理：
		 * 除战斗、远征商人外的其他事件点被选中后，状态会被先记录在 checkedPoint 中，在事件完成后会被添加到 路径集合中
		 * 前端处理：
		 * 比较字段是否已经存在 路径集合中，不存在的话就加进去
		 * 
		 * */

		var selectEventPointIdStr = "";
		if (expeditionData != null && expeditionData.Contains("checkedPoint")) {
			selectEventPointIdStr = expeditionData["checkedPoint"].Value as String;
			if (String.IsNullOrEmpty(selectEventPointIdStr))
				selectEventPointIdStr = expeditionData["checkedPoint"].ToString();
		}

		if (!String.IsNullOrEmpty(selectEventPointIdStr) && !String.Equals(selectEventPointIdStr,"0")) {
			var eventPointId = _Global.INT32(selectEventPointIdStr);
			var isExist = false;
			for (var k = 0; k < expeditionRouteList.Count; k++) {

				if (expeditionRouteList[k].pointId == eventPointId) {
					isExist = true;
					break;
				}
			}

			if (!isExist) {
				var newState = new MistExpeditionEventPointState();
				newState.pointId = eventPointId;
				newState.win = false;
				newState.reward = false;
				newState.rewardBuffId = "";
				newState.rewardList = new List.<String>();

				expeditionRouteList.Add(newState);

			}

		}


		/* 需要对 expeditionRouteList 中的数据进行排序处理，最后探险的事件点在最后位置 */
		var times = expeditionRouteList.Count - 1;

		for (var i = 0; i < times; i++) {

			for (var j = i; j < times; j++) {
				var data01 = expeditionRouteList[i];
				var data02 = expeditionRouteList[j + 1];


				if (data01.pointId > data02.pointId) {
					expeditionRouteList[i] = data02;
					expeditionRouteList[j + 1] = data01;
				}
			}

		}



	}

	/* ------------------------------------------------- 战斗界面显示预 战斗事件点 - 战力值 ------------------------------------------------- */

	/*
	 * 获得 战斗事件点的战力值
	 * battleEventTypeIntVal：战斗事件点类型
	 * layer：所在的层
	 */
	public function GetBattleEventMightBySlotID(battleEventTypeIntVal: int, layer: int): long{

		var info = GetExpeditionBattleGDSInfo(battleEventTypeIntVal * 100 + layer);


		var totalMight: long = 0;
		if (info == null)
			return totalMight;


		/* 31_1200;32_1200;33_1200 */
		var unitArr: String[] = info.UNIT.Split(";"[0]);

		var troopDataDict = new Dictionary.<int, long>();

		for (var i: int = 0; i < unitArr.length; ++i) {
			/* 31_1200 */
			var troopData: String[] = unitArr[i].Split("_"[0]);
			var id = _Global.INT32(troopData[0]);
			if (!troopDataDict.ContainsKey(id))
				troopDataDict.Add(id, _Global.INT64(troopData[1]));
		}


		for (var kv: KeyValuePair.< int, long > in troopDataDict) {

			var unitMight: int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTroopMight(Constant.TroopType.UNITS, kv.Key);
			totalMight += unitMight * kv.Value;
		}

	

		return totalMight;
	}


	public function GetBattleEventMightBySlotID(battleEventType: MistExpeditionMapSlotEventType, layer: int): long {
		return GetBattleEventMightBySlotID(GetEventTypeIntValue(battleEventType), layer);
	}

	/* ------------------------------------------------- 战斗界面显示预 奖励的物品 Preview Reward Item ------------------------------------------------- */
	/* 获得 战斗的预奖励物品信息
	 *
	 * normal战斗：只显示 蓝色随机预览物品
	 * elite战斗： 显示 蓝色、橘色 随机预览物品
	 * boss战斗：需要根据当前的远征次数来显示相应的物品
	 *				// 1_3:67791;4_100:68507  >  1_3是次数 第一到三次 掉落67791这个宝箱
	 *				
	 * */
	public function GetPreviewRewardItemDataListByBattleType(battleType: MistExpeditionMapSlotEventType): List.<Hashtable> {
		var itemList = new System.Collections.Generic.List.<Hashtable>();

		var battleTypeVal = GetEventTypeIntValue(battleType);

		switch (battleType) {
			case MistExpeditionMapSlotEventType.Battle_Normal:
				itemList.Add(new Hashtable({ "battleType": battleTypeVal , "itemID": 10001 }));
				break;
			case MistExpeditionMapSlotEventType.Battle_Elite:
				itemList.Add(new Hashtable({ "battleType": battleTypeVal , "itemID": 10002 }));
				itemList.Add(new Hashtable({ "battleType": battleTypeVal , "itemID": 10003 }));
				break;
			case MistExpeditionMapSlotEventType.Battle_Boss:

				try {
					var info: KBN.DataTable.ExpeditionBattle = GetExpeditionBattleGDSInfo(715);
					if (info != null) {
						var droopBuffStr = info.DROP_BUFF;
						if (!String.IsNullOrEmpty(droopBuffStr)) {

							var expeditionCount = GetExpeditionCount();

							/* 1_3:67791;4_100:68507  >  1_3是次数 第一到三次 掉落67791这个宝箱 */
							var buffArr: String[] = droopBuffStr.Split(";"[0]);
							for (var i: int = 0; i < buffArr.length; ++i) {
								/* 1_3:67791 */
								var infoArr: String[] = buffArr[i].Split(":"[0]);

								/* 物品存在 */
								if (infoArr.length > 1 && !String.IsNullOrEmpty(infoArr[0]) && !String.IsNullOrEmpty(infoArr[1])) {
									var posArr = infoArr[0].Split("_"[0]);

									var minPos = _Global.INT32(posArr[0]);
									var maxPos = _Global.INT32(posArr[1]);

									if (expeditionCount >= minPos && expeditionCount <= maxPos) {
										itemList.Add(new Hashtable({ "battleType": battleTypeVal , "itemID": _Global.INT32(infoArr[1]) }));
									}

								}
							}

						}
					}

				}
				catch (error: System.Exception) {
									#if UNITY_EDITOR
					Debug.Log("<color=#E79400FF>boss 的奖励物品数据有问题，查看battle GDS表 ，ID 715行数据 </color>");
									#endif
				}


				break;
			default:
				break;
		}

		return itemList;
	}


	/* ------------------------------------------------- Reward Item 奖励物品 ------------------------------------------------- */


	/*通过事件点id  获得战斗胜利奖励的物品数据 */
	public function GetRewardDataListByEventPointId(eventPointId: int): List.<String> {

		var data = new List.<String>();

		if (eventPointId == 0 || expeditionRouteList == null) {
			#if UNITY_EDITOR
			Debug.Log("<color=#E79400FF>没有奖励物品数据。eventPointId: " + eventPointId +"</color>");
			#endif
			return data;
		}


		for (var state: MistExpeditionEventPointState in expeditionRouteList) {
			if (eventPointId ==  state.pointId) {
				data = state.rewardList;
				break;
			}
		}

		return data;
	}


	/*通过事件点id 获得战斗胜利奖励的物品数据 Array 类型 */
	public function GetRewardDataArrayByEventPointId(eventPointId: int): Array {
		var array: Array = new Array();

		if (eventPointId == 0 || expeditionRouteList == null)
			return array;


		var dataList = GetRewardDataListByEventPointId(eventPointId);
		for (var buffId: String in dataList) {
			array.push(buffId);
		}

		return array;
	}

	/*通过 slot id  获得战斗胜利奖励的物品数据 */
	public function GetRewardDataListBySlotId(slotId: int): List.<String> {
		var eventPointId = GetExpeditionCurrentEventPointIdBySlotId(slotId + "");
		return GetRewardDataListByEventPointId(eventPointId);
	}

	/*通过 slot id 获得战斗胜利奖励的物品数据 Array 类型 */
	public function GetRewardDataArrayBySlotId(slotId: int): Array {
		var eventPointId = GetExpeditionCurrentEventPointIdBySlotId(slotId + "");
		return GetRewardDataArrayByEventPointId(eventPointId);
	}




	/* 获得 boss 战斗胜利后的奖励 物品缓存数据  dictionary <itemid,count> 类型  */
	public function GetBossChestRewardData(): Dictionary.<String, int>  {

		var dataDic = new Dictionary.<String, int>();

		var bossChestDataStr = "";
		if (expeditionData != null) {
			bossChestDataStr = expeditionData["bossChest"].Value as String;
			if (String.IsNullOrEmpty(bossChestDataStr))
				bossChestDataStr = expeditionData["bossChest"].ToString();
		}


		if (!String.IsNullOrEmpty(bossChestDataStr)) {
			var rewardListData: HashObject = JSONParse.defaultInst().Parse(bossChestDataStr);

			for (var key: String in rewardListData.Table.Keys) {
				var count = _Global.INT32(rewardListData[key]);

				if (dataDic.ContainsKey(key))
					dataDic[key] = count;
				else
					dataDic.Add(key, count);
			}
		}

		return dataDic;

	}

	/* ------------------------------------------------- Battle Result 战斗结果 ------------------------------------------------- */


	/*事件-战斗 结果缓存数据*/
	private var battleResultData: HashObject = null;
	/* 获得战斗结果数据 */
	public function GetBattleResultDataByEventId(eventPointId: int): HashObject {
		if (eventPointId == 0 || battleResultData == null || !battleResultData.Contains(eventPointId+"")) {
			#if UNITY_EDITOR
			Debug.Log("<color=#E79400FF>没有战斗结果数据。eventPointId: " + eventPointId +"</color>");
			#endif

			return GetDefaultBattleResult();
		}

		return battleResultData[eventPointId+""];
	}

	/* 保存战	斗结果数据 */
	public function SetBattleResultData(eventPointId: int, data: HashObject) {

		if (data == null)
			return;


		if (battleResultData == null)
			battleResultData = new HashObject();


		var isVictory = _Global.INT32(data["win"]) != 0;	/* 只要不是0 ，就代表获胜 */

		var brd = new HashObject({
			"victory": isVictory,
			"star": isVictory ? 3 : 0,
			"coin": _Global.INT32(data["Coin"]["getCoin"]),
			"remain": _Global.INT32(data["Coin"]["residueCoin"]),
			"consume": _Global.INT32(data["Coin"]["consumeCoin"])
		});

		if (battleResultData.Contains(eventPointId + ""))
			battleResultData[eventPointId + ""] = brd;
		else
			battleResultData.Add(eventPointId + "", brd);
	}


	private function GetDefaultBattleResult(): HashObject {
		return new HashObject({
			"victory": false,
			"star": 0,
			"coin": 0,
			"remain":0,
			"consume": 0
		});
	}


	/* ------------------------------------------------- Chest Result 宝箱 ------------------------------------------------- */
	/* 宝箱事件点的物品数据，
	 * 当向服务器请求后，缓存下来，
	 * 当宝箱事件点完成后，清除缓存数据 */
	private var chestItemCacheData: Array = null;
		
	/* 获得 事件-宝箱 物品缓存数据  Array 类型 */
	public function GetChestItemCacheData(eventPointId: int, callback: Function) {


		/* 如果没数据，向服务器请求获得 */
		if (chestItemCacheData == null) {

			var mapId = GetCurrentMapID();

			var okFunc: Function = function (result: HashObject) {


				var itemDataStr = "";
				if (result != null && result.Contains("result") && result["result"].Contains("data")) {
					itemDataStr = result["result"]["data"].Value as String;
					if (String.IsNullOrEmpty(itemDataStr))
						itemDataStr = result["result"]["data"].ToString();
				}

				if (!String.IsNullOrEmpty(itemDataStr)) {

					chestItemCacheData = new Array();

					var ItemData: HashObject = JSONParse.defaultInst().Parse(itemDataStr);

					for (var key: String in ItemData.Table.Keys) {
						var id = ItemData[key].Value as String;
						var data = new HashObject({
							"itemid": id
						});

						chestItemCacheData.push(data);
					}


					if (callback != null)
						callback(chestItemCacheData);

				} else {
					/* 宝箱事件点的 物品数据为空 */
					Debug.Log("<color=#FF0000>Chest item data read error!!!  mapId: " + mapId + "\teventPointId: " + eventPointId + "\n result: " + result.ToString() + "+</color>");

					if (callback != null)
						callback(new Array());
				}


			};


			var errorFunc: Function = function (errorMsg: String, errorCode: String) {
				/* 请求宝箱数据 失败！！！ */
				Debug.Log("<color=#FF0000>Get chest item data error!!!  \n "
					+ " errorCode: " + errorCode
					+ "\n errorMsg: " + errorMsg
					+ "\n mapId: "+ mapId
					+ "\t eventPointId: " + eventPointId + "</color>");

				if (callback != null)
					callback(new Array());
			};

			UnityNet.reqMistExpeditionGetChestItemData(mapId, eventPointId, okFunc, errorFunc);
		}
		else {
			if (callback != null)
				callback(chestItemCacheData);
		}


	}


	/* 清除 宝箱事件点的物品数据 */
	public function ClearChestItemCacheData() {
		chestItemCacheData = null;
	}


	/* ------------------------------------------------- Supply Station 支援点 ------------------------------------------------- */


	/*事件-支援点 的物品缓存数据*/
	private var supplyStationData: HashObject = null;


	/* 获得 事件- 支援点 的物品数据 */
	public function GetSupplyStationDataByEventId(eventId: int): HashObject {
		return supplyStationData;
	}

	/* 获得 事件- 支援点 的物品数据  Array 类型 */
	public function GetSupplyStationDataToArrByEventId(eventId : int): Array {
		var array: Array = new Array();

		if (supplyStationData == null) {
			supplyStationData = new HashObject();

			/* 目前暂时 只有1个  */
			for (var i: int = 0; i < 1; i++) {
				supplyStationData.Add(i.ToString(), new HashObject({
					"itemid": 30601
				}));
			}
		}



		for (var key: String in supplyStationData.Table.Keys) {
			array.push(supplyStationData[key]);
		}

		return array;
	}


	/* ------------------------------------------------- Buff Array 选择后的Buff列表 -------------------------------------------------*/

	private	var buffArray: Array = new Array();
	/*获取已选择后的Buff列表*/
	public function GetSelectedBuffArray(): Array{
		if (expeditionData != null) {
			buffArray.Clear();

			if (buffDic == null) {
				buffDic = GetBuffDic();
			}


			/*"buffs": "{\"10211\":1,\"10422\":1,\"10541\":1,\"10542\":1,\"10132\":1}"*/
			var data: HashObject = JSONParse.defaultInst().Parse(expeditionData["buffs"].Value);
			if (data == null) {
				return null;
			}

			for (var key: String in data.Table.Keys) {
				//记录等于1的才是buff 大于1的领袖技能
				if (((int.Parse(key)) / 10000) == 1) {

					var path: String;
					if (buffDic.ContainsKey(key)) {
						var expeditionBuff: KBN.DataTable.ExpeditionBuff = buffDic[key] as KBN.DataTable.ExpeditionBuff;
						path = expeditionBuff.ICON;
					}
					var count: int = _Global.INT32(data[key].Value);
					for (var i: int = 0; i < count; i++) {/*根据获取的buff数量来添加buff*/
						var buffHash: HashObject = new HashObject(
							{
								"path": path,
								"description": "Expedition.BuffDesc_i" + key,
								"Value": expeditionBuff.VALUE,
								"Type": expeditionBuff.VALUE_TYPE,
								"quality": expeditionBuff.TIER,
								"name": "Expedition.BuffName_i" + key,
								"id": expeditionBuff.ID
							});

						buffArray.push(buffHash);
					}
				}

			}
			buffArray.Sort(function (objA: Object, objB: Object)/*数组排序 按照buff品质从大到小*/ {
				return _Global.INT32((objB as HashObject)["quality"].Value) - _Global.INT32((objA as HashObject)["quality"].Value);
			});
		}
		return buffArray;
	}

	private var buffDic: Dictionary.<String, KBN.DataTable.IDataItem> = null;
	/*获取 buff GDS 字典数据*/	
	public function GetBuffDic(): Dictionary.<String, KBN.DataTable.IDataItem> {

		var gds: KBN.GDS_ExpeditionBuff = GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionBuff>();
		var Dic: Dictionary.<String, KBN.DataTable.IDataItem> = gds.GetItemDictionary();

		return Dic;
	}

	/*更新远征金币购买成功后的buff列表*/
	public function SetExpeditionBuffInfo(buffs: Object) {
		if (expeditionData != null) {
			expeditionData["buffs"].Value = buffs;
		}
	}




	/*获取兵量百分比的buff*/
	public function GetBuffTroopsIncrease(): List.<int> {
		var list: List.<int> = new List.<int>();

		if (expeditionData != null) {

			if (buffDic == null) {
				buffDic = GetBuffDic();
			}


			/*"buffs": "{\"10211\":1,\"10422\":1,\"10541\":1,\"10542\":1,\"10132\":2}"*/
			var data: HashObject = JSONParse.defaultInst().Parse(expeditionData["buffs"].Value);
			if (data == null) return null;


			for (var key: String in data.Table.Keys) {

				if (buffDic.ContainsKey(key)) {
					var expeditionBuff: KBN.DataTable.ExpeditionBuff = buffDic[key] as KBN.DataTable.ExpeditionBuff;
					if (expeditionBuff.EFFECTTYPE == 7)/*buff类型 == 7 增加派兵上限百分比*/ {
						var count: int = _Global.INT32(data[key]);
						for (var i: int = 0; i < count; i++) {
							list.Add(expeditionBuff.ID);
						}
					}
				}

			}
		}

		return list;
	}





	/* ------------------------------------------------- Leader Array 获取领袖列表 -------------------------------------------------*/
	/*获取领袖列表数据*/
	public function GetLeaderArray(): Array {
		var leaderArray: Array = new Array();
		var Dic: Dictionary.<String, KBN.DataTable.IDataItem> = GetLeaderDic();
		if (Dic != null) {
			for (var key: KeyValuePair.<String, KBN.DataTable.IDataItem> in Dic) {
				var expeditionLeader: KBN.DataTable.ExpeditionLeader = key.Value as KBN.DataTable.ExpeditionLeader;

				/*处理领袖GDS表数据*/
				var leaderInfo: MistExpeditionLeaderInfo = new MistExpeditionLeaderInfo();
				leaderInfo.alreadyOwned = true;
				leaderInfo.Head = expeditionLeader.ICON;
				leaderInfo.HeadBack = expeditionLeader.HEADBACKGROUND_ICON;
				leaderInfo.Name = expeditionLeader.NAME;
				leaderInfo.Description = expeditionLeader.DESCRIPTION;
				leaderInfo.Skill = expeditionLeader.BUFFS;
				leaderInfo.ID = _Global.INT32(expeditionLeader.ID);
				leaderInfo.HeadIcon = expeditionLeader.HEAD_ICON;
				leaderArray.push(leaderInfo);
			}
		}

		return leaderArray;
	}

	/*获取 领袖 GDS 字典数据*/
	public function GetLeaderDic(): Dictionary.<String, KBN.DataTable.IDataItem> {

		var gds: KBN.GDS_ExpeditionLeader = GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionLeader>();
		return gds.GetItemDictionary();
	}

	/*获取 领袖 Buff ID 列表*/
	public function GetLeaderBuffList(): List.<int> {
		if (expeditionData != null) {
			var BuffList: List.<int> = new List.<int>();

			if (buffDic == null) {
				buffDic = GetBuffDic();
			}
			var data: HashObject = JSONParse.defaultInst().Parse(expeditionData["buffs"].Value);
			if (data == null) {
				return null;
			}

			for (var key: String in data.Table.Keys) {
				if (((int.Parse(key)) / 10000) == 1) {
					continue;
				} else {/*领袖 buff ID 大于 1*/

					var leaderbuffID: int = _Global.INT32(key);
					BuffList.Add(leaderbuffID);
				}
			}
			return BuffList;
		}

	}

	
	/* ------------------------------------------------- ShopPayGemsItem 保存远征商人gems/Coin 商品道具信息 -------------------------------------------------*/

	
	private var payGemsItems: Dictionary.<String, HashObject>;
	/*缓存 远征商 gmes 物品信息*/
	public function SetMistExpeditionShopPayDicItem(key: String, value: HashObject) {
		if (!payGemsItems.ContainsKey(key)) {
			payGemsItems.Add(key, value);
		} else {
			payGemsItems[key] = value;
		}
	}

	/*获取 单个 远征商人 gmes 物品信息*/
	public function GitMistExpeditionShopPayDicItem(key: String): HashObject {
		if (payGemsItems.ContainsKey(key)) {
			return payGemsItems[key];
		}
		return null;
	}

	/*清除 缓存的远征商人 gmes 物品信息*/
	public function MistExpeditionShopPayDicClear() {
		if (payGemsItems != null) {

			payGemsItems.Clear();
			payGemsItems = null;

		}
	}


	/* 判断 本次 事件点 远征商人 gmes 字典 是否已经存储 数据 */
	public function IsMistExpeditionPayDic(): boolean {

		if (payGemsItems == null) {
			payGemsItems = new Dictionary.<String, HashObject>();
			return false;
		}
		else
			return true;
	}


	/* 获取 远征商人 Gems 缓存数据 */
	public function GitMistExpeditionShopPayDic(): Dictionary.<String, HashObject> {

		if (payGemsItems != null && payGemsItems.Count > 0)
			return payGemsItems;
		else
			return null;
	}





	private var payCoinItems: Dictionary.<String, HashObject>;
	/*缓存 远征商人 Coin 物品信息*/
	public function SetMistExpeditionShopCoinDicItem(key: String, value: HashObject) {
		if (!payCoinItems.ContainsKey(key)) {
			payCoinItems.Add(key, value);
		} else {
			payCoinItems[key] = value;
		}
	}

	/*获取 单个 远征商人 Coin 物品信息*/
	public function GitMistExpeditionShopCoinDicItem(key: String): HashObject {
		if (payCoinItems.ContainsKey(key)) {
			return payCoinItems[key];
		}
		return null;
	}

	/*清除 缓存的远征商人 Coin 物品信息*/
	public function MistExpeditionShopCoinDicClear() {

		if (payCoinItems != null) {

			payCoinItems.Clear();
			payCoinItems = null;

		}
		
	}


	/* 判断 本次 事件点 远征商人 金币 字典 是否已经存储 数据 */
	public function IsMistExpeditionShopCoinDic(): boolean {

		if (payCoinItems == null) {
			payCoinItems = new Dictionary.<String, HashObject>();
			return false;
		}
		else
			return true;
	}

	/* 获取 远征商人 Coin 缓存数据 */
	public function GitMistExpeditionShopCoinDic(): Dictionary.<String, HashObject> {

		if (payCoinItems != null && payCoinItems.Count > 0)
			return payCoinItems;
		else
			return null;
	}



}








/* 迷雾远征的地图块 的数据状态 */
public class MistExpeditionEventPointState {
	public var  pointId : int = 0;	/* 位置ID，例如 1010101 */
	public var  win : boolean = false;	/* 是否 胜利 */
	public var  rewardList : List.<String> = null;	/* 奖励buff 列表 */
	public var  rewardBuffId : String = "";	/* 领取了的奖励 buff id */
	public var  reward : boolean  = false;	/* 是否领取了奖励 */
}


/*迷雾远征 领袖信息*/
public class MistExpeditionLeaderInfo {
	public var Head: String;/*领袖头像*/
	public var HeadBack: String;/*领袖头像背景*/
	public var Name: String;/*领袖名称*/
	public var Description: String;/*领袖简介*/
	public var ID: int;/*领袖ID*/
	public var Skill: String;/*领袖技能*/
	public var alreadyOwned: boolean = false;/*是否已经拥有*/
	public var HeadIcon: String;/*领袖大图*/
}

/*迷雾远征 领袖技能信息*/
public class MistExpeditionLeaderSkillInfo {
	public var Name: String;/*领袖技能名称*/
	public var Description: String;/*领袖技能简介*/
	public var ID: int;/*领袖技能ID*/
	public var Icon: String;/*领袖技能图标*/
	public var Value: float;/*buff的值*/
	public var Type: int;/*buff是否是百分比 1 == true ｜2 == false*/
	public var alreadyOwned: boolean = false;/*是否已经拥有*/
}