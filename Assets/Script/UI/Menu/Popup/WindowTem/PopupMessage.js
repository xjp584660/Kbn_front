 class PopupMessage extends BaseTemplate
 {
  	public function  openWindow(_infor:PopupInfor):void
 	{
 		super.openWindow(_infor);
 		
 		ErrorMgr.instance().PushError("", infor.message, false, "", callBack);
 	}

	private function callBack():void
	{
		PopupMgr.getInstance().forceCloseCurWindow();
	}
 	 	 	
 	public function closeWindow():void
 	{
 		ErrorMgr.instance().PopError();
 	}
 }