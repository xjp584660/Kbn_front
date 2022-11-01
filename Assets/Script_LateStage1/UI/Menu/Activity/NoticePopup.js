class NoticePopup extends PopMenu
{
	public var chatNotices:ScrollList;
	public var itemTemplate:NoticeItem;
	public var lineup:Label;
	public var linedown:Label;
	
	function Init()
	{ 	
		super.Init();
	
		chatNotices.Init(itemTemplate);
		title.txt = Datas.getArString("Common.Notice");
		
		lineup.setBackground("between line", TextureType.DECORATION);
		linedown.setBackground("between line", TextureType.DECORATION);
		
		btnClose.OnClick = function()
		{
			UnityNet.SendNoticeBI(2);
			MenuMgr.getInstance().PopMenu("");
		};
	}
	
	function Update()
	{
		super.Update();
		chatNotices.Update();
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
		SetListData();
	}
	
	public	function OnPopOver()
	{
		chatNotices.Clear();
	}
	
	function SetListData()
	{
		var notices = ChatNotices.instance().GetNoticesList();
		chatNotices.SetData(notices);	
	}
	
	function DrawItem()
	{
		lineup.Draw();
		chatNotices.Draw();
		linedown.Draw();
	}
}
