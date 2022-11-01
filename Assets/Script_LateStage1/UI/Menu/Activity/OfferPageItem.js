class OfferPageItem extends ListItem
{
	public var tabBack : Label;
	public var tabName : Label;
	public var clickButton : Button;
	public var pageData : OfferCategoryData;
	public var isSelected : boolean = false;
		
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

		return pageData.priority;
	}
	
	public function SetPageTab(pageType : int)
	{
		if(pageType == GetPageType())
		{
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_selectedmail", TextureType.BUTTON);
			isSelected = true;
		}
		else
		{
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_normalEmail", TextureType.BUTTON);
			isSelected = false;
		}
	}
	
	public function handlePageChange(param : Object):void
	{
		var pageNum : int = GetPageType();
		MenuMgr.getInstance().sendNotification(Constant.Notice.PAYMENT_OFFER_CLICK_PAGE,pageNum); 
	}
	
	public function DrawItem()
	{
		clickButton.Draw();
		tabBack.Draw();
		tabName.Draw();
	}
	
	public function SetPageNormal()
	{
		tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_normalEmail", TextureType.BUTTON);
	}
	
	public function Update()
	{
	
	}
	
	public function SetRowData(data:Object)
	{
		if(data != null)
		{
			pageData = data as OfferCategoryData;
			tabName.txt = pageData.categoryName;
			
			tabBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_normalEmail", TextureType.BUTTON);
		}		
	}
}