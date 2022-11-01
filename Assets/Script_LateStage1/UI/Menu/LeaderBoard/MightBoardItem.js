
class MightBoardItem extends	FullClickItem{
	
	public var lblRank:Label;
	public var lblName:Label;
	public var lblAllianceName:Label;
	public var lblMight:Label;
	public var lblBackGround:Label;
	
	
	public	function	Awake(){
		super.Awake();
	}
	
	public function SetIndexInList(index:int)
	{
		if(index % 2 == 0)
		{
			lblBackGround.setBackground("rank_single_background", TextureType.FTE);
			lblBackGround.SetVisible(true);
		}
		else
		{
			lblBackGround.SetVisible(false);
			//lblBackGround.setBackground("rank_double_background", TextureType.FTE);
		}
	}
	
	public	function	SetRowData(data:Object){
		var mightInfo:MightItem = data as MightItem;
		lblRank.txt = mightInfo.Rank + "";
		lblName.txt = mightInfo.Name;
		lblAllianceName.txt = mightInfo.AllianceName;
		lblMight.txt = _Global.NumSimlify(mightInfo.Might, Constant.MightDigitCountInList, false);
		
		line.rect = Rect(20, rect.height - 4, 500, 4);
		
		btnDefault.OnClick = onItemClick;
		btnDefault.clickParam = data;
	}
	
	public	function	Update(){
		
	}
	
	
	public function DrawItem() {
		if (!visible) { return; }
		super.DrawItem();
		//GUI.BeginGroup(rect);
		if(lblBackGround != null)
		{
			lblBackGround.Draw();		
		}
		lblRank.Draw();
		lblName.Draw();
		lblAllianceName.Draw();
		lblMight.Draw();
		//GUI.EndGroup();
	}
	
	private	function	onItemClick(param:Object){
		var userInfo:UserDetailInfo = new UserDetailInfo();
		var mightInfo:MightItem = param as MightItem; 
		userInfo.userId = "" + mightInfo.UserId;
		userInfo.userName = mightInfo.Name;
		userInfo.allianceId = "" + mightInfo.AllianceId;
 		userInfo.viewFrom = UserDetailInfo.ViewFromLeaderBoard;
 		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
	}
}