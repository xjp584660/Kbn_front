class ResourceItemObj extends UIObject
{
	public var btnBack:Button;
	public var labelName:Label;
	public var picIcon:Label;

	public var labelItemsName:Label;
	public var labelItemsValues:Label;
	
	public var frameBg:Label;
//	public var frameDecoration:Label;
	private var pathPic:String;
	
	function Init()
	{
		btnBack.Init();
//		if (KBN._Global.IsLargeResolution ()) 
//		{
//			btnBack.rect.width = 62;
//		} 
//		else if (KBN._Global.isIphoneX ()) 
//		{
//			btnBack.rect.width = 85;
//		}
//		else
//		{
//			btnBack.rect.width = 75;
//		}
//		btnBack.rect.height = 64;
//		
		labelName.Init();
		picIcon.Init();
		labelItemsName.Init();
		labelItemsValues.Init();
		
		frameBg.Init();
//		frameDecoration.Init();
		
	}

	private function handleBtn()
	{
//		NewCastleMenu.getInstance().overviewContent.popSubResource();
		var castleMenu:NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
		if( castleMenu ){
			castleMenu.overviewContent.popSubResource();
		}
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		frameBg.Draw();
//		frameDecoration.Draw();
		
		btnBack.Draw();
		btnBack.OnClick = handleBtn;
		
		labelName.Draw();
		picIcon.Draw();
		
		labelItemsName.Draw();
		labelItemsValues.Draw();
		GUI.EndGroup();		
	}
	
	function setData(data:Array, type:int)
	{
//		var arString:Object = Datas.instance().arStrings();
		if(type == 1 || type == 2 || type == 3 || type == 4)
		{
			labelItemsName.txt =	Datas.getArString("OpenPalace.BaseBuildingProduction") + "\n\n" +
									Datas.getArString("OpenPalace.UrbanPraefectBonus") + "\n\n" +
									Datas.getArString("OpenPalace.resbonus") + "\n\n" +
									Datas.getArString("OpenPalace.WildsBonus") + "\n\n" +
									Datas.getArString("OpenPalace.ItemBonus") + "\n\n" + 
									Datas.getArString("OpenPalace.OtherBonus") + "\n\n" +
									Datas.getArString("OpenPalace.TotalBonus") + "\n\n" +
									Datas.getArString("OpenPalace.TotalTimeReduction");
	
			labelItemsValues.txt = data[0] + "\n\n" +data[1] + "%\n\n" +data[2] + "%\n\n" +data[3] + "%\n\n" +data[4] + "%\n\n" +data[5] + "%\n\n" +data[6] + "%\n\n" +  data[7];
		}
		else
		{
			labelItemsName.txt =	Datas.getArString("OpenPalace.baseprod") + "\n\n" +
									Datas.getArString("MainChrome.TaxRate") + "\n\n" +
									Datas.getArString("OpenPalace.resbonus") + "\n\n" +
									Datas.getArString("Common.Population") + "\n\n" +
									Datas.getArString("ShowGoldToolTip.GeneralSalary")+ "\n\n" +
									Datas.getArString("OpenPalace.ItemBonus") + "\n\n" + 
									Datas.getArString("OpenPalace.OtherBonus") + "\n\n" +
									Datas.getArString("OpenPalace.TotalBonus") + "\n\n" +
									Datas.getArString("OpenPalace.TotalTimeReduction");
	
			labelItemsValues.txt = data[0] + "\n\n" +data[1] + "%\n\n" +data[2] + "%\n\n" +data[3] + "\n\n" + data[4] +" " + Datas.getArString("Generals.Ghr") + "\n\n" + data[5] + "\n\n" + data[6] + "%\n\n" +data[7]+ "%\n\n" +  data[8];
		}
		pathPic = "icon_rec" + type;
		
		picIcon.useTile = true;
		picIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(pathPic);
		//picIcon.tile.name = pathPic;
	//	picIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(pathPic, TextureType.ICON_ELSE);//Resources.Load(pathPic);
		
		labelName.SetFont(FontSize.Font_20,FontType.TREBUC);
		labelName.SetNormalTxtColor(FontColor.Title);
		labelName.txt = Datas.getArString("ResourceName."+_Global.ap + type);

	}
}