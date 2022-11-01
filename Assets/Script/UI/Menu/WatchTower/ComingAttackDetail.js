
class ComingAttackDetail extends SubMenu
{
	var attackInfo:AttackInfo;
	var techList:UIList;
	var troopList:UIList;
	var target:Label;
	var arrivalTime:Label;
	var alliance:Label;
	var armySize:Label;
	var attacker:Label;
	var generalLevel:Label;
	
	var targetContent:Label;
	var arrivalTimeContent:Label;
	var allianceContent:Label;
	var armySizeContent:Label;
	var attackerContent:Label;
	var generalLevelContent:Label;
	
	var enemyResearch:Label;
	var enemyTroop:Label;
	var troopItems:ListItem[];
	var troopItem:ListItem ;
	var techItems:ListItem[];
	var techItem:ListItem;
//	var enemyTech:ComposedUIObj;
//	var enemyTroops:ComposedUIObj;
	var post:ComposedUIObj;
	var scrollView:ScrollView;
	var detail:ComposedUIObj;
	
	var l_bg:Label;
	
//	var line1:Label;
	var line2:Label;
	
//	var techBg:Label;
//	var troopBg1:Label;
//	var troopBg2:Label;
//	var troopBg3:Label;
	
	var noTech:Label;
	var noTroop:Label;
	
//	var title:SimpleLabel;
	
	function Init()
	{
		techList.Init();
		troopList.Init();
		techList.growDown = true;
		troopList.growDown = true;
		btnBack.OnClick = function( parram:Object )
		{
			var watchTowerMenu:WatchTowerMenu = MenuMgr.getInstance().getMenu("WatchTowerMenu") as WatchTowerMenu;
			if ( watchTowerMenu != null )
				watchTowerMenu.PopSubMenu();
		};
		title.txt =  Datas.getArString("WatchTower.IncomingAttacks");
		post.component = [l_bg, target, targetContent, arrivalTime,arrivalTimeContent, attacker,attackerContent, alliance,allianceContent, armySize, armySizeContent, generalLevel, generalLevelContent];
		detail.component = [post, noTech, techList, line2, noTroop, troopList, enemyResearch, enemyTroop];	
		scrollView.component = [detail];
		generalLevel.txt =  Datas.getArString("WatchTower.GeneralLevel");
		armySize.txt = Datas.getArString("WatchTower.ArmySize") ;
		target.txt = Datas.getArString("Common.Target");
		attacker.txt = Datas.getArString("Common.Attacker");
		alliance.txt = Datas.getArString("Common.Alliance");
		arrivalTime.txt = Datas.getArString("Common.Arrival");
		
//		line1.setBackground("between line", TextureType.DECORATION);
		line2.setBackground("between line", TextureType.DECORATION);
		
//		for(var i:int=0; i< troopItems.length; i++)
//		{
//			troopItems[i] = Instantiate(troopItem);
////			troopItems[i].DontDestroyOnLoad (troopItems[i].transform.gameObject);
//		}
		
				
		for(var i:int=0; i< techItems.length; i++)
		{
			techItems[i] = Instantiate(techItem);
//			techItems[i].DontDestroyOnLoad (techItems[i].transform.gameObject);
		}
		
		noTech.txt = Datas.getArString("WatchTower.UpgradeMsg");
		noTroop.txt = Datas.getArString("WatchTower.UpgradeMsg");
	}
	
