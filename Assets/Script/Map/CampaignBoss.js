#pragma strict


public var bossObj:GameObject;
public var progressBarObj:GameObject;
private var timeoutWarningObj : GameObject;
private var endTime:double;
private var bossType:int;
private var bossId:int;
private var slotId:int;
private var _leftHP:long;
private var _totalHP:long;
private var _timestampFullyRecovered:long;
private var _timeFullyRecovered:long;
private var lastUpdateTime : float;
private var DEBUG_RECOVERY_SIMULATION : boolean = false;

// Timeout warning
private var DEBUG_TEST_TIMEOUT_WARNING : boolean = false;
private var TIMEOUT_WARNING_TIME_TOLERANCE : double = 300.0; // 5 minutes
private var showTimeoutWarning : boolean = false;
private var progressBarColor : GameObject;

function Start () 
{
	if(bossObj != null)
	{
		progressBarColor = bossObj.transform.Find("BossProgressBar/BossProgressBarColor").gameObject;
	}	
}

public function SetHiddenBossLeftHP( leftHP : long )
{
	var myHiddenBossDataList :Dictionary.<int, KBN.HidenBossInfo>  = KBN.PveController.instance().GetHidenBossList();
	if(myHiddenBossDataList.Count != 0)
	{
		if( myHiddenBossDataList[bossId] != null )
		{
			var bossItem:KBN.HidenBossInfo = myHiddenBossDataList[bossId] as KBN.HidenBossInfo;
			bossItem.curHP = leftHP;
			//_leftHP=leftHP;
		}
	}
}

function Update () 
{
	var leftTime:double = endTime - GameMain.unixtime();
	if(bossType == Constant.PveType.SOURCEBOSS)
	{
		if(leftTime > 0)
		{
			bossObj.SendMessage("IconGray", SendMessageOptions.DontRequireReceiver);
			if(progressBarColor != null)
			{
				progressBarColor.SetActive(false);
			}		
		}
		else
		{
			bossObj.SendMessage("IconNormal", SendMessageOptions.DontRequireReceiver);
			if(progressBarColor != null)
			{
				progressBarColor.SetActive(true);
			}	
		}
	}
	if(leftTime<=0 && bossType != Constant.PveType.SOURCEBOSS)
	{
		GameMain.instance().getCampaignMapController().DeleteBossSlot(slotId);
		GameObject.Destroy(transform.gameObject);
	}
	else // Check timeout warning
	{
		if( !showTimeoutWarning )
		{
			if( DEBUG_TEST_TIMEOUT_WARNING || leftTime <= TIMEOUT_WARNING_TIME_TOLERANCE )
			{
			
				showTimeoutWarning = true;
				if( timeoutWarningObj )
				{
					timeoutWarningObj.SetActiveRecursively( true );
				}
			}
			else if( timeoutWarningObj.active ) // The object is set to active somewhere else
			{
				timeoutWarningObj.SetActiveRecursively( false );
			}
		}
		
		if( Time.time - lastUpdateTime > 1.0 ) // Update on a one-second basis
		{
			lastUpdateTime = Time.time;
			var delta = 0;
			if( Time.time <= _timestampFullyRecovered &&
				_timeFullyRecovered != 0 )
			{
				var diff = _totalHP - _leftHP;
				delta = diff * ( _timestampFullyRecovered - Time.time ) / _timeFullyRecovered;
			}
			SetCurProgress( bossId, _leftHP + delta, _totalHP );
			SetHiddenBossLeftHP( _leftHP );
		}
	}
}

public function Init(bId:int,sId:int,time:long, leftHP:long, totalHP:long, bossType:int)
{
	if(leftHP <= 0 || totalHP <= 0)
	{
		GameObject.Destroy(transform.gameObject);
		//don't delete boss slot because boss will be changed to next level
	}
	this.bossType = bossType;
	lastUpdateTime = 0f;
	bossId = bId;
/*#*/if( DEBUG_RECOVERY_SIMULATION )
{
	leftHP = totalHP / 2;
	SetHiddenBossLeftHP( leftHP );
}
	var myHiddenBossDataList :Dictionary.<int, KBN.HidenBossInfo>  = KBN.PveController.instance().GetHidenBossList();
	var levelID : int = 0;
	if(myHiddenBossDataList.Count != 0)
	{
		if( myHiddenBossDataList[bossId] != null )
		{
			var bossItem:KBN.HidenBossInfo = myHiddenBossDataList[bossId] as KBN.HidenBossInfo;
			levelID = bossItem.curLevelID;
		}
	}
	_timestampFullyRecovered = Time.time;
	_timeFullyRecovered = 1;
	if( totalHP != 0 )
	{
		if( levelID != 0 )
		{
			var bossInfo : KBN.DataTable.PveBoss = GameMain.GdsManager.GetGds.<KBN.GDS_PveBoss>().GetItemById( levelID );
			if( bossInfo != null )
			{
				_timeFullyRecovered = bossInfo.RECOVER_TIME * ( totalHP - leftHP ) / totalHP;
				_timestampFullyRecovered = Time.time + _timeFullyRecovered;
			}
		}
	}
	
	_leftHP = leftHP;
	_totalHP = totalHP;
	
	slotId = sId;
	endTime = time;
	bossObj = transform.Find("ChapterBoss_" + bossId).gameObject;
	if(bossObj != null)
	{
		progressBarObj = bossObj.transform.Find("BossProgressBar").gameObject;
		
		var progressBarScript:CampaignBossProgressBar = progressBarObj.GetComponent("CampaignBossProgressBar");
		progressBarScript.Init(endTime,leftHP,totalHP,bossType);
		
		var timeoutXform = bossObj.transform.Find("BossProgressBar/LeftTimeObj/tishi_boss");
		if( timeoutXform )
		{
			timeoutWarningObj = timeoutXform.gameObject;
			timeoutWarningObj.SetActiveRecursively( false );
		}
	}
	showTimeoutWarning = false;
}

public function SetCurProgress(bossId:int, current:long, total:long)
{
	if(current <= 0 || total <= 0)
	{
		GameObject.Destroy(transform.gameObject);
		return;
	}
	if(bossObj != null)
	{
		progressBarObj = bossObj.transform.Find("BossProgressBar").gameObject;
		var progressBarScript:CampaignBossProgressBar = progressBarObj.GetComponent("CampaignBossProgressBar");
		progressBarScript.SetProgress(current,total);
	}
}

