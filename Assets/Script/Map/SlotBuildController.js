
class	SlotBuildController extends	GestureController implements FadeInAndOutDelegate{


	protected	static	var	PRESTIGE_EFFECT_TAG:String = "prestige";
	
	protected	static	var	hitEffect:FadeInAndOut;// = new FadeInAndOut();
	
	@Space(30) @Header("---------- SlotBuildController ----------")

	public	var	groundSlot:GameObject;
	public	var normalBuilding:GameObject;
	
	public	var leftTop:GameObject;
	public 	var rightBottom:GameObject;
	
	public	var	normalBuildingPrestigeTransAni:GameObject;
	public	var	normalBuildingAni:GameObject;
	protected  var materialTable:Hashtable;
	
	protected	var	effectList:Array;
	protected var buildingObjs:Dictionary.<int,GameObject> = new Dictionary.<int,GameObject>();
	function Awake()
	{
		super.Awake();
		materialTable = new Hashtable();
		effectList = new Array();
	}
	
	protected function updateCloudRange(){
		var rect:Rect = new Rect();
		rect.xMin = leftTop.transform.position.x;
		rect.yMin = rightBottom.transform.position.z;
		rect.xMax = rightBottom.transform.position.x;
		rect.yMax = leftTop.transform.position.z;
		
		GameMain.instance().cloudMgr.setRange(rect);
	}
	
	protected function updateBirdRange(curScaleFactor){
		var rect:Rect = new Rect();
		rect.xMin = leftTop.transform.position.x;
		rect.yMin = rightBottom.transform.position.z;
		rect.xMax = rightBottom.transform.position.x;
		rect.yMax = leftTop.transform.position.z;
		
		GameMain.instance().birdMgr.setRange(rect,curScaleFactor);
	}
		
	protected	function	sortSlot(){
		//sort by z, from big -> small
		var tmp:Array = new Array(100);
		var cnt:int = 0;
		var i:int;
		var j:int;
		var addFlag:boolean;
		
		for( var child:Transform in transform ){
			if( child.name.Contains("PosSlot") ){
//				_Global.Log( child.name + " ly:" + child.transform.localPosition.y + " y:" + child.transform.position.y );
				if( cnt == 0 ){
					tmp[0] = child;
				}else{
					addFlag = false;
					for( i = 0; i < cnt; i ++ ){
//						_Global.Log( "i:" + i + "cnt:" + cnt );
						if( child.position.z > (tmp[i] as Transform) .position.z ){
							for( j = cnt; j > i; j -- ){
								tmp[j] = tmp[j - 1];
							}
							
							tmp[ i ] = child;
							addFlag = true;
							break;
						}
					}
					if( !addFlag ){
						tmp[cnt] = child;
					}
				}
				
				cnt ++;
			}
		}
		
		for( i = 0; i < cnt; i ++ ){
			if( (tmp[i] as Transform).name == "PosSlot1" ){ //wall
				(tmp[i] as Transform).position.y = Constant.LayerY.LAYERY_WALL;
			}else{
				(tmp[i] as Transform).position.y = Constant.LayerY.LAYERY_BUILDING + 0.1*i;
			}
//			_Global.Log(tmp[i].name  
//				+ " y:"  + transform.Find( tmp[i].name ).position.y 
//				+ " localy:" + transform.Find( tmp[i].name ).localPosition.y
//			 	+ " z:" + transform.Find( tmp[i].name ).position.z);
			
		}
		
//		_Global.Log( " pos:" + transform.Find("PosSlot0").position + " lp:" + transform.Find("PosSlot0").localPosition );
	}
	
	private var onEdge:boolean;
	
	protected function move(touchTrans: Vector3) {
		if (VerifyMenu.GetInstance().gameObject.active) {
			return;
		}
		touchTrans = touchTrans * getMoveMapAddSpeed();

		var mapTrans: Vector3 = edgeCheck(touchTrans);
		MenuMgr.getInstance().MainChrom.iconHider.MapMoved(onEdge);

		if (isCameraCanMove && mapTrans.magnitude > 0.001f) {
			curCamera.transform.Translate(-mapTrans, Space.World);
		}
	}
	
	protected function moveComponentWithCamera(trans:Vector3)
	{
		
	}
	
