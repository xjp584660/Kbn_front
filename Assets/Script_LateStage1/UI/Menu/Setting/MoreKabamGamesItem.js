


public class MoreKabamGamesItem extends FullClickItem
{
	public var BackGroundLabel:Label;
	
	function Init()
	{
		btnDefault.OnClick = this.OnButtonClick;
		this.title.txt = Datas.getArString("Settings.MoreKabamGamesLink");
	}
	
	function Update()
	{
		
	}
	function Draw()
	{
		GUI.BeginGroup(rect);
		BackGroundLabel.Draw();
		title.Draw();
		DrawDefaultBtn();
		GUI.EndGroup();
	   	return -1;
	}
	
	private function OnButtonClick()
	{
		var data:Datas = Datas.instance();
		Application.OpenURL(data.GetKabamGamesLink());
	}
	
}