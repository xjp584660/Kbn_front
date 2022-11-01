/*
 * @FileName:		MistExpeditionMenuLeaderBoard.js
 * @Author:			lisong
 * @Date:			2022-03-29 01:13:57
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	 迷雾远征 - 排行榜
*/


public class MistExpeditionMenuLeaderBoard extends UIObject {

	@Space(30) @Header("----------MistExpedition - Menu - LeaderBoard----------")

	/* ---------- toggle bar ---------- */
	@SerializeField private var toolBar: ToolBar;
	@SerializeField private var toolBarStringKeys: String[];

	@SerializeField private var infoBtn: Button;
	@SerializeField private var rewardsBtn: Button;

	@Space(20)
	/* ---------- toggle page  ---------- */
	@SerializeField
	private var mistExpeditionMenuLeaderBoardCurrentWeek: MistExpeditionMenuLeaderBoardCurrentWeek;
	@SerializeField
	private var mistExpeditionMenuLeaderBoardLastWeek: MistExpeditionMenuLeaderBoardLastWeek;

	/*字典存储排行榜数据查询是否有金币数量相同的*//*存储本周排行榜数据*/
	private var CurrentWeekLeaderBoardDec: System.Collections.Generic.Dictionary.<int, MightItem>;

	/*字典存储排行榜数据查询是否有金币数量相同的*//*存储上周排行榜数据*/
	private var LastWeekLeaderBoardDec: System.Collections.Generic.Dictionary.<int, MightItem>;

	/* 当前的 界面 */
	private var currentUI: UIObject;
	private var tabUI: Array;

	/*search bar*/
	@SerializeField public var l_bg: Label;
	@SerializeField public var lblTipColumns: Label;
	@SerializeField public var lblCutLine1: Label;
	@SerializeField public var lblCutLine2: Label;
	@SerializeField public var lblRank: Label;
	@SerializeField public var lblMight: Label;
	@SerializeField public var lblAlcAndName: Label;


	/*page*/
	@SerializeField public var inputPager: Input2Page;

	/*排行榜显示数量*/
	private static var CITY_SIEGE_RANK_PAGE: int = 30;

	@Space(20)/*字符串*/
	@SerializeField private var langKey_TogglePage_Rank: String;/*排行榜*/
	@SerializeField private var langKey_Rank_Text1_i: String;/*iButton*/
	@SerializeField private var langKey_Rank_RewardView: String;/*预览奖励*/
	@SerializeField private var langKey_Rank_Text1: String;/*排名*/
	@SerializeField private var langKey_Rank_Text2: String;/*名称/联盟*/
	@SerializeField private var langKey_Rank_Text3: String;/*远征币*/


	public function Init() {
		InitToolBar();
		infoBtn.Init();
		rewardsBtn.Init();

		rewardsBtn.txt = Datas.getArString(langKey_Rank_RewardView);

		/*初始化字典
		CurrentWeekLeaderBoardDec = new System.Collections.Generic.Dictionary.<int, MightItem>();
		LastWeekLeaderBoardDec = new System.Collections.Generic.Dictionary.<int, MightItem>();
		*/


		mistExpeditionMenuLeaderBoardCurrentWeek.Init();
		mistExpeditionMenuLeaderBoardLastWeek.Init();
		tabUI = [mistExpeditionMenuLeaderBoardCurrentWeek, mistExpeditionMenuLeaderBoardLastWeek];
		currentUI = tabUI[0];

		inputPager.Init();
		inputPager.pageChangedHandler = OnTabIndexChanged;

		infoBtn.OnClick = OnExpeditionLearboardIntoBtnClickHandler;
		rewardsBtn.OnClick = OnViewPrize;

	}

	private function InitToolBar(): void {
		toolBar.Init();
		toolBar.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;

		var toolBarStrings: List.<String> = new List.<String>();
		for (var key: String in toolBarStringKeys) {
			toolBarStrings.Add(Datas.getArString(key));
		}
		toolBar.toolbarStrings = toolBarStrings.ToArray();

	}



