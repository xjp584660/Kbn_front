class ReportObj extends UIObject {

	public var bg_1: Label;
	public var bg_2: Label;
	public var worldboss_bg: Label;
	public var worldboss_title: Label;

	public var labelTitle: Label;
	public var labelPic: Label;
	public var labelDescription: Label;
	public var labelExplanaton: Label;
	public var btnDetailArrow: Button;
	public var btnKnightInfo: Button;
	public var btnHeroInfo: Button;
	//public var picFrame:Label;
	public var labelScoutReport: Label;

	public var titleLocationBtn: Button;
	public var titleLocationBtn1: Button;
	public var attackerLocationBtn: Button;
	public var reportFramePic: Label;
	public var titleConquer: Label;
	//public var reportWin:Label;

	public var numGold: Label;
	public var numFood: Label;
	public var numWood: Label;
	public var numStone: Label;
	public var numSteel: Label;
	public var numCarmot: Label;
	public var contentLabel: Label;
	public var tempLabel: Label;

	public var picGold: Label;
	public var picFood: Label;
	public var picWood: Label;
	public var picStone: Label;
	public var picSteel: Label;
	public var picCarmot: Label;
	public var picTemp: Label;


	public var dropItemBg: Label;
	@SerializeField
	private var dropItemPair: NewSubItemPair;
	@SerializeField
	private var dropItemTitle: Label;

	@SerializeField
	private var stealFailTip: Label;
	@SerializeField
	private var stealFailTipBaseHeight: int = 20;

	public var picDivideLine1: Label;
	public var picDivideLine2: Label;
	public var bgLoot: Label;

	public var picItem1: Label;
	public var picItem2: Label;
	public var picItem3: Label;
	public var picItem4: Label;
	public var picItem5: Label;

	private var g_data: HashObject;
	private var g_header: HashObject;
	private var arStrings: Object;
	private var seed: HashObject;
	private var g_marchType: int;

	private var g_isDraw: boolean;
	private var g_isDisplayDetail: boolean;
	private var g_mapObject: MapView;
	private var g_isShareReport:boolean;

	public var new_CommonReportDetail: ComposedUIObj;

	public static var RESOURCES_PATH_SCENE: String = "Textures/UI/scenes/";//"Textures/UI/icon/icon_report/";

	@SerializeField
	private var tooWeakToInspectLabel: Label;

	function Init() {
	componentLoot.show = false;

	bg_1.Init();
	bg_2.Init();
	worldboss_bg.Init();

	labelTitle.Init();
	labelPic.Init();
	labelDescription.Init();
	labelExplanaton.Init();

	btnKnightInfo.Init();
	btnKnightInfo.OnClick = handleGear;
	btnKnightInfo.txt = Datas.getArString("Gear.BattleReportCheckGeneral");
	btnHeroInfo.Init();
	btnHeroInfo.OnClick = handleHero;
	btnHeroInfo.txt = Datas.getArString("Common.HeroInfo");
	btnHeroInfo.SetVisible(HeroManager.Instance().GetHeroEnable());

	btnRallyKnightInfo.Init();
	btnRallyKnightInfo.OnClick = handleGear;
	btnRallyKnightInfo.txt = Datas.getArString("Gear.BattleReportCheckGeneral");
	btnRallyHeroInfo.Init();
	btnRallyHeroInfo.OnClick = handleHero;
	btnRallyHeroInfo.txt = Datas.getArString("Common.HeroInfo");
	btnRallyHeroInfo.SetVisible(HeroManager.Instance().GetHeroEnable());

	btnDetailArrow.Init();
	btnDetailArrow.OnClick = handleDetail;
	labelScoutReport.Init();

	numGold.Init();
	numFood.Init();
	numWood.Init();
	numStone.Init();
	numSteel.Init();
	numCarmot.Init();
	tempLabel.Init();
	contentLabel.Init();

	picGold.Init();
	picFood.Init();
	picWood.Init();
	picStone.Init();
	picSteel.Init();
	picCarmot.Init();
	picTemp.Init();

	picDivideLine1.Init();
	picDivideLine2.Init();
	bgLoot.Init();


	titleLocationBtn.Init();
	titleLocationBtn.OnClick = locatePos;
	titleLocationBtn1.Init();
	titleLocationBtn1.OnClick = locatePos;
	attackerLocationBtn.Init();
	attackerLocationBtn.OnClick = locatePos;
	rallyLocationAttacker.Init();
	rallyLocationAttacker.OnClick = locatePos;
	rallyLocationDefender.Init();
	rallyLocationDefender.OnClick = locatePos;
	titleConquer.Init();
	//reportWin.Init();

	picItem1.Init();
	picItem2.Init();
	picItem3.Init();
	picItem4.Init();
	picItem5.Init();

	//picFrame.Init();

	headerTitle.Init();
	headerDate.Init();
	headerSpeed.Init();
	headerNo.Init();

	reportAttacker.Init();
	reportDefender.Init();
	reportAttackerDes.Init();
	reportDefenderDes.Init();
	reprotAttackerFought.Init();
	reprotDefenderFought.Init();
	worldBossSliderBg.Init();
	worldBossSliderTop.Init();
	scrollDisplay.Init();

	dropItemBg.txt = Datas.getArString("WorldBoss.Report_Text3");

	picDivideLine1.setBackground("Splitter_thick", TextureType.DECORATION);
	picDivideLine2.setBackground("between line", TextureType.DECORATION);

	var textureMgr: TextureMgr = TextureMgr.instance();
	reportFramePic.mystyle.normal.background = textureMgr.LoadTexture("info_button", TextureType.DECORATION);
	reportAttacker.image = textureMgr.LoadTexture("swords", TextureType.BUTTON);
	reportDefender.useTile = true;
	reportDefender.tile = textureMgr.GeneralSpt().GetTile("SlotMachine_icon2");
	//reportDefender.tile.name = "SlotMachine_icon2";
	this.picDivideLine1.mystyle.normal.background = textureMgr.LoadTexture("Splitter_thick", TextureType.DECORATION);
	this.btnKnightInfo.image = textureMgr.LoadTexture("DressPrompt_icon", TextureType.BUTTON);
	this.btnDetailArrow.mystyle.normal.background = textureMgr.LoadTexture("button_flip_right_normal", TextureType.BUTTON);

	//		arStrings = Datas.instance().arStrings();
	seed = GameMain.instance().getSeed();

	tooWeakToInspectLabel.txt = Datas.getArString("Report.UnrevealTips");
}

private function locatePos(clickParam: Object): void {
	MenuMgr.getInstance().PopMenu("");
	var chatMenu:ChatMenu = MenuMgr.getInstance().getMenu("ChatMenu") as ChatMenu;//战报分享关闭chatUI
	if (chatMenu != null)
	{
		MenuMgr.getInstance().PopMenu("ChatMenu");
	}	
	var avaChatMenu:AvaChatMenu = MenuMgr.getInstance().getMenu("AvaChatMenu") as AvaChatMenu;//战报分享关闭chatUI
	if (avaChatMenu != null)
	{
		MenuMgr.getInstance().PopMenu("AvaChatMenu");
	}
	var AvaCoopMenu: AvaCoopMenu = MenuMgr.getInstance().getMenu("AvaCoopMenu")as AvaCoopMenu;
	if(AvaCoopMenu!=null)
	{
		MenuMgr.getInstance().PopMenu("AvaCoopMenu");
	}
	var x: int = _Global.INT32((clickParam as Hashtable)["x"]);
	var y: int = _Global.INT32((clickParam as Hashtable)["y"]);




	Message.getInstance().GoToMapFromReport(x, y);
}

private function canShowKnight(): boolean {
	var r: boolean = true;

	var selfKnight: Knight = GearReport.Instance().Self;
	var enemyKnight: Knight = GearReport.Instance().Enemy;
	if (selfKnight == null) {
		r = false;
	}
	else {
		if (!selfKnight.IsIDValid())
			r = false;
	}
	if (enemyKnight == null) {
		r = false;
	}
	else {
		if (!enemyKnight.IsIDValid())
			r = false;
	}

	if (!r) {
		MenuMgr.getInstance().PushMessage(Datas.getArString("Gear.BattleReportCheckGeneralFailed"));
	}

	return r;
}
private function Parse(hash: HashObject) {
	if (hash != null) {
		if (hash["boxContent"] != null && hash["side"] != null) {
			GearReport.Instance().ParseSelf(hash["boxContent"], _Global.INT32(hash["side"]));
			GearReport.Instance().ParseEnemy(hash["boxContent"], 1 - _Global.INT32(hash["side"]));
		}
	}

}

private function handleDetail(): void {
	var data: Hashtable = { "data": g_data, "header": g_header };
	MenuMgr.getInstance().PushMenu("SubEmailDetail", data, "trans_zoomComp");
}

private function handleGear(): void {
	if (!canShowKnight()) return;
	var data: Hashtable = { "data": g_data, "header": g_header };
	MenuMgr.getInstance().PushMenu("GearReportPopMenu", data, "trans_zoomComp");
}

private function handleHero(): void {
	if (!HeroManager.Instance().GetHeroEnable()) {
		return;
	}

	var defendHeros: Array = _Global.GetObjectValues(g_data["s0Hero"]);
	var attackHeros: Array = _Global.GetObjectValues(g_data["s1Hero"]);

	var new_atkHero:Array=new Array();
	var new_defHero:Array=new Array();
	if (g_data["newHeroInfo"]!=null&&
		g_data["newHeroInfo"]["newOtherHeroInfo"]!=null&&
		g_data["newHeroInfo"]["newOtherHeroInfo"]["s1"] != null) {
		new_atkHero=_Global.GetObjectValues(g_data["newHeroInfo"]["newOtherHeroInfo"]["s1"]);
	}
	if (g_data["newHeroInfo"]!=null&&
		g_data["newHeroInfo"]["newOtherHeroInfo"]!=null&&
		g_data["newHeroInfo"]["newOtherHeroInfo"]["s0"] != null) {
		new_defHero=_Global.GetObjectValues(g_data["newHeroInfo"]["newOtherHeroInfo"]["s0"]);
	}

	if (defendHeros.length <= 0 && attackHeros.length <= 0&&
		new_atkHero.length<=0&&new_defHero.length<=0) {
		MenuMgr.getInstance().PushMessage(Datas.getArString("Common.HeroInfo_Text1"));
		return;
	}

	MenuMgr.getInstance().PushMenu("HeroReport", g_data, "trans_zoomComp");
}

private function handleLog() : void
{
	var okFunc:Function = function(result:HashObject)
	{
		if (result["ok"].Value) 
		{
			var arr3: Array = _Global.GetObjectKeys(g_data["rnds"]);
			var key: String;
			var rnds : HashObject;
					
			for(var c = 0; c < arr3.length; c++) 
			{
				key = arr3[c];
				var myUserId : int = _Global.INT32(key);
				if(GameMain.singleton.getUserId() == myUserId)
				{
					rnds = g_data["rnds"][key];
				}
			}
			//Ava 集结 只有集结者的数据是对的 
			//		"rnds":
			//		{
			//			"0":
			//			[
			//				25278,
			//				0
			//			],
			//			"4923":
			//			[
			//				14546,
			//				13676
			//			]
			//		},
			if(rnds == null)
			{
				for(var d = 0; d < arr3.length; d++) {
					key = arr3[d];
					var userID : int = _Global.INT32(key);
					if(userID != 0)
					{
						rnds = g_data["rnds"][key];
					}
				}
			}
			
			var logAndLine : ReportLogAndLineData = new ReportLogAndLineData();
			logAndLine.log = result["log"];
			logAndLine.line = rnds;
			logAndLine.tooWeakToInspect = _Global.GetBoolean(g_data["tooWeakToInspect"]);
			
			MenuMgr.getInstance().PushMenu("ReportLogMenu", logAndLine, "trans_zoomComp");
		}
	};
					
	var errorFunc:Function = function(errorMsg:String, errorCode:String)
	{
		ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
	};
	
	var reportId : int = _Global.INT32(g_header["rid"].Value);
	
	var ava : int = 0;
	if(g_marchType == Constant.AvaMarchType.ATTACK || g_marchType == Constant.AvaMarchType.REINFORCE || g_marchType == Constant.AvaMarchType.SCOUT
	|| g_marchType == Constant.AvaMarchType.RALLYATTACK || g_marchType == Constant.AvaMarchType.RALLYREINFORCE || g_marchType == Constant.AvaMarchType.RALLY)
	{
		ava = 1;
	}

	UnityNet.getReportLog(ava, reportId, okFunc, errorFunc);
}

public function setData(param: Object) {
	if (param == null) {
		return;
	}
	g_header = param as HashObject;
	if (g_header == null) {
		return;
	}

	if (g_header["marchtype"] == null || g_header["rid"] == null || g_header["side"] == null) {
		return;
	}
	g_marchType = _Global.INT32(g_header["marchtype"]);

	g_isDraw = false;
	g_isDisplayDetail = false;
	headerSpeed.SetVisible(false);
	g_mapObject = MapView.instance();

	scrollDisplay.MoveToTop();
	var rid: int = _Global.INT32(g_header["rid"]);
	var side: int = _Global.INT32(g_header["side"]);
	if(g_header["isShareReport"]!=null){
	   g_isShareReport = true;
	   scrollDisplay.rect = new Rect(0,95.26,640,860);
	   scrollDisplay.windowRect=new Rect(0,0,0,3062);
	   var result: HashObject = g_header["boxContent"];
	   successFunc(result);
	  
	}else{
	g_isShareReport = false;
	scrollDisplay.rect = new Rect(0,95.26,640,758.9);

	scrollDisplay.windowRect=new Rect(0,0,0,2859.8);
	Message.getInstance().viewMarchReport(rid, side, successFunc);

	}
	if (g_marchType == Constant.MarchType.ATTACK || g_marchType == Constant.MarchType.COLLECT || g_marchType == Constant.MarchType.COLLECT_RESOURCE || g_marchType == Constant.MarchType.PVE || g_marchType == Constant.MarchType.ALLIANCEBOSS ||
		g_marchType == Constant.MarchType.PVP || g_marchType == Constant.MarchType.EMAIL_WORLDBOSS) {
		Parse(g_header);
	}


}

public function setObjColor(color: Color): void {
	labelTitle.mystyle.normal.textColor = color;
	labelDescription.mystyle.normal.textColor = color;
	labelExplanaton.mystyle.normal.textColor = color;
	labelScoutReport.mystyle.normal.textColor = color;

	headerTitle.mystyle.normal.textColor = color;
	headerDate.mystyle.normal.textColor = color;
	headerSpeed.mystyle.normal.textColor = color;
	headerNo.mystyle.normal.textColor = color;

	//reportAttacker.mystyle.normal.textColor = color;
	//reportDefender.mystyle.normal.textColor = color;
	reportAttackerDes.mystyle.normal.textColor = color;
	reportDefenderDes.mystyle.normal.textColor = color;
	reprotAttackerFought.mystyle.normal.textColor = color;
	reprotDefenderFought.mystyle.normal.textColor = color;

	scoutUnit.setColor(color);
	scoutFrt.setColor(color);
	scoutView.setColor(color);
	scoutRes.setColor(color);
	scoutTec.setColor(color);
	scoutBuild.setColor(color);
}

private static var ATTACK_WIN: String = "Attack_Win";
private static var ATTACK_DEFEAT: String = "Attack_Defeat";
private var texturePath: String;

private function InitScoutReportDisplayData() {
	scrollDisplay.addUIObject(picDivideLine2);
	componentLoot.show = false;
	scoutReport();
	texturePath = g_scoutScene;
}

private function InitAttackReportDisplayData(): void {
	attackReport();
	if (g_attackScene.Contains("win") || g_attackScene.Contains("victory")) {
		texturePath = ATTACK_WIN;
	}
	else {
		texturePath = ATTACK_DEFEAT;
	}

	setLootData(4);
	componentLoot.show = true;
	PopulateStealFailTip();
	if (!String.IsNullOrEmpty(stealFailTip.txt)) {
		scrollDisplay.addUIObject(stealFailTip);
	}
	else if (g_attackDescription != null && g_attackDescription.Length != 0) {
		labelDescription.txt = g_attackDescription;
		scrollDisplay.addUIObject(labelDescription);
	}
	AddObtainedOrLostItemsToScrollView();

	new_CommonReportDetail.rect.height = 800f;/*恢复默认高 改变滑动 距离*/

	if (g_marchType == Constant.MarchType.RALLY_ATTACK || g_marchType == Constant.MarchType.JION_RALLY_ATTACK) {
		scrollDisplay.addUIObject(componentRallyReport);
	} else if (g_marchType == Constant.MarchType.MistExpedition) /*迷雾远征*/{
		if (g_data["playerBoost"] != null) {
			setLootData(Constant.MarchType.MistExpedition);
			new_CommonReportDetail.gameObject.GetComponent(NewCommonRepertDetail)
				.MistExpeditionRefresh(g_data, g_header, handleDetail, handleGear, handleHero, handleLog);
			new_CommonReportDetail.rect.height = 450f;/*迷雾远征 需要关闭 几个界面  设置高 改变滑动 距离*/
			scrollDisplay.addUIObject(new_CommonReportDetail);
		}
	}
	else {
		// if (g_header["new_atfIcon"]!=null&&g_header["new_atfIcon"].Value!=null&&g_header["new_atfIcon"].Value.ToString!="oldEmail") {   //???????
		if(g_data["playerBoost"]!=null){   //???
			new_CommonReportDetail.gameObject.GetComponent(NewCommonRepertDetail)
				.Refresh(g_data, g_header, handleDetail, handleGear, handleHero, handleLog);
			scrollDisplay.addUIObject(new_CommonReportDetail);
		} else {   //??email
			scrollDisplay.addUIObject(componentReport);
		}
	}

	var tooWeakToInspect: boolean = _Global.GetBoolean(g_data["tooWeakToInspect"]);
	tooWeakToInspectLabel.SetVisible(tooWeakToInspect);
	btnKnightInfo.SetVisible(!tooWeakToInspect);
	btnHeroInfo.SetVisible(!tooWeakToInspect);
}

private function InitDisplayDataAva_Content(): void {
	switch (g_marchType) {
		case Constant.AvaMarchType.SCOUT:
			InitScoutReportDisplayData();
			break;
		case Constant.AvaMarchType.RALLYATTACK:
		case Constant.AvaMarchType.ATTACK:
			InitAttackReportDisplayData();
			break;
	}
}

private function InitDisplayData_Content(): void {
	contentLabel.SetVisible(false);
	headerSpeed.SetVisible(false);
	if (Message.getInstance().ReportViewingType == ReportViewingType.Ava) {
		InitDisplayDataAva_Content();
		return;
	}

	var obj: HashObject;

	switch (g_marchType) {
		case 1:
			transportReport();
			texturePath = g_transportScene;

			setLootData(1);
			componentLoot.show = true;
			//scrollDisplay.addUIObject(componentLoot);
			break;
		case 5:
			reassignReport();
			texturePath = g_transportScene;
			setLootData(1);
			componentLoot.show = true;
			//scrollDisplay.addUIObject(componentLoot);
			if (g_data["unit"] && g_data["unit"] != "") {
				obj = new HashObject({ "unts": g_data["unit"] });

				scoutUnit.setData(obj);
				scrollDisplay.addUIObject(scoutUnit);
			}
			//              scrollDisplay.addUIObject(componentLoot);
			break;
		case 3:
			InitScoutReportDisplayData();
			break;
		case Constant.MarchType.ATTACK:
		case Constant.MarchType.EMAIL_WORLDBOSS:
		case Constant.MarchType.PVP:
		case Constant.MarchType.PVE:
		case Constant.MarchType.ALLIANCEBOSS:
		case Constant.MarchType.RALLY_ATTACK:
		case Constant.MarchType.JION_RALLY_ATTACK:
		case Constant.MarchType.MistExpedition:
			InitAttackReportDisplayData();
			break;
		case 8:
			attackReport();
			if (g_attackScene.Contains("win") || g_attackScene.Contains("victory")) {
				texturePath = ATTACK_WIN;
			}
			else {
				texturePath = ATTACK_DEFEAT;
			}

			setLootData(8);
			componentLoot.show = true;
			//scrollDisplay.addUIObject(componentLoot);
			scrollDisplay.addUIObject(labelDescription);
			scrollDisplay.addUIObject(picDivideLine2);
			AddObtainedOrLostItemsToScrollView();
			scrollDisplay.addUIObject(componentReport);
			break;
		case Constant.MarchType.COLLECT:
			if (g_data["winner"]) {//carmot tile attack report
				InitAttackReportDisplayData();
			} else {//carmot tile collect report
				setLootData(20);
				carmotReport();
				texturePath = "Gather_carmot";
				componentLoot.show = true;
				var listOfData: List.<InventoryInfo> = new List.<InventoryInfo>();
				AddLootItems(listOfData);
				AddDropItems(listOfData);
				if (listOfData.Count == 0) {
					contentLabel.SetVisible(true);//Newresource.Report_Noitem
					contentLabel.SetNormalTxtColor(FontColor.Description_Light);
					contentLabel.txt = Datas.getArString("Newresource.Report_Noitem");
				}
				UpdateScrollViewWithObtainedOrLostItems(listOfData);
			}

			break;
		case Constant.MarchType.COLLECT_RESOURCE:
			if (g_data["winner"]) {//carmot tile attack report
				InitAttackReportDisplayData();
			} else {//carmot tile collect report
				setLootData(23);
				carmotReport();
				texturePath = "Collect_Resource";
				componentLoot.show = true;
				var listOfData1: List.<InventoryInfo> = new List.<InventoryInfo>();
				AddLootItems(listOfData1);
				AddDropItems(listOfData1);
				if (listOfData1.Count == 0) {
					contentLabel.SetVisible(true);//Newresource.Report_Noitem
					contentLabel.SetNormalTxtColor(FontColor.Description_Light);
					contentLabel.txt = Datas.getArString("BattleReport.CollectionCompleteText");
				}
				UpdateScrollViewWithObtainedOrLostItems(listOfData1);
			}

			break;
	}
}

private function InitDisplayDataAva_Text(): void {
	switch (g_marchType) {
		case Constant.AvaMarchType.SCOUT:
			labelTitle.txt = g_scoutHeader.ToUpper();
			labelScoutReport.txt = g_scoutReportTitle;
			labelDescription.txt = g_scoutReport;
			break;
		case Constant.AvaMarchType.ATTACK:
		case Constant.AvaMarchType.RALLYATTACK:
			labelTitle.txt = g_attackResult.ToUpper();
			break;
	}
}

private function InitDisplayData_Text(): void {
	if (Message.getInstance().ReportViewingType == ReportViewingType.Ava) {
		InitDisplayDataAva_Text();
		return;
	}

	switch (g_marchType) {
		case 1:
			labelTitle.txt = g_transportTitle.ToUpper();
			break;
		case 3:
			labelTitle.txt = g_scoutHeader.ToUpper();
			labelScoutReport.txt = g_scoutReportTitle;
			labelDescription.txt = g_scoutReport;
			break;
		case Constant.MarchType.ATTACK:
		case Constant.MarchType.EMAIL_WORLDBOSS:
		case Constant.MarchType.PVP:
		case Constant.MarchType.PVE:
		case Constant.MarchType.ALLIANCEBOSS:
			labelTitle.txt = g_attackResult.ToUpper();
			//labelDescription.txt = g_attackDescription;
			break;
		case 5:
			labelTitle.txt = g_transportTitle.ToUpper();
			break;
		case 8:
			labelTitle.txt = g_attackResult.ToUpper();
			labelDescription.txt = g_attackDescription;
		case Constant.MarchType.COLLECT:
		case Constant.MarchType.COLLECT_RESOURCE:
			if (g_attackResult != null && g_data["winner"] != null) {
				labelTitle.txt = g_attackResult.ToUpper();
			}
			break;
	}
}

private function initDisplayData(result: HashObject): void {
	var texture: Texture2D;
	texturePath = "";

	scrollDisplay.clearUIObject();

	
	scrollDisplay.addUIObject(componentHeader);
	scrollDisplay.addUIObject(picDivideLine1);
	scrollDisplay.addUIObject(componentLoot);

	InitDisplayData_Content();

	if (texturePath) {
		texture = TextureMgr.instance().LoadTexture(texturePath, TextureType.REPORT);//Resources.Load(RESOURCES_PATH_SCENE + texturePath);
		labelPic.mystyle.normal.background = texture;
	}

	InitDisplayData_Text();

	scrollDisplay.AutoLayout();
}

private function PopulateStealFailTip(): void {
	stealFailTip.txt = GetStealFailTipTxt();
	if (String.IsNullOrEmpty(stealFailTip.txt)) {
		return;
	}
	var textHeight = _Global.CalcTextHeight(stealFailTip.mystyle, stealFailTip.txt, stealFailTip.rect.width);
	stealFailTip.rect.height = stealFailTipBaseHeight + textHeight;
}

private function GetStealFailTipTxt(): String {
	var stealFailReason: int = _Global.INT32(g_data["stealFail"]);
	//stealFailReason = 1;
	if (stealFailReason <= 0) {
		return String.Empty;
	}

	var stealItemId: int = ServerSettingUtils.GetItemToDefendId();
	if (stealItemId <= 0) {
		return String.Empty;
	}

	var format: String = Datas.getArString("StealItem.FailReason" + stealFailReason);
	var stealItemName = Datas.getArString(String.Format("itemName.i{0}", stealItemId));
	var ret: String = String.Empty;

	try {
		ret = String.Format(format, stealItemName);
	}
	catch (e: System.FormatException) {
		ret = format;
	}

	return ret;
}

private function AddObtainedOrLostItemsToScrollView(): void {
	var listOfData: List.<InventoryInfo> = new List.<InventoryInfo>();
	AddLootItems(listOfData);
	AddDropItems(listOfData);
	UpdateScrollViewWithObtainedOrLostItems(listOfData);
}

private function AddLootItems(listOfData: List.<InventoryInfo>): void {
	if (g_data["loot"] == null) {
		return;
	}

	var arr: String[] = _Global.GetObjectKeys(g_data["loot"]);
	if (arr.Length != 6 && arr.Length != 10) {
		return;
	}

	var itemsObj: HashObject = g_data["loot"][_Global.ap + (arr.Length - 1)];
	if (itemsObj == null) {
		return;
	}

	var items: String[] = _Global.GetObjectKeys(itemsObj);
	if (items.Length <= 0) {
		return;
	}

	var itemId: int;

	for (var i: int = 0; i < items.Length; ++i) {
		var inventoryInfo: InventoryInfo = new InventoryInfo();

		if (_Global.INT32(g_header["defCityId"]) != 0) {
			itemId = _Global.INT32(itemsObj[_Global.ap + 0]);
			inventoryInfo.quant = 1;
		}
		else {
			itemId = _Global.INT32(items[i]);
			inventoryInfo.quant = _Global.INT32(itemsObj[items[i]]);
		}
		if (!Museum.singleton.isItemExist(itemId) && g_marchType != Constant.MarchType.COLLECT && g_marchType != 
		Constant.MarchType.COLLECT_RESOURCE) {
			continue;
		}
		inventoryInfo.id = itemId;
		listOfData.Add(inventoryInfo);
	}


}

private function AddDropItems(listOfData: List.<InventoryInfo>): void {
	if (g_data["dropItems"] == null) {
		return;
	}

	GearReport.Instance().ParseChest(g_data);
	var itemIds: List.<int> = GearReport.Instance().ItemIds;
	//itemIds.AddRange([1, 2, 3, 4, 5]);
	if (itemIds == null || itemIds.Count <= 0) {
		return;
	}

	var itemCounts: List.<int> = GearReport.Instance().ItemCounts;
	//itemCounts.AddRange([5, 4, 3, 2, 1]);
	if (itemCounts == null || itemCounts.Count <= 0) {
		return;
	}

	for (var i: int = 0; i < itemIds.Count; ++i) {
		var inventoryInfo: InventoryInfo = new InventoryInfo();
		inventoryInfo.id = itemIds[i];
		inventoryInfo.quant = itemCounts[i];
		inventoryInfo.customParam1 = _Global.INT32(g_data["isDoubleReward"]);
		listOfData.Add(inventoryInfo);
	}
}

private function UpdateScrollViewWithObtainedOrLostItems(listOfData: List.<InventoryInfo>): void {
	if (listOfData.Count <= 0) {
		return;
	}

	if (getAttackReportType().Contains("win") || getAttackReportType().Contains("victory") || g_marchType == Constant.MarchType.COLLECT) {

		dropItemTitle.txt = Datas.getArString("WorldBoss.Report_Text2");//.ToUpper();
		// dropItemTitle.SetNormalTxtColor(FontColor.SmallTitle);

	}
	else {
		dropItemTitle.txt = Datas.getArString("WorldBoss.Report_Text2");//.ToUpper();
		// dropItemTitle.SetNormalTxtColor(FontColor.Red);
	}

	// scrollDisplay.addUIObject(dropItemTitle);
	if (g_marchType == Constant.MarchType.EMAIL_WORLDBOSS
		&& g_data["worldBossScore"] != null) {
		scrollDisplay.addUIObject(worldboss_jifen);
		worldboss_title.txt = Datas.getArString("WorldBoss.Report_Text1") + "+" + _Global.INT32(g_data["worldBossScore"]);
	}
	scrollDisplay.addUIObject(bg_1_com);

	for (var i: int = 0; i < listOfData.Count; i = i + 2) {
		var leftData: InventoryInfo = listOfData[i];
		var rightData: InventoryInfo = i + 1 >= listOfData.Count ? null : listOfData[i + 1];
		var dropItemPairClone: NewSubItemPair = Instantiate(dropItemPair) as NewSubItemPair;
		dropItemPairClone.SetData(leftData, rightData);
		scrollDisplay.addUIObject(dropItemPairClone);
	}

	// scrollDisplay.addUIObject(dropItemBg);
	// scrollDisplay.addUIObject(bg_2_com);

}

private function successFunc(result: HashObject) {
	g_data = result;
	g_isDraw = true;
	initDisplayData(result);
}

private var g_attackResult: String;
private var g_attackTitle: String;
private var g_attackScene: String;
private var g_attackDescription: String;

private var g_transportHeader: String;
private var g_transportTitle: String;
private var g_transportScene: String;

private var g_scoutHeader: String;
private var g_scoutResult: String;
private var g_scoutTitle: String;
private var g_scoutConquer: String;
private var g_scoutScene: String;
private var g_scoutReport: String;
private var g_scoutResource: String;
private var g_scoutExplanation: String;
private var g_scoutDescription: String;
private var g_scoutReportTitle: String;

//--------------------------------------------------------------------------------//

public var worldboss_jifen: ComposedUIObj;
public var bg_1_com: ComposedUIObj;
public var bg_2_com: ComposedUIObj;

public var componentLoot: ComposedUIObj;
//public var componentScene:ComposedUIObj;
public var componentItem: ComposedUIObj;
public var componentReport: ComposedUIObj;
public var componentHeader: ComposedUIObj;

public var headerTitle: Label;
public var headerDate: Label;
public var headerNo: Label;
public var headerSpeed: Label;

public var reportAttacker: Label;
public var reportDefender: Label;
public var reportAttackerDes: Label;
public var reportDefenderDes: Label;
public var reprotAttackerFought: Label;
public var reprotAttackerSurvive: Label;
public var reprotDefenderFought: Label;
public var reprotDefenderSurvive: Label;

//rally report
public var componentRallyReport: ComposedUIObj;
public var reportRallyAttackerDes: Label;
public var reportRallySelfDes: Label;
public var reportRallyDefenderDes: Label;
public var btnRallyKnightInfo: Button;
public var btnRallyHeroInfo: Button;
public var rallyLocationAttacker: Button;
public var rallyLocationDefender: Button;
public var reportRallyDefenderSurvive: Label;
public var reportRallyAttackerSurvive: Label;
public var reportRallySelfSurvive: Label;
public var reportRallySum: Label;

public var scrollDisplay: ScrollView;

public function Update() {
	scrollDisplay.Update();
}

private function transportReport() {
	g_transportTitle = Datas.getArString("ModalMessagesViewReports.TransportSuccessfull");
	g_transportHeader = Datas.getArString("ModalMessagesViewReports.TransportTo");
	renderReportTitle(g_transportHeader);
	g_transportScene = "transport_scene";
}

private function reassignReport(): void {
	g_transportTitle = Datas.getArString("ModalMessagesViewReports.ReassignSuccessfull");
	g_transportHeader = Datas.getArString("ModalMessagesViewReports.ReassignFrom");
	renderTitleForReassign(g_transportHeader);
	g_transportScene = "transport_scene";
}

private function carmotReport(): void {	
	var marchType : int = _Global.INT32(g_header["marchtype"].Value);
	if(marchType == Constant.MarchType.COLLECT)
	{
		labelTitle.txt = Datas.getArString("Newresource.Report_ResourcesGathered");
		g_transportHeader = Datas.getArString("Newresource.Report_Gatheredat") + " " + Datas.getArString("Newresource.tile_name_Nolevel");
	}
	else
	{
		labelTitle.txt = Datas.getArString("BattleReport.CollectionCompleteTitle");
		var tileType : int = _Global.INT32(g_data["type"].Value);
		g_transportHeader = String.Format(Datas.getArString("BattleReport.CollectionLocation"), CollectionResourcesMgr.instance().GetResourceName(tileType));
	}
	renderTitleForCarmot(g_transportHeader);

}
private function renderTitleForCarmot(subString: String): void {
	titleConquer.SetVisible(false);
	titleLocationBtn.SetVisible(true);//(left coord)
	titleLocationBtn1.SetVisible(false);//right coord
	//set title
	var title: String = subString;
	headerTitle.SetFont();
	var levelName: String = _Global.ToString(g_header["tilelv"]);
	headerTitle.txt = title + " " + Datas.getArString("Common.Lv") + levelName;
	var _size: Vector2 = headerTitle.mystyle.CalcSize(GUIContent(headerTitle.txt));
	headerTitle.rect.width = _size.x + 5;
	//set coord btn
	titleLocationBtn.rect.x = headerTitle.rect.x + headerTitle.rect.width;

	titleLocationBtn.txt = " (" + g_header["xcoord"].Value + "," + g_header["ycoord"].Value + ")";
	titleLocationBtn.clickParam = { "x": g_header["xcoord"].Value, "y": g_header["ycoord"].Value };
	titleLocationBtn.SetFont();
	_size = titleLocationBtn.mystyle.CalcSize(GUIContent(titleLocationBtn.txt));
	titleLocationBtn.rect.width = _size.x;

	headerDate.txt = g_header["date"].Value + "";
	var heroCarmotSpeed: int = g_header["heroCarmotSpeed"].Value;
	if (heroCarmotSpeed > 0) {
		headerSpeed.SetVisible(true);
		headerSpeed.txt = Datas.getArString("Newresource.Report_Miningspeed", [heroCarmotSpeed]);
	}

	headerNo.txt = Datas.getArString("ModalMessagesViewReports.ReportNo") + ": " + g_header["rid"].Value;
}


private function renderTitleForReassign(subString: String): void {
	titleLocationBtn.SetVisible(true);
	titleLocationBtn1.SetVisible(true);
	titleConquer.SetVisible(true);

	var fromCityName: String = " " + GameMain.instance().getCityNameById(_Global.INT32(g_header["atkCityId"])); //+ " (" + g_header["atkxcoord"].Value + "," + g_header["atkycoord"].Value + ") ";
	var toCityName: String = " " + GameMain.instance().getCityNameById(_Global.INT32(g_header["defCityId"])); //+ " (" + g_header["xcoord"].Value + "," + g_header["ycoord"].Value + ")";

	var title: String = subString + fromCityName;// + Datas.getArString("Common.To") + toCityName;

	headerTitle.SetFont();
	var _size: Vector2 = headerTitle.mystyle.CalcSize(GUIContent(title));
	headerTitle.txt = title;
	headerTitle.rect.width = _size.x + 5;
	titleLocationBtn.txt = " (" + g_header["atkxcoord"].Value + "," + g_header["atkycoord"].Value + ") ";
	titleLocationBtn.clickParam = { "x": g_header["atkxcoord"].Value, "y": g_header["atkycoord"].Value };
	titleLocationBtn.rect.x = headerTitle.rect.x + headerTitle.rect.width;

	titleLocationBtn.SetFont();
	_size = titleLocationBtn.mystyle.CalcSize(GUIContent(titleLocationBtn.txt));
	titleLocationBtn.rect.width = _size.x;
	titleConquer.txt = " " + Datas.getArString("Common.To") + toCityName;
	titleConquer.rect.x = titleLocationBtn.rect.x + titleLocationBtn.rect.width;

	titleConquer.SetFont();
	_size = titleConquer.mystyle.CalcSize(GUIContent(titleConquer.txt));
	titleConquer.rect.width = _size.x;
	titleLocationBtn1.txt = " (" + g_header["xcoord"].Value + "," + g_header["ycoord"].Value + ")";
	titleLocationBtn1.clickParam = { "x": g_header["xcoord"].Value, "y": g_header["ycoord"].Value };
	titleLocationBtn1.rect.x = titleConquer.rect.x + titleConquer.rect.width;

	titleLocationBtn1.SetFont();
	_size = titleLocationBtn1.mystyle.CalcSize(GUIContent(titleLocationBtn1.txt));
	titleLocationBtn1.rect.width = _size.x;

	headerDate.txt = g_header["date"].Value + "";
	headerNo.txt = Datas.getArString("ModalMessagesViewReports.ReportNo") + ": " + g_header["rid"].Value;

}

private function setLootData(_type: int) {
	numGold.txt = "0";
	numFood.txt = "0";
	numWood.txt = "0";
	numStone.txt = "0";
	numSteel.txt = "0";
	showTemp(false);
	if (Resource.instance().GetCastleLevel() >= Constant.CarmotLimitLevel) {
		numCarmot.txt = "0";
	} else {
		numCarmot.txt = " -- ";
	}
	numGold.SetNormalTxtColor(FontColor.Description_Light);
	numFood.SetNormalTxtColor(FontColor.Description_Light);
	numWood.SetNormalTxtColor(FontColor.Description_Light);
	numStone.SetNormalTxtColor(FontColor.Description_Light);
	numSteel.SetNormalTxtColor(FontColor.Description_Light);
	numCarmot.SetNormalTxtColor(FontColor.Description_Light);

	switch (_type) {
		case 1:
			if (g_data["gold"])
				numGold.txt = _Global.NumSimlify(_Global.INT64(g_data["gold"]));
			if (g_data["resource1"])
				numFood.txt = _Global.NumSimlify(_Global.INT64(g_data["resource1"]));
			if (g_data["resource2"])
				numWood.txt = _Global.NumSimlify(_Global.INT64(g_data["resource2"]));
			if (g_data["resource3"])
				numStone.txt = _Global.NumSimlify(_Global.INT64(g_data["resource3"]));
			if (g_data["resource4"])
				numSteel.txt = _Global.NumSimlify(_Global.INT64(g_data["resource4"]));
			if (g_data["resource7"]) {
				if (Resource.instance().GetCastleLevel() >= Constant.CarmotLimitLevel) {
					numCarmot.txt = _Global.NumSimlify(_Global.INT64(g_data["resource7"]));
				} else {
					numCarmot.txt = " -- ";
				}
			}

			break;
		case 4:
		case 8:
			if (g_data["loot"]) {
				var data: HashObject = g_data["loot"];

				if (data[_Global.ap + 0])
					changeColorAndFormat(numGold, data[_Global.ap + 0].Value);
				if (data[_Global.ap + 1])
					changeColorAndFormat(numFood, data[_Global.ap + 1].Value);
				if (data[_Global.ap + 2])
					changeColorAndFormat(numWood, data[_Global.ap + 2].Value);
				if (data[_Global.ap + 3])
					changeColorAndFormat(numStone, data[_Global.ap + 3].Value);
				if (data[_Global.ap + 4])
					changeColorAndFormat(numSteel, data[_Global.ap + 4].Value);
				if (data[_Global.ap + 7]) {
					if (Resource.instance().GetCastleLevel() >= Constant.CarmotLimitLevel) {
						changeColorAndFormat(numCarmot, data[_Global.ap + 7].Value);
					} else {
						changeColorAndFormat(numCarmot, -1l);
					}
				}

			}
			break;
		case Constant.MarchType.COLLECT:
			//					if(g_data["resource1"])
			//						numFood.txt = _Global.NumSimlify(_Global.INT64(g_data["resource1"]));
			//					if(g_data["resource2"])
			//						numWood.txt = _Global.NumSimlify(_Global.INT64(g_data["resource2"]));
			//					if(g_data["resource3"])
			//						numStone.txt = _Global.NumSimlify(_Global.INT64(g_data["resource3"]));
			//					if(g_data["resource4"])
			//						numSteel.txt = _Global.NumSimlify(_Global.INT64(g_data["resource4"]));
			showTemp(true);
			if (g_data["resource7"]) {
				if (Resource.instance().GetCastleLevel() >= Constant.CarmotLimitLevel) {
					tempLabel.txt = "+" + _Global.NumSimlify(_Global.INT64(g_data["resource7"]));
				} else {
					tempLabel.txt = " -- ";
				}
			}
			picTemp.mystyle.normal.background = TextureMgr.instance().LoadTexture("resource_Carmot_icon", TextureType.MAP17D3A_NEWRESOURCES);
			break;
		
		case Constant.MarchType.COLLECT_RESOURCE:
			showTemp(true);
			if (g_data["amount"]) {
				var extraResource : long = _Global.INT64(g_data["extraResource"]);
				if(extraResource > 0)
				{
					var increaseResource : long = _Global.INT64(g_data["amount"]) - extraResource;
					tempLabel.txt = "+" + _Global.NumSimlify(_Global.INT64(g_data["amount"])) + " " + String.Format(Datas.getArString("Newresource.BattleReport_Text1") , _Global.NumSimlify(increaseResource), _Global.NumSimlify(extraResource));
				}
				else
				{
					tempLabel.txt = "+" + _Global.NumSimlify(_Global.INT64(g_data["amount"]));
				}
			}
			var resourceType : int = _Global.INT32(g_data["type"].Value);
			picTemp.mystyle.normal.background = CollectionResourcesMgr.instance().GetResourceIcon(resourceType);

			break;

		case Constant.MarchType.MistExpedition:/*迷雾远征 是否打开资源 显示*/
			showTemp(true);/*取反*/
			break;
	}
}

private function showTemp(isShow: boolean): void {
	tempLabel.SetVisible(isShow);
	picTemp.SetVisible(isShow);

	numGold.SetVisible(!isShow);
	numFood.SetVisible(!isShow);
	numWood.SetVisible(!isShow);
	numStone.SetVisible(!isShow);
	numSteel.SetVisible(!isShow);
	numCarmot.SetVisible(!isShow);

	picGold.SetVisible(!isShow);
	picFood.SetVisible(!isShow);
	picWood.SetVisible(!isShow);
	picStone.SetVisible(!isShow);
	picSteel.SetVisible(!isShow);
	picCarmot.SetVisible(!isShow);
}

private function changeColorAndFormat(label: Label, num: long): void {

	var numStr: String = "";

	if ((texturePath != ATTACK_WIN) && (num > 0) && !_Global.GetBoolean(g_data["show"])) {
		label.SetNormalTxtColor(FontColor.Red);
		numStr += "-";
	}

	numStr += _Global.NumSimlify(num);

	if (num < 0) {
		label.txt = " -- ";
	} else label.txt = numStr;
}

public function Draw() {
	if (!g_isDraw || !visible) {
		return;
	}


	//componentScene.Draw();
	// picDivideLine1.Draw();
	// componentHeader.Draw();
	// componentLoot.Draw();
	scrollDisplay.Draw();
	contentLabel.Draw();
}

/*
 * March types
 * 1 - transport
 * 2 - reinforce
 * 3 - scout
 * 4 - attack
 * 5 - reassign
 * 8 - barbarian raid
 * 2 and 5 does not have any report displayed.
*/

public var scoutTile: ScoutReportObj;
public var scoutUnit: ScoutReportObj;
public var scoutDefendingUnit: ScoutReportObj;
public var scoutFrt: ScoutReportObj;
public var scoutView: ScoutReportObj;
public var scoutRes: ScoutReportObj;
public var scoutTec: ScoutReportObj;
public var scoutBuild: ScoutReportObj;

private function scoutReport() {
	var side: int = _Global.INT32(g_header["side"]);
	g_scoutTitle = Datas.getArString("ModalMessagesViewReports.AntiScoutingAt") + " ";

	var a: int = 0;
	var b: int = 0;
	var untNum: String;
	var key: String;
	var id: int;

	if (side == 1) {
		g_scoutTitle = Datas.getArString("ModalMessagesViewReports.ScoutingAt") + " ";
	}

	if (side == 1) {
		g_scoutHeader = g_data["success"].Value ? Datas.getArString("ModalMessagesViewReports.ScouterSuccess") : Datas.getArString("ModalMessagesViewReports.ScouterFail");
		if (g_data["success"].Value) {
			g_scoutScene = "scout_win_city";
		}
		else {
			g_scoutScene = "scout_lose_barbarian";
		}
	}
	else {
		g_scoutHeader = g_data["success"].Value ? Datas.getArString("ModalMessagesViewReports.ScouteeSuccess") : Datas.getArString("ModalMessagesViewReports.ScouteeFail");
		if (g_data["success"].Value) {
			g_scoutScene = "scout_win_city";
		}
		else {
			g_scoutScene = "scout_lose_barbarian";
		}
	}

	renderReportTitle(g_scoutTitle);

	//-------------------------------------------------------------------------------//
	if (g_data["score"] != null && _Global.INT32(g_data["score"]) > 0) {
		g_scoutReportTitle = Datas.getArString("ModalMessagesViewReports.ScoutingReport") + "\n";

		var isInstant: boolean = false;
		if (g_data["instant"]) {
			isInstant = _Global.INT32(g_data["instant"]) ? true : false;
		}

		var eagle: String = renderImproveEagleEyes(isInstant);
		if (eagle != "") {
			g_scoutReport = eagle + "\n";
			scrollDisplay.addUIObject(labelScoutReport);
			scrollDisplay.addUIObject(labelDescription);
		}

		var obj: HashObject;

		if (g_data["tileSurveyInfo"] != null) {
			obj = new HashObject({ "tile": g_data["tileSurveyInfo"] });

			scoutTile.setData(obj);
			scrollDisplay.addUIObject(scoutTile);
		}

		if (g_data["unts"]) {
			obj = new HashObject({ "unts": g_data["unts"] });

			scoutUnit.setData(obj);
			scrollDisplay.addUIObject(scoutUnit);
		}

		// Debug code. TODO: Remove
		//g_data["defending_unts"] = _Global.CopyHashObject(g_data["unts"]);

		if (g_data["defending_unts"]) {
			obj = new HashObject({ "defending_unts": g_data["defending_unts"] });
			scoutDefendingUnit.setData(obj);
			scrollDisplay.addUIObject(scoutDefendingUnit);
		}

		if (g_data["frt"]) {
			obj = new HashObject({ "frt": g_data["frt"] });

			scoutFrt.setData(obj);
			scrollDisplay.addUIObject(scoutFrt);
		}

		//if(g_data["lstlgn"]){}
		//if(g_data["knght"]){}

		if (g_data["pop"] != null || g_data["gld"] != null || g_data["hap"] != null) {
			obj = new HashObject({ "pop": g_data["pop"], "gld": g_data["gld"], "hap": g_data["hap"] });

			scoutView.setData(obj);
			scrollDisplay.addUIObject(scoutView);
		}

		if (g_data["blds"]) {
			obj = new HashObject({ "blds": g_data["blds"] });

			scoutBuild.setData(obj);
			scrollDisplay.addUIObject(scoutBuild);
		}

		AddResAndLootItems();

		if (g_data["tch"]) {
			obj = new HashObject({ "tch": g_data["tch"] });

			scoutTec.setData(obj);
			scrollDisplay.addUIObject(scoutTec);
		}
	}
}

private function AddResAndLootItems() {
	if (g_data["rsc"] == null && g_data["lootitemcount"] == null) {
		return;
	}

	var dict = new Hashtable();

	if (g_data["rsc"] != null) {
		dict["rsc"] = g_data["rsc"];

	}

	if (g_data["lootitemcount"] != null) {
		dict["lootitemcount"] = g_data["lootitemcount"];
	}

	var obj = new HashObject(dict);

	scoutRes.setData(obj);
	scrollDisplay.addUIObject(scoutRes);
}

private function renderImproveEagleEyes(isInstantScout: boolean): String {
	if (_Global.INT32(seed["tech"]["tch6"]) < 11 && _Global.INT32(g_data["score"]) > 0 && !isInstantScout) {
		return Datas.getArString("ModalMessagesViewReports.HigherResearchLevelNeeded");
	}

	return "";
}

private function renderReportTitle(_subString: String): String {
	var location: Array = new Array();

	if (_subString) {
		location.push(_subString);
	}

	var tileType: int = _Global.INT32(g_header["tiletype"]);

	if (Message.getInstance().ReportViewingType == ReportViewingType.Ava) {
		location.push(Datas.instance().getArString(AvaUtility.GetTileNameKey(tileType)));
	}
	else {
		if (g_header["tiletype"] && _Global.INT32(g_header["tiletype"]) != 51) 
		{
			if (g_marchType == Constant.MarchType.COLLECT) 
			{
				location.push(Datas.getArString("Newresource.tile_name_Nolevel"));
			}
			else if(g_marchType == Constant.MarchType.COLLECT_RESOURCE)
			{
				if(g_data["type"])
				{
					var resourceTileType : int = _Global.INT32(g_data["type"].Value);
					var resourceTileName : String = CollectionResourcesMgr.instance().GetResourceName(resourceTileType);
					location.push(resourceTileName);
				}			
			}
			else 
			{
				if(_Global.INT32(g_header["tiletype"]) >= Constant.TileType.WORLDMAP_1X1_DUMMY && _Global.INT32(g_header["tiletype"]) <= Constant.TileType.WORLDMAP_2X2_RB_ACT)
				{
					var worldMapTileName : String = AvaUtility.ParseTileType(_Global.INT32(g_header["tiletype"]), _Global.INT32(g_header["tilelv"]), _Global.INT32(g_header["boxContent"]["tileKind"]));
					location.push(worldMapTileName + "");
				}
				else
				{
					location.push(g_mapObject.TileTypeNames[_Global.INT32(g_header["tiletype"]) + ""]);
				}
			}
			location.push(" " + Datas.getArString("Common.Lv") + g_header["tilelv"].Value);
		}
		else {
			if (g_header["defid"] && _Global.INT32(g_header["defid"]) == 0) {

				if (_Global.INT32(g_header["tilelv"]) > 10) {
					location.push(Datas.getArString("Common.BarbarianCamp2"));
					location.push(" " + Datas.getArString("Common.Lv") + (_Global.INT32(g_header["tilelv"]) - 10));
				} else {
					location.push(Datas.getArString("Common.BarbarianCamp"));
					location.push(" " + Datas.getArString("Common.Lv") + g_header["tilelv"].Value);
				}
			}
		}
	}

	titleLocationBtn1.SetVisible(false);
	titleLocationBtn.SetVisible(true);

	//location.push(" (" + g_header["xcoord"].Value + "," + g_header["ycoord"].Value + ")");
	titleLocationBtn.txt = " (" + g_header["xcoord"].Value + "," + g_header["ycoord"].Value + ")";
	titleLocationBtn.SetFont();
	var _size: Vector2 = titleLocationBtn.mystyle.CalcSize(GUIContent(titleLocationBtn.txt));
	titleLocationBtn.rect.width = _size.x;
	titleLocationBtn.clickParam = { "x": g_header["xcoord"].Value, "y": g_header["ycoord"].Value };

	titleConquer.SetVisible(false);

	if (g_header["marchtype"] && (_Global.INT32(g_header["marchtype"]) != 1 || Message.getInstance().ReportViewingType != ReportViewingType.Default)) {
		if (g_data["conquered"] && _Global.INT32(g_data["conquered"]) == 1) {
			//location.push(" - " + Datas.getArString("Common.Conquered"));
			titleConquer.SetVisible(true);
			titleConquer.rect.width = 300;
			titleConquer.txt = " - " + Datas.getArString("Common.Conquered");
		}
	}

	headerTitle.txt = location.join(" ");

	if (Message.getInstance().ReportViewingType == ReportViewingType.Default && (_Global.INT32(g_header["marchtype"]) == Constant.MarchType.PVE || _Global.INT32(g_header["marchtype"]) == Constant.MarchType.ALLIANCEBOSS))//PVE
	{
		titleLocationBtn.SetVisible(false);
		//			var pveLevelID:int = _Global.INT32(g_header["side0TileLevel"]);
		//			var pveLevelName:String = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetLevelNameKey(pveLevelID);
		var pveLevelName: String = _Global.ToString(g_header["side0LevelName"]);
		headerTitle.txt = _subString + " " + Datas.getArString(pveLevelName);
	}

	headerTitle.SetFont();
	_size = headerTitle.mystyle.CalcSize(GUIContent(headerTitle.txt));
	headerTitle.rect.width = _size.x + 5;

	titleLocationBtn.rect.x = headerTitle.rect.x + headerTitle.rect.width;
	titleConquer.rect.x = titleLocationBtn.rect.x + titleLocationBtn.rect.width;

	headerDate.txt = g_header["date"].Value + "";
	headerNo.txt = Datas.getArString("ModalMessagesViewReports.ReportNo") + ": " + g_header["rid"].Value;

}

private function attackReport() {
	g_attackResult = renderAttackResult();

	var title: String = Datas.getArString("ModalMessagesViewReports.BattleAt");
	renderReportTitle(title);

	//skip this function, because delete the Museum.singleton
	//renderMarchArtifacts();

	g_attackDescription = renderNoBreachResult();

	g_attackScene = renderAttackScenery();

	if (g_marchType == Constant.MarchType.RALLY_ATTACK || g_marchType == Constant.MarchType.JION_RALLY_ATTACK) {
		renderRallyBattleReport();
	} else if (g_marchType == Constant.MarchType.MistExpedition)/*迷雾远征*/ {
		renderMistExpeditionReport();
	}
	else {
		renderBattleReport();
	}
}

private function renderAttackScenery(): String {
	return getAttackReportType();
}

private var g_detailObject: Object;

private function renderRallyBattleReport() {
	var a: int = 0;
	var arrDefender: Array = _Global.GetObjectKeys(g_data["fght"]["s0"]);
	var arrRallyAll: Array = _Global.GetObjectKeys(g_data["fght"]["s1"]);
	var arrRallySelf: Array = _Global.GetObjectKeys(g_data["fght"]["s2"]);

	if (arrDefender.length != 0 || arrRallyAll.length != 0) {
		g_isDisplayDetail = true;
	}
	else {
		return;
	}

	var attackName: String = null;
	rallyLocationAttacker.SetVisible(false);
	if (g_header["atknm"] != null && g_header["atknm"].Value != "") {
		// player is attacker
		attackName = g_header["atknm"].Value as String;


		if (g_header["atkxcoord"].Value != null) {
			rallyLocationAttacker.SetVisible(true);
			rallyLocationAttacker.txt = " (" + g_header["atkxcoord"].Value + " , " + g_header["atkycoord"].Value + ")";
			rallyLocationAttacker.clickParam = { "x": g_header["atkxcoord"].Value, "y": g_header["atkycoord"].Value };
		}
	}
	else {
		// enemy is attacker
		attackName = Datas.getArString("Common.Enemy");
	}
	reportRallyAttackerDes.txt = attackName;

	var defendkName: String = null;
	rallyLocationDefender.SetVisible(false);
	if (g_header["defnm"] != null && g_header["defnm"].Value != "") {
		// player is defender
		defendkName = g_header["defnm"].Value as String;

		if (g_header["xcoord"].Value != null) {
			rallyLocationDefender.SetVisible(true);
			rallyLocationDefender.txt = " (" + g_header["xcoord"].Value + " , " + g_header["ycoord"].Value + ")";
			rallyLocationDefender.clickParam = { "x": g_header["xcoord"].Value, "y": g_header["ycoord"].Value };
		}
	}
	else {
		// enemy is defender
		defendkName = Datas.getArString("Common.Enemy");
	}
	reportRallyDefenderDes.txt = defendkName;

	reportRallySum.txt = Datas.getArString("WarHall.Sum");

	var numFight: long = 0;
	var numSurvive: long = 0;
	var key: String;
	var numTemp: long;

	for (a = 0; a < arrRallyAll.length; a++) {
		key = arrRallyAll[a];
		numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "0"]);

		if (numTemp == 0) {
			continue;
		}

		numFight += numTemp;
		numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "1"]) + _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "4"]);
		numSurvive += numTemp;
	}

	var minWidth: float = 0.0f;
	var maxWidth: float = 0.0f;

	var displayLimit: int = 10000;
	reportRallyAttackerSurvive.SetNormalTxtColor(FontColor.Red);

	if (numFight > displayLimit)
		reportRallyAttackerSurvive.txt = _Global.NumSimlify(numFight) + "/";
	else
		reportRallyAttackerSurvive.txt = numFight.ToString() + "/";

	if (numSurvive > displayLimit)
		reportRallyAttackerSurvive.txt += _Global.NumSimlify(numSurvive);
	else
		reportRallyAttackerSurvive.txt += numSurvive.ToString();

	numFight = 0;
	numSurvive = 0;
	for (a = 0; a < arrDefender.length; a++) {
		key = arrDefender[a];
		numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "0"]);
		numFight += numTemp;
		numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "1"]);
		numSurvive += numTemp;
	}

	if (_Global.GetBoolean(g_data["tooWeakToInspect"])) {
		reportRallyDefenderSurvive.txt = String.Format("{0}:<color={1}>{2}</color>",
			Datas.getArString("Common.Fought"),
			_Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Red)),
			Datas.getArString("Common.Unknown"));
		//reportRallyDefenderSurvive.txt = String.Empty;
	}
	else {
		if (numFight > displayLimit)
			reportRallyDefenderSurvive.txt = _Global.NumSimlify(numFight) + "/";
		else
			reportRallyDefenderSurvive.txt = numFight.ToString() + "/";

		if (numSurvive > displayLimit)
			reportRallyDefenderSurvive.txt += _Global.NumSimlify(numSurvive);
		else
			reportRallyDefenderSurvive.txt += numSurvive.ToString();
	}

	if (g_data["playerName"] != null) {
		if (g_data["playerName"]["s2"] != null) {
			var selfName: String = g_data["playerName"]["s2"].Value as String;
			reportRallySelfDes.txt = selfName;
		}
		else {
			reportRallySelfDes.txt = "";
		}
	}

	numFight = 0;
	numSurvive = 0;
	for (a = 0; a < arrRallySelf.length; a++) {
		key = arrRallySelf[a];
		numTemp = _Global.INT64(g_data["fght"]["s2"][key][_Global.ap + "0"]);
		numFight += numTemp;
		numTemp = _Global.INT64(g_data["fght"]["s2"][key][_Global.ap + "1"]);
		numSurvive += numTemp;
	}

	if (numFight > displayLimit)
		reportRallySelfSurvive.txt = _Global.NumSimlify(numFight) + "/";
	else
		reportRallySelfSurvive.txt = numFight.ToString() + "/";

	if (numSurvive > displayLimit)
		reportRallySelfSurvive.txt += _Global.NumSimlify(numSurvive);
	else
		reportRallySelfSurvive.txt += numSurvive.ToString();
}


