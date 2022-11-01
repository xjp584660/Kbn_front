
class	CityController extends SlotBuildController{

	private	static	var	SLOT_CNT:int = 39;//33+1 Ad Pad Caisen. + 1 AvaOutPost
	
	public	var	palace:GameObject;
	public	var	palaceBuildingAni:GameObject;
	public	var	heroHouse:GameObject;
	
	public	var	walls:GameObject;
	private	var	wallDisBuilding:GameObject;
	private	var	wallBuildingAni:GameObject;
	public	var	avaOutPost:GameObject;
	private var avaOutPostClone:GameObject;
	
//	public	function	OnLevelWasLoaded(level:int){
////		super.OnLevelWasLoaded(level);
////		sortSlot();
////		init();
////		GameMain.instance().setCityController(this);
////		GameMain.instance().onLevelLoaded( GameMain.CITY_SCENCE_LEVEL );
////		
////		curScaleFactor = GameMain.instance().getCityScaleFactor();
////		_Global.Log("curScaleFactor:" + curScaleFactor);
////		actScale();
//		
//	}
	
	public function Awake()
	{
//		super.OnLevelWasLoaded(0);
		super.Awake();
		curCamera = gameObject.Find("cityCamera").GetComponent.<Camera>();
		
		viewRect = curCamera.pixelRect;//Rect(0, 154*Screen.height/960f, Screen.width, 637 * Screen.height/960f );
		
		sortSlot();
		init();
//		GameMain.instance().setCityController(this);
		GameMain.instance().onLevelLoaded(GameMain.CITY_SCENCE_LEVEL, this);
		curScaleFactor = GameMain.instance().getCityScaleFactor();
//		_Global.Log("curScaleFactor:" + curScaleFactor);
		actScale();
		
	}
	
	function ShowWorldBossDecration()
	{
		if (GameMain.singleton!= null &&  GameMain.singleton.IsHaveRealWorldBoss())
		{
			BuildingDecMgr.getInstance().addWorldBossDecration();
		}
		else
		{
			BuildingDecMgr.getInstance().delWorldBossDecration();
		}
	}

	function Update()
	{
		super.Update();
		OpenMonster();
		OpenMonthlyCard();
		ShowWorldBossDecration();
	}
	
	public function setAnimationWithTypeId(_buildingTypeId:int, _animationType:String):void
	{
		var	seed:HashObject = GameMain.instance().getSeed();
		var	buildings:HashObject = seed["buildings"]["city"+GameMain.instance().getCurCityId()];
		
		var buildingSlotId:int = -1;
		var qe:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(GameMain.instance().getCurCityId());
		
		if(qe) 
		{
			buildingSlotId = qe.slotId;		
		}
		
		var curBuildingInfo:HashObject;
		for(var i:int = 0; i < SLOT_CNT; i ++)
		{
			curBuildingInfo = buildings["pos"+i];
			if(curBuildingInfo != null && buildingSlotId != i)
			{
				var buildingType = _Global.INT32(curBuildingInfo[_Global.ap + 0]);
				if(buildingType == _buildingTypeId)
				{
					var buildingTransform:Transform = transform.Find("" + i);
					if (null != buildingTransform) 
					{
						var buildingSprite:GameObject = buildingTransform.Find("" + i).gameObject;
						if (null != buildingSprite)
							buildingSprite.SendMessage("SetState", _animationType, SendMessageOptions.DontRequireReceiver);
					}
				}
			}
		}
	}	
	
