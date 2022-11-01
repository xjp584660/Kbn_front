/*
 * @FileName:		MistExpeditionSceneMenuSupplyStationEventItem.js
 * @Author:			lisong
 * @Date:			2022-04-08 03:33:49
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 中途补给站 - 物品项
 *
*/


public class MistExpeditionSceneMenuSupplyStationEventItem extends ListItem {

	@Space(30) @Header("---------- MistExpedition SceneMenu SupplyStationEvent Item ----------")


	@Header("----------language key")
	@SerializeField private var langKey_itemName: String;
	@SerializeField private var langKey_itemDesc: String;
	@Space(20)

	@SerializeField private var itemIcon: Label;
	@SerializeField private var itemIconMask: Label;
	@SerializeField private var itemName: Label;
	@SerializeField private var itemDescription: Label;
	@SerializeField private var divideline: Label;



	@SerializeField private var selectBtn: Button;



	private var menuController: MistExpeditionSceneMenuSupplyStationEvent = null;/* 列表项 所对应的 menu */
	private var itemID: String = String.Empty;

	public function Init(): void {
		itemIcon.Init();
		itemName.Init(); 
		itemDescription.Init(); 
		divideline.Init();



		selectBtn.Init();

		selectBtn.OnClick = handleSelectedClick;

	}



	public function Draw() {

		if (!visible)
			return;

		GUI.BeginGroup(rect);

		itemIcon.Draw();
		itemName.Draw(); 
		itemDescription.Draw();

		selectBtn.Draw();
		divideline.Draw();

		GUI.EndGroup();
	}



	public function SetRowData(tempData: Object): void {
		var data: HashObject = tempData as HashObject;

		itemID = data["itemid"].Value.ToString();
		var tempId = "i" + itemID;

		var img = TextureMgr.instance().LoadTexture("mistexpedition_buff_" + tempId, TextureType.MISTEXPEDITION);
		if (img != null)
			itemIcon.image = img;

		itemName.txt = Datas.getArString(langKey_itemName + tempId);
		itemDescription.txt = Datas.getArString(langKey_itemDesc + tempId);

		if (menuController != null) {
			SetSelectState(menuController.OnRefreshSelectStateFunc(itemID));
		}
	}

	public function SetViewMenu(menu: MistExpeditionSceneMenuSupplyStationEvent) {
		this.menuController = menu;
	}

	/* 点击 btn */
	private function handleSelectedClick(): void {
		if (menuController != null)
			menuController.OnItemSelectedFunc(itemID);
	}

	/* 设置 btn 选中状态 */
	public function SetSelectState(isSelected: boolean) {
		var texName = isSelected ? "check_box_1" : "check_box_2";

		selectBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(texName, TextureType.DECORATION);
	}

	
	/* 隐藏掉 选择按钮 */
	public function HideSelectBtn() {
		if (selectBtn != null)
			selectBtn.SetVisible(false);
	}

	/* 获得 item 的 ID */
	public function get ItemID(): String {
		return this.itemID;
	}

}