/*
 * @FileName:		MistExpeditionSceneMenuChestEventItem.js
 * @Author:			lisong
 * @Date:			2022-04-08 03:33:33
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 宝箱 - 物品项
 *
*/


public class MistExpeditionSceneMenuChestEventItem extends ListItem {


	@Space(30) @Header("---------- MistExpedition SceneMenu ChestEvent Item ----------")



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



	private var menuController: MistExpeditionSceneMenuChestEvent = null;/* 列表项 所对应的 menu */
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

		itemID = data["itemid"].Value as String;
		var tempId = "i" + itemID;

		var key: String = data["itemid"].Value as String;
		var buffDic: Dictionary.<String, KBN.DataTable.IDataItem> = MistExpeditionManager.GetInstance().GetBuffDic();/*获取buff 字典数据*/
		if (!buffDic.ContainsKey(key)) return; /*判断该商品ID是否是 buff */
		var itemBuff: KBN.DataTable.ExpeditionBuff = buffDic[key] as KBN.DataTable.ExpeditionBuff;


		var img = TextureMgr.instance().LoadTexture(itemBuff.ICON, TextureType.MISTEXPEDITION);
		if (img != null)
			itemIcon.mystyle.normal.background = img;

		itemName.txt = Datas.getArString(itemBuff.NAME);
		var Value: Object;
		var type: int = _Global.INT32(itemBuff.VALUE_TYPE);
		if (type == 1) {
			Value = _Global.FLOAT(itemBuff.VALUE) / 100;
		} else {
			Value = itemBuff.VALUE;
		}

		itemDescription.txt = String.Format(Datas.getArString(itemBuff.DESCRIPTION), Value);


		if (menuController != null) {
			SetSelectState(menuController.OnRefreshSelectStateFunc(itemID));
		}
	}

	public function SetViewMenu(menu: MistExpeditionSceneMenuChestEvent) {
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



	/* 获得 item 的 ID */
	public function get ItemID(): String {
		return this.itemID;
	}

}