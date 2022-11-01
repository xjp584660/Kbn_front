/*
 * @FileName:		MistExpeditionSceneMenuBattleEventMarchChooseTroop.js
 * @Author:			lisong
 * @Date:			2022-04-28 07:32:43
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 战斗事件点 - march - 编辑选择部队
 *
*/


public class MistExpeditionSceneMenuBattleEventMarchChooseTroop extends PopMenu implements IEventHandler {

	@Space(30) @Header("---------- MistExpeditionSceneMenu BattleEvent March ChooseTroop ----------")


	@Header("----------language key")
	@SerializeField private var langKey_menuTitle: String;
	@Space(20)

	@Space(20) @Header("---------- top ----------")
	@SerializeField private var titleLabel: Label;
	@SerializeField private var line: Label;

	@Space(20) @Header("---------- troop ----------")
	@SerializeField private var troopsItemPrefab: ListItem;
	@SerializeField private var troopScrollList: ScrollList;
	@SerializeField private var noTroopTips: Label;

	@Space(20) @Header("---------- bottom ----------")
	@SerializeField private var troopTotalCount: Label;
	@SerializeField private var nextBtn: Button;
	@SerializeField private var closeBtn: Button;

	private var battleEventMarch: MistExpeditionSceneMenuBattleEventMarch;
	private var isHaveTroop = false;	/* 是否有部队 */
	private var isSliderUpdate = false;/* 列表中的 slider item 是否在滑动 */
  
	public function Init() {
		super.Init();

		troopsItemPrefab.Init();
		troopScrollList.Init(troopsItemPrefab);
		troopScrollList.itemDelegate = this;

		noTroopTips.txt = Datas.getArString("Expedition.NoTroopTips");
		titleLabel.txt = Datas.getArString(langKey_menuTitle);
		nextBtn.txt = Datas.getArString("Common.Next_Button");

		closeBtn.OnClick = OnCloseBtnClick;
		nextBtn.OnClick = OnNextBtnClick;

	 

	}


	public function DrawItem() {
		if (!visible)
			return;

		titleLabel.Draw();
		line.Draw();

		if (isHaveTroop)
			troopScrollList.Draw();
		else
			noTroopTips.Draw();

		troopTotalCount.Draw();

		nextBtn.Draw();
	}


	protected function DrawLastItem() {
		closeBtn.Draw();
	}



	public function OnPush(param: Object) {

		battleEventMarch = param as MistExpeditionSceneMenuBattleEventMarch;

		UpdateCurrentChooseTroopTotalText();

		UpdateTroopList();
		troopScrollList.ResetPos();
		isSliderUpdate = false;
	}
	
	

	public function OnPopOver() {
		troopScrollList.Clear();

	}


	public function Update() {
		if(!isSliderUpdate)
			troopScrollList.Update();

	}

	
	public function setMarchData(): void {
		 
	}

 
	private function UpdateTroopList(){

		var arr = MistExpeditionManager.GetInstance().GetTroopInfoArr();

		isHaveTroop = arr != null;

		if (isHaveTroop) {
			troopScrollList.SetData(arr);
			troopScrollList.UpdateData();
		}
	}


	
	private function OnCloseBtnClick(): void {
		MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventMarchChooseTroop);
		if (battleEventMarch != null) {
			battleEventMarch.UpdateChooseTroopList();
		}
	}

	private function OnNextBtnClick(): void {
		OnCloseBtnClick();
	}


	public function handleItemAction(action: String, param: Object) {

		switch (action) {
			case "slider_update":
				UpdateTroopSelectData(param as Hashtable);
				OnHandleItemSliderChanged();
				break;
			case "Slider_Up":
				OnHandleItemSliderChanged();
				isSliderUpdate = false;
				break;
			case "Slider_Down":
				isSliderUpdate = true;
				break;
		}
	}

	/* 剩余可以派遣的数值 */
	var limitValue: long = 0;

	private function OnHandleItemSliderChanged() {

		UpdateCurrentChooseTroopTotalText();

		limitValue = GetLimitCount();
		troopScrollList.ForEachItem(SliderValueChange);

	}


	private function SliderValueChange(item: ListItem): boolean {
		var troopItem = item as MistExpeditionSceneMenuBattleEventMarchChooseTroopItem;


		troopItem.SetSliderLimitValue(limitValue);
		troopItem.RefreshMaxLabel();

		if (limitValue <= 0) {
			SetTroopTotalTextLight();
			if (IsInvoking("SetTroopTotalTextNormal")) {
				CancelInvoke("SetTroopTotalTextNormal");
			}
			Invoke("SetTroopTotalTextNormal", 0.5f);
		}
		return true;
	}




	/* 更新部队选择的数据 */
	private function UpdateTroopSelectData(data: Hashtable) {

		if (data == null)
			return;

		var info = data["info_data"] as Barracks.TroopInfo;

		if (info == null)
			return;

		MistExpeditionManager.GetInstance().UpdateTroopInfo(info);
	}



	/* 还可以选择的部队的限制的数量 */
	private function GetLimitCount(): long {
		var total = MistExpeditionManager.GetInstance().GetTroopTotalCount();
		var selected = MistExpeditionManager.GetInstance().GetChooseTroopCount();
		return total - selected;
	}


	/* 更新 部队选择的总数文本显示 */
	private function UpdateCurrentChooseTroopTotalText() {

		var total = MistExpeditionManager.GetInstance().GetTroopTotalCount();
		var count = MistExpeditionManager.GetInstance().GetChooseTroopCount();

		troopTotalCount.txt = String.Format("{0}/{1}", _Global.NumSimlify(count), _Global.NumSimlify(total));
	}

 


	/* 当没有派满 部队时，正常显示 */
	private function SetTroopTotalTextNormal() {
		troopTotalCount.SetNormalTxtColor(FontColor.TabNormal);
	}

	/* 当派满 部队时，提示显示 */
	private function SetTroopTotalTextLight() {
		troopTotalCount.SetNormalTxtColor(FontColor.Red);
	}


}