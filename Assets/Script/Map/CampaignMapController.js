#pragma strict

class CampaignMapController extends SlotBuildController
{
	public var MAPWIDTH:float = 700;
	public var MAPHEIGHT:float = 1020;
	private	var	cameraMoveRange:Rect;
	public	var prefChapter:GameObject; 
	public	var prefBoss:GameObject;
	public	var prefAllianceBoss:GameObject;
	private static var MIN_BOSS_SLOT:int = 101;
	private static var MAX_BOSS_SLOT:int = 110;
	private static var ALLIANCE_BOSS_SLOT:int = 401;
	private static var MIN_CHAPTER_SLOT:int = 1;
	private static var MAX_CHAPTER_SLOT:int = 12;
	private static var MIN_CHAPTER_SLOT_ELIT:int = 61;
	private static var MAX_CHAPTER_SLOT_ELIT:int = 72;
	private static var RANK_SLOT:int = 200;
	private static var TOTALSTAR_SLOT:int = 201;
	private static var ENERGYBOTTLE_SLOT:int = 202;
	private static var PVEBUFF_SLOT:int = 203;
	private static var MAIL_SLOT:int=204;
	private static var MAIL_buff:int=204;
	private static var MARCHSPEEDUP_SLOT:int = 210;
	private static var PREFIX_SLOT:String = "PosSlot_";
	
	private static var BOSSCOUNT:String = "BossCount";
	private static var BOSSSLOT:String = "BossSlot";
	private var lastSceneLevel:int;
	private var m_UnlockChapterId:int;
	private var bossScript:CampaignBoss;
	private static var MAX_CHAPTER_ID = 99;
	private var m_levelIDOfNextBoss : int;
	private var m_nextLevelIDOfNextBoss : int;
	private var m_createBossFromScratch : boolean;
	private var m_createNewBossToReplaceOnMenuPopUp : boolean;
	
	private var m_lastUpdateTime : float;
	private var m_widgets : CampaignWidgets;
	//cache all chapter,  <chapterid, GameObject>
	private var m_chapterGOCache : Dictionary.<int,GameObject> = new Dictionary.<int,GameObject>();
	private var USE_OTA_DOWNLOAD_TO_CREATE_CHAPTER : boolean = false;
	
	// Scene transition trouble-shooting
	private var m_isTransitingToChapterMap : boolean;
	private var m_dicBossSlotToBossId:Dictionary.<String,int> = new Dictionary.<String,int> ();
	
	
	public function Awake()
	{
		super.Awake();
		
		curCamera = gameObject.Find("CampaignMapCamera").GetComponent.<Camera>();
		viewRect = curCamera.pixelRect;
		Init();
		GameMain.instance().onLevelLoaded(GameMain.CAMPAIGNMAP_SCENE_LEVEL, this);
	}
	
	public	function Update () 
	{
		super.Update();
		
		if( m_widgets )
		{
			m_widgets.updatePositions();
		}
			
		if( Time.time - m_lastUpdateTime > 1.0 ) // Update on a one-second basis
		{
			m_lastUpdateTime = Time.time;
			if( m_widgets )
			{
				var pveTotalData: KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo();
				var samina : int = KBN.PveController.instance().GetSimina();
				m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STAMINA_POTION,
										samina,
										pveTotalData.maxEnergy );
			}
			checkChapterAttackState();
		}
		
