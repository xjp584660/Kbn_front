class WallTroopItem extends FullClickItem
{
	protected var troopInfo:Walls.TroopInfo;
	public  var owned:Label;
	public  var seperateLine:Label;
	
	public  var lockIcon:SimpleLabel;
	
	public var l_Sale:Label;	
	public var unitIcon:UnitIcon;

	public function SetRowData(data:Object)
	{
		troopInfo = data as Walls.TroopInfo;
		title.txt = troopInfo.troopName;
		description.txt = troopInfo.description;
		owned.txt =  Datas.getArString("Common.Owned") +": " +  troopInfo.owned;
		btnSelect.clickParam = troopInfo;
		btnSelect.OnClick = function(param:Object)
		{
			var wallMenu:WallMenu = MenuMgr.getInstance().getMenu("WallMenu") as WallMenu;
			if( wallMenu ){
				wallMenu.ClickTroop(param);
			}
		};
		/*
		var iconPath:String = "ui_"+ troopInfo.typeId;
		//icon.image = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
		icon.useTile = true;
		icon.tile.spt = TextureMgr.instance().UnitSpt();
		icon.tile.name = iconPath;
		*/
		this.Init();
		unitIcon.UnitId = troopInfo.typeId;
		unitIcon.UnitType = troopInfo.actType;
		unitIcon.UnitLevel = troopInfo.level;
		
		btnDefault.clickParam = troopInfo;
		btnDefault.OnClick = btnSelect.OnClick;
		l_Sale.SetVisible(GameMain.instance().getTroopSaleDataFromSeed(Constant.TroopType.FORT,troopInfo.typeId)!=null);
	}
	public function Init()
	{	
		super.Init();
		unitIcon.Init();
		lockIcon.setBackground("icon_lock", TextureType.ICON);
		l_Sale.tile = TextureMgr.instance().ItemSpt().GetTile("sale_king");
		l_Sale.useTile = true;
		//l_Sale.tile.name = "sale_king";
	}
	
	public function Draw()
	{
		super.Draw();
		GUI.BeginGroup(rect);
	
			title.Draw();
			//icon.Draw();
			unitIcon.Draw();
			if( troopInfo.bLocked )
			{	
				lockIcon.Draw();
			}
			
			owned.Draw();
			description.Draw();
			btnSelect.Draw();
			l_Sale.Draw();	
			seperateLine.Draw();
		GUI.EndGroup();
	   	return -1;
	}
	
	public function UpdateData()
	{
		if( troopInfo ){
			owned.txt =  Datas.getArString("Common.Owned") +": " + troopInfo.owned;
		}
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
		super.SetScrollPos(pos, listHeight);
//		scrollPos = pos;
		if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
		{
			unitIcon.DrawTileByGraphics = false;
			l_Sale.drawTileByGraphics = false;
		}
		else
		{
			unitIcon.DrawTileByGraphics = true;
			l_Sale.drawTileByGraphics = true;
		}				
	}

}

