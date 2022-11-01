class RestoreListItem extends ListItem
{
	public var lTroops:Label;
	public var lRestore:Label;
	public function SetRowData(data:Object)
	{
		var tmpdata:RestoreListData=new RestoreListData();
		tmpdata=(data as RestoreListData);
		lTroops.txt=tmpdata.type;
		lRestore.txt=tmpdata.num+"";
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		lTroops.Draw();
		lRestore.Draw();
		GUI.EndGroup();
	}
}