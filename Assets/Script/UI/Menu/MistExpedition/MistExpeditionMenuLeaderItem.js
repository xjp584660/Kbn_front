/*
 * @FileName:		MistExpeditionMenuLeaderItem.js
 * @Author:			xue
 * @Date:			2022-06-16 05:52:51
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 排行榜 - 每条数据Item
 *
*/


public class MistExpeditionMenuLeaderItem extends FullClickItem {
    @Space(30) @Header("----------MistExpedition - MenuLeader - Item----------")

	@SerializeField private var lblRank: Label;
	@SerializeField private var lblName: Label;
	@SerializeField private var lblAllianceName: Label;
	@SerializeField private var lblMight: Label;
	@SerializeField private var lblBackGround: Label;



	public function	Awake() {
		super.Awake();
	}


	public function SetIndexInList(index: int) {
		if (index % 2 == 0) {
			lblBackGround.setBackground("rank_single_background", TextureType.FTE);
			lblBackGround.SetVisible(true);
		}
		else {
			lblBackGround.SetVisible(false);
		}
	}

	public function	SetRowData(data: Object) {
		var mightInfo: MightItem = data as MightItem;
		lblRank.txt = mightInfo.Rank + "";
		lblName.txt = mightInfo.Name;
		lblAllianceName.txt = mightInfo.AllianceName;
		lblMight.txt = _Global.NumFormat(mightInfo.Might);/*使用千位分割符显示*/

		line.rect = Rect(20, rect.height - 4, 500, 4);

		btnDefault.OnClick = onItemClick;
		btnDefault.clickParam = data;
	}

	public function	Update() {

	}


	public function DrawItem() {
		if (!visible) { return; }
		super.DrawItem();

		if (lblBackGround != null) {
			lblBackGround.Draw();
		}
		lblRank.Draw();
		lblName.Draw();
		lblAllianceName.Draw();
		lblMight.Draw();
	}

	private function	onItemClick(param: Object) {
		var userInfo: UserDetailInfo = new UserDetailInfo();
		var mightInfo: MightItem = param as MightItem;
		userInfo.userId = "" + mightInfo.UserId;
		userInfo.userName = mightInfo.Name;
		userInfo.allianceId = "" + mightInfo.AllianceId;
		userInfo.viewFrom = UserDetailInfo.ViewFromLeaderBoard;
		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
	}

}