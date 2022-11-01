
class	TileTroopItem extends	ListItem{
	public	var	l_Line:Label;
	public	var	generalLabel:Label;
	public	var	allianceLabel:Label;
	public	var	fromLabel:Label;
	public  var btnDefault:Button;
	
	private	var	data:Object;
	
	public	function	SetRowData(data:Object){
		this.data = data;
		
		btnDefault.OnClick = onSelected;
		btnDefault.clickParam = "view";
		btnDefault.rect = Rect(30, 20, rect.width-45, rect.height - 30);
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		var tileTroopInfo:Attack.TileTroopInfo = data as Attack.TileTroopInfo;

		var fromCityOrder:int = _Global.INT32(tileTroopInfo.fromCitySequence);//GameMain.instance().getCityOrderWithCityId(_Global.INT32(tileTroopInfo.fromCityId));	//getCurCityOrder();
//		var arStrings:Object = Datas.instance().arStrings();
		if(fromCityOrder<1 || fromCityOrder >CityQueue.instance().MaxReleasedCityCnt)
		{
			fromCityOrder =1;
		}
		if(tileTroopInfo.fromPlayerId == GameMain.singleton.getUserId())
		{
			generalLabel.txt = Datas.getArString("Common.General") + ": " + General.singleton.getKnightShowName(tileTroopInfo.general, fromCityOrder);
		}
		else
		{
			generalLabel.txt = Datas.getArString("Common.General") + ": " + General.getKnightNameByCityOrderAndName(tileTroopInfo.general, fromCityOrder);
		}
		//generalLabel.txt = Datas.getArString("Common.General") + ": " + General.singleton.getKnightShowName(tileTroopInfo.general, fromCityOrder);//Datas.getArString("Generals.GenName" + tileTroopInfo.general];//tileTroopInfo.general;
		allianceLabel.txt = Datas.getArString("Common.Player") + ": " + tileTroopInfo.alliance;
		fromLabel.txt = Datas.getArString("Common.From") + ": " + tileTroopInfo.from;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(tileTroopInfo.general,fromCityOrder ));
		//icon.tile.name = General.getGeneralTextureName(tileTroopInfo.general,fromCityOrder );
	//	icon.image = TextureMgr.instance().LoadTexture("gi" + tileTroopInfo.general, TextureType.ICON_GENERAL);//Resources.Load("Textures/UI/icon/icon_general/gi" + tileTroopInfo.general);
		
		if( tileTroopInfo.canRecall){
			
			btnSelect.SetDisabled(false);
			btnSelect.SetVisible(true);
			btnDefault.SetDisabled(false);
			btnDefault.SetVisible(true);		
		}else{
			btnSelect.SetDisabled(true);
			btnSelect.SetVisible(false);
			btnDefault.SetDisabled(true);
			btnDefault.SetVisible(false);	
		}
		
		//
		btnSelect.OnClick = onSelected;
	}
	protected function onSelected(cp:Object):void
	{
		if(handlerDelegate)
		{
			handlerDelegate.handleItemAction("",data);
		}
	}
	public	function	Draw(){
		GUI.BeginGroup(rect);
			var oldColor:Color = GUI.color;
			GUI.color = new Color(0, 0, 0, 0.4);	
			btnDefault.Draw();
			GUI.color = oldColor;
			l_Line.Draw();
			icon.Draw();
			generalLabel.Draw();
			allianceLabel.Draw();
			fromLabel.Draw();
			btnSelect.Draw();
		GUI.EndGroup();		
	}
}
