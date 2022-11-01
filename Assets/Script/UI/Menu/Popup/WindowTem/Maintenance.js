 class Maintenance extends BaseTemplate
 {
   	public function  openWindow(_infor:PopupInfor):void
 	{
 		super.openWindow(_infor);
 		ErrorMgr.instance().PushError("", arStrings.getArString("MaintenanceChat.GoToChatPrompt"),false,Datas.getArString("Common.OK_Button"),MaintainanceChat);
// 		ErrorMgr.instance().m_errorDialog.setAction("", callBack);
//		ErrorMgr.instance().m_errorDialog.lockScreen(false, 0);	
 	}

 	private function callBack():void
 	{
 		GameMain.instance().restartGame();
 	}

	private function MaintainanceChat():void
	{
		var	data:Datas = Datas.instance();
		data.init();
		
		var assetBundleMgr : AssetBundleManager = AssetBundleManager.Instance();
		assetBundleMgr.Init(GameMain.GetApplicationDataSavePath() + "/ota/" + data.getGameTheme());
		assetBundleMgr.LoadResourceListFromLocal();
		assetBundleMgr.LoadAllAssetBundles();
	
		var texMgr : TextureMgr = TextureMgr.instance();
		texMgr.ReInitSpt();
	
		PopupMgr.getInstance().clearCurPopInfor();
		MenuMgr.getInstance().PushMenu("MaintainanceChatMenu", null);
	}
	
 	public function closeWindow():void
 	{
 		
 	}
 }