	public function init(){

		var curCityId: int = GameMain.instance().getCurCityId();

		var	seed:HashObject = GameMain.instance().getSeed();
		var buildings: HashObject = seed["buildings"]["city" + curCityId];
		
		var buildingSlotId:int = -1;
		var qe: BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(curCityId);

		if (qe) {
			buildingSlotId = qe.slotId;		
		}

		var curBuildingInfo:HashObject;
		for( var i:int = 0; i < SLOT_CNT; i ++ ){
			curBuildingInfo = buildings["pos"+i];

			if( curBuildingInfo == null ){
				if( i == 1 ){ /*wall*/
					addBuilding(i, Constant.Building.WALL, 0);
				} else if( i == 33 ) { /* Notice pad*/
					addBuilding(i, Constant.Building.GROUND, 0);
				} else{
					addBuilding(i, Constant.Building.GROUND, 0);
				}
			} else {

				/*城堡：因为有城堡皮肤的存在，需要特殊处理*/
				if (i == 0 && seed.Contains("citySkins")) {

					var isUseCitySkin: boolean = BuildCityBySeedData(seed["citySkins"][curCityId + ""]);
					/* 没有查找到使用过 城堡皮肤，则使用原方式构建建筑物*/

					if (!isUseCitySkin) {
						if (buildingSlotId == i) {
							addBuildingAnimation(i, _Global.INT32(curBuildingInfo[_Global.ap + 0]));
						} else {
							addBuilding(i, _Global.INT32(curBuildingInfo[_Global.ap + 0]), _Global.INT32(curBuildingInfo[_Global.ap + 1]));
						}
					}
				} else {
					if (buildingSlotId == i) {
						addBuildingAnimation(i, _Global.INT32(curBuildingInfo[_Global.ap + 0]));

					} else {
						addBuilding(i, _Global.INT32(curBuildingInfo[_Global.ap + 0]), _Global.INT32(curBuildingInfo[_Global.ap + 1]));

					}

				}

			}
		}
		
		/* Add Hero House */
		HeroManager.Instance().Check(true);

		/*
		if (buildings["pos99"] != null) {
			addBuilding(99, _Global.INT32(buildings["pos99"][_Global.ap + 0]), _Global.INT32(buildings["pos99"][_Global.ap + 1]));
		}
		*/

		GetComponent.<Renderer>().material.mainTexture  = TextureMgr.instance().LoadTexture("c"+(2 - (GameMain.instance().getCurCityOrder())%2) +"_c_1", TextureType.MAP17D3A_TILE);
		// renderer.material.mainTexture  = TextureMgr.instance().LoadTexture("testCityBg",TextureType.MAP17D3A_TILE);
		MaterialColorScheme.instance.ApplyColorScheme(GetComponent.<Renderer>(), "CityBackground");

		if(  !_Global.IsLowEndProduct() )
		{
			var waterTrans:Transform = transform.Find("water");
		
			if(waterTrans != null)
			{
				Destroy(waterTrans.gameObject);
				waterTrans.gameObject.name = "Destroyed";
				waterTrans.gameObject.transform.name = "Destroyed";
			}
		
			var waterName:String = "w"+(2 - (GameMain.instance().getCurCityOrder())%2) +"_c_1";
			var waterObj:GameObject = TextureMgr.instance().loadAnimationSprite(waterName, Constant.AnimationSpriteType.Water);		
			if(waterObj != null)
			{			
				waterObj = Instantiate(waterObj);
				waterObj.name = "water";
				waterObj.transform.parent = transform.Find("buildsParent");
				waterObj.transform.localPosition = Vector3.up;
				waterObj.transform.localRotation = Quaternion.identity;
				waterObj.transform.localScale = Vector3.one;	
				waterObj.transform.parent = transform;		
			}	
		}
		
		if(  !_Global.IsLowEndProduct() )
		{
			var guardsTrans:Transform = transform.Find("guards");
		
			if(guardsTrans != null)
			{
				Destroy(guardsTrans.gameObject);
				guardsTrans.gameObject.name = "Destroyed";
				guardsTrans.gameObject.transform.name = "Destroyed";			
			}
			
			var guardsName:String = "g"+(2 - (GameMain.instance().getCurCityOrder())%2) +"_c_1";
			var guards:GameObject = TextureMgr.instance().loadAnimationSprite(guardsName, Constant.AnimationSpriteType.Character);
			if( guards != null )
			{
				guards = Instantiate(guards);
				guards.name = "guards";
				guards.transform.parent = transform.Find("buildsParent");
				guards.transform.localPosition = Vector3.up;
				guards.transform.localRotation = Quaternion.identity;
				guards.transform.localScale = Vector3.one;
				guards.transform.parent = transform;			
			}
		}
		SetLevelObjsVisible(false);
		
		/* Ava OutPost */
		ChangeOutPostStatus(KBN.GameMain.Ava.Event.CurStatus);

		/* regist event */
		RegistEvents();

		monsterOpenObj = GameMain.instance().isMainCity() ? transform.Find("36/36/open").transform.gameObject : null;
		monthlyCardObj = transform.Find("38/38").transform.gameObject;

		if (monthlyCardObj != null && monthlyCardObj.transform.Find("MonthCard") != null)
		{
			monthlyCardClaim = monthlyCardObj.transform.Find("MonthCard").gameObject;
		}	

	}


