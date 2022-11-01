/*
 * @FileName:		MistExpeditionSceneMenuBattleEventRewardPreviewItem.js
 * @Author:			lisong
 * @Date:			2022-04-11 04:23:59
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 战斗事件点 - 预奖励物品项(战斗事件界面显示)
 *
*/


public class MistExpeditionSceneMenuBattleEventRewardPreviewItem extends ListItem {


	@Space(30) @Header("---------- MistExpedition SceneMenu BattleEvent Reward Preview Item ----------")

	@Header("----------language key")
	@SerializeField private var langKey_itemName: String;
	@SerializeField private var langKey_itemDesc: String;
	@Space(20)

	@SerializeField private var itemIcon: Label;
	@SerializeField private var desc1: Label;
	@SerializeField private var desc2: Label;




	private var itemID: int = 0;





	public function Init(): void {
		super.Init();
	}



	public function OnPopOver() {
		super.OnPopOver();
	}


	public function Draw() {
		if (!visible)
			return;

		GUI.BeginGroup(rect);

		itemIcon.Draw();
		desc1.Draw();
		desc2.Draw();

		GUI.EndGroup();

	}



	public function SetRowData(data: Object): void {
		var dataHash: Hashtable = data as Hashtable;

		var battleType = MistExpeditionManager.GetEventTypeFromIntValue(_Global.INT32(dataHash["battleType"]));

		itemID = _Global.INT32(dataHash["itemID"]);
		var tempID = "i" + itemID;



		if (battleType == MistExpeditionMapSlotEventType.Battle_Boss) {
			itemIcon.useTile = true; 
			itemIcon.mystyle.normal.background = null;

			var tileName = TextureMgr.instance().LoadTileNameOfItem(itemID);
			itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(tileName);


			desc1.txt = Datas.getArString("itemName." + tempID);
			desc2.txt = Datas.getArString("itemDesc." + tempID);

		}
		else {
			itemIcon.useTile = false; 

			var itemImg = TextureMgr.instance().LoadTexture("mistexpedition_battle_random_reward_" + tempID, TextureType.MISTEXPEDITION);
			if (itemImg != null)
				itemIcon.mystyle.normal.background = itemImg;

			desc1.txt = Datas.getArString(langKey_itemName + tempID);
			desc2.txt = Datas.getArString(langKey_itemDesc + tempID);
		}
		



	}


}
