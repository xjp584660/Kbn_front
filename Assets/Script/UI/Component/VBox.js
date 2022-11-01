public class VBox extends ComposedUIObj
{	
	public var vGap:int = 0;
	public var autoHeight:boolean = true;	
	
	public var itemDelegate : IEventHandler;
	
	protected var itemClass :ListItem;
	
	protected var dp:Array;
	
	protected var pH:int ;
	public function Init(item:ListItem):void
	{
		this.itemClass = item;
	}	
	
	public function set dataProvider(value:Array)
	{
		this.dp = value;		
		this.clearUIObject();		
		var child:ListItem;
				
		for(var i:int=0; i< (value as Array).length; i++)
		{
			child = Instantiate(itemClass);
			this.addUIObject(child);			
			child.SetRowData(dp[i]);
			child.handlerDelegate = itemDelegate;
		}
		reLayout();
	}
	public function updateItemData():void
	{
		if(dp == null)
			return;
		var child:ListItem;
		
		for(var i:int=0; i<dp.length; i++)
		{
			child = newComponent[i];
			if(child)
				child.SetRowData(dp[i]);
		}
	}
	
	public function reLayout():void
	{
		var child:UIObject;
		pH = 0;
		var i:int;
		for(i=0; i<component.length; i++)
		{
			child = component[i];
			child.rect.y = pH;
			pH += child.rect.height;
			pH += vGap;
		}
		for( var obj : UIObject in newComponent )
		{
			if ( obj == null )
				continue;
			//child = newComponent[i];
			obj.rect.y = pH;
			pH += obj.rect.height;
			pH += vGap;
		}
		if(autoHeight)
			this.rect.height = pH;
	}
}
