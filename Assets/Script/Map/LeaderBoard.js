public enum ActionType
{
	Browse = 1,
	Query = 2
}
public class MightItem{
	public var Rank:int;
	public var Name:String;
	public var AllianceName:String;
	public var Might:long;
	public var UserId:int;
	public var AllianceId:int;
	
	public function MightItem()
	{
	
	}
}
public static class	Leaderboard{
	public static class Type
	{
		public var Might	:String = "might";
		public var Killed	:String = "killed";
		public var Gained	:String = "gained";
		public var Attack	:String = "attack";
		public var Defend	:String = "defend";
	}
	public static class DateType
	{
		public var All:String = "all";
		public var LastWeek:String = "lastweek";
		public var ThisWeek:String = "thisweek";
	}
	
	private static var source:Array = new Array();
	private static var lastUpdate:long = 0;
	public static var shouldPopUp:boolean = false;
	public static function GetLastUpdate():long
	{
		return lastUpdate;
	}
	public static function ReqLeaderBoard(okCallback:Function,pageIndex:int,keyword:String,type:String,date:String)
	{
		var params:Array = new Array();
		var action:ActionType = ActionType.Browse;
		if(keyword != null && keyword != "")
		{
			params.Add(2);
		}
		else
		{
			params.Add(1);
		}
		params.Add(pageIndex - 1);
		params.Add(keyword);
		params.Add(type);
		params.Add(date);
		
		
		var canFunc:Function = function(result:HashObject){
			if(result["ok"].Value)
			{
				shouldPopUp = false;
				if(result["rater"] != null && result["rater"]["popUp"] != null && result["rater"]["popUp"].Value != null)
					shouldPopUp = result["rater"]["popUp"].Value == "1";
				if(result["lastUpdate"])
				{
					lastUpdate = _Global.INT64(result["lastUpdate"]);
				}
				var total:int = _Global.INT32(result["totalPlayer"]);
				var pagesize:int = _Global.INT32(result["pageSize"]);
				var pageCount:int = _Global.INT32(total / pagesize) + (total % pagesize > 0?1:0);
				
				var list:HashObject = result["leaderboard"];
				var count:int = pagesize;
				if(pageIndex == pageCount && total % pagesize >0)
				{
					count = total % pagesize;
				}
				else if(total == 0)
				{
					count = 0;
				}
				else
				{
					//nothing
				}
				source = new Array();
				for(var i =0;i<count ;i++)
				{
					var item:MightItem = new MightItem();
					if(list[_Global.ap + i])
					{
						if(list[_Global.ap + i]["displayName"] != null)
						{
							item.Name = list[_Global.ap + i]["displayName"].Value;
						}
						if(list[_Global.ap + i]["allianceName"])
						{
							item.AllianceName = list[_Global.ap + i]["allianceName"].Value;
						}
						
						item.AllianceId = _Global.INT32(list[_Global.ap + i]["allianceId"]);
						item.Might = _Global.INT64(list[_Global.ap + i]["might"]);
						item.Rank = _Global.INT32(list[_Global.ap + i]["rank"]);
						item.UserId = _Global.INT32(list[_Global.ap + i]["userId"]);
						
						source.push(item);
					}
				}
				
				if(okCallback)
				{
					okCallback(source,total,pagesize,pageIndex);
				}
			}
			
		};
		UnityNet.reqLeaderboardInfo(params,canFunc,null);
	}
	
}
