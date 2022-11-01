
class NewCommonRepertDetail extends MonoBehaviour
{
    public var detailBtn:Button;
    public var knightBtn:Button;
    public var composeBtn:Button;
    public var logBtn:Button;

    public var detail:ComposedUIObj;

    public var combatinfoDetail_Left:CombatInfoDetail;
    public var combatinfoDetail_right:CombatInfoDetail;
    public var BoostsDetail_left:BoostsDetail;
    public var BoostsDetail_right:BoostsDetail;
    //public var reportBezierLine:ReportBezierLineObj;

    public var title_combat:Label;
    public var title_boosts:Label;
    
    public function Refresh(g_data:HashObject,g_header:HashObject,detailFunc:Function,knightFunc:Function,composeFunc:Function,logFunc:Function)
    {
        this.detailBtn.OnClick=detailFunc;
        this.knightBtn.OnClick=knightFunc;
        this.composeBtn.OnClick=composeFunc;
        this.logBtn.OnClick=logFunc;
        
        var arr1: Array = _Global.GetObjectKeys(g_data["fght"]["s0"]);
		var arr2: Array = _Global.GetObjectKeys(g_data["fght"]["s1"]);
		
		var key: String;
		var numTemp: long;

		var atkNumFight:long = 0;
		var atkNumSurvive:long = 0;
		var atkNumDeath:long = 0;
		var atkNumInjured:long = 0;

		var deNumFight:long = 0;
		var deNumSurvive:long = 0;
		var deNumDeath:long = 0;
		var deNumInjured:long = 0;

		for (var a = 0; a < arr2.length; a++) {
			key = arr2[a];
			numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "0"]);
			atkNumFight += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "1"]);
			atkNumSurvive += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "0"])-_Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "1"]) - _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "3"]);
			atkNumDeath += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s1"][key][_Global.ap + "3"]);
			atkNumInjured += numTemp;
		}

		for (var b = 0; b < arr1.length; b++) {
			key = arr1[b];
			numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "0"]);
			deNumFight += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "1"]);
			deNumSurvive += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "0"])-_Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "1"]) - _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "3"]);
			deNumDeath += numTemp;
			numTemp = _Global.INT64(g_data["fght"]["s0"][key][_Global.ap + "3"]);
			deNumInjured += numTemp;
		}

		var info: HashObject = new HashObject(
			{
				"attack": {
					"reportType":g_header["marchtype"].Value.ToString(),
					"isAtk":1,
					"playerName": g_header["atknm"].Value.ToString(),
					"playerIcon": (g_header["new_atfIcon"]!=null&&g_header["new_atfIcon"].Value!=null)?g_header["new_atfIcon"].Value.ToString():'-',
					"playerAvatarFrame": (g_header["new_atfAvatarFrame"]!=null&&g_header["new_atfAvatarFrame"].Value!=null)?g_header["new_atfAvatarFrame"].Value.ToString():"img0",
					"isWin": _Global.INT32(g_data["winner"]),
					"isMine": g_header["side"] != null ? _Global.INT32(g_header["side"]) : 0,
					"x":_Global.INT32(g_header["atkxcoord"]),
					"y":_Global.INT32(g_header["atkycoord"]),
					"might": _Global.INT64(g_data["newEmailInfo"]["s1MightLost"]),
					"combatInfo": {
						"fought": atkNumFight,
						"servived": atkNumSurvive,
						"death": atkNumDeath,
						"injured": atkNumInjured
					},
					"boosets": {
						"attack": _Global.INT64(g_data["playerBoost"]["s1"]["atkBoost"]),
						"life": _Global.INT64(g_data["playerBoost"]["s1"]["lifeBoost"]),
						"speed": _Global.INT64(g_data["newEmailInfo"]["s1SpeedBoost"]),
						"load": _Global.INT64(g_data["newEmailInfo"]["s1LoadBoost"]),
						"marchSize": _Global.INT64(g_data["newEmailInfo"]["s1MarchSizeBoost"]),
						"foeLf": _Global.INT64(g_data["playerBoost"]["s1"]["lifeFoeBoost"]),
						"foeAtk": _Global.INT64(g_data["playerBoost"]["s1"]["atkFoeBoost"])
					}
				},
				"enemy": {
					"reportType":g_header["marchtype"].Value.ToString(),
					"isAtk":0,
					"playerName": g_header["defnm"].Value.ToString(),
					"playerIcon": (g_header["new_defIcon"]!=null&&g_header["new_defIcon"].Value!=null)?g_header["new_defIcon"].Value.ToString():'-',
					"playerAvatarFrame": (g_header["new_defAvatarFrame"]!=null&&g_header["new_defAvatarFrame"].Value!=null)?g_header["new_defAvatarFrame"].Value.ToString():"img0",
					"isWin": _Global.INT32(g_data["winner"]) == 1 ? 0 : 1,
					"isMine": g_header["side"] != null ? (_Global.INT32(g_header["side"]) == 1 ? 0 : 1) : 0,
					"x":_Global.INT32(g_header["xcoord"]),
					"y":_Global.INT32(g_header["ycoord"]),
					"might": _Global.INT64(g_data["newEmailInfo"]["s0MightLost"]),
					"combatInfo": {
						"fought": deNumFight,
						"servived": deNumSurvive,
						"death": deNumDeath,
						"injured": deNumInjured
					},
					"boosets": {
						"attack": _Global.INT64(g_data["playerBoost"]["s0"]["atkBoost"]),
						"life": _Global.INT64(g_data["playerBoost"]["s0"]["lifeBoost"]),
						"speed": _Global.INT64(g_data["newEmailInfo"]["s0SpeedBoost"]),
						"load": _Global.INT64(g_data["newEmailInfo"]["s0LoadBoost"]),
						"marchSize": _Global.INT64(g_data["newEmailInfo"]["s0MarchSizeBoost"]),
						"foeLf": _Global.INT64(g_data["playerBoost"]["s0"]["lifeFoeBoost"]),
						"foeAtk": _Global.INT64(g_data["playerBoost"]["s0"]["atkFoeBoost"])
					}
				}
			}
		);

		//reportBezierLine.refresh(rnds);
        combatinfoDetail_Left.refresh(info["attack"]);
        combatinfoDetail_right.refresh(info["enemy"]);
        BoostsDetail_left.refresh(info,true);
        BoostsDetail_right.refresh(info,false);

        title_combat.txt=KBN.Datas.getArString("WorldBoss.Report_Text3");
        title_boosts.txt=KBN.Datas.getArString("BattleReport.Boost");

        detailBtn.txt=KBN.Datas.getArString("BattleReport.Details");
        knightBtn.txt=KBN.Datas.getArString("BattleReport.KnightInfo");
        composeBtn.txt=KBN.Datas.getArString("BattleReport.HeroInfo");
		logBtn.txt = KBN.Datas.getArString("BattleReport.Log");

		IsGlobalBoost(true);
	}



	public function MistExpeditionRefresh(g_data: HashObject, g_header: HashObject, detailFunc: Function, knightFunc: Function, composeFunc: Function, logFunc: Function) {
		this.detailBtn.OnClick = detailFunc;
		this.knightBtn.OnClick = knightFunc;
		this.composeBtn.OnClick = composeFunc;
		this.logBtn.OnClick = logFunc;

		var arr1: Array = _Global.GetObjectKeys(g_data["unitsJS"]["s0"]);
		var arr2: Array = _Global.GetObjectKeys(g_data["unitsJS"]["s1"]);

		var key: String;
		var numTemp: long;

		var atkNumFight: long = 0;
		var atkNumSurvive: long = 0;
		var atkNumDeath: long = 0;
		var atkNumInjured: long = 0;

		var deNumFight: long = 0;
		var deNumSurvive: long = 0;
		var deNumDeath: long = 0;
		var deNumInjured: long = 0;

		for (var a = 0; a < arr2.length; a++) {
			key = arr2[a];
			numTemp = _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "0"]);
			atkNumFight += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "1"]);
			atkNumSurvive += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "0"]) - _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "1"]) - _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "3"]);
			atkNumDeath += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s1"][key][_Global.ap + "3"]);
			atkNumInjured += numTemp;
		}

		for (var b = 0; b < arr1.length; b++) {
			key = arr1[b];
			numTemp = _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "0"]);
			deNumFight += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "1"]);
			deNumSurvive += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "0"]) - _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "1"]) - _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "3"]);
			deNumDeath += numTemp;
			numTemp = _Global.INT64(g_data["unitsJS"]["s0"][key][_Global.ap + "3"]);
			deNumInjured += numTemp;
		}

		var info: HashObject = new HashObject(
			{
				"attack": {
					"reportType": g_header["marchtype"].Value.ToString(),
					"isAtk": 1,
					"playerName": g_header["atknm"].Value.ToString(),
					"playerIcon": (g_header["new_atfIcon"] != null && g_header["new_atfIcon"].Value != null) ? g_header["new_atfIcon"].Value.ToString() : '-',
					"playerAvatarFrame": (g_header["new_atfAvatarFrame"] != null && g_header["new_atfAvatarFrame"].Value != null) ? g_header["new_atfAvatarFrame"].Value.ToString() : "img0",
					"isWin": _Global.INT32(g_data["winner"]),
					"isMine": g_header["side"] != null ? _Global.INT32(g_header["side"]) : 0,
					"x": _Global.INT32(g_header["atkxcoord"]),
					"y": _Global.INT32(g_header["atkycoord"]),
					"might": _Global.INT64(g_data["newEmailInfo"]["s1MightLost"]),
					"combatInfo": {
						"fought": atkNumFight,
						"servived": atkNumSurvive,
						"death": atkNumDeath,
						"injured": atkNumInjured
					},
					"boosets": {
						"attack": _Global.INT64(g_data["playerBoost"]["s1"]["atkBoost"]),
						"life": _Global.INT64(g_data["playerBoost"]["s1"]["lifeBoost"]),
						"speed": 0,/*_Global.INT64(g_data["newEmailInfo"]["s1SpeedBoost"])*/
						"load": 0,/*_Global.INT64(g_data["newEmailInfo"]["s1LoadBoost"])*/
						"marchSize": 0,/* _Global.INT64(g_data["newEmailInfo"]["s1MarchSizeBoost"])*/
						"foeLf": _Global.INT64(g_data["playerBoost"]["s1"]["lifeFoeBoost"]),
						"foeAtk": _Global.INT64(g_data["playerBoost"]["s1"]["atkFoeBoost"])
					}
				},
				"enemy": {
					"reportType": g_header["marchtype"].Value.ToString(),
					"isAtk": 0,
					"playerName": g_header["defnm"].Value.ToString(),
					"playerIcon": (g_header["new_defIcon"] != null && g_header["new_defIcon"].Value != null) ? g_header["new_defIcon"].Value.ToString() : '-',
					"playerAvatarFrame": (g_header["new_defAvatarFrame"] != null && g_header["new_defAvatarFrame"].Value != null) ? g_header["new_defAvatarFrame"].Value.ToString() : "img0",
					"isWin": _Global.INT32(g_data["winner"]) == 1 ? 0 : 1,
					"isMine": g_header["side"] != null ? (_Global.INT32(g_header["side"]) == 1 ? 0 : 1) : 0,
					"x": _Global.INT32(g_header["xcoord"]),
					"y": _Global.INT32(g_header["ycoord"]),
					"might": _Global.INT64(g_data["newEmailInfo"]["s0MightLost"]),
					"combatInfo": {
						"fought": deNumFight,
						"servived": deNumSurvive,
						"death": deNumDeath,
						"injured": deNumInjured
					},
					"boosets": {
						"attack": _Global.INT64(g_data["playerBoost"]["s0"]["atkBoost"]),
						"life": _Global.INT64(g_data["playerBoost"]["s0"]["lifeBoost"]),
						"speed": _Global.INT64(g_data["newEmailInfo"]["s0MightLost"]),
						"load": _Global.INT64(g_data["newEmailInfo"]["s1MightLost"]),
						"marchSize": g_data["newEmailInfo"]["s0MarchSizeBoost"] != null ? (_Global.INT64(g_data["newEmailInfo"]["s0MarchSizeBoost"])): 0,
						"foeLf": _Global.INT64(g_data["playerBoost"]["s0"]["lifeFoeBoost"]),
						"foeAtk": _Global.INT64(g_data["playerBoost"]["s0"]["atkFoeBoost"])
					}
				}
			}
		);

		combatinfoDetail_Left.refresh(info["attack"]);
		combatinfoDetail_right.refresh(info["enemy"]);

		title_combat.txt = KBN.Datas.getArString("WorldBoss.Report_Text3");
		title_boosts.txt = KBN.Datas.getArString("BattleReport.Boost");

		detailBtn.txt = KBN.Datas.getArString("BattleReport.Details");
		knightBtn.txt = KBN.Datas.getArString("BattleReport.KnightInfo");

		IsGlobalBoost(false);
		
	}

	/*打开 / 关闭 (Global Boost)*/
	private function IsGlobalBoost(IsSwitch: boolean) {

		var b_Titlebg: Label = detail.component[5] as Label;/*Global Boost 标题*/
		if (b_Titlebg != null)
			b_Titlebg.SetVisible(IsSwitch);

		var b_bg: Label = detail.component[4] as Label;/*Global Boost 背景*/
		if (b_bg != null)
			b_bg.SetVisible(IsSwitch);

		var shuxian2: Label = detail.component[15] as Label;/*Global Boost 背景 中间分割线*/
		if (shuxian2 != null)
			shuxian2.SetVisible(IsSwitch);

		var knightInfoBtn: Button = detail.component[11] as Button;/*Global Boost Knight Info 按钮*/
		if (knightInfoBtn != null)
			knightInfoBtn.SetVisible(IsSwitch);

		var battleLog: Button = detail.component[16] as Button;/*Global Detauks Battle log 左侧按钮*/
		if (battleLog != null)
			battleLog.SetVisible(IsSwitch);

		var heroInfo: Button = detail.component[12] as Button;/*Global Hero Info 按钮*/
		if (heroInfo != null)
			heroInfo.SetVisible(IsSwitch);

		var boostsInfoLeft: ComposedUIObj = detail.component[9] as ComposedUIObj;/*Global 左侧信息面板 按钮*/
		if (boostsInfoLeft != null)
			boostsInfoLeft.SetVisible(IsSwitch);

		var boostsInfoRigth: ComposedUIObj = detail.component[10] as ComposedUIObj;/*Global 右侧信息面板 按钮*/
		if (boostsInfoRigth != null)
			boostsInfoRigth.SetVisible(IsSwitch);

	}

}