class	FieldsController extends	SlotBuildController
{
	public	static	var		CASTLE_SLOT_ID:int = 1000;
	public	var	castle:GameObject;
	private	var	groundCnt:int;

	public function OnEnable()
	{
		MaterialColorScheme.instance.ApplyColorScheme(castle, "FieldBuilding");
	}


	public function Awake()
	{
		super.Awake();
		curCamera = gameObject.Find("fieldCamera").GetComponent.<Camera>();
		viewRect = curCamera.pixelRect;
		
		sortSlot();
		init();
		GameMain.instance().onLevelLoaded(GameMain.FIELD_SCENCE_LEVEL, this);
		curScaleFactor = GameMain.instance().getFieldScaleFactor();
		actScale();
	}
	
	public function init()
	{	
		var i:int = 0;
		/*if change city, destroy earlier city buidings*/
		for(i = 100; i < 140; i++)
		{
			destroyOldBuilding( i );
		} 
		
		var	seed:HashObject = GameMain.instance().getSeed();
		var	buildings:HashObject = seed["buildings"]["city"+GameMain.instance().getCurCityId()];
		var castleLv = Building.instance().getMaxLevelForType(Constant.Building.PALACE, GameMain.instance().getCurCityId());
		groundCnt = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.PALACE,castleLv,Constant.BuildingEffectType.EFFECT_TYPE_UNLOCK_FIELD_COUNT);
		
		var buildingSlotId:int = -1;
		var qe:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(GameMain.instance().getCurCityId());
		if(qe) 
		{
			buildingSlotId = qe.slotId;		
		}
		var curBuildingInfo:HashObject;
		var slotId: int;

		/*处理 除了 城堡以外的 其他 建筑物*/
		for( i = 0; i < groundCnt; i ++ )
		{
			slotId = 100 + i;
			destroyOldBuilding( slotId );
			
			curBuildingInfo = buildings["pos"+ slotId];

			if( curBuildingInfo == null )
			{
				addBuilding(slotId, Constant.Building.GROUND, 0);
			}
			else if(buildingSlotId == slotId)
			{
				addBuildingAnimation( slotId, _Global.INT32(curBuildingInfo[_Global.ap + 0]) );
			}
			else
			{
				addBuilding(slotId, _Global.INT32(curBuildingInfo[_Global.ap + 0]), _Global.INT32(curBuildingInfo[_Global.ap + 1]));
			}
		}

		/*处理  城堡 */
		changeCastleDisplay(getCastleLevel(buildings));

		GetComponent.<Renderer>().material.mainTexture = TextureMgr.instance().LoadTexture("c" + (2 - GameMain.instance().getCurCityOrder() % 2) + "_f_1", TextureType.MAP17D3A_TILE);

		MaterialColorScheme.instance.ApplyColorScheme(GetComponent.<Renderer>(), "FieldBackground");

