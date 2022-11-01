class Download extends PopMenu
{
	var message:Label;
	var btnConfirm:Button;
	function Init()
	{
//		var arStrings:Object = Datas.instance().arStrings();
		super.Init();
		btnConfirm.txt = Datas.getArString("Common.OK_Button");
		message.txt = Datas.getArString("Loading.Download_Message");
		title.txt = Datas.getArString("Loading.Download_Title");
		btnConfirm.OnClick = function(){
			MenuMgr.getInstance().PopMenu("");
		};
	}
	
	function DrawItem()
	{
		message.Draw();
		btnConfirm.Draw();
	}
	
}

