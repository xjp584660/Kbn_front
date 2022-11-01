/*
 * @FileName:		MistExpeditionSceneMenuTroopInfo.js
 * @Author:			xue
 * @Date:			2022-04-02 05:32:16
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	部队信息
 *
*/


public class MistExpeditionSceneMenuTroopInfo extends PopMenu {
	@Space(30) @Header("---------- MistExpedition SceneMenu TroopInfo ----------")

	@SerializeField private var scroll: ScrollList;

	@SerializeField private var ins_TroopsItem: ListItem;

	@SerializeField private var btn_OK: Button;

	@SerializeField private var leaderName: Label;

	@SerializeField private var head: Label;

	@SerializeField private var LabelFrame: Label;

	@SerializeField private var l_Line: Label;

	@SerializeField private var detail: Button;

	@SerializeField private var troopTotalCount: Label;

	public var texture_line: Texture2D;

	private var leaderInfo: MistExpeditionLeaderInfo;

	@Space(20)/*字符串*/
	@SerializeField private var langKey_Scene_Troops: String;/*远征军队 */


	public function Init() {
		super.Init();
		ins_TroopsItem.Init();
		troopTotalCount.Init();
		scroll.Init(ins_TroopsItem);

		btn_OK.txt = Datas.getArString("Common.OK_Button");
		btn_OK.OnClick = OnBtnClick;
		title.txt = Datas.getArString(langKey_Scene_Troops);
		detail.OnClick = OnDetailClick;
	}

	public function DrawBackground() {
		super.DrawBackground();
		this.drawTexture(texture_line, 45, 105, 490, 17);
	}

	public function DrawItem() {
		scroll.Draw();
		btn_OK.Draw();
		leaderName.Draw();
		LabelFrame.Draw();
		head.Draw();
		detail.Draw();
		l_Line.Draw();
		troopTotalCount.Draw();

	}

	public function OnPush(param: Object) {

		/* leader */
		leaderInfo = MistExpeditionManager.GetInstance().GetCurrentLeaderInfo();

		if (leaderInfo != null) {
			head.tile = TextureMgr.instance().ItemSpt().GetTile(leaderInfo.Head);
			leaderName.txt = Datas.getArString(leaderInfo.Name);
		}


		/* troops */
		var troopDic = MistExpeditionManager.GetInstance().GetTroopInfoDic();
		if (troopDic != null) {
			var tempTroopList = new Array();
			for (var kv: KeyValuePair.<int, Barracks.TroopInfo> in troopDic) {
				tempTroopList.push(kv.Value);
			}

			scroll.SetData(tempTroopList);

			var total = MistExpeditionManager.GetInstance().GetTroopTotalCount();

			troopTotalCount.txt = _Global.NumSimlify(total) + "";
		}

	}


	public function OnPopOver() {
		scroll.Clear();
	}

	public function Update() {
		scroll.Update();
	}


	public function OnBtnClick(): void {
		MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_TroopInfo);
	}


	private function OnDetailClick() {
		if (leaderInfo != null) {
			MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSkillInfo, leaderInfo);
		}
		
	}
}