/*迷雾远征*/
private function renderMistExpeditionReport() {

	if (g_data.Contains("winner")) {
		if (_Global.INT32(g_data["winner"]) > 0) {
			labelTitle.txt = Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianWin");/*胜利*/
		} else {
			labelTitle.txt = Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianLose");/*失败*/
		}
	} else {
		labelTitle.txt = Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianWin");/*胜利*/
	}

	picTemp.mystyle.normal.background = TextureMgr.instance().LoadTexture("mistexpedition_coin", TextureType.MISTEXPEDITION);/*给资源 替换 迷雾远征 金币图片*/
	tempLabel.txt = g_data["getCoin"].Value.ToString();/*远征金币数量*/

	titleLocationBtn.SetVisible(false);/*关闭 敌人目标点 位置跳转按钮*/
	headerTitle.txt = Datas.getArString("Common.ExpeditionBattle");/*战斗 信息*/
}


//important
private function renderBattleReport() {
	var a: int = 0;
	var arr1: Array = _Global.GetObjectKeys(g_data["fght"]["s0"]);
	var arr2: Array = _Global.GetObjectKeys(g_data["fght"]["s1"]);

	headerTitle.SetVisible(true);/*打开 战斗位置 信息*/
	if (arr1.length != 0 || arr2.length != 0) {
		g_isDisplayDetail = true;
	}
	else {
		return;
	}

	var attackName: String = null;

	attackerLocationBtn.SetVisible(false);
	if (g_header["atknm"] != null && g_header["atknm"].Value != "") {
		// player is attacker
		attackName = g_header["atknm"].Value as String;


		if (g_header["atkxcoord"].Value != null) {
			attackerLocationBtn.SetVisible(true);
			attackerLocationBtn.txt = " (" + g_header["atkxcoord"].Value + " , " + g_header["atkycoord"].Value + ")";
			attackerLocationBtn.clickParam = { "x": g_header["atkxcoord"].Value, "y": g_header["atkycoord"].Value };
		}
	}
	else {
		// enemy is attacker
		attackName = Datas.getArString("Common.Enemy");
	}

	//who is attacking
	reportAttackerDes.SetFont();
	var clippedText: String = _Global.GUIClipToWidth(reportAttackerDes.mystyle, attackName,
		reportAttackerDes.rect.width, "...", null);
	reportAttackerDes.txt = clippedText;

	var _size: Vector2 = reportAttackerDes.mystyle.CalcSize(GUIContent(reportAttackerDes.txt));
	if (attackerLocationBtn.isVisible()) {
		attackerLocationBtn.rect.x = reportAttackerDes.rect.x + _size.x;
		attackerLocationBtn.SetFont();
		_size = attackerLocationBtn.mystyle.CalcSize(GUIContent(attackerLocationBtn.txt));
		attackerLocationBtn.rect.width = _size.x;
		//reportWin.rect.x = attackerLocationBtn.rect.x + attackerLocationBtn.rect.width;
	}

	var numFight: long = 0;
	var numSurvive: long = 0;
	var key: String;
	var numTemp: long;

	for (a = 0; a < arr2.length; a++) {
		key = arr2[a];
		numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "0"]);

		if (numTemp == 0) {
			continue;
		}

		numFight += numTemp;
		numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "1"]) + _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "4"]);
		numSurvive += numTemp;
	}

	var minWidth: float = 0.0f;
	var maxWidth: float = 0.0f;

	var displayLimit: int = 10000;
	reprotAttackerSurvive.SetNormalTxtColor(FontColor.Red);

	if (numFight > displayLimit)
		reprotAttackerFought.txt = Datas.getArString("Common.Fought") + ":" + _Global.NumSimlify(numFight) + "/";
	else
		reprotAttackerFought.txt = Datas.getArString("Common.Fought") + ":" + numFight.ToString() + "/";

	if (numSurvive > displayLimit)
		reprotAttackerSurvive.txt = _Global.NumSimlify(numSurvive);
	else
		reprotAttackerSurvive.txt = numSurvive.ToString();

	reprotAttackerFought.mystyle.CalcMinMaxWidth(GUIContent(reprotAttackerFought.txt), minWidth, maxWidth);
	reprotAttackerSurvive.rect.x = reprotAttackerFought.rect.x + Mathf.Ceil(maxWidth);


	if (g_data["winner"] && _Global.INT32(g_data["winner"]) == 0) {
		clippedText = _Global.GUIClipToWidth(reportDefenderDes.mystyle,
			g_header["defnm"].Value, reportDefenderDes.rect.width, "...",
			" - " + Datas.getArString("Common.Winner"));
		reportDefenderDes.txt = clippedText;
	}
	else {
		clippedText = _Global.GUIClipToWidth(reportDefenderDes.mystyle,
			g_header["defnm"].Value, reportDefenderDes.rect.width, "...", null);
		reportDefenderDes.txt = clippedText;
	}

	numFight = 0;
	numSurvive = 0;
	for (a = 0; a < arr1.length; a++) {
		key = arr1[a];
		numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "0"]);
		numFight += numTemp;
		numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "1"]);
		numSurvive += numTemp;
	}
	if (g_marchType == Constant.MarchType.EMAIL_WORLDBOSS) {
		// worldBossSliderBg.SetVisible(true);
		// worldBossSliderTop.SetVisible(true);
		// reprotDefenderFought.SetVisible(false);
		// reprotDefenderSurvive.SetVisible(false);
		// worldBossSliderTop.rect.width=numSurvive/100f*worldBossSliderBg.rect.width;
		// reprotDefenderFought.txt = Datas.getArString("WorldBoss.Report_Text9")+":"+(numFight/100f)+"%/";
		// reprotDefenderSurvive.txt = numSurvive/100f+"%";

		if (numFight > displayLimit)
			reprotDefenderFought.txt = Datas.getArString("WorldBoss.Report_Text9") + ":" + _Global.NumSimlify(numFight) + "/";
		else
			reprotDefenderFought.txt = Datas.getArString("WorldBoss.Report_Text9") + ":" + numFight.ToString() + "/";

		if (numSurvive > displayLimit)
			reprotDefenderSurvive.txt = _Global.NumSimlify(numSurvive);
		else
			reprotDefenderSurvive.txt = numSurvive.ToString();
	} else {
		// worldBossSliderBg.SetVisible(false);
		// worldBossSliderTop.SetVisible(false);
		// reprotDefenderFought.SetVisible(true);
		// reprotDefenderSurvive.SetVisible(true);
		if (_Global.GetBoolean(g_data["tooWeakToInspect"])) {
			reprotDefenderFought.txt = String.Format("{0}:<color={1}>{2}</color>",
				Datas.getArString("Common.Fought"),
				_Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Red)),
				Datas.getArString("Common.Unknown"));
			reprotDefenderSurvive.txt = String.Empty;
		}
		else {
			if (numFight > displayLimit)
				reprotDefenderFought.txt = Datas.getArString("Common.Fought") + ":" + _Global.NumSimlify(numFight) + "/";
			else
				reprotDefenderFought.txt = Datas.getArString("Common.Fought") + ":" + numFight.ToString() + "/";

			if (numSurvive > displayLimit)
				reprotDefenderSurvive.txt = _Global.NumSimlify(numSurvive);
			else
				reprotDefenderSurvive.txt = numSurvive.ToString();
		}
	}


	reprotDefenderFought.mystyle.CalcMinMaxWidth(GUIContent(reprotDefenderFought.txt), minWidth, maxWidth);
	reprotDefenderSurvive.rect.x = reprotDefenderFought.rect.x + Mathf.Ceil(maxWidth);
	//reprotDefenderSurvive.rect.width=btnDetailArrow.rect.x-reprotDefenderSurvive.rect.x;	
}

