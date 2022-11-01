 class BanUser extends BaseTemplate
 {
 	public function  openWindow(_infor:PopupInfor):void
 	{
 		super.openWindow(_infor);
 		
  		ErrorMgr.instance().ForcePushError("", arStrings.getArString("PopUpInfor.BannedUser"));
  		ErrorMgr.instance().m_errorDialog.setAction("", callBack);	
 		ErrorMgr.instance().m_errorDialog.lockScreen(true, _infor.endTime);		
 	}
 	
 	private function callBack():void
 	{
 		GameMain.instance().restartGame();
 	}
 	
 	public function closeWindow():void
 	{
 		 
 	}
 }