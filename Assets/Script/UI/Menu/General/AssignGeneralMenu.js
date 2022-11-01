
class	AssignGeneralMenu extends	PopMenu{
	public	var	separateLine:Label;
	public	var	listView:ScrollList;
	public	var	assignGeneralItem:AssignGeneralItem;
	public	var	noGeneralLabel:Label;
	
	function Init()
	{
		super.Init();
		
		assignGeneralItem.Init();
		
		listView.Init(assignGeneralItem);
		
		separateLine.setBackground("between line", TextureType.DECORATION);
		noGeneralLabel.txt = Datas.getArString("AVA.Outpost_mytroops_NoGeneral");
	}
	
	public function DrawItem()
	{
		separateLine.Draw();
		noGeneralLabel.Draw();
		listView.Draw();
	}
	
	public	function	Update(){
		listView.Update();
	}
	
	//p:{title}
	public	function	OnPush( p:Object ){
	
		var	pos:int;
		var listData:Array = null;
		
		if ((p as Hashtable).ContainsKey("avaDefenseGeneral")) 
		{
			title.txt = Datas.getArString("Common.Assign") + " " + (p as Hashtable)["title"];
			var generalList = GameMain.Ava.Units.GetMarchGeneralList(); // available generals
			var assignedGeneralId = GameMain.Ava.Seed.AssignKnightId;
			listData = new Array();
			for (var i = 0; i < generalList.Count; i++) {
				if (generalList[i].knightId == assignedGeneralId)
					continue;
					
				listData.Push({
					"ava": true,
					"kid": generalList[i].knightId,
					"level": generalList[i].knightLevel.ToString()
				});
			}
			
			if (listData.length > 0) {
				listView.SetData(listData);
				listView.ResetPos();
				noGeneralLabel.SetVisible(false);
			} else {
				listView.SetVisible(false);
				noGeneralLabel.SetVisible(true);
			}
		}
		else
		{
			pos = (p as Hashtable)["positionId"];
			title.txt = Datas.getArString("Common.Assign") + " " + (p as Hashtable)["title"];

			
			var generals:Array = General.instance().getIdleKinghtsList();
			if( generals.length > 0 ){
				listView.SetVisible(true);
				noGeneralLabel.SetVisible(false);
				
				listData = new Array();
				for( var general:HashObject in generals ){
					var showLevel : String = null;
					if ( general["starLevel"] != null )
						showLevel = _Global.ToString(general["starLevel"]);
					else
						showLevel = general["knightLevel"].Value.ToString();
		//			var expLv:Array = General.instance().calcExpLvl( general["knightId"] );
					listData.Push({
					"name":general["knightName"].Value,
					"level":showLevel,//expLv[1],//general["knightLevel"],
					"salary":_Global.INT32((general as HashObject)["knightLevel"])*20 + "",//expLv[1]*20 + "",//_Global.INT32(general["knightLevel"])*20 + "",
					"pos":pos,
					"kid":(general as HashObject)["knightId"].Value
					});
				}
				
				listView.SetData(listData);
				listView.ResetPos();
				noGeneralLabel.SetVisible(false);
			}else{
				listView.SetVisible(false);
				noGeneralLabel.SetVisible(true);
			}
		}
	}
	
	public	function	OnPopOver()
	{
		listView.Clear();
	}
	
}