		// OTA download progress stuff
		if( USE_OTA_DOWNLOAD_TO_CREATE_CHAPTER )
		{
			if( m_curProgressObj["progress"] == null )
				m_curProgressObj["progress"] = new HashObject();
			m_curProgressObj["progress"].Value = "" + m_curProgress;
			if( m_destProgress == 100 )
			{
				m_curProgress = m_destProgress;
			}
			else
			{
				if( m_curProgress < m_destProgress )
				{
					var diff = m_destProgress - m_curProgress;
					var step = diff / 5;
					if( step < 2 )
						step = 2;
					m_curProgress += step;
				}
				if( m_curProgress > m_destProgress )
				{
					m_curProgress = m_destProgress;
				}
			}
		}
	}
	
	public function repaint()
	{
		
	}
	
	private function initWidgets( pveTotalData : KBN.PveTotalData )
	{
		m_widgets = new CampaignWidgets();
		
		// Leaderboard
		var rankSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Rank", Constant.AnimationSpriteType.Campaign);
		
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_LEADERBOARD,
								Instantiate( rankSpr ),
								curCamera,
								transform,
								""+RANK_SLOT );
		rankSpr = null;

		var mailSpr:GameObject = TextureMgr.instance().loadAnimationSprite("button_icon_Mail", Constant.AnimationSpriteType.Campaign);
		
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_MAIL,
								Instantiate( mailSpr ),
								curCamera,
								transform,
								""+MAIL_SLOT);
		mailSpr = null;
		// Hidden boss
		var totalStarSpr:GameObject = TextureMgr.instance().loadAnimationSprite("TotalStars", Constant.AnimationSpriteType.Campaign);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_HIDDEN_BOSS,
								Instantiate( totalStarSpr ),
								curCamera,
								transform,
								""+TOTALSTAR_SLOT );
		totalStarSpr = null;
		// Stamina potion
		var energyBottleSpr:GameObject = TextureMgr.instance().loadAnimationSprite("EnergyBottle", Constant.AnimationSpriteType.Campaign);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_STAMINA_POTION,
								Instantiate( energyBottleSpr ),
								curCamera,
								transform,
								""+ENERGYBOTTLE_SLOT );
		energyBottleObj = GameObject.Find("" + ENERGYBOTTLE_SLOT);
		energyBottleSpr = null;
		m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STAMINA_POTION,
								pveTotalData.samina,
								pveTotalData.maxEnergy );
								
		var pveBuffSpr:GameObject = TextureMgr.instance().loadAnimationSprite("PveBuff", Constant.AnimationSpriteType.Campaign);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_PVE_BUFF,
								Instantiate( pveBuffSpr ),
								curCamera,
								transform,
								""+PVEBUFF_SLOT );
		pveBuffSpr = null;
								
		// Release unused assets
		rankSpr = null;
		totalStarSpr = null;
		energyBottleSpr = null;
		Resources.UnloadUnusedAssets();
	}
	
	public function Init()
	{
		KBN.Game.Event.RegisterHandler(KBN.EventId.CampaignMode, OnCampaignModeChanged);
		m_lastUpdateTime = 0;
		//add chapter
		KBN.Game.Event.Fire(this, new KBN.CampaignModeEventArgs(KBN.PveController.instance().PveType));
		InitAllianceBoss();
		var pveTotalData: KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo();
		initWidgets( pveTotalData );
		disableAllAttackWarnings();
		m_createNewBossToReplaceOnMenuPopUp = false;
		TextureMgr.instance().unloadUnusedAssets();
	}
	
	public function InitChapters(type:int)
	{
		m_chapterGOCache.Clear();
		var myChapterDataList :Dictionary.<int, KBN.PveChapterData>  = KBN.PveController.instance().GetPveChapterDataList();
		var gdsChapterList :Dictionary.<String, KBN.DataTable.IDataItem> = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetItemDictionary();
		for(var key in gdsChapterList.Keys)
		{
			var gdsItem:KBN.DataTable.PveChapter = gdsChapterList[key] as KBN.DataTable.PveChapter;
			if(gdsItem != null && gdsItem.ENABLED && gdsItem.TYPE == type)
			{	
				var iKey = _Global.INT32(key);
				var bUnlock:boolean = KBN.PveController.instance().IsChapterUnlock(gdsItem.ID);
				var curStar:int = myChapterDataList.ContainsKey(iKey) ? myChapterDataList[iKey].curStar:0;
				var totalStar:int = myChapterDataList.ContainsKey(iKey) ? myChapterDataList[iKey].totalStar:0;
				if(gdsItem.SLOT_ID < MIN_BOSS_SLOT)
				{
					AddChapter(gdsItem.SLOT_ID,gdsItem.ID,curStar,totalStar,bUnlock);
				}
			}
		}
	}
	
	public function InitAllianceBoss()
	{
		var gdsChapterList :Dictionary.<String, KBN.DataTable.IDataItem> = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetItemDictionary();
		for(var key in gdsChapterList.Keys)
		{
			var gdsItem:KBN.DataTable.PveChapter = gdsChapterList[key] as KBN.DataTable.PveChapter;
			if(gdsItem.TYPE == Constant.PveType.ALLIANCEBOSS)
			{
				AddAllianceBoss(gdsItem.SLOT_ID, gdsItem.ID, gdsItem.NAME);
			}
		}
	}
	
	public function DeleteAllChapters()
	{
		for(var i:int = MIN_CHAPTER_SLOT;i<=MAX_CHAPTER_SLOT;i++)
		{
			var normalChapterObj:GameObject = gameObject.Find(i.ToString());
			if(normalChapterObj != null)
			{
				Destroy(normalChapterObj);
			}
		}
		for(var j:int = MIN_CHAPTER_SLOT_ELIT;j<=MAX_CHAPTER_SLOT_ELIT;j++)
		{
			var eliteChapterObj:GameObject = gameObject.Find(j.ToString());
			if(eliteChapterObj != null)
			{
				Destroy(eliteChapterObj);
			}
		}
	}
	
	private function OnCampaignModeChanged(Sender:Object, e:GameFramework.GameEventArgs)
	{
		var args:KBN.CampaignModeEventArgs  = e as KBN.CampaignModeEventArgs;
		DeleteAllChapters();
		InitChapters(args.Type);
		CheckUnlockChapter();
		UpdateAllChapterStarNumber();
		disableAllAttackWarnings();
	}
	
	public function SetLastSceneLevel(level:int)
	{
		lastSceneLevel = level;
	}
	
	public function GetBackToSceneLevel():int
	{
		if(lastSceneLevel >= KBN.GameMain.CITY_SCENCE_LEVEL && lastSceneLevel <= KBN.GameMain.WORLD_SCENCE_LEVEL)
		{
			return lastSceneLevel;
		}
		else
		{
			return KBN.GameMain.CITY_SCENCE_LEVEL;
		}
	}
	
	public function InitAllBoss()
	{
		var myHiddenBossDataList :Dictionary.<int, KBN.HidenBossInfo>  = KBN.PveController.instance().GetHidenBossList();
		if(myHiddenBossDataList.Count == 0)
		{
			ClearBossData();
		}
		else
		{
			var oldCount:int = m_dicBossSlotToBossId.Count;
			var curCount:int = myHiddenBossDataList.Count;
			if(oldCount > curCount)
			{
				ClearBossData();
			}
			
			var newHiddenBossCount:int = 0;
			if(GameMain.instance().IsPveBossOpened())
			{
				for ( var key in myHiddenBossDataList.Keys )
				{
				 	var bossItem:KBN.HidenBossInfo = myHiddenBossDataList[key] as KBN.HidenBossInfo;
				 	var curTime:long = GameMain.unixtime();
				 	var leftTime:long = bossItem.endTime - curTime;
				 	if(bossItem != null && (leftTime > 0 || (bossItem.type == Constant.PveType.SOURCEBOSS && bossItem.curHP > 0)))
				 	{
				 		DeleteOldBossWithSameChapterId(bossItem.curLevelID);
				 		var slotId:int = 0;
				 		if( !IsBossExisted(bossItem.curLevelID))
					 	{
					 		if(bossItem.type==2)
					 		{
					 			newHiddenBossCount ++;
					 		}
					 		slotId = GetValidSlotIdForBoss(bossItem.curLevelID);
					 	}
					 	else
					 	{
					 		slotId = GetSlotIdFromBossId(bossItem.curLevelID);
					 	}
					 	
						AddBoss(slotId,bossItem.chapterID,bossItem.chapterIcon,bossItem.endTime,bossItem.curHP,bossItem.totalHP,bossItem.type);
				 		
					}
				}
			}
//			m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_BOSSES,
//									newHiddenBossCount, 0 );
		}
	}
	
	// bossId is the chapterId in pvechapter.txt
	public function AddBoss(slotId:int, bossId:int, iconName:String,endTime:long, leftHp:long,totalHp:long,bossType:int)
	{
		var emptyTransform:Transform = transform.Find(PREFIX_SLOT + slotId);
		if( emptyTransform == null )
		{
			return null;
		}
		var oldBossTrans:Transform = transform.Find("" + slotId);
		if(oldBossTrans != null)
		{
			Destroy(oldBossTrans.gameObject);
		}
		var	addObject:GameObject = InstantiateBoss(bossId,slotId,iconName,endTime,leftHp,totalHp,bossType);
		
		if(addObject == null)
		{
			return;
		}
		AddBossToSlot(addObject, slotId, emptyTransform.position);
	}
	
	public function AddAllianceBoss(slotId:int, chapterId:int, name:String)
	{
		if(KBN.AllianceBossController.instance().eventEndTime == 0)
			return;
		var emptyTransform:Transform = transform.Find(PREFIX_SLOT + slotId);
		if( emptyTransform == null )
		{
			return;
		}
		var	addObject:GameObject = InstantiateAllianceBoss(chapterId, name);
		if(addObject == null)
		{
			return;
		}
		AddChapterToSlot(addObject, slotId, emptyTransform.position);
	}
	
	public function UpdateAllianceBossSlot(isShow:boolean)
	{
		var allianceBossBaseTrans:Transform = null;
		var allianceBossTrans:Transform = null;
		var gdsItem:KBN.DataTable.PveChapter = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetChapterItemFromSlotId(ALLIANCE_BOSS_SLOT);
		if(isShow)
		{
			allianceBossBaseTrans = transform.Find(gdsItem.SLOT_ID+"");
			if( allianceBossBaseTrans == null )
				return;
			allianceBossTrans = allianceBossBaseTrans.Find("AllianceBoss");
			if(allianceBossTrans == null)
				AddAllianceBoss(gdsItem.SLOT_ID, gdsItem.ID, gdsItem.NAME);
		}
		else
		{
			allianceBossBaseTrans = transform.Find(gdsItem.SLOT_ID+"");
			if( allianceBossBaseTrans == null )
				return;
			allianceBossTrans = allianceBossBaseTrans.Find("AllianceBoss");
			if(allianceBossTrans != null)
			{
				Destroy(allianceBossTrans.gameObject);
			}
		}
	}
	
	public function AddChapter(slotId:int, chapterId:int,curStarNumber:int,totalStarNumber:int,bUnlocked:boolean)
	{
		var emptyTransform:Transform = transform.Find(PREFIX_SLOT + slotId);
		if( emptyTransform == null )
		{
			return;
		}
		var addObject: GameObject = InstantiateChapter(chapterId, curStarNumber, totalStarNumber, bUnlocked, slotId);
		if(addObject == null)
		{
			return;
		}
		AddChapterToSlot(addObject, slotId, emptyTransform.position);
		m_chapterGOCache.Add( chapterId,addObject );
	}
	
	protected function AddChapterToSlot( child:GameObject, slotId:int, position:Vector3 )
	{
		child.SetActiveRecursively( gameObject.active );
		
		child.transform.position = position;
		child.transform.parent = transform;
		child.name = "" + slotId;
	}
	
	protected function AddBossToSlot(child:GameObject, slotId:int, position:Vector3)
	{
		child.SetActiveRecursively( gameObject.active );
		
		child.transform.position = position;
		child.transform.parent = transform;
		child.name = "" + slotId;
	}
	
	public function InstantiateBoss(bossId:int,slotId:int,iconNam:String,endTime:long,leftHp:long,totalHp:long,bossType:int):GameObject
	{
		var	gObj:GameObject = null;
		gObj = Instantiate(prefBoss);
		
		// add boss
		var bossSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(iconNam, Constant.AnimationSpriteType.BossIcon);
		if(bossSprTmp != null)
		{
			var bossSpr:GameObject = Instantiate(bossSprTmp);
			//bossSpr.AddComponent(PveSourceBossIconAnimCrl);
			bossSpr.transform.position = gObj.transform.position;
			bossSpr.name = "ChapterBoss_" + bossId;
			bossSpr.transform.parent = gObj.transform;
			bossSpr.transform.localPosition = new Vector3(0, 0, 0);
			bossSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
			bossSpr.transform.localScale = new Vector3(1, 1, 1);
			
			//add box collider
			bossSpr.AddComponent(BoxCollider);
			
			//add progress bar
			AddProgressObj(bossSpr,endTime);
	
			bossScript = gObj.GetComponent("CampaignBoss");
			bossScript.Init(bossId,slotId,endTime,leftHp,totalHp,bossType);
			
		}
		return gObj;
	}
	
	private function disableAllAttackWarnings()
	{
		for(var key in m_chapterGOCache.Keys)
		{
			setAttackWarningEnabled(key,m_chapterGOCache[key],false);
		}
	}
	
	private function setAttackWarningEnabled( chapterId:int, go : GameObject, enabled : boolean )
	{
		var chapterShieldTrans:Transform = go.transform.Find("Chapter_" + chapterId);
		if(chapterShieldTrans != null)
		{
			var warningGO : GameObject = chapterShieldTrans.Find("ChapterAttackWarning").gameObject;
			if( warningGO )
			{
				warningGO.SetActive( enabled );
			}
		}
	}
	
	private function checkChapterAttackState()
	{
		disableAllAttackWarnings();
		var march : KBN.PveMarchData = KBN.PveController.instance().GetPveMarchInfo();
		if( march.levelID != -1 )
		{
			var endTime : ulong = march.marchEndTime;
			var now : ulong = GameMain.unixtime();
			if( endTime > now )
			{
				for(var key in m_chapterGOCache.Keys)
				{
					if(key == march.levelID / 1000000)
					{
						setAttackWarningEnabled(key,m_chapterGOCache[key],true);
						break;
					}
				}
		  	}
		}
	}
	private function InstantiateAllianceBoss(chapterId:int, name:String):GameObject
	{	var	gObj:GameObject = null;
		gObj = Instantiate(prefAllianceBoss);
		
		var allianceBossSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("AllianceBoss",
				Constant.AnimationSpriteType.Campaign);
		if(allianceBossSprTmp != null)
		{
			var allianceBossSpr:GameObject = Instantiate(allianceBossSprTmp);
			allianceBossSprTmp = null;
			allianceBossSpr.name = "AllianceBoss";
			allianceBossSpr.transform.position = gObj.transform.position;
			allianceBossSpr.transform.parent = gObj.transform;
			allianceBossSpr.transform.localPosition = new Vector3(0, 1, 0);
			allianceBossSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
			allianceBossSpr.transform.localScale = new Vector3(1, 1, 1);
			//add box collider
			allianceBossSpr.AddComponent(BoxCollider);
			
//			var tm:TextMesh = allianceBossSpr.transform.Find("NameObj").Find("name").gameObject.GetComponent(TextMesh) as TextMesh;
//			tm.text = Datas.getArString(name);
		}
		else
		{
			GameObject.Destroy(gObj);
			gObj = null;
			Debug.Log("this chapter has no sprite, chapterId : " + chapterId);
			return null;
		}
	
		return gObj;
	}
	
	public function InstantiateChapter(chapterId: int, myStarNumber: int, totalStarNumber: int, bUnlocked: boolean, slotId: int):GameObject
	{
		var	gObj:GameObject = null;
		gObj = Instantiate(prefChapter);
		
		if(bUnlocked)
		{
			/* add chapter*/
			var chapterSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("chapter_"+chapterId,
					Constant.AnimationSpriteType.Campaign);
			if(chapterSprTmp != null)
			{
				var chapterSpr:GameObject = Instantiate(chapterSprTmp);
				chapterSprTmp = null;
				chapterSpr.transform.position = gObj.transform.position;
				chapterSpr.name = "Chapter_" + chapterId;
				chapterSpr.transform.parent = gObj.transform;
				chapterSpr.transform.localPosition = new Vector3(0, 0, 0);
				chapterSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
				chapterSpr.transform.localScale = new Vector3(1, 1, 1);
				/*add box collider*/
				chapterSpr.AddComponent(BoxCollider);
			}
			else
			{
				GameObject.Destroy(gObj);
				gObj = null;			
				Debug.Log("this chapter has no sprite, chapterId : " + chapterId);
				return gObj;
			}
			
			//add star
			var starObj:GameObject = gObj.transform.Find("star").gameObject;
			AddStarObj(starObj);
			AddStarNumberObj(gObj);
			AddLevelNameObj(gObj, slotId);
			SetChapterStarNumber(gObj,myStarNumber, totalStarNumber);
			starObj.transform.localPosition.y = 0.1;
			//add beAttacked
		}
		else
		{
			// add locked chapter
			var lockedChapterSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("Chapter_Locked", Constant.AnimationSpriteType.Campaign);
			if(lockedChapterSprTmp != null)
			{
				var lockedChapterSpr:GameObject = Instantiate(lockedChapterSprTmp);
				lockedChapterSprTmp = null;
				lockedChapterSpr.transform.position = gObj.transform.position;
				lockedChapterSpr.name = "LockedChapter";
				lockedChapterSpr.transform.parent = gObj.transform;
				lockedChapterSpr.transform.localPosition = new Vector3(0, 0, 0);
				lockedChapterSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
				lockedChapterSpr.transform.localScale = new Vector3(1, 1, 1);
				lockedChapterSpr.AddComponent(BoxCollider);
			}
			else
			{
				GameObject.Destroy(gObj);
				gObj = null;			
				Debug.Log("this chapter has no sprite, chapterId : " + chapterId);
				return gObj;
			}
		}
		return gObj;
	}
	
	private function AddStarObj(obj:GameObject)
	{
		var starSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("star", Constant.AnimationSpriteType.Campaign);
		if(starSprTmp != null)
		{
			var starSpr:GameObject = Instantiate(starSprTmp);
			starSprTmp = null;
			starSpr.transform.position = obj.transform.position;
			starSpr.name = "star";
			starSpr.transform.parent = obj.transform;
			starSpr.transform.localPosition = new Vector3(0, 0, 0);
			starSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
			starSpr.transform.localScale = new Vector3(1, 1, 1);			
		}
	}

	/*显示战役名字信息*/
	private function AddLevelNameObj(obj: GameObject, id: int)
	{
		var NameObjTmp: GameObject = TextureMgr.instance().loadAnimationSprite("PveLevelInfo", Constant.AnimationSpriteType.Campaign);
		if (NameObjTmp != null) {
			var Nameobj: GameObject = Instantiate(NameObjTmp);
			NameObjTmp = null;
			Nameobj.transform.position = obj.transform.position;
			Nameobj.name = "Nameobj";
			Nameobj.transform.parent = obj.transform;
			Nameobj.transform.localPosition = new Vector3(-0.5f, 0.1f, -0.1f);
			Nameobj.transform.localScale = new Vector3(1, 1, 1);

			var count: int = id;
			if (count >= 60)
				count = id - 60;
			var numberTrans: Transform = Nameobj.transform.Find("nameInfo");
			if (numberTrans != null) {
				var textMesh: TextMesh = numberTrans.gameObject.GetComponent(TextMesh);
				textMesh.text = "Chapter " + count;
				textMesh.color = Color.white;
			}
		}
	}


	private function AddStarNumberObj(parentObj:GameObject)
	{
		var starNumberObjTmp:GameObject = TextureMgr.instance().loadAnimationSprite("starNumberObj", Constant.AnimationSpriteType.Campaign);
		if(starNumberObjTmp != null)
		{
			var starNumberObj:GameObject = Instantiate(starNumberObjTmp);
			starNumberObjTmp = null;
			starNumberObj.transform.position = parentObj.transform.position;
			starNumberObj.name = "starNumberObj";
			starNumberObj.transform.parent = parentObj.transform;
			starNumberObj.transform.localPosition = new Vector3(-0.2, 0.1, 0.5);
//			starNumberObj.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
			starNumberObj.transform.localScale = new Vector3(1, 1, 1);			
		}
	}
	
	private function AddProgressObj(obj:GameObject,endTime:long)
	{
		var progressBarSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("BossProgressBar", Constant.AnimationSpriteType.Campaign);
		if(progressBarSprTmp != null)
		{
			var progressBarSpr:GameObject = Instantiate(progressBarSprTmp);
			progressBarSprTmp = null;
			progressBarSpr.transform.position = obj.transform.position;
			progressBarSpr.name = "BossProgressBar";
			progressBarSpr.transform.parent = obj.transform;
			progressBarSpr.transform.localPosition = new Vector3(-0.14, -0.46, 0);
			progressBarSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			progressBarSpr.transform.localScale = new Vector3(1, 1, 1);			
		}
		
		//set left time
		SetLeftTime(progressBarSpr,endTime);
		
	}
	
	public function isTransitingToChapterMap()
	{
		return m_isTransitingToChapterMap;
	}
	
	var scourceBossSlotId : int = -1;
	public function onPveResultMenuPopUp()
	{	
		if( m_createNewBossToReplaceOnMenuPopUp )
		{
			m_createNewBossToReplaceOnMenuPopUp = false;
			var slotId:int = -1;
			var curChapterID:int = m_levelIDOfNextBoss/1000000;
			var hidenData:KBN.HidenBossInfo = KBN.PveController.instance().GetHidenBossItemData(curChapterID) as KBN.HidenBossInfo;
			if(hidenData != null)
			{
				if(hidenData.type == Constant.PveType.SOURCEBOSS)
				{
					slotId = GetValidSlotIdForBoss(m_levelIDOfNextBoss);
					scourceBossSlotId = slotId;
				}
				else
				{
					slotId = GetSlotIdFromBossId( m_levelIDOfNextBoss );
				}
			}
			else
			{
				slotId = GetSlotIdFromBossId( m_levelIDOfNextBoss );
			}
			var trans:Transform = transform.Find(PREFIX_SLOT + slotId);
			if(trans != null)
			{
				CreateAnimation( "UnlockBoss", Constant.AnimationSpriteType.CampaignAnimation,
								trans, new Vector3(0,1,1), new Quaternion(0, 0, 0, 0));
			}
		}
	}
	
	public function UnlockBoss_Step1_Replace(curLevelId:int,nextLevelId:int)
	{
		m_createNewBossToReplaceOnMenuPopUp = true;
		m_createBossFromScratch = false;
		m_levelIDOfNextBoss = curLevelId;
		m_nextLevelIDOfNextBoss = nextLevelId;
		// Destory the old one
		var slotId:int = GetSlotIdFromBossId(curLevelId);
		var oldBossTrans:Transform = transform.Find(""+slotId);
		if(oldBossTrans != null)
		{
			Destroy(oldBossTrans.gameObject);
		}
		
	}
	
	public function UnlockBoss_Step1_FromScratch()
	{
		m_createBossFromScratch = true;
		var nextBossInfo: KBN.HidenBossInfo = KBN.PveController.instance().nextBossInfo;
		var slotId:int = -1;
		if(IsBossExisted(nextBossInfo.curLevelID))  
		{
			slotId = GetSlotIdFromBossId(nextBossInfo.curLevelID);
		}
		else
		{
			slotId = GetValidSlotIdForBoss(nextBossInfo.curLevelID);
		}
		nextBossInfo.slotID = slotId;
		var trans:Transform = transform.Find(PREFIX_SLOT + slotId);
		if(trans != null)
		{
			CreateAnimation( "UnlockBoss", Constant.AnimationSpriteType.CampaignAnimation,
							trans, new Vector3(0,1,1), new Quaternion(0, 0, 0, 0) );
		}
	}
	// This function will be called by the "unlock boss" animation
	public function UnlockBoss_Step2()
	{
		if( m_createBossFromScratch ) // This is the first time the boss is created on this spot
		{
			var nextBossInfo: KBN.HidenBossInfo = KBN.PveController.instance().nextBossInfo;
			if(nextBossInfo == null) return;
			AddBoss(nextBossInfo.slotID,nextBossInfo.chapterID,nextBossInfo.chapterIcon,nextBossInfo.endTime,nextBossInfo.curHP,nextBossInfo.totalHP,nextBossInfo.type);
			KBN.PveController.instance().nextBossInfo = null;
//			m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_BOSSES,m_widgets.NewBossCount+1, 0 );
		}
		else // Create a new boss to replace the old one on the spot
		{
			var slotId:int = -1;
			var curChapterID:int = m_levelIDOfNextBoss/1000000;
			var hidenData:KBN.HidenBossInfo = KBN.PveController.instance().GetHidenBossItemData(curChapterID) as KBN.HidenBossInfo;
			if(hidenData != null)
			{
				if(hidenData.type == Constant.PveType.SOURCEBOSS)
				{
					//slotId = GetValidSlotIdForBoss(m_levelIDOfNextBoss);
					slotId = scourceBossSlotId;
				}
				else
				{
					slotId = GetSlotIdFromBossId( m_levelIDOfNextBoss );
				}
			}
			else
			{
				slotId = GetSlotIdFromBossId( m_levelIDOfNextBoss );
			}
			var totalHP:long = TroopMgr.instance().GetLevelMight(m_nextLevelIDOfNextBoss);
			var myHiddenBossDataList :Dictionary.<int, KBN.HidenBossInfo>  = KBN.PveController.instance().GetHidenBossList();
			var chapterId:int = m_levelIDOfNextBoss/1000000;
			if(myHiddenBossDataList.ContainsKey(chapterId))
			{
				var bossItem:KBN.HidenBossInfo = myHiddenBossDataList[chapterId] as KBN.HidenBossInfo;
				AddBoss(slotId,chapterId,bossItem.chapterIcon,bossItem.endTime,totalHP,totalHP,bossItem.type);
				m_dicBossSlotToBossId[BOSSSLOT+slotId] = m_nextLevelIDOfNextBoss;
			}
		}
		TextureMgr.instance().unloadUnusedAssets();
	}
	
	public function SetBossCurHP(bossLevelId:int,bossChapterId:int,curHP:long,totalHP:long)
	{
		var slotId:int = GetSlotIdFromBossId(bossLevelId);
		var slotTrans:Transform = transform.Find(""+slotId);
		if(slotTrans != null)
		{
			if(curHP <= 0)
			{
				if(slotTrans != null)
				{
					Destroy(slotTrans.gameObject);
				}
			}
			else
			{
				var bossScript:CampaignBoss = slotTrans.gameObject.GetComponent("CampaignBoss");
				if(bossScript != null)
				{
					bossScript.SetHiddenBossLeftHP(curHP);
					bossScript.SetCurProgress(bossLevelId,curHP,totalHP);		
				}
			}			
		}
	}
	
	public function SetLeftTime(obj:GameObject,endTime:long)
	{
		var leftTimeObj:GameObject = obj.transform.Find("LeftTimeObj").gameObject;
		var numberObj:GameObject = leftTimeObj.transform.Find("LeftTime").gameObject;
		var textMesh:TextMesh = numberObj.GetComponent(TextMesh);
		textMesh.text = _Global.timeFormatShortStrEx(endTime,false);
	}
	
	public function SetChapterStarNumber(obj:GameObject, myNumber:int, totalNumber:int)
	{
		var numberTrans:Transform = obj.transform.Find("starNumberObj/starNumber");
		if(numberTrans != null)
		{
			var textMesh:TextMesh = numberTrans.gameObject.GetComponent(TextMesh);
			textMesh.text = myNumber + "/" + totalNumber;
		}
	}
	
	public function UpdateAllChapterStarNumber()
	{
		var gdsChapterList :Dictionary.<String, KBN.DataTable.IDataItem> = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetItemDictionary();
		var myChapterDataList :Dictionary.<int, KBN.PveChapterData>  = KBN.PveController.instance().GetPveChapterDataList();
		var lastUnlockedChapterObj:GameObject = null;
		var scriptOfChapter : Chapter = null;
		var lastChapterID : int = -1;
		for(var key in gdsChapterList.Keys)
		{
			var gdsItem:KBN.DataTable.PveChapter = gdsChapterList[key] as KBN.DataTable.PveChapter;
			if(gdsItem != null && gdsItem.TYPE == KBN.PveController.instance().PveType && gdsItem.ENABLED)
			{	
				var iKey = _Global.INT32(key);
				var curStar:int = myChapterDataList.ContainsKey(iKey) ? myChapterDataList[iKey].curStar:0;
				var totalStar:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetChapterTotalStars(gdsItem.ID);
				var bUnlock:boolean = KBN.PveController.instance().IsChapterUnlock(gdsItem.ID);
				var chapterObj:GameObject = m_chapterGOCache[gdsItem.ID];
				if(chapterObj != null && bUnlock)
				{
					SetChapterStarNumber(chapterObj,curStar,totalStar);
					
					// Disable all the active chapter objects' moving action and save the last one.
					var trans = chapterObj.transform.Find( "Chapter_" + gdsItem.ID );
					if( trans )
					{
						chapterObj = trans.gameObject;
						lastUnlockedChapterObj = chapterObj;
						scriptOfChapter = chapterObj.GetComponent( "Chapter" );
						scriptOfChapter.setCanMove( false );
						lastChapterID = gdsItem.ID;
					}
				}
			}
		}
		// Enable the last one's moving action.
		if( lastUnlockedChapterObj )
		{
			if( lastChapterID != -1 )
			{
				if( !KBN.PveController.instance().IsChapterCompleted( lastChapterID ) )
				{
					scriptOfChapter = lastUnlockedChapterObj.GetComponent( "Chapter" );
					scriptOfChapter.setCanMove( true );
				}
			}
		}
	}
	
	private	function DestroyOldSlot(slotId:int)
	{
		var	child:Transform = transform.Find("Chapter_" + slotId );
		if( child == null )
			return;
		var object:GameObject = child.gameObject;
		Destroy(object);
		object.name = "Destroyed";
		object.transform.name = "Destroyed";
	}
	
	public function IsBoss(slotId:int):boolean
	{
		return (slotId >= MIN_BOSS_SLOT && slotId <= MAX_BOSS_SLOT);
	}
	
	private function GetValidSlotIdForBoss(levelId:int):int
	{
		var bossCount:int = m_dicBossSlotToBossId.Count;
		if(bossCount>=10) return 0;
		var rand:int = _Global.GetRandNumber(MIN_BOSS_SLOT,MAX_BOSS_SLOT);
		
		var i:int = 0;
		for (i=rand;i<=MAX_BOSS_SLOT;i++)
		{
			if(!m_dicBossSlotToBossId.ContainsKey(BOSSSLOT+i))
			{
				m_dicBossSlotToBossId.Add(BOSSSLOT+i,levelId);
				return i;
			}
		}
		
		for (i=rand-1;i>=MIN_BOSS_SLOT;i--)
		{
			if(!m_dicBossSlotToBossId.ContainsKey(BOSSSLOT+i))
			{
				m_dicBossSlotToBossId.Add(BOSSSLOT+i,levelId);
				return i;
			}
		}
		return 0;
	}

	public function GetBossIdFromSlotId(slotId:int):int
	{
		return m_dicBossSlotToBossId.ContainsKey(BOSSSLOT+slotId)?m_dicBossSlotToBossId[BOSSSLOT+slotId]:-1;
	}
	
	public function GetSlotIdFromBossId(levelId:int):int
	{
		for(var i:int=MIN_BOSS_SLOT;i<=MAX_BOSS_SLOT;i++)
		{
			if(m_dicBossSlotToBossId.ContainsKey(BOSSSLOT+i) && m_dicBossSlotToBossId[BOSSSLOT+i]== levelId)
			{
				return i;
			}
		}
		return 0;
	}
	
	public function IsBossExisted(levelId:int)
	{
		return m_dicBossSlotToBossId.ContainsValue(levelId);
	}
	
	public function DeleteBossSlot(slotId:int)
	{
		m_dicBossSlotToBossId.Remove(BOSSSLOT+slotId);
	}
	
	public function DeleteOldBossWithSameChapterId(bossLevelId:int)
	{	
		for(var key in m_dicBossSlotToBossId.Keys)
		{
			if( (m_dicBossSlotToBossId[key]/1000000 == bossLevelId/1000000) && m_dicBossSlotToBossId[key]!= bossLevelId)
			{
				m_dicBossSlotToBossId.Remove(key);
			}
		}
	}
	
	public function ClearBossData()
	{
		m_dicBossSlotToBossId.Clear();
	}
	
	public function UnlockChapter_Step1(chapterId:int)
	{
		m_UnlockChapterId = chapterId;
		var slotId:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetChapterSlotId(chapterId);
		var slotTrans:Transform = transform.Find("" + slotId);
		if(slotTrans != null)
		{
			var lockedTrans:Transform = slotTrans.Find("LockedChapter");
			if(lockedTrans != null)
			{
				Destroy(lockedTrans.gameObject);
				//add effect
				CreateUnlockChapterAnimation(slotId);
			}
		}
	}
	
	public function UnlockChapter_Step2()
	{
		var slotId:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetChapterSlotId(m_UnlockChapterId);
		var slotTrans:Transform = transform.Find("" + slotId);
		if(slotTrans != null)
		{
			//add chapter
			var chapterSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("chapter_"+m_UnlockChapterId, Constant.AnimationSpriteType.Campaign);
			if(chapterSprTmp != null)
			{
				var chapterSpr:GameObject = Instantiate(chapterSprTmp);
				chapterSprTmp = null;
				chapterSpr.transform.position = slotTrans.position;
				chapterSpr.name = "Chapter_" + m_UnlockChapterId;
				chapterSpr.transform.parent = slotTrans;
				chapterSpr.transform.localPosition = new Vector3(0, 0, 0);
				chapterSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
				chapterSpr.transform.localScale = new Vector3(1, 1, 1);
				AddStarNumberObj(slotTrans.gameObject);
				//add box collider
				chapterSpr.AddComponent(BoxCollider);
				m_chapterGOCache[m_UnlockChapterId] = slotTrans.gameObject;
				UpdateAllChapterStarNumber();
				TextureMgr.instance().unloadUnusedAssets();
				setAttackWarningEnabled( m_UnlockChapterId, slotTrans.gameObject, false );
			}
		}
	}
	
	private var m_curChapterId : int;
	private var m_curSlotId : int;
	private var m_curProgressObj : HashObject = new HashObject();
	private var m_curProgress : int;
	private var m_destProgress : int;
	private function onDownloadChapterAssetBundle( assetBundleName : String,
													downloadState : KBN.AssetBundleOTADownloader.DownloadState, 
													progress : float )
	{
		var otaDownloader : KBN.AssetBundleOTADownloader = GameMain.instance().getOTADownloader();
		switch( downloadState )
		{
			case KBN.AssetBundleOTADownloader.DownloadState.DOWNLOAD_STATE_NETWORK_ERROR:
				m_destProgress = 0;
				m_curProgress = 0;
				otaDownloader.subscribeDownloadProgress( assetBundleName, onDownloadChapterAssetBundle,
														true );
				break;
			case KBN.AssetBundleOTADownloader.DownloadState.DOWNLOAD_STATE_IN_PROGRESS:
				m_destProgress = progress * 100;
				break;
			case KBN.AssetBundleOTADownloader.DownloadState.DOWNLOAD_STATE_DOWNLOAD_COMPLETE:
				m_destProgress = 100;
				m_curProgress = 100;
				startupChapter( true );
				break;
		}
		
	}
	
	private function onQueryChapterAssetBundle( assetBundleName : String,
												assetBundleState : KBN.AssetBundleOTADownloader.AssetBundleState )
	{
		var otaDownloader : KBN.AssetBundleOTADownloader = GameMain.instance().getOTADownloader();
		
		switch( assetBundleState )
		{
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_NETWORK_ERROR:
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_QUERY_IN_PROGRESS:
				break;
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_NOT_EXIST_ON_DEVICE:
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_OUT_OF_DATE:
				m_destProgress = 0;
				m_curProgress = 0;
				otaDownloader.subscribeDownloadProgress( assetBundleName, onDownloadChapterAssetBundle,
														true );
				openChapterDownloadDialog();
				break;
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_UP_TO_DATE:
				startupChapter( true );
				break;
			case KBN.AssetBundleOTADownloader.AssetBundleState.ASSET_BUNDLE_STATE_DOWNLOAD_IN_PROGRESS:
				break;
		}
	}
	
	private function openChapterDownloadDialog()
	{
		MenuMgr.getInstance().PushMenu( "AssetBundleDownloadDialog", m_curProgressObj, "trans_zoomComp" );
	}
	
	private function startupChapter( popMenu : boolean )
	{
		if( popMenu )
		{
			MenuMgr.getInstance().PopMenu( "AssetBundleDownloadDialog" );
		}
		if( !m_isTransitingToChapterMap )
		{
			m_isTransitingToChapterMap = true;
			GameMain.instance().SetCurChapterId( m_curChapterId );
			//add effect
			CreateIntoChapterMapAnimation( m_curSlotId );
			SoundMgr.instance().PlayEffect("kbn_pve_chapter", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		}
	}
	
	private function handleChapterStartup( chapterId : int, slotId : int )
	{
		var bUnlock:boolean = KBN.PveController.instance().IsChapterUnlock(chapterId);
		if(bUnlock)
		{
			m_curChapterId = chapterId;
			m_curSlotId = slotId;
			if( USE_OTA_DOWNLOAD_TO_CREATE_CHAPTER )
			{
				m_curProgress = 0;
				m_destProgress = 0;
				var otaDownloader : KBN.AssetBundleOTADownloader = GameMain.instance().getOTADownloader();
				var bundles = new Array(
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_100,
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_101,
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_102,
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_103,
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_104,
					KBN.AssetBundleManager_Deprecate.ASSET_BUNDLE_CHAPTERMAP_105
				);
				otaDownloader.queryAssetBundleState( bundles[slotId-1], onQueryChapterAssetBundle );
			}
			else
			{
				startupChapter( false );
			}
		}
		else
		{
			var tipsCampaignTmp:GameObject = TextureMgr.instance().loadAnimationSprite("black_dizi", Constant.AnimationSpriteType.CampaignAnimation);
			if(tipsCampaignTmp != null)
			{
				var tipsCampaign:GameObject = Instantiate(tipsCampaignTmp);
				tipsCampaignTmp = null;
				tipsCampaign.name = "Tips";
				tipsCampaign.transform.parent = transform;
	            
	            var positionTips:Vector3 = new Vector3( 315, 500, 98 );
				tipsCampaign.transform.position = curCamera.ScreenToWorldPoint(
									relocatePositionFromOriginalResolution(
									positionTips ));
									
				tipsCampaign.transform.localPosition = curCamera.ScreenToWorldPoint(
									relocatePositionFromOriginalResolution(
									positionTips ));
				tipsCampaign.transform.localScale = new Vector3(1, 1, 1);
				tipsCampaign.transform.localPosition = new Vector3(tipsCampaign.transform.localPosition.x, 50, tipsCampaign.transform.localPosition.z);
				var tm:TextMesh = tipsCampaign.transform.Find("text").gameObject.GetComponent(TextMesh) as TextMesh;
				tm.text = Datas.getArString("Campaign.ChapterLocked_Text");
			}
			GameMain.singleton.ForceTouchForbidden = true;
		}
//		TextureMgr.instance().unloadUnusedAssets();
	}
	
	public function OnHitSlot(slotId:int)
	{
		if( IsBoss(slotId) )
		{
			var param:HashObject = new HashObject({"levelID":GetBossIdFromSlotId(slotId), "isHIdeBossInfo":0});
			MenuMgr.getInstance().PushMenu("BossMenu", param,"transition_BlowUp");
		}
		else if(slotId == ALLIANCE_BOSS_SLOT)
		{
			if(Alliance.getInstance().MyAllianceId() <= 0)
			{
				MenuMgr.getInstance().MainChrom.openAlliance({"from_alliance_boss": 1});
			}
			else
				KBN.AllianceBossController.instance().ReqAllianceBossInfo();
		}
		else if (slotId == RANK_SLOT)
		{
			MenuMgr.getInstance().PushMenu("PveLeaderboardMenu",Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE,"trans_zoomComp" );
		}
		else if (slotId==MAIL_SLOT) {
			// MenuMgr.getInstance().PushMenu("EmailMenu","trans_zoomComp" );
			var obj:Hashtable = { "PveOpenReport":"true" };
    		MenuMgr.getInstance().PushMenu("EmailMenu", obj);
		}
		else if(slotId == TOTALSTAR_SLOT)
		{
//			m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_BOSSES,0, 0 );
			KBN.PveController.instance().SetNewHidenBossCount();
			m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_BOSSES,0, 0 );
			MenuMgr.getInstance().PushMenu("HidenBossMenu",null,"trans_zoomComp" );
		}
		else if(slotId == ENERGYBOTTLE_SLOT)
		{
			MenuMgr.getInstance().PushMenu("RefillStaminaMenu",null,"trans_zoomComp" );
		}
		else if(slotId == MARCHSPEEDUP_SLOT)
		{
			var queItem:MarchVO = March.instance().getPveQueItem();
			MenuMgr.getInstance().PushMenu("SpeedUpMenu",queItem, "trans_zoomComp");	
		}
		else if(slotId == PVEBUFF_SLOT)
		{
			var data = {
				"type": Constant.BuffType.BUFF_TYPE_COMBAT,
				"id": 3500,
				"icon": "buff_icon_luck_PVE",
				"des1": Datas.getArString("BuffDescription.PVElucky"),
				"des2": Datas.getArString("BuffDescription.PVElucky"),
				"endTime": _Global.INT64(GameMain.instance().getSeed()["bonus"]["bC3500"]["bT3501"])
			};
			MenuMgr.getInstance().PushMenu("SimpleBuffInfo",data,"trans_zoomComp");
		}
		else
		{
			var chapterId:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetChapterIdFromSlotId(slotId);
			handleChapterStartup( chapterId, slotId );
		}
	}
	
	public function toFront()
	{
		super.toFront();
		GameMain.instance().DestroyAnimation("LoadingCampaign",null);
		GameMain.singleton.NotDrawMenu = false;
		InitAllBoss();
		CheckUnlockBoss();
		disableAllAttackWarnings();
		m_isTransitingToChapterMap = false;
		//march animation
//		var bossLevelId:int = Datas.singleton.GetMarchAnimationLevelId_Campaign();
//		var endTime:long = Datas.singleton.GetMarchAnimationEndTime_Campaign();
		var march : KBN.PveMarchData = KBN.PveController.instance().GetPveMarchInfo();
		var bossLevelId:int = march.levelID;
		var endTime:long = march.marchEndTime;
		var marchType:int = march.levelID/100000000;
		if(marchType!=1 && endTime > GameMain.unixtime())
		{
			CreateMarchAnimation(bossLevelId,endTime -  GameMain.unixtime());
		}
		
		if( !GameMain.instance().IsPveBossOpened() )
		{
			DestroyAllBoss();
		}
		TextureMgr.instance().unloadUnusedAssets();
		
		onUpdateCameraPosEnd();
		
		var isNew = KBN.PveController.instance().GetPveTotalIsNew();
		if(isNew)
		{
			curCamera.transform.localPosition = new Vector3(cameraNewPos, curCamera.transform.localPosition.y, curCamera.transform.localPosition.z);
		}

		/*
		//var pveMainChromeMenu:PveMainChromMenu = MenuMgr.getInstance().getMenu("PveMainChromMenu") as PveMainChromMenu;
		// if(pveMainChromeMenu!=null){
		// 	pveMainChromeMenu.ResetIsClicked(1);
		// }
		*/

		MenuMgr.getInstance().getMenuAndCall("PveMainChromMenu", function (menu: KBNMenu) {
			var pveMainChromeMenu: PveMainChromMenu = menu as PveMainChromMenu;
			if (pveMainChromeMenu != null) {
				pveMainChromeMenu.ResetIsClicked(1);
			}
		});
	}
	
	public function toBack()
	{
		super.toBack();
		KBN.Game.Event.UnregisterHandler(KBN.EventId.CampaignMode, OnCampaignModeChanged);
	}
	
	public function CheckUnlockChapter()
	{
		if(KBN.PveController.instance().nextChapterID != 0)
		{
			UnlockChapter_Step1(KBN.PveController.instance().nextChapterID);
			KBN.PveController.instance().nextChapterID = 0;
			SoundMgr.instance().PlayEffect("kbn_pve_unlock", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
		}
	}
	
	public function CheckUnlockBoss()
	{
		var nextBossInfo: KBN.HidenBossInfo = KBN.PveController.instance().nextBossInfo;
		if(nextBossInfo != null)
		{
			UnlockBoss_Step1_FromScratch();
		}
	}
	
	public function FindSlotObj(slotId:int):GameObject
	{
		var trans:Transform = transform.Find("" + slotId);
		if(trans != null)
		{
			return trans.gameObject;
		}
	}

	public function CreateEnergyRecoverAnimation()
	{
		var energyObj:GameObject = GameObject.Find("" + ENERGYBOTTLE_SLOT);
		if(energyObj != null)
		{
			CreateAnimation("EnergyRecover",Constant.AnimationSpriteType.CampaignAnimation,energyObj.transform,new Vector3(0,0,-2),Quaternion.AngleAxis(180, Vector3.right));
		}
	}
	
	public function CreateIntoChapterMapAnimation(slotId:int)
	{
		var trans:Transform = transform.Find("" + slotId);
		if(trans != null)
		{
			GameMain.singleton.ForceTouchForbidden = true;
			CreateAnimation("IntoChapterMap",Constant.AnimationSpriteType.CampaignAnimation,trans,new Vector3(0,1,0),new Quaternion(0, 0, 0, 0));
		}
	}
	
	public function CreateUnlockChapterAnimation(slotId:int)
	{
		var trans:Transform = transform.Find("" + slotId);
		if(trans != null)
		{
			CreateAnimation("UnlockChapter",Constant.AnimationSpriteType.CampaignAnimation,trans,new Vector3(0,1,0),Quaternion.AngleAxis(90, Vector3.right));
		}
	}
	
	public function CreateScreenWhiteAnimation()
	{
		MenuMgr.instance.netBlock = true;
		CreateAnimation("FogDisappear_2 guanbi",Constant.AnimationSpriteType.CampaignAnimation,curCamera.transform.position,5);
	}
	
	public function CreateMarchAnimation(bossLevelId:long,leftTime:long)
	{
		//save
//		Datas.singleton.SetMarchAnimationLevelId_Campaign(bossLevelId);
//		Datas.singleton.SetMarchAnimationEndTime_Campaign(GameMain.unixtime()+leftTime);
		var slotId:int;
		if(KBN.PveController.instance().IsAllianceBossMarch())
			slotId = ALLIANCE_BOSS_SLOT;
		else
			slotId = GetSlotIdFromBossId(bossLevelId);
		var slotTrans:Transform = transform.Find(""+slotId);
		if(slotTrans == null) return;
		
		var marchObj:GameObject = CreateAnimation("MarchAnimation",Constant.AnimationSpriteType.CampaignAnimation,slotTrans,new Vector3(0,2,0),Quaternion.AngleAxis(90, Vector3.right));
		if(marchObj != null)
		{
			marchObj.name = "" + MARCHSPEEDUP_SLOT;
			var aniScript:PveMarchAnimation = marchObj.GetComponent("PveMarchAnimation");
			aniScript.SetEndTime(GameMain.unixtime()+leftTime);
			var timeObj:GameObject = marchObj.transform.Find("marchTime").gameObject;
			var textMesh:TextMesh = timeObj.GetComponent(TextMesh);
			textMesh.text = _Global.timeFormatStrPlus(leftTime);
		}
	}
	
	public function SetMarchAnimationTime(bossLevelId:long,leftTime:long)
	{
		var slotId:int;
		if(KBN.PveController.instance().IsAllianceBossMarch())
			slotId = ALLIANCE_BOSS_SLOT;
		else
			slotId = GetSlotIdFromBossId(bossLevelId);
		var slotTrans:Transform = transform.Find(""+slotId);
		if(slotTrans == null) return;
		
		var speedupTrans:Transform = slotTrans.Find("" + MARCHSPEEDUP_SLOT);
		if(speedupTrans == null) return;
		var marchObj:GameObject =speedupTrans.gameObject;
		if(marchObj != null)
		{
			var aniScript:PveMarchAnimation = marchObj.GetComponent("PveMarchAnimation");
			aniScript.SetEndTime(leftTime+GameMain.unixtime());
		}
	}
	
	public function DestroyAllBoss()
	{
		for(var i:int=MIN_BOSS_SLOT;i<=MAX_BOSS_SLOT;i++)
		{
			var slotTrans:Transform = transform.Find(""+i);
			if(slotTrans != null)
			{
				Destroy(slotTrans.gameObject);
			}
		}
		
	}
	
	private function relocatePositionFromOriginalResolution( oldPos:Vector3 ):Vector3
	{
		return new Vector3 (oldPos.x * Screen.width / 640.0f,
		                   oldPos.y * Screen.height / 960.0f,
		                   oldPos.z);
	}
	
	public function OnEnterScene():void
	{
		var nNewCount:int = KBN.PveController.instance().GetNewHidenBossCount();
		if(nNewCount<0) 
			nNewCount = 0;
		m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_BOSSES, nNewCount, 0 );
	}
	
	public var mapTransform : Transform;
	public var isMoveCameraOpen : boolean = false;	
	
	public var cameraBeginPosX : float;
	
	public var leftCriticalPos : float;
	public var rightCriticalPos : float;
	public var energyBottleObj : GameObject;
	public var cameraNewPos : float = 7.88f;
	
	protected function move(touchTrans:Vector3)
	{
		//_Global.LogWarning("move!");
		if(isNeedMove)
		{
			return;
		}
		
		super.move(touchTrans);
	}
	
	protected function onMoveBegin(touch : Touch)
	{		
		if(isNeedMove)
		{
			return;
		}
		
		cameraBeginPosX = curCamera.transform.localPosition.x;
		//_Global.LogWarning("onMoveBegin!");
	}

	protected function onMoveEnd(touch : Touch)
	{		
		if(!isMoveCameraOpen || isNeedMove)
		{
			return;
		}
		
		//_Global.LogWarning("onMoveEnd!");
		
		// 相机宽度							
		var CXSize : float = curCamera.orthographicSize * 2 * curCamera.aspect;
		
		var halfCXSize : float = CXSize / 2.0f;
		
		var cameraPosX : float = curCamera.transform.localPosition.x;
		// 滑动是否超过半屏
		var isMoveOutrideHalf : boolean = false;
		if(Mathf.Abs(cameraPosX - cameraBeginPosX) >= halfCXSize)
		{
			isMoveOutrideHalf = true;
		}
		
		var offsetX : float = halfCXSize - (CXSize / 3.0f);
		var midPos : float = mapTransform.transform.localPosition.x;	
		
		leftCriticalPos = midPos + halfCXSize;
		rightCriticalPos = midPos - halfCXSize;
		
		var leftPos : float = midPos + offsetX;
		var rightPos : float = midPos - offsetX;
				
		if((cameraPosX >= leftPos && cameraPosX < leftCriticalPos) || (!isMoveOutrideHalf && cameraPosX > rightPos && cameraPosX <= midPos))
		{
			moveLeft();			
		}
		
		if(cameraPosX <= rightPos && cameraPosX > rightCriticalPos || (!isMoveOutrideHalf && cameraPosX > midPos && cameraPosX < leftPos))
		{
			moveRight();
		}
		
		if(isMoveOutrideHalf && cameraPosX > rightPos && cameraPosX <= midPos)
		{
			moveRight();
		}
		
		if(isMoveOutrideHalf && cameraPosX > midPos && cameraPosX < leftPos)
		{
			moveLeft();
		}
	}
	
	protected function onUpdateCameraPosEnd()
	{
		var isNew = KBN.PveController.instance().GetPveTotalIsNew();
		
		var bottle : GameObject = energyBottleObj.transform.Find("EnergyBottle").gameObject;
		var newBottle : GameObject = energyBottleObj.transform.Find("NewEnergyBottle").gameObject;
		
		bottle.SetActive(!isNew);
		newBottle.SetActive(isNew);	
		
		if( m_widgets )
		{
			var pveTotalData: KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo();
			
			var samina : int = KBN.PveController.instance().GetSimina();
			m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STAMINA_POTION,
									samina,
									pveTotalData.maxEnergy );
		}
	}
	
	private function moveLeft()
	{
		KBN.PveController.instance().SetPveTotalIsNew(true);
		speed = 0f;
		targetValue = leftCriticalPos;
		isNeedMove = true;	
	}
	
	private function moveRight()
	{
		KBN.PveController.instance().SetPveTotalIsNew(false);
		speed = 0f;
		targetValue = rightCriticalPos;
		isNeedMove = true;	
	}

	function ClickTopHideBtn(){
		if(m_widgets){
			m_widgets.ClickHideButton();
		}
	}
}


