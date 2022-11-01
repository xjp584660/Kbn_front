public class Dip_SetItem extends ListItem
{
	public var l_bg:Label;
	public var check_box  :ToggleButton;
	public var l_owner 	:Label;
	public var l_name	:Label;
	public var l_top	:Label; // l_ranking
	public var l_might	:Label;
	
	protected var davo:DipAllianceVO;
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		if(davo)
			check_box.selected = davo.selected;	
		check_box.Draw();
		if(davo)
			davo.selected = check_box.selected;
		l_bg.Draw();
		l_owner.Draw();
		l_name.Draw();
		l_top.Draw();
		l_might.Draw();		
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object):void
	{		
		this.davo = data as DipAllianceVO;		
		
		if(davo.host &&  davo.host.length > 0)
			l_owner.txt = davo.host;
		else
			l_owner.txt = davo.founderName;
			
//		l_owner.txt = davo.founderName;
		l_name.txt = davo.name;
		l_top.txt = "" +  davo.ranking;
		l_might.txt = "" + davo.might;
		
	}
	
	
	
}