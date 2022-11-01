import System.Collections.Generic;
import UnityEngine;
class MapMoveAnimMgr extends KBN.MapMoveAnimMgr
{

	public var X_ADJUSTMENT : float = 1f;
	public var Z_ADJUSTMENT : float = 0.36f;
	private var curMovementList:Array;
	
	private var marchNum:Array;
	private var cityIdArray:Array;
	
	public function init():void
	{
		super.init();
		
		cityIdArray = new Array();
		curMovementList = new Array();
		marchNum = new Array();
		
		var	cities:HashObject = seed["cities"];
		var cityInfo:HashObject;
	

		for(var i:int = 0; i < GameMain.instance().getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];	
			cityIdArray.Add(_Global.INT32(cityInfo[_Global.ap+0]));
			marchNum.Add((RallyPoint.instance().getMoveMentList(_Global.INT32(cityInfo[_Global.ap+0])) as Array).length );
			m_MovementDic.Add(i,RallyPoint.instance().getMoveMentList(_Global.INT32(cityInfo[_Global.ap+0])));
		}
	}
	
	function Update () 
	{
		if(!isInitDone)
			return;
			
		var curMoveObj:GameObject;
		var animComp:MapMoveAnim; 
		if(GameMain.instance() == null)
			return;
		
		if(seed["closeMoveAnim"])
		{
			if(_Global.INT32(seed["closeMoveAnim"].Value) == 0)
				return;
		}	
			
		if(GameMain.unixtime() > lastUnixTime)
		{
			lastUnixTime = GameMain.unixtime();
			timeRemainingMS = GameMain.unixtime();
		}
			
		timeRemainingMS += Time.deltaTime;
		for(var i:int = 0;i < GameMain.instance().getCitiesNumber();i++)
		{
			curMovementList = RallyPoint.instance().getMoveMentList(_Global.INT32(cityIdArray[i]));
			checkUpdateObjList(i);
			marchNum[i] = curMovementList.length;
			if(curMovementList.length>0)
			{
				for(var j:int = 0; j< curMovementList.length; j++)
				{
					var mvo:MarchVO = curMovementList[j] as MarchVO;
					// 集结等待时间不显示线和马
					if(mvo.marchStatus == Constant.MarchStatus.RALLY_WAITING)
					{
						if(MoveObjList.Contains(mvo.marchId))
						{
							deactiveObj(mvo.marchId);
						}
						continue;
					}
					
					if(mvo.toXCoord<0 || mvo.toYCoord<0) continue;
					var fromCoor:Vector2;
					var toCoor:Vector2;
					
					fromCoor = GameMain.instance().getCurCityCoor(mvo.fromCityId);
					toCoor = new Vector2(mvo.toXCoord , mvo.toYCoord);
					
					AddObj(mvo); 
					
					curMoveObj = (MoveObjList[mvo.marchId] as GameObject);
					animComp = curMoveObj.GetComponent("MapMoveAnim") as MapMoveAnim; 
					animComp.setMarchType( mvo.marchType );
					animComp.setMarchWorldBossId(mvo.worldBossId);
					
					// Check the dest tile type
					var destType : MapMoveAnim.DestType = MapMoveAnim.DestType.TILE_1x1;
					if( mvo.toTileType == Constant.TileType.CITY ) {
						destType = MapMoveAnim.DestType.CITY_1x1;
					} else if( mvo.toTileType >= Constant.TileType.WORLDMAP_2X2_LT_DUMMY &&
								mvo.toTileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT ) {
						destType = MapMoveAnim.DestType.TILE_2x2;
					} else if( mvo.toTileType == Constant.TileType.WORLDMAP_2X2_KEY_TILE ) {
						destType = MapMoveAnim.DestType.TILE_2x2;
					}
					
					switch(mvo.marchStatus)
					{
						case Constant.MarchStatus.OUTBOUND:
						case Constant.MarchStatus.RALLYING:
							activeObj(mvo.marchId);
							if(mvo.marchType == Constant.MarchType.SURVEY) 
							{ 
								animComp.setMoveState(MapMoveAnim.MoveState.Surveying, destType); 
							}
							else if(mvo.marchType == Constant.MarchType.TRANSPORT)
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Transport, destType);
							}
							else if(mvo.marchType == Constant.MarchType.COLLECT )
							{

								animComp.setMoveState(MapMoveAnim.MoveState.Collect, destType);
							}
							else if( mvo.marchType == Constant.MarchType.COLLECT_RESOURCE)
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Collect_Resource, destType);
							}
							else
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Moving, destType); 
							}
							break;
							
						case Constant.MarchStatus.WAITING_FOR_REPORT://fighting 
							if(mvo.marchType == Constant.MarchType.ATTACK || mvo.marchType == Constant.MarchType.SCOUT 
							|| mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK)
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Fighting, destType);
								if(mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK)
								{
									if(!mvo.isFighting)
									{
										mvo.isFighting = true;
										mvo.fightingTime = GameMain.unixtime();
//										_Global.LogWarning("MapMoveAnimMgr.Update marchId : " + mvo.marchId + " isFighting : "
//										+ mvo.isFighting + " fightingTime : " + mvo.fightingTime);
									}					
								}
							}
							else if( mvo.marchType == Constant.MarchType.SURVEY ) {
								animComp.setMoveState(MapMoveAnim.MoveState.Defending, destType);
							}
							else if(mvo.marchType == Constant.MarchType.COLLECT )
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Collect, destType);
//								break;
							}
							else if(mvo.marchType == Constant.MarchType.COLLECT_RESOURCE){
								animComp.setMoveState(MapMoveAnim.MoveState.Collect_Resource, destType);

							}
							else
								animComp.setMoveState(MapMoveAnim.MoveState.Defending, destType);
							break;
							
						case Constant.MarchStatus.DEFENDING://Defending 
							var EncampedmoveObj:GameObject = (MoveObjList[mvo.marchId] as GameObject);
							animComp.setMoveState(MapMoveAnim.MoveState.Defending, destType);
							break;
							
						case Constant.MarchStatus.RETURNING://returning 
						case Constant.MarchStatus.SITUATION_CHANGED:
							
							var moveObj:GameObject = (MoveObjList[mvo.marchId] as GameObject);
				
							fromCoor = new Vector2(mvo.toXCoord , mvo.toYCoord); 
							toCoor = GameMain.instance().getCurCityCoor(mvo.fromCityId);	
							//animComp.gameObject.transform.Rotate(0,180,0);
							if(mvo.marchType == Constant.MarchType.COLLECT )
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Collect, destType);
							}
							else if( mvo.marchType == Constant.MarchType.COLLECT_RESOURCE){
								animComp.setMoveState(MapMoveAnim.MoveState.Collect_Resource, destType);
							}
							else
							{
								animComp.setMoveState(MapMoveAnim.MoveState.Returning, destType, mvo.isWinner);
							}
							break;
						
						default:
							deactiveObj(mvo.marchId);
							break;
					}

					if(!curMoveObj.activeSelf)
					{
						return;
					}
					
					if((mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK) && 
					(mvo.marchStatus == Constant.MarchStatus.RETURNING || mvo.marchStatus == Constant.MarchStatus.OUTBOUND) && mvo.isSocketMarchData)
					{
						fromCoor = new Vector2(mvo.fromXCoord , mvo.fromYCoord); 
						toCoor = new Vector2(mvo.toXCoord , mvo.toYCoord); 
					}
					
