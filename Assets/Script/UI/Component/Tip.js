
class Tip extends Label {
	
	public function Draw()
	{	
		if(GUI.tooltip==null || GUI.tooltip=="")
			return -1;
//		DrawBackground();
		GUI.Label (rect, GUI.tooltip, mystyle);
		GUI.tooltip = "";
		return -1;
	}
	
}