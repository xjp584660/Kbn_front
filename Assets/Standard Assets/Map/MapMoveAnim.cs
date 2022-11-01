using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;

public class MapMoveAnim : MonoBehaviour
{

	public enum MoveState
	{
		MoveBegin,
		Moving,
		Returning,
		Fighting,
		Defending,
		MoveEnd,
		Surveying,
		Transport,
		Collect,
		Collect_Resource
	};

	public enum DestType
	{
		CITY_1x1,
		TILE_1x1,
		TILE_2x2
	};

	
	public MarchLine2 marchLineTemp;
	public bool IsAVA = false;
	private float m_leftTime;
	public float LeftTime {
		set { m_leftTime = value; }
		get { return m_leftTime; }
	}

	//
	private Soldier m_goSoldier;
	private GameObject m_goDefendCamp;
	private GameObject m_goEffect;
	private MarchLine2 m_marchLine;
	private Vector3 m_from;
	private Vector3 m_to;
	private int m_fromTileX;
	private int m_fromTileY;
	private int m_toTileX;
	private int m_toTileY;
	private bool m_fromToInit;
	private MarchEffectManager.Type m_lastEffectType;
	private bool deleteOnDisable = true;

	MoveState m_State;
	DestType m_destType;
	private int m_marchType;
	private int m_IsWinner = Constant.MarchResult.UNKNOWN;
	private Vector2 toCoor;
	private HashObject seed;

	
	public bool isEncamped = false;
	private int MarchId = 0;

	private string toTileName = null;
	private int carmotMarchStatues=0;
	private string updateKey="";
	public bool SetDeleteOnDisable {
		set { deleteOnDisable = value; }
		get { return deleteOnDisable; }
	}
	