	//check screen edge top, bottom, left and right
	protected	function	edgeCheck(trans:Vector3):Vector3{
		var ret:Vector3 = trans;
		
		var viewportTopEdge:float = Screen.height - curCamera.pixelRect.yMax;
		var viewportBottomEdge:float = curCamera.pixelRect.y;
		
//		_Global.Log(" vieqwqwportTopEdge:" + viewportTopEdge + " viewportBottomEdge:" + viewportBottomEdge );
		
		//test leftTop
		var orgWorldTransform:Transform = leftTop.transform;
		
		orgWorldTransform.Translate( trans, Space.World );
		
		onEdge = false;
		var reachLeft:boolean = false;
		var reachTop:boolean = false;
		var transScreenPos:Vector3 = curCamera.WorldToScreenPoint(orgWorldTransform.position);		
		if( transScreenPos.x > 0 ){
			transScreenPos.x = 0;
			reachLeft = true;
		}
		
		var viewportTop:int = Screen.height - viewportTopEdge;
		if( transScreenPos.y < viewportTop ){
			transScreenPos.y = viewportTop;
			reachTop = true;
		}
		
		//go back
		orgWorldTransform.Translate( trans * -1, Space.World );
		
		if( reachLeft || reachTop ){
			var transWorldPos:Vector3 = curCamera.ScreenToWorldPoint(transScreenPos);
			ret = transWorldPos - orgWorldTransform.position;
			ret.y = 0;
			onEdge = true;
		}
		
		if( !( reachLeft && reachTop ) ){
			var modifyTrans:boolean = false;
			
			//test rightBottom
			orgWorldTransform = rightBottom.transform;
			orgWorldTransform.Translate( ret, Space.World );
			transScreenPos = curCamera.WorldToScreenPoint(orgWorldTransform.position);		
			if( transScreenPos.x < Screen.width ){
				transScreenPos.x = Screen.width;
				modifyTrans = true;
			}
	
			if( transScreenPos.y > viewportBottomEdge ){
				transScreenPos.y = viewportBottomEdge;
				modifyTrans = true;
			}
	
			//go back
			orgWorldTransform.Translate( ret * -1, Space.World );
			
			if( modifyTrans ){
				transWorldPos = curCamera.ScreenToWorldPoint(transScreenPos);
				ret = transWorldPos - orgWorldTransform.position;
				ret.y = 0;
				onEdge = true;
			}
		}
		
		return ret;
	}
	
	public		function	addBuildingAnimation(slotId:int, buildingTypeId:int){
		
		destroyOldBuilding(slotId);
		
		var emptyTransform:Transform = transform.Find("PosSlot" + slotId);
		if( emptyTransform == null ){
			return null;
		}
		
		var	addObject:GameObject = instantiateBuildingAnimation(buildingTypeId);
		
		addChildObjWithBuilding( addObject, slotId, emptyTransform.localPosition);
		
		var dec:BuildingDecMgr.DecrationInfor =  BuildingDecMgr.getInstance().needDecration(buildingTypeId);
		if(dec != null)
		{
			showDecration(dec, addObject);
		}
		else
		{
			hideDecration(dec, addObject);
		}		
	}
	
	public function	OnFadeOutStart( fadeInAndOut:FadeInAndOut, userData:Hashtable)
	{
		if( PRESTIGE_EFFECT_TAG != fadeInAndOut.tag )
		{
			GameMain.singleton.TouchForbidden = true;
		}
	}
	
	public	function	OnFadeOutFinish( fadeInAndOut:FadeInAndOut, userData:Hashtable ){
		if( PRESTIGE_EFFECT_TAG != fadeInAndOut.tag )
		{
			GameMain.singleton.TouchForbidden = false;
		}
		if( fadeInAndOut != hitEffect ) return;
		var hitSlotId:int = userData["hitSlotId"];
		GameMain.instance().onHitSlot(hitSlotId);
	}
	
	protected	function	genPrestigeAni(posTransform:Transform):GameObject{
		
		
		var transAni:GameObject = Instantiate( normalBuildingPrestigeTransAni ,posTransform.position, normalBuildingPrestigeTransAni.transform.localRotation);
		transAni.SetActiveRecursively( gameObject.active );
		
//		transAni.transform.localScale.x *= curScaleFactor;
//		transAni.transform.localScale.z *= curScaleFactor;
		transAni.transform.parent = transform;
		
		return transAni;
	}
	
	public	function	addPrestigeAniWithBuilding( slotId:int, buildingTypeId:int, buildingLevel:int){
		
		//var posTransform:Transform = transform.Find("PosSlot" + slotId);
		var posTransform:Transform = transform.Find(slotId.ToString());
		if( posTransform == null ) 
		{
			posTransform = transform.Find("PosSlot" + slotId);
		}
		
		if(posTransform == null)
		{
			return;
		}
			
		//科技树不显示特效	
		if(slotId != Constant.Building.TIERLEVEUP)
		{
			posTransform.localScale.y += 0.1;
			var transAni:GameObject = genPrestigeAni( posTransform );
			if( transAni == null ) return;
		}
			
		addPrestigeEffect(slotId, buildingTypeId, buildingLevel);
//		
//		prestigeBuilding(slotId, buildingTypeId, buildingLevel);
		
//		var newObj:GameObject = addBuilding(slotId, buildingTypeId, buildingLevel);
//		var prestigeEffect:FadeInAndOut = new FadeInAndOut();
//		prestigeEffect.tag = PRESTIGE_EFFECT_TAG;
//		prestigeEffect.fadeInTime = 40;
//		prestigeEffect.fadeOutTime = 120;
//		prestigeEffect.myDelegate = this;
//		
//		var userData:Hashtable = new Hashtable();
////		userData.Add("fadeInObj", slotTransform.gameObject);
////		userData.Add("fadeOutObj", addObject);
////		userData.Add("buildingTypeId", buildingTypeId);
//		userData.Add("slotId", slotId);
//		prestigeEffect.userData = userData;
//		
//		var buildingObj:GameObject = newObj.transform.Find("" + slotId).gameObject;
//		prestigeEffect.addGameObject(buildingObj,buildingObj);
//		effectList.Add(prestigeEffect);
		
	}
	
