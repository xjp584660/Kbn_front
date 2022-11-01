class ChoosePlain extends SubMenu
{
	public var scrollList:ScrollList;
	public var plain:PlainItem;
	public var line:Label;
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		scrollList.Init(plain);
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("PlayerInfo.AddCityPopSelectPlain");
	}
	function OnPush(param:Object)
	{
		var data:Hashtable;
		var tempArray:Array = new Array();
		var cityID:int = GameMain.instance().getCurCityId();
		var seed = GameMain.instance().getSeed();
		var	cities:HashObject = seed["cities"];
		
		for(var cityNum:int =0; cityNum<cities.Table.Count;cityNum++)
		{
			if(cities[_Global.ap+cityNum])
			{
				cityID = _Global.INT32(cities[_Global.ap+cityNum][_Global.ap+0]);
	
				var totalWilds:HashObject = seed["wilderness"]["city" + cityID];
	
				if(totalWilds)
				{
					var wild:HashObject;
					var titleType:int;
					var hasWild:boolean = false;			
					for(var _wild:System.Collections.DictionaryEntry in totalWilds.Table)
					{
						wild = _wild.Value as HashObject;
						var tileType:int = _Global.INT32(wild["tileType"]);
						
						if(tileType != Constant.TileType.PLAIN)
						{
							continue;
						}
									
						hasWild = true;
						
						data = {"id":wild["tileId"].Value, 
								"type":tileType, 
								"xCoor":wild["xCoord"].Value,
								"yCoor":wild["yCoord"].Value,
								"level":wild["tileLevel"].Value 
								};
								
						tempArray.push(data);
					}
					
					scrollList.SetData(tempArray);
				}	
			}
		}	

		
	}
	
	function DrawItem()
	{
		line.Draw();
		scrollList.Draw();
	}
	
	function Update()
	{
		scrollList.Update();
	}
	
	public	function	Clear()
	{
		scrollList.Clear();
	}
}