	void Start() 
	{
		m_State = MoveState.Moving;
		m_destType = DestType.CITY_1x1;
		m_IsWinner = Constant.MarchResult.UNKNOWN;
		toCoor = Vector2.zero;
		seed = GameMain.singleton.getSeed();
		m_fromToInit = false;
		m_lastEffectType = MarchEffectManager.Type.UNKNOWN;
		MapController.UpdataCarmotEvent+=OnUpdateCarmot;
		
	}
	/// <summary>
	/// Raises the update carmot event.
	/// </summary>
	/// <param name="key">Key.</param>
	void OnUpdateCarmot(string coordXY,string marchId){
// 		if(updateKey!=coordXY || _Global.INT32(marchId)!=this.MarchId ){
// 			return;
// 		}
// 		HashObject marchtable=CollectionResourcesMgr.instance().tilesResourcesInfos["data"][coordXY]["carmot_march"];
// 		if(marchtable!=null){
// 			int mystatues= _Global.INT32(marchtable[marchId]["marchStatus"].Value);
// 			if(mystatues!=carmotMarchStatues){
// //				if(mystatues==8 && carmotMarchStatues==2 || mystatues==2 && carmotMarchStatues==1 ){//update report,collect report || attack report
// 				if(mystatues!=1 && mystatues!=0){
// 					PlayerPrefs.SetInt("loadReport",1);
// 				}
// 				GameMain.singleton.seedUpdate(true);
// 				carmotMarchStatues=mystatues;
// 			}
// 		}


	}
	private void onCollectMarchAnim( bool isTransporter,bool isCollectRes = false)
	{
		SoldierManager sm = IsAVA ? KBN.GameMain.singleton.getMapController2().getSoldierManager() :
			KBN.GameMain.singleton.getMapController().getSoldierManager();
		
		if( m_goEffect != null )
		{
			m_goEffect.SetActive(false);
		}
		if( m_goDefendCamp != null)
		{
			m_goDefendCamp.SetActive(false);
		}
		if (isTransporter) {
			if (m_goSoldier == null) {
				if (m_fromToInit) {
					if (sm != null) {
						if (!isCollectRes)
						{
					    	m_goSoldier = sm.activateCollect (transform, m_from, m_to);
						}
						else{
					    	m_goSoldier = sm.activateCollectRes (transform, m_from, m_to);
						}
					}
				}
			}  else {
				m_goSoldier.gameObject.SetActive (true);
			}
		}  else {
			
			bool isReturn = (m_State == MoveState.Returning);
			
			if (m_goSoldier == null) {
				if (m_fromToInit) {
					if (sm != null) {
						m_goSoldier = sm.activateSoldier (transform, m_from, m_to, isReturn, m_IsWinner);
						if (m_IsWinner == Constant.MarchResult.WIN) {
							SoundMgr.instance ().PlayEffect ("kbn tournament 3.2 victory", "Audio/Pvp/");
						}  else if (m_IsWinner == Constant.MarchResult.LOSE) {
							SoundMgr.instance ().PlayEffect ("kbn tournament 3.3 failure", "Audio/Pvp/");
						}
					}
				}
			}  else {
				if (m_goSoldier.isReturn != isReturn) {
					if (sm != null) {
						sm.recycleSoldier (m_goSoldier);
						m_goSoldier = sm.activateSoldier (transform, m_from, m_to, isReturn, m_IsWinner);
						if (m_IsWinner == Constant.MarchResult.WIN) {
							SoundMgr.instance ().PlayEffect ("kbn tournament 3.2 victory", "Audio/Pvp/");
						}  else if (m_IsWinner == Constant.MarchResult.LOSE) {
							SoundMgr.instance ().PlayEffect ("kbn tournament 3.3 failure", "Audio/Pvp/");
						}
					}
				}
				m_goSoldier.gameObject.SetActive (true);
			}
		}
	}
	private void onPlayMarchAnim( bool isTransporter )
	{
		SoldierManager sm = IsAVA ? KBN.GameMain.singleton.getMapController2().getSoldierManager() :
			KBN.GameMain.singleton.getMapController().getSoldierManager();
		
		if( m_goEffect != null )
		{
			m_goEffect.SetActive(false);
		}
		if( m_goDefendCamp != null)
		{
			m_goDefendCamp.SetActive(false);
		}

			if (isTransporter) {
				if (m_goSoldier == null) {
					if (m_fromToInit) {
						if (sm != null) {
							m_goSoldier = sm.activateTransporter (transform, m_from, m_to);
						}
					}
				}  else {
					m_goSoldier.gameObject.SetActive (true);
				}
			}  else {
				
				bool isReturn = (m_State == MoveState.Returning);
				
				if (m_goSoldier == null) {
					if (m_fromToInit) {
						if (sm != null) {
							m_goSoldier = sm.activateSoldier (transform, m_from, m_to, isReturn, m_IsWinner);
							if (m_IsWinner == Constant.MarchResult.WIN) {
								SoundMgr.instance ().PlayEffect ("kbn tournament 3.2 victory", "Audio/Pvp/");
							}  else if (m_IsWinner == Constant.MarchResult.LOSE) {
								SoundMgr.instance ().PlayEffect ("kbn tournament 3.3 failure", "Audio/Pvp/");
							}
						}
					}
				}  else {
					if (m_goSoldier.isReturn != isReturn) {
						if (sm != null) {
							sm.recycleSoldier (m_goSoldier);
							m_goSoldier = sm.activateSoldier (transform, m_from, m_to, isReturn, m_IsWinner);
							if (m_IsWinner == Constant.MarchResult.WIN) {
								SoundMgr.instance ().PlayEffect ("kbn tournament 3.2 victory", "Audio/Pvp/");
							}  else if (m_IsWinner == Constant.MarchResult.LOSE) {
								SoundMgr.instance ().PlayEffect ("kbn tournament 3.3 failure", "Audio/Pvp/");
							}
						}
					}
					m_goSoldier.gameObject.SetActive (true);
				}
			}

	}