	protected function addPrestigeEffect( slotId:int, buildingTypeId:int, buildingLevel:int ){
	
		var newObj:GameObject = addBuilding(slotId, buildingTypeId, buildingLevel);
		var prestigeEffect:FadeInAndOut = new FadeInAndOut();
		prestigeEffect.tag = PRESTIGE_EFFECT_TAG;
		prestigeEffect.fadeInTime = 40;
		prestigeEffect.fadeOutTime = 120;
		prestigeEffect.myDelegate = this;
		
		var userData:Hashtable = new Hashtable();
//		userData.Add("fadeInObj", slotTransform.gameObject);
//		userData.Add("fadeOutObj", addObject);
//		userData.Add("buildingTypeId", buildingTypeId);
		userData.Add("slotId", slotId);
		prestigeEffect.userData = userData;

		var parentObj:GameObject = newObj.transform.Find(slotId.ToString()).gameObject;
		var buildingObj:GameObject;
		if(buildingTypeId != Constant.Building.WALL)
		{
			var nameSpr:String = Building.instance().getBuildingImgName(GameMain.instance().getCurCityOrder(), buildingTypeId, buildingLevel);
			if(parentObj.transform.Find(nameSpr) != null)
			{
				buildingObj = parentObj.transform.Find(nameSpr).gameObject;			
			}
			else
			{
				buildingObj = parentObj;			
			}
		}
		else
		{
			buildingObj = parentObj.transform.Find("wall").gameObject;
		}

		if(buildingObj == null)
		{
			Debug.Log("This prefab missed TKsprite");
			return;
		}
		
		prestigeEffect.addGameObject(buildingObj,buildingObj);
		effectList.Add(prestigeEffect);
		SoundMgr.instance().PlayEffect("KBN_elevate", /*TextureType.AUDIO*/"Audio/");
	}

//	protected function prestigeBuilding(slotId:int, buildingTypeId:int, buildingLevel:int){
//	
//		var posTransform:Transform = transform.Find("PosSlot" + slotId);
//		if( posTransform == null ) return;
//		
//		var	slotTransform:Transform = transform.Find("" + slotId );
//		if( slotTransform == null ) return;
//		
//		var oldObjTransform:Transform = slotTransform.Find("" + slotId );
//		if( oldObjTransform == null ) return;
//		
//		var oldObj:GameObject = oldObjTransform.gameObject;
//		var	addObject:GameObject = instantiateBuilding(buildingTypeId, buildingLevel);
////		addChildObjWithBuilding( addObject, slotId, posTransform.position);
//		addObject.transform.position = posTransform.position;
//		addObject.transform.parent = transform;
//		addObject.transform.localScale.x *= curScaleFactor;
//		addObject.transform.localScale.z *= curScaleFactor;
//		
//		addObject.SetActiveRecursively(false);
//		
//		var prestigeEffect:FadeInAndOut = new FadeInAndOut();
//		prestigeEffect.tag = PRESTIGE_EFFECT_TAG;
//		prestigeEffect.fadeInTime = 40;
//		prestigeEffect.fadeOutTime = 120;
//		prestigeEffect.myDelegate = this;
//		
//		var userData:Hashtable = new Hashtable();
//		userData.Add("fadeInObj", slotTransform.gameObject);
//		userData.Add("fadeOutObj", addObject);
//		userData.Add("buildingTypeId", buildingTypeId);
//		userData.Add("slotId", slotId);
//		prestigeEffect.userData = userData;
//		
//		prestigeEffect.addGameObject(oldObj,addObject.transform.Find("building").gameObject);
////		prestigeEffect.addGameObject(oldObj,addObject.transform.Find("" + slotId).gameObject);
//		
//		effectList.Add(prestigeEffect);
//	}
	