	public function OnPush(param: Object) {

		lblRank.txt = Datas.getArString(langKey_Rank_Text1);
		lblAlcAndName.txt = Datas.getArString(langKey_Rank_Text2);
		lblMight.txt = Datas.getArString(langKey_Rank_Text3);
	}


	public function OnPop() {
		mistExpeditionMenuLeaderBoardLastWeek.OnPop();
		mistExpeditionMenuLeaderBoardCurrentWeek.OnPop();

		/*清除字典
		CurrentWeekLeaderBoardDec.Clear();
		LastWeekLeaderBoardDec.Clear();
		*/

	}


	public function SetData(): void {
		toolBarTypes_SelectedIndex_Changed(toolBar.selectedIndex);
		OnPush(null);
	}


	public function Draw() {
		if (!visible) return;


		if (currentUI != null) {
			currentUI.Draw();
		}

		l_bg.Draw();
		lblTipColumns.Draw();
		toolBar.Draw();
		infoBtn.Draw();
		rewardsBtn.Draw();


		lblRank.Draw();
		lblMight.Draw();
		lblAlcAndName.Draw();
		lblCutLine1.Draw();

		lblCutLine2.Draw();
		inputPager.Draw();

	}



	public function Update() {
		toolBar.Update();

		switch (toolBar.selectedIndex) {
			case 0:
				mistExpeditionMenuLeaderBoardCurrentWeek.Update();

				break;
			case 1:
				mistExpeditionMenuLeaderBoardLastWeek.Update();

				break;
			default:
				break;
		}
	}


	private function toolBarTypes_SelectedIndex_Changed(index: int) {
		OnTabIndexChanged(1);
	}



	private function OnTabIndexChanged(index: int): void {
		ShowToolBarPage(index);
	}

