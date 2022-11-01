#pragma strict


public var progressBG:GameObject;
public var progressColor:GameObject;
public var leftTimeObj:TextMesh;
private var endTime:double;
private var lastSeconds:float;	// Used to determine when to resize the time background frame
private var timeBackgroundXform:Transform; // Cache the transform component of the time background
private var timeIconTrans:Transform;
private var timeoutWarningXform:Transform;
private var bossType:int;

function Start()
{
	lastSeconds = 0;
	timeBackgroundXform = transform.Find("LeftTimeObj/TimeBg"); // Cache the xform
	timeIconTrans = transform.Find("LeftTimeObj/Timeicon");
	timeoutWarningXform = transform.Find("LeftTimeObj/tishi_boss");
}

function Update()
{
	// if(bossType == Constant.PveType.SOURCEBOSS)
	// {
	// 	return;
	// }
	var leftTime:double = endTime - GameMain.unixtime();
	if( leftTime <= 0 )
	{
		if(progressBG != null)
		{
			progressBG.transform.localScale = Vector3.zero;
		}
	}
	else
	{
		if(progressBG != null)
		{
			progressBG.transform.localScale = Vector3.one;
		}
		SetTime(leftTime);
	}
}

public function Init(time:long, leftHP:long, totalHP:long, bossType:int)
{
	endTime = time;
	SetProgress(leftHP,totalHP);
	this.bossType = bossType;
	// if(bossType == Constant.PveType.SOURCEBOSS)
	// {
	// 	if(progressBG != null)
	// 	{
	// 		progressBG.transform.localScale = Vector3.zero;
	// 	}
	// }
	// else
	// {
		if(progressBG != null)
		{
			progressBG.transform.localScale = Vector3.one;
		}
		SetTime(endTime-GameMain.unixtime());
	//}
}

public function SetProgress(left:double,total:double)
{
	if(total == 0) return;
	if(progressColor != null)
	{
		progressColor.transform.localScale = new Vector3(left/total, 1, 1);
	}
}

public function SetTime(left:double)
{
	if(leftTimeObj != null)
	{
		if( Time.time - lastSeconds > 1.0 )
		{
			lastSeconds = Time.time;
			leftTimeObj.text = _Global.timeFormatShortStrEx(left,false);
			_Global.timeFormatStrAbout(left);

			// Resize the time background to fit the new time string width
			var METRICS_WIDTH : float = 1.5 * 2;
			var METRICS_SCALE_X : float = 1.1;
			var METRICS_CHARS : float = 9.0;
			var WIDTH_PER_CHAR : float = METRICS_WIDTH / METRICS_CHARS;

			if( timeBackgroundXform != null )
			{
				timeBackgroundXform.localScale.x = leftTimeObj.text.Length / METRICS_CHARS * METRICS_SCALE_X + 0.07;
				timeoutWarningXform.localScale.x = timeBackgroundXform.localScale.x;
//				timeBackgroundXform.localPosition.x = WIDTH_PER_CHAR * leftTimeObj.text.Length * 0.5;
				timeIconTrans.localPosition.x = timeBackgroundXform.localPosition.x - (timeBackgroundXform.localScale.x * 120/100)/2 - 0.13;//120 is the width of bg texture
				
			}
		}
	}
}