//世界boos
public var worldBossSliderBg: Label;
public var worldBossSliderTop: Label;

private function renderAttackResult(): String {
	var msg1: Array = new Array();

	if (g_data["fght"] == null) {
		return;
	}
	var arr1: Array = _Global.GetObjectKeys(g_data["fght"]["s0"]);
	var arr2: Array = _Global.GetObjectKeys(g_data["fght"]["s1"]);

	if (arr1 != null && arr2 != null && (arr1.length != 0 || arr2.length != 0)) {
		switch (getAttackReportType()) {
			case "wilderness_win":
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianWin"));
				break;
			case "wilderness_lose":
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianLose"));
				break;
			case "barbarian_win":
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianWin"));
				break;
			case "barbarian_lose":
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.WildBarbarianLose"));
				break;
			case "attack_win":
				//ATTACK PLAYER AND WIN
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.EnemyWin"));
				break;
			case "defend_victory":
				//DEFEND CITY AND WIN
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.ByEnemyWin"));
				break;
			case "defend_defeat":
				//DEFEND CITY AND LOSE
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.ByEnemyLose"));
				break;
			case "attack_defeat":
				//ATTACK PLAYER AND LOSE
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.EnemyLose"));
				break;
			case "barbarianraid_win1":
			case "barbarianraid_win2":
				msg1.push(Datas.getArString("ModalMessagesViewReports.BarbariansWin"));
				break;
			case "barbarianraid_lose1":
			case "barbarianraid_lose2":
				msg1.push(Datas.getArString("ModalMessagesViewReports.BarbariansLose"));
				break;
			default:
				msg1.push(Datas.getArString("ModalMessagesViewReportsAtkRslt.ByEnemyLose"));
				break;
			//					_Global.Log("No_attack_result_found");
		}
	}

	return msg1.join("");
}

