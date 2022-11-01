
class ShowSkillGroupItem extends ListItem
{

	public var title_name:Label;
	public var title_bg1:Label;
	public var title_bg2:Label;
	public var bg:Label;
	public var scroll:ScrollList;
	public var item:ShowSkillItem;

	private var title_h:float=50;
	private var item_h:float=35;

	public function Init()
	{
		super.Init();
		bg.Init();
		title_bg1.Init();
		title_bg2.Init();
		title_name.Init();
		
		item.Init();
		scroll.Init(item);
	}

	public function OnPushOver(){}

	public function DrawItem()
	{
		bg.Draw();
		title_bg1.Draw();
		title_bg2.Draw();
		// item.Draw();
		title_name.Draw();
		scroll.Draw();
	}	
	public function SetRowData(data:Object)
	{
		var d:HashObject=data as HashObject;
		title_name.txt=d["title"].Value as String;
		var l:Array=d["list"].Value as Array;
		
		bg.rect = new Rect(bg.rect.x,bg.rect.y,568,title_h+l.length*item_h+10);
		scroll.rect = new Rect(scroll.rect.x,title_h,560,l.length*item_h);
		rect.height=title_h+l.length*item_h+30;
		scroll.SetData(l);	
	}
	public function OnPopOver()
 	{
 		scroll.Clear();
 	}
 	public function OnDestroy()
 	{
 		scroll.Clear();
 	}
 	
}