	public	function	addBuilding(slotId:int, buildingTypeId:int, buildingLevel:int):GameObject{
//		_Global.Log(" add building slotId:" + slotId + " buildingTypeid:" + buildingTypeId );
	 

		destroyOldBuilding(slotId);
		
		var emptyTransform:Transform = transform.Find("PosSlot" + slotId);
		if( emptyTransform == null ){
			return null;
		}

		var	addObject:GameObject;
		if(slotId == Constant.Hero.HeroHouseSlotId)
		{
			addObject= instantiateHeroHouse();
		}
		else if(slotId == Constant.Building.AVAOUTPOST)
		{
			addObject= instantiateAvaOutPost();
		}
		else if( slotId == 33 ) // Notice Pad
		{
			addObject = instantiateNoticePad( emptyTransform );
		}
		else if (slotId==Constant.Building.MONSTER&&GameMain.instance().isMainCity()) {
			addObject=instantiateMonter(emptyTransform);
		}
		else if (slotId==Constant.Building.MONTHLYCARD&&GameMain.instance().isMainCity()) {
			addObject=instantiateMonthlyCard(emptyTransform);
		}
		else if(slotId == Constant.Building.TIERLEVEUP){ //科技树technology
			addObject =	instantiateTechnologyTree(emptyTransform,buildingTypeId,buildingLevel);
		}
		else
		{
			addObject= instantiateBuilding(buildingTypeId, buildingLevel);	
		}
		
		if(addObject == null)
		{
			return;
		}
				
		addChildObjWithBuilding( addObject, slotId, emptyTransform.localPosition); 
		
		setAnimation(buildingTypeId, addObject, slotId);
		
		var dec:BuildingDecMgr.DecrationInfor =  BuildingDecMgr.getInstance().needDecration(buildingTypeId);
		if(dec != null)
		{
			showDecration(dec, addObject);
		}
		else
		{
			hideDecration(dec, addObject);
		}
		AddBuildingObj(slotId,addObject);
		
		//set level obj inactive
		var levelTrans:Transform = addObject.transform.Find("level");
		if(levelTrans != null)
		{
			levelTrans.gameObject.SetActiveRecursively(false);
		}
		
		return addObject;
		
	}
	//初始化魔物迷宫
	public function instantiateMonter( posSlot :Transform ):GameObject
	{
		var monsterSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Monster", Constant.AnimationSpriteType.Building);			
		if(monsterSpr != null)
		{
			var parent = Instantiate( posSlot );
			var noticePadSprCloned = Instantiate(monsterSpr);
			noticePadSprCloned.name = "building";
			noticePadSprCloned.transform.parent = parent;
			noticePadSprCloned.transform.localPosition = new Vector3(0f, 0f, 2.5f);
			monsterSpr = null;
			MaterialColorScheme.instance.ApplyColorScheme(noticePadSprCloned, "CityBuilding"); //?
			
			TextureMgr.instance().unloadUnusedAssets();
			return parent.gameObject;
		}
		return noticePadSprCloned.transform.parent.gameObject;
	}
	//初始化月卡
	public function instantiateMonthlyCard( posSlot :Transform ):GameObject
	{

		var monsterSpr:GameObject = TextureMgr.instance().loadAnimationSprite("MonthCard", Constant.AnimationSpriteType.Building);			
		if(monsterSpr != null)
		{
			var parent = Instantiate( posSlot );
			var noticePadSprCloned = Instantiate(monsterSpr);
			noticePadSprCloned.name = "building";
			noticePadSprCloned.transform.parent = parent;

			noticePadSprCloned.transform.localPosition = new Vector3(0f, 0f, 3f);
			monsterSpr = null;
			MaterialColorScheme.instance.ApplyColorScheme(noticePadSprCloned, "CityBuilding"); //?
			
			TextureMgr.instance().unloadUnusedAssets();
			return parent.gameObject;
		}
		return noticePadSprCloned.transform.parent.gameObject;
	}

	//初始化科技树
	public function instantiateTechnologyTree( posSlot :Transform, buildingTypeId:int, buildingLevel:int):GameObject
	{
//		var isTechOpen : boolean = Technology.instance().isTechOpen();
//		if(!isTechOpen )
//		{
//			return;
//		}
//		
		var isHaveTechBuildingData : boolean = Technology.instance().isHaveTechBuildingData();
		if(!isHaveTechBuildingData)
		{
			return;
		}
		
		var obj = instantiateBuilding(buildingTypeId, buildingLevel);
		if(obj != null)
		{
			var parent = Instantiate( posSlot );
			obj.transform.parent = parent;
			obj.transform.localPosition = new Vector3(0f, 0f, 0f);
		}
		
		return obj;
//		var nameSpr:String = Building.instance().getBuildingImgName(GameMain.instance().getCurCityOrder(), buildingTypeId, buildingLevel);
//		//var nameSpr:String = "c1_23_3_1";
//		var monsterSpr:GameObject = TextureMgr.instance().loadAnimationSprite(nameSpr, Constant.AnimationSpriteType.Building);			
//		if(monsterSpr != null)
//		{
//			var parent = Instantiate( posSlot );
//			var noticePadSprCloned = Instantiate(monsterSpr);
//			noticePadSprCloned.name = "building";
//			noticePadSprCloned.transform.parent = parent;
//			noticePadSprCloned.transform.localPosition = new Vector3(0f, 0f, 0f);
//			monsterSpr = null;
//			MaterialColorScheme.instance.ApplyColorScheme(noticePadSprCloned, "CityBuilding"); //?
//			
//			TextureMgr.instance().unloadUnusedAssets();
//			return parent.gameObject;
//		}
//		return noticePadSprCloned.transform.parent.gameObject;
	}
			
