
class saleNotices{
	private	static	var	singleton:saleNotices;
	private var noticeList:Array;
	private var currentNotice:saleNotice;
	private var displaySeconds:double = 0.0;
	
	
	private var urgentNotice:saleNotice;
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new saleNotices();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public function get UrgentNotice():saleNotice
	{
		return urgentNotice;
	}
	
	public function InitsaleNotices()
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if(seed["chatSalesChrome"] != null)
		{
			noticeList = new Array();
			var keys:Array = _Global.GetObjectKeys(seed["chatSalesChrome"]);
			var noticeObj:HashObject = seed["chatSalesChrome"];
			urgentNotice = null;
			for(var i=0;i<keys.length;i++)
			{
				var ntcObj : HashObject = noticeObj[keys[i]];
				var notice:saleNotice = new saleNotice();
				notice.Destination = ntcObj["destination"].Value;
				notice.Param = _Global.ToString(ntcObj["desParams"]);
				notice.Detail = ntcObj["detail"].Value;
				notice.Image = ntcObj["imgFile"].Value;
				notice.SaleId = _Global.INT32(ntcObj["saleId"]);
				notice.Sort = _Global.INT32(ntcObj["sort"]);
				notice.Title = ntcObj["title"].Value;
				notice.WorldId = ntcObj["worldId"].Value;
				notice.Seconds = _Global.INT32(ntcObj["rollSeconds"]);
				var urgent:int = _Global.INT32(ntcObj["urgent"]);
				if(urgent == 1)
				{
					urgentNotice = notice;
				}
				noticeList.Add(notice);
			}
			noticeList.Sort(function(comparea:Object,compareb:Object){
				return (comparea as Notice).Sort - (compareb as Notice).Sort;
			});
		}
		else
		{
			noticeList = null;
		}
	}
	
	public function GetNoticesList():Array
	{
		if(noticeList == null)
		{
			InitsaleNotices();
		}
		return noticeList;
	}
	
	public function GetCurrentNotice():saleNotice
	{
		if(noticeList == null || noticeList.length ==0)
		{
			currentNotice = null;
			displaySeconds = 0;
		}
		else if(currentNotice == null)
		{
			if(noticeList != null && noticeList.length > 0)
			{
				currentNotice = noticeList[0] as saleNotice;
				displaySeconds = currentNotice.Seconds;
			}
		}
		else if(displaySeconds <= 0)
		{
			if(noticeList != null && noticeList.length > 0)
			{
				var index:int = 0;
				for(var i=0;i<noticeList.length;i++)
				{
					if(currentNotice.SaleId == (noticeList[i] as Notice).SaleId)
					{
						index = i;
						break;
					}
				}
				if(index >= (noticeList.length - 1))
				{
					index = 0;
				}
				else{
					index += 1;
				}
				
				currentNotice = noticeList[index] as saleNotice;
				displaySeconds = currentNotice.Seconds;
			}
			else
			{
				currentNotice = null;
			}
		}
		return currentNotice;
	}
	
	public function Update(seconds:double)
	{
		if(currentNotice != null)
		{
			this.displaySeconds -= seconds;
		}
	}
}
class saleNotice{
	public var SaleId:int;
	public var Title:String;
	public var Sort:int;
	public var WorldId:String;
	public var Destination:String;
	public var Param : String;
	public var Detail:String;
	public var Image:String;
	public var Seconds:int;
}