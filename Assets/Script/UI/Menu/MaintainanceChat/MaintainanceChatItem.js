class MaintainanceChatItem extends ListItem
{
	public var userName:Label;
	public var message:Label;
	public var time:Label;
	public var mystyle:GUIStyle;
	
	//green
	private var colorSelfName:Color = new Color(0, 0.337, 0.129, 1);
	private var colorSelfMessage:Color = new Color(0.286 , 0.416, 0.004, 1);
	//brown
	private var colorOtherName:Color = new Color(0.510, 0.263, 0, 1);
	private var colorOtherMessage:Color = new Color(0.569, 0.388, 0.082, 1);
	public function Draw()
	{
		GUI.BeginGroup(rect);
		userName.Draw(); 
		time.Draw();
 		message.Draw();	
		GUI.EndGroup();
	}
	
	public function SetRowData(_data:Object):void
	{
		var data:HashObject = _data as HashObject;
		if(data == null) return;
		userName.txt = _Global.GetString(data["author"]);
		message.txt = _Global.GetString(data["content"]);
		time.txt = _Global.HourTimeWithoutSecond(_Global.INT64(data["time"]));
		
		message.rect.y = userName.rect.y + userName.rect.height + 5;	
		
//		FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
//		mystyle.wordWrap = true;		
		
		var _height:float = message.mystyle.CalcHeight(GUIContent(message.txt), message.rect.width);
		message.rect.height = _height + 10;
		
		rect.height = message.rect.y + message.rect.height;
		
		if (_Global.GetString(data["author"]) != MaintenanceChat.getInstance().getAuthor()) 
		{
			changeTextColor(colorOtherName, colorOtherMessage);
		} 
		else 
		{
			changeTextColor(colorSelfName, colorSelfMessage);
		}
	}
	
	protected function changeTextColor(colorName:Color, colorMessage:Color) 
	{
		userName.mystyle.normal.textColor = colorName;
		message.mystyle.normal.textColor = colorMessage;
		time.mystyle.normal.textColor = colorName;
	}	
}