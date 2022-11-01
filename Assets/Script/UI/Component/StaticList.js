//
//
//class StaticList extends UIObject
//{
//	public var items:Array;
//	private var data:Array;
//	public var growDown:boolean;
//	public var colPerPage:int;
//	protected var rectFixed:Rect;
//	function Init()
//	{
//		rectFixed = rect;
//	}
//	
//	public function AddItem( item:UIObject)
//	{
//		
//		if(growDown)
//		{	
//			item.rect.y = rect.height; 
//			rect.height += item.rect.height;
//		}
//		else 
//		{
//			item.rect.y = rect.height; 
//			rect.y -= item.rect.height;
//			rect.height += item.rect.height;
//		}
//		
//		this.items.push(item);
//	}
//	
//	public function RemoveIem()
//	{
//	}
//	
////	public function Refresh()
////	{
////		for(var i=0; i<items.length; i++)
////		{		
////		 //   items[i].rect.x = (i%colPerPage)*colDist;
////		 //   items[i].rect.y = (i/colPerPage)*rowDist;		    
////		}	
////
////	}
//
//	public function Clear()
//	{
//		data.Clear();	
//		rect = rectFixed;
//		rect.height = 0;
//	}
//
//	public function getItem(index:int)
//	{
//		return items[index];
//	}
//	
//
//
//	public function onNavigatorUp()
//	{
//	//	this.goToPrevious();
//	}
//
//	public function onNavigatorDown()
//	{
//	//	this.goToNext();	
//	}
//		
//
//	public function Draw()
//	{	
//		var selectedItem = -1;
//		GUI.BeginGroup (rect);
//		for(var i=0; i<items.length; i++)
//		{
//		    if( (items[i] as UIObject).Draw() )
//		    	selectedItem = i;
//		}		
//		GUI.EndGroup();
//		return selectedItem;
//	}
//	
//	public function UpdateData()
//	{
//		for(var i=0; i<items.length; i++)
//		{
//		    (items[i] as UIObject).UpdateData();
//		}
//	}
//	
//	public function GetItemsCnt():int
//	{
//		return items.length;
//	}
//	
//	function AutoLayout()
//	{
//	
//		rect = rectFixed;
//		for (var i = 0; i<items.length; i++)
//		{		
//			if(growDown)
//			{	
//				(items[i] as UIObject).rect.y = rect.height; 
//				rect.height += (items[i] as UIObject).rect.height;
//			}
//			else 
//			{
//				(items[i] as UIObject).rect.y = rect.height; 
//				rect.y -= (items[i] as UIObject).rect.height;
//				rect.height += (items[i] as UIObject).rect.height;
//			}
//		}
//	}
//	
//
//}
//
