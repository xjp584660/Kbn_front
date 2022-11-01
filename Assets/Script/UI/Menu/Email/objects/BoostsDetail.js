class BoostsDetail extends UIObject {
    public var detail: ComposedUIObj;

    public var attack: Label;
    public var life: Label;
    public var speed: Label;
    public var load: Label;
    public var marchSize: Label;
    public var foeLf: Label;
    public var foeAtk: Label;

    public var arrowList: Label[];

    public var label_attack:Label;
    public var label_life:Label;
    public var label_speed:Label;
    public var label_load:Label;
    public var label_marchSize:Label;
    public var label_foeLf:Label;
    public var label_foeAtk:Label;

    private var stringSequenceList: Array = new Array(
        "attack",
        "life",
        "speed",
        "load",
        "marchSize",
        "foeLf",
        "foeAtk"
    );

    public function Draw() {
        detail.Draw();
    }

    public function refresh(data: HashObject, isLeft: Boolean) {
        var curData: HashObject = isLeft ? data["attack"] : data["enemy"];

        this.attack.txt = this.GetThePercentageNumericString(curData["boosets"]["attack"]);
        this.life.txt = this.GetThePercentageNumericString(curData["boosets"]["life"]);
        this.speed.txt = this.GetThePercentageNumericString(curData["boosets"]["speed"]);
        this.load.txt = this.GetTheNumberString(curData["boosets"]["load"]);
        this.marchSize.txt = this.GetTheNumberString(curData["boosets"]["marchSize"]);
        this.foeLf.txt = this.GetThePercentageNumericString(curData["boosets"]["foeLf"]);
        this.foeAtk.txt = this.GetThePercentageNumericString(curData["boosets"]["foeAtk"]);

        label_attack.txt=KBN.Datas.getArString("BattleReport.Boost_Attack");
        label_life.txt=KBN.Datas.getArString("BattleReport.Boost_Lif");
        label_speed.txt=KBN.Datas.getArString("BattleReport.Boost_Speed");
        label_load.txt=KBN.Datas.getArString("BattleReport.Boost_Load");
        label_marchSize.txt=KBN.Datas.getArString("BattleReport.Boost_MarchLimit");
        label_foeLf.txt=KBN.Datas.getArString("BattleReport.Boost_FoeLF");
        label_foeAtk.txt=KBN.Datas.getArString("BattleReport.Boost_FoeATK");


        SetArrow(data, isLeft);
    }

    private function SetArrow(data: HashObject, isLeft: Boolean) {
        var curData: HashObject = isLeft ? data["attack"] : data["enemy"];
        var otherData: HashObject = isLeft ? data["enemy"] : data["attack"];

        for (var i = 0; i < stringSequenceList.length; i++) {
            var str: String = stringSequenceList[i];
            if (this.arrowList.length > i) {
                (this.arrowList[i] as Label).SetVisible(
                    _Global.INT32(curData["isMine"])==1
                );

                if(KBN._Global.INT64(curData["boosets"][str])==-1&&KBN._Global.INT64(otherData["boosets"][str])==0){
                    (this.arrowList[i] as Label).mystyle.normal.background =TextureMgr.instance().LoadTexture("", TextureType.BACKGROUND);
                }else if(KBN._Global.INT64(curData["boosets"][str])==0&&KBN._Global.INT64(otherData["boosets"][str])==-1){
                    (this.arrowList[i] as Label).mystyle.normal.background =TextureMgr.instance().LoadTexture("", TextureType.BACKGROUND);
                }else if(KBN._Global.INT64(curData["boosets"][str]) > KBN._Global.INT64(otherData["boosets"][str])){
                    (this.arrowList[i] as Label).mystyle.normal.background =TextureMgr.instance().LoadTexture("newemail_jiantoushang", TextureType.BACKGROUND);
                }else if(KBN._Global.INT64(curData["boosets"][str]) == KBN._Global.INT64(otherData["boosets"][str])){
                    (this.arrowList[i] as Label).mystyle.normal.background =TextureMgr.instance().LoadTexture("", TextureType.BACKGROUND);
                }else if(KBN._Global.INT64(curData["boosets"][str]) < KBN._Global.INT64(otherData["boosets"][str])){
                    (this.arrowList[i] as Label).mystyle.normal.background =TextureMgr.instance().LoadTexture("newemail_jiantouxia", TextureType.BACKGROUND);
                }
            }
        }

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