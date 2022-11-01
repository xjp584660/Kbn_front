
class HeroBoostsDetail extends UIObject {
    public var detail: ComposedUIObj;

    public var attack: Label;
    public var life: Label;
    public var speed: Label;
    public var load: Label;


    public var label_attack:Label;
    public var label_life:Label;
    public var label_speed:Label;
    public var label_load:Label;

    // public var label_hero:Label;
    public var label_heroDetail:Label;

    public function Draw() {
        detail.Draw();
    }

    public function refresh(data: HashObject) {
        var curData: HashObject = data as HashObject;

        this.attack.txt = this.GetThePercentageNumericString(curData["attack"]);
        this.life.txt = this.GetThePercentageNumericString(curData["life"]);
        this.speed.txt = this.GetThePercentageNumericString(curData["speed"]);
        this.load.txt = this.GetTheNumberString(curData["load"]);

        label_attack.txt=KBN.Datas.getArString("BattleReport.Boost_Attack");
        label_life.txt=KBN.Datas.getArString("BattleReport.Boost_Lif");
        label_speed.txt=KBN.Datas.getArString("BattleReport.Boost_Speed");
        label_load.txt=KBN.Datas.getArString("BattleReport.Boost_Load");

        // label_hero.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title2");
        label_heroDetail.txt=KBN.Datas.getArString("BattleReport.HeroInfo_Title1");

    }
    
    private var noBuffIntValue: int = -1;
    private var noBuffIntValueString: String = "-";

    private function GetThePercentageNumericString(data: HashObject): String {
        if (KBN._Global.INT32(data) == noBuffIntValue)
            return noBuffIntValueString;
        else
            return "+" + KBN._Global.INT32(data) + "%";
    }

    private function GetTheNumberString(data: HashObject): String {
        if (KBN._Global.INT32(data) == noBuffIntValue)
            return noBuffIntValueString;
        else
            return "+" + KBN._Global.INT32(data);
    }
}