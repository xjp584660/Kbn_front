class BossRewardItem extends ListItem
{
	enum Type
	{
		TYPE_HEAD = 0,
		TYPE_CHANCE_TO_FIND_ITEM
	};

	@SerializeField private var itemIcon:Label;
	@SerializeField private var desc1:Label;
	@SerializeField private var desc2:Label;
	private var m_data:Hashtable;
	private var itemID:int = 0;
	private var itemNum:int = 0;
	private var m_type:int;
	
	@SerializeField private var reward :Label;
//	@SerializeField private var limit :Label;
	@SerializeField private var money :Label;
	@SerializeField private var food :Label;
	@SerializeField private var wood :Label;
	@SerializeField private var stone :Label;
	@SerializeField private var ore :Label;
	
	@SerializeField private var moneyTxt :Label;
	@SerializeField private var foodTxt :Label;
	@SerializeField private var woodTxt :Label;
	@SerializeField private var stoneTxt :Label;
	@SerializeField private var oreTxt :Label;
	
	@SerializeField private var change :Label;
	@SerializeField private var gemsNum :Label;
	private var bossData:KBN.PveLevelInfo;
	
	private var theFirstTime: boolean = true;;

	public function Init():void
	{
		super.Init();
		
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.useTile = true;
		gemsNum.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		gemsNum.useTile = true;
		m_type = Type.TYPE_CHANCE_TO_FIND_ITEM;
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		itemIcon.tile.name = null;
		itemIcon.tile = null;
		gemsNum.tile.name = null;
		gemsNum.tile = null;
	}
	
	public function Draw()
	{
		if (!visible) return;

		GUI.BeginGroup(rect);
		if( m_type == Type.TYPE_CHANCE_TO_FIND_ITEM )
		{
			itemIcon.Draw();
			desc1.Draw();
			desc2.Draw();
			gemsNum.Draw();
		}
		else
		{
			reward.Draw();
//			limit.Draw();
			money.Draw();
			food.Draw();
			
			
			wood.Draw();
			stone.Draw();
			ore.Draw();
			
			moneyTxt.Draw();
			foodTxt.Draw();
			woodTxt.Draw();
			stoneTxt.Draw();
			oreTxt.Draw();
			//reward end
			
			//chance to find begin
			change.Draw();	
			//chance to find end
		}
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		var dataHash :Hashtable = data as Hashtable;
		m_type = _Global.INT32(dataHash["type"]);
		if(m_type == Type.TYPE_CHANCE_TO_FIND_ITEM)
		{
			itemID = _Global.INT32(dataHash["itemID"]);
			itemNum = _Global.INT32(dataHash["itemNum"]);
			itemIcon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(itemID);
			if(KBN.AllianceBossController.instance().isAllianceBossDie == true)
			{
				MyItems.instance().AddItem(itemID,itemNum);
				KBN.AllianceBossController.instance().isAllianceBossDie = false;
			}
			if(itemNum > 1)
				desc1.txt = Datas.getArString("itemName.i" + itemID) + " X"+itemNum;
			else
				desc1.txt = Datas.getArString("itemName.i" + itemID);
			desc2.txt = Datas.getArString("itemDesc.i" + itemID);
			
			gemsNum.tile.name = "";
			if(itemID >= 42000 && itemID <= 42399)
 			{	
 				var idStr : String = itemID.ToString();
 				idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
				var level : int = KBN._Global.INT32(idStr);
				var nameLevel : int = level % Constant.GEM_LEVEL;
				var fileName : String = "gearstone_" + (nameLevel + 1);
 				gemsNum.tile = TextureMgr.instance().ElseIconSpt().GetTile(fileName);	
 			}
		}
		else if(m_type == Type.TYPE_HEAD)
		{
			money.setBackground("resource_Gold_icon",TextureType.ICON);
			food.setBackground("resource_Food_icon",TextureType.ICON);
			
			wood.setBackground("resource_Wood_icon",TextureType.ICON);
			stone.setBackground("resource_Stone_icon",TextureType.ICON);
			ore.setBackground("resource_Ore_icon",TextureType.ICON);
			reward.txt = Datas.getArString("Campaign.LevelSubTitle1");//"Rewards";
			change.txt = Datas.getArString("Campaign.LevelSubTitle2");//"Chance to find";
			var levelID : int = KBN.PveController.instance().curSelecteLevelID; // 100100102
			bossData = KBN.PveController.instance().GetPveLevelInfo(levelID) as KBN.PveLevelInfo;//levelid
					
			moneyTxt.txt = _Global.NumSimlify(bossData.gold)+"";
			foodTxt.txt = _Global.NumSimlify(bossData.food)+"";
			woodTxt.txt = _Global.NumSimlify(bossData.wood)+"";
			stoneTxt.txt = _Global.NumSimlify(bossData.stone)+"";
			oreTxt.txt = _Global.NumSimlify(bossData.ore)+"";
		}
	}
	
	public function RefreshData(factor:float):void
	{
		if(m_type != Type.TYPE_HEAD)
			return;
		var levelID : int = KBN.PveController.instance().curSelecteLevelID; // 100100102
		bossData = KBN.PveController.instance().GetPveLevelInfo(levelID) as KBN.PveLevelInfo;//levelid
		
		moneyTxt.txt = _Global.NumSimlify(bossData.gold*factor)+"";
		foodTxt.txt = _Global.NumSimlify(bossData.food*factor)+"";
		woodTxt.txt = _Global.NumSimlify(bossData.wood*factor)+"";
		stoneTxt.txt = _Global.NumSimlify(bossData.stone*factor)+"";
		oreTxt.txt = _Global.NumSimlify(bossData.ore*factor)+"";
	}
}