	public function showDecration(decInfor:BuildingDecMgr.DecrationInfor, obj:GameObject):void
	{
		var child:GameObject;
		
		if(obj != null)
		{
			priv_showDecrationWithObj(decInfor, obj);
			return;
		}

		if ( decInfor.slotId >= 0 )
		{
			var gObj:GameObject = this.transform.Find(decInfor.slotId + "").gameObject;
			priv_showDecrationWithObj(decInfor, gObj);
		}

		var curCityId:int = GameMain.instance().getCurCityId();
		var objs : Array = Building.instance().getAllOfType(decInfor.buildingType, curCityId);
		var slotField : String = _Global.ap + "2";

		for (var buildObj : HashObject in objs)
		{
			var slot : int = _Global.INT32(buildObj[slotField]);
			var slotObj:GameObject = this.transform.Find(slot.ToString()).gameObject;
			priv_showDecrationWithObj(decInfor, slotObj);
		}
	}
	
	private function priv_showDecrationWithObj(decInfor:BuildingDecMgr.DecrationInfor, gObj : GameObject):void
	{
		if ( gObj == null )
			return;
		var child:GameObject = gObj.transform.Find("decration").gameObject;
		if(child == null)
			return;
			
		var decorationSpr:GameObject = TextureMgr.instance().loadAnimationSprite(decInfor.textureName, Constant.AnimationSpriteType.Decoration);
		if(decorationSpr != null)
		{
			decorationSpr = Instantiate(decorationSpr);
			decorationSpr.name = decInfor.textureName;
			decorationSpr.transform.parent = child.transform;
			decorationSpr.transform.localPosition = new Vector3(0, 1, 1);
			decorationSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
			decorationSpr.transform.localScale = new Vector3(1, 1, 1);			
		}
	}
	
	public function hideDecration(decInfor:BuildingDecMgr.DecrationInfor, obj:GameObject):void
	{
		if(obj != null)
		{
			priv_hideDecrationWithObj(decInfor, obj);
			return;
		}

		if ( decInfor.slotId >= 0 )
		{
			var gObj:GameObject = this.transform.Find(decInfor.slotId + "").gameObject;
			priv_hideDecrationWithObj(decInfor, gObj);
			return;
		}

		var curCityId:int = GameMain.instance().getCurCityId();
		var objs : Array = Building.instance().getAllOfType(decInfor.buildingType, curCityId);
		var slotField : String = _Global.ap + "2";

		for (var buildObj : HashObject in objs)
		{
			var slot : int = _Global.INT32(buildObj[slotField]);
			var slotObj:GameObject = this.transform.Find(slot.ToString()).gameObject;
			priv_hideDecrationWithObj(decInfor, slotObj);
		}
	}

	private function priv_hideDecrationWithObj(decInfor:BuildingDecMgr.DecrationInfor, gObj : GameObject):void
	{
		if ( gObj == null )
			return;
		var trans:Transform = gObj.transform.Find("decration");
		if(trans == null)
			return;		
		for(var child:Transform in trans)
			Destroy(child.gameObject);
	}

	protected	function	addChildObjWithBuilding( child:GameObject, slotId:int, position:Vector3 ){
		child.SetActiveRecursively( gameObject.active );
		child.transform.parent = transform.Find("buildsParent");
		child.transform.localPosition = position;
		child.transform.localScale = new Vector3(1, 1, 1);
		child.transform.parent = transform;
		
//		child.transform.localScale.x *= curScaleFactor;
//		child.transform.localScale.z *= curScaleFactor;
		
		var buildingTrans:Transform = child.transform.Find("building");
		if(buildingTrans != null)
		{
			buildingTrans.name = "" + slotId;
		}
		child.name = "" + slotId;
	}
	
	public	function	removeBuilding(slotId:int){
//		_Global.Log("removebuilding from map");
	
		addBuilding(slotId, Constant.Building.GROUND, 0);
	}
	
	//remove old building or buildingAnimation
	protected		function	destroyOldBuilding(slotId:int){
		var	child:Transform = transform.Find("" + slotId );
//		_Global.Log(" child == null:" + (child == null) + " slotid:" + slotId );
		if( child == null )
			return;
		
		var object:GameObject = child.gameObject;
//		_Global.Log(" Destroy obj !");
		Destroy(object);
		object.name = "Destroyed";
		object.transform.name = "Destroyed";
	}
		
