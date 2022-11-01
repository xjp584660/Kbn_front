class UnlockHeroMenu extends PopMenu
{
//	@SerializeField private var frameRect:Rect;
	
	@SerializeField private var heroIcon:Label;
	@SerializeField private var desc:Label;
	
//	@SerializeField private var titleIcon:Label;
//	@SerializeField private var yOffset:int;
	@SerializeField private var backImage:SimpleLabel;
	@SerializeField private var backFrame:SimpleLabel;
	@SerializeField private var darkImage:SimpleLabel;
	@SerializeField private var line:SimpleLabel;
	@SerializeField private var btnOK:Button;
	@SerializeField private var myTitle:Label;
	@SerializeField private var heroName:Label;
//	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	private var heroID:int;
	private var chapterID:int;
	var flg:boolean;
	
	public function Init():void
	{
		super.Init();

		desc.txt = Datas.getArString("Campaign.UnlockHero_Text");//"A new hero has been found!";
		myTitle.txt = Datas.getArString("Campaign.UnlockHero_Title");//"UNLOCK HERO";
		btnOK.txt = Datas.getArString("Common.OK_Button");//"OK";
		
		btnOK.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		btnOK.OnClick = handleBack;
		
//		titleIcon.setBackground("Event_mytiao",TextureType.DECORATION);
		
//		backImage.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_herobg_1");
		backFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_frame",TextureType.DECORATION);
		darkImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("Black_Gradients",TextureType.DECORATION);
		line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line",TextureType.DECORATION);
//		frameSimpleLabel.rect.x = frameRect.x;
//		frameSimpleLabel.rect.y = frameRect.y;
//		frameSimpleLabel.rect.width = frameRect.width;
//		frameSimpleLabel.rect.height = frameRect.height;
//		
//		repeatTimes = (frameRect.height - 15 - yOffset) / UI_BG_WOOD_WEN_HEIGHT+1;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		btnClose.OnClick = handleBack;
	}
	
	public function DrawItem()
	{
		desc.Draw();
		btnOK.Draw();
		myTitle.Draw();
		line.Draw();
		
		backFrame.Draw();
		backImage.Draw();
		heroIcon.Draw();
		darkImage.Draw();
		heroName.Draw();
	}
	
	function Update() 
	{
		//if(Input.GetMouseButtonDown(0))
		//{
		//	handleBack();
		//}
	}
	
//	function DrawBackground()
//	{
//		if(Event.current.type != EventType.Repaint)
//			return;
//		backImage.Draw();
//		GUI.BeginGroup(frameRect);
//			DrawMiddleBg(frameRect.width-20, frameRect.height-10, 10);
//			Graphics.DrawTexture(Rect(3, yOffset, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(frameRect.width - 3 - 23, yOffset, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
//			
//		GUI.EndGroup();
//		
//	}
	
//	public function DrawLastItem()
//	{
//		titleIcon.Draw();
//		myTitle.Draw();
//	}
	
	public function OnPush(param:Object)
	{
		SoundMgr.instance().PlayEffect("kbn_pve_newhero", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		var hash:HashObject = param as HashObject;
		if(hash == null)return;
		
		heroID = _Global.INT32(hash["heroID"]);
		
		chapterID = _Global.INT32(hash["chapterID"]);
		
		flg= hash["isWin"]!=null?_Global.GetBoolean(hash["isWin"]):false;
		
		var gdsHeroBasic:KBN.DataTable.HeroBasic = GameMain.GdsManager.GetGds.<KBN.GDS_HeroBasic>().GetItemById(heroID) as KBN.DataTable.HeroBasic;
		if(gdsHeroBasic == null)return;
		heroName.txt = Datas.getArString(gdsHeroBasic.NAME);//"Hero's name";
//		heroIcon.setBackground(gdsHeroBasic.ICON,TextureType.DECORATION);//"hero-head"
//		backFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_frame",TextureType.DECORATION);
		backImage.tile = TextureMgr.instance().GetHeroSpt().GetTile(gdsHeroBasic.HEADBACKGROUND_ICON);
	    heroIcon.tile = TextureMgr.instance().GetHeroSpt().GetTile(gdsHeroBasic.HEAD_ICON);
	    
	    desc.txt = String.Format(Datas.getArString("Campaign.UnlockHero_Text"), Datas.getArString(gdsHeroBasic.NAME));
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		//MenuMgr.getInstance().PushMenu("HidenBossMenu", null, "trans_zoomComp");
		if(chapterID > 0)
		{
			var hash:HashObject = new HashObject({"chapterID":chapterID,"isWin":flg});
			MenuMgr.getInstance().PushMenu("LevelupMenu", hash, "trans_zoomComp");
			KBN.PveController.instance().PushUnlockEliteChapterMsg(chapterID);
			flg=false;
		}
		
		if(flg)
		{
			KBN.PveController.instance().CheckUnlockNext();
			GameMain.instance().onPveResultMenuPopUp();
		}
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("UnlockHeroMenu");
	}
}