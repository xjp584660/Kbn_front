class ToumamentInfoDescItem extends ListItem
{
	public var m_desc : Label;
	
	
	public function SetRowData(data:Object)
	{
		m_desc.txt = data as String;
	}
	
	public function Draw()
	{
		if(!visible)
			return;
		GUI.BeginGroup(rect);
		m_desc.Draw();
		GUI.EndGroup();
	   	return -1;
	}
}