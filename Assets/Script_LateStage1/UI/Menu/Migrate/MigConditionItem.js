
class MigConditionItem extends ListItem
{
	
	public var m_data:MigrateCondition.ConditionData;
	public var infoLabel:Label;
	public var m_icon:Label;
	public var m_line:Label;
	
	function DrawItem()
	{

		//GUI.BeginGroup(rect);
		m_line.Draw();
		
		infoLabel.Draw();
		m_icon.Draw();
		
		//GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as MigrateCondition.ConditionData;
		infoLabel.txt=m_data.description;
		var iconName:String = m_data.state==true?"icon_satisfactory":"icon_unsatisfactory";
		m_icon.setBackground(iconName,TextureType.ICON);
			
		
	}
	
	

}