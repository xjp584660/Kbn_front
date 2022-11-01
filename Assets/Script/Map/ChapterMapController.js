#pragma strict

class	ChapterMapController extends SlotBuildController
{
	private	var	cameraMoveRange:Rect;
	private static var MINLEVELSLOT:int = 1;
	private static var MAXLEVELSLOT:int = 20;
	private static var MIN_MAPSLOT:int = 100100;
	private static var RANK_SLOT:int = 200;
	private static var MAIL_SLOT:int=205;
	private static var ENERGYBOTTLE_SLOT:int = 206;
	private static var CHAPTERSTARS_SLOT:int = 201;
	private static var PVEBUFF_SLOT:int=203;
	
	private static var MARCHSPEEDUP_SLOT:int = 210;
	private static var PREFIX_SLOT:String = "LEVELSLOT_";
	private static var LEVELLAYER:String = "layer5";
	private static var PREFIX_LEVEL_OBJ:String = "Level_";
	private static var FLAG:String = "Flag";
	private static var LOCK:String = "Lock";
	private static var LEVELNAME:String = "LevelName";
	private static var UNLOCKEDMAP:String = "UNLOCKEDMAP_";
	private static var ANIMATION:String = "Animation";
	private static var CAMERA_START_POSITION_X:float = 3.2f;
	private static var VIEW_SPACE_DISTANCE_PER_SCREEN : float = 6.4f;
	public var RankScreenPoint:Vector3 = new Vector3 (40.6,595.3,98);
	public var ChapterStarScreenPoint:Vector3 = new Vector3 (40.6, 566.5, 98);
	
	private var mapObj:GameObject;
	private var levelLayerObj:GameObject;
	
	private var m_widgets : CampaignWidgets;
	
	private var m_curChapterId:int = 0;
	private var m_lastChapterId:int = 0;
	private var  m_SlotId2LevelId:Dictionary.<int,int> = new Dictionary.<int,int>();
	
	// Zooming in on get into the scene
	@SerializeField private var CAMERA_ZOOM_IN_SMOOTH_TIME : float = 1.8f;
	@SerializeField private var CAMERA_ZOOM_IN_VELOCITY : float = 0.01f;
	private var CAMERA_ZOOM_IN_DEFAULT_SIZE : float = 4.4f;
	private var CAMERA_ZOOM_IN_DEST_SIZE : float = 4.2f;
	private var WIDGETS_ZOOM_IN_DEFAULT_SIZE : float = 0.5f;
	private var WIDGETS_ZOOM_IN_DEST_SIZE : float = 0.8f;
	private var m_camZoomInSize : float = CAMERA_ZOOM_IN_DEFAULT_SIZE;
	private var m_isCamZoomingIn : boolean = false;
	private var m_widgetsZoomInSize : float = WIDGETS_ZOOM_IN_DEFAULT_SIZE;
	private var m_widgetTrans1 : Transform;
	private var m_widgetTrans2 : Transform;
	private var m_widgetsZoomInStartTime : float;
	private var m_widgetsZoomInDuration : float = 1.5f;
	
	// Camera-to-map tracking
	@SerializeField private var CAMERA_TO_MAP_TRACKING_SMOOTH_TIME : float = 1.8f;
	@SerializeField private var CAMERA_TO_MAP_TRACKING_VELOCITY : float = 1.0f;
	private var CAMERA_TO_MAP_TRACKING_DISTANCE_TOLERANCE : float = 0.02f;
	private var DEBUG_TEST_CAMERA_TO_MAP_TRACKING : boolean = false;
	private var m_camToMapTracking : boolean = false;
	private var m_camCurX : float;
	private var m_camDestX : float;
	private var MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK : boolean = false;
	private var m_mapLockedOrFogRemovable : Dictionary.<int,boolean> = new Dictionary.<int,boolean>();
	private var m_lastActiveLevel : int;
	private var m_2ndLastActiveLevel : int;
	
	// Unlocking map animation
	private var DEBUG_TEST_UNLOCKING_MAP : boolean = false;
	private var alreadyShownUnlockInfo;
	
	public var energyBottleObj : GameObject;
	
	public function Awake()
	{
		super.Awake();
		
		curCamera = gameObject.Find("ChapterMapCamera").GetComponent.<Camera>();
		viewRect = curCamera.pixelRect;
		GameMain.instance().onLevelLoaded(GameMain.CHAPTERMAP_SCENE_LEVEL, this);
	}
	
	private function updateCameraZoomIn()
	{
		return;
		if( m_isCamZoomingIn )
		{
			m_camZoomInSize = Mathf.SmoothDamp( m_camZoomInSize, CAMERA_ZOOM_IN_DEST_SIZE,
											CAMERA_ZOOM_IN_VELOCITY,
											CAMERA_ZOOM_IN_SMOOTH_TIME );
			m_widgetsZoomInSize = Mathf.SmoothDamp( m_widgetsZoomInSize, WIDGETS_ZOOM_IN_DEST_SIZE,
											CAMERA_ZOOM_IN_VELOCITY,
											CAMERA_ZOOM_IN_SMOOTH_TIME );
			var time = ( Time.time - m_widgetsZoomInStartTime ) / m_widgetsZoomInDuration;
			m_widgetsZoomInSize = Mathf.SmoothStep( WIDGETS_ZOOM_IN_DEFAULT_SIZE, 1.0, time );
			curCamera.orthographicSize = m_camZoomInSize;

			var go200 = GameObject.Find("200");
			if (go200 != null)
				m_widgetTrans1 = go200.transform;

			var go201 = GameObject.Find("201");
			if (go201 != null)
				m_widgetTrans2 = go201.transform;

			if (m_widgetTrans1!=null) {
				m_widgetTrans1.localScale.x = m_widgetsZoomInSize;
				m_widgetTrans1.localScale.y = m_widgetsZoomInSize;
			}

			if (m_widgetTrans2!=null) {
				m_widgetTrans2.localScale.x = m_widgetsZoomInSize;
				m_widgetTrans2.localScale.y = m_widgetsZoomInSize;
			}
			
			
			if( Mathf.Abs( m_widgetsZoomInSize - WIDGETS_ZOOM_IN_DEST_SIZE ) < 0.05f )
			{
				m_isCamZoomingIn = false;
			}
		}
	}
	