	private var monsterOpenObj: GameObject;
	public function OpenMonster()
	{
		if (monsterOpenObj != null) {
			var state = MonsterController.instance().IsMonsterOpen();

			if (state != monsterOpenObj.activeSelf)
				monsterOpenObj.SetActive(state);
		}
	} 

	private var monthlyCardObj: GameObject;
	private var monthlyCardClaim:GameObject;
	public function OpenMonthlyCard(){
		if (monthlyCardObj!=null) 
		{
			if(Payment.instance().buyMonthlyCardOk)
			{
				return;
			}
			
			if (GameMain.instance() != null && GameMain.instance().isMainCity()
				&& GameMain.singleton!= null && GameMain.singleton.IsHaveMonthlyCard())
			{
				if (!monthlyCardObj.activeSelf)
					monthlyCardObj.SetActive(true);

			 	var data:HashObject = GameMain.singleton.GetMonthlyCard();	
			 	if(data != null)
			 	{
			 		if(monthlyCardClaim != null)
			 		{
						var state: boolean = !_Global.GetBoolean(data["isReceive"]) && hideMonthCardClaim;			
						if (monthlyCardClaim.activeSelf != state)
							monthlyCardClaim.SetActive(state);
			 		}
			 	}
			 	else
			 	{
			 		if(monthlyCardClaim != null)
			 		{
						if (monthlyCardClaim.activeSelf)
							monthlyCardClaim.SetActive(false);
			 		}
			 	}
			}
			else
			{
				if (monthlyCardObj.activeSelf)
					monthlyCardObj.SetActive(false);
			}
		}
	}
	
	private var hideMonthCardClaim : boolean = true;
	public function buyMonthCardOk()
	{
		if(GameMain.instance().isMainCity()&&GameMain.singleton.IsHaveMonthlyCard())
		{
			if(monthlyCardObj != null)
			{
				_Global.Log("MonthCard   buyMonthCardOk()");	
				hideMonthCardClaim = false;
				if(monthlyCardClaim != null)
		 		{
		 			monthlyCardClaim.SetActive(false);
		 		}
				monthlyCardObj.SetActive(true);						
				var mCardAnim: GameObject = monthlyCardObj.transform.Find("MonthCardChe").gameObject;
				mCardAnim.transform.Find("macheyinying").gameObject.SetActive(false);	
				mCardAnim.SendMessage("PlayRun", SendMessageOptions.DontRequireReceiver);
				monthlyCardObj.transform.localPosition = new Vector3(6f, 0f, 6f);
				var tweenPos : TweenPosition = monthlyCardObj.AddComponent(TweenPosition);
				tweenPos.Begin(monthlyCardObj, 5f, new Vector3(0f, 0f , 3f));
				tweenPos.AddOnFinished(moveFinished);
				tweenPos.Play(true);
			}	
		}		
	}
	
	public function moveFinished()
	{
		if(GameMain.instance().isMainCity()&&GameMain.singleton.IsHaveMonthlyCard())
		{
			if(monthlyCardObj != null)
			{			
				_Global.Log("MonthCard   moveFinished()");
				var mCardAnim: GameObject = monthlyCardObj.transform.Find("MonthCardChe").gameObject;
				mCardAnim.SendMessage("PlayStand", SendMessageOptions.DontRequireReceiver);
				var tweenPos : TweenPosition = monthlyCardObj.GetComponent(TweenPosition);
				Destroy(tweenPos);
				hideMonthCardClaim = true;
			}
		}		
	}

	
	public function addBuildingAnimation(slotId:int, buildingTypeId:int)
	{		
		if(slotId == 1)
		{
			var addWall:GameObject = addBuilding(slotId, Constant.Building.WALL, -1); //-1:wall building state
			
			var aniPos:Transform = addWall.transform.Find("aniPos1"); //it's hammer and building position
			if( aniPos == null )
			{
				return;
			}
			
			wallBuildingAni = instantiateBuildingAnimation(Constant.Building.WALL);
			wallBuildingAni.SetActiveRecursively(gameObject.active);
		
			wallBuildingAni.transform.position = aniPos.position;
			wallBuildingAni.transform.parent = addWall.transform;
//			wallBuildingAni.transform.localScale *= curScaleFactor;
			
//			var aniTrans:Transform = wallBuildingAni.transform.Find("building");
//			aniTrans.name = "" + slotId;
			wallBuildingAni.name = "" + slotId;
			
			return;
		}
		
		super.addBuildingAnimation( slotId, buildingTypeId );
		
	}
	
