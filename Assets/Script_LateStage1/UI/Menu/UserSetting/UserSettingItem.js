class UserSettingItem extends ListItem
{
	public var removeBtn:Button;
	public var userName:Label;
	public var divideLine:Label;
		
	private var userId:int;
	private var listType:int;
	
	public function SetRowData(data:Object):void
	{
		var userSettingMenu:UserSettingMenu = MenuMgr.getInstance().getMenu("UserSettingMenu") as UserSettingMenu;
		listType = userSettingMenu.getListType();
		userId = _Global.INT32((data as Hashtable)["uid"]);
		userName.txt = (data as Hashtable)["name"] as String;
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		userName.Draw();
		removeBtn.Draw();
		divideLine.Draw();	
		GUI.EndGroup();
	}
	
	private function handleClick():void
	{
		if(listType == Constant.UserSetting.BLOCK_USER)
		{
			UserSetting.getInstance().removeBlockUser(userId, successFunc);
		}
		else if(listType == Constant.UserSetting.IGNORE_USER)
		{
			UserSetting.getInstance().removeIgnoreUser(userId, successFunc);
		}
	}
	
	private function successFunc(data:Object):void
	{
		MenuMgr.getInstance().PushMessage(Datas.getArString("Settings.UserToast"));
		var userSettingMenu:UserSettingMenu = MenuMgr.getInstance().getMenu("UserSettingMenu") as UserSettingMenu;
		userSettingMenu.displayInfor();
	}
	
	function Init()
	{
		userName.Init();
		divideLine.Init();
		removeBtn.Init();
		
		removeBtn.OnClick = handleClick;
		removeBtn.txt = Datas.getArString("Settings.UserRemove");
	}
	
}