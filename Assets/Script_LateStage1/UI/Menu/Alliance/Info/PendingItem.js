public class PendingItem extends ListItem
{
	public var line_bg	:Label;
	public var checkBox	:ToggleButton;
	public var l_name 	:Label;
	public var l_cn		:Label;
	public var l_might	:Label;
	
	protected var amvo : AllianceMemberVO;
	
	public var area_Btn :SimpleButton;
	
	public function Init():void
	{
		checkBox.valueChangedFunc = selectChange;
		area_Btn.rect.width = this.rect.width;
		area_Btn.rect.height = this.rect.height;
		area_Btn.OnClick = buttonHandler;
	}
	
	public function SetRowData(data:Object):void
	{
		this.amvo = data as AllianceMemberVO;
		Init();
		l_name.txt = amvo.name;
		l_cn.txt = "" + amvo.cities;		
		l_might.txt = "" + amvo.might;		
		checkBox.selected = amvo.selected;
	}
	
	protected function selectChange(b:boolean):void
	{
		if(amvo)
			amvo.selected = b;
		if(handlerDelegate)
			handlerDelegate.handleItemAction("PENDING",amvo);
	}
	protected function buttonHandler(clickParam:Object):void
	{
		checkBox.selected = !checkBox.selected;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		//
		area_Btn.Draw();
		line_bg.Draw();
		checkBox.Draw();
		l_name.Draw();
		l_cn.Draw();
		l_might.Draw();		
		
		GUI.EndGroup();
	}	
}