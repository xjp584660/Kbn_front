public class TechVO// extends QueueItem // NO NEED...
{
	public var tid			:int;
	public var name 		:String;
	public var level 		:int;	
	public var cityId		:int;
	public var texturePath	:String;	
	public var requirements	:Array;
	public var description	:String;	
	public var need_time	:long;
//	public var requirements	:Array;
	public var req_ok		:boolean;
	
	public var queueStatus:Research.ResearchQueueElement;
	public var isOtherUpgrading:boolean = false;
	//add 
	public var ast_callBack:Function;
	
}