//					UnityEngine.Debug.LogWarning("MapMoveAnimMgr  mvo.needed : " + mvo.needed);
					if(mvo.needed == 0)
					{
						mvo.needed = mvo.endTime - mvo.startTime;
					}
					var ver:Vector2 = new Vector2( (toCoor.x - fromCoor.x)/_Global.FLOAT(mvo.needed) , (toCoor.y - fromCoor.y)/_Global.FLOAT(mvo.needed));
					var curTime:double = mvo.endTime - timeRemainingMS;
					if(curTime < 0)
					{
						curTime = 0;
					}
					var coorX:float = toCoor.x - curTime*ver.x;
					var coorY:float = toCoor.y - curTime*ver.y;
				
					if(mvo.marchStatus == Constant.MarchStatus.DEFENDING || mvo.marchStatus == Constant.MarchStatus.WAITING_FOR_REPORT || mvo.marchType == Constant.MarchStatus.RETURNING || 
							(mvo.marchStatus == Constant.MarchStatus.OUTBOUND && mvo.marchType == Constant.MarchType.SURVEY ))
					{
						coorX = toCoor.x;
						coorY = toCoor.y;
					}
					
//					UnityEngine.Debug.LogWarning("MapMoveAnimMgr  xOrg : " + xOrg + " tileWorldWidth : " + tileWorldWidth + 
//					" yOrg : " + yOrg + " tileWorldHeight : " + tileWorldHeight + " coorX : " + coorX + " coorY : " + coorY);
					curMoveObj.transform.position = new Vector3(xOrg + tileWorldWidth*(coorX-1) + tileWorldWidth * 0.5f, 
																0, 
																yOrg - tileWorldHeight*(coorY-1) + tileWorldHeight * 0.5f) 
													+ troopOffset;