	public static void avoidForceUpdateWorldMapWithinSecond( int avoidingSeconds ) {
		m_lastUpdateTime = KBN.GameMain.unixtime() + avoidingSeconds;
	}

	private static long m_lastUpdateTime = 0;
	private void onPlayDefendAnim( bool is2x2 )
	{
		if (null != m_goEffect)
			m_goEffect.SetActive(false);
		if (null != m_goSoldier) {
			m_goSoldier.gameObject.SetActive(false);
		}

		if (null == m_goDefendCamp)
		{
			SoldierManager sm = IsAVA ? KBN.GameMain.singleton.getMapController2().getSoldierManager() :
										KBN.GameMain.singleton.getMapController().getSoldierManager();
			if( sm != null ) {
				m_goDefendCamp = sm.activeDefendingCamp( transform );
			}

			long now = KBN.GameMain.unixtime();
			// Updating interval must be >= 1-second, which voids
			// the underlying probability of frequent updates
			// when a player enters the world map with too many
			// camps.
			if( now - m_lastUpdateTime >= 1 ) {
				MapView.instance().AllForceUpdate = true;
				GameMain.singleton.repaintWorldMap();
				MapView.instance().AllForceUpdate = false;
				m_lastUpdateTime = now;
			}
		}
		else
		{
			m_goDefendCamp.SetActive(true);
		}
		if( is2x2 ) {
			if( m_goDefendCamp != null ) {
				transform.localRotation = Quaternion.Euler( 0f, 0f, 0f );
				m_goDefendCamp.transform.localPosition = new Vector3( 0.95f, 0f, -1.16f );
				m_goDefendCamp.transform.localRotation = Quaternion.Euler( 315f, 45f, 0f );
			}
		}
	}
	
 	private bool m_marchLineVisible = false;
	private void refreshMarchLine(bool marchLineVisible)
	{
		if (null == m_marchLine) {
			if (marchLineVisible) {
				m_marchLine = Instantiate(marchLineTemp) as MarchLine2;
				m_marchLine.gameObject.SetActive(marchLineVisible);
				m_marchLine.SetLineColor(Constant.MarchLineType.GREEN);
//				if(m_State==MoveState.Collect){
//					m_marchLine.SetLineColor(Constant.CollectCarmotMarchlineColor.GREEN,Constant.CollectCarmotMarchlineColor.GREEN_LIGHT);
//				}
				m_marchLineVisible = marchLineVisible;
			} else 
				return;
		}

		if (m_marchLineVisible != marchLineVisible) {
			m_marchLineVisible = marchLineVisible;
			m_marchLine.SetLineColor(Constant.MarchLineType.GREEN);
//			if(m_State==MoveState.Collect){
//				m_marchLine.SetLineColor(Constant.CollectCarmotMarchlineColor.GREEN,Constant.CollectCarmotMarchlineColor.GREEN_LIGHT);
//			}
			m_marchLine.gameObject.SetActive(marchLineVisible);
		}

		if (marchLineVisible) {
			m_marchLine.setTileFromTo(  m_fromTileX, m_fromTileY, m_toTileX, m_toTileY );
			m_marchLine.SetFromTo(m_from, m_to);
			m_marchLine.SetProgress(transform.position);
		}
	}

	private void onPlayEffectAnim( MarchEffectManager.Type type )
	{
		if( m_goSoldier != null )
		{
			m_goSoldier.gameObject.SetActive(false);
		}
		if( m_goDefendCamp != null)
		{
			m_goDefendCamp.SetActive(false);
		}
		if(!IsWorldBoss){
			if( m_goEffect == null )
			{
				if( m_fromToInit )
				{
					m_lastEffectType = type;
					m_goEffect = MarchEffectManager.instance().activateEffect( transform, type );
				}
			}
			else
			{
			
				if( m_lastEffectType != type )
				{
					Destroy( m_goEffect );
					m_lastEffectType = type;
					m_goEffect = MarchEffectManager.instance().activateEffect( transform, type );
				}
				m_goEffect.active = true;
			}
		}	
	}
	
