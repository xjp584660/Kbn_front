
class AttackItem extends ListItem
{

	protected var attackInfo:AttackInfo;
	public    var target:Label;
	public    var seperateLine:Label;
	public    var leftTime:Label;
//	public    var l_bg:SimpleLabel;
	public function Copy(src:AttackItem)
	{
		target = new Label();
		seperateLine = new Label();
		leftTime = new Label();
	//	target.Copy(src.target);
		seperateLine.Copy(seperateLine);
		leftTime.Copy(leftTime);	
	}
	
	public function SetRowData(data:Object)
	{
		seperateLine.setBackground("between line_list_small",TextureType.DECORATION);
		attackInfo = data as AttackInfo;
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		if(attackInfo.toTileX  == 0 && attackInfo.toTileY == 0)
			title.txt = "<color=#EBD0A8>" + Datas.getArString("Common.Target") + ": " + "</color>" + "<color=#CFA972>" + attackInfo.cityName + "</color>"; 
		else
			title.txt = "<color=#EBD0A8>" + Datas.getArString("Common.Target") + ": " + "</color>"  + "<color=#CFA972>" + attackInfo.cityName + "-" + attackInfo.toTileName +" (" + attackInfo.toTileX + "," + attackInfo.toTileY + " )" + "</color>";
		
		btnSelect.clickParam = attackInfo;
		btnSelect.OnClick = function(param:Object)
		{
		//	MenuMgr.getInstance().PushMenu();
			var watchTowerMenu:WatchTowerMenu = MenuMgr.getInstance().getMenu("WatchTowerMenu") as WatchTowerMenu;
			if ( watchTowerMenu != null )
				watchTowerMenu.ClickAttackItem(param);
		};
		
	}
	
	public function Draw()
	{
		if(attackInfo == null)
			return;
		GUI.BeginGroup(rect);
//		l_bg.Draw();
		btnSelect.Draw();
		title.Draw();
		if(attackInfo.showTime)
		{
			var time:long = attackInfo.timeRemaining;	
			if(attackInfo.marchStatus==2){//carmot collect 
				leftTime.txt = "<color=#EBD0A8>" + Datas.getArString("Newresource.march_gathering_Nolevel") + ": " + "</color>" + "<color=#CFA972>" + _Global.timeFormatStr(time) + "</color>";
			}else	
			leftTime.txt = "<color=#EBD0A8>" + Datas.getArString("Common.Arrival") + ": " + "</color>" + "<color=#CFA972>" + _Global.timeFormatStr(time) + "</color>";
			leftTime.Draw();
		}
		seperateLine.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
}

