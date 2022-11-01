import System.Collections.Generic;
import System.Collections;

public class MonsterMenu extends ComposedMenu {
	public var btndummy: Button;
	public var getMore: Label;
	public var  btnChat: Button;
	public var  chatText: SimpleButton;
	public var uguiMonsterClone: GameObject;
	private var uguiMonster: UGUIMonsterMenu;

	private var baseData: MonsterEventData;

	public var rewardPrefab: RewardListItem;
	public var tweenReward: RewardListItem;
	private var rewardList: List.<Object> = new List.<Object>();      //data 数据
	private var newRewardList: List.<Object> = new List.<Object>();
	private var itemList: List.<RewardListItem> = new List.<RewardListItem>();
	private var tweeenItemList: List.<RewardListItem> = new List.<RewardListItem>();

	public var rewardBG: Label;
	public var rewardTime: Label;

	private var parent: GameObject;
	private var tweenParent: GameObject;

	public var chatText1: Label;
	public var chatText2: Label;
	public var chatIcon1: Label;
	public var chatIcon2: Label;

	public var TextureGlobal: Texture2D;
	public var TextureAlliance: Texture2D;
	public var TextureWhisper: Texture2D;
	public var TextureMonster: Texture2D;
	public var redColor: Color;
	public var blackColor: Color;

	private var g_countForChattext: long = 0;
	private var g_curTime: long = 0;
	private var g_updateChatInterval: int = 1;

	public var time_bg: Label;

	public var bg: Button;
	public var bg2: Label;
	public var tip_title: Label;
	public var des: Label;
	public var gemsIcon: Label;
	public var gemsCount: Label;

	public function Init() {
		super.Init();
		menuHead.btn_back.OnClick = backFunc;
		print("this,y==" + this.rect.y + "this,width==" + this.rect.width);
		SetNetFalse();
		parent = GameObject.Find("MonsterEventParent") == null ? new GameObject("MonsterEventParent") : GameObject.Find("MonsterEventParent");
		tweenParent = GameObject.Find("MonsterEventtweenParent") == null ? new GameObject("MonsterEventtweenParent") : GameObject.Find("MonsterEventtweenParent");
		itemList.Clear();
		uguiMonster = GameObject.Instantiate(uguiMonsterClone).GetComponent(UGUIMonsterMenu);
		// uguiMonster.PlayTPForAnchor(true);
		// uguiMonster.ShowLog();

		menuHead.setTitle(Datas.getArString("Labyrinth.Name"));
		menuHead.setPaymentContentsVisible(false);
		btndummy.Init();
		getMore.Init();
		btnChat.Init();
		chatText.Init();
		rewardBG.Init();
		time_bg.Init();
		// rewardBG.SetVisible(false);
		rewardTime.Init();
		rewardBG.mystyle.normal.background = TextureMgr.instance().LoadTexture("items_frame", TextureType.DECORATION);

		chatText1.Init();
		chatText2.Init();
		chatIcon1.Init();
		chatIcon2.Init();

		chatText1.txt = "";
		chatText2.txt = "";

		bg.Init();
		bg2.Init();
		tip_title.Init();
		des.Init();
		gemsIcon.Init();
		gemsCount.Init();
		CloseTip();
		bg.OnClick = CloseTip;

		tip_title.txt = Datas.getArString("Labyrinth.GetRewardTip");
		des.txt = Datas.getArString("Labyrinth.Tips_Text2");

		if (KBN._Global.IsLargeResolution()) {
			btndummy.rect.x = 480;
			btndummy.rect.width = 153;
			getMore.rect.x = 600;
		}
		else {
			btndummy.rect.x = 465;
			btndummy.rect.width = 153;
			getMore.rect.x = 600;
		}

		btndummy.txt = Datas.getArString("38829");
		getMore.mystyle.normal.background = TextureMgr.instance().LoadTexture("add", TextureType.DECORATION);
		btndummy.OnClick = GetDummy;
		titleTab.toolbarStrings = [Datas.getArString("Labyrinth.Mode_Text1"), Datas.getArString("Labyrinth.Mode_Text2")];
		titleTab.indexChangedFunc = changeToolBar;
		btnChat.OnClick = OpenChat;
		btnChat.setNorAndActBG("button_chat_normal", "button_chat_down");
		chatText.alpha = 0.45;
		chatText.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.BACKGROUND);
		chatText.OnClick = OpenChat;
		// sliderTex.rect.width=1/2*sliderTex.rect.width;
		if (!IsInvoking("InvokeEvent")) {
			InvokeRepeating("InvokeEvent", 1, 5);
		}
		InitReward();
		UpdateMessage();

