class HelpMenu extends SubMenu
{
	@Space(30) @Header("---------- HelpMenu ----------") 


	public var helpContent:SimpleLabel;
	public var btnFaq:Button;
	public var btnRefresh:Button;
	public var btnClearMailCache:Button;
	public var btnContact:Button;
	public var btnForum:Button;
	public var btnDeleteAccount: Button;
	

	@Space(20) @Header("---------- 是否开启 账号删除功能按钮(仅 ios Editor 中可使用) ")
	@SerializeField private var isOpenDeleteAccountInEditor: boolean = true;

	/* 是否显示账号删除按钮 */
	private var isShowDeleteAccount = false;
	private var btnDeleteAccountPos: Rect;
	private var disY: float = 0;

	/* 这个值是用来判断是否点击了强制刷线游戏的按钮，
	 * 因为当强制重启游戏时，GameMain.instance()就会被清掉，
	 * 若是再去使用 GameMain.instance()就会报空错误
	 * */
	private var isGotoRefresh = false;


	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Settings.Help");

		helpContent.txt = Datas.getArString("Settings.HelpContent");

		btnFaq.txt = Datas.getArString("Settings.FAQs");
		btnRefresh.txt = Datas.getArString("Common.Refresh");
		btnClearMailCache.txt = Datas.getArString("Settings.ClearCache");
		btnContact.txt = Datas.getArString("Settings.ContactUs") ;
		btnForum.txt = Datas.getArString("Settings.VisitForum") ;
		btnDeleteAccount.txt = Datas.getArString("Settings.DeleteAccount");

		btnFaq.OnClick = OnFAQ;
		btnRefresh.OnClick = OnRefresh;
		btnClearMailCache.OnClick = OnClearMailCache;		
		btnContact.OnClick = OnContact ;	
		btnForum.OnClick = OnForum;
		btnDeleteAccount.OnClick = OnDeleteAccount;

		btnBack.SetVisible(false);

		btnDeleteAccountPos = btnDeleteAccount.rect;
		disY = btnDeleteAccountPos.y - btnContact.rect.y;
		SetDeleteAccountOpenState();

		isGotoRefresh = false;
	}
		
	public function DrawItem()
	{
		btnBack.Draw();

		helpContent.Draw();

		btnFaq.Draw();
		btnRefresh.Draw();
		btnClearMailCache.Draw();
		btnContact.Draw();

		if (!isGotoRefresh)
			SetDeleteAccountOpenState();

		if (isShowDeleteAccount) {
			var tempPos = btnDeleteAccountPos;
			tempPos.y += disY;
			btnForum.rect = tempPos;

			btnDeleteAccount.Draw();
			
		} else {
			btnForum.rect = btnDeleteAccount.rect;
		}

		btnForum.Draw();
	}
	



	public function Draw()
	{		
		if(!visible)
		{
			return -1;
		}
		
		if(disabled && Event.current.type != EventType.Repaint)
		{
			return;
		}	
		
//		DrawBackground();
		DrawTitle();
		DrawItem();
		return -1;
	}	
	
	function DrawTitle()
	{
		title.Draw();
	}
	
	private function OnFAQ(param:Object)
	{
		UnityNet.GetHelp(1, GetHlepOk, null);
	}
	
	private function OnRefresh(param:Object)
	{
		isGotoRefresh = true;
		GameMain.instance().restartGame();
	}
	
	private function OnClearMailCache(param:Object)
	{
		Datas.instance().clearMailAndReport();//clear chche file
		Message.getInstance().ResetMessage();//init data
		MenuMgr.getInstance().PushMessage(Datas.getArString("Settings.ClearCacheSuccess")); 
	}
	
	private function OnForum(param:Object)
	{
		UnityNet.GetHelp(3, GetHlepOk, null);
	}
	
	private function OnContact(param:Object)
	{
		UnityNet.GetHelp(2, GetHlepOk, null);
	}


	/* 根据条件判断是否开启显示 账号删除按钮 */
	private function SetDeleteAccountOpenState() {
		isShowDeleteAccount = false;

	/* 只有 iOS 端需要显示 账号删除按钮 */
#if UNITY_IOS
		var isOpen = GameMain.instance().IsOpenDeleteAccount();

	#if UNITY_EDITOR
		isOpen = isOpenDeleteAccountInEditor || isOpen;
	#endif

		isShowDeleteAccount = isOpen;
#endif
	}
	
	/* 弹出账号注销确认界面 */
	private function OnDeleteAccount(){

		var titleStrKey = "DeleteAccount.Title";
		var tipsInfoStrKey = "DeleteAccount.Text";
		var okBtnStrKey = "Common.Yes";
		var cancelBtnStrKey = "Common.No";

		var okFunc = function () {
			MenuMgr.getInstance().PopMenu("");
			GotoDeleteAccount();
		};


		var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		dialog.setLayout(550, 500);
		dialog.setTitleY(30);
		dialog.title.font = FontSize.Font_32;
		dialog.m_msg.mystyle.alignment = UnityEngine.TextAnchor.UpperLeft;
		dialog.setContentRect(70, 95, 0, 300);
		dialog.setButtonText(Datas.getArString(okBtnStrKey), Datas.getArString(cancelBtnStrKey));

		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString(tipsInfoStrKey), Datas.getArString(titleStrKey), okFunc, null);

	}

	/* 请求注销账号的链接url，然后打开链接  */
	private function GotoDeleteAccount() {


		var url = GameMain.instance().GetDeleteAccountURL();
		if (!String.IsNullOrEmpty(url))
			Application.OpenURL(url);

	}





	private function GetHlepOk(result:HashObject)
	{
		Application.OpenURL(result["url"].Value);
	}


	
}

