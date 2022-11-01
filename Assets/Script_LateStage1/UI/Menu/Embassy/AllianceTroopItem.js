
class AllianceTroopItem extends ListItem{

//	public  var seperateLine:Label;
	public  var bgLabel:Label;
	public	var	nameLabel:Label;

	public function SetRowData(data:Object){
//		var arStrings:Object = Datas.instance().arStrings();
		var encamp:Embassy.EncampedAlliesInfo = data as Embassy.EncampedAlliesInfo;
		nameLabel.txt = encamp.allyName;
		title.txt = Datas.getArString("Common.UpKeep") + ": " + _Global.NumSimlify2(encamp.upkeep) + " " + Datas.getArString("ResourceName."+_Global.ap + "1");
		description.txt = Datas.getArString("Embassy.SentFrom") + ": (" + encamp.x + ", " + encamp.y + ")";// + "-" + data.allyName;
		
		btnSelect.txt = Datas.getArString("Common.Message");
		btnSelect.clickParam = data;
		btnSelect.OnClick = function(param:Object)
		{
			var _obj:Hashtable = {"subMenu":"compose", "name":(data as Embassy.EncampedAlliesInfo).allyName};
			MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
		};
	}
	
	public function Draw()
	{
	
		GUI.BeginGroup(rect);
			bgLabel.Draw();
			
			nameLabel.Draw();
			title.Draw();
			description.Draw();
			if(btnSelect)
				btnSelect.Draw();
//			seperateLine.Draw();
		GUI.EndGroup();
	   	return -1;
	}
}