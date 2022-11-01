#pragma strict

private var textMesh:TextMesh;
private var endTime:double = 3.0f;
function Start () 
{
	var timeObj = transform.Find("marchTime").gameObject;
	textMesh = timeObj.GetComponent(TextMesh);
	
	SetFlagActive(false);
}

public function SetEndTime(time:long)
{
	endTime = time;
}

function Update () 
{
	var leftTime:long = endTime - GameMain.unixtime();
	if(leftTime<=0)
	{
		SetFlagActive(true);
		Destroy(gameObject);
	}
	else
	{
		SetLeftTime(leftTime);
	}
}

private function SetFlagActive(active:boolean)
{
	var flagTrans:Transform = transform.parent.Find("Flag");
	var flagdown1Trans:Transform = transform.parent.Find("FlagDown1");
	var flagdown2Trans:Transform = transform.parent.Find("FlagDown2");
	var flagdown3Trans:Transform = transform.parent.Find("FlagDown3");
	if(flagTrans != null)
	{
		flagTrans.gameObject.SetActive(active);
	}
	if(flagdown1Trans != null)
	{
		flagdown1Trans.gameObject.SetActive(active);
	}
	if(flagdown2Trans != null)
	{
		flagdown2Trans.gameObject.SetActive(active);
	}
	if(flagdown3Trans != null)
	{
		flagdown3Trans.gameObject.SetActive(active);
	}
}

private function SetLeftTime(time:long)
{
	textMesh.text =  _Global.timeFormatStrPlus(time);
}