		if(!_Global.IsLowEndProduct() )
		{		
			var waterTrans:Transform = transform.Find("water");
		
			if(waterTrans != null)
			{
				Destroy(waterTrans.gameObject);
				waterTrans.gameObject.name = "Destroyed";
				waterTrans.gameObject.transform.name = "Destroyed";
			}		
		
			var waterName:String = "w"+( 2 - GameMain.instance().getCurCityOrder()%2) +"_f_1";
			var waterObj:GameObject = TextureMgr.instance().loadAnimationSprite(waterName, Constant.AnimationSpriteType.Water);		
			if(waterObj != null)
			{			
				waterObj = Instantiate(waterObj);
				waterObj.name = "water";
				waterObj.transform.parent = transform;
				waterObj.transform.localPosition = new Vector3(0, 1, 0);
				waterObj.transform.localRotation = Quaternion.identity;
				waterObj.transform.localScale = Vector3.one;			
			}
		}
		SetLevelObjsVisible(false);
	}
	
	protected function instantiateBuilding(buildingTypeId:int, level:int):GameObject
	{
		var	gObj:GameObject;
		var child:GameObject;
		var newMaterial:Material;
		if( buildingTypeId == Constant.Building.GROUND )
		{			
			gObj = Instantiate(groundSlot);
			var groundSpr:GameObject = TextureMgr.instance().loadAnimationSprite("c1_999_1_1", Constant.AnimationSpriteType.Building);			
			groundSpr = Instantiate(groundSpr);
			groundSpr.name = "building";
			groundSpr.transform.parent = gObj.transform;
			groundSpr.transform.localPosition = Vector3.zero;
			groundSpr.transform.localRotation = Quaternion.identity;
			groundSpr.transform.localScale = Vector3.one;			
			MaterialColorScheme.instance.ApplyColorScheme(gObj, "FieldBuilding");
			return gObj;
		}
		
		gObj = Instantiate(normalBuilding);
		
		var nameSpr:String = Building.instance().getBuildingImgName(GameMain.instance().getCurCityOrder(), buildingTypeId, level);
		var animationSpr:GameObject = TextureMgr.instance().loadAnimationSprite(nameSpr, Constant.AnimationSpriteType.Building);
		
		if(animationSpr != null)
		{
			animationSpr = Instantiate(animationSpr);
			animationSpr.name = "building";
			animationSpr.transform.parent = gObj.transform;
			animationSpr.transform.localPosition = Vector3.zero;
			animationSpr.transform.localRotation = Quaternion.identity;
			animationSpr.transform.localScale = Vector3.one;
		}
		else
		{
			MaterialColorScheme.instance.ApplyColorScheme(gObj, "FieldBuilding");
			return gObj;
		}
		
		MaterialColorScheme.instance.ApplyColorScheme(gObj, "FieldBuilding");
		
		var levelObj:GameObject = gObj.transform.Find("level").gameObject;
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,level);
		var prestige:int = prestigeData["prestige"].Value;
		var transLv:int = prestigeData["level"].Value;
		var iLevel_H:int = transLv/10;
		var iLevel_L:int = transLv%10;
		showLevelObj(levelObj,iLevel_H,iLevel_L,prestige);
		
		return gObj;
	}
	
	public	function hitSlot(raycastHit:RaycastHit)
	{
		if( raycastHit.transform.name == "CastleBuilding" )
		{
			addHitEffect(raycastHit.transform.gameObject, CASTLE_SLOT_ID);			
			return;
		}
		
		super.hitSlot(raycastHit);
	}


	/*处理 城堡创建显示*/
	private	function changeCastleDisplay(level:int)
	{
		var animationSpr: GameObject = null;
		
		var citySkinData: HashObject = GetUsedCitySkinDataBySeedData(null);

		if (citySkinData != null && !IsUsedDefaultSkin(citySkinData)) {
			/* 使用了 城堡皮肤道具 */
			var skinres: String = citySkinData["skinres"].Value as String;
			animationSpr = TextureMgr.instance().loadAnimationSprite(skinres + "_f", Constant.AnimationSpriteType.BuildingCitySkin);

		} else {
			/* 未使用城堡皮肤道具  */
			var imgName: String = Building.instance().getCastleImgNameForField(GameMain.instance().getCurCityOrder(), level);
			animationSpr = TextureMgr.instance().loadAnimationSprite(imgName, Constant.AnimationSpriteType.Building);
		}


		if (animationSpr != null) {
			DestroyImmediate(castle.transform.Find(CASTLE_SLOT_ID + "").gameObject);
			animationSpr = Instantiate(animationSpr);
			animationSpr.name = CASTLE_SLOT_ID + "";
			animationSpr.transform.parent = castle.transform;
			animationSpr.transform.localPosition = Vector3.zero;
			animationSpr.transform.localRotation = Quaternion.identity;
			animationSpr.transform.localScale = Vector3.one;

			MaterialColorScheme.instance.ApplyColorScheme(animationSpr, "FieldBuilding");
		}	
		
	}
	
	private	function getCastleLevel(buildings:HashObject):int{
		return _Global.INT32(buildings["pos0"][_Global.ap + 1]);
	}
	
	public function onCastleLevelChanged(newLevel:int)
	{
        /*
		if( newLevel == 4 || newLevel == 7 || newLevel == 10 )
		{
			changeCastleDisplay(newLevel);
		}
		*/	
		changeCastleDisplay(newLevel);
		var	newCnt:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.PALACE,newLevel,Constant.BuildingEffectType.EFFECT_TYPE_UNLOCK_FIELD_COUNT);
		if( newCnt > groundCnt ){
			for( var i:int = groundCnt; i < newCnt; i ++ ){
				addBuilding(100+i, Constant.Building.GROUND, 0);
			}
			groundCnt = newCnt;
		}
	}


/********************************************** 处理城堡换肤 ***************************************************************************************/

	/*更换城堡的皮肤*/
	public function	ReplacePlayerCitySkin() {
		var level: int = Building.instance().buildingInfo(0, Constant.Building.PALACE).curLevel;/*城堡 的当前等级*/
		changeCastleDisplay(level);
	}


/**************************************************************************************************************************************************/


	public function Unload()
	{
		Resources.UnloadAsset(GetComponent.<Renderer>().material.mainTexture);
		Destroy(curCamera.gameObject);
	}

/*
	public function toFront(){
		
		ResetState();
		
		gameObject.SetActiveRecursively(true);
		curCamera.active = true;
		
	}
	
	public function toBack(){
	 
		gameObject.SetActiveRecursively(false);
		curCamera.active = false;
		 
	}

	*/


}