	private function ShowToolBarPage(index: int) {


		currentUI = tabUI[toolBar.selectedIndex];



		var okFunc: Function = function (data: HashObject) {
			var result: HashObject = data;

			if (!result["ok"].Value) return;

			var Leaderboard: int = 0;
			var CurrentWeekMaxCount: int = 0;/*本周排行数据最大容量*/
			var LastWeekMaxCount: int = 0;/*上周排行榜数据最大容量*/

			/*本周排行榜数据*/
			if (toolBar.selectedIndex == 0) {

				var CurrentWeekranking: int;

				/*本周数据中转站*/
				var currentWeekLeaderboard: HashObject = result["result"]["currentWeekLeaderboard"];

				/*保存网络返回的数据 - 数组*/
				var currentWeekLeaderboardArray: Array = _Global.GetObjectValues(result["result"]["currentWeekLeaderboard"]);
				if (currentWeekLeaderboardArray != null) {
					Leaderboard = currentWeekLeaderboardArray.length;/*数组的长度*/
					CurrentWeekMaxCount = currentWeekLeaderboardArray.length;/*数组的最大长度*/

					var CurrentWeekindex: int;

					/*判断服务器返回的数据是否大于CITY_SIEGE_RANK_PAGE条*/
					if (Leaderboard > CITY_SIEGE_RANK_PAGE) {

						/*Leaderboard -= Leaderboard - (index * CITY_SIEGE_RANK_PAGE);/*根据当前的分页数量来获取数组的范围
						if (Leaderboard > CurrentWeekMaxCount) {
							Leaderboard = CurrentWeekMaxCount;/*如果当前数组范围大于最大范围 则等于之前数组
						}*/

						Leaderboard -= Leaderboard - (index * CITY_SIEGE_RANK_PAGE);/*根据当前的分页数量来获取数组的范围*/

						if (Leaderboard > CurrentWeekMaxCount) {
							Leaderboard = CurrentWeekMaxCount;/*如果当前数组范围大于最大范围 则等于之前数组*/
						}

						CurrentWeekindex = index * CITY_SIEGE_RANK_PAGE - CITY_SIEGE_RANK_PAGE;/*从哪个下标开始循环*/
						CurrentWeekranking = CurrentWeekindex + 1;
					}
					else {
						CurrentWeekranking = 1;
					}

					//var CurrentWeekranking: int = 1;/*排名*/


					/*存储本周每条排行榜数据集合*/
					var CurrentWeekboardItemList: System.Collections.Generic.List.<MightItem> = new System.Collections.Generic.List.<MightItem>(CurrentWeekMaxCount);
					for (var i: int = CurrentWeekindex; i < Leaderboard /*CurrentWeekMaxCount*/; i++) {/*每次最多只存30条避免数据量过大发生卡顿*/


						var CurrentWeekitemStr: String = currentWeekLeaderboard[_Global.ap + i]["a0"].Value as String;
						if (String.IsNullOrEmpty(CurrentWeekitemStr)) {
							CurrentWeekitemStr = currentWeekLeaderboard[_Global.ap + i]["a0"].Value.ToString();
						}
						/*"{\"userId\":\"1618\",\"displayName\":\"1618\",\"allianceName\":\"Berliners\"}"*/
						var CurrentWeekitemData: HashObject = JSONParse.defaultInst().Parse(CurrentWeekitemStr);

						var CurrentWeekitemGold: int = _Global.INT32(currentWeekLeaderboard[_Global.ap + i]["a1"]);/*;/*获取玩家金币数量*/
						var CurrentWeekitemId: int = _Global.INT32(CurrentWeekitemData["userId"]);/*获取玩家ID*/
						var CurrentWeekboardAllianceName: String = CurrentWeekitemData["allianceName"].Value.ToString();/*获取玩家联盟名称*/
						var CurrentWeekboardDisplayName: String = CurrentWeekitemData["displayName"].Value.ToString();/*获取玩家名称*/


						var CurrentWeekboardItem: MightItem = new MightItem();
						CurrentWeekboardItem.Rank = CurrentWeekranking;/*排名*/
						CurrentWeekboardItem.Might = CurrentWeekitemGold;/*获得的金币数*/
						CurrentWeekboardItem.UserId = CurrentWeekitemId;/*玩家ID*/
						CurrentWeekboardItem.AllianceName = CurrentWeekboardAllianceName;/*玩家联盟名称*/
						CurrentWeekboardItem.Name = CurrentWeekboardDisplayName;/*玩家名称*/


						/*处理分数相同的数据 使其他们排名相同*/
						///*存储排行榜数据方便对比金币数量*/
						//if (!CurrentWeekLeaderBoardDec.ContainsKey(i)) {
						//	CurrentWeekLeaderBoardDec.Add(i, CurrentWeekboardItem); /*如果没有存储此数据 , 就直接存储*/
						//} else {
						//	CurrentWeekLeaderBoardDec[i] = CurrentWeekboardItem;/*如果已存储此数据 就改变此数据的存储的值*/
						//}

						///*判断是否存储上一条数据*/
						//if (CurrentWeekLeaderBoardDec.ContainsKey((i - 1))) {
						//	if (CurrentWeekLeaderBoardDec[(i - 1)].Might == CurrentWeekLeaderBoardDec[(i)].Might)/*对比是否有相同的金币数量*/ {
						//		CurrentWeekboardItem.Rank = CurrentWeekLeaderBoardDec[(i - 1)].Rank;/*相同就更换排名*/
						//		CurrentWeekLeaderBoardDec[(i)] = CurrentWeekboardItem;/*更换字典里面的数据*/
						//		CurrentWeekranking = CurrentWeekboardItem.Rank;/*如果相同分数 就把排名更换*/
						//	}
						//}




						CurrentWeekranking++;/*递增*/

						CurrentWeekboardItemList.Add(CurrentWeekboardItem);
					}
				}

				/*清除字典
				CurrentWeekLeaderBoardDec.Clear();
				*/


				//var CurrentWeekSource: Array = new Array();
				///*根据页数来去列表里面的数据*/
				//for (var ii = CurrentWeekindex; ii < Leaderboard; ii++) {
				//	CurrentWeekSource.push(CurrentWeekboardItemList[ii]);
				//}


				///*清除列表*/
				//CurrentWeekboardItemList.Clear();

				/*mistExpeditionMenuLeaderBoardCurrentWeek.scroll.SetData(CurrentWeekSource);/*向scroll传递数据*/

				mistExpeditionMenuLeaderBoardCurrentWeek.scroll.SetData(CurrentWeekboardItemList.ToArray());
				mistExpeditionMenuLeaderBoardCurrentWeek.scroll.ResetPos();

				OnPageCount(CurrentWeekMaxCount, CITY_SIEGE_RANK_PAGE, index);/*控制有几页*/

			}


			/*上周排行榜数据*/
			else if (toolBar.selectedIndex == 1) {

				var LastWeekranking: int;
				/*上周数据中转站*/
				var lastWeekLeaderboard: HashObject = result["result"]["lastWeekLeaderboard"];

				/*保存网络返回的数据 - 数组*/
				var lastWeekLeaderboardArray: Array = _Global.GetObjectValues(result["result"]["lastWeekLeaderboard"]);
				if (lastWeekLeaderboardArray != null) {
					Leaderboard = lastWeekLeaderboardArray.length;
					LastWeekMaxCount = lastWeekLeaderboardArray.length;/*lastWeekLeaderboardArray.length;/*数组的最大长度*/

					var lastWeekindex: int;

					/*判断服务器返回的数据是否大于CITY_SIEGE_RANK_PAGE条*/
					if (Leaderboard > CITY_SIEGE_RANK_PAGE) {

						//Leaderboard -= Leaderboard - (index * CITY_SIEGE_RANK_PAGE);/*根据当前的分页数量来获取数组的范围*/
						//if (Leaderboard > LastWeekMaxCount) {
						//	Leaderboard = LastWeekMaxCount;/*如果当前数组范围大于最大范围 则等于之前数组*/
						//}

						Leaderboard -= Leaderboard - (index * CITY_SIEGE_RANK_PAGE);/*根据当前的分页数量来获取数组的范围*/
						if (Leaderboard > LastWeekMaxCount) {
							Leaderboard = LastWeekMaxCount;/*如果当前数组范围大于最大范围 则等于之前数组*/
						}

						lastWeekindex = index * CITY_SIEGE_RANK_PAGE - CITY_SIEGE_RANK_PAGE;/*从哪个下标开始循环*/

						LastWeekranking = lastWeekindex + 1;
					}
					else {
						LastWeekranking = 1;
					}

					//var LastWeekranking: int = 1;/*上周排名*/


					/*存储上周每条排行榜数据集合*/
					var LastWeekboardItemList: System.Collections.Generic.List.<MightItem> = new System.Collections.Generic.List.<MightItem>(LastWeekMaxCount);

					for (var j: int = lastWeekindex; j < Leaderboard/*LastWeekMaxCount*/; j++) {/*每次最多只存30条避免数据量过大发生卡顿*/


						var LastWeeboardStr: String = lastWeekLeaderboard[_Global.ap + j]["a0"].Value as String;
						if (String.IsNullOrEmpty(LastWeeboardStr)) {
							LastWeeboardStr = lastWeekLeaderboard[_Global.ap + j]["a0"].Value.ToString();
						}
						/*"{\"userId\":\"1618\",\"displayName\":\"1618\",\"allianceName\":\"Berliners\"}"*/
						var LastWeeboardData: HashObject = JSONParse.defaultInst().Parse(LastWeeboardStr);


						var LastWeeboardGold: int = _Global.INT32(lastWeekLeaderboard[_Global.ap + j]["a1"]);/*获取玩家金币数量*/
						var LastWeeboardId: int = _Global.INT32(LastWeeboardData["userId"]);/*获取玩家ID*/
						var LastWeeboardAllianceName: String = LastWeeboardData["allianceName"].Value.ToString();/*获取玩家联盟名称*/
						var LastWeeboardDisplayName: String = LastWeeboardData["displayName"].Value.ToString();/*获取玩家名称*/


						var LastWeeboardItem: MightItem = new MightItem();
						LastWeeboardItem.Rank = LastWeekranking;/*排名*/
						LastWeeboardItem.Might = LastWeeboardGold;/*获得的金币数*/
						LastWeeboardItem.UserId = LastWeeboardId;/*玩家ID*/
						LastWeeboardItem.AllianceName = LastWeeboardAllianceName;/*玩家联盟名称*/
						LastWeeboardItem.Name = LastWeeboardDisplayName;/*玩家名称*/


						/*处理分数相同的数据 使其他们排名相同*/
						///*存储排行榜数据方便对比金币数量*/
						//if (!LastWeekLeaderBoardDec.ContainsKey(j)) {
						//	LastWeekLeaderBoardDec.Add(j, LastWeeboardItem); /*如果没有存储此数据 , 就直接存储*/
						//} else {
						//	LastWeekLeaderBoardDec[j] = LastWeeboardItem;/*如果已存储此数据 就改变此数据的存储的值*/
						//}

						///*判断是否存储上一条数据*/
						//if (LastWeekLeaderBoardDec.ContainsKey((j - 1))) {
						//	if (LastWeekLeaderBoardDec[(j - 1)].Might == LastWeekLeaderBoardDec[(j)].Might)/*对比是否有相同的金币数量*/ {
						//		LastWeeboardItem.Rank = LastWeekLeaderBoardDec[(j - 1)].Rank;/*相同就更换排名*/
						//		LastWeekLeaderBoardDec[(j)] = LastWeeboardItem;/*更换字典里面的数据*/
						//		LastWeekranking = LastWeeboardItem.Rank;/*如果相同分数 就把排名更换*/
						//	}
						//}



						LastWeekranking++;/*递增*/

						LastWeekboardItemList.Add(LastWeeboardItem);
					}
				}

				/*清除字典
				LastWeekLeaderBoardDec.Clear();
				*/


				//var LastWeekSource: Array = new Array();
				///*根据页数来去列表里面的数据*/
				//for (var jj = lastWeekindex; jj < Leaderboard; jj++) {
				//	LastWeekSource.push(LastWeekboardItemList[jj]);
				//}

				///*清除列表*/
				//LastWeekboardItemList.Clear();

				//mistExpeditionMenuLeaderBoardLastWeek.scroll.SetData(LastWeekSource);
				mistExpeditionMenuLeaderBoardLastWeek.scroll.SetData(LastWeekboardItemList.ToArray());
				mistExpeditionMenuLeaderBoardLastWeek.scroll.ResetPos();
				OnPageCount(LastWeekMaxCount, CITY_SIEGE_RANK_PAGE, index);/*控制有几页*/


			}

		};


		UnityNet.reqMistExpeditionEventLeaderBoard(okFunc, null);

	}

	/*
	*total		所有数据数量
	*pagesize	需要显示几条数据
	*pageindex	当前页数
	*pageCount  根据所有数量/需要显示几条数据 = 最大页数
	*/
	private function OnPageCount(total: int, pagesize: int, pageindex: int) {

		var pageCount: int = _Global.INT32(total / pagesize) + (total % pagesize > 0 ? 1 : 0);
		if (pageCount == 0) {
			pageindex = 1;
		}
		inputPager.setPages(pageindex, pageCount);
	}


	/*帮助弹窗显示按钮 */
	private function OnExpeditionLearboardIntoBtnClickHandler() {
		var setting: InGameHelpSetting = new InGameHelpSetting();
		setting.type = "one_context";
		setting.key = Datas.getArString(langKey_Rank_Text1_i);
		setting.name = Datas.getArString(langKey_Rank_Text1);

		MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");

	}


	/*排行榜奖励界面*/
	private function OnViewPrize() {

		MenuMgr.getInstance().PushMenu("MistExpeditionMenuLeaderBoardRewardsPerview", null, "trans_zoomComp");
	}

}