//delete this content in the report, because delete Museum.singleton
private function renderMarchArtifacts() {

}

private function getAttackReportType(): String {
	return Message.getInstance().GetAttackReportType(g_header, g_data);
}

private function renderNoBreachResult() {
	if (Message.getInstance().ReportViewingType == ReportViewingType.Ava) {
		return String.Empty;
	}

	if (g_data == null || g_header == null || g_data["fght"] == null || g_data["fght"]["s0"] == null || g_data["fght"]["s1"]==null) {
		return String.Empty;
	}

	var msg2: Array = new Array();

	if (g_data["fght"] == null) {
		return String.Empty;
	}

	var arr1: Array = _Global.GetObjectKeys(g_data["fght"]["s0"]);
	var arr2: Array = _Global.GetObjectKeys(g_data["fght"]["s1"]);

	if (!(arr1.length == 0 && arr2.length == 0)) {
		if (g_data["winner"] != null && _Global.INT32(g_data["winner"]) == 1 && g_data["wall"] != null) {
			if (g_header["tiletype"] != null && _Global.INT32(g_header["tiletype"]) == 51) {
				msg2.push(Datas.getArString("ModalMessagesViewReports.WallBreach") + " ");
			}
			else {
				msg2.push(Datas.getArString("ModalMessagesViewReports.SecuredWilderness") + " ");
			}
		}

		if (g_data["winner"] != null && _Global.INT32(g_data["winner"]) == 2) {
			if (g_header["tiletype"] != null && _Global.INT32(g_header["tiletype"]) == 51) {
				msg2.push(Datas.getArString("ModalMessagesViewReports.NoWallBreach") + " ");
			}
			else {
				msg2.push(Datas.getArString("ModalMessagesViewReports.NoSecuredWilderness") + " ");
				if (g_data["wall"] != null) {
					msg2.push(g_data["wall"]);
					msg2.push(Datas.getArString("ModalMessagesViewReports.WildernessPercSecured"));
				}
			}
		}

		if (g_data["winner"] != null && _Global.INT32(g_data["winner"]) == 1 && g_header["side"] != null && _Global.INT32(g_header["side"]) == 0 && g_header["tiletype"] != null && _Global.INT32(g_header["tiletype"]) == 51) {
			if (g_data["wall"] != null) {
				//					msg2.push(g_data["wall"] + "% ");
				//					msg2.push(Datas.getArString("ModalMessagesViewReports.WallDamagePerc"));
			}

			if (g_data["wall"] != null && (_Global.INT32(g_data["wall"]) == 100)) {
				msg2.push(" " + Datas.getArString("ModalMessagesViewReports.PendingCancelled"));
			}
		}
	}

	return msg2.join("");
}

}
