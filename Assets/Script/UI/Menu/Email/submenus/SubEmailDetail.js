class SubEmailDetail extends PopMenu
{
	public var detailObject:DetailObj;

	public function Init()
	{
		super.Init();
		btnClose.OnClick = handleBack;
		detailObject.Init();
	}
	
	public function DrawItem()
	{
		detailObject.Draw();
	}
	
	private function handleBack()
	{
		MenuMgr.getInstance().PopMenu("SubEmailDetail");
	}
	
	public function OnPush(param:Object)
	{
		detailObject.setData(param);
	}
    
    public function OnPopOver()
    {
        super.OnPopOver();
        detailObject.OnPopOver();
    }
	
	public function Update()
	{
		detailObject.Update();
	}
}