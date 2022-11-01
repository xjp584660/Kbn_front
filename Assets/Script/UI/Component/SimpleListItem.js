


class SimpleListItem extends UIElement
{ 	

	public var title:SimpleLabel;
	public var icon:SimpleLabel;
	public var btnSelect : SimpleButton;
	public var description:SimpleLabel;
	protected var ID:int = 0;
	public var category:String;
	//
	public var handlerDelegate : IEventHandler;
	
	public function Instantiate():SimpleListItem
	{
		var newItem = new SimpleListItem();
		newItem.Copy(this);	
	}
	
	public function Copy( srcItem:SimpleListItem )
	{
		title.Copy(srcItem.title);
		icon.Copy(srcItem.icon);
		btnSelect.Copy(srcItem.btnSelect);
		description.Copy(srcItem.description);	
	}
	
	public function Draw()
	{
	//	DrawBackGround();
		GUI.BeginGroup(rect);
	//	DrawTitle();
		title.Draw();
		icon.Draw();		
		description.Draw();
		if(btnSelect)
			btnSelect.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	public function SetID(newID:int)
	{
		if(newID != ID)
		{
			ID = newID;
			InitContent();
		}
	}
	public function InitContent()
	{
	}
	
	public function UpdateData()
	{
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object)
	{
//		_Global.Log("SetRowData does not be implemented ");
	}
}

