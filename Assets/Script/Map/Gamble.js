class Gamble
{
	private static var instance:Gamble;
	private var hasActivity:boolean;
	private var oldActivityState:boolean;
	
	public static function getInstance():Gamble
	{
		if(instance == null)
		{
			instance = new Gamble();
		}
		
		return instance;
	}
	
	public function getSeniorGambleSetting(callback:Function, errorCallback:Function):void
	{	
		var ok:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{		
				var infor:SeniorGambleInfor = new SeniorGambleInfor();
				infor.parser(result["data"]);
				
				if(infor.hasActivity != oldActivityState)
				{
					MenuMgr.getInstance().MainChrom.setSeniorGambleState(infor.hasActivity);
					oldActivityState = infor.hasActivity;					
				}
				
				if(callback != null)
				{
					callback(infor);
				}
			}
			
		};
		
		var error:Function = function(ErrorMgr:String, ErrorCode:String)
		{
			if(errorCallback)
			{
				errorCallback(ErrorMgr, ErrorCode);
			}
		};
		
		UnityNet.reqSeniorGambleSetting(ok, error);
	}
	
	public function updateActivity(data:HashObject):void
	{
		if(_Global.INT32(data.Value) == 1)
		{
			hasActivity = true;
		}
		else
		{
			hasActivity = false;	
		}
		
		if(hasActivity != oldActivityState)
		{
			MenuMgr.getInstance().MainChrom.setSeniorGambleState(hasActivity);
			oldActivityState = hasActivity;
		}
	}
	
	public function init(data:HashObject):void
	{
		if(data["magicalBoxHasEvent"] == null)
		{
			hasActivity = false;
			oldActivityState = hasActivity;
		}
		else
		{
			if(_Global.INT32(data["magicalBoxHasEvent"]) == 1)
			{
				hasActivity = true;
				oldActivityState = hasActivity;			
			}
			else
			{
				hasActivity = false;
				oldActivityState = hasActivity;				
			}
		}
	}
	
	public function get HasActivity():boolean
	{
		return hasActivity;
	}
}


class SeniorGambleInfor
{
	public var needToken:int;	
	public var rewardsArr:Array;
	public var title:String;
	public var description:String;
	public var hasActivity:boolean;
	
	public function parser(data:HashObject):void
	{
		if( _Global.INT32(data["hasEvent"].Value) == 0)
		{
			hasActivity = false;
			//return;
		}
		else
		{
			hasActivity = true;
		}
	
		title = "";	
		description = data["eventDesc"].Value + "";
		needToken = _Global.INT32(data["token"].Value);
		
		var rewards:HashObject = data["icon"];
		var arr:Array = _Global.GetObjectKeys(rewards);
		var reward:GambleReward;
		rewardsArr = new Array();
		
		for(var a:int = 0; a < arr.length; a++)
		{
			reward = new GambleReward();
			if(reward.parser(rewards[_Global.ap + a]))
			{
				rewardsArr.Push(reward);
			}
		}
	}	
}

class GambleReward
{
	public var id:int;
	public var picPath:String;
	
	public function parser(data:HashObject):boolean
	{
		var str:String = data.Value as String;
		id = str.IndexOf('i') == 0 ? _Global.INT32(str.Split('i'[0])[1]):_Global.INT32(str) ;
		if(id == 0)
		{
			return false;
		}
		
		picPath = TextureMgr.instance().LoadTileNameOfItem(id);
		
		return true;
	}
}