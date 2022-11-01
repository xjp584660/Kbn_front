class VIPItemData
{
	var iconName:String;
	var content:String;
}
class VIPItem extends ListItem
{
	
	var l_Icon:Label;
	var l_content:Label;
	
	
	
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_Icon.Draw();
		l_content.Draw(); 
		GUI.EndGroup();
	}
	
	public function SetRowData(_data:Object):void
	{
		var data:VIPItemData = _data as VIPItemData;
		l_content.SetFont();
		if( !String.IsNullOrEmpty(data.iconName) )
		{
//			l_Icon.rect.x = 100;
			l_Icon.setBackground(data.iconName,TextureType.ICON);
//			l_content.rect.x = l_Icon.rect.x + l_Icon.rect.width + 10;
			
		}
		l_content.txt = data.content;
		l_content.rect.height = l_content.mystyle.CalcHeight(GUIContent(l_content.txt), l_content.rect.width);
		if(l_Icon.rect.height > l_content.rect.height)
		{
			rect.height = l_Icon.rect.height + 10;
		}
		else
		{
			rect.height = l_content.rect.height + 10;
		}
		
	}

}