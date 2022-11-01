/*
 * @FileName:		MistExpeditionSceneMenuTroopItem.js
 * @Author:			lisong
 * @Date:			2022-04-28 07:38:13
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征  部队 item
 *
*/


public class MistExpeditionSceneMenuTroopItem extends ListItem {

		@Space(30) @Header("---------- MistExpeditionSceneMenu BattleEvent March TroopItem ----------")

		@Header("----------language key")
		@SerializeField private var langKey_troopName: String;

		@Space(20)
		@SerializeField private var isShowDetailInfo: boolean = false;

		@Space(20)
		@SerializeField private var bgImg :Label;

		@SerializeField private var iconImg: Label;
		@SerializeField private var nameLabel :Label;
		@SerializeField private var countLabel :Label;


		private var itemID: int = -1;






		public function Draw()
		{
			if (!visible)
				return;

			GUI.BeginGroup(rect);

			bgImg.Draw();
			nameLabel.Draw();
			iconImg.Draw();
			countLabel.Draw();

			GUI.EndGroup();
		}





		public function SetRowData(data:Object)
		{
			var info = data as Barracks.TroopInfo;	

			if (info != null) {

				if (itemID != info.typeId) {

					if (isShowDetailInfo)
						countLabel.txt = info.selectNum + "/" + info.owned;
					else
						countLabel.txt = info.owned.ToString();

					nameLabel.txt = info.troopName;
					iconImg.tile = TextureMgr.instance().UnitSpt().GetTile(info.troopTexturePath);

					itemID = info.typeId;
				}

			}
		}


}
