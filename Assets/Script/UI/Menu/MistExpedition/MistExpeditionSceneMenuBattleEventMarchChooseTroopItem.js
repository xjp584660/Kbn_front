/*
 * @FileName:		MistExpeditionSceneMenuBattleEventMarchChooseTroopItem.js
 * @Author:			lisong
 * @Date:			2022-04-28 07:38:13
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 战斗事件点 - march - 编辑选择部队 item
 *
*/


public class MistExpeditionSceneMenuBattleEventMarchChooseTroopItem extends ListItem {

	@Space(30) @Header("---------- MistExpeditionSceneMenu BattleEvent March ChooseTroop Item ----------")


	@Header("----------language key")
	@SerializeField private var langKey_troopName: String;
	@Space(20)

	@SerializeField private var lineImg: Label;
	@SerializeField private var iconImg: Label;
	@SerializeField private var nameLabel: Label;
	@SerializeField private var numInputText: InputText;
	@SerializeField private var slider: Slider;
	@SerializeField private var minLabel: Label;
	@SerializeField private var maxLabel: Label;
	@SerializeField private var maxBtn: Button;

 

	private var troopInfoData = new Barracks.TroopInfo();
	private var marchDataIns: MistExpeditionManager;







	public function Init() {
		super.Init();
		marchDataIns = MistExpeditionManager.GetInstance();

		lineImg.setBackground("between line_list_small", TextureType.DECORATION);
		minLabel.txt = "0";

		numInputText.type = TouchScreenKeyboardType.NumberPad;
		numInputText.filterInputFunc = OnHandlerFilterInputFunc;
		numInputText.inputDoneFunc = OnHandlerInputDoneFunc;
		numInputText.Init();

		maxBtn.OnClick = OnMaxBtnClick;

		slider.Init(100);

	}





	public function Draw() {
		if (!visible) return;


		GUI.BeginGroup(rect);

		iconImg.Draw();
		nameLabel.Draw();
		numInputText.Draw();
		slider.Draw();
		minLabel.Draw();
		maxLabel.Draw();
		maxBtn.Draw();
		lineImg.Draw();

		GUI.EndGroup();
	}


 
 

	public function SetRowData(obj: Object): void {

		troopInfoData = obj as Barracks.TroopInfo;


		var itemID = troopInfoData.typeId;
		var currentCount = troopInfoData.selectNum;
		var maxCount = marchDataIns.GetTroopTotalCount();


		iconImg.tile = TextureMgr.instance().UnitSpt().GetTile("ui_" + itemID);

		nameLabel.txt = Datas.getArString(langKey_troopName + itemID);

		numInputText.txt = "" + currentCount;

		var isVal = maxCount >= troopInfoData.owned;
		
		/*maxLabel.txt = isVal ? _Global.NumSimlify(troopInfoData.owned) : _Global.NumSimlify(maxCount) + "/" + _Global.NumSimlify(troopInfoData.owned);*/
		maxLabel.txt = _Global.NumSimlify(troopInfoData.owned);


		slider.valueChangedFunc = OnSliderValueChangedFunc;
		slider.onMouseFunc = OnSliderMouseFunc;

		slider.Init(isVal ? troopInfoData.owned : MarchDataManager.instance().MAXSIZE);

		slider.SetCurValue(currentCount);

		

		
		if (handlerDelegate != null)
			handlerDelegate.handleItemAction("Slider_Up", null);
	}


 

	/*----------------------------- InputText --------------------------------------------*/

	/* 输入框输入 */
	private function OnHandlerFilterInputFunc(oldStr: String, newStr: String): String {

		var count: long = GetInputValue(newStr);

		OnSliderValueChangedFunc(count);

		return count + "";
	}

	/* 输入框输入完成 */
	private function OnHandlerInputDoneFunc(inputStr: String) {

		var count: long = GetInputValue(inputStr);

		OnSliderValueChangedFunc(count);

		OnSliderMouseFunc(false);

		return count + "";
	}

	/* 对输出的数据进行过滤处理后，获得正确的结果 */
	private function GetInputValue(inputStr: String): long {
		var input: String = _Global.FilterStringToNumberStr(inputStr);

		if (String.IsNullOrEmpty(input))
			return 0;

		var count: long = _Global.INT64(input);

		count = Mathf.Clamp(count, 0, slider.MaxValue);

		if (count > slider.GetLimitValue())
			count = slider.GetLimitValue();

		return count;
	}


	private function UpdateInputVal(val: long): void {
	}

/*----------------------------------- Slider ------------------------------------------*/


	private function OnSliderMouseFunc(isDown: boolean) {

		if (handlerDelegate != null)
			handlerDelegate.handleItemAction(isDown ? "Slider_Down" : "Slider_Up", null);

	}

	private function OnSliderValueChangedFunc(val: long) {


		/* 数据钳制处理 */

		val = Mathf.Clamp(val, 0, troopInfoData.owned);
		val = val >= slider.MaxValue ? slider.MaxValue : val;
		val = val >= slider.GetLimitValue() ? slider.GetLimitValue() : val;


		slider.SetCurValue(val);

		numInputText.txt = "" + val;
		troopInfoData.selectNum = val;

		if (handlerDelegate != null) {
			var data = new Hashtable();
			data.Add("info_data", troopInfoData);
			handlerDelegate.handleItemAction("slider_update", data);
		}
	}


	public function SetSliderLimitValue(limitValue: long) {
		slider.SetLimitValue(limitValue);
	}


/*------------------------------------------------------------------------------------*/


	private function OnMaxBtnClick(Param: Object) {

		OnSliderValueChangedFunc(troopInfoData.owned);

		OnSliderMouseFunc(false);

	}


	public function RefreshMaxLabel() {
		if (troopInfoData != null) {
			var maxCount = marchDataIns.GetTroopTotalCount();
			/*maxLabel.txt = maxCount >= troopInfoData.owned
				? (_Global.NumSimlify(troopInfoData.owned))
				: (_Global.NumSimlify(maxCount) + "/" + _Global.NumSimlify(troopInfoData.owned));*/

			maxLabel.txt = _Global.NumSimlify(troopInfoData.owned);

			slider.SetMaxValue(maxCount >= troopInfoData.owned ? troopInfoData.owned : maxCount);
		}
	}

}

