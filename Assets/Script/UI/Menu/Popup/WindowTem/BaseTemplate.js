class BaseTemplate
{
	protected var infor:PopupInfor;
	protected var arStrings:Datas;

	public function openWindow(_infor:PopupInfor):void
	{
		infor = _infor;
		if(!arStrings)
		{
			arStrings = Datas.instance();
		}		
	}

	public function closeWindow():void
	{
		
	}
}