 class NormalUpdate extends BaseTemplate
 {
  	public function  openWindow(_infor:PopupInfor):void
 	{
 		super.openWindow(_infor);
		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
 		confirmDialog.setLayout(600,320);
		confirmDialog.setContentRect(70,80,0,140);
 		confirmDialog.setButtonText(arStrings.getArString("PopUpInfor.ButtonView"),arStrings.getArString("PopUpInfor.ButtonIgnore"));
		
 		MenuMgr.getInstance().PushConfirmDialog(arStrings.getArString("PopUpInfor.NormalUpdate"),"",viewHandler, callBack, true);
 		confirmDialog.SetCloseAble(false);
 	}
 	
 	private function viewHandler():void
 	{
// 		ConnectToItune.UpdateGameByNewVersion(infor.URL);
		Application.OpenURL(infor.URL);
		PopupMgr.getInstance().forceCloseCurWindow();
 	}
 	
	private function callBack():void
	{
		PopupMgr.getInstance().forceCloseCurWindow();
	}
 	
 	public function closeWindow():void
 	{
 		
 	}
 }