//					UnityEngine.Debug.LogWarning("MapMoveAnimMgr  curMoveObj.transform.position : " + curMoveObj.transform.position);
					
					var fromX : float = xOrg + tileWorldWidth * ( fromCoor.x - 1 ) + tileWorldWidth * 0.5f;
					var fromZ : float = yOrg - tileWorldHeight * ( fromCoor.y - 1 ) + tileWorldHeight * 0.5f;
					var toX : float = xOrg + tileWorldWidth * ( toCoor.x - 1 ) + tileWorldWidth * 0.5f;
					var toZ : float = yOrg - tileWorldHeight * ( toCoor.y - 1 ) + tileWorldHeight * 0.5f;
					animComp.setTileFromTo( fromCoor.x, fromCoor.y, toCoor.x, toCoor.y );
					animComp.setFromTo( new Vector3( fromX, 0f, fromZ ) + troopOffset,
										new Vector3( toX, 0f, toZ ) + troopOffset );
				}
			}
		}
	}
	
	private function checkUpdateObjList(index:int):void
	{
		var removeList:System.Collections.Generic.List.<int> = new System.Collections.Generic.List.<int>();
		if(_Global.INT32(marchNum[index]) > curMovementList.length)
		{
			for(var i:System.Collections.DictionaryEntry in MoveObjList)
			{  		
				if(curMovementList.length == 0)
				{
					var deleteCityId:int = _Global.INT32(cityIdArray[index]);

					if(MarchIdsToCity[i.Key] == deleteCityId)
					{
						removeList.Add(i.Key);
					}
					continue;
				}
				
				
				var flag = true;
				for(var j:int = 0; j< curMovementList.length; j++)
				{ 
					var marchId:int = (curMovementList[j] as MarchVO).marchId; 
					var cityId:int = (curMovementList[j] as MarchVO).fromCityId; 
					if(cityId != MarchIdsToCity[i.Key]) 
					{
						flag = false;  
						break;
					} 
					else
					{
						if((curMovementList[j] as MarchVO).marchId == i.Key) 
						{
							 flag = false;
						}
					}
				}
				if(flag)
				{
					removeList.Add(i.Key);
				}
			}
		}
		for (var i:int = 0; i < removeList.Count; ++i)
		{
			delObj(removeList[i]);
		}
	}
	/////////对象池  START//////////
	private var TroopsList_Base:List.<GameObject> = new List.<GameObject>();
	private var TroopsList_Use:List.<GameObject> = new List.<GameObject>();
	private var isHaveInitTroopsPool:boolean=false;
	private var troopsPool:GameObject;
	private function TroopsPool():GameObject{
		if(troopsPool==null){
			troopsPool=new GameObject("TroopsPool_own");
		}
		return troopsPool;	
	}
	private function IsHaveInitTroopsPool():boolean{
		if(GameMain.singleton.IsHaveBossEvent()){
			if(!isHaveInitTroopsPool){
				InitTroopsPool();
				isHaveInitTroopsPool=true;
			}
		}else{
			isHaveInitTroopsPool=false;
		}
		return isHaveInitTroopsPool;	
	}
	
	private function InitTroopsPool(){
		var count:int=GameMain.singleton.GetWorldBossCount(); 
		for(var i:int=0;i<count;i++){
			var prefab:GameObject= Instantiate(troopObjPrefab) as GameObject;
			prefab.name="worldboss_troop_own";
			prefab.SetActive(false);
			prefab.transform.parent=TroopsPool().transform;
			TroopsList_Base.Add(prefab);
		}
	}

	private function InitOneTroop():GameObject{
		if(IsHaveInitTroopsPool()){
			if(TroopsList_Base!=null){
				if (TroopsList_Base.Count<=0) {
					var prefab:GameObject= Instantiate(troopObjPrefab) as GameObject;
					prefab.name="worldboss_troop_own";
					prefab.SetActive(false);
					prefab.transform.parent=TroopsPool().transform;
					TroopsList_Base.Add(prefab);
				}
				var obj:GameObject=TroopsList_Base[0] as GameObject;
				obj.SetActive(true);
				TroopsList_Use.Add(obj);
				TroopsList_Base.Remove(obj);
				return obj;
			}
		}
		return null;	
	}

	private function RemoveOneTroop(troop:GameObject){
		if(troop!=null){
			troop.transform.parent=TroopsPool().transform;
			TroopsList_Base.Add(troop);
			TroopsList_Use.Remove(troop);
			troop.SetActive(false);
		}
	}
	//销毁对象池
	private function DestroyTroopPool(){
		if(troopsPool!=null){
			Destroy(troopsPool);
		}
	}
	/////////对象池 END//////////
	
	private function AddObj(mvo:MarchVO):void
	{

		if(!MoveObjList.Contains(mvo.marchId))
		{ 
			MarchIdsToCity.Add(mvo.marchId,mvo.fromCityId);
			// if (mvo.worldBossId==0) {
			// 	MoveObjList.Add(mvo.marchId,Instantiate( troopObjPrefab ) as GameObject);
			// }else{
			// 	var marchObj:GameObject=InitOneTroop();
			// 	marchObj.name="troop_worldboss";
			// 	MoveObjList.Add(mvo.marchId,marchObj);
			// }

            MoveObjList.Add(mvo.marchId,Instantiate( troopObjPrefab ) as GameObject);
			var Obj:GameObject = (MoveObjList[mvo.marchId] as GameObject);
			var Comp:MapMoveAnim = Obj.GetComponent("MapMoveAnim") as MapMoveAnim;	
			Comp.setMarchid(mvo.marchId);
			Comp.setToCoor(mvo.toXCoord,mvo.toYCoord);	
				
			
			var fromCoor:Vector2 = GameMain.instance().getCurCityCoor(mvo.fromCityId);
			var toCoor:Vector2 = new Vector2(mvo.toXCoord , mvo.toYCoord);
			
			var length:float = Mathf.Sqrt(Mathf.Pow(tileWorldHeight*(mvo.toYCoord - fromCoor.y),2)+
											Mathf.Pow(tileWorldWidth*(mvo.toXCoord - fromCoor.x),2));
			var ver:Vector2 = new Vector2( (toCoor.x - fromCoor.x) , (toCoor.y - fromCoor.y));
			ver.Normalize();
		}
	}
	
	public function toFront()
	{
		for(var i:System.Collections.DictionaryEntry in MoveObjList)
		{
			var go : GameObject = i.Value as GameObject;
			var script : MapMoveAnim = go.GetComponent( "MapMoveAnim" ) as MapMoveAnim;
			script.toFront();
		}
	}
	
	public function toBack()
	{
		for(var i:System.Collections.DictionaryEntry in MoveObjList)
		{
			var go : GameObject = i.Value as GameObject;
			var script : MapMoveAnim = go.GetComponent( "MapMoveAnim" ) as MapMoveAnim;
			script.toBack();
		}
	}
	
	private function delObj(marchId:int):void
	{
		var Obj:GameObject = (MoveObjList[marchId] as GameObject);
		var Comp:MapMoveAnim = Obj.GetComponent("MapMoveAnim") as MapMoveAnim;
		if(MoveObjList.Contains(marchId))
		{ 
			Comp.onDelete();
			MarchIdsToCity.Remove(marchId);
			// if ((MoveObjList[marchId] as GameObject).name=="troop_worldboss") {
			// 	RemoveOneTroop(MoveObjList[marchId] as GameObject);
			// }else{
			// 	Destroy(MoveObjList[marchId] as GameObject);
			// }

			Destroy(MoveObjList[marchId] as GameObject);
			
			MoveObjList.Remove( marchId );
		}
	}
	
	private function activeObj(marchId:int):void
	{
		var Obj:GameObject = (MoveObjList[marchId] as GameObject);
		Obj.SetActive(true); 
	}
	
	private function deactiveObj(marchId:int):void
	{
		var Obj:GameObject = (MoveObjList[marchId] as GameObject);
		Obj.SetActive(false); 
	}

	private function OnDestroy()
	{
		DestroyTroopPool();
	}


}