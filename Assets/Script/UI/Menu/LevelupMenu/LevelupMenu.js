class LevelupMenu extends PopMenu
{
	enum Menu_Type
	{
		MENU_TYPE_LEVELUP = 0,
		MENU_TYPE_CHAPTER_CLEAR
	};
	var reachLevel:SimpleLabel;
	var level:SimpleLabel;
	var titlebg:SimpleLabel;
	var line:SimpleLabel;
	var bntClaim:Button;
	var lev:int;
	private var menuType:Menu_Type;
	private var currentLevel : int = 0;
	
	public function Init()
	{
        if (KBN.FTEMgr.isFTERuning()) {
            LockRadio = false;
        }
        super.Init();
		title.txt = Datas.getArString("Common.LevelUp_title") ;
		reachLevel.txt = Datas.getArString("LevelUp.Header") ;
		bntClaim.txt = Datas.getArString("fortuna_gamble.win_claimButton");
		
		titlebg.mystyle.normal.background = TextureMgr.instance().LoadTexture("level_up_bg", TextureType.DECORATION);
		
		bntClaim.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PopMenu("");
			if(menuType == Menu_Type.MENU_TYPE_CHAPTER_CLEAR)
			{
				KBN.PveController.instance().CheckUnlockNext();
				GameMain.instance().onPveResultMenuPopUp();
				if(GameMain.instance().curSceneLev() == GameMain.CHAPTERMAP_SCENE_LEVEL)
				{
					GameMain.instance().loadLevel(GameMain.CAMPAIGNMAP_SCENE_LEVEL);
				}
				else if(GameMain.instance().curSceneLev() == GameMain.CAMPAIGNMAP_SCENE_LEVEL)
				{
					GameMain.instance().getCampaignMapController().CheckUnlockChapter();
				}
			}
			else if(menuType == Menu_Type.MENU_TYPE_LEVELUP)
			{
				var isRater:boolean = false;
				
				var arr:Array = GameMain.instance().levelsRate;
				var index:int = _Global.IndexOf(arr,lev);
				isRater = index != -1;
				
				MenuMgr.getInstance().PushMenu("LevelRewards", isRater, "trans_zoomComp");
				
				// Check PVE
				KBN.PveController.instance().CheckLevelUp();
				
				// Check Hero House
				if (HeroManager.Instance().Check(true) && currentLevel == HeroManager.Instance().GetHeroHouseOpenLevel())
				{
					MenuMgr.getInstance().PushMenu("HeroOpened", null, "trans_zoomComp");
				}
			}
		};
		btnClose.SetVisible(false);
	}
	public function OnPush(param:Object)
	{			
		super.OnPush(param);
		
		var hash:HashObject = param as HashObject;
		if(hash == null)
		{
			menuType = Menu_Type.MENU_TYPE_LEVELUP;
			var seed:Object = GameMain.instance().getSeed();
			currentLevel = _Global.INT32((param as Hashtable)["level"]);
			level.txt = Datas.getArString("Common.Level") + " "+( param as Hashtable)["level"] ;
			lev = _Global.INT32(( param as Hashtable)["level"]);
			
			title.txt = Datas.getArString("Common.LevelUp_title") ;
			reachLevel.txt = Datas.getArString("LevelUp.Header") ;
			bntClaim.txt = Datas.getArString("fortuna_gamble.win_claimButton");
		}
		else
		{
			menuType = Menu_Type.MENU_TYPE_CHAPTER_CLEAR;
			var chapterID:int = _Global.INT32(hash["chapterID"]);
			var gdsChapterItem:KBN.DataTable.PveChapter = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetItemById(chapterID) as KBN.DataTable.PveChapter;
			
			level.txt = String.Format(Datas.getArString("Campaign.ChapterClear_Text1"), Datas.getArString(gdsChapterItem.NAME));//"Chapter "+chapterID+" Clear!" ;
			
			title.txt = Datas.getArString("Campaign.ChapterClear_Title");//"CONGRATULATIONS!" ;
			reachLevel.txt = "" ;
			bntClaim.txt = Datas.getArString("Common.OK_Button");//"OK";
			SoundMgr.instance().PlayEffect("kbn_pve_clearchapter", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		}
		
	}
	
	function DrawItem()
	{
		titlebg.Draw();
		reachLevel.Draw();
		level.Draw();
//	    if( unlockList.GetItemsCnt() > 0 )
//	    {
//			unlock_bg.Draw();
//			unlock.Draw();
//		}
//		if( rewardList.GetItemsCnt() > 0 )	
//			reward_bg1.Draw();
//		if( rewardList.GetItemsCnt() > 5 )		
//			reward_bg2.Draw();
//		
//		rewards.Draw();
//		unlockList.Draw();
//		rewardList.Draw();
		line.Draw();
		bntClaim.Draw();
	}
	public function OnBackButton() : boolean
	{
		return true;
	}	
	
	
}

