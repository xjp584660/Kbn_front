 class HardUpdate extends BaseTemplate
 {
 
  	public function  openWindow(_infor:PopupInfor):void
 	{
 		super.openWindow(_infor);

  		ErrorMgr.instance().ForcePushError("", arStrings.getArString("PopUpInfor.HardUpdate"));	 
		ErrorMgr.instance().m_errorDialog.setAction(arStrings.getArString("PopUpInfor.ButtonUpdate"), null);	 
		ErrorMgr.instance().m_errorDialog.btnConfirm.OnClick = updateHandle;
 		ErrorMgr.instance().m_errorDialog.btnClose.SetVisible(false);	
 	}
 	
 	private function updateHandle():void
 	{
		Application.OpenURL(infor.URL);
 	}
 	
 	public function closeWindow():void
 	{
 		//ErrorMgr.instance().PopError();
 	}
 }