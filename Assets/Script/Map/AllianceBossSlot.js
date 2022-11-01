#pragma strict

function Start () {

}

function Update () {
	if(transform == null)return;
	var leftTime:Transform = transform.Find("AllianceBoss/LeftTimeObj/LeftTime");
	if(leftTime == null)return;
	var tm:TextMesh = leftTime.gameObject.GetComponent(TextMesh) as TextMesh;
	var hashDate:Hashtable = KBN.AllianceBossController.instance().GetShowTime() as Hashtable;
	var timeTemp:int = _Global.INT32(hashDate["time"]);
	switch(_Global.INT32(hashDate["type"]))
	{
	case KBN.AllianceBossController.EVENT_TIME_STATE.NOT_START:
		tm.text = _Global.timeFormatShortStrNotNull(timeTemp,false);
		break;
	case KBN.AllianceBossController.EVENT_TIME_STATE.START:
		tm.text = _Global.timeFormatShortStrNotNull(timeTemp,false);
		break;
	case KBN.AllianceBossController.EVENT_TIME_STATE.OVER:
		tm.text = Datas.getArString("Event.End_Title");
	}
}