	private function startCameraToMapTracking( mapID : int, fromStartingPos : boolean )
	{
		m_camToMapTracking = true;
		m_camCurX = fromStartingPos ? CAMERA_START_POSITION_X : curCamera.transform.position.x;
		m_camDestX = CAMERA_START_POSITION_X + ( mapID % 10 ) * VIEW_SPACE_DISTANCE_PER_SCREEN;
		GameMain.singleton.TouchForbidden = true;
	}
	
	private function updateCameraToMapTracking()
	{
		if( m_camToMapTracking )
		{
			m_camCurX = Mathf.SmoothDamp( m_camCurX, m_camDestX,
										CAMERA_TO_MAP_TRACKING_VELOCITY,
										CAMERA_TO_MAP_TRACKING_SMOOTH_TIME );
			if( Mathf.Abs( m_camCurX - m_camDestX ) < CAMERA_TO_MAP_TRACKING_DISTANCE_TOLERANCE ) // Get to the destination
			{
				m_camToMapTracking = false;
				GameMain.singleton.TouchForbidden = false;
			}
			
			curCamera.transform.position.x = m_camCurX;
		}
	}


	private var m_lastUpdateTime : float;
	public function Update()
	{
		super.Update();
		
		
		// Camera-to-map tracking
		updateCameraToMapTracking();
		
		
		updateCameraZoomIn();
		
		// Widgets should update its position after the camera location
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
				m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STAMINA_POTION_IN_CHAPTER_VIEW,
										samina,
										pveTotalData.maxEnergy );
			}
			// checkChapterAttackState();
		}
	}
	
	public	function	toFront()
	{
		MenuMgr.instance.netBlock = false;
		super.toFront();
		alreadyShownUnlockInfo = false;

		var go200 = GameObject.Find("200");
		if (go200 != null)
			m_widgetTrans1 = go200.transform;

		var go201 = GameObject.Find("201");
		if (go201 != null)
			m_widgetTrans2 = go201.transform;

		m_widgetsZoomInSize = WIDGETS_ZOOM_IN_DEFAULT_SIZE;
		m_widgetsZoomInStartTime = Time.time;
		m_mapLockedOrFogRemovable.Clear();
		AddMapFogs();
		var pveMainChromeMenu:PveMainChromMenu = MenuMgr.getInstance().getMenu("PveMainChromMenu") as PveMainChromMenu;
		if(pveMainChromeMenu!=null){

			pveMainChromeMenu.setResortEnabled( true );
			pveMainChromeMenu.ResetIsClicked(2);
		}
		UpdateAnimation();
		
		// Close the chapter cloud animation step 1 and open the step 2.
		var step1 = GameObject.Find( "FogDisappear_2 guanbi" );
		Destroy( step1 );
		CreateAnimation("FogDisappear_2 dakai",Constant.AnimationSpriteType.CampaignAnimation,curCamera.transform.position,5);
		
		// Get ready for the zoom-in
		m_camZoomInSize = CAMERA_ZOOM_IN_DEFAULT_SIZE;
		m_isCamZoomingIn = true;

		//march animation
		var marchData:KBN.PveMarchData = KBN.PveController.instance().GetPveMarchInfo() as KBN.PveMarchData;
		if(marchData != null && marchData.levelID > 0 && marchData.marchEndTime > GameMain.unixtime () && marchData.levelID/1000000 == m_curChapterId)
		{
			CreateMarchAnimation(marchData.levelID,marchData.marchEndTime - GameMain.unixtime ());
		}
		
		TextureMgr.instance().unloadUnusedAssets();
		
		ShowEneryBottle();
	}
	
	private function ShowEneryBottle()
	{
		if(energyBottleObj == null)
		{
			energyBottleObj = GameObject.Find( "206" ).gameObject;
		}
		
		var bottle : GameObject = energyBottleObj.transform.Find("EnergyBottle").gameObject;
		var newBottle : GameObject = energyBottleObj.transform.Find("NewEnergyBottle").gameObject;
		
		var pveTotalData: KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo();
		
		bottle.SetActive(!pveTotalData.isNew);
		newBottle.SetActive(pveTotalData.isNew);
	}
	
	public function toBack()
	{
		super.toBack();
		Destroy(mapObj);
	}
	
	private function initWidgets( chapterData : KBN.PveChapterData )
	{
		m_widgets = new CampaignWidgets();
		
		// Leaderboard
		var rankSpr:GameObject = TextureMgr.instance().loadAnimationSprite("RankInChapterMap", Constant.AnimationSpriteType.Campaign);
		
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_LEADERBOARD_IN_CHAPTER_VIEW,
								Instantiate( rankSpr ),
								curCamera,
								transform,
								""+RANK_SLOT );
		rankSpr = null;

		var mailSpr:GameObject = TextureMgr.instance().loadAnimationSprite("button_icon_Mail", Constant.AnimationSpriteType.Campaign);
		
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_MAIL_IN_CHAPTER_VIEW,
								Instantiate( mailSpr ),
								curCamera,
								transform,
								""+MAIL_SLOT);
		mailSpr = null;


		var energyBottleSpr:GameObject = TextureMgr.instance().loadAnimationSprite("EnergyBottle", Constant.AnimationSpriteType.Campaign);
		var bottle : GameObject = energyBottleSpr.transform.Find("EnergyBottle").gameObject;
		var newBottle : GameObject = energyBottleSpr.transform.Find("NewEnergyBottle").gameObject;
		
		var pveTotalData: KBN.PveTotalData = KBN.PveController.instance().GetPveTotalInfo();
		
		bottle.SetActive(!pveTotalData.isNew);
		newBottle.SetActive(pveTotalData.isNew);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_STAMINA_POTION_IN_CHAPTER_VIEW,
								Instantiate( energyBottleSpr ),
								curCamera,
								transform,
								""+ENERGYBOTTLE_SLOT );
		energyBottleObj = GameObject.Find("" + ENERGYBOTTLE_SLOT);
		energyBottleSpr = null;

		// Stars in the chapter view
		var totalStarSpr:GameObject = TextureMgr.instance().loadAnimationSprite("ChapterStars", Constant.AnimationSpriteType.Campaign);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_STARS_IN_CHPATER_VIEW,
								Instantiate( totalStarSpr ),
								curCamera,
								transform,
								"" + CHAPTERSTARS_SLOT );
		totalStarSpr = null;

		var pveBuffSpr:GameObject = TextureMgr.instance().loadAnimationSprite("PveBuff", Constant.AnimationSpriteType.Campaign);
		m_widgets.setWidgetGO( CampaignWidgets.TYPE_PVE_BUFF,
								Instantiate( pveBuffSpr ),
								curCamera,
								transform,
								""+PVEBUFF_SLOT );
		pveBuffSpr = null;

		m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STARS_IN_CHPATER_VIEW,
								 chapterData ? chapterData.curStar : 0,
								 chapterData ? chapterData.totalStar : 0 );
		// Release the unused assets
		rankSpr = null;
		totalStarSpr = null;
		Resources.UnloadUnusedAssets();
	}
	
	public function Init(chapterId:int)
	{
		m_lastUpdateTime = 0;
		m_curChapterId = chapterId;
		
		m_SlotId2LevelId.Clear();
		
		//destroy old obj
		var rankTrans:Transform =  transform.Find("" + RANK_SLOT);
		if(rankTrans != null)
		{
			Destroy(rankTrans.gameObject);
		}
		var starTrans:Transform = transform.Find("" + CHAPTERSTARS_SLOT);
		if(starTrans != null)
		{
			Destroy(starTrans.gameObject);
		}
		var pvebuffTrans:Transform = transform.Find("" + PVEBUFF_SLOT);
		if(pvebuffTrans != null)
		{
			Destroy(pvebuffTrans.gameObject);
		}
		var mailTrans:Transform = transform.Find("" + MAIL_SLOT);
		if(mailTrans != null)
		{
			Destroy(mailTrans.gameObject);
		}
		var tiliTrans:Transform = transform.Find("" + ENERGYBOTTLE_SLOT);
		if(tiliTrans != null)
		{
			Destroy(tiliTrans.gameObject);
		}
		
		/*delete old*/
		if(mapObj != null)
		{
			Destroy(mapObj);
			mapObj.name = "Destroyed";
			mapObj.transform.name = "Destroyed";
		}
		
		/* add */
		mapObj = InstantiateChapterMap(chapterId);
		if(mapObj == null) 
		{
			toBack();
			return;
		}
		
		levelLayerObj = mapObj.transform.Find(LEVELLAYER).gameObject;
		if(levelLayerObj == null)
		{
			toBack();
			return;
		}
		
		
		
		var chapterData:KBN.PveChapterData = KBN.PveController.instance().GetChapterData(m_curChapterId);
		
		initWidgets( chapterData );
		
		
		
		//add levels
		m_lastActiveLevel = -1;
		m_2ndLastActiveLevel = -1;
		var gdsLevelList: Dictionary.<String, KBN.DataTable.IDataItem>  = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetItemDictionary();
		var iSlotId:int = 1;
		for(var key in gdsLevelList.Keys)
		{
			var iChapterId = _Global.INT32(key)/1000/1000;
			if(iChapterId == chapterId)
			{
				var gdsItem:KBN.DataTable.PveLevel = gdsLevelList[key] as KBN.DataTable.PveLevel;
				if(gdsItem != null)
				{
					m_SlotId2LevelId.Add(iSlotId,gdsItem.ID);
					AddLevel(iSlotId++,gdsItem.ID);
				}
			}
		}
		
		m_lastChapterId = m_curChapterId;
		
		if( DEBUG_TEST_CAMERA_TO_MAP_TRACKING ) 
		{
				startCameraToMapTracking( 100101, true );
		} // DEBUG_TEST_CAMERA_TO_MAP_TRACKING
		
		if( _Global.IsLowEndProduct() )
		{
			DeleteWaters();
		}
		
		KBN.Game.Event.Fire(this, new KBN.CampaignModeEventArgs(m_curChapterId/100));
		TextureMgr.instance().unloadUnusedAssets();
	}
	
	public function SetChapterId(id:int)
	{
		m_curChapterId = id;
	}
	
	public function GetChapterId():int
	{
		return m_curChapterId;
	}
	
	public	function hitSlot(raycastHit:RaycastHit)
	{
		var hitSlotId:int;
		var effectObj:GameObject = null;
		if(raycastHit.transform.name == FLAG)
		{
			hitSlotId = _Global.INT32( raycastHit.transform.parent.parent.name );
			effectObj = raycastHit.transform.parent.gameObject;
		}
		else if(raycastHit.transform.parent.name == FLAG)
		{
			hitSlotId = _Global.INT32( raycastHit.transform.parent.parent.parent.name );
			effectObj = raycastHit.transform.parent.parent.gameObject;
		}
		else
		{
			hitSlotId = _Global.INT32( raycastHit.transform.parent.name );
			effectObj = raycastHit.transform.gameObject;
		}
		if(hitSlotId >=MIN_MAPSLOT)
		{
			OnHitSlot(hitSlotId);
			return;
		}
		for( var effect:FadeInAndOut in effectList )
		{
			if( effect.tag == PRESTIGE_EFFECT_TAG && effect.userData["slotId"] == hitSlotId )
			{
				return;
			}
		}
		addHitEffect(effectObj, hitSlotId);
//		SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");
	}
	
	public function AddMapFogs()
	{
		//add map fog
		var mapSlot:int = 0;
		var gdsMapList: Dictionary.<String, KBN.DataTable.IDataItem>  = GameMain.GdsManager.GetGds.<KBN.GDS_PveMap>().GetItemDictionary();
		var chapterData:KBN.PveChapterData = KBN.PveController.instance().GetChapterData(m_curChapterId);
		for (var key in gdsMapList.Keys)
		{
			var mapId:int =  _Global.INT32(key);
			if(m_curChapterId == mapId/1000)
			{
				mapSlot++;
				if(mapSlot == 1) continue; // No fog in the first map of the chapter
				var unlockNeedStars:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveMap>().GetUnlockStar(mapId);
				var isMapStillMasked = !IsMapUnlocked( mapId );
				var curStars = ( chapterData == null ) ? 0 : chapterData.curStar;
				isMapStillMasked = isMapStillMasked || ( curStars < unlockNeedStars );
				
				if( isMapStillMasked )
				{
					AddMapFog( mapSlot, mapId, curStars, unlockNeedStars );
				}
				
				
			}
		}
if( !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK ) {
		// Just move to the map which the last unlocked level belongs to
		if( m_lastActiveLevel != -1 ) // This should always be true
		{
			var mapID = m_lastActiveLevel / 1000;
			if( !m_mapLockedOrFogRemovable.ContainsKey( mapID ) ||
					m_mapLockedOrFogRemovable[mapID] )
			{
			}
			else if( m_2ndLastActiveLevel != -1 ) // This should always be true here
			{
				mapID = m_2ndLastActiveLevel / 1000;
			}
			// In test phase, there are probably some removable fogs before
			// the one which the active level belongs to
			for(var item : KeyValuePair.<int, boolean> in m_mapLockedOrFogRemovable)
			{
				if(item.Value && item.Key < mapID )
				{
					mapID = item.Key;
				}
			}
			startCameraToMapTracking( mapID, true );
		}
} // !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK
	}
	
	public function AddMapFog(slotId:int, mapId:int, curStar:int, needStar:int)
	{
		var slotObj:GameObject = mapObj.transform.Find("MapSlot" + slotId).gameObject;
		if(slotObj != null)
		{
			var fogSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("FogDisappear", Constant.AnimationSpriteType.CampaignAnimation);
			if(fogSprTmp != null)
			{
				var fogSpr:GameObject = Instantiate(fogSprTmp);
				fogSprTmp = null;
				fogSpr.name = "" + mapId;
				fogSpr.transform.parent = mapObj.transform;
				fogSpr.transform.position = slotObj.transform.position;
				fogSpr.transform.localPosition = slotObj.transform.localPosition;
				fogSpr.transform.localPosition.z = -11;
				fogSpr.transform.localScale = new Vector3(0.95, 1, 1.15);
				var collectTip:GameObject = fogSpr.transform.Find("CollectTip").gameObject;
				var collectTipHead:GameObject = collectTip.transform.Find("Tip_Head").gameObject;
				var collectHeadText:TextMesh = collectTipHead.GetComponent(TextMesh);
				var collectTipTail:GameObject = collectTip.transform.Find("Tip_Tail").gameObject;
				var collectTailText:TextMesh = collectTipTail.GetComponent(TextMesh);
				
				var unlockTip:GameObject = fogSpr.transform.Find("UnlockTip").gameObject;
				var tip:GameObject = unlockTip.transform.Find("Tip").gameObject;
				var unlockTipText:TextMesh = tip.GetComponent(TextMesh);
				if(curStar < needStar)
				{
					collectHeadText.text = curStar.ToString() + "/" + needStar.ToString();
					collectTailText.text = Datas.getArString("Campaign.Maplock_Text1");
						
					if( !alreadyShownUnlockInfo )
					{
						collectTip.SetActiveRecursively(true);
						unlockTip.SetActiveRecursively(false);
						alreadyShownUnlockInfo = true;
					}
					else
					{
						collectTip.SetActiveRecursively(false);
						unlockTip.SetActiveRecursively(false);
					}
					fogSpr.transform.Find( "pointing_up_root" ).gameObject.SetActive( false );
					m_mapLockedOrFogRemovable.Add( mapId, false );
				}
				else
				{
					unlockTipText.text = Datas.getArString("Campaign.MapUnlock_Text1");
					collectTip.SetActiveRecursively(false);
					unlockTip.SetActiveRecursively(true);
					fogSpr.transform.Find( "pointing_up_root" ).gameObject.SetActive( false );
					// Check if first tracking
					if( PlayerPrefs.GetInt( "firstCameraToMapTracking", 0 ) == 0 )
					{
						// If so, play back the finger clicking animation
						
						PlayerPrefs.SetInt( "firstCameraToMapTracking", 1 );
						fogSpr.transform.Find( "pointing_up_root" ).gameObject.SetActive( true );
					}
					m_mapLockedOrFogRemovable.Add( mapId, true );
				}
			}
		}
		
	}
	
	public function UpdateAllMapFogInfo()
	{
		var gdsMapList: Dictionary.<String, KBN.DataTable.IDataItem>  = GameMain.GdsManager.GetGds.<KBN.GDS_PveMap>().GetItemDictionary();
		var chapterData:KBN.PveChapterData = KBN.PveController.instance().GetChapterData(m_curChapterId);
		alreadyShownUnlockInfo = false;
		m_mapLockedOrFogRemovable.Clear();
		for (var key in gdsMapList.Keys)
		{
			var mapId:int =  _Global.INT32(key);
			if(m_curChapterId == mapId/1000)
			{
				var unlockNeedStars:int = GameMain.GdsManager.GetGds.<KBN.GDS_PveMap>().GetUnlockStar(mapId);
				var curStars = ( chapterData == null ) ? 0 : chapterData.curStar;
				UpdateMapFogInfo( mapId, curStars, unlockNeedStars );
			}
		}
	}
	
	public function UpdateMapFogInfo(mapId:int, curStar:int, needStar:int)
	{
		var fogTrans:Transform = mapObj.transform.Find("" + mapId);
		if(fogTrans != null)
		{
			var collectTip:GameObject = fogTrans.Find("CollectTip").gameObject;
			var collectTipHead:GameObject = collectTip.transform.Find("Tip_Head").gameObject;
			var collectHeadText:TextMesh = collectTipHead.GetComponent(TextMesh);
			var collectTipTail:GameObject = collectTip.transform.Find("Tip_Tail").gameObject;
			var collectTailText:TextMesh = collectTipTail.GetComponent(TextMesh);
			
			var unlockTip:GameObject = fogTrans.Find("UnlockTip").gameObject;
			var tip:GameObject = unlockTip.transform.Find("Tip").gameObject;
			var unlockTipText:TextMesh = tip.GetComponent(TextMesh);
			if(curStar < needStar)
			{
				collectHeadText.text = curStar.ToString() + "/" + needStar.ToString();
				collectTailText.text = Datas.getArString("Campaign.Maplock_Text1");
				
				if( !alreadyShownUnlockInfo )
				{
					collectTip.SetActiveRecursively(true);
					unlockTip.SetActiveRecursively(false);
					alreadyShownUnlockInfo = true;
				}
				else
				{
					collectTip.SetActiveRecursively(false);
					unlockTip.SetActiveRecursively(false);
				}
				fogTrans.Find( "pointing_up_root" ).gameObject.SetActive( false );
				m_mapLockedOrFogRemovable.Add( mapId, false );
			}
			else
			{
				unlockTipText.text = Datas.getArString("Campaign.MapUnlock_Text1");
				collectTip.SetActiveRecursively(false);
				unlockTip.SetActiveRecursively(true);
				fogTrans.Find( "pointing_up_root" ).gameObject.SetActive( false );
				if( PlayerPrefs.GetInt( "firstCameraToMapTracking", 0 ) == 0 )
				{
					// If so, play back the finger clicking animation
					
					PlayerPrefs.SetInt( "firstCameraToMapTracking", 1 );
					fogTrans.Find( "pointing_up_root" ).gameObject.SetActive( true );
				}
				m_mapLockedOrFogRemovable.Add( mapId, true );
				
				if (MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK)
				{
					startCameraToMapTracking(mapId, false);
				   /* Camera-to-map tracking*/
				} // MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK

			}
			
		}
	}
	
	public function AddLevel(slotId:int, levelId:int)
	{
		var slotObj:GameObject = levelLayerObj.transform.Find(PREFIX_SLOT + slotId).gameObject;
		var levelObj:GameObject = slotObj.transform.Find("Level").gameObject;
		levelObj.name = "" + slotId;
		
		var	addObject:GameObject = InstantiateLevel(levelObj,levelId);
		
		if(addObject == null)
		{
			return;
		}
		AddLevelNameObj(addObject, slotId);

		/*
		var textObj:GameObject = levelObj.transform.Find("LevelName").gameObject;
		var textmesh:TextMesh = textObj.GetComponent(TextMesh);
		if(textmesh != null)
		{
			var nameKey:String = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetLevelNameKey(levelId);
			textmesh.text = Datas.getArString(nameKey);
		}
		*/
		
		AddLevelToSlot(addObject,levelObj, slotId, levelObj.transform.position);
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
			Nameobj.transform.localPosition = new Vector3(-0.27f, 0.39f, -8f);
			Nameobj.transform.localScale = new Vector3(1, 1, 1);

			var count: int = id;
			if (count >= 60)
				count = id - 60;
			var numberTrans: Transform = Nameobj.transform.Find("nameInfo");
			var numberBG: Transform = Nameobj.transform.Find("numberBg");
			if (numberTrans != null && numberBG != null)
			{
				var textMesh: TextMesh = numberTrans.gameObject.GetComponent(TextMesh);
				textMesh.text = "Level " + count;
				textMesh.color = Color.white;
				numberBG.transform.localScale = new Vector3(0.4f, 0.59f, 1f);
			}
		}
	}

	
	public function InstantiateLevel(parentObj:GameObject, levelId:int):GameObject
	{
		// add level
		var levelResId:int = levelId;
		if(m_curChapterId / 100 == Constant.PveType.ELITE)
		{
			levelResId = levelResId % 100000000 + 100000000;
		}
		var levelSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("level_"+levelResId, "Campaign/Levels/Chapter" + levelResId/1000000);
		if(levelSprTmp != null)
		{
			var levelSpr:GameObject = Instantiate(levelSprTmp);
			levelSprTmp = null;
			//delete animation for low device
			if( _Global.IsLowEndProduct() )
			{
				var levelAniTrans:Transform = levelSpr.transform.Find("Animation");
				if(levelAniTrans != null)
				{
					Destroy(levelAniTrans.gameObject);
				}
			}
			levelSpr.name = "Level_" + levelId;
			levelSpr.transform.position = parentObj.transform.position;
			levelSpr.transform.parent = parentObj.transform;
			levelSpr.transform.localPosition = new Vector3(0, 0, 0);
			levelSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			levelSpr.transform.localScale = new Vector3(1, 1, 1);
			if(KBN.PveController.instance().IsLevelUnlock(levelId))
			{
				var mapID = levelId/1000;
				
				//add box collider
				levelSpr.AddComponent(BoxCollider);
				var starNumber:int = KBN.PveController.instance().GetLevelStarNumber(levelId);
				if(starNumber>0)
				{
					AddStarFlag(levelSpr,starNumber);
				}
				else
				{
				
					
if( MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK ) {
					if(IsMapUnlocked(mapID))
					{
						var unlockedBefore = PlayerPrefs.GetInt(UNLOCKEDMAP+mapID,0);
						if( !unlockedBefore )
						{
							startCameraToMapTracking( mapID, true );
						}	
					}
} // MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK
					AddCurrentFlag(levelSpr);
				}
if( !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK ) {
				// We save last two unlocked level IDs because at least one of them
				// is in the unlocked map
				m_2ndLastActiveLevel = m_lastActiveLevel;
				m_lastActiveLevel = levelId;
} // !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK
			}
			else
			{
				AddLock(levelSpr);
			}
		}
		return levelSpr;
	}
	
	public function AddStarFlag(parentObj:GameObject, starNumber:int)
	{
		// add level
		var flagSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("LevelFlag", Constant.AnimationSpriteType.Levels);
		if(flagSprTmp != null)
		{
			var flagSpr:GameObject = Instantiate(flagSprTmp);
			flagSprTmp = null;
			flagSpr.name = FLAG;
			flagSpr.transform.position = parentObj.transform.position;
			flagSpr.transform.parent = parentObj.transform;
			flagSpr.transform.localPosition = new Vector3(0, 0.8, -8);
			flagSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			flagSpr.transform.localScale = new Vector3(1, 1, 1);
			
			var starSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("LevelStar_" + starNumber, Constant.AnimationSpriteType.Levels);
			if(starSprTmp != null)
			{
				var starSpr:GameObject = Instantiate(starSprTmp);
				starSprTmp = null;
				starSpr.name = "star"+starNumber;
				starSpr.transform.position = flagSpr.transform.position;
				starSpr.transform.parent = flagSpr.transform;
				starSpr.transform.localPosition = new Vector3(0, 0.05, -0.1);
				starSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
				starSpr.transform.localScale = new Vector3(1, 1, 1);
			}
		}
	}
	
	public function AddCurrentFlag(parentObj:GameObject)
	{
		// add level
		var flagSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("FlagDownCurrent", Constant.AnimationSpriteType.Levels);
		if(flagSprTmp != null)
		{
			var flagSpr:GameObject = Instantiate(flagSprTmp);
			flagSprTmp = null;
			flagSpr.name = FLAG;
			flagSpr.transform.position = parentObj.transform.position;
			flagSpr.transform.parent = parentObj.transform;
			flagSpr.transform.localPosition = new Vector3(0, 0.6, -8);
			flagSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			flagSpr.transform.localScale = new Vector3(1, 1, 1);
		}
	}
	
	public function AddLock(parentObj:GameObject)
	{
		// add level
		var lockSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite("LevelLock", Constant.AnimationSpriteType.Levels);
		if(lockSprTmp != null)
		{
			var lockSpr:GameObject = Instantiate(lockSprTmp);
			lockSprTmp = null;
			lockSpr.name = "Lock";
			lockSpr.transform.position = parentObj.transform.position;
			lockSpr.transform.parent = parentObj.transform;
//			lockSpr.transform.localPosition = new Vector3(0, -0.17, -0.9);
			lockSpr.transform.localPosition = new Vector3(0, 0, -8);
			lockSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			lockSpr.transform.localScale = new Vector3(1, 1, 1);
		}
		
		var objAni:Transform = parentObj.transform.Find(ANIMATION);
		if(objAni != null)
			objAni.gameObject.active = false;//this is no function, because toFront
	} 
	
	public function AddLevelToSlot(child:GameObject,parentObj:GameObject, slotId:int, position:Vector3)
	{
		child.SetActiveRecursively( gameObject.active );
		child.transform.position = parentObj.transform.position;
		child.transform.parent = parentObj.transform;
	}
	
	public function InstantiateChapterMap(chaperId:int):GameObject
	{
		var chapterMapSprTmp:GameObject = null;
		var assetBundleKey = "AnimationPrefab/"+Constant.AnimationSpriteType.Campaign + "/ChapterMap" + chaperId + "/";
		//if( KBN.AssetBundleOTADownloader.instance().isSupportingOTAOnThisDevice() )
		if ( false )
		{
			var assetName = "ChapterMap"+chaperId;
			chapterMapSprTmp = KBN.AssetBundleOTADownloader.instance().retrieveAsset( assetName, assetBundleKey );
		}
		else
		{
		 	chapterMapSprTmp = TextureMgr.instance().loadAnimationSprite("ChapterMap"+chaperId,
					Constant.AnimationSpriteType.Campaign + "/ChapterMap" + chaperId);
		}
		
		var chapterMapSpr:GameObject = null;
		if(chapterMapSprTmp != null)
		{
			//var assetToUnload = chapterMapSpr;
			chapterMapSpr = Instantiate(chapterMapSprTmp);
			chapterMapSprTmp = null;
			chapterMapSpr.transform.position = transform.position;
			chapterMapSpr.name = "ChapterMap"+chaperId;
			chapterMapSpr.transform.parent = transform;
			chapterMapSpr.transform.localPosition = new Vector3(0, 0, 0);
			chapterMapSpr.transform.localRotation = new Quaternion(0.7071068, 0, 0, 0.7071067);// Rotation(90,0,0)
			chapterMapSpr.transform.localScale = new Vector3(1, 1, 1);		
			//Resources.UnloadAsset( assetToUnload );
		}
		
		KBN.AssetBundleOTADownloader.instance().releaseAssetBundle( assetBundleKey );
		return chapterMapSpr;
	}
	
	public function OnHitSlot(slotId:int)
	{
		if(slotId == RANK_SLOT)
		{
			MenuMgr.getInstance().PushMenu("PveLeaderboardMenu",Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE,"trans_zoomComp" );
		}
		else if( slotId == CHAPTERSTARS_SLOT )
		{
			// Add code here on star clicking
			MenuMgr.getInstance().PushMenu("PveRuleMenu",null,"trans_zoomComp" );
		}
		else if (slotId==MAIL_SLOT) {
			// MenuMgr.getInstance().PushMenu("EmailMenu","trans_zoomComp" );
			var obj:Hashtable = { "PveOpenReport":"true" };
    		MenuMgr.getInstance().PushMenu("EmailMenu", obj);
		}
		else if(slotId == ENERGYBOTTLE_SLOT)
		{
			ShowEneryBottle();
					
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
		else if(slotId >= MIN_MAPSLOT)
		{
			PlayFogDisappearAnimation(slotId);
		}
		else
		{
			KBN.PveController.instance().OnClickLevel(m_SlotId2LevelId[slotId]);
		}
		
	}
	
	public function GetSlotIdFromLevelId(levelId:int)
	{
		
		for(var item : KeyValuePair.<int, int> in m_SlotId2LevelId)
		{
			if(item.Value == levelId)
			{
				return item.Key;
			}
		}
		return 0;
	}
	
	public function FindLevelObj(slotId:int,levelId:int):GameObject
	{
		var levelTrans:Transform = mapObj.transform.Find(LEVELLAYER);
		var slotTrans:Transform = levelTrans.Find(PREFIX_SLOT + slotId);
		if(slotTrans != null)
		{
			var slotSubTrans:Transform = slotTrans.Find("" + slotId);
			if(slotSubTrans != null)
			{
				return slotSubTrans.Find(PREFIX_LEVEL_OBJ+levelId).gameObject;
			}
		}
		return null;
	}
	
	public function UnlockLevel(slotId:int)
	{
		var levelID = m_SlotId2LevelId[slotId];
		var levelObj:GameObject = FindLevelObj(slotId, levelID);
		if(levelObj != null)
		{
			//add box collider
			levelObj.AddComponent(BoxCollider);
			var lockTrans:Transform = levelObj.transform.Find(LOCK);
			if(lockTrans != null)
			{
				Destroy(lockTrans.gameObject);
			}
			
			var objAni:Transform = levelObj.transform.Find(ANIMATION);
			if(objAni != null)
				objAni.gameObject.active = true;
if( !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK ) {
			var mapID = levelID / 1000;
			if( !m_mapLockedOrFogRemovable.ContainsKey( mapID ) ||
				m_mapLockedOrFogRemovable[mapID] )
			{
				// In test phase, there are probably some removable fogs before
				// the one which the active level belongs to
				for(var item : KeyValuePair.<int, boolean> in m_mapLockedOrFogRemovable)
				{
					if(item.Value && item.Key < mapID )
					{
						mapID = item.Key;
					}
				}
				startCameraToMapTracking( mapID, false );
			}
} // !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK
		}
	}
	
	public function UnlockLevel_Step3(slotId:int)
	{
		var levelObj:GameObject = FindLevelObj(slotId,m_SlotId2LevelId[slotId]);
		if(levelObj != null)
		{
			AddCurrentFlag(levelObj);
			TextureMgr.instance().unloadUnusedAssets();
		}
	}
	
	private function TransScreenPointFrom640_960(pos:Vector3):Vector3
	{
		return  new Vector3(pos.x*Screen.width/640,pos.y*Screen.height/960,pos.z);
	}
	
	public function CheckUnlockLevel()
	{
		if(KBN.PveController.instance().nextLevelID != 0)
		{
			UnlockLevel_Step1(KBN.PveController.instance().nextLevelID);
			KBN.PveController.instance().nextLevelID = 0;
		}
		else
		{
if( !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK ) {
			for(var item : KeyValuePair.<int, boolean> in m_mapLockedOrFogRemovable)
			{
				if(item.Value)
				{
					startCameraToMapTracking( item.Key, false );
					break;
				}
			}

} // !MOVE_TO_THE_LAST_UNLOCKED_MAP_TO_CLICK
		}
	}
	
	public function CheckLevelStarChanged()
	{
		if(KBN.PveController.instance().LevelFlagAnimation)
		{
			var levelData:KBN.PveLevelData = KBN.PveController.instance().GetFlagAnimationLevelData();
			if(levelData != null)
			{
				var slotId:int = GetSlotIdFromLevelId(levelData.levelID);
				if(m_SlotId2LevelId.ContainsKey(slotId))
				{
					var levelObj:GameObject = FindLevelObj(slotId,m_SlotId2LevelId[slotId]);
					if(levelObj != null)
					{
						var flagTrans:Transform = levelObj.transform.Find(FLAG);
						if(flagTrans != null)
						{
							Destroy(flagTrans.gameObject);
						}
						SoundMgr.instance().PlayEffect("kbn_pve_banner", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
						CreateLevelStarChangedAnimation(levelObj,levelData.highestStar);
						UpdateAllMapFogInfo();
						var chapterData:KBN.PveChapterData = KBN.PveController.instance().GetChapterData(m_curChapterId);
						m_widgets.setWidgetData( CampaignWidgets.NUMBER_TYPE_STARS_IN_CHPATER_VIEW,
								 chapterData ? chapterData.curStar : 0,
								 chapterData ? chapterData.totalStar : 0 );
					}
				}
			}
		}
	}
	
	public function UnlockLevel_Step1(nextLevelId:int)
	{
		var slotId:int = GetSlotIdFromLevelId(nextLevelId);
		CreateUnlockLevelAnimation(slotId);
	}
	
	public function UnlockLevel_Step2(slotId:int)
	{
		UnlockLevel(slotId);
		
	}
	
	public function CreateUnlockLevelAnimation(slotId:int)
	{
		if(m_SlotId2LevelId.ContainsKey(slotId))
		{
			var levelObj:GameObject = FindLevelObj(slotId,m_SlotId2LevelId[slotId]);
			if(levelObj != null)
			{
				SoundMgr.instance().PlayEffect("kbn_pve_unlock", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
				CreateAnimation("UnlockLevel",Constant.AnimationSpriteType.CampaignAnimation,levelObj.transform,new Vector3(0,0,-1),new Quaternion(0, 0, 0, 0));
			}
		}
	}
	
	public function CreateLevelStarChangedAnimation(parentObj:GameObject,stars:int)
	{
		var flagdownObj:GameObject = CreateAnimation("FlagDown"+stars,Constant.AnimationSpriteType.CampaignAnimation,parentObj.transform,new Vector3(0,0.6,-8),Quaternion.AngleAxis(270, Vector3.right));
		if(flagdownObj != null)
		{
			flagdownObj.name = FLAG;
		}
	}
	
	public function CreateMarchAnimation(levelId:long,leftTime:long)
	{
		//save
//		Datas.singleton.SetMarchAnimationLevelId_Chapter(levelId);
//		Datas.singleton.SetMarchAnimationEndTime_Chapter(GameMain.unixtime()+leftTime);
		
		var levelObj:GameObject = FindLevelObj(GetSlotIdFromLevelId(levelId),levelId);
		
		var marchObj:GameObject = CreateAnimation("MarchAnimation",Constant.AnimationSpriteType.CampaignAnimation,levelObj.transform,new Vector3(0,0.13,-10),new Quaternion(0, 0, 0, 0));
		if(marchObj != null)
		{
			var bossBeAttacking:GameObject = marchObj.transform.Find("boss_be_attacking").gameObject;
			Destroy(bossBeAttacking);
			marchObj.name = "" + MARCHSPEEDUP_SLOT;
			var aniScript:PveMarchAnimation = marchObj.GetComponent("PveMarchAnimation");
			aniScript.SetEndTime(GameMain.unixtime()+leftTime);
			var timeObj:GameObject = marchObj.transform.Find("marchTime").gameObject;
			var textMesh:TextMesh = timeObj.GetComponent(TextMesh);
			textMesh.text = _Global.timeFormatStrPlus(leftTime);
		}
	}
	
	public function SetMarchAnimationTime(levelId:long,leftTime:long)
	{
		var levelObj:GameObject = FindLevelObj(GetSlotIdFromLevelId(levelId),levelId);
		var marchTrans:Transform = levelObj.transform.Find("" + MARCHSPEEDUP_SLOT);
		if(marchTrans != null)
		{
			var aniScript:PveMarchAnimation = marchTrans.gameObject.GetComponent("PveMarchAnimation");
			aniScript.SetEndTime(leftTime+GameMain.unixtime());
		}
	}
	
	public function PlayFogDisappearAnimation(mapId:int)
	{
		var fogTrans:Transform = mapObj.transform.Find(""+mapId);
		if(fogTrans != null)
		{
			var unlockTip:GameObject = fogTrans.Find("UnlockTip").gameObject;
			if(unlockTip !=null && unlockTip.activeInHierarchy)
			{
				unlockTip.SetActiveRecursively(false);
				var animator:Animator = fogTrans.gameObject.GetComponent(Animator); 
				if(animator != null)
				{
					animator.enabled = true;
					UnlockMap(mapId);
					SoundMgr.instance().PlayEffect("kbn_pve_unlockfog", /*TextureType.AUDIO_PVE*/"Audio/Pve/");
				}
			}
			fogTrans.Find( "pointing_up_root" ).gameObject.SetActive( false );
		}
	}
	
	public function UnlockMap(mapId:int)
	{
		PlayerPrefs.SetInt(UNLOCKEDMAP+mapId,1);
	}
	
	public function IsMapUnlocked(mapId:int):boolean
	{
		return PlayerPrefs.HasKey(UNLOCKEDMAP+mapId);
	}
	
	public static function ClearUnlockMapData()
	{
		var mapIds:int[] = [100100,100101,100102,100103,101100,101101,101102,101013,102100,102101,102102,102103,103100,103101,103102,103103,104100,104101,104102,104103,105100,105101,105102,105103];
		for(var i:int=0;i<mapIds.Length;i++)
		{
			if(PlayerPrefs.HasKey(UNLOCKEDMAP + mapIds[i]))
			{
				PlayerPrefs.DeleteKey(UNLOCKEDMAP + mapIds[i]);
			}
		}
	}
	
	public function UpdateAnimation()
	{		
		var iSlotId:int = 1;
		
		while(m_SlotId2LevelId.ContainsKey (iSlotId))
		{
			var levelId:int = _Global.INT32(m_SlotId2LevelId[iSlotId]);
			var levelObj:GameObject = FindLevelObj(iSlotId,levelId);
			if(levelObj==null)break;
			
			var objAni:Transform = levelObj.transform.Find(ANIMATION);
			if(objAni != null)
			{
				if(KBN.PveController.instance().IsLevelUnlock(levelId))
					objAni.gameObject.active = true;
				else
					objAni.gameObject.active = false;
			}
			iSlotId++;
		}
	}
	
	private function DeleteWaters()
	{
		var layer1Trans:Transform = mapObj.transform.Find("layer1");
		if( layer1Trans != null )
		{
			var waterTrans:Transform = layer1Trans.Find("shuibowen");
			if (waterTrans != null )
			{
				Destroy(waterTrans.gameObject);
			}
		}
		
	}
	protected	function move(touchTrans:Vector3)
	{
		if(Application.platform == RuntimePlatform.Android)
			touchTrans = touchTrans * 1.3f;
		super.move(touchTrans);
	}
	function ClickTopHideBtn(){
		if(m_widgets){
			m_widgets.ClickHideButton();
		}
	}

	
	
}