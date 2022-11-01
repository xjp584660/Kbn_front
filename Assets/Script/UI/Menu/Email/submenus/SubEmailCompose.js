class SubEmailCompose extends SubMenu
{
	public var composeObject:ComposeObj;
	
	public function Init()
	{
		composeObject.Init();
		btnBack.Init();
		btnBack.rect.height = 70;
//		frameTop.rect = Rect( 0, bgStartY - 2, frameTop.rect.width, frameTop.rect.height);
		
		btnBack.OnClick = handleBackBtn;
	}
	
	public function DrawItem()
	{
		composeObject.Draw();
		btnBack.Draw();
		
	}
	
	public function OnPop()
	{
		composeObject.clearKeyboard();
		super.OnPop();
	}
	
	public function Update()
	{
		super.Update();
		composeObject.Update();
	}
	
	public function DrawTitle()
	{
	//	GUI.Label(Rect(0, 0, titleBack.width, titleBack.height), titleBack);
		titleBack.Draw();
		DrawMiddleBg();
		//GUI.Label(Rect(0, bgStartY - 2, frameTop.width, frameTop.height), frameTop);
		
		frameTop.Draw();
	}
	
	public function OnPush(_param:Object)
	{
//		setDefautlFrame = true;
	
		super.OnPush(_param);
		
//		var arString:Object = Datas.instance().arStrings();
		btnBack.txt = Datas.getArString("Common.Back");
		
		bgStartY = 85;
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");//
	//	bgMiddleBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		
		//bgMiddleBodyPic.spt.edge = 2;
		
	//	bgMiddleBodyPic = TextureMgr.instance().LoadTexture("ui_bg_wood", TextureType.BACKGROUND);
//		frameTop.spt = TextureMgr.instance().BackgroundSpt();
//		frameTop.rect = frameTop.spt.GetTileRect("frame_metal_top");
//		frameTop.rect.y = 80;
//		frameTop.name = "frame_metal_top";
		
//		frameTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_bg_wood", TextureType.DECORATION);
//		frameTop.mystyle.border = new RectOffset(27, 27, 0, 0);
//		frameTop.rect.y = 80;
		
	//	titleBack = TextureMgr.instance().LoadTexture("bg_ui_second_layer", TextureType.BACKGROUND);
		titleBack = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_layer");
//		titleBack.rect = titleBack.spt.GetTileRect("bg_ui_second_layer");
		titleBack.rect.x = 0;
		titleBack.rect.y = 0;
		//titleBack.name = "bg_ui_second_layer";
		
		bgBottomBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottomnew");
		bgBottomBodyPic.rect.width = 640;
//		bgBottomBodyPic.rect = titleBack.spt.GetTileRect("tool bar_bottom");
		//bgBottomBodyPic.name = "tool bar_bottom";
		
		composeObject.setData(_param);
//		composeObject.setSeccessFunc(sendMailSuccess);
	}
	
	private function sendMailSuccess()
	{
//		EmailMenu.getInstance().PopSubMenu();
	}
	
	private function handleBackBtn()
	{
		EmailMenu.getInstance().PopSubMenu();
	}
}
