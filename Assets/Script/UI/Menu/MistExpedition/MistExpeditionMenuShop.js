/*
 * @FileName:		MistExpeditionMenuShop.js
 * @Author:			lisong
 * @Date:			2022-03-29 01:14:05
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 商店
*/


public class MistExpeditionMenuShop extends UIObject {

	@Space(30) @Header("----------MistExpedition - Shop----------")


	@SerializeField private var scrollList: ScrollList;

	@SerializeField private var expeditionShopItem: ListItem;


	@Space(20)
	@SerializeField private var lael_Detail: Label;

	@SerializeField private var comingSoon: Label;

	@SerializeField private var mistExpeditionCoinImgBG: Label;

	@SerializeField private var mistExpeditionCoinLabel: Label;

	@SerializeField private var mistExpeditionCoinImg: Label;

	/*记录 desc 状态*/
	private static var selectedIdInShop: System.Collections.Generic.Dictionary.<int, boolean>;

	@Space(20)/*字符串*/
	@SerializeField private var langKey_Shop_Text1: String;/*远征商店物品限购数量每周一零点刷新*/
	@SerializeField private var langKey_Expedition_StayTuned: String;/*内容暂未开放 敬请期待*/


	public function Init() {
		super.Init();

		lael_Detail.txt = Datas.getArString(langKey_Shop_Text1);
		comingSoon.txt = Datas.getArString(langKey_Expedition_StayTuned);
		mistExpeditionCoinImgBG.Init();
		mistExpeditionCoinImg.Init();
		mistExpeditionCoinLabel.Init();

		expeditionShopItem.Init();
		scrollList.Init(expeditionShopItem);

		selectedIdInShop = new System.Collections.Generic.Dictionary.<int, boolean>();
	}


	public function SetData(): void {
		mistExpeditionCoinLabel.txt = Datas.getArString("Common.Owned") + ": " + Payment.instance().NormalGems;

		resetDescShowStateId();
		ResetDescShowState();

		//var shop: Shop = Shop.instance();
		//scrollList.SetData(shop.dataGeneral);
		//scrollList.ResetPos();
	}


	public function OnPop() {
		resetDescShowStateId();
		scrollList.Clear();
	}


	public function Draw() {
		if (!visible) return;
		scrollList.Draw();
		lael_Detail.Draw();
		comingSoon.Draw();
		mistExpeditionCoinImgBG.Draw();
		mistExpeditionCoinImg.Draw();
		mistExpeditionCoinLabel.Draw();

	}

	public function Update() {
		scrollList.Update();
	}

	public function handleNotification(type: String, body: Object): void {

		switch (type) {
			case "UpdateItem":
				UpdateInventoryItemCount();
				break;
		}
	}

	private function UpdateInventoryItemCount() {

		scrollList.UpdateData();

	}


	/* 重置 所有的 item 的desc的显示状态 */
	public static function ResetDescShowState() {
		selectedIdInShop = new System.Collections.Generic.Dictionary.<int, boolean>();
	}


	/*添加被点击过的物体*/
	public function addSelectedId(_id: int, isDescShow: boolean): void {

		if (selectedIdInShop.ContainsKey(_id))
			selectedIdInShop[_id] = isDescShow;
		else
			selectedIdInShop.Add(_id, isDescShow);
	}


	/*判断是否被点击过*/
	public function GetSelectedId(_id: int): boolean {

		if (selectedIdInShop.ContainsKey(_id)) {
			return selectedIdInShop[_id];
		} else {
			return false;
		}
	}

	/*清除记录的物体*/
	public static function resetDescShowStateId(): void {

		selectedIdInShop.Clear();
		selectedIdInShop = null;
	}

}