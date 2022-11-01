/**
	used in members now.
**/
public class Info2_Leaders extends ComposedUIObj
{
//	public var nav_head :NavigatorHead;
	public var tl1 :Label;
	public var tl2 :Label;
	public var tl3:Label;
	public var scroll_list : ScrollList;
	
//	public var bgFrame:Label;
	
	public var ins_leaderItem:ListItem;
	
	private var list:Array;
	public function Init():void
	{
		tl1.txt = Datas.getArString("Common.Name");
		
		tl2.txt = Datas.getArString("Common.Cities");
		tl3.txt = Datas.getArString("Common.Might");
//		nav_head.Init();
		scroll_list.Init(ins_leaderItem);
		
//		bgFrame.setBackground("frame_metal_square", TextureType.DECORATION);
		
//		this.addUIObject(ins_leaderItem);
	}
	
	public function showLeaders():void
	{
//		nav_head.titleTxt = "Leaders";
		list = Alliance.getInstance().allianceOfficers;
		
		list.sort(leaderSort);
	
		scroll_list.SetData(list);
		
//		ins_leaderItem.SetRowData(list[0]);
	}
	protected function leaderSort(a:Object,b:Object):int
	{
		return (a as AllianceMemberVO).positionType - (b as AllianceMemberVO).positionType; //  small --> bigger.
	}
	
	public function Update()
	{
		scroll_list.Update();
	}	
	
	public	function	Clear()
	{
		scroll_list.Clear();
	}
}