	protected function setAnimation(_buildingTypeId:int, _obj:GameObject, _slotId:int):void
	{
		var hasAnimation:boolean = false;
		var needShowAnimation : boolean = false;
		var queueItem:QueueItem;
		switch(_buildingTypeId)
		{
			case Constant.Building.ACADEMY:
				queueItem = Research.instance().getItemAtQueue(0,GameMain.instance().getCurCityId());
				needShowAnimation = queueItem != null;
				hasAnimation = true;
				break;
			case Constant.Building.BARRACKS:
				queueItem = Barracks.instance().Queue.FirstByCityId(GameMain.instance().getCurCityId());
				needShowAnimation = queueItem != null;
				hasAnimation = true;
				break;
			case Constant.Building.HOSPITAL:
				needShowAnimation = HealQueue.instance().NeedShowAnimation;
				hasAnimation = true;
				break;
			case Constant.Building.TECHNOLOGY_TREE:
				queueItem = Technology.instance().getFirstQueue();
				needShowAnimation = queueItem != null;
				hasAnimation = true;
				break;
		}

		if(!hasAnimation)
		{
			return;
		}
		
		var child:GameObject = _obj.transform.Find("" + _slotId).gameObject;
		if(needShowAnimation)
		{	
			child.SendMessage("SetState", Constant.BuildingAnimationState.Open, SendMessageOptions.DontRequireReceiver);
		}
		else
		{
			child.SendMessage("SetState", Constant.BuildingAnimationState.Close, SendMessageOptions.DontRequireReceiver);
		}					
	}
	
	protected	function	instantiateBuilding(buildingTypeId:int, level:int):GameObject
	{}
	
	protected function instantiateHeroHouse():GameObject
	{
	}
	protected function instantiateNoticePad( parent:Transform ):GameObject
	{
	}
	
	protected function instantiateAvaOutPost():GameObject
	{
	}
	
	public function playAnimationOfSprite(buildingTypeId:int):void
	{}
	
//	protected function instantiateWater():GameObject
//	{
//		var sceneLevel:int = GameMain.instance().getSceneLevel();
//		var waterName:String;
//		switch(sceneLevel)
//		{
//			case CITY_SCENCE_LEVEL:
//				waterName = "city_";
//				break;
//			case FIELD_SCENCE_LEVEL:
//				waterName = "field_";
//				break;
//		}
//		
//		var order:int = GameMain.instance().getCurCityOrder();
//		
//		waterName += order;
//		
//		var waterObj:GameObject = TextureMgr.instance().loadAnimationSprite(waterName, Constant.AnimationSpriteType.Water);
//		
//		if(waterObj != null)
//		{	
//			return waterObj;
//		}
//		else
//		{
//			return null;
//		}
//	}

	protected function instantiateBuildingAnimation(buildingTypeId:int):GameObject
	{
		var gObj:GameObject;
		
		gObj = Instantiate(normalBuildingAni);
		
		if(buildingTypeId != Constant.Building.WALL)
		{				
			var animationSpr:GameObject = TextureMgr.instance().loadAnimationSprite("b_ani1_bg", Constant.AnimationSpriteType.BuildingAnimation);		
			if(animationSpr != null)
			{
				animationSpr = Instantiate(animationSpr);
				animationSpr.name = "building";
				animationSpr.transform.parent = gObj.transform;			
				animationSpr.transform.localPosition = new Vector3(0, 0, 0);
				animationSpr.transform.localRotation = new Quaternion(0, 0, 0, 0);
				animationSpr.transform.localScale = new Vector3(1, 1, 1);			
			}		
		}
		
		return gObj;
	}
	
	public	function hitSlot(raycastHit:RaycastHit){
		if(raycastHit.transform.name == "LoadingCampaign")
		{
			return;
		}
		ParticalEffectMgr.getInstance().playEffect(ParticalEffectMgr.ParticalEffectType.snow);
		
		if( raycastHit.transform.parent.name == "building" 
			|| (hitEffect!= null && !hitEffect.finished()) ){
			return;
		}
		
		var hitSlotId:int;
		var strName:String = raycastHit.transform.parent.name;
//		if(strName.StartsWith("Chapter_"))
//		{
//			var strList:String[] = strName.Split("_"[0]);
//			if(strList.Length <2 ) return;
//			hitSlotId = _Global.INT32( strList[1] );
//		}
//		else
//		{
			hitSlotId = _Global.INT32( raycastHit.transform.parent.name );
//		}
		
		for( var effect:FadeInAndOut in effectList ){
			if( effect.tag == PRESTIGE_EFFECT_TAG && effect.userData["slotId"] == hitSlotId ){
				return;
			}
		}
		addHitEffect(raycastHit.transform.gameObject, hitSlotId);
		
		if(GameMain.instance().curSceneLev() != GameMain.CAMPAIGNMAP_SCENE_LEVEL)
			SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");
	}
	
	public	function	addHitEffect(obj:GameObject, slotId:int){
		if( !hitEffect ){
			hitEffect  = new FadeInAndOut();
			hitEffect.myDelegate = this;
			hitEffect.userData = new Hashtable();
		}
		
		effectList.Add(hitEffect);
		
		hitEffect.userData.Clear();
		hitEffect.userData.Add("hitSlotId", slotId);
			
		hitEffect.addGameObject(obj, obj);
	}

