/*
 * @FileName:		MistExpeditionMenuExchange.js
 * @Author:			lisong
 * @Date:			2022-03-29 01:14:12
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 远征币兑换
*/


public class MistExpeditionMenuExchange extends UIObject {

	@Space(30) @Header("----------MistExpedition - Exchange----------") 

	@SerializeField
	private var scrollView: ScrollView;
	@SerializeField
	private var item: MistExpeditionMenuExchangeItem;

	@Space(20)
	@SerializeField
	private var lael_Detail: Label;
	@SerializeField
	private var comingSoon: Label;
	@SerializeField
	private var mistExpeditionCoinImgBG: Label;
	@SerializeField
	private var mistExpeditionCoinLabel: Label;
	@SerializeField
	 private var mistExpeditionCoinImg: Label;


	@Space(20)/*字符串*/
	@SerializeField private var langKey_Exchange_Text1: String;/*远征兑换物品限制数量每周一零点刷新*/
	@SerializeField private var langKey_Expedition_StayTuned: String;/*内容暂未开放 敬请期待*/

	public function Init() {

		lael_Detail.Init();
		lael_Detail.txt = Datas.getArString(langKey_Exchange_Text1);
		comingSoon.txt = Datas.getArString(langKey_Expedition_StayTuned);
		mistExpeditionCoinImgBG.Init();
		mistExpeditionCoinImg.Init();
		mistExpeditionCoinLabel.Init();

		scrollView.Init();
	}



	public function SetData(): void {
		/*Museum.instance().GetArtifacts(artifactDetailDelegate);*/
		mistExpeditionCoinLabel.txt = Datas.getArString("Common.Owned") + ": " + MistExpeditionManager.GetInstance().GetExpeditionEntranceCoinCount();
	}

	public function OnPop() {
		scrollView.clearUIObject();
	}

	public function Update() {

		scrollView.Update();
	}


	public function Draw() {
		if (!visible) return;


		lael_Detail.Draw();
		scrollView.Draw();
		comingSoon.Draw();
		mistExpeditionCoinImgBG.Draw();
		mistExpeditionCoinImg.Draw();
		mistExpeditionCoinLabel.Draw();
	}

	private function artifactDetailDelegate(arr: List.<KBN.EventEntity>): void {

		if (scrollView == null || arr == null) {
			return;
		}
		scrollView.clearUIObject();

		var Exchangearr: Array = arr.ToArray();

		var obj: MistExpeditionMenuExchangeItem;
		for (var a: int = 0; a < Exchangearr.length; a++) {

			var event: KBN.EventEntity = Exchangearr[a] as KBN.EventEntity;
			obj = Instantiate(item);
			obj.Init();
			obj.SetRowData(event);

			scrollView.addUIObject(obj);
		}

		scrollView.AutoLayout();
		scrollView.MoveToTop();

	}



	public function handleItemAction(action: String, param: Object): void {
		switch (action) {
			case "resetDis":
				resetDisplay(param);
		}
	}

	public function resetDisplay(param: Object): void {

		mistExpeditionCoinLabel.txt = Datas.getArString("Common.Owned") + ": " + Payment.instance().NormalGems;

		var isArt: boolean = _Global.INT32(param) == 1;

		if (scrollView == null) {
			return;
		}

		var eventsComLists: Array = scrollView.getUIObject();

		var events: List.<KBN.EventEntity> = isArt ? Museum.instance().getArtiFacts : Museum.instance().getOrderedEvents;
		var event: KBN.EventEntity;
		var eventObj: MistExpeditionMenuExchangeItem;

		for (var b: int = 0; b < events.Count; b++) {
			event = events[b];
			Debug.Log("isArt:" + isArt + " event.id:" + event.id + "  event.tab:" + event.tab);
			for (var a: int = 0; a < eventsComLists.length; a++) {
				eventObj = eventsComLists[a];
				if (eventObj.getId == event.id) {
					eventObj.SetRowData(event);
				}
			}

		}
	}
}