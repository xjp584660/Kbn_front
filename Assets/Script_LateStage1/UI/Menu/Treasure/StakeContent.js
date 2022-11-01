class StakeContent extends UIObject
{
	public var scrollList:ScrollList;
	public var stakeItem:StakeItem;
	
	private var data:Object;

	private var eventHandler:TreasurePopmenu;
	
	public function Init(_delegate:IEventHandler):void
	{
		stakeItem.Init();
		scrollList.itemDelegate = _delegate;
		scrollList.Init(stakeItem);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		scrollList.Draw();
		
		GUI.EndGroup();
	}
	
	public function Update():void
	{
		scrollList.Update();
	}	
	
	public function disableButtons(enable:boolean):void
	{
		scrollList.ForEachItem(function(listItem : ListItem)
		{
			var tempItem:StakeItem = listItem as StakeItem;
			tempItem.btnSelect.SetDisabled(enable);
		});
	}
	
	public function resetDisplay():void
	{
		var items:Array = Shop.instance().dataProduct;
		var itemArr:Array = new Array();
		
		var tempItem:Hashtable;
		var itemId:int;
		
		var crestMap:HashObject = Treasure.getInstance().crestDescription;
		var crestArr:Array = _Global.GetObjectKeys(crestMap);
		var crestId:int;
		
		for(var b:int = 0; b < crestArr.length; b++)
		{
			crestId = _Global.INT32(crestArr[b]);
			
			for(var a:int = 0; a < items.length; a++)
			{
				tempItem = items[a] as Hashtable;
				itemId = _Global.INT32(tempItem["ID"]);
				if(itemId == crestId)
				{
					itemArr.Push(tempItem);
				}		
			}
		}
		
		var newItem:Hashtable  = {"type":1, "ID":0};
		itemArr.Push(newItem);		
				
		scrollList.SetData(itemArr);
		scrollList.ResetPos();
		
		disableButtons(false);					
	}
	
	public	function	Clear()
	{
		scrollList.Clear();
	}
}