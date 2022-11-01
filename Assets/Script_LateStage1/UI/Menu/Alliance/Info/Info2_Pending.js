public class Info2_Pending extends ComposedUIObj implements IEventHandler
{
	public var nav_head :NavigatorHead;
	
	public var listCon :ComposedUIObj;
	public var l_bg1	:Label;
	public var l_bg2	:Label;
//	public var l_bg3	:Label;
	
	public var scroll_list :ScrollList;	
	public var check_all :ToggleButton;
	public var tb_l1	:Label;
	public var tb_l2	:Label;
	public var tb_l3	:Label;
	public var b4g		:Button4Page;
	
	public var ins_pendingItem :PendingItem;
	
	public var bottom_l:Label;
	public var btn_refuse:Button;
	public var btn_accept:Button;
	
	private var all_list : Array;
	private var show_list :Array;
	public var texture_bottom :Texture2D;
	
	public var PAGE_NUM:int =10;
	
	public var bottomTile:Tile;
	
	public function Init()
	{
		nav_head.Init();
		b4g.Init();
		
		check_all.valueChangedFunc = checkChange;
		scroll_list.Init(ins_pendingItem);
		scroll_list.itemDelegate = this;
		
		btn_refuse.txt = Datas.getArString("Common.Reject_button");
		btn_accept.txt = Datas.getArString("Common.Approve");
		
		tb_l1.txt = Datas.getArString("Common.Name");
		tb_l2.txt = Datas.getArString("Common.Cities");
		tb_l3.txt = Datas.getArString("Common.Might");
		
		bottomTile = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
		bottomTile.rect.x=  0 ;
		bottomTile.rect.y = 705;
		bottomTile.rect.width = 640;
		//bottomTile.name = "tool bar_bottom";
		
//		l_bg3.setBackground("frame_metal_square", TextureType.DECORATION);
		
//		this.addUIObject(ins_pendingItem);	//for test......	
	}
	public function DrawBackGround()
	{
//		this.drawTexture(texture_line,13,392);
//		this.drawTexture(texture_bottom,0,707);	
		if(bottomTile.IsValid)
			bottomTile.Draw(true);		
	}
	
	protected function resetInit()
	{
		b4g.pageChangedHandler = this.pageChangedHandler;
	}
	public function Update()
	{
//		scroll_view.Update();	//TODO.. BUGS HERE>
		scroll_list.Update();
	}
	
	public function  showMemberList()
	{
		nav_head.titleTxt = Datas.getArString("AllianceInfo.PendingRequests");		
		nav_head.updateBackButton();
		
		all_list = Alliance.getInstance().pendingApprovals;		
		b4g.setPages(1, (all_list.length -1 ) / PAGE_NUM + 1 );
		check_all.selected = false;
		resetInit();
		//
		
		this.pageChangedHandler(1);
	}
	
	protected function pageChangedHandler(page:int):void
	{	
		var min:int = page* PAGE_NUM - PAGE_NUM;
		var max:int = min + PAGE_NUM;	
		if(max > all_list.length)
			max = all_list.length;
		
		show_list = all_list.slice(min,max);		
		changeListSelected(show_list,false);
		
		scroll_list.ResetPos();
		scroll_list.SetData(show_list);
		
//		ins_pendingItem.SetRowData(show_list[0]);
		calclNums();
	}
	
	protected function checkChange(b:boolean):void
	{
		changeListSelected(show_list,b);
//		vbox.updateItemData();

		scroll_list.ResetPos();
		scroll_list.SetData(show_list);
		calclNums();
	}
	
	protected function changeListSelected(list:Array,selected:boolean):void
	{
		if(list)
		{
			for(var i:int =0; i<list.length; i++)
			{
				(list[i] as AllianceMemberVO).selected = selected;	
			}
		}
	}
	
	public function getSelectedIDs():Array
	{
		var list:Array = [];
		if(show_list )
		{		
			for(var i:int =0;i<show_list.length; i++)
				if((show_list[i] as AllianceMemberVO).selected)
					list.push((show_list[i] as AllianceMemberVO).userId);
		}
		return list;
	}
	
	protected function  calclNums():void
	{
		var list:Array = getSelectedIDs();
		
		bottom_l.txt = Datas.getArString("AllianceInfo.NumSelected",[list.length,show_list!=null?show_list.length:0] );
	}
	public function handleItemAction(action:String,param:Object):void
	{
		calclNums();
	}
	
	public	function	Clear()
	{
		scroll_list.Clear();
	}
}
