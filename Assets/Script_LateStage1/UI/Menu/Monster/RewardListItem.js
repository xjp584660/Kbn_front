class RewardListItem extends ListItem {

	public var countText: Label;
	public var countText1: Label;
	public var gemLevel: Label;
	private var Tp: TweenPosition;
	public var Tp2: TweenPosition;

	private var itemID: int;
	private var reward: HashObject;

	public var monsterInfo: MonsterMenuDetailedInfo;

	private function IsBigScreen(): boolean {
		if (960 * Screen.width > 640 * Screen.height) { return true; }
		return false;
	}

	public function Init() {
		super.Init();
		Tp = gameObject.GetComponent(TweenPosition);
		// icon.rect=Rect(0,500,icon.rect.width,icon.rect.height);
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		gemLevel.useTile = true;
		gemLevel.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		countText.Init();
		countText1.Init();
		icon.inScreenAspect = !IsBigScreen();
		icon.lockWidthInAspect = !IsBigScreen();
		gemLevel.inScreenAspect = !IsBigScreen();
		gemLevel.lockWidthInAspect = !IsBigScreen();


		/*添加物品详细按钮点击事件*/
		btnSelect.OnClick = DetailedInfo;
	}
	public function SetRowData(data: Object, type: int) {
		reward = data as HashObject;
		if (type == 2) {
			setd();
		}
		else if (type == 1) {
			icon.tile.name = "";
			gemLevel.tile.name = "";
			countText.txt = "";
			countText1.txt = "";
			countText.mystyle.normal.background = null;
			countText1.mystyle.normal.background = null;
			Invoke("setd", 0.8f);
		}
	}

	private function setd() {
		var texMgr: TextureMgr = TextureMgr.instance();
		itemID = _Global.INT32(reward["itemId"]);

		if (itemID == 2111) {
			icon.tile.name = "gems1";
		} else {
			icon.tile.name = texMgr.LoadTileNameOfItem(itemID);

			if (itemID >= 42000 && itemID <= 42399) {
				var idStr: String = itemID.ToString();
				idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
				var level: int = KBN._Global.INT32(idStr);
				var nameLevel: int = level % Constant.GEM_LEVEL;
				var fileName: String = "gearstone_" + (nameLevel + 1);
				gemLevel.tile = texMgr.ElseIconSpt().GetTile(fileName);
			}
		}
		countText.mystyle.normal.background = TextureMgr.instance().LoadTexture("mask_1", TextureType.DECORATION);
		countText1.mystyle.normal.background = TextureMgr.instance().LoadTexture("mask_1", TextureType.DECORATION);
		countText.txt = "x" + _Global.INT32(reward["itemNum"]).ToString();
		countText1.txt = "x" + _Global.INT32(reward["itemNum"]).ToString();
		print(countText.txt);
	}
	
	function Draw() {
	if (!visible) return;
	GUI.BeginGroup(rect);
	btnSelect.Draw();
	title.Draw();
	icon.Draw();
	gemLevel.Draw();
	description.Draw();
	countText.Draw();
	countText1.Draw();
	this.rect.x = transform.localPosition.x;
	this.rect.y = transform.localPosition.y;
	if (Tp2 != null) { this.rect.y = Tp2.transform.localPosition.y; }
	GUI.EndGroup();

	if (MonsterMenuDetailedInfo.isSwitch) {
		monsterInfo.Draw();
	}
}

public function Update() {
	#if UNITY_EDITOR
	if (Input.GetMouseButton(0)) {
		MonsterMenuDetailedInfo.IsMonsterMenuDetailedInfo(false);
	}
	#endif
	if (Input.touchCount > 0) {
		MonsterMenuDetailedInfo.IsMonsterMenuDetailedInfo(false);
	}

}

public function OnPopOver() {
	super.OnPopOver();
	icon.tile.name = null;
	icon.tile = null;
	countText.txt = "";
	countText1.txt = "";
}

//设置初始位置
public function InitPosition(i: int, x: int): void {
	this.transform.localPosition = new Vector3(-i * x, transform.localPosition.y, transform.localPosition.z);
}
//设置动画开始位置
public function InitTweenPosition(x: float, x_to: float): void {
	this.transform.localPosition = new Vector3(x, transform.localPosition.y, transform.localPosition.z);
	if (Tp != null) {
		Tp.from = new Vector3(x, 550, transform.localPosition.z);
		Tp.to = new Vector3(x_to, 640, transform.localPosition.z);
		Tp.Play(true);
		if (Tp2 != null) {
			Tp2.AddOnFinished(DestroyTp2);
			Tp2.Play(true);
		}
		Tp.AddOnFinished(Des);
	}
}
private function Des() {
	Invoke("DestroyTween", 0.1F);
}
private function DestroyTween() {
	Destroy(gameObject);
}


private function DestroyTp2() {
	Tp2 = null;
}


/*奖励物品详细方法*/
private function DetailedInfo() {

	//MenuMgr.getInstance().PushMenu(monsterMenuDetailedInfo, itemID);

	if (itemID <= 0) return;
	MonsterMenuDetailedInfo.IsMonsterMenuDetailedInfo(true);
	monsterInfo.Init();
	monsterInfo.SetData(itemID);
}

}

