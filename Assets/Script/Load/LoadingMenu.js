
class LoadingMenu extends UIObject
{
	public var itemList:System.Collections.Generic.List.<AnimLabel> = new System.Collections.Generic.List.<AnimLabel>();

	function  Init ()
	{

		itemList.Sort(msort);
		for(var i:int=0;i<itemList.Count;i++){
			if(itemList==null) continue;
			if(itemList[i]!=null) itemList[i].Init();
			
		}
	
	}
	
	function msort(a:AnimLabel,b:AnimLabel):int
	{
		return a.layer.CompareTo(b.layer);
	}
	
	
	
	
	function  Draw():int
	{
	
		if(!visible)
			return -1;

		for(var i:int=0;i<itemList.Count;i++){
		if(itemList==null) continue;
			itemList[i].Draw();
		}
	
	
		return -1;	
	}
	
	




}