	public void onDelete()
	{
		if( m_goSoldier != null )
		{
			SoldierManager sm = IsAVA ? KBN.GameMain.singleton.getMapController2().getSoldierManager() :
										KBN.GameMain.singleton.getMapController().getSoldierManager();
			if( sm != null ) {
				sm.recycleSoldier( m_goSoldier );
			}
			m_goSoldier = null;
		}
		if( m_goDefendCamp != null)
		{
			Destroy(m_goDefendCamp);
			m_goDefendCamp = null;
		}
		if( m_goEffect != null)
		{
			Destroy(m_goEffect);
			m_goEffect = null;
		}
		if( m_marchLine != null)
		{
			Destroy(m_marchLine.gameObject);
			m_marchLine = null;

		}

	
	}

	void AddCarmotLoot(){
//		KBN.MyItems.singleton.AddCarmotLootItem(MarchId);
	}
	
	public void onHide()
	{
		if( m_goSoldier != null )
		{
			m_goSoldier.gameObject.SetActive(false);
		}
		if( m_goEffect != null )
			m_goEffect.active = false;
		if( m_goDefendCamp != null)
			m_goDefendCamp.SetActive(false);
	}

	void OnDisable() 
	{
		if( deleteOnDisable ) {
			onDelete();
		}
	}

	void OnDestroy() {
		AddCarmotLoot();
	}

	public void toFront()
	{
		gameObject.SetActive(true);
		if( m_marchLine != null)
		{
			m_marchLine.gameObject.SetActive(m_marchLineVisible);
		}
	}
	
	public void toBack()
	{
		if( m_marchLine != null)
		{
			m_marchLine.gameObject.SetActive(false);
		}
		gameObject.SetActive(false);
	}
	private bool isTransporter = false;
	private bool isCollect = false;
	void Update() 
	{
		MaterialColorScheme.instance.ApplyColorScheme(this.gameObject, "CityBuilding");
		if(GameMain.singleton.getScenceLevel() != GameMain.WORLD_SCENCE_LEVEL &&
		   GameMain.singleton.getScenceLevel() != GameMain.AVA_MINIMAP_LEVEL )
		{
			return;
		}
		
		isEncamped = false;
		switch(m_State)
		{
		case MoveState.Transport:
			isTransporter = true;
			onPlayMarchAnim( true );
			refreshMarchLine(true);
			break;
		case MoveState.Collect:
			isCollect = true;
			onCollectMarchAnim( true );
			refreshMarchLine(true);
			if(updateKey==""){
				updateKey=m_toTileX+"_"+m_toTileY;
			}
			break;
		case MoveState.Moving:
			isTransporter = false;
			// Remove TODO playAnimation(MoveImgName, MoveImgCount, frameRate);
			onPlayMarchAnim( false );
			refreshMarchLine(true);
			break;
			
		case MoveState.Fighting:
			// Remove TODO playAnimation(FightingImgName, FightingImgCount, 8);
			if( m_destType == DestType.CITY_1x1 ) {
				onPlayEffectAnim( MarchEffectManager.Type.FIGHTING_CITY_1x1 );
			}  else if( m_destType == DestType.TILE_1x1 ) {
				onPlayEffectAnim( MarchEffectManager.Type.FIGHTING_TILE_1x1 );
			}  else {
				onPlayEffectAnim( MarchEffectManager.Type.FIGHTING_TILE_2x2 );
			}
			
			refreshMarchLine(true);

			if(KBN.WorldBossController.singleton.IsFrontAttack(bossx,bossy,(int)m_fromTileX,(int)m_fromTileY)){
				KBN.WorldBossController.singleton.SetBossState(bossx,bossy,
					Constant.WorldBossAnimationState.normal,
		        	Constant.WorldBOssAnimationAction.attack,
		        	Constant.WorldBossAnimationPar.frontalAttack
	        	);
			}else{
				KBN.WorldBossController.singleton.SetBossState(bossx,bossy,
					Constant.WorldBossAnimationState.normal,
		        	Constant.WorldBOssAnimationAction.attack,
		        	Constant.WorldBossAnimationPar.backAttack
	        	);
			}
	
			
			break;
			
		case MoveState.Defending:
			isEncamped = true;
			if(!ifCoorHasCity())
			{
				onPlayDefendAnim( m_destType == DestType.TILE_2x2 );
			}
			else
			{
				onHide();
			}
			if(isCollect || ifCoorHasCarmot(m_toTileX,m_toTileY))
			{
				onHide();
			}
			refreshMarchLine(false);
			break;
			
		case MoveState.Returning:
			onPlayMarchAnim( m_marchType == Constant.MarchType.TRANSPORT || m_marchType == Constant.MarchType.TRANSPORT);
			refreshMarchLine(true);
			KBN.WorldBossController.singleton.SetBossState(bossx,bossy,
				Constant.WorldBossAnimationState.normal,
	        	Constant.WorldBOssAnimationAction.idle,
	        	_Global.INT32(UnityEngine.Random.Range(0f,100f))
	        	);
			break;
			
		case MoveState.Surveying:
			onPlayEffectAnim( MarchEffectManager.Type.SURVEY );
			refreshMarchLine(false);
			break;
		case MoveState.Collect_Resource:
			isCollect = true;
			onCollectMarchAnim( true ,true);
			refreshMarchLine(true);
			if(updateKey==""){
				updateKey=m_toTileX+"_"+m_toTileY;
			}
			break;
		    break;
		default:
			onHide();
			refreshMarchLine(false);
			break;				
		}
	}
	