		/*初始化 关闭物体介绍UI*/
		MonsterMenuDetailedInfo.IsMonsterMenuDetailedInfo(false);
	}

	private function InvokeEvent(): void {
		MonsterController.instance().GetMonsterPool();
	}

	protected function DrawBackground() {
		if (menuHead != null)
			menuHead.Draw();
		if (Event.current.type != EventType.Repaint)
			return;
		//		GUI.Label( Rect(0, 0, rect.width, titleBack.height ), titleBack );	
		if (titleTab != null) {
			//			backStyle.normal.background = background;
			//			DrawTextureClipped(background, Rect(0, 0, 640, 970), Rect(0, titleTab.rect.yMax -10, rect.width, rect.height ), rotation);
			//			GUI.DrawTexture( Rect(0, titleTab.rect.yMax -10, rect.width, rect.height ), background );
			bgStartY = System.Convert.ToInt32(titleTab.rect.yMax - 10);
			// DrawMiddleBg();
			//			backStyle.normal.background = frameTop;
			//GUI.DrawTexture( Rect(0, titleTab.rect.yMax- 10, rect.width , frameTop.height), frameTop);
			frameTop.rect = new Rect(0, titleTab.rect.yMax - 10, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw();
		}
		else {
			//		backStyle.normal.background = background;
			//		DrawTextureClipped(background, Rect(0, 0, 640, 970), Rect(0, 85, rect.width, rect.height ), rotation);
			//		GUI.DrawTexture( Rect(0, 85, rect.width, rect.height ), background);
			bgStartY = 85;
			// DrawMiddleBg();
			//		backStyle.normal.background = frameTop;
			//		GUI.DrawTexture( Rect(0, 85, rect.width , frameTop.height), frameTop);
			frameTop.rect = new Rect(0, 85, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw();
		}

	}
	private var toolindex = 0;
	private function changeToolBar() {
		print("change ToolBar");

		//		if(titleTab.selectedIndex == 0){}
		if (!IsInNet) {
			uguiMonster.Refresh(titleTab.selectedIndex + 1, baseData as MonsterEventData, 3);
		}
		else {
			if (titleTab.selectedIndex != toolindex) {
				titleTab.selectedIndex = titleTab.selectedIndex == 0 ? 1 : 0;
			}
		}
		toolindex = titleTab.selectedIndex;
	}

	public function OnPush(param: Object): void {
		super.OnPush(param);
		print("OnGui--Monster--OnPush");
		// refresh(body);
		baseData = param as MonsterEventData;
		uguiMonster.Refresh(titleTab.selectedIndex + 1, baseData as MonsterEventData, 1);

	}

	public function handleNotification(type: String, body: Object): void {
		switch (type) {
			case "attack":
				refresh(body as MonsterEventData, 2);
				break;
			case "UpdateSeed":
				uguiMonster.RefreshPool(titleTab.selectedIndex + 1, body as MonsterEventData);
				break;
			// UpdateMessage();
			// (MenuMgr.getInstance().Chat as ChatMenu).getChat(true);
			case "Monster_buyItem":
				uguiMonster.RefreshItem();
				uguiMonster.Refresh(titleTab.selectedIndex + 1, baseData as MonsterEventData, 1);
				break;
		}
	}

	private function refresh(data: MonsterEventData, refreshType: int) {
		baseData = data as MonsterEventData;
		rewardTime.txt = Datas.getArString("Labyrinth.TimeEnd") + MonsterController.instance().GetLeftTime();
		uguiMonster.Refresh(titleTab.selectedIndex + 1, data as MonsterEventData, refreshType);
		Invoke("reFreshAttack", 0.4f);
	}
	private function reFreshAttack() {
		var data = baseData;
		if (data.attackReward != null) {
			var count = data.attackReward.length;
			for (var i = count - 1; i >= 0; i--) {
				var d: HashObject = data.attackReward[i] as HashObject;
				KBN.MyItems.singleton.AddItem(_Global.INT32(d["itemId"]), _Global.INT32(d["itemCount"]));
				newRewardList.Add(data.attackReward[i]);
			}
		}
		if (data.deadReward != null) {
			var countNew = data.deadReward.length;
			for (var y = countNew - 1; y >= 0; y--) {
				var dw: HashObject = data.deadReward[y] as HashObject;
				KBN.MyItems.singleton.AddItem(_Global.INT32(dw["itemId"]), _Global.INT32(dw["itemCount"]));
				newRewardList.Add(data.deadReward[y]);
			}
		}
		// rewardList.AddRange(newRewardList);

		for (var k = newRewardList.Count - 1; k >= 0; k--) {
			var newObj: RewardListItem;
			if (rewardList.Count > 10) {
				rewardList.RemoveAt(0);
				newObj = itemList[0];
				itemList.RemoveAt(0);
				itemList.Add(newObj);
			} else {
				newObj = GameObject.Instantiate(rewardPrefab);
				newObj.gameObject.transform.parent = parent.transform;
				newObj.gameObject.name = k + "";
				newObj.Init();
				itemList.Add(newObj);
			}
			rewardList.Add(newRewardList[k]);

			newObj.SetRowData(newRewardList[k], 1);
			newObj.InitPosition(k + 1, 100);

		}
		MonsterController.instance().monsterRewardList = rewardList;
		newRewardList.Reverse();
		for (var j = newRewardList.Count - 1; j >= 0; j--) {
			var newTweenObj: RewardListItem = GameObject.Instantiate(tweenReward);
			newTweenObj.gameObject.transform.parent = tweenParent.transform;
			newTweenObj.Init();
			newTweenObj.SetRowData(newRewardList[j], 2);
			newTweenObj.InitTweenPosition(GetX(newRewardList.Count, j), GetXTo(j));
			tweeenItemList.Add(newTweenObj);
			var reward: HashObject = newRewardList[j] as HashObject;
			if (_Global.INT32(reward["itemId"]) == 2111) {
				Payment.instance().AddShadowGems(_Global.INT32(reward["itemNum"]));
			} else {
				MyItems.instance().AddItem(_Global.INT32(reward["itemId"]), _Global.INT32(reward["itemNum"]));
			}
		}
		TweenPositionBegin(newRewardList.Count * 100);
		newRewardList.Clear();
		data.ClearAttackData();
		if (IsInvoking("SetNetFalse")) {
			CancelInvoke("SetNetFalse");
		}
		Invoke("SetNetFalse", 1);
	}
	private function GetX(count: int, index: int): float {
		// return 300.00;
		return 300.00 - 80.00 * (count - 1) + 160.00 * index;
	}
	private function GetXTo(index: int): float {
		return 100.00 * index;
	}
	private function InitReward() {
		rewardList = MonsterController.instance().monsterRewardList;
		var count: int = rewardList.Count;
		for (var k = rewardList.Count - 1; k >= 0; k--) {
			var newObj: RewardListItem = GameObject.Instantiate(rewardPrefab);
			newObj.gameObject.transform.parent = parent.transform;
			newObj.gameObject.name = k + "";
			newObj.Init();
			newObj.SetRowData(rewardList[k], 2);
			newObj.InitPosition(k + 1, 100);
			itemList.Add(newObj);
		}
		TweenPositionBegin(count * 100);
		itemList.Reverse();
	}
	//开始动画
	private function TweenPositionBegin(x: int) {
		for (var i = 0; i < itemList.Count; i++) {
			// rewardBG.SetVisible(true);
			TweenPosition.Begin(itemList[i].gameObject, 0.2,
				new Vector3(itemList[i].transform.localPosition.x + x, itemList[i].transform.localPosition.y, itemList[i].transform.localPosition.z));
		}
	}
	public function TweenPositionFinish() {

	}

	public function Update() {
		// SetUGUIMOnsterTp();
		super.Update();

		for (var i = 0; i < itemList.Count; i++) {
			if (itemList[i] != null) {
				itemList[i].Update();
			}
		}


		rewardTime.txt = Datas.getArString("Labyrinth.TimeEnd") + MonsterController.instance().GetLeftTime();
		g_curTime = GameMain.unixtime();
		if (g_curTime - g_countForChattext >= g_updateChatInterval) {
			g_countForChattext = g_curTime;

			if ((MenuMgr.getInstance().Chat as ChatMenu).isNeedUpdateMes) {
				UpdateMessage();
			}
		}
		uguiMonster.stateBg.gameObject.SetActive(IsInNet);

	}

	public function SetUGUIMOnsterTp() {
		// Debug.Log("Transition.static_y=="+Transition.static_y);
		if (uguiMonster != null && menuHead != null) {
			var v: Vector3 = new Vector3(0, 0, 0);
			for (var i = uguiMonster.objs.length - 1; i >= 0; i--) {
				if (KBN._Global.isIphoneX()) {
					if (i == 5) {
						v = new Vector3(0,
							0 - this.rect.y * 1600 / 960,
							0);
						// print("this,y=="+this.rect.y+"this,width=="+this.rect.width+"  v5=="+v.y);
					} else if (i == 0 || i == 1) {
						v = new Vector3(0,
							0 - this.rect.y * 1600 / 960 - 75,
							0);
					} else {
						v = new Vector3(0,
							0 - this.rect.y * 1600 / 960 + 40,
							0);
					}

				} else {
					v = new Vector3(0,
						0 - this.rect.y * 1365 / 960,
						0);

				}

				uguiMonster.objs[i].transform.localPosition = v;
			}
		}
	}
	public function OnPopOver(): void {
		super.OnPopOver();
		// uguiMonster.PlayTPForAnchor(false);
		TryDestroy(menuHead);
		tweeenItemList.Clear();
		if (uguiMonster != null)
			GameObject.Destroy(uguiMonster.gameObject);
		CancelInvoke("InvokeEvent");

		GameObject.Destroy(parent);
		GameObject.Destroy(tweenParent);
		SetNetFalse();
	}
	public function DrawItem() {
		// btndummy.Draw();
		// getMore.Draw();
		chatText.Draw();
		btnChat.Draw();
		rewardBG.Draw();
		time_bg.Draw();
		rewardTime.Draw();
		for (var i = itemList.Count - 1; i >= 0; i--) {
			if (itemList[i] != null) {
				itemList[i].Draw();
			}
		}
		for (var j = tweeenItemList.Count - 1; j >= 0; j--) {
			if (tweeenItemList[j] != null) {
				tweeenItemList[j].Draw();
			}
		}
		chatText1.Draw();
		chatText2.Draw();
		chatIcon1.Draw();
		chatIcon2.Draw();

		bg.Draw();
		bg2.Draw();
		tip_title.Draw();
		des.Draw();
		gemsIcon.Draw();
		gemsCount.Draw();
		SetUGUIMOnsterTp();

	}
	private var isOpenTip = false;
	public function OpenTip(count: int) {
		isOpenTip = true;
		gemsCount.txt = count.ToString();
		bg.SetVisible(true);
		bg2.SetVisible(true);
		tip_title.SetVisible(true);
		des.SetVisible(true);
		gemsIcon.SetVisible(true);
		gemsCount.SetVisible(true);
		uguiMonster.getRewardPartic.gameObject.SetActive(true);
	}
	public function CloseTip() {
		isOpenTip = false;
		// gemsCount.txt=count.ToString();
		bg.SetVisible(false);
		bg2.SetVisible(false);
		tip_title.SetVisible(false);
		des.SetVisible(false);
		gemsIcon.SetVisible(false);
		gemsCount.SetVisible(false);
		uguiMonster.getRewardPartic.gameObject.SetActive(false);
	}

	public function GetDummy() {
		if (MenuMgr.getInstance().GetCurMenuName() == "MonsterMenu" && !IsInNet) {
			MenuMgr.getInstance().PushMenu("MonsterShopMenu", null, "trans_zoomComp");
		}

	}

	public function GetHelp(): void {
		if (MenuMgr.getInstance().GetCurMenuName() == "MonsterMenu" && !IsInNet) {
			var setting: InGameHelpSetting = new InGameHelpSetting();
			setting.type = "one_context";
			setting.key = Datas.getArString("Labyrinth.Description", [MonsterController.instance().lvLimit.ToString()]);// Datas.getArString("Labyrinth.Description");
			setting.name = Datas.getArString("Labyrinth.Name");

			MenuMgr.getInstance().PushMenu("InGameHelp", setting, "");
		}

	}
	function OpenChat() {
	if (!IsInNet) {
		MenuMgr.getInstance().PushMenu("ChatMenu", null);
	}

}
public function backFunc() {
	if (CanClickHome) {
		KBN.MenuMgr.instance.PopMenu("");
	}
}

private var IsInNet: boolean = false;
private var CanClickHome = true;
private function SetClickHomeTrue() {
	CanClickHome = true;
}
private function SetNetFalse() {
	IsInNet = false;
}
public function Attack(): void {
	if (MenuMgr.getInstance().GetCurMenuName() == "MonsterMenu" && !IsInNet && uguiMonster.isDeadFinsh && !isOpenTip) {
		if (baseData.GetCurCost(titleTab.selectedIndex + 1) <= KBN.MyItems.singleton.GetItemCount(4201)) {
			MonsterController.instance().AttackMonster(1, titleTab.selectedIndex + 1);
			if (IsInvoking("SetClickHomeTrue")) {
				CancelInvoke("SetClickHomeTrue");
			}
			if (IsInvoking("SetNetFalse")) {
				CancelInvoke("SetNetFalse");
			}
			IsInNet = true;
			CanClickHome = false;

			Invoke("SetClickHomeTrue", 1.5f);

			SoundMgr.instance().PlayEffect("on_tap", "Audio/");

			// Invoke("SetNetFalse",5);
			// Invoke("SetNetFalse",10);
		}
		else
			GetDummy();
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
			return TextureAlliance;
		case Constant.ChatType.CHAT_ALCREQUEST:
			return TextureAlliance;
		case Constant.ChatType.CHAT_ALCRQANSWER:
			return TextureAlliance;
		case Constant.ChatType.CHAT_MONSTER:
			return TextureMonster;
		case Constant.ChatType.CHAT_EXCEPTION:
			return null;
	}
}
	


}