public class Info2_DipView extends ComposedUIObj
{
	public var nav_head :NavigatorHead;
	public var tl_1:Label;
	public var tl_2:Label;
	public var tl_3:Label;
	public var tl_4:Label;
	public var scroll_list:ScrollList;
	public var ins_viewItem:Dip_ViewItem;
	
	public var con : ComposedUIObj;
	public var b4g : Button4Page;
	public var tg1 : ToggleButton;
	public var tg3 : ToggleButton;
	public var tg2 : ToggleButton;
	
//	public var bgFrame:Label;
	
	public function Init()
	{
		tl_1.txt = Datas.getArString("Alliance.AllianceNameAndOwner");	//"Name";
		tl_2.txt = "";	//Datas.getArString("Common.Owner");	//"Master";
		tl_3.txt = Datas.getArString("Alliance.Members");
		tl_4.txt = Datas.getArString("Common.Status");	//;
		
				
		tg1.txt = Datas.getArString("Alliance.relationFriendly");
		tg2.txt = Datas.getArString("Alliance.statusPending");
		tg3.txt = Datas.getArString("Alliance.relationHostile");
		
		tg1.selected = tg2.selected = tg3.selected = true;
		
		scroll_list.Init(ins_viewItem);
		
//		bgFrame.setBackground("frame_metal_square", TextureType.DECORATION);
		
		tg1.valueChangedFunc = filterChange;
		tg2.valueChangedFunc = filterChange;
		tg3.valueChangedFunc = filterChange;
		nav_head.Init();
		nav_head.titleTxt = Datas.getArString("Common.Diplomacy");
		
		b4g.Init();
		b4g.pageChangedHandler  = pageChangedHandler;
//		con.addUIObject(ins_viewItem);
	}
	protected var all_list : Array;
	protected var show_list:Array;
	protected var filter_list:Array;
	
	public static var PAGE_NUM:int = 10;
	
	public function setNController(nc:NavigatorController)
	{
		nav_head.controller = nc;
	}
	public function showDipList():void
	{
		//get list ....
		nav_head.updateBackButton();
		
		all_list = Alliance.getInstance().dipAllianceList;
		filter_list = all_list;		
		
//		b4g.setPages(1, (all_list.length -1 ) / PAGE_NUM + 1 );		
		pageChangedHandler(1);
		
		filterChange(true);
		
	}
	
	protected function pageChangedHandler(page:int):void
	{
		var min:int = page* PAGE_NUM - PAGE_NUM;
		var max:int = min + PAGE_NUM;	
		
		b4g.setPages(page, (filter_list.length -1 ) / PAGE_NUM + 1 );		
		
		if(max > filter_list.length)
			max = filter_list.length;		
			
		show_list = filter_list.slice(min,max);					
		scroll_list.ResetPos();
		scroll_list.SetData(show_list);			
	}
	
	public function Update()
	{
		scroll_list.Update();
	}
	
	protected function filterChange(b:boolean):void
	{
		var f:boolean = tg1.selected;
		var n:boolean = tg2.selected;
		var h:boolean = tg3.selected;
				
		scroll_list.SetVisible(all_list!= null && all_list.length > 0);
		
		if(!all_list)
			return;
		var st:int;	
		filter_list = [];
		
		for(var i:int = 0; i<all_list.length; i++)
		{
			st = (all_list[i] as DipAllianceVO).status;
			if(	    (f && st == Constant.Alliance.DIP_FRIENDLY) 
				||	(h && st == Constant.Alliance.DIP_HOSTILE) 
				||	(n && st == Constant.Alliance.DIP_NEUTRAL)  )				
				
				filter_list.push(all_list[i]);
				
			
		}		
		pageChangedHandler(1);
	
	}
	
	public	function	Clear()
	{
		scroll_list.Clear();
	}
}
