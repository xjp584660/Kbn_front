class InventoryPageItem extends ListItem
{
	public var tabBack : Label;
	public var tabName : Label;
	public var clickButton : Button;
	
	public var pageData : Array;
	
	public function Init()
	{
		super.Init();
		clickButton.OnClick = handlePageChange;
	}
	
	public function GetPageType() : int
	{
		if(pageData == null)
		{
			return 0;
		}
		var pageNum : int = _Global.INT32(pageData[1]);
		return pageNum;
	}
	
	public function SetPageTab(pageType : int)
	{
		if(pageType == GetPageType())
		{
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_down", TextureType.BUTTON);
		}
		else
		{
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_normal", TextureType.BUTTON);
		}
	}
	
	public function handlePageChange(param : Object):void
	{
		var pageNum : int = GetPageType();
		MenuMgr.getInstance().sendNotification(Constant.Notice.InventoryPage,pageNum); 
	}
	
	public function DrawItem()
	{
		clickButton.Draw();
		tabBack.Draw();
		tabName.Draw();
	}
	
	public function Update()
	{
	
	}
	
	public function SetRowData(data:Object)
	{
		if(data != null)
		{
			var dataTable : Hashtable = data as Hashtable;
			pageData = _Global.GetObjectValues(dataTable);
			tabName.txt = pageData[0];
			
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_normal", TextureType.BUTTON);
		}		
	}
}