	public function addBuilding(slotId:int, buildingTypeId:int, buildingLevel:int):GameObject
	{
		if(slotId == 1)
		{
			if( wallBuildingAni != null )
			{//building wall
				Destroy(wallBuildingAni);
				wallBuildingAni = null;
			}
		}
		
		return	super.addBuilding(slotId, buildingTypeId, buildingLevel);
	}

/********************************************* 城堡换肤 专用接口 ********************************************************************/
	/* 立即 更换当前玩家，当前城市的 city build的皮肤*/
	public function ReplacePlayerCitySkinImmediately(skinData: HashObject) {

		var isUesDefault: boolean = _Global.INT32(skinData["isdefault"].Value) == 1;
		var citySkinId: String = skinData["skinid"].Value as String;
		var skinRes: String = skinData["skinRes"].Value as String;

		ReplacePlayerCitySkin(isUesDefault, citySkinId, skinRes);

	}


	/*更换当前玩家，当前城市的 city build的皮肤*/
	public function ReplacePlayerCitySkin() {

		var citySkinData: HashObject = GetUsedCitySkinDataBySeedData(null);

		if (citySkinData == null)
			return;

		var isUesDefault: boolean = false;

		isUesDefault = IsUsedDefaultSkin(citySkinData);

		var citySkinId: String = citySkinData["skinid"].Value as String;
		var skinRes: String = citySkinData["skinres"].Value as String;
		ReplacePlayerCitySkin(isUesDefault, citySkinId, skinRes);

	}

	public function ReplacePlayerCitySkin(isDefaultSkin: boolean, citySkinId: String, skinRes: String) {


		var slotId: int = 0;/*城堡位置*/
		var buildingTypeId: int = Constant.Building.PALACE;/*城堡的所属建筑类别*/
		var level: int = Building.instance().buildingInfo(slotId, buildingTypeId).curLevel;/*城堡 的当前等级*/

		/*是默认的皮肤时，走原先的更换流程*/
		if (isDefaultSkin) {
			addBuilding(slotId, buildingTypeId, level);
			return;
		}

		destroyOldBuilding(slotId);

		var emptyTransform: Transform = transform.Find("PosSlot" + slotId);
		if (emptyTransform == null) {
			return null;
		}


		 
		var addObject: GameObject = Instantiate(palace);
		/* 使用 城堡的皮肤*/
		var animationSpr: GameObject = TextureMgr.instance().loadAnimationSprite(skinRes + "_c", Constant.AnimationSpriteType.BuildingCitySkin);

		if (animationSpr != null) {
			animationSpr = Instantiate(animationSpr);
			animationSpr.transform.position = addObject.transform.position;
			animationSpr.name = "building";
			animationSpr.transform.parent = addObject.transform;
			animationSpr.transform.localPosition = Vector3.zero;
			animationSpr.transform.localRotation = Quaternion.identity;
			animationSpr.transform.localScale = Vector3.one;


			MaterialColorScheme.instance.ApplyColorScheme(addObject, "CityBuilding");

			var levelObj: GameObject = addObject.transform.Find("level").gameObject;
			var prestigeData: HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId, level);
			var prestige: int = prestigeData["prestige"].Value;
			var transLv: int = prestigeData["level"].Value;
			var iLevel_H: int = transLv / 10;
			var iLevel_L: int = transLv % 10;

			levelObj.transform.localPosition.y = 1;
			showLevelObj(levelObj, iLevel_H, iLevel_L, prestige);
		}
		else {
			GameObject.Destroy(addObject);
			addObject = null;
		#if UNITY_EDITOR
			Debug.Log("this building has no sprite, buildingType : " + buildingTypeId + " level : " + level);
		#endif
		}

		 

		if (addObject == null)
			return;
		 

		addChildObjWithBuilding(addObject, slotId, emptyTransform.localPosition); 

		setAnimation(buildingTypeId, addObject, slotId);

		var dec: BuildingDecMgr.DecrationInfor = BuildingDecMgr.getInstance().needDecration(buildingTypeId);
		if (dec != null) {
			showDecration(dec, addObject);
		}
		else {
			hideDecration(dec, addObject);
		}

		AddBuildingObj(slotId, addObject);

	/*set level obj inactive*/

