/*
 * @FileName:		MistExpeditionSceneMenuBattleEventRewardItem.js
 * @Author:			lisong
 * @Date:			2022-04-11 04:23:59
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 战斗事件点 - 奖励 - 物品项
 *
*/


public class MistExpeditionSceneMenuBattleEventRewardItem extends ListItem {


	@Space(30) @Header("---------- MistExpedition SceneMenu BattleEvent RewardItem ----------")


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



	private var menuController: MistExpeditionSceneMenuBattleEventReward = null;/* 列表项 所对应的 menu */
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



	public function SetRowData(data: Object): void {

		itemID = data as String;
		var Icon: String;
		var Name: String;
		var Description: String;
		var Value: float;
		var type: int;
		var buffDic: Dictionary.<String, KBN.DataTable.IDataItem> = MistExpeditionManager.GetInstance().GetBuffDic();
		if (buffDic != null) {
			if (buffDic.ContainsKey(itemID)) {
				var expeditionBuff: KBN.DataTable.ExpeditionBuff = buffDic[itemID] as KBN.DataTable.ExpeditionBuff;
				Icon = expeditionBuff.ICON;
				Name = expeditionBuff.NAME;
				Description = expeditionBuff.DESCRIPTION;
				Value = _Global.FLOAT(expeditionBuff.VALUE);
				type = _Global.INT32(expeditionBuff.VALUE_TYPE);
			}
		}

		var itemTile = TextureMgr.instance().GetHeroSpt().GetTile(Icon);
		if (itemTile.prop != null) {
			itemIcon.useTile = true;
			itemIcon.tile = itemTile;
		} else {
			var itemImg = TextureMgr.instance().LoadTexture(Icon, TextureType.MISTEXPEDITION);
			if (itemImg != null) {
				itemIcon.useTile = false;
				itemIcon.mystyle.normal.background = itemImg;
			} else {
				itemIcon.useTile = true;
				itemIcon.tile = itemTile;
			}

		}

		
		itemName.txt = Datas.getArString(Name);
		if (type == 1) {
			Value = Value / 100;
			itemDescription.txt = String.Format(Datas.getArString(Description), Value);
		} else {
			itemDescription.txt = String.Format(Datas.getArString(Description), Value);
		}

		if (menuController != null) {
			SetSelectState(menuController.OnRefreshSelectStateFunc(itemID));
		}
	}

	public function SetViewMenu(menu: MistExpeditionSceneMenuBattleEventReward) {
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