	public MoveState getMoveState()
	{
		return m_State;
	}
	
	public void setMoveState(MoveState state, DestType destType )
	{
		m_State = state;
		m_destType = destType;
	}

	public void setMoveState(MoveState state, DestType destType, int isWinner)
	{
		setMoveState(state, destType);
		m_IsWinner = isWinner;
	}

	public void setTileFromTo( int tileFromX, int tileFromY, int tileToX, int tileToY ) {
		m_fromTileX = tileFromX;
		m_fromTileY = tileFromY;
		m_toTileX = tileToX;
		m_toTileY = tileToY;
	}
	
	public void setFromTo( Vector3 from, Vector3 to )
	{
		m_from = from;
		m_to = to;
		m_fromToInit = true;
		if( m_goSoldier != null )
		{
			m_goSoldier.updateWorldPosition( from, to );
		}
	}
	private int bossx,bossy;
	public void setToCoor(int x ,int y)
	{
		toCoor.x = x;
		toCoor.y = y;
		bossx = x;
		bossy = y;
		if (null == toTileName) {
			toTileName = "l_" + x + "_t_" + y;
		}
	}
	
	private bool ifCoorHasCity()
	{
		HashObject cities = seed["cities"];
		HashObject cityInfo;
		if(GameMain.singleton == null)
			return false;
		for(int i = 0;i < GameMain.singleton.getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];			
			Vector2 cityCoor = GameMain.singleton.getCurCityCoor(_Global.INT32(cityInfo[_Global.ap+0]));
			if(cityCoor.x == toCoor.x && cityCoor.y == toCoor.y)
				return true;
		}
		return false;
	}
	

	private bool ifCoorHasCarmot(int xcoord,int ycoord){
		string key=xcoord+"_"+ycoord;
		return CollectionResourcesMgr.instance().collectResources.ContainsKey(key);
	}
	public void setMarchType( int type )
	{
		m_marchType = type;
	}
	private int m_worldbossId=0;
	private bool IsWorldBoss
	{
		get{
			return m_worldbossId!=0;
		}
	}
	public void setMarchWorldBossId(int id){
		m_worldbossId=id;
	}
	public void setMarchid(int mid)
	{
		MarchId = mid;
	}
}
