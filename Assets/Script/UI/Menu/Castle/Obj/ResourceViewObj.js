class ResourceViewObj extends UIObject
{
	public var iconFood:Label;
	public var iconWood:Label;
	public var iconSteel:Label;
	public var iconStone:Label;
	public var iconGold:Label;
	
	public var btnFood:Button;
	public var btnWood:Button;
	public var btnSteel:Button;
	public var btnStone:Button;
	public var btnGold:Button;
	public var _color:Color;
	
	public var arrowFood:Label;	
	public var arrowWood:Label;	
	public var arrowSteel:Label;	
	public var arrowStone:Label;
	public var arrowGold:Label;	

	public var frameBg:Label;
//	public var frameDecoration:Label;
	public var frameUp:Label;
	public var labelType:Label;
	public var labelCurPro:Label;
	public var labelUpkeep:Label;
	
	public var foodCur:Label;
	public var foodUpkeep:Label;
	public var woodCur:Label;
	public var woodUpkeep:Label;	
	public var stoneCur:Label;
	public var stoneUpkeep:Label;
	public var steelCur:Label;
	public var steelUpkeep:Label;
	public var goldCur:Label;
	public var goldUpkeep:Label;
	
	public var l_line1:Label;
	public var l_line2:Label;
	public var l_line3:Label;
	public var l_line4:Label;
	public var l_line5:Label;
			
	function Init()
	{
		foodCur.Init();
		foodUpkeep.Init();
		woodCur.Init();
		woodUpkeep.Init();	
		stoneCur.Init();
		stoneUpkeep.Init();
		steelCur.Init();
		steelUpkeep.Init();	
	
		btnFood.Init();
		btnWood.Init();
		btnSteel.Init();
		btnStone.Init();
			
		iconFood.Init();
		iconWood.Init();
		iconSteel.Init();
		iconStone.Init();
	
		arrowFood.Init();	
		arrowWood.Init();	
		arrowSteel.Init();	
		arrowStone.Init();			
		
		frameBg.Init();
//		frameDecoration.Init();
		frameUp.Init();
		labelType.Init();
		labelCurPro.Init();
		labelUpkeep.Init();
	}
	
	private function handleFood()
	{
//		NewCastleMenu.getInstance().overviewContent.pushSubResource(1);
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.pushSubResource(1);
		}
	}
	
	private function handleWood()
	{
//		NewCastleMenu.getInstance().overviewContent.pushSubResource(2);
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.pushSubResource(2);
		}
	}
	
	private function handleStone()
	{	
//		NewCastleMenu.getInstance().overviewContent.pushSubResource(3);
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.pushSubResource(3);
		}
	}
	
	private function handleSteel()
	{
//		NewCastleMenu.getInstance().overviewContent.pushSubResource(4);
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.pushSubResource(4);
		}
	}
	private function handleGold()
	{
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.pushSubResource(0);
		}
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		frameBg.Draw();
		frameUp.Draw();
//		frameDecoration.Draw();	

		iconFood.Draw();
		iconWood.Draw();
		iconSteel.Draw();
		iconStone.Draw();
		iconGold.Draw();

		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.4);				
		btnFood.Draw();
		btnWood.Draw();
		btnSteel.Draw();
		btnStone.Draw();
		btnGold.Draw();
		GUI.color = oldColor;
		
		arrowFood.Draw();	
		arrowWood.Draw();	
		arrowSteel.Draw();	
		arrowStone.Draw();			
		arrowGold.Draw();

		btnStone.OnClick = handleStone;
		btnSteel.OnClick = handleSteel;	
		btnWood.OnClick = handleWood;		
		btnFood.OnClick = handleFood;
		btnGold.OnClick = handleGold;	

		labelType.Draw();
		labelCurPro.Draw();
		labelUpkeep.Draw();
		
		foodCur.Draw();
		foodUpkeep.Draw();
		woodCur.Draw();
		woodUpkeep.Draw();	
		stoneCur.Draw();
		stoneUpkeep.Draw();
		steelCur.Draw();
		steelUpkeep.Draw();	
		goldCur.Draw();
		goldUpkeep.Draw();
		
		l_line1.Draw();
		l_line2.Draw();
		l_line3.Draw();
		l_line4.Draw();
		l_line5.Draw();
		GUI.EndGroup();	
	}
	
	public function setData(_curPro:Array, _upkeep:long):void
	{
//		var arString:Object = Datas.instance().arStrings();
		
		l_line1.setBackground("between line_list_small",TextureType.DECORATION);
		l_line2.setBackground("between line_list_small",TextureType.DECORATION);
		l_line3.setBackground("between line_list_small",TextureType.DECORATION);
		l_line4.setBackground("between line_list_small",TextureType.DECORATION);
		l_line5.setBackground("between line_list_small",TextureType.DECORATION);
		
		labelType.SetFont(FontSize.Font_20,FontType.TREBUC);
		labelType.SetNormalTxtColor(FontColor.Title);
		labelType.txt = Datas.getArString("Common.Type");
		labelCurPro.SetFont(FontSize.Font_20,FontType.TREBUC);
		labelCurPro.SetNormalTxtColor(FontColor.Title);
		labelCurPro.txt = Datas.getArString("Common.CurrentProduction");
		labelUpkeep.SetFont(FontSize.Font_20,FontType.TREBUC);
		labelUpkeep.SetNormalTxtColor(FontColor.Title);
		labelUpkeep.txt = Datas.getArString("Common.UpkeepCost");	
		var proTemp:long[] = _curPro.ToBuiltin(long);
		var curProduction:long = proTemp[1] + _upkeep;
		foodCur.txt = curProduction + "/" + Datas.getArString("TimeStr.timeHr");
		woodCur.txt = _curPro[2] + "/" + Datas.getArString("TimeStr.timeHr");
		stoneCur.txt = _curPro[3] + "/" + Datas.getArString("TimeStr.timeHr");
		steelCur.txt = _curPro[4] + "/" + Datas.getArString("TimeStr.timeHr");
		goldCur.txt = _curPro[0] + "/" + Datas.getArString("TimeStr.timeHr");
		
		
		if(curProduction < _upkeep)
		{
			foodUpkeep.mystyle.normal.textColor = Color.red;
		}
		else
		{
			foodUpkeep.mystyle.normal.textColor = _color;
		}
		
		foodUpkeep.txt = _upkeep + "/" + Datas.getArString("TimeStr.timeHr");
		woodUpkeep.txt = "0";
		stoneUpkeep.txt = "0";
		steelUpkeep.txt = "0";
		var currentCityId:int = GameMain.instance().getCurCityId();
		goldUpkeep.txt = General.instance().getLeadersalarySum(currentCityId) + "/" + Datas.getArString("TimeStr.timeHr");
	}	
}