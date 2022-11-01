class QuestRewardItem extends UIObject
{
	public var icon:Label;
	public var itemName:Label;
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		
		icon.Draw();
		itemName.Draw();
		
		GUI.EndGroup();
	}

	function setData(_data:Object)
	{

		var temp_reward:Quests.DataReward = _data as Quests.DataReward;

		var tempTexture:Texture2D;
		var spt:TileSprite = null;
		var name:String;
		switch(temp_reward.type)
		{
			case "resource":
				spt = TextureMgr.instance().ElseIconSpt();
				name = "icon_rec" + temp_reward.id;
				break;
				
			case "unit":
				spt = TextureMgr.instance().UnitSpt();
				name = "ui_" + temp_reward.id;
				break;
				
			case "item":
				spt = TextureMgr.instance().ItemSpt();
				name = "i" + temp_reward.id;
				break;
			
			default:
				break;	
		}
		
//		if(tempTexture)
//		{
//			icon.mystyle.normal.background = tempTexture;
//		}

		if(spt)
		{
			icon.useTile = true;
			icon.tile = spt.GetTile(name);
			//icon.tile.name = name;
		}

		if(temp_reward.count != 1)
		{
			itemName.txt = temp_reward.name + " " + temp_reward.count;
		}
		else
		{
			itemName.txt = temp_reward.count + "-" + temp_reward.name;
		}
	}
}