public class PropUseDialog extends KBNMenu
{
	public var l_title:Label;
	public var l_time : Label;
	public var propScroll:ScrollList;
	public var btn_close:Button;
	
	public var ins_propItem :PropItem;
	
	public function Awake()
	{
		super.Awake();
		Init();

	}
	
	public function Init()
	{
		propScroll.Init(ins_propItem);
		btn_close.OnClick = buttonClick;
	}
	
	public function DrawItem()
	{
		propScroll.Draw();
		l_title.Draw();
		l_time.Draw();
		btn_close.Draw();
		
	
	}
	function Update()
	{
		propScroll.Update();
	}
	
	public function OnPush(param:Object)
	{
		var list:Array = Prop.getInstance().getSpeedUpPropList();
		
		propScroll.SetData(list);
	}
	
	function DrawBackground()
	{
		if(this.background)
			DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height), Rect( 0, 0, rect.width, rect.height), rotation);
	}
	
	function buttonClick(clickParam:Object):void
	{
		MenuMgr.getInstance().PopMenu("");
	}
}