public class MarchTypeItem extends ListItem
{
	public var btn_toggle 	:ToggleButton;
	public var l_content 	:Label;
	public var line   		:Label;
	public var area_Btn:SimpleButton;
	protected var drawLine:boolean = true;
	protected var m_data:Hashtable;
	
	public function Init():void
	{
		btn_toggle.valueChangedFunc = valueChangedFunc;
		area_Btn.OnClick = buttonHandler;
	}
	
	public function Draw()
	{	
		GUI.BeginGroup(rect);
		
		if(m_data)
			btn_toggle.selected = m_data["selected"];
		area_Btn.Draw();
		btn_toggle.Draw();
		l_content.Draw();
		
		if(drawLine)
			line.Draw();
		
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		this.m_data = data as Hashtable;
		Init();
		
		l_content.txt = m_data["content"];
		btn_toggle.selected = m_data["selected"];
		
		drawLine = m_data["line"] == true;		
	}
	protected function buttonHandler(clickParam:Object):void
	{
		if(m_data && !m_data["selected"])
			valueChangedFunc(true);
	}
	
	public function valueChangedFunc(selected:boolean):void
	{
		if(selected && handlerDelegate)
		{
			handlerDelegate.handleItemAction(Constant.Action.MARCH_TYPE_SELECT,m_data);
		}	
	}
}
