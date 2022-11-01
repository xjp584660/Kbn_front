public class Dip_ViewItem extends ListItem
{
	public var line_bg		:Label;
	public var btn_name 	:Button;
	public var l_owner		:Label;
	public var l_nums		:Label;
	public var l_status		:Label;
	
	protected var davo:DipAllianceVO;
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		line_bg.Draw();
		btn_name.Draw();
		l_owner.Draw();
		l_nums.Draw();
		l_status.Draw();
		
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object):void
	{
		this.davo = data  as DipAllianceVO;
		btn_name.txt = davo.name;
		if(davo.host &&  davo.host.length > 0)
			l_owner.txt = davo.host;
		else
			l_owner.txt = davo.founderName;
			
		l_nums.txt = "" + davo.membersCount;
		l_status.txt = davo.statusStr;
		
	}
}