	public function OnPush(param:Object)
	{
		techList.Clear();
		troopList.Clear();
		var upgrade:String = Datas.getArString("WatchTower.UpgradeMsg");
		attackInfo = param as AttackInfo;
		if(attackInfo.toTileX  == 0 && attackInfo.toTileY == 0)
			targetContent.txt = "" + attackInfo.cityName; 
		else
			targetContent.txt = "" + attackInfo.cityName + "-" + attackInfo.toTileName +" (" + attackInfo.toTileX + "," + attackInfo.toTileY + " )";
		attackerContent.txt = attackInfo.attackerName;
		allianceContent.txt = attackInfo.allianceName;
		if(attackInfo.armySize != "")
			armySizeContent.txt = ""+ attackInfo.armySize;
		else
			armySizeContent.txt = ""+upgrade;
		if(	attackInfo.generalLevel > 0	)
			generalLevelContent.txt =  "" +  attackInfo.generalLevel;
		else
			generalLevelContent.txt =  upgrade;
		if( !attackInfo.showTime )
			arrivalTimeContent.txt = upgrade;



		var newItem:ListItem;
		
//		enemyResearch.rect.y = line1.rect.yMax + 10;
		enemyResearch.txt = Datas.getArString("WatchTower.EnemyResearch");
		
//		techList.rect.y = techBg.rect.y + 5;
		var i:int;
		for(i=0; i < attackInfo.techs.length; i++)
		{
		//	newItem = Instantiate( techItem ); 
			techItems[i].title.txt = ( attackInfo.techs[i] as TechVO).name;	
			techItems[i].description.txt = "" + ( attackInfo.techs[i] as TechVO).level;
			techList.AddItem(techItems[i]);	
			
			techItems[i].icon.useTile = true;
			techItems[i].icon.tile = TextureMgr.instance().UnitSpt().GetTile("timg_"+ ( attackInfo.techs[i] as TechVO).tid);
			//techItems[i].icon.tile.name = "timg_"+ ( attackInfo.techs[i] as TechVO).tid;	
		//	techItems[i].icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("timg_"+ attackInfo.techs[i].tid, TextureType.ICON_RESEARCH);//Resources.Load("Textures/UI/icon/icon_research/timg_"+ attackInfo.techs[i].tid);
		}
		
		if(attackInfo.techs.length == 0)
		{
			techList.AddItem(techItems[0]);	
			techItems[0].SetVisible(false);
			noTech.SetVisible(true);	
		}
		else
		{
			noTech.SetVisible(false);
			techItems[0].SetVisible(true);
		}
		line2.rect.y = techList.rect.yMax + 5;
		enemyTroop.rect.y = line2.rect.yMax + 5;
		enemyTroop.txt = Datas.getArString("Common.Troops");;
		
//		troopBg1.rect.y = enemyTroop.rect.yMax + 5;
//		troopList.rect.y = troopBg1.rect.y + 5;
//		
//		troopBg2.rect.y = troopBg1.rect.yMax;
//		troopBg3.rect.y = troopBg2.rect.yMax;
		
		if(attackInfo.troops.length > 0)
	    {
	    	troopItems = new ListItem[attackInfo.troops.length];
	    }
	    else
	    {
	     	troopItems = new ListItem[1];
	    }
	    for(i =0; i< troopItems.length; i++)
	    {
	      	troopItems[i] = Instantiate(troopItem);
	    }
		
		for(i=0; i < attackInfo.troops.length; i++)
		{
		//	newItem = Instantiate( troopItem);
			var troop:Barracks.TroopInfo = attackInfo.troops[i] as Barracks.TroopInfo;
			troopItems[i].title.txt = ""+ troop.troopName + ": " ;				
			troopItems[i].description.txt = troop.description;
	//		troopItems[i].icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_"+ attackInfo.troops[i].typeId, TextureType.ICON_UNIT);//Resources.Load("Textures/UI/icon/icon_unit/ui_"+ attackInfo.troops[i].typeId);
			troopItems[i].icon.useTile = true;
			troopItems[i].icon.tile = TextureMgr.instance().UnitSpt().GetTile("ui_"+ troop.typeId);
			//troopItems[i].icon.tile.name = "ui_"+ troop.typeId;
			troopList.AddItem(troopItems[i]);		
		}
		
		if(attackInfo.troops.length == 0)
		{
		//	newItem = Instantiate( troopItem );
//			troopItems[0].title.txt = upgrade;
			troopList.AddItem(troopItems[0]);		
			noTroop.SetVisible(true);	
			troopItems[0].SetVisible(false);
		}	
		else
		{
			noTroop.SetVisible(false);
			troopItems[0].SetVisible(true);	
		}
//		if( troopList.GetItemsCnt() <= 5 )
//		{
//			troopBg2.SetVisible(false);
//			troopBg3.SetVisible(false);
//		}
//		else if( troopList.GetItemsCnt() <= 10 )
//		{
//			troopBg2.SetVisible(true);
//			troopBg3.SetVisible(false);
//		}
//		else
//		{
//			troopBg2.SetVisible(true);
//			troopBg3.SetVisible(true);
//		}

	//	scrollView.windowRect.height = troopList.rect.yMax + 200;
	//	scrollView.SetMaxOffset(150);
		detail.rect.height = troopList.rect.yMax;
		scrollView.AutoLayout();
		scrollView.MoveToTop();
		if(attackInfo.marchStatus==2){
		arrivalTime.txt = Datas.getArString("Newresource.march_gathering_Nolevel");
		}else arrivalTime.txt = Datas.getArString("Common.Arrival");
	}
	
	public function DrawItem()
	{
		btnBack.Draw();
		title.Draw();
		scrollView.Draw();
	}
	
	public	function	Clear()
	{
		for(var i:int=0; i< troopItems.length; i++)
		{
			TryDestroy(troopItems[i]);
		}
		
				
		for(i=0; i< techItems.length; i++)
		{
			TryDestroy(techItems[i]);
		}
		
		troopList.Clear();
		techList.Clear();
	}
	
	function Update()
	{
		var time:long = attackInfo.timeRemaining;
		if( attackInfo.showTime )
			arrivalTimeContent.txt = "" +_Global.timeFormatStr(time);
		scrollView.Update();
		
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		var newInfo:Object = Watchtower.instance().FindAttackItem(attackInfo.marchKey);
		if(newInfo == null)
		{
			attackInfo.timeRemaining = 0;
		}
		else
		{
			attackInfo = newInfo;
		}
	}
	
}