public class BaseQueueMgr
{
	//should override.
	public function queueItemAdded(qItem:QueueItem,qId:int):void{}
	public function queueItemRemoved(qItem:QueueItem,qId:int):void{}
	
	public function queueItemChanged(qItem:QueueItem,qId:int):void{}
	//
	protected var queueHash:Hashtable = {};
	protected var queueArray:Array = [];
	
	public function clearAll():void
	{
		queueHash = {};
		queueArray = [];
	}
	
	public function creatQueueClass(qId:int):BaseQueue
	{
		return new BaseQueue();
	}
	
	public function getItemAtQueue(itemIndex:int,qId:int):QueueItem
	{
		var q:BaseQueue;
		q = this.getQueue(qId);
		if(q)
			return q.getItemAt(itemIndex);
		return null;
	}
	public function getQueue(qId:int):BaseQueue
	{
		return queueHash[_Global.ap + qId];
	}
	
	public function isQueueFull(qId:int):boolean
	{
		var q:BaseQueue = this.getAndCreatQueue(qId);
		return q && q.isFull;
	}	
	
	public function add2Queue(qItem:QueueItem,qId:int):boolean
	{
		var q:BaseQueue = this.getAndCreatQueue(qId);
		return q.addItem(qItem,true);
	}
	
	public function cancelQueue(qItem:QueueItem,qId:int):boolean
	{
		var q:BaseQueue = this.getQueue(qId);
		if(q)
			return q.cancelItem(qItem);
		return false;
	}
	
	public function GetQueueList():Array
	{
		return queueArray;
	}
	
	public function updateQueue():void
	{
		var i:int;
		for(i=queueArray.length-1; i>=0; i--)
		{
			(queueArray[i] as BaseQueue).updateItems();
		}
	}
				
	protected function getAndCreatQueue(qId:int):BaseQueue
	{
		var q:BaseQueue = this.getQueue(qId);
		if(!q)
		{
			q = this.creatQueueClass(qId);
			q.queueId = qId;
			q.queueMgr = this;
			
			queueHash[_Global.ap + qId] = q;
			queueArray.push(q);			
		}
		return q;
	}
}

class BaseQueue
{	
	protected var queueList:Array = new Array();	
	public var queueMgr:BaseQueueMgr = new BaseQueueMgr();
	public var queueId:int;
	
	protected var max_num : int = -1;
	
	public function Sort(comparer:Function)
	{
		if(comparer == null)
			return;
	
		for(var i:int = 0; i< queueList.length; i++)
		{
		    var max:int = i;
		    var temp:Object = queueList[i]; 
			for(var j:int = i; j <queueList.length; j++)
			{
				if(comparer(queueList[max], queueList[j]))
					max = j;
			}
			queueList[i] = queueList[max];
			queueList[max] = temp;	
		}
	}
	
	public function GetData():Array
	{
		return queueList;
	}
	
	public function setMaxItemNum(n:int):void
	{
		max_num = n;
	}
	
	public function get isFull():boolean
	{
		return (max_num >0 && max_num <= queueList.length);		
	}
	
	public function addItem(qItem:QueueItem):boolean
	{
		addItem(qItem,true);
	}
	
	public function addItem(qItem:QueueItem,ifAdd2QueueListNow:boolean):boolean
	{
		if(isFull)
			return false;
		qItem.calcRemainingTime();
	
		if(qItem.timeRemaining > 0)
//		if( !qItem.willBeRemoveFromBar)
		{
			if(ifAdd2QueueListNow)
				queueList.push(qItem);
			queueMgr.queueItemAdded(qItem,queueId);
			return true;
		}
		else
		{
			queueMgr.queueItemRemoved(qItem,queueId);
		}
		return false;
	}
	public function cancelItem(qItem:QueueItem):boolean
	{
		var i:int =0;
		for(; i<queueList.length; i++)
		{
			if(qItem == queueList[i])
			{
				queueList.RemoveAt(i);
				return true;				
			}
		}
		return false;
	}
	
	public function updateItems():void	
	{
		var i:int;
		var qItem : QueueItem;
		for(i=0; i<queueList.length; i++)
		{
			qItem = queueList[i];
			
			var t:long = qItem.timeRemaining;
			
			if(qItem.timeRemaining > 0)
//			if( !qItem.willBeRemoveFromBar )
			{
				qItem.calcRemainingTime();
//				qItem.timeRemaining = qItem.endTime - GameMain.unixtime();
			}
			
			if(qItem.timeRemaining <= 0)
			{
//				if(qItem.classType == QueueType.MarchQueue)
//				{
//					var marchVo : MarchVO = qItem as MarchVO;
//					if((marchVo.marchType == Constant.MarchType.RALLY_ATTACK || marchVo.marchType == Constant.MarchType.JION_RALLY_ATTACK) && 
//					marchVo.marchStatus == Constant.MarchStatus.RALLY_WAITING)
//					{
//						queueMgr.queueItemChanged(qItem,queueId);
//					}
//					else
//					{
//						OnRemoveItem(qItem);
//						queueList.RemoveAt(i);
//						queueMgr.queueItemRemoved(qItem,queueId);
//					}
//				}
//				else
//				{
					OnRemoveItem(qItem);
					queueList.RemoveAt(i);
					queueMgr.queueItemRemoved(qItem,queueId);
//				}			
			}
		}
	}
	public function OnRemoveItem(qItem : QueueItem):void
	{
	
	}

	public function get itemList():Array
	{
		return queueList;
	}
	
	public function getItemAt(i:int):QueueItem
	{
		if(queueList && queueList.length > i)
			return queueList[i];
		return null;
	}
} 