	public function Update(){
		if( !GameMain.instance() ){
			return;
		}
		
		super.Update();
		
//		GameMain.instance().cloudMgr.Update();
//		GameMain.instance().birdMgr.Update();
//		GameMain.instance().rainMgr.Update();
		GameMain.instance().updateAni();
		
		for( var i:int = effectList.length - 1; i >=0; i -- ){
			var curEffect:FadeInAndOut = effectList[i];
			if( curEffect != null ){
				if( curEffect.finished() )
				{
					effectList.RemoveAt(i);
					if( PRESTIGE_EFFECT_TAG != curEffect.tag )
					{
						GameMain.singleton.TouchForbidden = false;
					}
				}
				else
				{
					curEffect.Update();
				}
			}
		}
		
		if( moveSpeed.magnitude > moveAcceleration.magnitude ){
			moveSpeed -= moveAcceleration;
			move(moveSpeed);
		}
	}
	
	public function SetCityCameraPos(pos : Vector2)
	{
		curScaleFactor = 14;
		curCamera.transform.localPosition = new Vector3(pos.x,curCamera.transform.localPosition.y,pos.y);
		actScale();
	}
		
	public	function	getSlotScreenPos(slotId:int):Vector2{
		var	child:Transform = transform.Find("PosSlot" + slotId );
		if( child == null ){
			return Vector2.zero;
		}
		
		var screenPos:Vector3 = curCamera.WorldToScreenPoint( child.position );
		//_Global.Log("Camera Slot:" + slotId + " POS: " + screenPos.x + "/" + screenPos.y);
		//_Global.Log("Child POS:" + child.position.x + ":" + child.position.y + ":" + child.position.z);
		//_Global.Log("Camera POS:" + curCamera.transform.position.x + ":" + curCamera.transform.position.y + ":" + curCamera.transform.position.z);
		
		
		return new Vector2( screenPos.x, screenPos.y );
	}
	
	public function getBuildingPos(slotId:int):Vector2
	{
		var	parent:Transform = transform;
		if( parent == null ){
			return Vector2.zero;
		}
		
		var child : Transform = parent.Find(slotId.ToString() + "/" + slotId.ToString());
		if( child == null ){
			return Vector2.zero;
		}
		
		var screenPos:Vector3 = curCamera.WorldToScreenPoint( child.position );

		return new Vector2( screenPos.x, screenPos.y );
	}
	
	protected	function actScale(){
		super.actScale();
		if( curScaleFactor > 0.7f ){
			if( GameMain.instance().cloudMgr.isEnabled() ){
				GameMain.instance().cloudMgr.setEnable(false);
			}
			
		}else{
			updateCloudRange();
			updateBirdRange(curScaleFactor);
			
			//after updateCloudRange
			if( !GameMain.instance().cloudMgr.isEnabled() ){
				GameMain.instance().cloudMgr.setEnable(true);
			}
			
			if(!GameMain.instance().birdMgr.isEnabled())
			{
				GameMain.instance().birdMgr.setEnable(true);
			}
		}
	}
	
	private		var		moveAcceleration:Vector3;
	private		var		moveSpeed:Vector3;
	public	function	onTouchBegin(touchPos:Vector2){
		moveSpeed = Vector3.zero;
		moveAcceleration = Vector3.zero;
	}
	
	protected function onMoveBegin(touch:Touch){
		
		SetLevelObjsVisible(true);
	}
	
	protected	function	onMoveEnd(touch:Touch){
		moveSpeed = getInputMoveWorldDis();
		moveAcceleration = moveSpeed*0.1;
		SetLevelObjsVisible(false);
	}

	public function toFront() {

		GameMain.singleton.TouchForbidden = false;
		GameMain.singleton.ForceTouchForbidden = false;
		ResetState();
		
		gameObject.SetActiveRecursively(true);
		curCamera.gameObject.SetActive(true);
		
		updateCloudRange();
		updateBirdRange(curScaleFactor);
		SetLevelObjsVisible(false);
	}
	
	public	function	toBack(){
		gameObject.SetActiveRecursively(false);
		curCamera.gameObject.SetActive(false);
	}
	
