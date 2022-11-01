public class MarchTroopItem2 extends ListItem
{
	public var texture_line :Texture2D;
	public var l_img 	:Label;
	public var l_name 	:Label;
	public var tf_num	:TextField;
	public var slider	:Slider;
	public var l_min	:Label;
	public var l_max	:Label;
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		this.drawTexture(texture_line,0,140,550,17);
		
		
		GUI.EndGroup();
	}
	
	public function SetRowData(obj:Object):void
	{
	
	}
}