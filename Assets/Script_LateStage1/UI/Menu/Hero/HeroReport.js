public class HeroReport extends PopMenu {
	@SerializeField
	private var bar: ToolBar;
	@SerializeField
	private var line: Label;
	@SerializeField
	private var reportTemplate: HeroReportItem;
	@SerializeField
	private var attackHeroList: ScrollList;
	@SerializeField
	private var noAttackHero: Label;
	@SerializeField
	private var defendHeroList: ScrollList;
	@SerializeField
	private var noDefendHero: Label;

	@SerializeField
	private var atkHeroDetail: HeroBoostsDetail;
	@SerializeField
	private var defHeroDetail: HeroBoostsDetail;
	@SerializeField
	private var newAtkScrollView: ScrollView;
	@SerializeField
	private var newdefScrollView: ScrollView;
	@SerializeField
	private var atkAssaginHeroScrollList: ScrollList;
	@SerializeField
	private var atkHelpHeroScrollList: ScrollList;
	@SerializeField
	private var defAssaginHeroScrollList: ScrollList;
	@SerializeField
	private var defHelpHeroScrollList: ScrollList;
	@SerializeField
	private var atkTitle1: ComposedUIObj;
	@SerializeField
	private var atkTitle2: ComposedUIObj;
	@SerializeField
	private var defTitle1: ComposedUIObj;
	@SerializeField
	private var defTitle2: ComposedUIObj;
	@SerializeField
	private var label_atk_title1: Label;
	@SerializeField
	private var label_atk_title2: Label;
	@SerializeField
	private var label_def_title1: Label;
	@SerializeField
	private var label_def_title2: Label;


	private var attackHeros: Array = null;
	private var defendHeros: Array = null;


	public function Init(): void {
		super.Init();

		bar.Init();
		var attack: String = Datas.getArString("Common.HeroInfo_SubTitle1");
		var defend: String = Datas.getArString("Common.HeroInfo_SubTitle2");
		bar.toolbarStrings = [attack, defend];
		bar.indexChangedFunc = OnBarChanged;

		noAttackHero.txt = Datas.getArString("Common.HeroInfo_NoHero");
		noDefendHero.txt = Datas.getArString("Common.HeroInfo_NoHero");

		attackHeroList.Init(reportTemplate);
		defendHeroList.Init(reportTemplate);

		atkHelpHeroScrollList.Init(reportTemplate);
		atkAssaginHeroScrollList.Init(reportTemplate);
		defHelpHeroScrollList.Init(reportTemplate);
		defAssaginHeroScrollList.Init(reportTemplate);

		newAtkScrollView.Init();
		newdefScrollView.Init();

		label_atk_title1.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title2");
		label_atk_title2.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title3");
		label_def_title1.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title2");
		label_def_title2.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title3");
	}

	public function Update(): void {
		super.Update();

		UpdateTouch();

		attackHeroList.Update();
		defendHeroList.Update();

		newAtkScrollView.Update();
		newdefScrollView.Update();
		
		atkHelpHeroScrollList.Update();
		atkAssaginHeroScrollList.Update();
		defHelpHeroScrollList.Update();
		defAssaginHeroScrollList.Update();
	}

	public function DrawItem(): void {
		bar.Draw();
		line.Draw();
		switch (bar.selectedIndex) {
			case 0:
				// atkHeroDetail.Draw();
				attackHeroList.Draw();
				noAttackHero.Draw();
				newAtkScrollView.Draw();
				break;
			case 1:
				// defHeroDetail.Draw();
				defendHeroList.Draw();
				noDefendHero.Draw();
				newdefScrollView.Draw();
				break;
		}
	}

	public function OnPush(param: Object): void {
		super.OnPush(param);

		var data: HashObject = param as HashObject;
		attackHeros = _Global.GetObjectValues(data["s1Hero"]);
		defendHeros = _Global.GetObjectValues(data["s0Hero"]);

		SetNewData(data);

		// noAttackHero.SetVisible(attackHeros.length <= 0);
		noAttackHero.SetVisible(false);
		// noDefendHero.SetVisible(defendHeros.length <= 0);
		noDefendHero.SetVisible(false);

		bar.selectedIndex = 0;
		RefreshAttackHeroList();
	}

	private function SetNewData(data: HashObject) {

		if (data["newHeroInfo"] != null) {

			isNewReport = true;

			attackHeroList.SetVisible(false);
			defendHeroList.SetVisible(false);

			this.newAtkScrollView.SetVisible(true);
			this.newdefScrollView.SetVisible(true);
			this.newAtkScrollView.MoveToTop();
			this.newdefScrollView.MoveToTop();

			if (data["newHeroInfo"]["heroBoosts"]) {
				if (data["newHeroInfo"]["heroBoosts"]["s1"]) {
					this.atkHeroDetail.refresh(data["newHeroInfo"]["heroBoosts"]["s1"]);
					this.newAtkScrollView.addUIObject(this.atkHeroDetail.gameObject.GetComponent(ComposedUIObj));
				}
				if (data["newHeroInfo"]["heroBoosts"]["s0"]) {
					this.defHeroDetail.refresh(data["newHeroInfo"]["heroBoosts"]["s0"]);
					this.newdefScrollView.addUIObject(this.defHeroDetail.gameObject.GetComponent(ComposedUIObj));

				}
			}

			if (data["newHeroInfo"]["newOtherHeroInfo"]) {

				if (data["newHeroInfo"]["newOtherHeroInfo"]["s1"] != null) {
					if (data["newHeroInfo"]["newOtherHeroInfo"]["s1"]["assignHero"] != null) {
						var atk_ass_arr: Array = _Global.GetObjectValues(data["newHeroInfo"]["newOtherHeroInfo"]["s1"]["assignHero"]);
						this.atkAssaginHeroScrollList.rect.height = 50f + 210 * atk_ass_arr.length;
						this.atkAssaginHeroScrollList.Init(reportTemplate);
						this.atkAssaginHeroScrollList.SetData(atk_ass_arr);	
						this.atkAssaginHeroScrollList.AutoLayout();
						this.atkAssaginHeroScrollList.ResetPos();						
						this.newAtkScrollView.addUIObject(this.atkTitle1);
						this.newAtkScrollView.addUIObject(this.atkAssaginHeroScrollList);
					}
				}
				if (data["newHeroInfo"]["newOtherHeroInfo"]["s1"] != null) {
					if (data["newHeroInfo"]["newOtherHeroInfo"]["s1"]["helpHero"] != null) {
						var atk_help_arr: Array = _Global.GetObjectValues(data["newHeroInfo"]["newOtherHeroInfo"]["s1"]["helpHero"]);
						this.atkHelpHeroScrollList.rect.height = 50f + 210 * atk_help_arr.length;
						this.atkHelpHeroScrollList.Init(reportTemplate);
						this.atkHelpHeroScrollList.SetData(atk_help_arr);	
						this.atkHelpHeroScrollList.AutoLayout();
						this.atkHelpHeroScrollList.ResetPos();					
						this.newAtkScrollView.addUIObject(this.atkTitle2);
						this.newAtkScrollView.addUIObject(this.atkHelpHeroScrollList);
					}
				}
				if (data["newHeroInfo"]["newOtherHeroInfo"]["s0"] != null) {
					if (data["newHeroInfo"]["newOtherHeroInfo"]["s0"]["assignHero"] != null) {
						var def_ass_arr: Array = _Global.GetObjectValues(data["newHeroInfo"]["newOtherHeroInfo"]["s0"]["assignHero"]);
						this.defAssaginHeroScrollList.rect.height = 50f + 210 * def_ass_arr.length;
						this.defAssaginHeroScrollList.Init(reportTemplate);
						this.defAssaginHeroScrollList.SetData(def_ass_arr);	
						this.defAssaginHeroScrollList.AutoLayout();
						this.defAssaginHeroScrollList.ResetPos();						
						this.newdefScrollView.addUIObject(this.defTitle1);
						this.newdefScrollView.addUIObject(this.defAssaginHeroScrollList);

					}
				}
				if (data["newHeroInfo"]["newOtherHeroInfo"]["s0"] != null) {
					if (data["newHeroInfo"]["newOtherHeroInfo"]["s0"]["helpHero"] != null) {
						var def_help_arr: Array = _Global.GetObjectValues(data["newHeroInfo"]["newOtherHeroInfo"]["s0"]["helpHero"]);		
						this.defHelpHeroScrollList.rect.height = 50f + 210 * def_help_arr.length;
						this.defHelpHeroScrollList.Init(reportTemplate);
						this.defHelpHeroScrollList.SetData(def_help_arr);
						this.defHelpHeroScrollList.AutoLayout();
						this.defHelpHeroScrollList.ResetPos();	
						this.newdefScrollView.addUIObject(this.defTitle2);
						this.newdefScrollView.addUIObject(this.defHelpHeroScrollList);

					}
				}
			}

			this.newAtkScrollView.AutoLayout();
			this.newdefScrollView.AutoLayout();

		} else {
			this.newAtkScrollView.SetVisible(false);
			this.newdefScrollView.SetVisible(false);
			attackHeroList.SetVisible(true);
			defendHeroList.SetVisible(true);

			isNewReport = false;
		}
	}

	public function OnPushOver(): void {
		super.OnPushOver();
	}

	public function OnPop(): void {
		super.OnPop();
	}

	public function OnPopOver(): void {
		attackHeroList.Clear();
		defendHeroList.Clear();

		atkHelpHeroScrollList.Clear();
		atkAssaginHeroScrollList.Clear();
		defHelpHeroScrollList.Clear();
		defAssaginHeroScrollList.Clear();

		newAtkScrollView.clearUIObject();
		newdefScrollView.clearUIObject();

		super.OnPopOver();
	}

	private function OnBarChanged(index: int) {
		switch (index) {
			case 0:
				RefreshAttackHeroList();
				break;
			case 1:
				RefreshDefendHeroList();
				break;
		}
	}

	private function RefreshAttackHeroList(): void {
		attackHeroList.SetData(attackHeros);
		attackHeroList.ResetPos();
	}

	private function RefreshDefendHeroList(): void {
		defendHeroList.SetData(defendHeros);
		defendHeroList.ResetPos();
	}
	private var isNewReport: Boolean = false;
	function UpdateTouch() {
	atkHelpHeroScrollList.updateable = false;
	atkAssaginHeroScrollList.updateable = false;
	defHelpHeroScrollList.updateable = false;
	defAssaginHeroScrollList.updateable = false;

	if (isNewReport) {
		atkHelpHeroScrollList.updateable = false;
		atkAssaginHeroScrollList.updateable = false;
		defHelpHeroScrollList.updateable = false;
		defAssaginHeroScrollList.updateable = false;
	} else {
		// defendHeroList.updateable = false;
		// attackHeroList.updateable = false;
	}
}
}