		var levelTrans: Transform = addObject.transform.Find("level");
		if (levelTrans != null) {
			levelTrans.gameObject.SetActiveRecursively(false);
		}

	}

	/* 通过 getseed 中的数据，来查找是否需要创建 城堡皮肤 类型的 城堡建筑物 */
	private function BuildCityBySeedData(citySkinsData: HashObject): boolean {
		var isUsedCitySkin: boolean = false;

		var citySkinData: HashObject = GetUsedCitySkinDataBySeedData(citySkinsData);
		if (citySkinData != null) {
			isUsedCitySkin = true;

			var isDefaultSkin: boolean = false;
			if (citySkinData.Contains("isdefault") && _Global.INT32(citySkinData["isdefault"].Value) == 1)
				isDefaultSkin = true;

			var citySkinId: String = citySkinData["skinid"].Value as String;
			var skinRes: String = citySkinData["skinres"].Value as String;

			/*替换成 使用 皮肤 的城堡建筑物*/
			ReplacePlayerCitySkin(isDefaultSkin, citySkinId, skinRes);

		}
		 
		return isUsedCitySkin;
	}
/*************************************************************************************************************************************/

	public	function	addPrestigeAniWithBuilding( slotId:int, buildingTypeId:int, buildingLevel:int){
		if( slotId == 1 ){
			if( wallBuildingAni != null ){ //building wall
				var transAni:GameObject = genPrestigeAni( wallBuildingAni.transform );
				if( transAni == null ) return;
				
				var wall:Transform = transform.Find("1");
				for( var i:int = 0; i < 3; i ++ ){
					var effectPos:Transform = wall.Find("effectPos" + (i + 1) );
					if( effectPos != null ){
						genPrestigeAni( effectPos );
					}
				}
			}
			
			addPrestigeEffect(slotId, buildingTypeId, buildingLevel);
		}else{
			super.addPrestigeAniWithBuilding(slotId, buildingTypeId, buildingLevel);
		}
		
	}

