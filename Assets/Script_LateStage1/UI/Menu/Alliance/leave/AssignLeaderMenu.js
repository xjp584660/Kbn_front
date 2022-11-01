public class AssignLeaderMenu extends PopMenu implements IEventHandler
{
//	public var l_bg1   :Label;
//	public var l_bg2	:Label;
	public var line_texture:Texture2D;
	
	public var l_name :Label;
	public var l_might :Label;
	
	public var scroll_list : ScrollList;
	
	public var ins_leadItem:AllianceLeaveItem;
	
	
	public function Init()
	{
		super.Init();
		btnClose.OnClick = buttonHandler;
		
		l_name.txt = Datas.getArString("Common.Name");
		l_might.txt =  Datas.getArString("Common.Might");
		title.txt =  Datas.getArString("ResignAlliance.Assign_Leader");
		
		scroll_list.Init(ins_leadItem);
		scroll_list.itemDelegate = this;
	}
	public function DrawTitle()
	{
		title.Draw();
	}
	public function DrawItem()
	{
		l_name.Draw();
		l_might.Draw();
		scroll_list.Draw();

//		l_bg2.Draw();
		btnClose.Draw();

	}
	
	public function Update()
	{
		scroll_list.Update();
	}
	public function OnPush(param:Object):void
	{
		//
		Alliance.getInstance().reqAllianceMemberNames(memberLoaded);
	}
	
	protected function memberLoaded(list:Object[]):void
	{
		scroll_list.SetData(list);
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		//assign to it... then close it.
		Alliance.getInstance().reqAllianceNewChancellor((param as HashObject)["userId"].Value, (param as HashObject)["displayName"].Value,6,onLeaved);
	}
	private function buttonHandler(param:Object)
	{
		this.close();
	}
	private function onLeaved():void
	{	
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_AssignSucess"));
		this.close();
		//close confirmDialog..
		//MenuMgr.getInstance().confirmDialog.close();

	}
	
	function DrawBackground()
	{
	    super.DrawBackground();
		drawTexture(line_texture,40,126,500,17);
	}
	
	public function OnPopOver()
	{
		scroll_list.Clear();
	}
}