	protected function showLevelObj(levelObj:GameObject,iLevel_H:int,iLevel_L:int,prestige:int)
	{	
				
		var shieldSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Shield", Constant.AnimationSpriteType.Decoration);
		if(shieldSpr != null)
		{
			shieldSpr = Instantiate(shieldSpr, levelObj.transform);
			shieldSpr.name = "Shield";
			shieldSpr.transform.localPosition = Vector3.zero;
			shieldSpr.transform.localRotation = Quaternion.identity;
			shieldSpr.transform.localScale = Vector3.one;			
		}	

		var lowLevelSpr:GameObject = TextureMgr.instance().loadAnimationSprite("lv" + iLevel_L, Constant.AnimationSpriteType.Decoration);
		if(lowLevelSpr != null)
		{			
			lowLevelSpr = Instantiate(lowLevelSpr, levelObj.transform);
			lowLevelSpr.name = "level_l";
			lowLevelSpr.transform.localPosition = Vector3.up;
			lowLevelSpr.transform.localRotation = Quaternion.identity;
			lowLevelSpr.transform.localScale = Vector3.one;			
		}	
		
		var highLevelSpr:GameObject; 
		if(iLevel_H > 0)
		{		
			lowLevelSpr.transform.localPosition.x = 0.11;
			
			highLevelSpr = TextureMgr.instance().loadAnimationSprite("lv" + iLevel_H, Constant.AnimationSpriteType.Decoration);
			if(highLevelSpr != null)
			{
				highLevelSpr = Instantiate(highLevelSpr, levelObj.transform);
				highLevelSpr.name = "level_h";
				highLevelSpr.transform.localPosition = new Vector3(-0.11, 1, 0);
				highLevelSpr.transform.localRotation = Quaternion.identity;
				highLevelSpr.transform.localScale = Vector3.one;			
			}
		}
		
		if(prestige > 0)
		{
			lowLevelSpr.transform.localPosition.z = -0.12;
			if(highLevelSpr != null)
			{
				highLevelSpr.transform.localPosition.z = -0.12;
			}
			
			var starSpr:GameObject = TextureMgr.instance().loadAnimationSprite("Star" + prestige, Constant.AnimationSpriteType.Decoration);
			if(starSpr != null)
			{
				starSpr = Instantiate(starSpr, levelObj.transform);
				starSpr.name = "prestigeLv";
				starSpr.transform.localPosition = Vector3.up;
				starSpr.transform.localRotation = Quaternion.identity;
				starSpr.transform.localScale = Vector3.one;			
			}
		}
		MaterialColorScheme.instance.ApplyColorScheme(levelObj, "CityBuilding");
		
	}
	
	public function CreateAnimation(name:String,type:String,positon:Vector3,y:float):GameObject
	{
		var aniSpr:GameObject = null;
		var aniSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(name, type);
		if(aniSprTmp != null)
		{
			aniSpr = Instantiate(aniSprTmp);
			aniSprTmp = null;
			aniSpr.transform.position = positon;
			aniSpr.transform.position.y = y;
			aniSpr.name = name;
		}
		TextureMgr.instance().unloadUnusedAssets();
		return aniSpr;
	}
	
	public function CreateAnimation(name:String,type:String,parentTrans:Transform,positon:Vector3,rotation:Quaternion):GameObject
	{
		var aniSpr:GameObject = null;
		var aniSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(name, type);
		if(aniSprTmp != null)
		{
			aniSpr = Instantiate(aniSprTmp);
			aniSprTmp = null;
			aniSpr.transform.parent = parentTrans;
			aniSpr.transform.localPosition = positon;
			aniSpr.transform.localRotation = rotation;
			aniSpr.name = name;	
		}
		TextureMgr.instance().unloadUnusedAssets();
		return aniSpr;
	}
	
	public function DestroyAnimation(name:String,parentTrans:Transform)
	{
		var obj:GameObject;
		if(parentTrans != null)
		{
			obj = parentTrans.Find(name).gameObject;
			if(obj != null)
			{
				Destroy(obj);
			}
		}
		else
		{
			obj = GameObject.Find(name);
			if(obj != null)
			{
				Destroy(obj);
			}
		}
	}
	
	protected function AddBuildingObj(slotId:int,obj:GameObject)
	{
		if(buildingObjs.ContainsKey(slotId))
		{
			buildingObjs[slotId] = obj;
		}
		else
		{
			buildingObjs.Add(slotId,obj);
		}
	}
	
	public function SetLevelObjsVisible(bVisible:boolean)
	{
		var levelTrans:Transform;
		for(var buildingObj in buildingObjs.Values)
		{
			if(buildingObj!=null)
			{
				levelTrans = buildingObj.transform.Find("level");
				if(levelTrans != null)
				{
					levelTrans.gameObject.SetActiveRecursively(bVisible);
				}
				for(var j:int=1;j<=3;j++)
				{
					levelTrans = buildingObj.transform.Find("levelPos"+j);
					if(levelTrans != null)
					{
						levelTrans.gameObject.SetActiveRecursively(bVisible);
					}
				}
			}
		}
	}
	/************************************************************************************************************************************************************/
	/*在 getseed 的数据中 查找 城堡是否 使用了 城堡皮肤道具,如果使用的话 就返回 城堡皮肤相关联的数据,如果 未使用，则返回 空数据 */
	public function GetUsedCitySkinDataBySeedData(citySkinsData: HashObject): HashObject {

		if (citySkinsData == null) {
			citySkinsData = GameMain.instance().GetCurrentCitySkinsData();
		}

		if (citySkinsData == null)
			return null;

		var keys: String[] = _Global.GetObjectKeys(citySkinsData);

		for (var j: int = 0; j < keys.Length; j++) {
			var data: HashObject = citySkinsData[keys[j]];

			/*查找 使用皮肤的数据*/
			if (data.Contains("inuse") && _Global.INT32(data["inuse"].Value) == 1) {
				return data;
			}
		}


		return null;
	}

	/*使用的是 默认的皮肤*/
	public function IsUsedDefaultSkin(citySkinData: HashObject): boolean {
	
		return citySkinData.Contains("isdefault") && _Global.INT32(citySkinData["isdefault"].Value) == 1 ;
		
	}
	/************************************************************************************************************************************************************/

}