/*
	public function	OnFadeOutStart( fadeInAndOut:FadeInAndOut, userData:Hashtable){
		if( fadeInAndOut.tag != PRESTIGE_EFFECT_TAG ) return;
		
		var buildingTypeId:int = userData["buildingTypeId"];
		if( buildingTypeId == Constant.Building.WALL ){
			Destroy(wallBuildingAni);
			wallBuildingAni = null;
		}
		
		super.OnFadeOutStart(fadeInAndOut, userData);
	}
*/
	
	public	function	removeBuilding(slotId:int){
		if( slotId == 1 ){
			addBuilding(1, Constant.Building.WALL, 0);
			return;
		}
		
		super.removeBuilding(slotId);
	}

	/* use animation sprite */
	protected function instantiateBuilding(buildingTypeId:int, level:int):GameObject
	{
		var	gObj:GameObject = null;
		var child:GameObject;
		var newMaterial: Material;

		if(buildingTypeId == Constant.Building.GROUND)
		{
			gObj = Instantiate(groundSlot);
			var groundSpr:GameObject = TextureMgr.instance().loadAnimationSprite("c1_999_1_1", Constant.AnimationSpriteType.Building);			
			if(groundSpr != null)
			{
				groundSpr = Instantiate(groundSpr);
				groundSpr.name = "building";
				groundSpr.transform.parent = gObj.transform;
				groundSpr.transform.localPosition = Vector3.zero;
				groundSpr.transform.localRotation = Quaternion.identity;
				groundSpr.transform.localScale = Vector3.one;			
			}
			MaterialColorScheme.instance.ApplyColorScheme(gObj, "CityBuilding");
			return gObj;
		}
		else if(buildingTypeId == Constant.Building.WALL)
		{
			gObj = instantiateWall(level);
			MaterialColorScheme.instance.ApplyColorScheme(gObj, "CityBuilding");
			return gObj;
		}
		else if(buildingTypeId == Constant.Building.PALACE)
		{
			gObj = Instantiate(palace);
		}
		else
		{
			gObj = Instantiate(normalBuilding);
		}		
		
/*		child = gObj.transform.Find("building").gameObject;*/
		var nameSpr:String = Building.instance().getBuildingImgName(GameMain.instance().getCurCityOrder(), buildingTypeId, level);
		if( buildingTypeId == Constant.Building.BARRACKS || buildingTypeId == Constant.Building.ACADEMY ){
			if( _Global.IsLowEndProduct() ){
				nameSpr +="_noani";
			}
		}
		var animationSpr:GameObject = TextureMgr.instance().loadAnimationSprite(nameSpr, Constant.AnimationSpriteType.Building);
		
		if(animationSpr != null)
		{
			animationSpr = Instantiate(animationSpr);
			animationSpr.transform.position = gObj.transform.position;
			animationSpr.name = "building";
			animationSpr.transform.parent = gObj.transform;
			animationSpr.transform.localPosition = Vector3.zero;
			animationSpr.transform.localRotation = Quaternion.identity;
			animationSpr.transform.localScale = Vector3.one;
		}
		else
		{
			GameObject.Destroy(gObj);
			gObj = null;			
			Debug.Log("this building has no sprite, buildingType : " + buildingTypeId + " level : " + level);
			return gObj;
		}
		
		MaterialColorScheme.instance.ApplyColorScheme(gObj, "CityBuilding");
		
		var levelObj:GameObject = gObj.transform.Find("level").gameObject;
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId, level);
		var prestige:int = prestigeData["prestige"].Value;
		var transLv:int = prestigeData["level"].Value;
		var iLevel_H:int = transLv/10;
		var iLevel_L:int = transLv%10;
		
		levelObj.transform.localPosition.y = 1;

	/*
	//for castle display
		if(buildingTypeId == Constant.Building.PALACE)
		{
			if(Building.instance().getBuildingImgName(GameMain.instance().getCurCityOrder(),Constant.Building.PALACE,level) == "c1_0_6_1")
			{
				levelObj.transform.localPosition.x = 3.3;
				levelObj.transform.localPosition.z = 2.5;
			}
			else
			{
				levelObj.transform.localPosition.x = 2.6;
				levelObj.transform.localPosition.z = 2.8;
			}
		}
	*/
		
		showLevelObj(levelObj,iLevel_H,iLevel_L,prestige);
		return gObj;
	}
	
	private function instantiateWall(newLevel:int):GameObject{
		
		var	gObj:GameObject = Instantiate(walls);
		InitAnimationSpriteObjectForWall(gObj, newLevel);
		InitOtherComponentsForWall(gObj, newLevel);
		return gObj;
	}
	
	private function InitOtherComponentsForWall(wallObj : GameObject, newLevel : int)
	{
		for(var i : int = 1; i <= 3; i++)
		{
			if(newLevel != -1)
			{ 
				var child : GameObject = wallObj.transform.Find("levelPos" + i).gameObject;
				
				
				var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(Constant.Building.WALL,newLevel);
				var prestige:int = prestigeData["prestige"].Value;
				var transLv:int = prestigeData["level"].Value;
				var iLevel_H:int = transLv/10;
				var iLevel_L:int = transLv%10;
				
				var shieldSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Shield", Constant.AnimationSpriteType.Decoration);
				InstantiatePrefab(shieldSpr, "Sheidld", child.transform, Vector3.zero, Vector3.one);
					
				var lowLevelSpr:GameObject = TextureMgr.instance().loadAnimationSprite("lv" + iLevel_L, Constant.AnimationSpriteType.Decoration);
				lowLevelSpr = InstantiatePrefab(lowLevelSpr, "level_l", child.transform, Vector3.up, Vector3.one) as GameObject;
				
				var highLevelSpr:GameObject = null;
				if(iLevel_H > 0)
				{
					lowLevelSpr.transform.localPosition.x = 0.11f;
					
					highLevelSpr = TextureMgr.instance().loadAnimationSprite("lv" + iLevel_H, Constant.AnimationSpriteType.Decoration);
					highLevelSpr = InstantiatePrefab(highLevelSpr, "level_h", child.transform, new Vector3(-.11f, 1f, 0f), Vector3.one) as GameObject;
				}

				if(prestige > 0)
				{
					lowLevelSpr.transform.localPosition.z = -0.12f;
					if(highLevelSpr != null)
					{
						highLevelSpr.transform.localPosition.z = -0.12f;
					}
					
					var starSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Star" + prestige, Constant.AnimationSpriteType.Decoration);
					InstantiatePrefab(starSpr, "prestigeLv", child.transform, Vector3.up, Vector3.one);			
				}	
			}			
		}
	}
	
	private function InitAnimationSpriteObjectForWall(wallObj : GameObject, newLevel : int)
	{
		var sprName : String = "";
		try
		{
			sprName = GetAnimationSpriteNameForWall(newLevel);
		}
		catch (e : GDS_Building.DebugException)
		{
			throw new Exception(String.Format("GDS_Building is corrupted somehow: newLevel={0}, curCityOrder={1}, extraErrorMsg=\"{2}\"",
					newLevel, GameMain.instance().getCurCityOrder(), e.Message));
		}

		var animationSpr : GameObject = TextureMgr.instance().loadAnimationSprite(sprName, Constant.AnimationSpriteType.Building);
		
		if(animationSpr != null)
		{
			wallDisBuilding = InstantiatePrefab(animationSpr, "building", wallObj.transform, Vector3.zero, Vector3.one);
		}
		else
		{
			throw new Exception(String.Format("animationSpr is missing for wall: newLevel={0}, curCityOrder={1}, sprName=\"{2}\"",
					newLevel, GameMain.instance().getCurCityOrder(), sprName));
		}
	}
	
	private static function GetAnimationSpriteNameForWall(newLevel : int) : String
	{
		var sprName : String;
		if(newLevel == -1)
		{
			sprName = String.Format("c1_{0}_build", Constant.Building.WALL);
		}
		else
		{
			if(newLevel == 0)
			{
				sprName = "c1_19_0_1";
			}
			else
			{
				sprName = Building.instance().getBuildingImgNameWithThrow(GameMain.instance().getCurCityOrder(), Constant.Building.WALL, newLevel);
			}
		}
		return sprName;
	}
	
	private static function InstantiatePrefab(prefab : GameObject, name : String, parent : Transform,
			localPosition : Vector3, localScale : Vector3) : GameObject
	{
		if (prefab == null)
		{
			return null;
		}
		
		var ret : GameObject = Instantiate(prefab) as GameObject;
		ret.name = name;
		var transformRef : Transform = ret.transform;
		transformRef.parent = parent;
		transformRef.localPosition = localPosition;
		transformRef.localRotation = Quaternion.identity;
		transformRef.localScale = localScale;
		return ret;
	}

	public	function hitSlot(raycastHit:RaycastHit)
	{
		if( raycastHit.transform.name.StartsWith("collider") )
		{ // hit wall			
			var childObj:GameObject = wallDisBuilding.transform.Find("wall").gameObject;
			addHitEffect(childObj, 1);
			return;
		}
		super.hitSlot(raycastHit);
	}
	
	protected	function	instantiateBuildingAnimation(buildingTypeId:int):GameObject
	{
		if(buildingTypeId == Constant.Building.PALACE)
		{
			var obj:GameObject = Instantiate(palaceBuildingAni);			
			var animationSpr:GameObject = TextureMgr.instance().loadAnimationSprite("b_ani2_bg", Constant.AnimationSpriteType.BuildingAnimation);		
			if(animationSpr != null)
			{
				animationSpr = Instantiate(animationSpr);
				animationSpr.name = "building";			
				animationSpr.transform.parent = obj.transform;
				animationSpr.transform.localPosition = Vector3.zero;
				animationSpr.transform.localRotation = Quaternion.identity;
				animationSpr.transform.localScale = Vector3.one;				
			}
			
			return obj;
		}

		return super.instantiateBuildingAnimation(buildingTypeId);
	}
	
	public function instantiateHeroHouse():GameObject
	{
		var gObj:GameObject = Instantiate(heroHouse);
		var heroHouseSpr:GameObject = TextureMgr.instance().loadAnimationSprite("HeroHouse", Constant.AnimationSpriteType.Building);			
		if(heroHouseSpr != null)
		{
			var heroHouseSprCloned = Instantiate(heroHouseSpr);
			heroHouseSprCloned.name = "building";
			heroHouseSprCloned.transform.parent = gObj.transform;
			heroHouseSprCloned.transform.localPosition = Vector3.zero;
			heroHouseSprCloned.transform.localRotation = Quaternion.identity;
			heroHouseSprCloned.transform.localScale = Vector3.one;
			MaterialColorScheme.instance.ApplyColorScheme(heroHouseSprCloned, "CityBuilding");
			
			heroHouseSpr = null;
			TextureMgr.instance().unloadUnusedAssets();
		}
		return gObj;
	}
	
	public function instantiateAvaOutPost():GameObject
	{
		var gObj:GameObject = Instantiate(avaOutPost);
		var outPostSpr:GameObject = TextureMgr.instance().loadAnimationSprite("AvaOutPost", Constant.AnimationSpriteType.Building);			
		if(outPostSpr != null)
		{
			var outPostSprCloned = Instantiate(outPostSpr);
			outPostSprCloned.name = "building";
			outPostSprCloned.transform.parent = gObj.transform;
			outPostSprCloned.transform.localPosition = Vector3.zero;
			outPostSprCloned.transform.localRotation = Quaternion.identity;
			outPostSprCloned.transform.localScale = Vector3.one;
			avaOutPostClone = outPostSprCloned;
			MaterialColorScheme.instance.ApplyColorScheme(outPostSprCloned, "CityBuilding");
			outPostSpr = null;
			TextureMgr.instance().unloadUnusedAssets();
		}
		return gObj;
	}
	
	public function instantiateNoticePad( posSlot :Transform ):GameObject
	{
		var noticePadSpr:GameObject = TextureMgr.instance().loadAnimationSprite("NoticePad1", Constant.AnimationSpriteType.Building);			
		if(noticePadSpr != null)
		{
			var parent = Instantiate( posSlot );
			var noticePadSprCloned = Instantiate(noticePadSpr);
			noticePadSprCloned.name = "building";
			noticePadSprCloned.transform.parent = parent;
			noticePadSprCloned.transform.localPosition = new Vector3(-8.7f, 1f, 1f);
			noticePadSpr = null;
			MaterialColorScheme.instance.ApplyColorScheme(noticePadSprCloned, "CityBuilding");
			
			var decration : GameObject = new GameObject();
			decration.name = "decration";
			decration.transform.parent = parent;
			decration.transform.localPosition = new Vector3(-8.6f, 1f, 1.64f);
			
			TextureMgr.instance().unloadUnusedAssets();
			return parent.gameObject;
		}
		return noticePadSprCloned.transform.parent.gameObject;
	}
	
	public function Unload()
	{
		Resources.UnloadAsset(GetComponent.<Renderer>().material.mainTexture);
		Destroy(curCamera.gameObject);
		UnRegistEvents();
	}
	
	protected function RegistEvents()
	{
		KBN.Game.Event.RegisterHandler (KBN.EventId.AvaStatus, OnAvaStatusChanged);
	}
	
	protected function UnRegistEvents()
	{
		KBN.Game.Event.UnregisterHandler (KBN.EventId.AvaStatus, OnAvaStatusChanged);
	}
	
	protected function OnAvaStatusChanged(sender:Object, e:GameFramework.GameEventArgs):void
	{
		var ne:KBN.AvaStatusEventArgs = e as KBN.AvaStatusEventArgs;
		ChangeOutPostStatus(ne.Status);
	}
	
	protected function ChangeOutPostStatus(status:AvaEvent.AvaStatus)
	{
		var childTrans1:Transform = avaOutPostClone.transform.Find("1");
		var childTrans2:Transform = avaOutPostClone.transform.Find("2");
		var tipsTrans:Transform = avaOutPostClone.transform.Find("tips");
		tipsTrans.gameObject.SetActive(false);
		
		if(status == AvaEvent.AvaStatus.Prepare || status == AvaEvent.AvaStatus.Match
			|| status == AvaEvent.AvaStatus.Frozen || status == AvaEvent.AvaStatus.Combat
			|| status == AvaEvent.AvaStatus.EndFrozen)
		{
			childTrans1.gameObject.SetActive(false);
			childTrans2.gameObject.SetActive(true);
		}
		else
		{
			childTrans1.gameObject.SetActive(true);
			childTrans2.gameObject.SetActive(false);
		}
		
		var METRICS_WIDTH : float = 1.5 * 2;
		var METRICS_SCALE_X : float = 1.5;
		var METRICS_SCALE_X_LARGE : float = 2;
		var METRICS_CHARS : float = 9.0;
		var tipsText:TextMesh = tipsTrans.Find("text").gameObject.GetComponent.<TextMesh>();
		var tipsBgTrans1:Transform = tipsTrans.Find("tips_01");
		var tipsBgTrans2:Transform = tipsTrans.Find("tips_02");
		if(status == AvaEvent.AvaStatus.Prepare)
		{
			tipsTrans.gameObject.SetActive(true);
			tipsText.text = Datas.getArString ("AVA.Outpost_deploytroopstitle");
		}
		else if(status == AvaEvent.AvaStatus.Frozen || status == AvaEvent.AvaStatus.Combat || status == AvaEvent.AvaStatus.EndFrozen)
		{
			tipsTrans.gameObject.SetActive(true);
			tipsText.text = Datas.getArString ("AVA.outpost_Battle");
		}
		tipsBgTrans1.localScale.x = tipsText.text.Length / METRICS_CHARS * METRICS_SCALE_X + 0.2;
		
	}
	
	public function toFront()
	{
		super.toFront();
		ChangeOutPostStatus(KBN.GameMain.Ava.Event.CurStatus);
	
		GameMain.singleton.NotDrawMenu = false;
		GameMain.singleton.ForceTouchForbidden = false;
	}

}
