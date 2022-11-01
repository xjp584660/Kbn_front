//#define TEST_AVA_TILE_PROTECTION
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using KBN;

public class TilePrefabData
{
	public GameObject tileObj;
	public GameObject flagObj;
	public GameObject levelObj;
	public GameObject buildingObj;
	public GameObject protectionCoverObj;
	public GameObject openObj;
}

public class CarmotStateInfo
{
	public int level;
	public int carmotCount;
	public int marchStatus;
	public int carmotFlag = 0;//标记驻扎在该地块的March是否是自己同盟的
	public int marchId = 0;//驻扎在当前地块的March的ID
	public int playerId = 0;
	public int allianceId = 0;
}
public class MapController : GestureController, TileInfoPopUp.TileInfoPopUpListener
{

	[Space(30), Header("----------MapController----------")]



	private float DRAGGING_SPEED_FACTOR_ON_CAMERA_SIZE = 0.145f;
	private const int POP_INFO_EDGE = 10;

	private const int REQ_TILE_NONE = 0;
	private const int REQ_TILE_MOVE = 1;
	private const int REQ_TILE_AUTO = 2;
	private const int REQ_TILE_WAITING = 3;

	private float ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = 2;
	public float ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA = 2.5f;
	public float ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA_LOW = 2f;

	private int reqTileFlag;

	public static bool IS_AVA_NOW = false;

	public GameObject AVATileEffectLife;

	public Camera m_camera;
	public GameObject dirLight;
	public Transform m_gridLine;
	public Transform m_cube;
	public float TileHighlightX;
	public float TileHighlightY;
	public float TileHighlightX2;
	public float TileHighlightY2;

	public GameObject tilePref;
	public GameObject ground;
	public GameObject selectedTile;
	public GameObject tileHighlight;
	private Vector3 selectedTileInitScale;

	//display tile info
	public GameObject tileInfoPopUp;

	public FloatingLayerMgr floatingLayerMgr;

	private GameObject movePlane;

	public GameObject troopObj;
	public MapMoveAnimMgr m_mapMoveAnimMgr;
	public TournamentMarchManager m_tournamentMarchMgr;
	public MapMarchTargetIndicatorMgr m_targetIndicatorMgr;
	public TileStateUnderAttackManager m_tileStateMgr;
	public SoldierManager m_soldierMgr;

	public AvaMapAnimMgr m_avaMapAnimMgr;
	public AvaTileProtectionTimeHUDMgr m_avaTileHUDMgr;

	private int screenTileWidth;
	private int screenTileHeight;
	private float tileWorldWidth;
	private float tileWorldHeight;

	private bool isInFront;
	private bool checkBlockRangeOnScreen = true;

	private HashObject seed;

	private float xOrg;
	private float yOrg;

	private int infoStartX;
	private int infoStartY;
	private int infoEndX;
	private int infoEndY;
	public MapTileMgr tileMgr;

	private int curDisplayTileStartX = 1;
	private int curDisplayTileStartY = 1;
	private int nextDisplayTileStartX = 1;
	private int nextDisplayTileStartY = 1;

	private Rect cameraMoveRange;

	private List<string> reqBlockNames = new List<string>();

	private bool m_bAllFake = false;

	private bool displayTileLevel = false;
	private float WAIT_TIME_TO_REQ
	{
		get
		{
			return 0.7f;
		}
	}
	private float moveEndTimer = -1;// < move 0 start; = move 0 end; >0&<timing WAIT_TIME_TO_REQ; >= need WAIT_TIME_TO_REQ req tile

	public MapGrid mapGrid;

	private HashObject slotInfo = null;
	private string selectedTileName = null;
	private int selectedTileType = -1;
	private List<Material> backupMaterials = new List<Material>();
	private List<GameObject> selectedTileGameObjects = new List<GameObject>();
	private Shader tileShader = null;
	private Shader tileLightShader = null;

	// Constant
	private const float SELECTED_TILE_Y = 1f;

	// Iso
	Vector3 upIso = new Vector3(1f, 0f, 1f);
	Vector3 rightIso = new Vector3(1f, 0f, -1f);

	//TipBar
	private TipBar tipBarOfMarchLine;

	// Highlight
	private bool hasTile2Highlight = false;
	private int xOfTile2Highlight;
	private int yOfTile2Highlight;


	public int SCENE_INDEX = GameMain.WORLD_SCENCE_LEVEL;
	public MapControllerAVAImp avaImp;

	private int m_mapTotalCols;
	private int m_mapTotalRows;

	private long m_lastRepaintViaGhostMapTime;
	// Cloud mask
	private int m_mapCloudMaskState = -1;
	private bool m_cloudMaskFading;
	private float m_cloudMaskAlpha;
	private Transform m_cloudMask;

	// AVA minimap operation parameters
	private float m_draggingTime;
	private bool m_isDragging;
	private bool m_enableRepaintOnDragging = true;
	public float DRAGGING_REPAINT_INTERVAL = 0.2f;
	private float DRAGGING_REPAINT_INTERVAL_DIS = 50f;
	bool MAP_OPTIMIZATION_THROUGH_LIMITING_CAMERA = true;
	int carmotFlag = 0;
	int otherMarchLineLimit = 30;
	public static event Action<string, string> UpdataCarmotEvent;
	List<TroopInfo> deleteDate = new List<TroopInfo>();

	public GameObject cityDirectionRoot;
	public GameObject myCityDirection;
	public UILabel myCityDistanceLabel;

	public GameObject Xicon;
	public GameObject ResourceIcon;

	public SoldierManager getSoldierManager()
	{
		return m_soldierMgr;
	}

	public MapMarchTargetIndicatorMgr getMarchTargetIndicatorMgr()
	{
		return m_targetIndicatorMgr;
	}

	public void onAbandonTileOK(int tileId)
	{
		if (isAVAMinimapMapController())
		{
			KBN.GameMain.singleton.forceRepaintWorldMap2();
			string tileName = "" + tileId;
			AvaTileProtectionTimeHUDMgr.getInstance().deactivateTileProtectionHUD(tileName);
		}
	}

	public void onCityMoved(int oldX, int oldY, int newX, int newY)
	{
		KBN.GameMain.singleton.forceRepaintWorldMap2();
	}

	public void dismissTileInfoPopUp()
	{
		TileInfoPopUp sc = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		sc.dismiss();
	}

	private void OnDestroy()
	{
		if (avaImp != null)
		{
			avaImp.Free();
		}
		DelAllTroopAndLinesForWorldbossAndAva();
	}

	protected override void Awake()
	{
		base.Awake();
		if (isAVAMinimapMapController())
		{
			avaImp = new MapControllerAVAImp(this);
			m_mapTotalCols = Constant.Map.AVA_MINIMAP_WIDTH;
			m_mapTotalRows = Constant.Map.AVA_MINIMAP_HEIGHT;
		}
		else
		{
			m_mapTotalCols = Constant.Map.WIDTH;
			m_mapTotalRows = Constant.Map.HEIGHT;
		}

		if (isAVAMinimapMapController())
		{

			if (MAP_OPTIMIZATION_THROUGH_LIMITING_CAMERA)
			{
				if (_Global.IS_TOUCH5_GEN)
				{
					ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = 2f;
				}
				else
				{
					ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = _Global.LOWENDPRODUCT_4_MAP_SYSTEM ? ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA_LOW : ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA;
				}
				//maxScaleSize = _Global.IsLowEndProduct() ? 7.5f : 7.5f;
				if (_Global.LOWENDPRODUCT_4_MAP_SYSTEM)
				{
					m_enableRepaintOnDragging = false;
				}
			}
			else
			{
				ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = _Global.IsLowEndProduct() ? 1.65f : 1.65f;
				//maxScaleSize = _Global.IsLowEndProduct() ? 7.5f : 7.5f;
			}

		}
		else
		{

			if (MAP_OPTIMIZATION_THROUGH_LIMITING_CAMERA)
			{
				if (_Global.IS_TOUCH5_GEN)
				{
					ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = 2f;
				}
				else
				{
					ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = _Global.LOWENDPRODUCT_4_MAP_SYSTEM ? ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA_LOW : ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR_AVA;
				}
				//maxScaleSize = _Global.IsLowEndProduct() ? 7.5f : 7.5f;
				if (_Global.LOWENDPRODUCT_4_MAP_SYSTEM)
				{
					m_enableRepaintOnDragging = false;
				}
				if (_Global.IS_TOUCH5_GEN)
				{
					m_enableRepaintOnDragging = true;
					DRAGGING_REPAINT_INTERVAL = 1.0f;
				}
			}
			else
			{
				ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR = _Global.IsLowEndProduct() ? 2f : 3f;
				//maxScaleSize = _Global.IsLowEndProduct() ? 8.0f : 10.0f;
				m_enableRepaintOnDragging = false;
			}
		}
		curCamera = GameObject.Find(SCENE_INDEX == GameMain.WORLD_SCENCE_LEVEL ? "mapCamera" : "mapCamera2").GetComponent<Camera>();
		curCamera.transparencySortMode = TransparencySortMode.Orthographic;
		viewRect = curCamera.pixelRect;

		selectedTileInitScale = selectedTile.transform.localScale;

		MaterialColorScheme.instance.ApplyColorScheme(ground.GetComponent<Renderer>(), "WorldMapGround");

		movePlane = gameObject;
		init();

		GameMain.singleton.StartCoroutine(GameMain.singleton.onLevelLoaded(SCENE_INDEX, this));
		GameMain.singleton.resgisterRestartFunc(new Action(delegate () {
			if (null == this || null == gameObject) return;
			CancelInvoke();
		}));

		upIso.Normalize();
		rightIso.Normalize();

		tileShader = Resources.Load<Shader>("WorldMap17d3a/Shader/kbnTile");
		tileLightShader = Resources.Load<Shader>("WorldMap17d3a/Shader/kbnTileLight");
	}

	/////////对象池  START//////////
	private List<GameObject> TroopsList_Base = new List<GameObject>();
	private List<GameObject> TroopsList_Use = new List<GameObject>();
	private List<GameObject> TroopsList_Base_lose = new List<GameObject>();
	private List<GameObject> TroopsList_Use_lose = new List<GameObject>();
	private List<GameObject> TroopsList_Base_win = new List<GameObject>();
	private List<GameObject> TroopsList_Use_win = new List<GameObject>();
	private List<GameObject> TroopsList_Base_Resource = new List<GameObject>();
	private List<GameObject> TroopsList_Use_Resource = new List<GameObject>();

	private List<GameObject> TroopsList_Collect_Res = new List<GameObject>();
	private bool isHaveInitTroopsPool = false;
	private GameObject troopsPool;
	private GameObject TroopsPool
	{
		get
		{
			if (troopsPool == null)
			{
				troopsPool = new GameObject("TroopsPool");
			}
			return troopsPool;
		}
	}
	private bool IsHaveInitTroopsPool
	{
		get
		{
			if (true)
			{//GameMain.singleton.IsHaveBossEvent()){
				if (!isHaveInitTroopsPool)
				{
					InitTroopsPool();
					isHaveInitTroopsPool = true;
				}
			}
			else
			{
				isHaveInitTroopsPool = false;
			}
			return isHaveInitTroopsPool;
		}
	}
	//生成troops对象池，在有世界boss活动还有进地图场景时
	private void InitTroopsPool()
	{
		int count = showTroopsMaxCount / 3; //按照设备来，有多少加载多少
		for (int i = 0; i < count; i++)
		{
			GameObject prefab = Instantiate(otherMarchGroupPre, Vector3.zero, Quaternion.identity) as GameObject;
			prefab.SetActive(false);
			prefab.transform.parent = TroopsPool.transform;
			TroopsList_Base.Add(prefab);
		}
		for (int i = 0; i < count; i++)
		{
			GameObject prefab = Instantiate(otherMarchGroupPre_lose, Vector3.zero, Quaternion.identity) as GameObject;
			prefab.SetActive(false);
			prefab.transform.parent = TroopsPool.transform;
			TroopsList_Base_lose.Add(prefab);
		}
		for (int i = 0; i < count; i++)
		{
			GameObject prefab = Instantiate(otherMarchGroupPre_win, Vector3.zero, Quaternion.identity) as GameObject;
			prefab.SetActive(false);
			prefab.transform.parent = TroopsPool.transform;
			TroopsList_Base_win.Add(prefab);
		}
		for (int i = 0; i < count; i++)
		{
			GameObject prefab = Instantiate(troopObjPrefab, Vector3.zero, Quaternion.identity) as GameObject;
			prefab.SetActive(false);
			prefab.transform.parent = TroopsPool.transform;
			TroopsList_Base_Resource.Add(prefab);
		}
		string resstr = "WorldMap17d3a/Prefab/CollectGroup";
		for (int i = 0; i < count; i++)
		{
			GameObject prefab = Instantiate(Resources.Load<GameObject>(resstr), Vector3.zero, Quaternion.identity) as GameObject;
			prefab.SetActive(false);
			prefab.transform.parent = TroopsPool.transform;
			TroopsList_Collect_Res.Add(prefab);
		}
	}

	private GameObject InitOneTroop(Vector3 pos)
	{
		if (IsHaveInitTroopsPool)
		{
			if (TroopsList_Base != null)
			{
				if (TroopsList_Base.Count <= 0)
				{
					GameObject prefab = Instantiate(otherMarchGroupPre, Vector3.zero, Quaternion.identity) as GameObject;
					prefab.SetActive(false);
					prefab.transform.parent = TroopsPool.transform;
					TroopsList_Base.Add(prefab);
				}
				GameObject obj = TroopsList_Base[0] as GameObject;
				obj.transform.position = pos;
				TroopsList_Use.Add(obj);
				TroopsList_Base.Remove(obj);
				return obj;
			}
		}
		return null;
	}

	private GameObject InitOneTroop_win(Vector3 pos)
	{
		if (IsHaveInitTroopsPool)
		{
			if (TroopsList_Base_win != null)
			{
				if (TroopsList_Base_win.Count <= 0)
				{
					GameObject prefab = Instantiate(otherMarchGroupPre_win, Vector3.zero, Quaternion.identity) as GameObject;
					prefab.SetActive(false);
					prefab.transform.parent = TroopsPool.transform;
					TroopsList_Base_win.Add(prefab);
				}
				GameObject obj = TroopsList_Base_win[0] as GameObject;
				obj.transform.position = pos;
				TroopsList_Use_win.Add(obj);
				TroopsList_Base_win.Remove(obj);
				return obj;
			}
		}
		return null;
	}

	private GameObject InitOneTroop_lose(Vector3 pos)
	{
		if (IsHaveInitTroopsPool)
		{
			if (TroopsList_Base_lose != null)
			{
				if (TroopsList_Base_lose.Count <= 0)
				{
					GameObject prefab = Instantiate(otherMarchGroupPre_lose, Vector3.zero, Quaternion.identity) as GameObject;
					prefab.SetActive(false);
					prefab.transform.parent = TroopsPool.transform;
					TroopsList_Base_lose.Add(prefab);
				}
				GameObject obj = TroopsList_Base_lose[0] as GameObject;
				obj.transform.position = pos;
				TroopsList_Use_lose.Add(obj);
				TroopsList_Base_lose.Remove(obj);
				return obj;
			}
		}
		return null;
	}

	private GameObject InitOneTroop_Resource(Vector3 pos)
	{
		if (IsHaveInitTroopsPool)
		{
			if (TroopsList_Base_Resource != null)
			{
				if (TroopsList_Base_Resource.Count <= 0)
				{
					GameObject prefab = Instantiate(troopObjPrefab, Vector3.zero, Quaternion.identity) as GameObject;
					prefab.SetActive(false);
					prefab.transform.parent = TroopsPool.transform;
					TroopsList_Base_Resource.Add(prefab);
				}
				GameObject obj = TroopsList_Base_Resource[0] as GameObject;
				obj.transform.position = pos;
				TroopsList_Use_Resource.Add(obj);
				TroopsList_Base_Resource.Remove(obj);
				return obj;
			}
		}
		return null;
	}
	private GameObject InitOneTroop_ResourceNew(Vector3 pos)
	{
		if (IsHaveInitTroopsPool)
		{
			if (TroopsList_Collect_Res != null)
			{
				if (TroopsList_Collect_Res.Count <= 0)
				{
					string resstr = "WorldMap17d3a/Prefab/CollectGroup";
					GameObject prefab = Instantiate(Resources.Load<GameObject>(resstr), Vector3.zero, Quaternion.identity) as GameObject;
					prefab.SetActive(false);
					prefab.transform.parent = TroopsPool.transform;
					TroopsList_Collect_Res.Add(prefab);
				}
				GameObject obj = TroopsList_Collect_Res[0] as GameObject;
				obj.transform.position = pos;
				TroopsList_Use_Resource.Add(obj);
				TroopsList_Collect_Res.Remove(obj);
				return obj;
			}
		}
		return null;
	}

	private void RemoveOneTroop(GameObject troop)
	{
		if (troop != null)
		{
			troop.transform.parent = TroopsPool.transform;
			TroopsList_Base.Add(troop);
			TroopsList_Use.Remove(troop);

			troop.SetActive(false);
		}
	}

	private void RemoveOneTroop_win(GameObject troop)
	{
		if (troop != null)
		{
			troop.transform.parent = TroopsPool.transform;
			TroopsList_Base_win.Add(troop);
			TroopsList_Use_win.Remove(troop);

			troop.SetActive(false);
		}
	}

	private void RemoveOneTroop_lose(GameObject troop)
	{
		if (troop != null)
		{
			troop.transform.parent = TroopsPool.transform;
			TroopsList_Base_lose.Add(troop);
			TroopsList_Use_lose.Remove(troop);

			troop.SetActive(false);
		}
	}

	private void RemoveOneTroop_Resource(GameObject troop)
	{
		if (troop != null)
		{
			troop.transform.parent = TroopsPool.transform;
			TroopsList_Base_Resource.Add(troop);
			TroopsList_Use_Resource.Remove(troop);

			troop.SetActive(false);
		}
	}

	private void RemoveOneTroop_CollectRes(GameObject troop)
	{
		if (troop != null)
		{
			troop.transform.parent = TroopsPool.transform;
			TroopsList_Collect_Res.Add(troop);
			TroopsList_Use_Resource.Remove(troop);
			troop.SetActive(false);
		}
	}

	//销毁对象池
	private void DestroyTroopPool()
	{
		if (troopsPool != null)
		{
			Destroy(troopsPool);
		}
	}
	/////////对象池 END//////////
	private const int addScreenTileWidth = 12;
	private const int addScreenTileHeight = 12;
	private Texture flagBlue1;
	private Texture flagRed1;
	private Texture flagYellow0;
	private Texture tileState3;
	private Texture tileState2;
	private Texture tileState1;
	public void init()
	{

		timePassed = 0.0f;
		getTilesResourceStatesInfoDic(false);
		seed = GameMain.singleton.getSeed();

		infoStartX = -1;
		infoStartY = -1;

		//		GameObject tile = Instantiate(tilePref) as GameObject;
		tileWorldWidth = tilePref.transform.localScale.x / 70;//org mesh w is 2 unit
		tileWorldHeight = tilePref.transform.localScale.z / 42;//org mesh w is 2 unit
		tileWorldWidth *= 0.948f;
		tileWorldHeight *= 0.948f;

		float screenWorldWidth = Mathf.Abs(getMoveWorldDis(0, 0, (int)viewRect.width, 0).x);
		float screenWorldHeight = Mathf.Abs(getMoveWorldDis(0, 0, 0, (int)viewRect.height).z);
		screenTileWidth = (int)Mathf.Ceil(screenWorldWidth / tileWorldWidth) + 1;
		screenTileHeight = (int)Mathf.Ceil(screenWorldHeight / tileWorldHeight) + 1;
		screenTileWidth = (int)(((float)screenTileWidth) * ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR);
		screenTileHeight = (int)(((float)screenTileHeight) * ORTHO_2_ISO_SCREEN_TILE_SIZE_FACTOR);

		if (isAVAMinimapMapController())
		{
			if (screenTileWidth % 2 == 0)
			{
				screenTileWidth += 1;
			}

			if (screenTileHeight % 2 == 0)
			{
				screenTileHeight += 1;
			}
		}
		else
		{
			screenTileWidth += addScreenTileWidth;
			screenTileHeight += addScreenTileHeight;

			if (screenTileWidth % 2 == 0)
			{
				screenTileWidth += 1;
			}

			if (screenTileHeight % 2 == 0)
			{
				screenTileHeight += 1;
			}

			//screenTileWidth=screenTileHeight;
		}

		float halfTileWorldWidth = tileWorldWidth / 2;
		float halfTileWorldHeight = tileWorldHeight / 2;

		flagBlue1 = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
		flagRed1 = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
		flagYellow0 = TextureMgr.instance().LoadTexture("icon_map_view_flag_yellow_0", TextureType.ICON_ELSE);
		tileState3 = TextureMgr.instance().LoadTexture("tile_state3", TextureType.MAP17D3A_NEWRESOURCES);
		tileState2 = TextureMgr.instance().LoadTexture("tile_state2", TextureType.MAP17D3A_NEWRESOURCES);
		tileState1 = TextureMgr.instance().LoadTexture("tile_state1", TextureType.MAP17D3A_NEWRESOURCES);

		//start form left top, construct movePlane, and make centertile center to screen center
		xOrg = -screenTileWidth * tileWorldWidth / 2 + halfTileWorldWidth;
		yOrg = screenTileHeight * tileWorldHeight / 2 - halfTileWorldHeight;
		KBN.TournamentManager.getInstance().setTileCoordContext(xOrg, yOrg, tileWorldWidth, tileWorldHeight);

		tileMgr.Init(tilePref, screenTileWidth, screenTileHeight, delegate (TilePrefabData tilePreData, int i, int j) {
			tilePreData.tileObj.transform.parent = movePlane.transform;
			tilePreData.tileObj.transform.localPosition = new Vector3(xOrg + tileWorldWidth * i, 1, yOrg - tileWorldHeight * j);
			tilePreData.tileObj.SetActive(false);
			tilePreData.flagObj.GetComponent<Renderer>().enabled = false;
			tilePreData.levelObj.GetComponent<Renderer>().enabled = false;
			tilePreData.buildingObj.GetComponent<Renderer>().enabled = false;
			tilePreData.protectionCoverObj.GetComponent<Renderer>().enabled = false;
			tilePreData.openObj.GetComponent<Renderer>().enabled = false;
		}, setTexture);

		Vector3 tmp = ground.transform.localScale;
		tmp.z = tileWorldHeight * screenTileHeight * 2 * 42; //960;
		tmp.x = tileWorldWidth * screenTileWidth * 2 * 70; //960 * Screen.width/Screen.height;
		ground.transform.localScale = tmp;

		mapGrid.init(tileWorldWidth, tileWorldHeight, screenTileWidth + 1, screenTileHeight + 1);
		tmp = mapGrid.transform.position;
		tmp.y = 1;
		mapGrid.transform.position = tmp;
		mapGrid.gameObject.SetActive(false);
		//over normal tile
		tmp = selectedTile.transform.position;
		tmp.y = SELECTED_TILE_Y;
		selectedTile.transform.position = tmp;


		TileInfoPopUp tileInfoPopUpScript = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		tileInfoPopUpScript.listener = this;

		//set camera range
		float popInfoBgHeight = tileInfoPopUpScript.getBGLabelHeight(); //bgLabel.rect.height;
		float popInfoWorldHeight = Mathf.Abs(getMoveWorldDis(0, 0, 0, (int)popInfoBgHeight + POP_INFO_EDGE).z);

		cameraMoveRange = new Rect();
		cameraMoveRange.x = xOrg;
		cameraMoveRange.xMax = xOrg + tileWorldWidth * m_mapTotalCols;

		cameraMoveRange.y = yOrg - tileWorldHeight * m_mapTotalRows; //down
		cameraMoveRange.yMax = Mathf.Max(yOrg + halfTileWorldHeight, yOrg + halfTileWorldHeight + popInfoWorldHeight - screenWorldHeight / 2);// for enough place to display tilepopupinfo

		//recenter to player city
		GameMain gMain = GameMain.singleton;
		HashObject curCityInfo = gMain.GetCityInfo(gMain.getCurCityId());
		int x = _Global.INT32(curCityInfo[_Global.ap + 2]);
		int y = _Global.INT32(curCityInfo[_Global.ap + 3]);

		MenuMgr.instance.setCoordinateBar(x.ToString(), y.ToString());

		ground.GetComponent<Renderer>().material.mainTexture = TextureMgr.instance().LoadTexture(isAVAMinimapMapController() ? "map_view_bg2" : "map_view_bg", TextureType.MAP17D3A_TILE);


		if (!isAVAMinimapMapController())
		{
			m_mapMoveAnimMgr.init();
			m_mapMoveAnimMgr.setTileWH(xOrg, yOrg, tileWorldWidth, tileWorldHeight);
			m_tournamentMarchMgr.setTileWH(xOrg, yOrg, tileWorldWidth, tileWorldHeight);
			m_targetIndicatorMgr.setTileWH(xOrg, yOrg, tileWorldWidth, tileWorldHeight);
			m_tileStateMgr.setTileWH(tileWorldWidth, tileWorldHeight);
		}
		else
		{
			m_avaMapAnimMgr.init();
			m_avaMapAnimMgr.setTileWH(xOrg, yOrg, tileWorldWidth, tileWorldHeight);
			m_targetIndicatorMgr.setTileWH(xOrg, yOrg, tileWorldWidth, tileWorldHeight);
			m_avaTileHUDMgr.setTileWH(tileWorldWidth, tileWorldHeight);
		}

		camSwitch = curCamera.GetComponent<WorldMapCamSwitch>();
		SetCacheMarch();
		if (worldBossBloodCon != null)
		{
			// WorldBossBloodController wbbc=Instantiate(worldBossBloodCon) as WorldBossBloodController;
			// wbbc.SetMainCamera(m_camera);
		}

		mapScreenWidth = Screen.width;
		mapScreenHeight = Screen.height;
		lineWithRect = new Rect(-mapScreenWidth / 2f, -mapScreenHeight / 2f, mapScreenWidth, mapScreenHeight);

		showTroopsMaxCount = KBN.GameMain.singleton.getWorldBossXMaxNum();
		showMarchLineMaxCount = KBN.GameMain.singleton.getWorldBossMarchMaxNum();

		NewSocketNet.instance.RegisterConnectedHandlers(OnNewNetworkNodeConnected);
		_Global.LogWarning("MapController.Init");
		// InitTroopsPool();
	}

	//Socket重连拉起Resourceinfo
	private void OnNewNetworkNodeConnected()
	{
		if (!isInFront)
		{
			return;
		}
		CollectionResourcesMgr.instance().OnNewNetworkNodeConnected();
		getTilesResourceStatesInfoDic(false);
		constructReqTile();
		moveReqWorldMap();
		_Global.LogWarning("MapController.OnNewNetorkNodeConnected");
	}

	int mapScreenWidth = 0;
	int mapScreenHeight = 0;

	public WorldBossBloodController worldBossBloodCon;
	public const float delayShowMarchLineTime = 0.05f;
	public float curMarchLineTime;
	public float curMarchTroopTime;
	public Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo> marchLineInfos = new Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo>();
	public Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo> marchTroopsInfos = new Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo>();
	Dictionary<string, TroopInfo> rallyAndBossTroops = new Dictionary<string, TroopInfo>();
	Dictionary<string, TroopInfo> rallyAndBossMarchLines = new Dictionary<string, TroopInfo>();

	public void AddMarchLineInfos(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		if (marchLineInfos.ContainsKey(march.marchId))
		{
			marchLineInfos[march.marchId] = march;
		}
		else
		{
			//			if(marchLineInfos.Count < showMarchLineMaxCount)
			//			{
			marchLineInfos.Add(march.marchId, march);
			//			}
		}
	}

	public void AddMarchTroopsInfos(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		if (marchTroopsInfos.ContainsKey(march.marchId))
		{
			marchTroopsInfos[march.marchId] = march;
		}
		else
		{
			// if(marchTroopsInfos.Count < showTroopsMaxCount)
			// {
			marchTroopsInfos.Add(march.marchId, march);
			// }
		}
	}

	public void AddRallyAndBossMarchsInfo(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		AddMarchLineInfos(march);
		AddMarchTroopsInfos(march);
	}

	private void InitAvaMarch()
	{
		if (GameMain.GetIsShowAVAMarch())
		{
			SetAllMarchActive(true);
			avaImp.showAVATileMarchLines(0);
		}
		else
		{
			// SetAllRallyBossMarchUnActive();
			SetAllMarchActive(false);
		}
	}

	public bool IsHaveOtherMarches(int toX, int toY)
	{
		bool isHave = false;
		Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo> marDic = KBN.RallyBossMarchController.instance().getMarchDic;
		var marchs = marDic.GetEnumerator();
		while (marchs.MoveNext())
		{
			PBMsgMarchInfo.PBMsgMarchInfo march = marchs.Current.Value;
			if (march.toX == toX && march.toY == toY && march.marchStatus == Constant.MarchStatus.OUTBOUND
			&& (march.marchType == Constant.MarchType.COLLECT || march.marchType == Constant.MarchType.COLLECT_RESOURCE) && GameMain.unixtime() < march.endTimeStamp)
			{
				isHave = true;
				break;
			}
		}

		return isHave;
	}

	private void SetCacheMarch()
	{
		if (isAVAMinimapMapController())
		{
			InitAvaMarch();
			AvaMarchController.instance().Init(InitAvaMarch);
		}
		else
		{
			Dictionary<int, PBMsgMarchInfo.PBMsgMarchInfo> marDic = KBN.RallyBossMarchController.instance().getMarchDic;
			var marchs = marDic.GetEnumerator();
			while (marchs.MoveNext())
			{
				PBMsgMarchInfo.PBMsgMarchInfo march = marchs.Current.Value;
				AddMarchLineInfos(march);
				AddMarchTroopsInfos(march);
			}
		}
	}

	private bool InCanShowMarchTroop(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		int fromXCoord = march.fromX;
		int fromYCoord = march.fromY;
		int toXCoord = march.toX;
		int toYCoord = march.toY;
		float fromX = xOrg + tileWorldWidth * (fromXCoord - 1) + tileWorldWidth * 0.5f;
		float fromZ = yOrg - tileWorldHeight * (fromYCoord - 1) + tileWorldHeight * 0.5f;
		float toX = xOrg + tileWorldWidth * (toXCoord - 1) + tileWorldWidth * 0.5f;
		float toZ = yOrg - tileWorldHeight * (toYCoord - 1) + tileWorldHeight * 0.5f;

		Vector3 troopOffset = new Vector3(-2, 2, -2);
		Vector3 m_from = new Vector3(fromX, 0, fromZ) + troopOffset;
		Vector3 m_to = new Vector3(toX, 0, toZ) + troopOffset;

		if ((march.marchStatus == Constant.MarchStatus.RETURNING || (isAVAMinimapMapController() && march.marchStatus == Constant.AvaMarchStatus.RETURNING)) &&
		   (march.marchType != Constant.MarchType.RALLY_ATTACK && march.marchType != Constant.MarchType.JION_RALLY_ATTACK))
		{
			m_from = new Vector3(toX, 0, toZ) + troopOffset;
			m_to = new Vector3(fromX, 0, fromZ) + troopOffset;
		}

		//double curUnixTime = GameMain.unixtime();
		double curUnixTime = GameMain.DeltaTime();
		//_Global.LogWarning("curUnixTime : " + curUnixTime);
		float offsetTime = 1 - (float)((march.endTimeStamp - curUnixTime) * 1f) / march.oneWayTime;
		offsetTime = Mathf.Clamp(offsetTime, 0, 1);

		Vector3 offsetPos = offsetTime * (m_to - m_from);
		Vector3 troopPos = m_from + offsetPos;

		bendCamera();
		Vector3 screenPoint = curCamera.WorldToScreenPoint(troopPos);
		restoreCamera();
		float myCityScreenX = -(Screen.width / 2 - screenPoint.x);
		float myCityScreenY = -(Screen.height / 2 - screenPoint.y);

		if (myCityScreenX <= -(Screen.width / 2f) || myCityScreenX >= (Screen.width / 2f) || myCityScreenY <= -(Screen.height / 2f) || myCityScreenY >= (Screen.height / 2f))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	private bool InCanShowMarchTroop(/*PBMsgMarchInfo.PBMsgMarchInfo march*/Vector3 pos)
	{
		bendCamera();
		Vector3 screenPoint = curCamera.WorldToScreenPoint(pos);
		restoreCamera();
		float myCityScreenX = -(Screen.width / 2 - screenPoint.x);
		float myCityScreenY = -(Screen.height / 2 - screenPoint.y);

		if (myCityScreenX <= -(Screen.width / 2) || myCityScreenX >= (Screen.width / 2) || myCityScreenY <= -(Screen.height / 2) || myCityScreenY >= (Screen.height / 2))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	private bool IsCanShowMarchLine(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		int fromXCoord = march.fromX;
		int fromYCoord = march.fromY;
		int toXCoord = march.toX;
		int toYCoord = march.toY;
		float fromX = xOrg + tileWorldWidth * (fromXCoord - 1) + tileWorldWidth * 0.5f;
		float fromZ = yOrg - tileWorldHeight * (fromYCoord - 1) + tileWorldHeight * 0.5f;
		float toX = xOrg + tileWorldWidth * (toXCoord - 1) + tileWorldWidth * 0.5f;
		float toZ = yOrg - tileWorldHeight * (toYCoord - 1) + tileWorldHeight * 0.5f;

		Vector3 troopOffset = new Vector3(-2, 2, -2);
		Vector3 m_from = new Vector3(fromX, 0, fromZ) + troopOffset;
		Vector3 m_to = new Vector3(toX, 0, toZ) + troopOffset;

		curCamera.orthographic = true;
		bendCamera();
		Vector3 tempStart = curCamera.WorldToScreenPoint(new Vector3(fromX, 1, fromZ));
		restoreCamera();

		bendCamera();
		Vector3 tempEnd = curCamera.WorldToScreenPoint(new Vector3(toX, 1, toZ));
		restoreCamera();
		curCamera.orthographic = false;

		Vector2 lineStartPos = new Vector2(-(mapScreenWidth / 2 - tempStart.x), -(mapScreenHeight / 2 - tempStart.y));
		Vector2 lineEndPos = new Vector2(-(mapScreenWidth / 2 - tempEnd.x), -(mapScreenHeight / 2 - tempEnd.y));

		bool isCanShow = marchLineInScreen(lineStartPos, lineEndPos);
		return isCanShow;
		//return true;
	}

	private void UpdateShowMarchTroops()
	{
		if (Time.time - curMarchTroopTime <= delayShowMarchLineTime)
		{
			return;
		}

		PBMsgMarchInfo.PBMsgMarchInfo removeMarchTroop = null;
		var marchTroops = marchTroopsInfos.GetEnumerator();
		while (marchTroops.MoveNext())
		{
			PBMsgMarchInfo.PBMsgMarchInfo march = marchTroops.Current.Value;
			int tileMarchStatues = march.marchStatus;
			long startTime = march.startTimeStamp;
			string marchKey = march.marchId + "_" + tileMarchStatues + "_" + startTime;
			if (InCanShowMarchTroop(march) && rallyAndBossMarchLines.ContainsKey(marchKey))
			{
				removeMarchTroop = march;
				updateRallyBossMarch(march, false);


				curMarchTroopTime = Time.time;
				break;
			}
		}

		if (removeMarchTroop != null)
		{
			string key = removeMarchTroop.marchId + "_" + removeMarchTroop.marchStatus + "_" + removeMarchTroop.startTimeStamp;
			if (rallyAndBossTroops.ContainsKey(key))
				marchTroopsInfos.Remove(removeMarchTroop.marchId);
		}
	}

	private void UpdateShowMarchLines()
	{
		if (Time.time - curMarchLineTime <= delayShowMarchLineTime)
		{
			return;
		}

		PBMsgMarchInfo.PBMsgMarchInfo removeMarchLine = null;
		var marchLinesDic = marchLineInfos.GetEnumerator();
		while (marchLinesDic.MoveNext())
		{
			PBMsgMarchInfo.PBMsgMarchInfo march = marchLinesDic.Current.Value;
			if (IsCanShowMarchLine(march))
			{
				removeMarchLine = march;
				updateRallyBossMarch(march, true);

				curMarchLineTime = Time.time;
				break;
			}
		}

		if (removeMarchLine != null)
		{
			string key = removeMarchLine.marchId + "_" + removeMarchLine.marchStatus + "_" + removeMarchLine.startTimeStamp;
			if (rallyAndBossMarchLines.ContainsKey(key))
				marchLineInfos.Remove(removeMarchLine.marchId);
		}
	}

	private float targetScaleSize = 7.0f;
	private WorldMapCamSwitch camSwitch = null;
	public float maxScaleSize = 11f;
	public float minScaleSize = 9f;

	private float CamSize
	{
		set
		{
			camSwitch.m_size = value;
		}
		get
		{
			return camSwitch.m_size;
		}
	}

	protected override void Start()
	{
		//targetScaleSize = CamSize;
		targetScaleSize = minScaleSize;
		isUpdateTilesCarmot = true;
		getTilesResourceStatesInfoDic(false);
	}

	private bool isUpdateTilesCarmot = true;//is loading getCarmotInfo.php 


	public GameObject marchGroupPre;
	public GameObject otherMarchGroupPre;
	public GameObject otherMarchGroupPre_lose;
	public GameObject otherMarchGroupPre_win;
	private GameObject rallyBossMarchList;

	//删除所有有关集结和boss的march
	private void DelAllRallyBossMarchList()
	{
		if (rallyBossMarchList != null)
			Destroy(rallyBossMarchList);
	}

	//隐藏所有有关集结和boss的march线
	public void SetAllRallyBossMarchUnActive()
	{
		if (rallyBossMarchList != null)
		{
			int count = rallyBossMarchList.transform.childCount;
			for (int i = 0; i < count; i++)
			{
				rallyBossMarchList.transform.GetChild(i).gameObject.SetActive(false);
			}
		}
	}

	public int getMarchLineType(PBMsgMarchInfo.PBMsgMarchInfo march)
	{
		int toAllianceId = march.toAllianceId;
		if (march.marchType == Constant.MarchType.COLLECT || march.marchType == Constant.MarchType.COLLECT_RESOURCE)
		{
			string collectKey = march.toX + "_" + march.toY;
			if (CollectionResourcesMgr.instance().collectResources.ContainsKey(collectKey))
			{
				CollectResourcesInfo info = CollectionResourcesMgr.instance().collectResources[collectKey];
				toAllianceId = info.allianceId;
			}
		}

		if (march.fromPlayerId == GameMain.singleton.getUserId())
		{//攻击方是自己 
			return Constant.MarchLineType.GREEN;
		}
		else
		{
			if (march.fromAllianceId == Alliance.singleton.MyAllianceId() && march.fromAllianceId != 0)
			{//攻击方是盟友
				return Constant.MarchLineType.BLUE;
			}
			else
			{//攻击方是敌人
				if (toAllianceId == Alliance.singleton.MyAllianceId() && toAllianceId != 0)
				{//被攻击方是自己或盟友
					return Constant.MarchLineType.RED;
				}
				else
				{
					return Constant.MarchLineType.WHITE;
				}
			}
		}
	}

	//更新别人rallybossmarch
	public void updateRallyBossMarch(PBMsgMarchInfo.PBMsgMarchInfo march, bool isMarchLine)
	{
		if (rallyBossMarchList == null)
		{
			rallyBossMarchList = GameObject.Find("rallyBossMarchList");
			if (rallyBossMarchList == null)
			{
				rallyBossMarchList = new GameObject("rallyBossMarchList") as GameObject;
			}
		}

		if (march.marchStatus == Constant.MarchStatus.OUTBOUND || march.marchStatus == Constant.MarchStatus.RALLYING
		   || march.marchStatus == Constant.MarchStatus.RETURNING || (isAVAMinimapMapController() && march.marchStatus == Constant.AvaMarchStatus.RETURNING))
		{
			int fromXCoord = march.fromX;
			int fromYCoord = march.fromY;
			int toXCoord = march.toX;
			int toYCoord = march.toY;
			float fromX = xOrg + tileWorldWidth * (fromXCoord - 1) + tileWorldWidth * 0.5f;
			float fromZ = yOrg - tileWorldHeight * (fromYCoord - 1) + tileWorldHeight * 0.5f;
			float toX = xOrg + tileWorldWidth * (toXCoord - 1) + tileWorldWidth * 0.5f;
			float toZ = yOrg - tileWorldHeight * (toYCoord - 1) + tileWorldHeight * 0.5f;

			long startTime = march.startTimeStamp;
			long returnTime = march.endTimeStamp;
			int tileMarchStatues = march.marchStatus;

			TroopInfo mTroopInfo = new TroopInfo();

			Vector3 troopOffset = new Vector3(-2, 2, -2);
			Vector3 m_from = new Vector3(fromX, 0, fromZ) + troopOffset;
			Vector3 m_to = new Vector3(toX, 0, toZ) + troopOffset;
			if ((march.marchStatus == Constant.MarchStatus.RETURNING || (isAVAMinimapMapController() && march.marchStatus == Constant.AvaMarchStatus.RETURNING)) &&
			   (march.marchType != Constant.MarchType.RALLY_ATTACK && march.marchType != Constant.MarchType.JION_RALLY_ATTACK))
			{
				m_from = new Vector3(toX, 0, toZ) + troopOffset;
				m_to = new Vector3(fromX, 0, fromZ) + troopOffset;
			}

			mTroopInfo.startTime = startTime;
			mTroopInfo.endTime = returnTime;
			mTroopInfo.march = march;

			mTroopInfo.marchKey = march.marchId + "_" + tileMarchStatues + "_" + mTroopInfo.startTime;

			if (mTroopInfo.endTime < GameMain.unixtime())
			{
				if (marchLineInfos.ContainsKey(march.marchId))
				{
					marchLineInfos.Remove(march.marchId);
				}
				return;
			}
			else
			{
				mTroopInfo.mFrom = m_from;
				mTroopInfo.mTo = m_to;
				mTroopInfo.marchState = march.marchStatus;
				mTroopInfo.carmotPosKey = toXCoord + "_" + toYCoord;
				mTroopInfo.oneWayTime = march.oneWayTime;

				mTroopInfo.lastUnixTime = GameMain.unixtime();
				mTroopInfo.curUnixTime = GameMain.unixtime();

				if (isMarchLine)
				{
					if (rallyAndBossMarchLines.ContainsKey(mTroopInfo.marchKey))
					{
						TroopInfo itemTroop;
						if (rallyAndBossMarchLines.TryGetValue(mTroopInfo.marchKey, out itemTroop))
						{
							itemTroop.endTime = returnTime;
						};

						if (rallyAndBossMarchLines.ContainsKey(mTroopInfo.marchKey))
						{
							rallyAndBossMarchLines[mTroopInfo.marchKey].marchline.gameObject.SetActive(true);
						}
						return;
					}

					if (rallyAndBossMarchLines.Count >= showMarchLineMaxCount || showMarchLineMaxCount == 0)
					{
						return;
					}

					MarchLine2 line;
					line = Instantiate(marchLineTemp) as MarchLine2;
					line.transform.parent = rallyBossMarchList.transform;
					line.gameObject.name = "RallyBossMarch_Line2_" + march.marchId;
					line.gameObject.SetActive(true);

					line.setTileFromTo(fromXCoord, fromYCoord, toXCoord, toYCoord);
					line.SetFromTo(m_from, m_to);
					line.SetProgress(transform.position);
					int marchLineType = getMarchLineType(march);
					line.SetLineColor(marchLineType);
					mTroopInfo.marchline = line;

					rallyAndBossMarchLines.Add(mTroopInfo.marchKey, mTroopInfo);
				}
				else
				{
					if (rallyAndBossTroops.ContainsKey(mTroopInfo.marchKey))
					{//refresh endTime
						TroopInfo itemTroop;
						if (rallyAndBossTroops.TryGetValue(mTroopInfo.marchKey, out itemTroop))
						{
							itemTroop.endTime = returnTime;
						};

						if (rallyAndBossTroops.ContainsKey(mTroopInfo.marchKey) && rallyAndBossTroops[mTroopInfo.marchKey].troop != null)
						{
							rallyAndBossTroops[mTroopInfo.marchKey].troop.SetActive(true);
						}
						return;
					}
					//showMarchLineMaxCount
					if (rallyAndBossTroops.Count >= showMarchLineMaxCount || showTroopsMaxCount == 0)
					{
						return;
					}

					if (!rallyAndBossMarchLines.ContainsKey(mTroopInfo.marchKey))
					{
						return;
					}

					GameObject prefab = null;
					// prefab= Instantiate(otherMarchGroupPre,m_from,Quaternion.identity) as GameObject;
					// prefab.SetActive(false);

					if (getTroopCount() >= showTroopsMaxCount)
					{
						if (march.marchType == Constant.MarchType.COLLECT || march.marchType == Constant.MarchType.COLLECT_RESOURCE)
						{
							prefab = Instantiate(ResourceIcon, Vector3.zero, Quaternion.identity) as GameObject;
						}
						else
						{
							prefab = Instantiate(Xicon, Vector3.zero, Quaternion.identity) as GameObject;
						}

						prefab.SetActive(false);
						prefab.transform.parent = rallyBossMarchList.transform;
						Soldier soldier = prefab.GetComponent<Soldier>();
						soldier.init(rallyBossMarchList.transform, m_from, m_to);
						prefab.gameObject.name = "RallyBossMarch_Troop_" + march.marchId;

						mTroopInfo.isNeedDestroyTroop = true;
					}
					else
					{
						if (march.marchType == Constant.MarchType.COLLECT)
						{
							prefab = InitOneTroop_Resource(m_from);
							prefab.GetComponent<MapOtherPlayerMove>().setMarchId(march.marchId);
							prefab.GetComponent<MapOtherPlayerMove>().setupdateKey(toXCoord + "_" + toYCoord);
							prefab.gameObject.name = "Resource_Troop_" + march.marchId;
							prefab.transform.LookAt(m_to);
							prefab.transform.Find("EffectCollect").localPosition = Vector3.zero;
						}
						else if (march.marchType == Constant.MarchType.COLLECT_RESOURCE)
						{
							prefab = InitOneTroop_ResourceNew(m_from);
							prefab.GetComponent<MapOtherPlayerMove>().setMarchId(march.marchId);
							prefab.GetComponent<MapOtherPlayerMove>().setupdateKey(toXCoord + "_" + toYCoord);
							prefab.gameObject.name = "Resource_Troop_" + march.marchId;
							prefab.transform.LookAt(m_to);
							prefab.transform.Find("EffectCollect").localPosition = Vector3.zero;
						}
						else
						{
							if (march.isWin == 3)    //进攻
							{
								prefab = InitOneTroop(m_from);
								Soldier soldier = prefab.GetComponent<Soldier>();
								soldier.init(rallyBossMarchList.transform, m_from, m_to);
								prefab.gameObject.name = "RallyBossMarch_Troop_" + march.marchId;

								mTroopInfo.isNeedDestroyTroop = false;
							}
							else if (march.isWin == 1)
							{
								prefab = InitOneTroop_win(m_from);
								Soldier soldier = prefab.GetComponent<Soldier>();
								soldier.init(rallyBossMarchList.transform, m_from, m_to);
								prefab.gameObject.name = "RallyBossMarch_Troop_" + march.marchId;

								mTroopInfo.isNeedDestroyTroop = false;
							}
							else
							{
								prefab = InitOneTroop_lose(m_from);
								Soldier soldier = prefab.GetComponent<Soldier>();
								soldier.init(rallyBossMarchList.transform, m_from, m_to);
								prefab.gameObject.name = "RallyBossMarch_Troop_" + march.marchId;

								mTroopInfo.isNeedDestroyTroop = false;
							}
						}
					}

					mTroopInfo.troop = prefab;

					rallyAndBossTroops.Add(mTroopInfo.marchKey, mTroopInfo);
				}

				if (!marchLines.Contains(mTroopInfo.marchKey))
				{
					marchLines.Add(mTroopInfo.marchKey);
				}
			}
		}
	}

	public int getTroopCount()
	{
		int count = 0;
		var rallyAndBoss = rallyAndBossTroops.GetEnumerator();
		while (rallyAndBoss.MoveNext())
		{
			if (!rallyAndBoss.Current.Value.isNeedDestroyTroop)
			{
				count++;
			}
		}

		return count;
	}

	public void getTilesResourceStatesInfoDic(bool getOneTileResourceStatesInfo = false)
	{
		string tilesList = string.Empty;

		if (!getOneTileResourceStatesInfo)
		{
			int centerx = nextDisplayTileStartX + screenTileWidth / 2;
			int centery = nextDisplayTileStartY + screenTileHeight / 2;
			if (centerx <= 0)
			{
				centerx = 1;
			}
			else if (centerx > 800)
			{
				centerx = 800;
			}

			if (centery <= 0)
			{
				centery = 1;
			}
			else if (centery > 800)
			{
				centery = 800;
			}
			// //131 157
			// for (int i = (centerx-10); i<(centerx+10); i++) {
			// 	for (int j = (centery-10); j<(centery+10); j++) {
			// 		tilesList += i.ToString () + "_" + j.ToString () + ",";
			// 	}
			// }
			// AddMarchlineTile(ref tilesList);
			// tilesList = tilesList.Remove (tilesList.Length-1);
			string tileCenterInfo = string.Concat(centerx, "_", centery);
			tilesList += tileCenterInfo;
		}
		else
		{
			string oneTileInfo = resourceTileXCoord.ToString() + "_" + resourceTileYCoord.ToString();
			tilesList += oneTileInfo;
			// _Global.LogWarning("MapController.getTilesResourceStatesInfoDic  getOneTileResourceStatesInfo : " + getOneTileResourceStatesInfo
			// + " tileInfo: " + oneTileInfo);
		}

		UnityNet.PFN_OkFunction okFunc = delegate (HashObject rslt)
		{
			isUpdateTilesCarmot = false;
			CollectionResourcesMgr.instance().SetResourcesData(rslt);
			isUpdateTilesCarmot = true;
		};

		UnityNet.PFN_ErrorFunction errorFunc = delegate (string msg, string errorCode) {
			//			if( null != errorCallback ){
			//				errorCallback.DynamicInvoke(new object[] { msg, errorCode});
			//			}
			//			
			//			resetCatchVisitingFlag(visitblocksArray);
		};

		if (isUpdateTilesCarmot)
		{
			KBN.UnityNet.getResourceInfo(tilesList, 1, okFunc, errorFunc);
		}
	}

	//world map not support scale
	protected override void scale()
	{
		float k = 0.01f;
		if (MouseSupport) k = 1.0f;

		float result = k * GameInput.GetAxis("Mouse ScrollWheel");
		targetScaleSize -= result * wheelSpeed * Time.deltaTime * Mathf.Abs(targetScaleSize);
		//targetScaleSize = Mathf.Clamp(targetScaleSize, minScaleSize, maxScaleSize);
		targetScaleSize = Mathf.Clamp(targetScaleSize, maxScaleSize, minScaleSize);

		MenuMgr.instance.forceFinishSceneMessage();
	}

	public void moveCityTo(int cx, int cy)
	{
		recenterMapWithCoor(cx, cy);
		repaint(true);
	}

	public void setSearchedTileToHighlight(int cx, int cy)
	{
		hasTile2Highlight = true;
		xOfTile2Highlight = cx;
		yOfTile2Highlight = cy;
	}

	public void search(int cx, int cy)
	{
		recenterMapWithCoor(cx, cy);
		repaint(false);
		setSearchedTileToHighlight(cx, cy);
		if (GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS)
		{
			repaintViaGhostMapCache();
		}
	}

	private void recenterMapWithCoor(int cx, int cy)
	{

		cx = Mathf.Max(cx, 1);
		cx = Mathf.Min(cx, m_mapTotalCols);

		cy = Mathf.Max(cy, 1);
		cy = Mathf.Min(cy, m_mapTotalRows);

		selectedTileName = null;
		selectedTileType = -1;
		selectedTile.SetActive(false);
		highlightTile(false, 0, 0, false);

		nextDisplayTileStartX = cx - screenTileWidth / 2;
		nextDisplayTileStartY = cy - screenTileHeight / 2;

		Vector3 trans = new Vector3();
		trans.x = (nextDisplayTileStartX - 1) * tileWorldWidth + tileWorldWidth * 0.5f; // Make sure the searched tile is positioned at the center of the screen.
		trans.z = -(nextDisplayTileStartY - 1) * tileWorldHeight - tileWorldHeight * 0.5f;

		//camera pos(0,y,0) ->map tile (1,1)
		//compute camera pos by cx,cy
		moveCamera(trans, true);
	}

	private void repaintViaGhostMapCache()
	{
		computeLeftTopTile();
		int dummy1 = 0;
		int dummy2 = 0;
		int dummy3 = 0;
		int dummy4 = 0;
		saveOldBlockRange();
		updateBlockRange(ref dummy1, ref dummy2, ref dummy3, ref dummy4);
		show();
		restoreOldBlockRange();
	}

	public void repaint(bool forceRefresh)
	{

		if (forceRefresh)
		{
			MapMemCache.instance().clear();
		}

		bool needReqData = !MapMemCache.instance().hasData() || needReqTile();
		if (needReqData)
		{
			constructReqTile();
			moveReqWorldMap();
		}
		else if (isInFront)
		{
			highlightSearchedTile();
		}
	}

	private bool needReqTile()
	{

		if (infoStartX < 0 || infoStartY < 0)
		{
			return true;
		}

		var existLeft = infoStartX;
		if (nextDisplayTileStartX < existLeft && existLeft > 1)
		{
			return true;
		}

		var existRight = infoEndX;
		if (nextDisplayTileStartX + screenTileWidth - 1 > existRight && existRight < m_mapTotalCols)
		{
			return true;
		}

		var existTop = infoStartY;
		if (nextDisplayTileStartY < existTop && existTop > 1)
		{
			return true;
		}

		var existBottom = infoEndY;
		if (nextDisplayTileStartY + screenTileHeight - 1 > existBottom && existBottom < m_mapTotalRows)
		{
			return true;
		}
		return false;
	}
	private int infoStartX2;
	private int infoEndX2;
	private int infoStartY2;
	private int infoEndY2;

	private void saveOldBlockRange()
	{
		infoStartX2 = infoStartX;
		infoStartY2 = infoStartY;
		infoEndX2 = infoEndX;
		infoEndY2 = infoEndY;
	}
	private void restoreOldBlockRange()
	{
		infoStartX = infoStartX2;
		infoStartY = infoStartY2;
		infoEndX = infoEndX2;
		infoEndY = infoEndY2;
	}
	private void updateBlockRange(ref int reqBlockLeft, ref int reqBlockRight,
								  ref int reqBlockTop, ref int reqBlockBottom)
	{
		int displayTileEndX = nextDisplayTileStartX + screenTileWidth - 1;
		int displayTileEndY = nextDisplayTileStartY + screenTileHeight - 1;


		//-1, because server tile index start from 1, and left-top is (1,1);
		// reqBlockLeft = Mathf.Max((nextDisplayTileStartX - 1)/Constant.Map.BLOCK_TILE_CNT, 0);
		// reqBlockRight = Mathf.Min((displayTileEndX - 1)/Constant.Map.BLOCK_TILE_CNT, m_mapTotalCols/Constant.Map.BLOCK_TILE_CNT - 1);
		// reqBlockTop = Mathf.Max((nextDisplayTileStartY - 1)/Constant.Map.BLOCK_TILE_CNT, 0);
		// reqBlockBottom = Mathf.Min((displayTileEndY - 1) /Constant.Map.BLOCK_TILE_CNT, m_mapTotalRows/Constant.Map.BLOCK_TILE_CNT - 1);

		// _Global.LogWarning("reqBlockLeft : " + reqBlockLeft + " reqBlockRight : " + reqBlockRight + " reqBlockTop : " + reqBlockTop + " reqBlockBottom : " + reqBlockBottom);

		int centerx = nextDisplayTileStartX + screenTileWidth / 2;
		int centery = nextDisplayTileStartY + screenTileHeight / 2;
		//_Global.LogWarning("centerx : " + centerx + " centery : " + centery);

		int midX = centerx / Constant.Map.BLOCK_TILE_CNT;
		reqBlockLeft = Mathf.Max(midX - 1, 0);
		reqBlockRight = Mathf.Min(midX + 1, m_mapTotalCols / Constant.Map.BLOCK_TILE_CNT - 1);
		int midY = centery / Constant.Map.BLOCK_TILE_CNT;
		reqBlockTop = Mathf.Max(midY - 1, 0);
		reqBlockBottom = Mathf.Min(midY + 1, m_mapTotalRows / Constant.Map.BLOCK_TILE_CNT - 1);

		//_Global.LogWarning("reqBlockLeft1 : " + reqBlockLeft + " reqBlockRight1 : " + reqBlockRight + " reqBlockTop1 : " + reqBlockTop + " reqBlockBottom1 : " + reqBlockBottom);

		infoStartX = reqBlockLeft * Constant.Map.BLOCK_TILE_CNT + 1;
		infoEndX = (reqBlockRight + 1) * Constant.Map.BLOCK_TILE_CNT;
		infoStartY = reqBlockTop * Constant.Map.BLOCK_TILE_CNT + 1;
		infoEndY = (reqBlockBottom + 1) * Constant.Map.BLOCK_TILE_CNT;
	}

	private void constructReqTile()
	{

		reqBlockNames.Clear();
		//-1, because server tile index start from 1, and left-top is (1,1);
		int reqBlockLeft = 0;
		int reqBlockRight = 0;
		int reqBlockTop = 0;
		int reqBlockBottom = 0;

		updateBlockRange(ref reqBlockLeft, ref reqBlockRight, ref reqBlockTop, ref reqBlockBottom);

		for (int i = reqBlockLeft; i <= reqBlockRight; i++)
		{
			for (int j = reqBlockTop; j <= reqBlockBottom; j++)
			{
				reqBlockNames.Add("bl_" + i * Constant.Map.BLOCK_TILE_CNT + "_bt_" + j * Constant.Map.BLOCK_TILE_CNT);

			}
		}


		reqTileFlag = REQ_TILE_WAITING;
		return;
	}


	#region Debug Util
	public int jumpToX = 380;
	public int jumpToY = 380;
	public bool jump = false;
	#endregion
	float carmotUpdateTime = 0;
	public bool _isLerping = false;
	public float _timeStartedLerping;
	public Vector3 movePosFrom;
	public Vector3 movePosTo;
	public bool isCanLerp = true;
	public float fromCamSize;
	public float worldBossMinCamSize = 4f;

	public float timeMinMoozDuringLerp = 0.3f;
	public float delayMinTime = 1f;

	public bool _isMinMoozing = false;

	private void lerp_recenterMapWithCoor(int cx, int cy)
	{
		GameMain.singleton.TouchForbidden = true;
		isCanLerp = true;

		cx = Mathf.Max(cx, 1);
		cx = Mathf.Min(cx, m_mapTotalCols);

		cy = Mathf.Max(cy, 1);
		cy = Mathf.Min(cy, m_mapTotalRows);

		selectedTileName = null;
		selectedTileType = -1;
		selectedTile.SetActive(false);
		highlightTile(false, 0, 0, false);

		nextDisplayTileStartX = cx - screenTileWidth / 2;
		nextDisplayTileStartY = cy - screenTileHeight / 2;

		Vector3 trans = new Vector3();
		trans.x = (nextDisplayTileStartX - 1) * tileWorldWidth + tileWorldWidth * 0.5f; // Make sure the searched tile is positioned at the center of the screen.
		trans.z = -(nextDisplayTileStartY - 1) * tileWorldHeight - tileWorldHeight * 0.5f;
		trans.y = 30;
		movePosFrom = curCamera.transform.position;
		movePosTo = trans;
		_timeStartedLerping = Time.time;
		_isLerping = true;

		fromCamSize = CamSize;

		Invoke("setCanShowWorldBossWord", 0.2f);
	}

	public float moozMinV0 = 0f;
	public float moozMinAcceleration = 10f;
	private void moozMin_Camera()
	{
		float timeSinceStarted = Time.time - _timeStartedLerping;
		float moozMinS = moozMinV0 * timeSinceStarted + ((moozMinAcceleration * Mathf.Pow(timeSinceStarted, 2)) * 0.5f);
		if (CamSize + moozMinS >= fromCamSize)
		{
			CamSize = fromCamSize;
			targetScaleSize = CamSize;
			_isMinMoozing = false;
			GameMain.singleton.TouchForbidden = false;
		}
		else
		{
			CamSize += moozMinS;
		}
	}

	private void lerp_moveCamera( /*Vector3 trans, bool reset*/ )
	{
		Vector3 posBeforeReset = curCamera.transform.position;
		Vector3 lastPos = curCamera.transform.position;

		float timeSinceStarted = Time.time - _timeStartedLerping;
		float percentageComplete = timeSinceStarted / timeMinMoozDuringLerp;
		curCamera.transform.position = Vector3.Lerp(movePosFrom, movePosTo, percentageComplete);
		// s = vo*t + (at*t)/2
		// a = 2s/(t*t)
		//float moozMaxAcceleration = (2f * Mathf.Abs(fromCamSize - worldBossMinCamSize)) / Mathf.Pow(timeMinMoozDuringLerp + moveCameraAddTime, 2);
		//float moozMinS = ((moozMaxAcceleration * Mathf.Pow(timeSinceStarted, 2)) * 0.5f);

		//_Global.LogWarning("Update.coorDinateBarRect : " + coorDinateBarRect);
		//		if(CamSize - moozMinS <= worldBossMinCamSize)
		//		{
		//			CamSize = worldBossMinCamSize;
		//			targetScaleSize = CamSize;
		//		}
		//		else
		//		{
		//			CamSize -= moozMinS;
		//		}
		CamSize = Mathf.Lerp(fromCamSize, worldBossMinCamSize, percentageComplete);
		if (percentageComplete >= 1.0f)
		{
			_isLerping = false;
			curCamera.transform.position = movePosTo;
			PlayerPrefs.SetInt("worldboss_init", 1);

			//showWorldBossWord = true;
			targetScaleSize = CamSize;

			Invoke("setCanMinMoozing", delayMinTime);

			constructReqTile();
			moveReqWorldMap();
		}

		Vector3 tmp = curCamera.transform.position;
		float boundsDiffX = 0f;
		float boundsDiffZ = 0f;
		if (tmp.x < cameraMoveRange.x)
		{
			boundsDiffX = cameraMoveRange.x - tmp.x;
			tmp.x = cameraMoveRange.x;
		}
		else if (tmp.x > cameraMoveRange.xMax)
		{
			boundsDiffX = cameraMoveRange.xMax - tmp.x;
			tmp.x = cameraMoveRange.xMax;
		}

		if (tmp.z < cameraMoveRange.y)
		{
			boundsDiffZ = cameraMoveRange.y - tmp.z;
			tmp.z = cameraMoveRange.y;
		}
		else if (tmp.z > cameraMoveRange.yMax)
		{
			boundsDiffZ = cameraMoveRange.yMax - tmp.z;
			tmp.z = cameraMoveRange.yMax;
		}

		floatingLayerMgr.OnCameraMove(posBeforeReset - tmp);

		curCamera.transform.position = tmp;

		tmp = ground.transform.position;
		tmp.x = curCamera.transform.position.x;
		tmp.z = curCamera.transform.position.z;
		ground.transform.position = tmp;

		mapGrid.onCameraMoved(curCamera.transform.position.x - lastPos.x, curCamera.transform.position.z - lastPos.z);
	}

	private void setCanShowWorldBossWord()
	{
		showWorldBossWord = true;
	}

	private void setCanMinMoozing()
	{
		_timeStartedLerping = Time.time;
		_isMinMoozing = true;
	}

	public void SetWorldMapShowWord(string word)
	{
		PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = WorldBossController.singleton.GetCurBoss();
		if (boss != null)
		{
			Vector2 screenPoint = getScreenPoint(boss.xCoord, boss.yCoord);

			if (isInScreen(screenPoint.x, screenPoint.y))
			{
				tipBarOfMarchLine.rect = new Rect(0, 0.4f * Screen.height, Screen.width, 0.2f * Screen.height);
				tipBarOfMarchLine.InitForWorldMap();

				tipBarOfMarchLine.setInfoContent(word);
				tipBarOfMarchLine.WorldMapShow();

				if (tipBarOfMarchLine != null)
				{
					tipBarOfMarchLine.ReSetRect();
				}
			}
		}
	}

	public bool showWorldBossWord = false;
	public float delayPlayTime = 3f;
	private void worldBossAnim()
	{
		if (GameMain.singleton.IsHaveRealWorldBoss())
		{
			PBMsgWorldBossSocket.PBMsgWorldBossSocket boss = WorldBossController.singleton.GetCurBoss();
			if (boss != null)
			{
				Vector2 screenPoint = getScreenPoint(boss.xCoord, boss.yCoord);

				if (isInScreen(screenPoint.x, screenPoint.y))
				{
					if (WorldBossController.singleton.IsFirstMeetWorldBoss(boss.bossId) && showWorldBossWord)
					{
						showWorldBossWord = false;
						PlayerPrefs.SetInt(Constant.FIRST_MEET_WORLD_BOSS, boss.bossId);

						SetWorldMapShowWord(Datas.getArString("WorldBoss.Information_Text1"));
					}

					if (PlayerPrefs.GetInt("worldboss_init", 0) == 0 && !isCanLerp)
					{
						lerp_recenterMapWithCoor(boss.xCoord, boss.yCoord);
					}
					else
					{
						showWorldBossWord = true;
					}
				}
			}
		}

		if (_isLerping)
		{
			lerp_moveCamera();
		}

		if (_isMinMoozing)
		{
			moozMin_Camera();
		}
	}

	private bool ishave = false;
	private string key;
	protected override void Update()
	{

		if (!GameMain.singleton)
		{
			return;
		}

		m_FrameCount = m_FrameCount + 1;
		timePassed = timePassed + Time.deltaTime;
		// if (timePassed > fpsMeasuringDelta)
		// {
		//     m_FPS = m_FrameCount / timePassed;

		//     timePassed = 0.0f;
		//     m_FrameCount = 0;           
		// }
		//ProfilerSample.BeginSample("MapController.Update  MapMemCache.instance().updateTime()");
		MapMemCache.instance().updateTime();
		//ProfilerSample.EndSample();	
		//ProfilerSample.BeginSample("MapController.Update  worldBossAnim()");
		worldBossAnim();
		//ProfilerSample.EndSample();		
		//ProfilerSample.BeginSample("MapController.Update  base.Update()");
		base.Update();
		//ProfilerSample.EndSample();		

		//ProfilerSample.BeginSample("MapController.Update  tileMgr.Update()");
		tileMgr.Update();
		//ProfilerSample.EndSample();	

		//ProfilerSample.BeginSample("MapController.Update  computeLeftTopTile");
		if (moveEndTimer >= WAIT_TIME_TO_REQ)
		{
			computeLeftTopTile();
			repaint(false);
			moveEndTimer = -1;// not req tile
		}
		else if (moveEndTimer >= 0)
		{
			moveEndTimer += Time.deltaTime;
		}
		//ProfilerSample.EndSample();	
		//GameMain.singleton.birdMgr.Update();

		//ProfilerSample.BeginSample("MapController.Update  search(jumpToX, jumpToY)");
		if (jump)
		{
			jump = false;
			search(jumpToX, jumpToY);
		}
		//ProfilerSample.EndSample();	

		//ProfilerSample.BeginSample("MapController.Update  tipBarOfMarchLine.Update ()");
		if (tipBarOfMarchLine != null)
		{
			tipBarOfMarchLine.Update();
		}
		//ProfilerSample.EndSample();	

		//ProfilerSample.BeginSample("MapController.Update  KBN.GameMain.singleton.forceRepaintWorldMap()");
		if (KBN.TournamentManager.getInstance().ActivitySituationChanged)
		{
			KBN.TournamentManager.getInstance().ActivitySituationChanged = false;
			KBN.GameMain.singleton.forceRepaintWorldMap();
		}
		//ProfilerSample.EndSample();	

		if (isAVAMinimapMapController())
		{

			// Cloud mask
			updateCloudMask();

			avaImp.update();
		}
		else
		{
			//ProfilerSample.BeginSample("MapController.Update  SetMyCityDirection");
			SetMyCityDirection();
			//ProfilerSample.EndSample();
		}

		//ProfilerSample.BeginSample("MapController.Update  March");
		RefreshTroops();
		RefreshRallAndBossLines();
		RefreshRallyAndBossTroops();
		UpdateShowMarchLines();
		UpdateShowMarchTroops();
		//ProfilerSample.EndSample();
		SetBossState();
	}

	void OnGUI()
	{
		Matrix4x4 backMatrix;
		if (null != tipBarOfMarchLine)
		{
			backMatrix = GUI.matrix;
			_Global.setGUIMatrix();
			//			float tbWidth=tipBarOfMarchLine.rect.width;
			Rect oldRec = tipBarOfMarchLine.rect;
			tipBarOfMarchLine.rect = new Rect(0, 390, 640, 180);
			tipBarOfMarchLine.Draw();
			GUI.matrix = backMatrix;
			tipBarOfMarchLine.rect = oldRec;
		}


		// GUIStyle fontStyle = new GUIStyle();
		//  fontStyle.normal.background = null;    //设置背景填充
		//  fontStyle.normal.textColor= new Color(1,0,0);   //设置字体颜色
		//  fontStyle.fontSize = 30; 

		// GUI.Label(new Rect(0, 460, 1000, 1000), ("infoStartX: " + infoStartX), fontStyle);
		// GUI.Label(new Rect(0, 490, 1000, 1000), ("infoStartY: " + infoStartY), fontStyle);
		// GUI.Label(new Rect(0, 520, 1000, 1000), ("nextDisplayTileStartX: " + nextDisplayTileStartX), fontStyle);
		// GUI.Label(new Rect(0, 550, 1000, 1000), ("nextDisplayTileStartY: " + nextDisplayTileStartY), fontStyle);



		//
		//GUI.Label(new Rect(0, 550, 1000, 1000), ("设备模型: " + QualitySettings.GetQualityLevel()), fontStyle);
		////		GUI.Label(new Rect(0, 430, 1000, 1000), ("设备类型: " + SystemInfo.deviceType.ToString()), fontStyle);
		//		GUI.Label(new Rect(0, 460, 1000, 1000), ("显存大小: " + SystemInfo.graphicsMemorySize.ToString()), fontStyle);
		//		GUI.Label(new Rect(0, 490, 1000, 1000), ("内存大小: " + SystemInfo.systemMemorySize.ToString()), fontStyle);
		//		GUI.Label(new Rect(0, 520, 1000, 1000), ("显卡的类型和版本: " + SystemInfo.graphicsDeviceVersion), fontStyle);
		//		GUI.Label(new Rect(0, 550, 1000, 1000), ("当前处理器的数量: " + SystemInfo.processorCount.ToString()), fontStyle);
		//		GUI.Label(new Rect(0, 580, 1000, 1000), ("处理器的名称: " + SystemInfo.processorType), fontStyle);
		// GUI.Label(new Rect(0, 220, 1000, 1000), ("当前FPS: " + GetFPS()), fontStyle);
	}

	void FixedUpdate()
	{
		if (Mathf.Abs(targetScaleSize - CamSize) > 0.05 && (!_isLerping && !_isMinMoozing))
		{
			CamSize = Mathf.Lerp(CamSize, targetScaleSize, Time.fixedDeltaTime * zoomDampening);
			//_Global.LogWarning("CamSize : " + CamSize);
		}
	}

	int qualityLevel = 0;
	public void toggleShowTileLevel()
	{
		displayTileLevel = !displayTileLevel;
		show();
	}


	public void showAVAMarchLineInfo()
	{
		if (!isAVAMinimapMapController())
		{
			return;
		}

		if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen ||
		   GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen)
		{
			return;
		}

		if (!GameMain.GetIsShowAVAMarch())
		{
			SetAllMarchActive(true);
			avaImp.showAVATileMarchLines(0);
			GameMain.SetIsShowAVAMarch(true);
		}
		else
		{
			SetAllMarchActive(false);
			GameMain.SetIsShowAVAMarch(false);
		}
	}
	private void SetAllMarchActive(bool isActive)
	{
		if (rallyBossMarchList != null)
		{
			rallyBossMarchList.gameObject.SetActive(isActive);
		}
	}

	public void setCloudMaskEnabled(bool enabled)
	{
		if (isAVAMinimapMapController())
		{
			if (m_cloudMask == null)
			{
				m_cloudMask = m_camera.transform.Find("CloudMask");
			}
			if (m_cloudMask)
			{
				if (enabled)
				{
					m_cloudMask.gameObject.GetComponent<Renderer>().material.SetColor("_Color", new Color(1f, 1f, 1f, 0.93f));
					m_cloudMask.gameObject.SetActive(enabled);
					m_cloudMaskFading = false;
				}
				else
				{
					m_cloudMaskFading = true;
					m_cloudMaskAlpha = 1f;
				}
			}
		}
	}

	private void updateCloudMask()
	{
		if (isAVAMinimapMapController())
		{
			if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen ||
			   GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen)
			{
				if (m_mapCloudMaskState != 1)
				{
					setCloudMaskEnabled(true);
					m_mapCloudMaskState = 1;
					m_avaTileHUDMgr.cleanup();
					dismissTileInfoPopUp();
				}
			}
			else
			{
				if (m_mapCloudMaskState == 1)
				{
					setCloudMaskEnabled(false);
					m_mapCloudMaskState = 0;
					int x = GameMain.Ava.Seed.MyOutPostTileX;
					int y = GameMain.Ava.Seed.MyOutPostTileY;
					GameMain.singleton.searchWorldMap2(x, y);
				}
				else if (m_mapCloudMaskState == -1)
				{
					if (m_cloudMask == null)
					{
						m_cloudMask = m_camera.transform.Find("CloudMask");
					}
					if (m_cloudMask)
					{
						m_cloudMask.gameObject.SetActive(false);
					}
					m_mapCloudMaskState = 0;
					int x = GameMain.Ava.Seed.MyOutPostTileX;
					int y = GameMain.Ava.Seed.MyOutPostTileY;
					GameMain.singleton.searchWorldMap2(x, y);
				}
			}

			if (m_cloudMaskFading)
			{
				if (m_cloudMaskAlpha >= 0f)
				{
					m_cloudMaskAlpha -= 0.015f;
					m_cloudMask.gameObject.GetComponent<Renderer>().material.SetColor("_Color", new Color(1f, 1f, 1f, m_cloudMaskAlpha));
				}
				else
				{
					m_cloudMask.gameObject.SetActive(false);
					m_cloudMaskFading = false;
				}
			}
		}
	}

	private string showedTileName = null;
	public void showTournamentInfo()
	{
		var allianceID = _Global.INT32(seed["player"]["allianceId"].Value);
		if (allianceID == 0)
		{
			MenuMgr.instance.PushMessage(Datas.getArString("PVP.Battle_FailToaster"));
			return;
		}

		if (slotInfo != null)
		{
			// Show the march line display notice
			int tileType = _Global.INT32(slotInfo["tileType"]);
			int x = _Global.INT32(slotInfo["xCoord"]);
			int y = _Global.INT32(slotInfo["yCoord"]);

			tipBarOfMarchLine.rect = new Rect(0, 0.4f * Screen.height, Screen.width, 0.2f * Screen.height);
			tipBarOfMarchLine.InitForWorldMap();
			string s, name;
			if (isAVAMinimapMapController())
			{
				name = Datas.getArString(AvaUtility.GetTileNameKey(tileType));
			}
			else
			{
				name = TournamentManager.getInstance().getTileName(slotInfo);
			}

			if ((tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY &&
				 tileType <= Constant.TileType.WORLDMAP_LAST) ||

			   (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER &&
			 tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)

			   )
			{

				if (showedTileName != selectedTileName)
				{
					if (isAVAMinimapMapController())
					{
					}
					else
					{
						m_tournamentMarchMgr.showMarch(selectedTileName);
					}
					showedTileName = selectedTileName;
					s = string.Format(Datas.getArString("PVP.Battle_Toaster1"), name, "" + x + ", " + y);

					if (isAVAMinimapMapController())
					{
						AvaMainChrome avaMainChrome = KBN.MenuMgr.instance.getMenu("AvaMainChrome") as AvaMainChrome;
						if (avaMainChrome != null)
						{
							avaMainChrome.ShowMarchLineTipBar(s);
						}
					}
					else
					{
						tipBarOfMarchLine.setInfoContent(s);
						tipBarOfMarchLine.WorldMapShow();
					}
				}
			}
			else
			{
				if (isAVAMinimapMapController())
				{
				}
				else
				{
					m_tournamentMarchMgr.cleanup();
				}
				showedTileName = selectedTileName;
				s = string.Format(Datas.getArString("PVP.Battle_Toaster2"), name, "" + x + ", " + y);
				if (isAVAMinimapMapController())
				{
					AvaMainChrome avaMainChrome = KBN.MenuMgr.instance.getMenu("AvaMainChrome") as AvaMainChrome;
					if (avaMainChrome != null)
					{
						avaMainChrome.ShowMarchLineTipBar(s);
					}
				}
				else
				{
					tipBarOfMarchLine.setInfoContent(s);
					tipBarOfMarchLine.WorldMapShow();
				}
			}
		}

		if (tipBarOfMarchLine != null)
		{
			tipBarOfMarchLine.ReSetRect();
		}
		string obj = "100_123_456";
		//	MenuMgr.instance.PushMenu( "TournamentBonusMenu", obj, "transition_BlowUp" );
	}

	protected override void onScaleBegin(Touch touch0, Touch touch1)
	{

		//		_Global.Log("onScaleBegin displayTileLevel:" + displayTileLevel);
		//		displayTileLevel = !displayTileLevel;
		//		show();
	}

	public Vector3 moveBeginPos;
	protected override void onMoveBegin(Touch touch)
	{
		moveBeginPos = touch.position;

		isUpdateTilesCarmot = false;
		float endY = MenuMgr.instance.getCoordinateBarHeight() / GameMain.vertRatio;
		int centerx = nextDisplayTileStartX + screenTileWidth / 2;
		int centery = nextDisplayTileStartY + screenTileHeight / 2;
		string msg = string.Concat("(", centerx, ",", centery, ")");

		//			MenuMgr.instance.scenceMessage.StartShow( msg, Rect(0,endY - 10,640,50),Rect(0,endY - 10, 640, 50), Mathf.Infinity, false, false);
		MenuMgr.instance.showSceneMessage(msg, new Rect(0, endY + 10, 640, 50), new Rect(0, endY + 10, 640, 50), Mathf.Infinity, false, false);
		//		displayTileLevel = true;
		m_isDragging = true;
		if (isAVAMinimapMapController() || MAP_OPTIMIZATION_THROUGH_LIMITING_CAMERA)
		{
			if (m_enableRepaintOnDragging)
			{
				m_draggingTime = DRAGGING_REPAINT_INTERVAL;
			}
		}
	}

	public void hideShareButton()
	{
		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		component.setTileSharedOK();
	}

	protected override void move(Vector3 trans)
	{
		if (!responseTouch)
		{
			return;
		}
		//		if(SystemInfo.deviceModel == "HUAWEI EML-AL00")
		//		{
		//			trans = trans * 4;
		//		}
		trans = trans * getMoveMapAddSpeed();
		//_Global.LogWarning(" MapController.move  before trans : " + trans);

		// Project the velocity to the right axes in the isometric space
		float x = trans.x;
		float z = trans.z * 1.8f;
		trans.x = upIso.x * z + rightIso.x * x;
		trans.z = upIso.z * z + rightIso.z * x;
		trans.x *= CamSize * DRAGGING_SPEED_FACTOR_ON_CAMERA_SIZE;
		trans.z *= CamSize * DRAGGING_SPEED_FACTOR_ON_CAMERA_SIZE;

		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		if (component.isVisible())
		{
			component.SetVisible(false);
		}

		moveEndTimer = -1;// not req tile

		lastHitName = null;

		mapGrid.gameObject.SetActive(true);
		//_Global.LogWarning(" MapController.move after trans : " + trans);
		moveCamera(-trans, false);

		// Before v17.3, the tile selection indicator
		// is hidden here like "selectedTile.renderer.enabled = false",
		// we removed it from v17.3 as we want to make it
		// visible while dragging the map.
		selectedTile.SetActive(false);
		selectedTileName = null;
		selectedTileType = -1;
		highlightTile(false, 0, 0, false);

		computeLeftTopTile();
		int centerx = nextDisplayTileStartX + screenTileWidth / 2;
		int centery = nextDisplayTileStartY + screenTileHeight / 2;
		if (centerx <= 0)
			centerx = 1;
		if (centery <= 0)
			centery = 1;
		if (isAVAMinimapMapController())
		{
			if (centerx > Constant.Map.AVA_MINIMAP_WIDTH)
			{
				centerx = Constant.Map.AVA_MINIMAP_WIDTH;
			}
			if (centery > Constant.Map.AVA_MINIMAP_HEIGHT)
			{
				centery = Constant.Map.AVA_MINIMAP_HEIGHT;
			}
		}
		else
		{
			if (centerx > Constant.Map.WIDTH)
			{
				centerx = Constant.Map.WIDTH;
			}
			if (centery > Constant.Map.HEIGHT)
			{
				centery = Constant.Map.HEIGHT;
			}
		}
		string msg = "(" + centerx + "," + centery + ")";
		MenuMgr.instance.setSceneMessage(msg);

		Vector3 curInputMovePos = getCurInputMovePos();
		if (Vector3.Distance(moveBeginPos, curInputMovePos) > DRAGGING_REPAINT_INTERVAL_DIS)
		{
			repaintViaGhostMapCache();
			moveBeginPos = curInputMovePos;
		}

		// if( isAVAMinimapMapController() || MAP_OPTIMIZATION_THROUGH_LIMITING_CAMERA ) {
		// 	if( m_isDragging ) {
		// 		if( m_enableRepaintOnDragging ) {
		// 			m_draggingTime += Time.deltaTime;
		// 			// if( m_draggingTime >= DRAGGING_REPAINT_INTERVAL ) {
		// 			// 	m_draggingTime = 0f;
		// 			// 	repaintViaGhostMapCache();
		// 			// }
		// 			Vector3 curInputMovePos = getCurInputMovePos();
		// 			if(Vector3.Distance(moveBeginPos, curInputMovePos) > DRAGGING_REPAINT_INTERVAL_DIS)
		// 			{
		// 				repaintViaGhostMapCache();
		// 				moveBeginPos =  curInputMovePos;
		// 			}
		// 		}
		// 	}
		// }
	}

	protected override void onMoveEnd(Touch touch)
	{
		isUpdateTilesCarmot = true;
		m_isDragging = false;
		mapGrid.gameObject.SetActive(false);
		moveEndTimer = 0;//start time
		MenuMgr.instance.forceFinishSceneMessage();

		if (GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS)
		{
			repaintViaGhostMapCache();
		}
	}

	public bool isAutoupdate()
	{
		return reqTileFlag == REQ_TILE_AUTO;
	}

	public bool isFetchingTile()
	{
		return reqTileFlag == REQ_TILE_MOVE;
	}

	private string GetMarchListInfo()
	{
		int centerx = nextDisplayTileStartX + screenTileWidth / 2;
		int centery = nextDisplayTileStartY + screenTileHeight / 2;
		getTilesResourceStatesInfoDic(false);

		return string.Format("{0}_{1}", centerx, centery);
	}

	private int resourceTileXCoord = 0;
	private int resourceTileYCoord = 0;
	public void GetOneResourceTileInfo(PBMsgResourceTileInfo.PBMsgResourceTileInfo resourceTile)
	{
		if (resourceTile.amount > 0)
		{
			resourceTileXCoord = resourceTile.xCoord;
			resourceTileYCoord = resourceTile.yCoord;
			getTilesResourceStatesInfoDic(false);
		}
		else
		{
			CollectionResourcesMgr.instance().RemoveResourcesData(resourceTile.xCoord, resourceTile.yCoord);
		}
	}

	public void SendGetMarchList()
	{
		GameMain.singleton.SendGetMarchList(GetMarchListInfo());
	}

	private void autoUpdateMap()
	{
		if (reqTileFlag != REQ_TILE_NONE)
		{
			return;
		}

		if (!isInFront)
		{
			Invoke("autoUpdateMap", MapMemCache.UPDATE_DUARATION / 2);
			return;
		}

		reqTileFlag = REQ_TILE_AUTO;
		if (isAVAMinimapMapController())
		{
			MapMemCache.instance().switchDataSet(false);
			avaImp.reqMapData(reqBlockNames);
		}
		else
		{
			MapMemCache.instance().switchDataSet(true);
			SendGetMarchList();
			GameMain.singleton.onReqWorldMap(reqBlockNames, new Action(reqWorldMapOk), new Action<string, string>(autoReqWorldMapError));
		}
	}

	//刷新地图
	public void updateWorldMap(int x, int y, int status)
	{
		string blockName = MapMemCache.instance().getTileInfoSting(x, y);
		if (blockName != null)
		{
			//Debug.LogWarning("blockName:"+blockName);
			MapMemCache.instance().switchDataSet(true);
			List<string> blockNames = new List<string>();
			blockNames.Add(blockName);
			MapView.instance().AllForceUpdateOnlyNextTime = true;
			SendGetMarchList();
			GameMain.singleton.onReqWorldMap(blockNames, new Action(reqWorldMapOk), new Action<string, string>(moveReqWorldMapError));
			if (status == 1)
			{
				MoveCityAni(x, y);
			}
		}
	}
	public GameObject moveAniPre;
	private GameObject moveAniParent;

	public bool IsInView(int x, int y)
	{
		string title = "l_" + x + "_t_" + y;
		Transform t = movePlane.transform.Find(title);

		if (t == null)
			return false;

		return t != null;
	}
	private GameObject GetObjInView(int x, int y)
	{
		string title = "l_" + x + "_t_" + y;
		Transform t = movePlane.transform.Find(title);
		if (t == null)
			return null;

		return t.gameObject;
	}

	//易城动画
	public void MoveCityAni(int x, int y)
	{
		string title = "l_" + x + "_t_" + y;
		Transform t = movePlane.transform.Find(title);
		if (t != null && moveAniPre != null)
		{
			GameObject obj = GameObject.Instantiate(moveAniPre) as GameObject;
			obj.transform.parent = t;
			obj.transform.localPosition = Vector3.zero;
			obj.transform.localEulerAngles = Vector3.zero;
			obj.transform.localScale = Vector3.one;

			if (moveAniParent == null)
			{
				moveAniParent = GameObject.Find("moveAniParent");
				if (moveAniParent == null)
				{
					moveAniParent = new GameObject("moveAniParent") as GameObject;
				}
			}

			obj.transform.parent = moveAniParent.transform;

			Vector3 troopOffset = new Vector3(-2, 2, -2);
			// Vector3 m_from = new Vector3(fromX,0,fromZ)+ troopOffset;

			float myCityPosX = xOrg + tileWorldWidth * (x - 1) + tileWorldWidth * 0.5f;
			float myCityPosY = yOrg - tileWorldHeight * (y - 1) + tileWorldHeight * 0.5f;
			obj.transform.position = new Vector3(myCityPosX, 0, myCityPosY) + troopOffset;
		}
	}

	private void moveReqWorldMap()
	{//force require

		if (!isInFront)
		{
			return;
		}

		reqTileFlag = REQ_TILE_MOVE;
		//_Global.LogWarning("moveReqWorldMap true!!!!");
		MenuMgr.instance.setWaitingLabelVisiable(true);

		if (IsInvoking("autoUpdateMap"))
		{
			CancelInvoke("autoUpdateMap");
		}
		if (isAVAMinimapMapController())
		{
			MapMemCache.instance().switchDataSet(false);
			avaImp.reqMapData(reqBlockNames);
		}
		else
		{
			MapMemCache.instance().switchDataSet(true);
			SendGetMarchList();
			GameMain.singleton.onReqWorldMap(reqBlockNames, new Action(reqWorldMapOk), new Action<string, string>(moveReqWorldMapError));
		}
	}

	public void computeLeftTopTile()
	{
		nextDisplayTileStartX = (int)Mathf.Floor((curCamera.transform.position.x * 100) / (tileWorldWidth * 100)) + 1;
		nextDisplayTileStartY = -(int)Mathf.Ceil((curCamera.transform.position.z * 100) / (tileWorldHeight * 100)) + 1;
	}

	private void moveCamera(Vector3 trans, bool reset)
	{
		Vector3 posBeforeReset = curCamera.transform.position;

		if (reset)
		{
			curCamera.transform.position = new Vector3(0, curCamera.transform.position.y, 0);
			mapGrid.recenter(0, 0);
		}

		Vector3 lastPos = curCamera.transform.position;
		curCamera.transform.Translate(trans, Space.World);

		Vector3 tmp = curCamera.transform.position;
		float boundsDiffX = 0f;
		float boundsDiffZ = 0f;
		if (tmp.x < cameraMoveRange.x)
		{
			boundsDiffX = cameraMoveRange.x - tmp.x;
			tmp.x = cameraMoveRange.x;
		}
		else if (tmp.x > cameraMoveRange.xMax)
		{
			boundsDiffX = cameraMoveRange.xMax - tmp.x;
			tmp.x = cameraMoveRange.xMax;
		}


		if (tmp.z < cameraMoveRange.y)
		{
			boundsDiffZ = cameraMoveRange.y - tmp.z;
			tmp.z = cameraMoveRange.y;
		}
		else if (tmp.z > cameraMoveRange.yMax)
		{
			boundsDiffZ = cameraMoveRange.yMax - tmp.z;
			tmp.z = cameraMoveRange.yMax;
		}

		floatingLayerMgr.OnCameraMove(posBeforeReset - tmp);

		curCamera.transform.position = tmp;

		tmp = ground.transform.position;
		tmp.x = curCamera.transform.position.x;
		tmp.z = curCamera.transform.position.z;
		ground.transform.position = tmp;

		mapGrid.onCameraMoved(curCamera.transform.position.x - lastPos.x, curCamera.transform.position.z - lastPos.z);
	}

	private void autoReqWorldMapError(string msg, string errorCode)
	{
		Invoke("autoUpdateMap", MapMemCache.UPDATE_DUARATION);

		if (reqTileFlag == REQ_TILE_AUTO)
		{
			reqTileFlag = REQ_TILE_NONE;
		}
	}

	private void moveReqWorldMapError(string msg, string errorCode)
	{
		Invoke("autoUpdateMap", MapMemCache.UPDATE_DUARATION);

		reqTileFlag = REQ_TILE_NONE;

		//_Global.LogWarning("moveReqWorldMapError false!!!!");
		MenuMgr.instance.setWaitingLabelVisiable(false);

		string errorMsg = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError(errorCode, msg, null);
		if (errorMsg != null)
		{
			ErrorMgr.singleton.PushError("", errorMsg, true, Datas.getArString("FTE.Retry"), new Action(moveReqWorldMap));
		}
	}

	public void reqWorldMapOk()
	{
		//_Global.LogWarning("reqWorldMapOk false!!!!");
		if (MenuMgr.instance == null || m_targetIndicatorMgr == null)
		{
			UnityNet.reportErrorToServer("MapController  reqWorldMapOK : ", null, null, "MenuMgr == null || m_targetIndicatorMgr == null", false);
			return;
		}
		MenuMgr.instance.setWaitingLabelVisiable(false);
		show();
		m_targetIndicatorMgr.UpdateIndicators();
		Invoke("autoUpdateMap", MapMemCache.UPDATE_DUARATION);
		reqTileFlag = REQ_TILE_NONE;
		if (!isHaveSlotInfo)
		{
			hitSlot(lastHit);
		}
	}

	public void onGotoCampaign()
	{
		hideLevelMarks();
		// Hide the march lines
		if (!isAVAMinimapMapController())
		{
			m_tournamentMarchMgr.cleanup();
			TileStateUnderAttackManager.getInstance().cleanup();
		}
		else
		{
			AvaTileProtectionTimeHUDMgr.getInstance().cleanup();
		}
		showedTileName = null;
	}

	/// <summary>
    /// 前往 迷雾远征
    /// </summary>
	public void onGotoMistExpedition()
	{
		hideLevelMarks();
		showedTileName = null;
	}

	public void onGotoAVA()
	{
		hideLevelMarks();
		// Hide the march lines
		if (!isAVAMinimapMapController())
		{
			m_tournamentMarchMgr.cleanup();
			TileStateUnderAttackManager.getInstance().cleanup();
		}
		else
		{
			AvaTileProtectionTimeHUDMgr.getInstance().cleanup();
		}
		showedTileName = null;
	}


	private void hideLevelMarks()
	{
		displayTileLevel = false;
		show();
	}

	public void show()
	{
		//_Global.LogWarning("MapController.show!!!!!");
		if (movePlane == null)
		{
			return;
		}

		Vector3 tmp = movePlane.transform.position;
		tmp.x += (nextDisplayTileStartX - curDisplayTileStartX) * tileWorldWidth;
		tmp.z -= (nextDisplayTileStartY - curDisplayTileStartY) * tileWorldHeight;
		movePlane.transform.position = tmp;

		curDisplayTileStartX = nextDisplayTileStartX;
		curDisplayTileStartY = nextDisplayTileStartY;

		for (int i = 0; i < screenTileWidth; i++)
		{
			for (int j = 0; j < screenTileHeight; j++)
			{
				tileMgr.OnDataArrive(i, j);
			}
		}

		if (!string.IsNullOrEmpty(selectedTileName))
		{
			GameObject sel = GameObject.Find(selectedTileName);
			if (null != sel)
			{
				string[] a = selectedTileName.Split('_');
				int x = _Global.INT32(a[1]);
				int y = _Global.INT32(a[3]);
				highlightTiles(x, y, selectedTileType);
			}
		}
		else
		{
			// Highlight after searching
			highlightSearchedTile();
		}

	}

	private void highlightSearchedTile()
	{
		if (hasTile2Highlight)
		{
			string name = "l_" + xOfTile2Highlight + "_t_" + yOfTile2Highlight;
			Transform tile = movePlane.transform.Find(name);
			if (tile != null)
			{
				int tileType = Constant.TileType.BOG;
				HashObject info = MapMemCache.instance().getTileInfoData(name);
				if (info != null)
				{
					tileType = info["tileType"] != null ? _Global.INT32(info["tileType"]) : 0;
				}
				highlightTiles(xOfTile2Highlight, yOfTile2Highlight, tileType);
			}
			hasTile2Highlight = false;
		}
	}

	public void onTileInfoPopUpDismiss()
	{

		lastHitName = null;
	}

	public override void onTouchBegin(Vector2 touchPos)
	{
		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		if (component.isVisible())
		{
			Vector2 position = touchPos;//touch.position;
			Rect rect = component.rect;
			float factor = GameMain.horizRatio;//Screen.width/640f;
			rect.x *= factor;
			rect.width *= factor;

			factor = GameMain.vertRatio;//Screen.height/960f;
			rect.y *= factor;
			rect.height *= factor;

			//change zero point from left bottom to left top
			position.y = Screen.height - position.y;
			//			_Global.Log("MapController hit rectContains:" + rect.Contains(position));
			if (rect.Contains(position))
			{
				responseTouch = false;
				return;
			}

			//after judgement, change zero point back;
			position.y = Screen.height - position.y;
		}

		responseTouch = true;
		component.SetVisible(false);
		tileInfoPopUp.SetActive(false);
	}

	public override void hitNGUI(Vector2 position)
	{
		Vector2 myCityPos = GameMain.singleton.getCurCityCoor(GameMain.singleton.getCurCityId());
		search((int)myCityPos.x, (int)myCityPos.y);
	}

	public override void hit(Vector2 position)
	{
		if (isAVAMinimapMapController())
		{
			if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen ||
			   GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen)
			{
				return;
			}
		}
		bendCamera();
		Ray ray = curCamera.ScreenPointToRay(position);

		restoreCamera();
		RaycastHit raycastHit;
		if (Physics.Raycast(ray, out raycastHit))
		{
			//Debug.DrawLine(ray.origin, raycastHit.point, Color.red);
			hitSlot(raycastHit);
		}
	}


	public void bendCamera()
	{
		camSwitch.SwitchOn();
	}

	public void restoreCamera()
	{
		camSwitch.SwitchOff();
	}

	private void highlightTiles(int x, int y, int tileType)
	{
		bool is2x2 = false;
		if (
		   // Tournament
		   (tileType >= Constant.TileType.WORLDMAP_2X2_LT_DUMMY
		 && tileType <= Constant.TileType.WORLDMAP_LAST))
		{


			TournamentManager.getInstance().convertToKeyTile2x2(tileType, ref x, ref y);
			is2x2 = true;

		}
		else if (

		  // AVA
		  tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
		  (tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
	   tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4))
		{

			avaImp.convertToKeyTile2x2(tileType, ref x, ref y);
			is2x2 = true;
		}

		highlightTile(true, x, y, is2x2);
	}
	private void highlightTile(bool show, int x, int y, bool is2x2)
	{
		if (!show)
		{
			tileHighlight.SetActive(false);
		}
		else
		{
			highlightTile(x, y, is2x2);
		}
	}

	private void highlightTile(int x, int y, bool is2x2)
	{
		float xOffset = TileHighlightX;
		float yOffset = TileHighlightY;
		//float scale = 0.165f;
		float scale = 0.17f;
		if (is2x2)
		{
			xOffset = TileHighlightX2;
			yOffset = TileHighlightY2;
			scale = 0.33f;
		}
		Vector3 pos = new Vector3(
			xOrg + (x - 1) * tileWorldWidth + xOffset,
			0f,
			yOrg - (y - 1) * tileWorldHeight + yOffset);


		tileHighlight.SetActive(true);
		tileHighlight.transform.position = pos;
		tileHighlight.transform.localScale = new Vector3(scale, 1f, scale);
	}


	private void adjustSelectedTileByType(int tileType)
	{
		Vector3 pos = selectedTile.transform.position;
		Vector3 scale = selectedTileInitScale;
		switch (tileType)
		{
			case Constant.TileType.WORLDMAP_2X2_LT_ACT:
			case Constant.TileType.WORLDMAP_2X2_LT_DUMMY:
			case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1:
				scale *= 2;
				pos.x += (tileWorldWidth * 0.5f);
				pos.z -= (tileWorldHeight * 0.5f);
				break;
			case Constant.TileType.WORLDMAP_2X2_RT_ACT:
			case Constant.TileType.WORLDMAP_2X2_RT_DUMMY:
			case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER2:
				scale *= 2;
				pos.x -= (tileWorldWidth * 0.5f);
				pos.z -= (tileWorldHeight * 0.5f);
				break;
			case Constant.TileType.WORLDMAP_2X2_LB_ACT:
			case Constant.TileType.WORLDMAP_2X2_LB_DUMMY:
			case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER3:
				scale *= 2;
				pos.x += (tileWorldWidth * 0.5f);
				pos.z += (tileWorldHeight * 0.5f);
				break;
			case Constant.TileType.WORLDMAP_2X2_RB_ACT:
			case Constant.TileType.WORLDMAP_2X2_RB_DUMMY:
			case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4:
				scale *= 2;
				pos.x -= (tileWorldWidth * 0.5f);
				pos.z += (tileWorldHeight * 0.5f);
				break;
		}
		selectedTile.transform.position = pos;
		selectedTile.transform.localScale = scale;
	}

	private bool IsTileSlot(string targetName)
	{

		string[] nameSplits = targetName.Split('_');
		if (nameSplits.Length == 4)
		{
			return true;
		}

		return false;
	}

	public void hitLastSlot()
	{
		hitSlot(lastHit);
	}

	public bool IsCityTile(int x, int y)
	{
		return MapMemCache.instance().IsCityTile(x, y);
	}

	private bool isHaveSlotInfo = true;
	private string lastHitName;
	public bool responseTouch = true;
	public RaycastHit lastHit;
	public override void hitSlot(RaycastHit raycastHit)
	{
		ParticalEffectMgr.getInstance().playEffect((int)ParticalEffectMgr.ParticalEffectType.snow);

		if (!responseTouch || !IsTileSlot(raycastHit.transform.name))
		{       //|| !raycastHit.transform.gameObject.renderer.enabled){
			return;
		}

		SoundMgr.instance().PlayEffect("on_tap", TextureType.AUDIO);
		if (lastHitName == raycastHit.transform.name)
		{
			lastHitName = null;
			return;
		}

		slotInfo = MapMemCache.instance().getTileInfoData(raycastHit.transform.name);
		if (null == slotInfo)
		{
			isHaveSlotInfo = false;
			lastHit = raycastHit;
			//_Global.LogWarning("hitSlot true!!!!");
			//MenuMgr.instance.setWaitingLabelVisiable(true);
			return;
		}

		int x = _Global.INT32(slotInfo["xCoord"]);
		int y = _Global.INT32(slotInfo["yCoord"]);
		int orgX = x;
		int orgY = y;
		object bossInfo = WorldBossController.singleton.GetWorldBossInfo(x, y);
		if (bossInfo != null)
		{
			MenuMgr.instance.PushMenu("WorldBossInfoMenu", bossInfo, "trans_zoomComp");
			if (!PlayerPrefs.HasKey(Constant.BEFORE_FIRST_ATTACK_WORLD_BOSS))
			{
				WorldBossController.singleton.SelectBoss();
			}
			else
			{
				Vector3 slectPos = selectedTile.transform.position;
				slectPos.x = raycastHit.transform.position.x;
				slectPos.z = raycastHit.transform.position.z;
				selectedTile.transform.position = slectPos;
				int type = _Global.INT32(slotInfo["tileType"]);

				if (type == Constant.TileType.TILE_TYPE_AVA_BOG ||
				   type == Constant.TileType.TILE_TYPE_AVA_BOG2 ||
				   type == Constant.TileType.TILE_TYPE_AVA_BOG3 ||
				   type == Constant.TileType.TILE_TYPE_AVA_BOG4 ||
				   type == Constant.TileType.TILE_TYPE_AVA_BOG5)
				{
					return;
				}
				lastHitName = raycastHit.transform.name;

				selectedTileName = lastHitName;
				selectedTileType = type;
				adjustSelectedTileByType(type);
				selectedTile.SetActive(true);
				highlightTiles(orgX, orgY, type);
			}
			// MenuMgr.instance.SetWorldBossInfoVis(true,bossInfo);
			return;
		}
		else
		{
			// MenuMgr.instance.SetWorldBossInfoVis(false,null);
			WorldBossController.singleton.UnSelectBoss();
		}

		int tileType = _Global.INT32(slotInfo["tileType"]);

		if (tileType == Constant.TileType.TILE_TYPE_AVA_BOG ||
		   tileType == Constant.TileType.TILE_TYPE_AVA_BOG2 ||
		   tileType == Constant.TileType.TILE_TYPE_AVA_BOG3 ||
		   tileType == Constant.TileType.TILE_TYPE_AVA_BOG4 ||
		   tileType == Constant.TileType.TILE_TYPE_AVA_BOG5)
		{
			return;
		}

		bool tileChangedBy2x2Context = KBN.TournamentManager.getInstance().convertToKeyTile2x2(tileType, ref x, ref y);
		if (tileChangedBy2x2Context)
		{
			slotInfo = MapMemCache.instance().getTileInfoData("l_" + x + "_t_" + y);
			if (null == slotInfo)
			{
				return;
			}
		}
		if (isAVAMinimapMapController())
		{
			tileChangedBy2x2Context = avaImp.convertToKeyTile2x2(tileType, ref x, ref y);
			if (tileChangedBy2x2Context)
			{
				slotInfo = MapMemCache.instance().getTileInfoData("l_" + x + "_t_" + y);
				if (null == slotInfo)
				{
					return;
				}
			}
		}

		lastHitName = raycastHit.transform.name;
		selectedTileName = lastHitName;
		selectedTileType = tileType;

		Vector3 tmp = selectedTile.transform.position;
		tmp.x = raycastHit.transform.position.x;
		tmp.z = raycastHit.transform.position.z;
		selectedTile.transform.position = tmp;

		adjustSelectedTileByType(tileType);
		selectedTile.SetActive(true);
		highlightTiles(orgX, orgY, tileType);

		float widthFactor = GameMain.horizRatio; // equals to Screen.width / 640.0f;
		float heightFactor = GameMain.vertRatio; // equals to Screen.height / 960.0f;

		Rect cameraPixelRect = curCamera.pixelRect;

		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();

		//todo rally
		//		if(checkIsCanRallyAttack(slotInfo))
		//		{
		//			component.setRallyAttack();
		//		}
		//		else
		//		{
		component.resetRallyAttack();
		//		}

		Rect popupRect = component.rect;
		popupRect.width *= widthFactor;
		popupRect.height *= heightFactor;

		float topCenterX = raycastHit.transform.position.x + tileWorldWidth * 3 / 4; // Nothing but for alignment...
		float topCenterY = raycastHit.transform.position.z + tileWorldHeight / 2;

		//_Global.LogWarning("march recive a empty packet!" + raycastHit.transform.localPosition);
		// A screen space point is defined in pixels. The bottom-left of the screen is (0,0);
		// the right-top is (pixelWidth,pixelHeight). The z position is in world units from the camera.
		bendCamera();
		Vector3 screenPoint = curCamera.WorldToScreenPoint(new Vector3(topCenterX, 0, topCenterY));
		//_Global.LogWarning("march recive a empty packet!" + screenPoint);
		float myCityScreenX = -(Screen.width / 2 - screenPoint.x);
		float myCityScreenY = -(Screen.height / 2 - screenPoint.y);
		//_Global.LogWarning("myCityScreenX : " + myCityScreenX + "myCityScreenY : " + myCityScreenY);

		restoreCamera();
		// middle-bottom of the popup
		float toScreenX = screenPoint.x;
		float toScreenY = screenPoint.y;

		//popupRect left bottom pos limit
		int topLimit = (int)(cameraPixelRect.yMax - popupRect.height) - POP_INFO_EDGE;


		// Check veritcal bounds
		if (toScreenY > topLimit)
		{
			toScreenY = topLimit;
		}
		else
		{
			// Find the screen position of the tile next to the picked one.
			float bottomCenterY = topCenterY - tileWorldHeight;
			bendCamera();
			Vector3 bottomScreenPoint = curCamera.WorldToScreenPoint(new Vector3(topCenterX, 0, bottomCenterY));
			restoreCamera();
			// Check if that position is below the bottom of the viewport
			if (bottomScreenPoint.y < cameraPixelRect.y)
			{
				toScreenY += cameraPixelRect.y - bottomScreenPoint.y;
			}
		}

		// Check horizontal bounds
		int leftLimit = (int)(popupRect.width / 2) + POP_INFO_EDGE;
		if (toScreenX < leftLimit)
		{
			toScreenX = leftLimit;
		}
		else
		{
			int rightLimit = Screen.width - (int)(popupRect.width / 2) - POP_INFO_EDGE;
			if (toScreenX > rightLimit)
			{
				toScreenX = rightLimit;
			}
		}

		if (toScreenX != screenPoint.x || toScreenY != screenPoint.y)
		{

			// We need to calculate the diff vector in the world space. For
			// we don't want to get a diff vector with a significant y-value,
			// we should use the two ray-to-point distances to calculate the
			// world space positions.
			//
			//    project-plane
			//       /
			//  from/
			//     /\
			//  to/  \
			//   /    \
			//  / \   \distance1(d1)
			// /   \   \
			///(d2) \   \
			//-------+---+-----
			//       p1  p2
			//
			// p1 and p2 shouldn't have a y-diff.
			//
			bendCamera();
			Ray ray = curCamera.ScreenPointToRay(new Vector2(toScreenX, toScreenY));
			restoreCamera();
			RaycastHit rh;
			if (Physics.Raycast(ray, out rh))
			{
				bendCamera();
				Vector3 trans = getMoveWorldDis((int)screenPoint.x, (int)screenPoint.y, raycastHit.distance,
												(int)toScreenX, (int)toScreenY, rh.distance);
				restoreCamera();
				trans.y = 0;
				moveCamera(-trans, false);
				repaintViaGhostMapCache();
				// Request the data again
				computeLeftTopTile();
				repaint(false);
			}
		}

		// In the GUI system, the left-top of the screen is (0, 0), so we need to
		// transform the y coordinate of the projected point: from the middle-bottom to the
		// left-top of the box.
		component.rect.x = (toScreenX - popupRect.width / 2) / widthFactor;
		component.rect.y = (Screen.height - toScreenY - popupRect.height) / heightFactor;

		//hide progress bar
		MenuMgr.instance.mainChromHideAllList();

		// Show the tile info dialog
		bool canShowDlg = true;
		if (tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY)
		{
			var allianceID = _Global.INT32(seed["player"]["allianceId"].Value);
			if (allianceID == 0)
			{
				canShowDlg = false;
				MenuMgr.instance.PushMessage(Datas.getArString("PVP.Battle_FailToaster"));
			}
		}

		string tileKey = string.Concat(x, "_", y);
		if (CollectionResourcesMgr.instance().collectResources.ContainsKey(tileKey) && !isAVAMinimapMapController())
		{
			CollectResourcesInfo info = CollectionResourcesMgr.instance().collectResources[tileKey];
			//显示城堡等级不足，无法采集carmot资源
			if (info.resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				if (Resource.singleton.GetCastleLevel() < Constant.CarmotLimitLevel)
				{
					ErrorMgr.singleton.PushError("", Datas.getArString("Newresource.tile_lackoflevel"), true, Datas.getArString("Common.OK_Button"), null);
					return;
				}
			}
			else
			{
				if (Resource.singleton.GetCastleLevel() < Constant.ResourceLimitLevel)
				{
					ErrorMgr.singleton.PushError("", Datas.getArString("Error.err_8100"), true, Datas.getArString("Common.OK_Button"), null);
					return;
				}
			}
		}

		if (canShowDlg)
		{
			tileInfoPopUp.SetActive(true);
			component.SetVisible(true);
			component.display(slotInfo, null/*raycastHit.transform.renderer.material.mainTexture*/); // TODO
																									 //lastHit = raycastHit;
			isHaveSlotInfo = true;
			//_Global.LogWarning("hitSlot false!!!!");
			//MenuMgr.instance.setWaitingLabelVisiable(false);
		}
	}

	public void updateTileProtectionCover(int tileId, int tileType, int tileUserId, long time)
	{
		if (isAVAMinimapMapController())
		{
			int x = ((tileId - 1) % Constant.Map.AVA_MINIMAP_WIDTH) + 1;
			int y = (tileId - 1) / Constant.Map.AVA_MINIMAP_WIDTH + 1;
			int myUserID = _Global.INT32(seed["player"]["userId"].Value);
			try2ActivateAVATileProtectionCover(tileType, x, y, (int)time, (tileUserId == 0) ? true : (myUserID == tileUserId));
		}
	}

	private string[] avaTileNames = {
		"ava_player",
		"ava_wonder",
		"ava_super_wonder",
		"ava_attack",
		"ava_life",
		"ava_speed",
		"ava_plain",
		"ava_bog1",
		"ava_item",
		"ava_mercenery",
		"ava_super_wonder1",
		"ava_super_wonder2",
		"ava_super_wonder3",
		"ava_super_wonder4",
		"ava_bog2",
		"ava_bog3",
		"ava_bog4",
		"ava_bog5",
		"ava_mercenery",
		"ava_item"
	};

	private void try2ActivateAVATileProtectionCover(int tileType, int x, int y, int time, bool showTime)
	{
		bool is2x2 = (tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER) ||
			(tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
			 tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4);

		if (is2x2)
		{
			avaImp.convertToKeyTile2x2(tileType, ref x, ref y);
		}

		string tileId = "" + (x + (y - 1) * Constant.Map.AVA_MINIMAP_WIDTH);

		Vector3 localPos = new Vector3(
			xOrg + (x - 1) * tileWorldWidth,
			0f,
			yOrg - (y - 1) * tileWorldHeight);

		if (is2x2)
		{
			localPos += new Vector3(tileWorldWidth * 0.5f, 0f, -tileWorldHeight * 0.5f);
		}

		AvaTileProtectionTimeHUDMgr.getInstance().activateTileProtectionHUD(tileId, localPos, time,
																			is2x2, showTime);
	}

	private string tileNameFormat = "l_{0}_t_{1}";
	//外部使用
	public void setTexturePublic(int infoX, int infoY)
	{
		if (IsInView(infoX, infoY))
		{
			setTexturePrivate(GetObjInView(infoX, infoY), infoX, infoY);
		}
	}

	private void setTexturePrivate(GameObject obj, int infoX, int infoY)
	{
		if (infoX < infoStartX || infoY < infoStartY
		   || infoX > infoEndX || infoY > infoEndY)
		{
			obj.SetActive(false);
			return;
		}

		HashObject slotInfo = MapMemCache.instance().getTileInfoData(infoX, infoY);
		bool showMotifFromGhostMapCache = false;
		int tileMotif = -1;
		int tileLevel = 1;
		int tileUserID = 0;
		if (null == slotInfo)
		{
			// _Global.Log("slotInfo is null");
			if (GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS)
			{
				GhostMap.getInstance().switchDataSet(!isAVAMinimapMapController());
				tileMotif = GhostMap.getInstance().GetTileMotif(infoX, infoY);
				tileLevel = GhostMap.getInstance().GetTileLevel(infoX, infoY);
				tileUserID = GhostMap.getInstance().GetTileUserID(infoX, infoY);
				if (tileMotif == -1 || tileLevel == -1 ||
				   tileUserID == -1)
				{
					obj.SetActive(false);
					return;
				}
				else
				{
					if (isAVAMinimapMapController())
					{
						if (tileMotif < Constant.TileType.TILE_TYPE_AVA_PLAYER || tileMotif > Constant.TileType.TILE_TYPE_AVA_LAST)
						{
							tileMotif = Constant.TileType.TILE_TYPE_AVA_BOG;
						}
					}
					showMotifFromGhostMapCache = true;
				}
			}
			else
			{
				obj.SetActive(false);
				return;
			}
		}

		// Optimizes here: 
		// (a)string format function V.S. (b)string concat by "l_" + infoX + "_t_" + infoY
		//    Total Self  Calls GC Alloc Time ms Self ms
		// (a)11.6% 0.6%  729  143.8KB   12.91   0.67
		// (b)12.1% 3.8% 2167  160.6KB   14.18   4.49
		StringBuilder sb = new StringBuilder();
		sb.Capacity = 16;
		sb.Append("l_");
		sb.Append(infoX);
		sb.Append("_t_");
		sb.Append(infoY);
		obj.name = sb.ToString();//string.Format( tileNameFormat, infoX, infoY );

		obj.SetActive(true);



		#region //---------------- openObj ----------------------------------------

		GameObject openObj = obj.transform.Find("open").gameObject;
		var openObjRenderer = openObj.GetComponent<Renderer>();
		openObjRenderer.enabled = false;

		int tileType = showMotifFromGhostMapCache ? tileMotif : _Global.INT32(slotInfo["tileType"]);
		int tileKind = showMotifFromGhostMapCache ? 0 : _Global.INT32(slotInfo["tileKind"]);
		int serverID = _Global.INT32(seed["player"]["worldId"].Value);
		if (isAVAMinimapMapController())
		{
			if (!showMotifFromGhostMapCache)
			{
				if (slotInfo["serverId"] != null)
				{
					serverID = _Global.INT32(slotInfo["serverId"]);
				}
			}
		}
		else
		{

			if (slotInfo != null && slotInfo["gateStatus"] != null)
			{
				bool isOpen = _Global.INT32(slotInfo["gateStatus"]) == 1 ? true : false;
				openObjRenderer.enabled = isOpen;
			}
			else
			{
				openObjRenderer.enabled = false;
			}
		}
		int flagNumber = showMotifFromGhostMapCache ? 0 : checkFlag(slotInfo, tileType, serverID);

		bool bShowLevelObj = false;
		int prestigeLv = 0;

		#endregion


		#region //---------------- flagObj ----------------------------------------


		GameObject flagObj = obj.transform.Find("flag").gameObject;
		var flagObjRenderer = flagObj.GetComponent<Renderer>();
		if (!showMotifFromGhostMapCache && flagNumber != 0)
		{
			flagObjRenderer.enabled = true;

			//string flagTextName;
			switch (flagNumber)
			{
				case -1://friendly
					flagObjRenderer.material.mainTexture = flagBlue1;
					break;

				case -2://hostile
					flagObjRenderer.material.mainTexture = flagRed1;
					break;

				default://own
					if (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER && tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)
					{
						flagObjRenderer.material.mainTexture = flagYellow0;
					}
					else
					{
						flagObjRenderer.material.mainTexture = TextureMgr.instance().LoadTexture("icon_map_view_flag_yellow_" + flagNumber, TextureType.ICON_ELSE);
					}
					break;
			}
		}
		else
		{
			flagObjRenderer.enabled = false;
		}
		MaterialColorScheme.instance.ApplyColorScheme(flagObj, "CityBuilding");

		string textureName;
		int imgSubIdx = 1;
		int level = showMotifFromGhostMapCache ? tileLevel : _Global.INT32(slotInfo["tileLevel"]);
		//AllianceEmblemData allianceEmblemData = null;

		#endregion


		#region //---------------- buildingObj ----------------------------------------


		GameObject buildingObj = obj.transform.Find("building").gameObject;


		var skinRes = string.Empty;
		//============================  玩家城堡 的 tile ，并且使用了城堡皮肤 ========================================================
		if (tileType == Constant.TileType.CITY && _Global.INT32(slotInfo["tileUserId"]) != 0 && _Global.INT32(slotInfo["tileCityId"]) != 0)
		{
			if (slotInfo.Contains("skinRes"))
			{
				skinRes = slotInfo["skinRes"].Value.ToString();

				if (string.Equals(skinRes, Constant.CITYSKIN_DEFAULT_SKINRES))
					skinRes = string.Empty;
			}
		}

		if (!string.IsNullOrEmpty(skinRes))
		{
			/* ===玩家的城堡 使用了城堡皮肤====== */
			SetCityBuildingObj(buildingObj, skinRes, showMotifFromGhostMapCache, level);
		}
		else
		{
			//其他的 tile 的处理
			SetBuildingObj(buildingObj, slotInfo, tileType, showMotifFromGhostMapCache, level);
		}

		//=========================================================================================================================



		if (tileType == Constant.TileType.CITY &&
		   (showMotifFromGhostMapCache ? (tileUserID == 0) : (_Global.INT32(slotInfo["tileUserId"]) == 0)))
		{
			textureName = "Barbarian";
			if (level <= 3)
			{
				imgSubIdx = 1;
			}
			else if (level <= 6)
			{
				imgSubIdx = 2;
			}
			else if (level <= 10)
			{
				imgSubIdx = 3;
			}
			else if (level <= 13)
			{
				imgSubIdx = 4;
			}
			else if (level <= 16)
			{
				imgSubIdx = 5;
			}
			else
			{
				imgSubIdx = 6;
			}
			if (level > 10) level -= 10;
			bShowLevelObj = displayTileLevel;
		}
		else
		{
			textureName = "w_" + tileType;
			switch (tileType)
			{
				case Constant.TileType.CITY:
					int cityType = showMotifFromGhostMapCache ? 1 : _Global.INT32(slotInfo["cityType"]);
					if (cityType == 5)
						textureName = "w5_" + tileType;
					HashObject tileUserInfo = showMotifFromGhostMapCache ? null : MapMemCache.instance().getUserInfoData("u" + slotInfo["tileUserId"].Value);
					if (!showMotifFromGhostMapCache && null != tileUserInfo &&
					   (_Global.INT32(tileUserInfo["w"]) == 2 || _Global.INT32(tileUserInfo["w"]) == 3))
					{
						imgSubIdx = 0;
					}
					else
					{
						string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
						//such as 0_5_1, 5 result
						if (imgName != null && imgName.Length > 2)
						{
							imgName = imgName.Substring(2, 1);
							imgSubIdx = _Global.INT32(imgName);
						}
					}

					HashObject prestigeData = GameMain.GdsManager.GetGds<GDS_Building>().getPrestigeDataFromRealLv(Constant.Building.PALACE, level);
					prestigeLv = _Global.INT32(prestigeData["prestige"]);
					level = _Global.INT32(prestigeData["level"]);
					bShowLevelObj = (displayTileLevel && prestigeLv > 0);

					// #if SHOW_ALLIANCE_EMBLEM_IN_WORLDMAP
					// if (null != tileUserInfo && null != tileUserInfo["e"] && string.Empty != tileUserInfo["e"].Value)
					// {
					// 	allianceEmblemData = new AllianceEmblemData();
					// 	JasonReflection.JasonConvertHelper.ParseToObjectOnce(allianceEmblemData, tileUserInfo["e"]);
					// 	if (AllianceEmblemData.Empty.Equals(allianceEmblemData))
					// 		allianceEmblemData = null;
					// }
					// #endif			
					textureName = "w_50";
					imgSubIdx = 1;
					break;

				case Constant.TileType.BOG:
					imgSubIdx = 1;
					bShowLevelObj = false;
					break;

				default:
					if (level <= 3)
					{
						imgSubIdx = 1;
					}
					else if (level <= 6)
					{
						imgSubIdx = 2;
					}
					else
					{
						imgSubIdx = 3;
					}
					bShowLevelObj = displayTileLevel;
					break;
			}
		}
		string tileName = null;
		bool tileProtected = true;
		if (tileType == Constant.TileType.WORLDMAP_2X2_KEY_TILE)
		{
			tileName = "tournament_1x1_dummy";
		}
		else if (tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY &&
				tileType <= Constant.TileType.WORLDMAP_LAST)
		{ // Activity tiles
			tileName = "tournament_1x1_act2";
			if (tileType == Constant.TileType.WORLDMAP_1X1_ACT)
			{
				tileName = tileKind == 1 ? "tournament_1x1_act" : "tournament_1x1_act2";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LT_ACT)
			{
				tileName = "tournament_2x2_lt_act";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RT_ACT)
			{
				tileName = "tournament_2x2_rt_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LB_ACT)
			{
				tileName = "tournament_2x2_lb_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RB_ACT)
			{
				tileName = "tournament_2x2_rb_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_1X1_DUMMY)
			{
				tileName = "tournament_1x1_dummy";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LT_DUMMY)
			{
				tileName = "tournament_2x2_lt_dummy";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RT_DUMMY)
			{
				tileName = "tournament_2x2_rt_dummy";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LB_DUMMY)
			{
				tileName = "tournament_2x2_lb_dummy";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RB_DUMMY)
			{
				tileName = "tournament_2x2_rb_dummy";
				bShowLevelObj = false;
			}
		}
		else if (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER && tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)
		{

			tileName = avaTileNames[tileType - Constant.TileType.TILE_TYPE_AVA_PLAYER];
			if (tileType == Constant.TileType.TILE_TYPE_AVA_PLAYER)
			{
				if (flagNumber != -2)
				{
					tileName = "ava_player2";
				}
			}

#if UPDATE_PROTECTOIN_COVER_ON_TILE_UPDATE
			if( tileType != Constant.TileType.TILE_TYPE_AVA_BOG &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG2 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG3 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG4 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG5 ) {
				
				if( slotInfo != null && slotInfo["protectTime"] != null ) {
					long time = _Global.INT64( slotInfo["protectTime"] );
					if( avaImp.checkProtected( time ) ) {
						tileProtected = true;
						int myUserID = _Global.INT32(seed["player"]["userId"].Value);
						tileUserID = ( tileUserID == 0 ) ? _Global.INT32( slotInfo["tileUserId"] ) : 0;
						try2ActivateAVATileProtectionCover( tileType, infoX, infoY, (int)time, tileUserID==myUserID );
					}
				}
			}
#endif

#if USE_AVA_TILE_EFFECT
			avaImp.setupTileEffect( obj, tileType );
#endif

#if TEST_AVA_TILE_PROTECTION
			// Also need to attach a AvaTileProtectionTimeManager to the world map
			if( infoX == 1 && infoY == 1 ) {
				Vector3 localPos = new Vector3(
					xOrg + ( infoX - 1 ) * tileWorldWidth,
					0f,
					yOrg - ( infoY - 1 ) * tileWorldHeight );
				
				AvaTileProtectionTimeHUDMgr.getInstance().activateTileProtectionHUD( ""+(( infoX - 1 ) + ( infoY - 1 ) * 80 + 1), localPos, GameMain.unixtime()+30,
				                                                                    tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
				                                                                    ( tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
				 tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) );
			}
#endif
		}
		else
		{
			tileName = textureName + "_" + imgSubIdx + "_1";
			GameObject protectionCoverObj = obj.transform.Find("protectionCover").gameObject;
			SetProtectionCoverObj(protectionCoverObj, slotInfo, tileType, showMotifFromGhostMapCache, level);
#if TEST_AVA_TILE_PROTECTION
			// Also need to attach a AvaTileProtectionTimeManager to the world map
			if( infoX == 1 && infoY == 1 ) {
				Vector3 localPos = new Vector3(
					xOrg + ( infoX - 1 ) * tileWorldWidth,
					0f,
					yOrg - ( infoY - 1 ) * tileWorldHeight );
				
				AvaTileProtectionTimeHUDMgr.getInstance().activateTileProtectionHUD( ""+(( infoX - 1 ) + ( infoY - 1 ) * 800 + 1), localPos, GameMain.unixtime()+30,
				                                                                    tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
				                                                                    ( tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
				 tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) );
			}
#endif
		}
		var objRenderer = obj.GetComponent<Renderer>();
		if (!string.IsNullOrEmpty(tileName))
		{
			MaterialMgr.instance.SetTextureWithSameMaterial(objRenderer, tileName, TextureType.MAP17D3A_TILE);
			MaterialColorScheme.instance.ApplyColorScheme(objRenderer, "WorldMapTile");
		}


		#endregion


		#region //---------------- levelObj ----------------------------------------


		GameObject levelObj = obj.transform.Find("level").gameObject;
		if (bShowLevelObj)
		{
			GetCarmotLevel(infoX + "_" + infoY, ref level);
			levelObj.SetActive(true);
			showLevelObj(levelObj, level, prestigeLv, true);
		}
		else
		{
			levelObj.SetActive(false);
		}

		//GameObject emblemObj = obj.transform.Find("emblem").gameObject;
		//SetAllianceEmblem(emblemObj, allianceEmblemData);

		//boss fight
		if (!isAVAMinimapMapController() && GameMain.singleton.isBoss(infoX.ToString(), infoY.ToString()))
		{
			long curTime = GameMain.unixtime();
			long eventStartTime = GameMain.singleton.getBossStartTime();
			long eventEndTime = GameMain.singleton.getBossEndTime();
			if (curTime >= eventStartTime && curTime <= eventEndTime)
			{
				MaterialMgr.instance.SetTextureWithSameMaterial(objRenderer, "w_51_4_1", TextureType.MAP17D3A_TILE);
				MaterialColorScheme.instance.ApplyColorScheme(objRenderer, "WorldMapTile");
			}
		}
		//世界BOSS
		if (!isAVAMinimapMapController() && WorldBossController.singleton.isWorldBoss(infoX, infoY))
		{
			WorldBossController.singleton.RefreshBossObj(obj, infoX, infoY);
		}

		if (!showMotifFromGhostMapCache && !isAVAMinimapMapController())
		{
			CheckCarmotImgVisibale(infoX + "_" + infoY, obj);
			SetCarmotStateTexture(obj, infoX + "_" + infoY);
		}


		#endregion

	}


	private void setTexture(TilePrefabData tilePrefData, int infoX, int infoY)
	{

		#region //---------------- tileObj ----------------------------------------

		GameObject obj = tilePrefData.tileObj;

		infoX += curDisplayTileStartX;
		infoY += curDisplayTileStartY;

		if (infoX < 1 || infoY < 1 || infoX > 800 || infoY > 800)
		{
			obj.SetActive(false);
			return;
		}

		HashObject slotInfo = MapMemCache.instance().getTileInfoData(infoX, infoY);
		if (!isAVAMinimapMapController() && MapMemCache.instance().IsLoad && slotInfo == null)
		{
			slotInfo = GameMain.singleton.GetBaseTile(infoX, infoY);
		}
		bool showMotifFromGhostMapCache = false;
		int tileMotif = -1;
		int tileLevel = 1;
		int tileUserID = 0;
		if (null == slotInfo)
		{
			if (GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS)
			{
				GhostMap.getInstance().switchDataSet(!isAVAMinimapMapController());
				tileMotif = GhostMap.getInstance().GetTileMotif(infoX, infoY);
				tileLevel = GhostMap.getInstance().GetTileLevel(infoX, infoY);
				tileUserID = GhostMap.getInstance().GetTileUserID(infoX, infoY);
				if (tileMotif == -1 || tileLevel == -1 ||
				   tileUserID == -1)
				{
					obj.SetActive(false);
					return;
				}
				else
				{
					if (isAVAMinimapMapController())
					{
						if (tileMotif < Constant.TileType.TILE_TYPE_AVA_PLAYER || tileMotif > Constant.TileType.TILE_TYPE_AVA_LAST)
						{
							tileMotif = Constant.TileType.TILE_TYPE_AVA_BOG;
						}
					}
					showMotifFromGhostMapCache = true;
				}
			}
			else
			{
				obj.SetActive(false);
				return;
			}
		}

		// Optimizes here: 
		// (a)string format function V.S. (b)string concat by "l_" + infoX + "_t_" + infoY
		//    Total Self  Calls GC Alloc Time ms Self ms
		// (a)11.6% 0.6%  729  143.8KB   12.91   0.67
		// (b)12.1% 3.8% 2167  160.6KB   14.18   4.49
		obj.name = string.Concat("l_", infoX, "_t_", infoY);
		obj.SetActive(true);

		#endregion

		#region //---------------- openObj ----------------------------------------



		GameObject openObj = tilePrefData.openObj;
		var openObjRenderer = openObj.GetComponent<Renderer>();
		openObjRenderer.enabled = false;
		string tileKey = string.Concat(infoX, "_", infoY);

		int tileType = showMotifFromGhostMapCache ? tileMotif : _Global.INT32(slotInfo["tileType"]);
		int tileKind = showMotifFromGhostMapCache ? 0 : _Global.INT32(slotInfo["tileKind"]);
		int serverID = _Global.INT32(seed["player"]["worldId"].Value);
		if (isAVAMinimapMapController())
		{
			if (!showMotifFromGhostMapCache)
			{
				if (slotInfo["serverId"] != null)
				{
					serverID = _Global.INT32(slotInfo["serverId"]);
				}
			}
		}
		else
		{

			if (slotInfo != null && slotInfo["gateStatus"] != null)
			{
				bool isOpen = _Global.INT32(slotInfo["gateStatus"]) == 1 ? true : false;
				openObjRenderer.enabled = isOpen;
			}
			else
			{
				openObjRenderer.enabled = false;
			}
		}
		int flagNumber = showMotifFromGhostMapCache ? 0 : checkFlag(slotInfo, tileType, serverID);

		bool bShowLevelObj = false;
		int prestigeLv = 0;

		// if((infoX == 3 && infoY == 5))
		// {
		// 	_Global.LogWarning("Ava 63 60  tileType : " + tileType );
		// }
		#endregion

		#region //---------------- flagObj ----------------------------------------

		GameObject flagObj = tilePrefData.flagObj;
		var flagObjRenderer = flagObj.GetComponent<Renderer>();
		if (!showMotifFromGhostMapCache && flagNumber != 0)
		{
			flagObjRenderer.enabled = true;

			//string flagTextName;
			switch (flagNumber)
			{
				case -1://friendly
					flagObjRenderer.material.mainTexture = flagBlue1;
					break;

				case -2://hostile
					flagObjRenderer.material.mainTexture = flagRed1;
					break;

				default://own
					if (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER && tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)
					{
						flagObjRenderer.material.mainTexture = flagYellow0;
					}
					else
					{
						flagObjRenderer.material.mainTexture = TextureMgr.instance().LoadTexture("icon_map_view_flag_yellow_" + flagNumber, TextureType.ICON_ELSE);
					}
					break;
			}
		}
		else
		{
			flagObjRenderer.enabled = false;
		}

		MaterialColorScheme.instance.ApplyColorScheme(flagObj, "CityBuilding");
		string textureName;
		int imgSubIdx = 1;
		int level = showMotifFromGhostMapCache ? tileLevel : _Global.INT32(slotInfo["tileLevel"]);
		//AllianceEmblemData allianceEmblemData = null;

		#endregion



		#region //---------------- buildingObj ----------------------------------------

		GameObject buildingObj = tilePrefData.buildingObj;


		var skinRes = string.Empty;
		//============================  城堡 的 tile ，并且使用了城堡皮肤 ========================================================
		if (tileType == Constant.TileType.CITY && _Global.INT32(slotInfo["tileUserId"]) != 0 && _Global.INT32(slotInfo["tileCityId"]) != 0) {
			if (slotInfo.Contains("skinRes")) {
				skinRes = slotInfo["skinRes"].Value.ToString();

				if (string.Equals(skinRes, Constant.CITYSKIN_DEFAULT_SKINRES))
					skinRes = string.Empty;
			}
		}


		if (!string.IsNullOrEmpty(skinRes)) {
			/* ===玩家的城堡 使用了城堡皮肤====== */
			SetCityBuildingObj(buildingObj, skinRes, showMotifFromGhostMapCache, level);
		}
		else
		{
			//其他的 tile 的处理
			SetBuildingObj(buildingObj, slotInfo, tileType, showMotifFromGhostMapCache, level);
		}

		//=========================================================================================================================

		if (tileType == Constant.TileType.CITY && (showMotifFromGhostMapCache ? (tileUserID == 0) : (_Global.INT32(slotInfo["tileUserId"]) == 0)))
		{
			textureName = "Barbarian";
			if (level <= 3)
			{
				imgSubIdx = 1;
			}
			else if (level <= 6)
			{
				imgSubIdx = 2;
			}
			else if (level <= 10)
			{
				imgSubIdx = 3;
			}
			else if (level <= 13)
			{
				imgSubIdx = 4;
			}
			else if (level <= 16)
			{
				imgSubIdx = 5;
			}
			else
			{
				imgSubIdx = 6;
			}
			if (level > 10) level -= 10;
			bShowLevelObj = displayTileLevel;
		}
		else
		{
			textureName = "w_" + tileType;
			switch (tileType)
			{
				case Constant.TileType.CITY:
					int cityType = showMotifFromGhostMapCache ? 1 : _Global.INT32(slotInfo["cityType"]);
					if (cityType == 5)
						textureName = string.Concat("w5_", tileType);
					HashObject tileUserInfo = showMotifFromGhostMapCache ? null : MapMemCache.instance().getUserInfoData(string.Concat("u", slotInfo["tileUserId"].Value));
					if (!showMotifFromGhostMapCache && null != tileUserInfo &&
					   (_Global.INT32(tileUserInfo["w"]) == 2 || _Global.INT32(tileUserInfo["w"]) == 3))
					{
						imgSubIdx = 0;
					}
					else
					{
						string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
						//such as 0_5_1, 5 result
						if (imgName != null && imgName.Length > 2)
						{
							imgName = imgName.Substring(2, 1);
							imgSubIdx = _Global.INT32(imgName);
						}
					}

					HashObject prestigeData = GameMain.GdsManager.GetGds<GDS_Building>().getPrestigeDataFromRealLv(Constant.Building.PALACE, level);
					prestigeLv = _Global.INT32(prestigeData["prestige"]);
					level = _Global.INT32(prestigeData["level"]);
					bShowLevelObj = (displayTileLevel && prestigeLv > 0);

					// #if SHOW_ALLIANCE_EMBLEM_IN_WORLDMAP
					// if (null != tileUserInfo && null != tileUserInfo["e"] && string.Empty != tileUserInfo["e"].Value)
					// {
					// 	allianceEmblemData = new AllianceEmblemData();
					// 	JasonReflection.JasonConvertHelper.ParseToObjectOnce(allianceEmblemData, tileUserInfo["e"]);
					// 	if (AllianceEmblemData.Empty.Equals(allianceEmblemData))
					// 		allianceEmblemData = null;
					// }
					// #endif			
					textureName = "w_50";
					imgSubIdx = 1;
					break;

				case Constant.TileType.BOG:
					imgSubIdx = 1;
					bShowLevelObj = false;
					break;

				default:
					if (level <= 3)
					{
						imgSubIdx = 1;
					}
					else if (level <= 6)
					{
						imgSubIdx = 2;
					}
					else
					{
						imgSubIdx = 3;
					}
					bShowLevelObj = displayTileLevel;
					break;
			}
		}
		string tileName = null;
		//bool tileProtected = true;
		if (tileType == Constant.TileType.WORLDMAP_2X2_KEY_TILE)
		{
			tileName = "tournament_1x1_dummy";
		}
		else if (tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY &&
				tileType <= Constant.TileType.WORLDMAP_LAST)
		{ // Activity tiles
			tileName = "tournament_1x1_act2";
			if (tileType == Constant.TileType.WORLDMAP_1X1_ACT)
			{
				tileName = tileKind == 1 ? "tournament_1x1_act" : "tournament_1x1_act2";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LT_ACT)
			{
				tileName = "tournament_2x2_lt_act";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RT_ACT)
			{
				tileName = "tournament_2x2_rt_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LB_ACT)
			{
				tileName = "tournament_2x2_lb_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RB_ACT)
			{
				tileName = "tournament_2x2_rb_act";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_1X1_DUMMY)
			{
				tileName = "tournament_1x1_dummy";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LT_DUMMY)
			{
				tileName = "tournament_2x2_lt_dummy";
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RT_DUMMY)
			{
				tileName = "tournament_2x2_rt_dummy";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_LB_DUMMY)
			{
				tileName = "tournament_2x2_lb_dummy";
				bShowLevelObj = false;
			}
			else if (tileType == Constant.TileType.WORLDMAP_2X2_RB_DUMMY)
			{
				tileName = "tournament_2x2_rb_dummy";
				bShowLevelObj = false;
			}
		}
		else if (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER && tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)
		{

			tileName = avaTileNames[tileType - Constant.TileType.TILE_TYPE_AVA_PLAYER];
			if (tileType == Constant.TileType.TILE_TYPE_AVA_PLAYER)
			{
				if (flagNumber != -2)
				{
					tileName = "ava_player2";
				}
			}

			//_Global.LogWarning("Ava  tileType : " + tileType + "  tileName : " + tileName + " Name : " + obj.name);

			bool isBigWonder = false;
			// Ava 大奇迹保护罩
			if (GameMain.Ava.Event.IsShowSuperWonderProtect() && tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1)
			{
				isBigWonder = true;
				try2ActivateAVATileProtectionCover(tileType, infoX, infoY, (int)GameMain.Ava.Event.GetSuperWonderProtectTime(), true);
			}

			//#if UPDATE_PROTECTOIN_COVER_ON_TILE_UPDATE
			if (tileType != Constant.TileType.TILE_TYPE_AVA_BOG &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG2 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG3 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG4 &&
			   tileType != Constant.TileType.TILE_TYPE_AVA_BOG5 && !isBigWonder)
			{

				if (slotInfo != null && slotInfo["protectTime"] != null)
				{
					long time = _Global.INT64(slotInfo["protectTime"]);
					if (avaImp.checkProtected(time))
					{
						try2ActivateAVATileProtectionCover(tileType, infoX, infoY, (int)time, true);
					}
					else
					{
						string protectionTileName = "" + (infoX + (infoY - 1) * Constant.Map.AVA_MINIMAP_WIDTH);
						AvaTileProtectionTimeHUDMgr.getInstance().deactivateTileProtectionHUD(protectionTileName);
					}
				}
			}
			//#endif

#if USE_AVA_TILE_EFFECT
			avaImp.setupTileEffect( obj, tileType );
#endif

#if TEST_AVA_TILE_PROTECTION
			// Also need to attach a AvaTileProtectionTimeManager to the world map
			if( infoX == 1 && infoY == 1 ) {
				Vector3 localPos = new Vector3(
					xOrg + ( infoX - 1 ) * tileWorldWidth,
					0f,
					yOrg - ( infoY - 1 ) * tileWorldHeight );
				
				AvaTileProtectionTimeHUDMgr.getInstance().activateTileProtectionHUD( ""+(( infoX - 1 ) + ( infoY - 1 ) * 80 + 1), localPos, GameMain.unixtime()+30,
				                                                                    tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
				                                                                    ( tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
				 tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) );
			}
#endif
		}
		else
		{
			tileName = string.Concat(textureName, "_", imgSubIdx, "_1");
			GameObject protectionCoverObj = tilePrefData.protectionCoverObj;
			SetProtectionCoverObj(protectionCoverObj, slotInfo, tileType, showMotifFromGhostMapCache, level);
#if TEST_AVA_TILE_PROTECTION
			// Also need to attach a AvaTileProtectionTimeManager to the world map
			if( infoX == 1 && infoY == 1 ) {
				Vector3 localPos = new Vector3(
					xOrg + ( infoX - 1 ) * tileWorldWidth,
					0f,
					yOrg - ( infoY - 1 ) * tileWorldHeight );
				
				AvaTileProtectionTimeHUDMgr.getInstance().activateTileProtectionHUD( ""+(( infoX - 1 ) + ( infoY - 1 ) * 800 + 1), localPos, GameMain.unixtime()+30,
				                                                                    tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
				                                                                    ( tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
				 tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) );
			}
#endif
		}

		if (!string.IsNullOrEmpty(tileName))
		{
			var objRenderer = obj.GetComponent<Renderer>();
			MaterialMgr.instance.SetTextureWithSameMaterial(objRenderer, tileName, TextureType.MAP17D3A_TILE);
			MaterialColorScheme.instance.ApplyColorScheme(objRenderer, "WorldMapTile");
		}

		#endregion

		#region //---------------- levelObj ----------------------------------------

		GameObject levelObj = tilePrefData.levelObj;
		if (bShowLevelObj)
		{
			GetCarmotLevel(tileKey, ref level);
			levelObj.SetActive(true);
			showLevelObj(levelObj, level, prestigeLv, true);
		}
		else
		{
			levelObj.SetActive(false);
		}

		//boss fight
		if (!isAVAMinimapMapController() && GameMain.singleton.isBoss(infoX.ToString(), infoY.ToString()))
		{
			long curTime = GameMain.unixtime();
			long eventStartTime = GameMain.singleton.getBossStartTime();
			long eventEndTime = GameMain.singleton.getBossEndTime();
			if (curTime >= eventStartTime && curTime <= eventEndTime)
			{
				var objRenderer = obj.GetComponent<Renderer>();

				MaterialMgr.instance.SetTextureWithSameMaterial(objRenderer, "w_51_4_1", TextureType.MAP17D3A_TILE);
				MaterialColorScheme.instance.ApplyColorScheme(objRenderer, "WorldMapTile");
			}
		}
		//世界BOSS
		if (!isAVAMinimapMapController() && WorldBossController.singleton.isWorldBoss(infoX, infoY))
		{
			WorldBossController.singleton.RefreshBossObj(obj, infoX, infoY);
		}

		if (!showMotifFromGhostMapCache && !isAVAMinimapMapController())
		{
			CheckCarmotImgVisibale(tileKey, obj);
			SetCarmotStateTexture(obj, tileKey);
		}
		//ProfilerSample.EndSample();


		#endregion


	}

	/// <summary>
	/// if the tile has carmot,change the level,
	/// else use the previous level
	/// </summary>
	/// <param name="key">Key.</param>
	/// <param name="level">Level.</param>
	private void GetCarmotLevel(string key, ref int level)
	{
		if (CollectionResourcesMgr.instance().collectResources.ContainsKey(key))
		{
			try
			{
				level = CollectionResourcesMgr.instance().GerResourcesLevel(key);
			}
			catch (Exception)
			{
				//				_Global.Log("------***get carmot tile level error,key="+key );
			}
		}
	}
	/// <summary>
	/// 
	/// </summary>
	/// <param name="xcoord">Xcoord.</param>
	/// <param name="ycoord">Ycoord.</param>
	/// <param name="gob">Gob.</param>
	private void CheckCarmotImgVisibale(string key, GameObject gob)
	{
		setCarmotTexture(key, gob, true);
	}

	public void setCarmotTexture(string key, GameObject gob, bool isShow)
	{
		if (IS_AVA_NOW || gob == null)
			return;

		if (CollectionResourcesMgr.instance().collectResources.ContainsKey(key))
		{
			if (!isShow)
			{
				CollectResourcesInfo info = CollectionResourcesMgr.instance().collectResources[key];
				CollectionResourcesMgr.instance().collectResources.Remove(key);
				setTexturePublic(info.tileX, info.tileY);
			}
			else
			{
				var gobRenderer = gob.GetComponent<Renderer>();
				string tileName = CollectionResourcesMgr.instance().GetResourcesTextureName(key);
				MaterialMgr.instance.SetTextureWithSameMaterial(gobRenderer, tileName, TextureType.MAP17D3A_NEWRESOURCES);
				MaterialColorScheme.instance.ApplyColorScheme(gobRenderer, "WorldMapTile");
				gobRenderer.enabled = isShow;
			}
		}
	}

	private bool checkIsCanRallyAttack(HashObject slotInfo)
	{
		// self not have a Alliance
		if (seed["allianceDiplomacies"] == null)
		{
			return false;
		}

		int tileType = _Global.INT32(slotInfo["tileType"]);
		if (tileType != Constant.TileType.CITY)
		{
			return false;
		}

		int tileUserId = _Global.INT32(slotInfo["tileUserId"]);
		if (tileUserId == 0)
		{
			return false;
		}

		int allianceId = _Global.INT32(slotInfo["tileAllianceId"]);
		int cityId = _Global.INT32(slotInfo["tileCityId"]);

		int mycity = own(cityId);
		if (mycity >= 0)
		{
			return false;
		}
		else if (allianceId != 0 && seed["allianceDiplomacies"] != null && seed["allianceDiplomacies"]["allianceId"] != null)
		{

			if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"]))
			{ // they're in the player's alliance
				return false;
			}
			else
			{
				object[] alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
				foreach (object friend in alliances)
				{
					if (allianceId == _Global.INT32((friend as HashObject)["allianceId"]))
					{
						return false;
					}
				}
			}
		}

		return true;
	}

	private int own(int tileCityId)
	{
		int ret = -1;
		//var seed:HashObject = GameMain.instance().getSeed();
		int curCityId = GameMain.singleton.getCurCityId();

		if (tileCityId == curCityId)
			ret = 0;
		else
		{
			object[] cities = _Global.GetObjectValues(seed["cities"]);
			foreach (object city in cities)
			{
				if (tileCityId == _Global.INT32((city as HashObject)[_Global.ap + 0]))
				{
					ret = 1;
					break;
				}
			}
		}

		return ret;
	}

	private int checkCarmotFlag(HashObject slotInfo, int tileUserId, int tileCityId, int tileAllianceId, int tileType)
	{
		int flagNumber = 0; // 0: no flag; >0: city id; 
							//-1: sameAlliance;
							//-2: hostile & friend
		if (tileUserId == GameMain.singleton.getUserId())
		{
			return 1;
		}

		if (tileUserId > 0 && tileType != Constant.TileType.BOG)
		{

			int currentcityid = GameMain.singleton.getCurCityId();

			//now check to make sure this tile is FRIENDLY, HOSTILE, OR OURS
			//NEUTRAL NOTE (not in any alliance or in alliance thats neither friendly nor hostile) SHOULD HAVE NO FLAGS

			if (tileUserId == Datas.singleton.tvuid())
			{ //this is OURS

				int i = 0;
				while (seed["cities"][_Global.ap + i] != null)
				{
					if (_Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 0]) == tileCityId)
					{
						flagNumber = _Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 6]);
						break;
					}
					i++;
				}
			}
			else
			{ //this belongs to SOMEBODY
				HashObject allianceDiplomacies = seed["allianceDiplomacies"];
				if (allianceDiplomacies == null || tileAllianceId == 0)
				{
					return -2;
				}
				else
				if (flagNumber == 0 && allianceDiplomacies["allianceId"] != null)
				{//check to see if this tile is an alliance member
					if (tileAllianceId == _Global.INT32(allianceDiplomacies["allianceId"]))
					{
						flagNumber = -1;
					}
					else
					{
						flagNumber = -2;
					}
				}
			}
		}

		return flagNumber;
	}

	//return slot flag:
	// 0: no flag; >0: city id; -1: friendly; -2: hostile
	private int checkFlag(HashObject slotInfo, int tileType, int serverID)
	{

		int tileUserId = _Global.INT32(slotInfo["tileUserId"]);

		// If it's a AVA tile, handle it and return simply.
		if (tileType >= Constant.TileType.TILE_TYPE_AVA_PLAYER &&
		   tileType <= Constant.TileType.TILE_TYPE_AVA_LAST)
		{

			int myServerID = _Global.INT32(seed["player"]["worldId"].Value);
			int flag = 0; // No flag by default
			int myAllianceID = _Global.INT32(seed["player"]["allianceId"].Value);
			int myUserID = _Global.INT32(seed["player"]["userId"].Value);
			int tileAllianceId = _Global.INT32(slotInfo["tileAllianceId"]);
			bool serverIDDismatched = (serverID != 0 && myServerID != serverID);

			if (serverIDDismatched ||
			   (tileAllianceId != 0 && myAllianceID != tileAllianceId))
			{
				flag = -2; // Enemy
			}
			else if (tileUserId != 0 && myUserID != tileUserId)
			{
				flag = -1; // Friend
			}
			else if (myUserID == tileUserId)
			{
				flag = 1; // My own tile
			}
			return flag;
		}

		int flagNumber = 0; // 0: no flag; >0: city id; -1: friendly; -2: hostile

		if (tileUserId > 0 && tileType != Constant.TileType.BOG)
		{

			int currentcityid = GameMain.singleton.getCurCityId();

			//now check to make sure this tile is FRIENDLY, HOSTILE, OR OURS
			//NEUTRAL NOTE (not in any alliance or in alliance thats neither friendly nor hostile) SHOULD HAVE NO FLAGS

			if (tileUserId == Datas.singleton.tvuid())
			{ //this is OURS

				int i = 0;
				while (seed["cities"][_Global.ap + i] != null)
				{
					if (_Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 0]) == _Global.INT32(slotInfo["tileCityId"]))
					{
						flagNumber = _Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 6]);
						break;
					}
					i++;
				}

			}
			else
			{ //this belongs to SOMEBODY
				int tileAllianceId = _Global.INT32(slotInfo["tileAllianceId"]);
				HashObject allianceDiplomacies = seed["allianceDiplomacies"];
				if (allianceDiplomacies == null)
				{
					if (tileType >= Constant.TileType.WORLDMAP_1X1_ACT &&
					   tileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT)
					{
						if (tileAllianceId != 0)
						{
							return -2;
						}
					}
					return flagNumber;
				}

				HashObject friendly = allianceDiplomacies["friendly"];
				object[] values;

				if (friendly != null)
				{
					values = _Global.GetObjectValues(friendly);
					for (int j = 0; j < values.Length; ++j)
					{
						object friend = values[j];
						if (tileAllianceId == _Global.INT32((friend as HashObject)["allianceId"]))
						{
							flagNumber = -1;
							break;
						}
					}
				}

				if (flagNumber == 0)
				{
					HashObject hostiles = allianceDiplomacies["hostile"];

					if (hostiles != null)
					{
						values = _Global.GetObjectValues(hostiles);
						for (int k = 0; k < values.Length; ++k)
						{
							object hostile = values[k];
							if (tileAllianceId == _Global.INT32((hostile as HashObject)["allianceId"]))
							{
								flagNumber = -2;
								break;
							}
						}
					}

					if (flagNumber == 0 && allianceDiplomacies["allianceId"] != null)
					{//check to see if this tile is an alliance member
						if (tileAllianceId == _Global.INT32(allianceDiplomacies["allianceId"]))
						{
							flagNumber = -1;
						}
						else
						{
							if (tileType >= Constant.TileType.WORLDMAP_1X1_ACT &&
							   tileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT)
							{
								if (tileAllianceId != 0)
								{
									flagNumber = -2;
								}
							}
						}
					}
				}
			}
		}

		return flagNumber;
	}

	private void SetAllianceEmblem(GameObject go, AllianceEmblemData data)
	{
		AllianceEmblemRenderer emblem = go.GetComponent<AllianceEmblemRenderer>();
		if (null != emblem)
			emblem.Data = data;
	}

	private void SetBuildingObj(GameObject go, HashObject slotInfo, int tileType, bool showMotifFromGhostMapCache, int level)
	{
		var goRenderer = go.GetComponent<Renderer>();
		int tileUserId = 0;
		if (showMotifFromGhostMapCache)
		{
			goRenderer.enabled = false;
		}
		else
		{
			tileUserId = _Global.INT32(slotInfo["tileUserId"]);
			if (tileUserId > 0 && tileType == Constant.TileType.CITY)
			{
				goRenderer.enabled = true;
				string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
				int imgSubIdx = 1;
				//such as 0_5_1, 5 result
				if (imgName != null && imgName.Length > 2)
				{
					imgName = imgName.Substring(2, 1);
					imgSubIdx = _Global.INT32(imgName);
				}
				goRenderer.material.mainTexture = TextureMgr.instance().LoadTexture("w1_0_" + imgSubIdx + "_1", TextureType.MAP17D3A_TILE);
				MaterialColorScheme.instance.ApplyColorScheme(goRenderer, "WorldMapTile");
				if (imgSubIdx == 8 || imgSubIdx == 9)
				{
					go.transform.localPosition = new Vector3(0.0002f, 0.51f, -0.0011f);
					go.transform.localScale = new Vector3(0.72f, 1, 1.38f);
				}
				else
				{
					go.transform.localPosition = new Vector3(0.0002f, 0.33f, -0.0012f);
					go.transform.localScale = new Vector3(0.7f, 1, 1.3f);
				}
			}
			else
			{
				goRenderer.enabled = false;
			}
		}
	}



	/*********************************************************************************** 城堡换肤 ******************************************************************************************/

	/// <summary>
	/// /*直接更换 当前玩家的 城堡皮肤*/
	/// </summary>
	/// <param name="skinData"></param>
	public void ReplacePlayerCitySkinImmediately(HashObject skinData) {
		//获得 当前玩家的城堡位置 （x，y）
		var pos = GameMain.singleton.getCurCityCoor(GameMain.singleton.getCurCityId());
		var infoX = (int)pos.x;
		var infoY = (int)pos.y;


		if (infoX < 1 || infoY < 1 || infoX > 800 || infoY > 800)
			return;

		var isDefault = _Global.INT32(skinData["isdefault"].Value) == 1;

		var slotInfo = MapMemCache.instance().getTileInfoData(infoX, infoY);

		if (slotInfo == null)
			return;

		var tileUserId = _Global.INT32(slotInfo["tileUserId"]);
		var tileCityId = _Global.INT32(slotInfo["tileCityId"]);
		var tileType = slotInfo["tileType"] != null ? _Global.INT32(slotInfo["tileType"]) : 0;

		//不是玩家 或者 不是城堡
		if (tileType != Constant.TileType.CITY || tileUserId != GameMain.singleton.getUserId() || tileCityId != GameMain.singleton.getCurCityId())
			return;


		var playerCityTileGo = GetObjInView(infoX, infoY);


		//将 城堡的 slot 数据中的 skinres 使用临时数据替换掉，时候会后后端接口矫正更新
		if (slotInfo.Contains("skinRes"))
			slotInfo["skinRes"] = new HashObject();

		var skinRes = skinData["skinRes"].Value.ToString();

		//但是已经保存了之前使用的 玩家城堡的数据，就需要使用临时数据替换，在移动worldmap时刷新替换

		//将 城堡的 slot 数据中的 skinres 使用临时数据替换掉，时候会后后端接口矫正更新
		slotInfo["skinRes"].Value = isDefault ? Constant.CITYSKIN_DEFAULT_SKINRES : skinRes;


		//玩家的城堡不在当前的可视范围内
		if (playerCityTileGo == null) {
			return;
		}
	

		var buildingObj = playerCityTileGo.transform.Find("building").gameObject;
		int level = _Global.INT32(slotInfo["tileLevel"]);

		if (!isDefault){
			SetCityBuildingObj(buildingObj, skinRes, false, level);
		}
		else{
			 
			//默认城堡的皮肤
			var buildingRenderer = buildingObj.GetComponent<Renderer>();
			var buildTrans = buildingObj.transform;
			string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
			int imgSubIdx = 1;

			//such as 0_5_1, 5 result
			if (imgName != null && imgName.Length > 2){
				imgName = imgName.Substring(2, 1);
				imgSubIdx = _Global.INT32(imgName);
			}

			buildingRenderer.material.mainTexture = TextureMgr.instance().LoadTexture("w1_0_" + imgSubIdx + "_1", TextureType.MAP17D3A_TILE);
			MaterialColorScheme.instance.ApplyColorScheme(buildingRenderer, "WorldMapTile");

			if (imgSubIdx == 8 || imgSubIdx == 9){
				buildTrans.localPosition = new Vector3(0.0002f, 0.51f, -0.0011f);
				buildTrans.localScale = new Vector3(0.72f, 1, 1.38f);
			}
			else{
				buildTrans.localPosition = new Vector3(0.0002f, 0.33f, -0.0012f);
				buildTrans.localScale = new Vector3(0.7f, 1, 1.3f);
			}
		}
	}

	/// <summary>
	/// 更换 玩家 城堡的皮肤
	/// </summary>
	public void ReplacePlayerCitySkin() {


		//获得 当前玩家的城堡位置 （x，y）
		var pos = GameMain.singleton.getCurCityCoor(GameMain.singleton.getCurCityId());
		var infoX = (int)pos.x;
		var infoY = (int)pos.y;


		if (infoX < 1 || infoY < 1 || infoX > 800 || infoY > 800)
			return;

		var playerCityTileGo = GetObjInView(infoX, infoY);

		//玩家的城堡不在当前的可视范围内，不替换，会在移动worldmap时刷新替换
		if (playerCityTileGo == null)
			return;

		HashObject slotInfo = MapMemCache.instance().getTileInfoData(infoX, infoY);
		if (slotInfo == null)
			return;

		var tileUserId = _Global.INT32(slotInfo["tileUserId"]);
		var tileCityId = _Global.INT32(slotInfo["tileCityId"]);
		var tileType = slotInfo["tileType"] != null ? _Global.INT32(slotInfo["tileType"]) : 0;

		//不是玩家 或者 不是城堡
		if (tileType != Constant.TileType.CITY || tileUserId == 0 || tileCityId == 0)
			return;


		GameObject buildingObj = playerCityTileGo.transform.Find("building").gameObject;
		int level = _Global.INT32(slotInfo["tileLevel"]);

		//============================  玩家城堡 的 tile ，并且使用了城堡皮肤 ========================================================
		var skinRes = Constant.CITYSKIN_DEFAULT_SKINRES;


		if (slotInfo.Contains("skinRes")) {
			skinRes = slotInfo["skinRes"].Value.ToString();
		}
		

		if (!string.Equals(skinRes, Constant.CITYSKIN_DEFAULT_SKINRES)){
			SetCityBuildingObj(buildingObj, skinRes, false, level);

		}
		else{
			//其他的 tile 的处理
			SetBuildingObj(buildingObj, slotInfo, tileType, false, level);
		}

 
	}


	/// <summary>
	/// 使用了城堡皮肤的 城堡建筑物的 tile 的创建
	/// </summary>
	/// <param name="go"></param>
	/// <param name="skinRes"></param>
	/// <param name="showMotifFromGhostMapCache"></param>
	/// <param name="level"></param>
	private void SetCityBuildingObj(GameObject go, string skinRes, bool showMotifFromGhostMapCache, int level)
	{

		var renderer = go.GetComponent<Renderer>();

		if (showMotifFromGhostMapCache)
		{
			renderer.enabled = false;
			return;
		}


		renderer.enabled = true;

		string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
		int imgSubIdx = 1;
		//such as 0_5_1, 5 result
		if (imgName != null && imgName.Length > 2)
			imgSubIdx = _Global.INT32(imgName.Substring(2, 1));


		renderer.material.mainTexture = TextureMgr.instance().LoadTexture(string.Concat(skinRes, "_w"), TextureType.CITYSKIN);
		MaterialColorScheme.instance.ApplyColorScheme(renderer, "WorldMapTile");
		if (imgSubIdx == 8 || imgSubIdx == 9)
		{
			go.transform.localPosition = new Vector3(0.0002f, 0.51f, -0.0011f);
			go.transform.localScale = new Vector3(0.72f, 1, 1.38f);
		}
		else
		{
			go.transform.localPosition = new Vector3(0.0002f, 0.33f, -0.0012f);
			go.transform.localScale = new Vector3(0.7f, 1, 1.3f);
		}

	}

	/****************************************************************************************************************************************************************************************/


	public void SetCarmotStateTexture(GameObject go, string key)
	{
		if (go == null || isAVAMinimapMapController())
		{
			return;
		};

		Renderer renderer = go.transform.Find("flag").GetComponent<Renderer>();
		if (CollectionResourcesMgr.instance().collectResources.ContainsKey(key))
		{
			CollectResourcesInfo info = CollectionResourcesMgr.instance().collectResources[key];
			if (info.isHaveMarch)
			{
				renderer.enabled = true;
				switch (info.resourcesFlag)
				{
					case -1:
						renderer.material.mainTexture = tileState3;
						break;
					case -2:
						renderer.material.mainTexture = tileState2;
						break;
					default:
						renderer.material.mainTexture = tileState1;
						break;
				}
			}
			else
			{
				renderer.enabled = false;
			}
		}
		// else
		// {
		// 	renderer.enabled = false;
		// }
	}
	private void SetProtectionCoverObj(GameObject go, HashObject slotInfo, int tileType, bool showMotifFromGhostMapCache, int level)
	{
		var goRenderer = go.GetComponent<Renderer>();
		int tileUserId = 0;
		if (showMotifFromGhostMapCache)
		{
			goRenderer.enabled = false;
		}
		else
		{

			int cityType = showMotifFromGhostMapCache ? 1 : _Global.INT32(slotInfo["cityType"]);

			tileUserId = _Global.INT32(slotInfo["tileUserId"]);
			HashObject tileUserInfo = showMotifFromGhostMapCache ? null : MapMemCache.instance().getUserInfoData("u" + slotInfo["tileUserId"].Value);

			if (tileUserId > 0 && tileType == Constant.TileType.CITY && !showMotifFromGhostMapCache && null != tileUserInfo &&
				(_Global.INT32(tileUserInfo["w"]) == 2 || _Global.INT32(tileUserInfo["w"]) == 3))// && _Global.GetBoolean(slotInfo["misted"])) 
			{
				goRenderer.enabled = true;
				string imgName = GameMain.GdsManager.GetGds<GDS_Building>().getBuildingImgName(Constant.Building.PALACE, level);
				goRenderer.material.mainTexture = TextureMgr.instance().LoadTexture("protectionCover", TextureType.MAP17D3A_TILE);
			}
			else
			{
				goRenderer.enabled = false;
			}
		}
	}
	public void toFront()
	{

		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		component.SetVisible(false);
		selectedTile.SetActive(false);
		if (!isInFront && isAVAMinimapMapController())
		{
			GameMain.singleton.DestroyAnimation("Loading_ava", null);
			GameMain.singleton.NotDrawMenu = false;
			GameMain.singleton.ForceTouchForbidden = false;
			MenuMgr.instance.SwitchMenu("MainChrom", null);
			MenuMgr.instance.PushMenu("AvaMainChrome", null, "trans_immediate");
		}

		isInFront = true;
		MapView.instance().AllForceUpdateOnlyNextTime = true;

		ResetState();

		MapMoveAnim.avoidForceUpdateWorldMapWithinSecond(2);

		dirLight.SetActive(true);
		ground.SetActive(true);
		gameObject.SetActive(true);
		tileInfoPopUp.SetActive(false);
		mapGrid.gameObject.SetActive(false);
		floatingLayerMgr.enabled = true;
		if (cityDirectionRoot != null)
		{
			cityDirectionRoot.SetActive(true);
		}

		curCamera.enabled = true;
		WorldMapCamSwitch camSwitch = curCamera.GetComponent<WorldMapCamSwitch>();
		camSwitch.enabled = true;

		if (reqBlockNames.Count <= 0)
		{
			constructReqTile();
		}

		if (REQ_TILE_WAITING == reqTileFlag)
		{
			moveReqWorldMap();
		}
		else
		{
			autoUpdateMap();
		}
		if (!isAVAMinimapMapController())
		{
			m_mapMoveAnimMgr.gameObject.SetActive(true);
			m_mapMoveAnimMgr.toFront();
			m_tournamentMarchMgr.toFront();
			KBN.TournamentManager.getInstance().setAcceptSocketData(true);
			if (AvaMapAnimMgr.getInstance() != null)
			{
				AvaMapAnimMgr.getInstance().cleanUpAll();
				AvaMapAnimMgr.getInstance().gameObject.SetActive(false);
			}
			IS_AVA_NOW = false;
		}
		else
		{
			m_avaMapAnimMgr.gameObject.SetActive(true);
			m_avaMapAnimMgr.toFront();
			avaImp.toFront();
			avaImp.try2DownloadMapCache();
			IS_AVA_NOW = true;
		}

		// Cloud mask
		m_mapCloudMaskState = -1;
		updateCloudMask();
		SetAllMarchActive(true);
	}

	private Vector2 getScreenPoint(float coodX, float coodY)
	{
		float myCityPosX = xOrg + tileWorldWidth * (coodX - 1) + tileWorldWidth * 0.5f;
		float myCityPosY = yOrg - tileWorldHeight * (coodY - 1) + tileWorldHeight * 0.5f;

		//_Global.LogWarning("myCityPosX : " + myCityPosX + " myCityPosY : " + myCityPosY);

		bendCamera();
		// 世界坐标转屏幕坐标, 此坐标是以左上角为（0，0）点，需要转换成NGUI坐标系（屏幕中心为零点）
		Vector3 screenPoint = curCamera.WorldToScreenPoint(new Vector3(myCityPosX, 1, myCityPosY));
		//_Global.LogWarning("screenPoint : " + screenPoint);
		restoreCamera();

		int screenWidth = Screen.width;
		int screenHeight = Screen.height;

		int centerx = nextDisplayTileStartX + screenTileWidth / 2;
		int centery = nextDisplayTileStartY + screenTileHeight / 2;
		float centerPosX = xOrg + tileWorldWidth * (centerx - 1) + tileWorldWidth * 0.5f;
		float centerPosY = yOrg - tileWorldHeight * (centery - 1) + tileWorldHeight * 0.5f;
		//_Global.LogWarning("centerPosX : " + centerPosX + " centerPosY : " + centerPosY);

		float myCityScreenX;
		float myCityScreenY;
		if (centerPosX > myCityPosX && centerPosY > myCityPosY)
		{
			myCityScreenX = -(screenWidth / 2f - screenPoint.x);
			myCityScreenY = -(screenHeight / 2f - screenPoint.y);

			if (!isInScreen(myCityScreenX, myCityScreenY) && Math.Abs(screenPoint.x) > 2000 && Math.Abs(screenPoint.y) > 2000)
			{
				if ((screenPoint.x > 0 && screenPoint.y > 0) || (screenPoint.x < 0 && screenPoint.y > 0))
				{
					screenPoint = new Vector3(-screenPoint.x, -screenPoint.y, screenPoint.z);
				}
			}
		}

		//_Global.LogWarning("screenWidth : " + screenWidth + " screenHeight : " + screenHeight);
		// 转换成NGUI坐标系（屏幕中心为零点）
		myCityScreenX = -(screenWidth / 2f - screenPoint.x);
		myCityScreenY = -(screenHeight / 2f - screenPoint.y);

		return new Vector2(myCityScreenX, myCityScreenY);
	}

	private bool isInScreen(float screenX, float screenY)
	{
		int screenWidth = Screen.width;
		int screenHeight = Screen.height;

		if (screenX <= -(screenWidth / 2) || screenX >= (screenWidth / 2) || screenY <= -(screenHeight / 2) || screenY >= (screenHeight / 2))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	public void SetMyCityDirection()
	{
		Vector2 myCityPos = GameMain.singleton.getCurCityCoor(GameMain.singleton.getCurCityId());

		//_Global.LogWarning("SetMyCityDirection myCityPos : " + myCityPos);
		Vector2 screenPoint = getScreenPoint(myCityPos.x, myCityPos.y);
		//_Global.LogWarning("SetMyCityDirection screenPoint : " + screenPoint);

		if (!isInScreen(screenPoint.x, screenPoint.y))
		{
			Vector3 norTar = (new Vector3(screenPoint.x, screenPoint.y, 0f) - myCityDirection.transform.localPosition).normalized;

			float angle = Mathf.Atan2(norTar.y, norTar.x) * Mathf.Rad2Deg;

			//_Global.LogWarning("SetMyCityDirection angle : " + angle);

			// rotate to angle
			Quaternion rotation = new Quaternion();

			rotation.eulerAngles = new Vector3(0, 0, angle - 90);

			myCityDirection.transform.rotation = rotation;
			myCityDirection.SetActive(true);
			myCityDistanceLabel.gameObject.SetActive(true);

			int centerx = nextDisplayTileStartX + screenTileWidth / 2;
			int centery = nextDisplayTileStartY + screenTileHeight / 2;

			int distance = (int)(new Vector3(myCityPos.x, myCityPos.y, 0f) - new Vector3(centerx, centery, 0f)).magnitude;

			myCityDistanceLabel.text = distance.ToString();
		}
		else
		{
			myCityDirection.SetActive(false);
			myCityDistanceLabel.gameObject.SetActive(false);
		}

		myCityDistanceLabel.transform.localPosition = myCityDirection.transform.localPosition;
	}

	public void HiteCityDirectionRoot()
	{
		if (cityDirectionRoot != null)
		{
			cityDirectionRoot.SetActive(false);
		}
	}

	public override void toBack()
	{

		if (isInFront && isAVAMinimapMapController())
		{
			MenuMgr.instance.PopMenu("AvaMainChrome");
			SetAllRallyBossMarchUnActive();
		}

		isInFront = false;

		dirLight.SetActive(false);
		ground.SetActive(false);
		gameObject.SetActive(false);
		tileInfoPopUp.SetActive(false);
		mapGrid.gameObject.SetActive(false);
		floatingLayerMgr.enabled = false;
		HiteCityDirectionRoot();

		TileInfoPopUp component = tileInfoPopUp.GetComponent<TileInfoPopUp>();
		component.SetVisible(false);

		curCamera.enabled = false;
		selectedTile.SetActive(false);
		selectedTileName = null;
		selectedTileType = -1;
		highlightTile(false, 0, 0, false);

		if (!isAVAMinimapMapController())
		{
			m_mapMoveAnimMgr.gameObject.SetActive(false);
			m_mapMoveAnimMgr.toBack();
			m_tournamentMarchMgr.toBack();

			KBN.TournamentManager.getInstance().setAcceptSocketData(false);
			KBN.TournamentManager.getInstance().unregisterSocketPacket_All();
			KBN.TournamentManager.getInstance().cleanupTileContext();
			TileStateUnderAttackManager.getInstance().cleanup();
			MarchEffectManager.instance().cleanupAllEffectOnStages();
		}
		else
		{
			m_avaMapAnimMgr.gameObject.SetActive(false);
			m_avaMapAnimMgr.toBack();
			avaImp.toBack();
			AvaTileProtectionTimeHUDMgr.getInstance().cleanup();
		}

		CancelInvoke("autoUpdateMap");

		if (GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS)
		{
			GhostMap.getInstance().switchDataSet(!isAVAMinimapMapController());
			GhostMap.getInstance().WriteToFile();
		}
		SetAllMarchActive(false);
	}

	public void setBirdToChildTransform(GameObject obj)
	{
		Vector3 pos = obj.transform.localPosition;
		obj.transform.parent = movePlane.transform;
		obj.transform.localPosition = pos;
	}

	protected void showLevelObj(GameObject levelObj, int level, int prestige, bool bShowLevel)
	{
		Material newMaterial;
		GameObject prestigeObj = levelObj.transform.Find("prestigeLv").gameObject;
		GameObject l_levelObj = levelObj.transform.Find("level_l").gameObject;
		GameObject h_levelObj = levelObj.transform.Find("level_h").gameObject;

		var levelObjRenderer = levelObj.GetComponent<Renderer>();
		var prestigeObjRenderer = prestigeObj.GetComponent<Renderer>();
		var l_levelObjRenderer = l_levelObj.GetComponent<Renderer>();
		var h_levelObjRenderer = h_levelObj.GetComponent<Renderer>();
		MaterialMgr.instance.SetTextureWithSameMaterial(levelObjRenderer, "Shield1", TextureType.LEVEL, Shader.Find("_KBNShaders_/kbnShield"));
		levelObjRenderer.enabled = bShowLevel;

		if (prestige > 0)
		{
			prestigeObjRenderer.enabled = bShowLevel;
			l_levelObjRenderer.enabled = false;
			h_levelObjRenderer.enabled = false;
			MaterialMgr.instance.SetTextureWithSameMaterial(prestigeObjRenderer, "Star" + prestige, TextureType.LEVEL, Shader.Find("_KBNShaders_/kbnShieldLevelText"));
		}
		else
		{
			prestigeObjRenderer.enabled = false;

			var iLevel_H = level / 10;
			var iLevel_L = level % 10;
			Vector3 tmp = l_levelObj.transform.localPosition;
			if (iLevel_H > 0)
			{
				h_levelObjRenderer.enabled = bShowLevel;
				tmp.x = -0.0015f;
				MaterialMgr.instance.SetTextureWithSameMaterial(h_levelObjRenderer, "lv" + iLevel_H, TextureType.LEVEL, Shader.Find("_KBNShaders_/kbnShieldLevelText"));
			}
			else
			{
				h_levelObjRenderer.enabled = false;
				tmp.x = 0;
			}
			l_levelObj.transform.localPosition = tmp;

			MaterialMgr.instance.SetTextureWithSameMaterial(l_levelObjRenderer, "lv" + iLevel_L, TextureType.LEVEL, Shader.Find("_KBNShaders_/kbnShieldLevelText"));
			l_levelObjRenderer.enabled = bShowLevel;
		}
	}

	public void Unload()
	{
		if (ground != null)
		{
			Destroy(ground);
		}
		if (selectedTile != null)
		{
			Destroy(selectedTile);
		}
		if (tileInfoPopUp != null)
		{
			Destroy(tileInfoPopUp);
		}
		if (movePlane != null)
		{
			Destroy(movePlane);
		}
		if (troopObj != null)
		{
			Destroy(troopObj);
		}
		if (m_mapMoveAnimMgr != null)
		{
			Destroy(m_mapMoveAnimMgr.gameObject);
		}
		if (m_avaMapAnimMgr != null)
		{
			Destroy(m_avaMapAnimMgr.gameObject);
		}
		if (mapGrid != null)
		{
			Destroy(mapGrid.gameObject);
		}
		if (floatingLayerMgr != null)
		{
			Destroy(floatingLayerMgr);
		}
		if (cityDirectionRoot != null)
		{
			Destroy(cityDirectionRoot);
		}
		DelAllTroopAndLinesForWorldbossAndAva();
		GameObject moveLinetestObj = GameObject.Find("moveLinetest(Clone)");
		if (moveLinetestObj != null) Destroy(moveLinetestObj);

		GameObject moveTroopObj = GameObject.Find("MoveTroopPrefab(Clone)");
		if (moveTroopObj != null) Destroy(moveTroopObj);

		Destroy(curCamera.gameObject);
		Resources.UnloadUnusedAssets();
	}

	private void DelAllTroopAndLinesForWorldbossAndAva()
	{
		DestroyTroopPool();
		DelAllRallyBossMarchList();
	}

	//Add by Caisen 2014.9.2
	public void setTipBar(TipBar t, float time)
	{
		t.SetTipBarStopTime(time);
		this.tipBarOfMarchLine = t;
	}

	private bool isAVAMinimapMapController()
	{
		return SCENE_INDEX == GameMain.AVA_MINIMAP_LEVEL;
	}
	//refresh world map marchline2 by _Global.tilesCarmotInfs;
	//
	private MarchLine2 m_marchLine;
	public MarchLine2 marchLineTemp;
	public static List<string> marchLines = new List<string>();//{"360","330"}
	public GameObject troopObjPrefab;
	public int smooth = 1;
	float timeRemainingMS = 0f;
	class TroopInfo
	{
		public GameObject troop;
		public MarchLine2 marchline;
		public Vector3 mFrom;
		public Vector3 mTo;
		public long startTime;
		public long endTime;
		public double lastUnixTime;
		public double curUnixTime;
		public string marchKey;
		public string carmotPosKey;//carmot position 
		public int carmotFlag;
		public long oneWayTime;
		public bool isNeedDestroyTroop = false;
		public int marchState;
		public long fireTime;
		public PBMsgMarchInfo.PBMsgMarchInfo march = null;
		public bool CheckFire(long now)
		{
			if (march == null)
			{
				return false;
			}
			if (march != null && !WorldBossController.singleton.isWorldBoss(march.toX, march.toY))
			{  //自然排除ava
				return false;
			}
			if (now > fireTime + 2)
			{
				//KBN._Global.LogWarning("sssstartFire 1："+now);
				march = RallyBossMarchController.instance().getMarch(march.marchId);
				if (march != null)
				{
					//KBN._Global.LogWarning("sssstartFire 2"+march.marchStatus);
					if (marchState == Constant.MarchStatus.OUTBOUND)
					{
						//初始化执行fire

						fireTime = now;
						marchState = march.marchStatus;
						//KBN._Global.LogWarning("ssstartFire 3"+march.marchStatus);

						return true;
					}
					KBN.GameMain.singleton.getMapController().AddRallyAndBossMarchsInfo(march);
					return false;
				}
				return false;
			}
			return true;
		}
	}
	Dictionary<string, TroopInfo> troopInfos = new Dictionary<string, TroopInfo>();
	public static List<string> troopInfosList = new List<string>();

	private Dictionary<int, GameObject> fireDic = new Dictionary<int, GameObject>();
	private Dictionary<int, string> StateDic = new Dictionary<int, string>();

	// public List<int> l=new List<int>();
	public Dictionary<string, List<int>> allFireDic = new Dictionary<string, List<int>>();
	public Dictionary<string, GameObject> allFireObjDic = new Dictionary<string, GameObject>();
	private void UpdateFire(TroopInfo troop)
	{
		//新的处理方式
		string key = troop.march.toX + "_" + troop.march.toY;
		int marchId = troop.march.marchId;
		if (allFireDic.ContainsKey(key))
		{
			List<int> fireList = allFireDic[key];
			if (!fireList.Contains(marchId))
			{
				fireList.Add(marchId);
			}
		}
		else
		{
			List<int> fireList = new List<int>();
			fireList.Add(marchId);
			allFireDic.Add(key, fireList);
		}
	}

	public void RemoveFireObj(int x, int y, int marchId)
	{
		string key = x + "_" + y;
		if (allFireDic.ContainsKey(key))
		{
			List<int> fireList = allFireDic[key];
			if (fireList.Contains(marchId))
			{
				fireList.Remove(marchId);
			}
			if (fireList == null || fireList.Count <= 0)
			{
				allFireDic.Remove(key);
			}
		}
	}

	public bool IsFire(int x, int y, int marchId)
	{
		//_Global.LogWarning("startFire 6");
		// return fireDic.ContainsKey(marchId)&&fireDic[marchId]!=null;
		string key = x + "_" + y;
		return allFireDic.ContainsKey(key) && allFireDic[key].Contains(marchId);
	}

	private void SetBossState()
	{
		var allFires = allFireDic.GetEnumerator();
		while (allFires.MoveNext())
		{
			string key = allFires.Current.Key;
			KBN.WorldBossController.singleton.SetBossState(key,
				Constant.WorldBossAnimationState.normal,
				Constant.WorldBOssAnimationAction.attack,
				Constant.WorldBossAnimationPar.frontalAttack
				);
		}
	}

	public int showTroopsMaxCount = 100;
	public int showMarchLineMaxCount = 300;
	List<TroopInfo> deleteRallAndBossTroopsDate = new List<TroopInfo>();
	List<TroopInfo> addRallAndBossTroopsDate = new List<TroopInfo>();
	List<string> rallAndBossTroopskeyList = new List<string>();
	private void RefreshRallyAndBossTroops()
	{
		if (rallyAndBossTroops.Count == 0)
			return;
		if (troopObjPrefab == null)
			return;
		addRallAndBossTroopsDate.Clear();
		deleteRallAndBossTroopsDate.Clear();
		rallAndBossTroopskeyList.Clear();
		int count = rallyAndBossTroops.Count;
		var keys = rallyAndBossTroops.GetEnumerator();
		while (keys.MoveNext())
		{
			rallAndBossTroopskeyList.Add(keys.Current.Key);
		}

		int maxTroopsCount = 0;
		for (int i = 0; i < count; i++)
		{
			TroopInfo ti = rallyAndBossTroops[rallAndBossTroopskeyList[i]];

			if (ti.curUnixTime >= ti.endTime)
			{
				if (ti.troop != null)
				{
					if (ti.isNeedDestroyTroop)
					{
						GameObject.Destroy(ti.troop);
					}
					else
					{
						if (ti.march.marchType == Constant.MarchType.COLLECT)
						{
							RemoveOneTroop_Resource(ti.troop);
						}
						else if (ti.march.marchType == Constant.MarchType.COLLECT_RESOURCE)
						{
							RemoveOneTroop_CollectRes(ti.troop);
						}
						else
						{
							if (ti.march.isWin == 3)
							{
								RemoveOneTroop(ti.troop);
							}
							else if (ti.march.isWin == 1)
							{
								RemoveOneTroop_win(ti.troop);
							}
							else
							{
								RemoveOneTroop_lose(ti.troop);
							}
						}
					}
					// 
					ti.troop = null;
					deleteRallAndBossTroopsDate.Add(ti);
				}
				continue;
			}

			if (GameMain.unixtime() > ti.lastUnixTime)
			{
				ti.lastUnixTime = GameMain.unixtime();
				ti.curUnixTime = GameMain.unixtime();
			}
			//ti.curUnixTime += Time.deltaTime;
			ti.curUnixTime = GameMain.DeltaTime();
			//_Global.LogWarning("tempCurUnixTime : " + ti.curUnixTime);
			float offsetTime = 1 - (float)((ti.endTime - ti.curUnixTime) * 1f) / ti.oneWayTime;
			offsetTime = Mathf.Clamp(offsetTime, 0, 1);

			Vector3 offsetPos = offsetTime * (ti.mTo - ti.mFrom);

			if (ti.troop != null)
			{
				ti.troop.transform.position = ti.mFrom + offsetPos;//Vector3.Lerp(ti.troop.transform.position,ti.mFrom+offsetPos,Time.deltaTime*smooth);
				ti.troop.SetActive(true);

				if (!InCanShowMarchTroop(ti.troop.transform.position))
				{
					if (ti.troop != null)
					{
						// GameObject.Destroy(ti.troop);
						if (ti.isNeedDestroyTroop)
						{
							GameObject.Destroy(ti.troop);
						}
						else
						{
							if (ti.march.marchType == Constant.MarchType.COLLECT)
							{
								RemoveOneTroop_Resource(ti.troop);
							}
							else if (ti.march.marchType == Constant.MarchType.COLLECT_RESOURCE)
							{
								RemoveOneTroop_CollectRes(ti.troop);
							}
							else
							{
								if (ti.march.isWin == 3)
								{
									RemoveOneTroop(ti.troop);
								}
								else if (ti.march.isWin == 1)
								{
									RemoveOneTroop_win(ti.troop);
								}
								else
								{
									RemoveOneTroop_lose(ti.troop);
								}
							}
						}
						ti.troop = null;
						deleteRallAndBossTroopsDate.Add(ti);
						addRallAndBossTroopsDate.Add(ti);

					}
				}
			}
		}

		for (int i = 0; i < addRallAndBossTroopsDate.Count; i++)
		{
			TroopInfo add = rallyAndBossTroops[addRallAndBossTroopsDate[i].marchKey];
			if (add.march != null)
			{
				AddMarchTroopsInfos(add.march);
			}
		}

		for (int i = 0; i < deleteRallAndBossTroopsDate.Count; i++)
		{
			if (rallyAndBossTroops.ContainsKey(deleteRallAndBossTroopsDate[i].marchKey))
			{
				rallyAndBossTroops.Remove(deleteRallAndBossTroopsDate[i].marchKey);
			}
		}
	}

	List<TroopInfo> deleteRallAndBossLinesDate = new List<TroopInfo>();
	List<TroopInfo> addRallAndBossLinesDate = new List<TroopInfo>();
	List<string> rallAndBossLineskeyList = new List<string>();
	private void RefreshRallAndBossLines()
	{
		if (rallyAndBossMarchLines.Count == 0)
			return;
		deleteRallAndBossLinesDate.Clear();
		addRallAndBossLinesDate.Clear();
		rallAndBossLineskeyList.Clear();
		int count = rallyAndBossMarchLines.Count;
		var keys = rallyAndBossMarchLines.GetEnumerator();
		while (keys.MoveNext())
		{
			rallAndBossLineskeyList.Add(keys.Current.Key);
		}

		for (int i = 0; i < count; i++)
		{
			TroopInfo ti = rallyAndBossMarchLines[rallAndBossLineskeyList[i]];

			if (ti.march != null)
			{
				if (!IsCanShowMarchLine(ti.march))
				{
					if (ti.marchline != null && ti.marchline.gameObject != null)
					{
						GameObject.Destroy(ti.marchline.gameObject);
						marchLines.Remove(ti.marchKey);
						addRallAndBossLinesDate.Add(ti);
						deleteRallAndBossLinesDate.Add(ti);
					}
				}
			}

			//			TroopInfo ti =item as TroopInfo;
			if (ti.curUnixTime >= ti.endTime)
			{
				if (ti.marchline != null && ti.marchline.gameObject != null)
				{
					//					ti.marchline.gameObject.SetActive(false);
					GameObject.Destroy(ti.marchline.gameObject);
				}
				//_Global.LogWarning("startFire update");
				if (ti.CheckFire(GameMain.unixtime()) && ti.march != null)
				{
					//_Global.LogWarning("startFire 1");
					UpdateFire(ti);
				}
				else
				{
					if (ti.march != null)
					{
						if (IsFire(ti.march.toX, ti.march.toY, ti.march.marchId))
						{
							RemoveFireObj(ti.march.toX, ti.march.toY, ti.march.marchId);
							int par = _Global.INT32(UnityEngine.Random.Range(0f, 100f));
							KBN.WorldBossController.singleton.SetBossState(ti.march.toX + "_" + ti.march.toY,
								Constant.WorldBossAnimationState.normal,
								Constant.WorldBOssAnimationAction.idle,
								par
								);
						}
					}
					//					if(ti.marchline.gameObject!=null)
					//					{
					//GameObject.Destroy(ti.marchline.gameObject);
					marchLines.Remove(ti.marchKey);
					deleteRallAndBossLinesDate.Add(ti);
					if (ti.march != null)
					{
						// KBN.WorldBossController.singleton.SetBossState(ti.march.toX,ti.march.toY,Constant.WorldBossAniamtionState.idle);

						int par = _Global.INT32(UnityEngine.Random.Range(0f, 100f));
						KBN.WorldBossController.singleton.SetBossState(ti.march.toX + "_" + ti.march.toY,
							Constant.WorldBossAnimationState.normal,
							Constant.WorldBOssAnimationAction.idle,
							par
							);
					}
					//					}
				}
				continue;
			}
			if (GameMain.unixtime() > ti.lastUnixTime)
			{
				ti.lastUnixTime = GameMain.unixtime();
				ti.curUnixTime = GameMain.unixtime();
			}
			ti.curUnixTime += Time.deltaTime;
			float offsetTime = 1 - (float)((ti.endTime - ti.curUnixTime) * 1f) / ti.oneWayTime;
			offsetTime = Mathf.Clamp(offsetTime, 0, 1);

			Vector3 offsetPos = offsetTime * (ti.mTo - ti.mFrom);

			Vector3 progressPos = ti.mFrom + offsetPos;
			ti.marchline.SetProgress(progressPos);
		}

		for (int i = 0; i < addRallAndBossLinesDate.Count; i++)
		{
			TroopInfo add = rallyAndBossMarchLines[addRallAndBossLinesDate[i].marchKey];
			if (add.march != null)
			{
				AddMarchLineInfos(add.march);
			}
		}

		for (int i = 0; i < deleteRallAndBossLinesDate.Count; i++)
		{
			if (rallyAndBossMarchLines.ContainsKey(deleteRallAndBossLinesDate[i].marchKey))
			{
				rallyAndBossMarchLines.Remove(deleteRallAndBossLinesDate[i].marchKey);
			}
		}
	}

	List<string> keyList = new List<string>();
	protected void RefreshTroops()
	{
		if (troopInfos.Count == 0)
			return;
		if (troopObjPrefab == null)
			return;
		deleteDate.Clear();
		keyList.Clear();
		int count = troopInfos.Count;
		var keys = troopInfos.GetEnumerator();
		while (keys.MoveNext())
		{
			keyList.Add(keys.Current.Key);
		}

		for (int i = 0; i < count; i++)
		{
			TroopInfo ti = troopInfos[keyList[i]];

			if (ti.curUnixTime >= ti.endTime)
			{
				//_Global.LogWarning("startFire update");
				if (false)//ti.CheckFire(GameMain.unixtime())&&ti.march!=null)
				{
					//_Global.LogWarning("startFire 1");
					UpdateFire(ti);
				}
				else
				{
					if (ti.march != null)
					{
						if (StateDic.ContainsKey(ti.march.marchId))
						{
							StateDic.Remove(ti.march.marchId);
							int par = _Global.INT32(UnityEngine.Random.Range(0f, 100f));
							KBN.WorldBossController.singleton.SetBossState(ti.march.toX + "_" + ti.march.toY,
								Constant.WorldBossAnimationState.normal,
								Constant.WorldBOssAnimationAction.idle,
								par
								);
						}
					}
					if (ti.troop != null)
					{
						GameObject.Destroy(ti.troop);
						GameObject.Destroy(ti.marchline.gameObject);
						marchLines.Remove(ti.marchKey);
						deleteDate.Add(ti);
						if (ti.march != null)
						{
							int par = _Global.INT32(UnityEngine.Random.Range(0f, 100f));
							KBN.WorldBossController.singleton.SetBossState(ti.march.toX, ti.march.toY,
								Constant.WorldBossAnimationState.normal,
								Constant.WorldBOssAnimationAction.idle,
								par
								);
						}
					}
				}
				continue;
			}
			if (GameMain.unixtime() > ti.lastUnixTime)
			{
				ti.lastUnixTime = GameMain.unixtime();
				ti.curUnixTime = GameMain.unixtime();
			}
			ti.curUnixTime += Time.deltaTime;
			float offsetTime = 1 - (float)((ti.endTime - ti.curUnixTime) * 1f) / ti.oneWayTime;
			offsetTime = Mathf.Clamp(offsetTime, 0, 1);

			Vector3 offsetPos = offsetTime * (ti.mTo - ti.mFrom);

			ti.troop.transform.position = ti.mFrom + offsetPos;//Vector3.Lerp(ti.troop.transform.position,ti.mFrom+offsetPos,Time.deltaTime*smooth);
			ti.marchline.SetProgress(ti.troop.transform.position);
			ti.troop.SetActive(true);
		}

		for (int i = 0; i < deleteDate.Count; i++)
		{
			if (troopInfos.ContainsKey(deleteDate[i].marchKey))
			{
				troopInfos.Remove(deleteDate[i].marchKey);
			}
		}
	}

	protected long GetUnixTime(string _time)
	{
		long time;
		System.DateTime dt = System.Convert.ToDateTime(_time);
		System.DateTime dt1970 = System.Convert.ToDateTime("1970-1-1 8:00:00");
		System.TimeSpan ts = dt - dt1970;
		time = (long)ts.TotalSeconds;
		return time;
	}

	private void AddMarchlineTile(ref string tilesList)
	{
		StringBuilder sb = new StringBuilder();
		var troopInfoKeys = troopInfos.GetEnumerator();
		while (troopInfoKeys.MoveNext())
		{
			string itemKey = troopInfoKeys.Current.Key;
			TroopInfo mTroopInfo;

			if (troopInfos.TryGetValue(itemKey, out mTroopInfo))
			{
				string key = mTroopInfo.carmotPosKey;
				if (!tilesList.Contains(key))
				{
					sb.Append(key + ",");
				}
			}
		}

		if (sb.Length > 0)
		{
			tilesList += sb.ToString();
		}
	}
	//添加marchline显示上限
	private void CheckOtherPlayerMarchLineLimit()
	{
		if (marchLines.Count > otherMarchLineLimit)
		{
			string marchKey = marchLines[0];
			TroopInfo mTroopInfo;
			if (troopInfos.TryGetValue(marchKey, out mTroopInfo))
			{
				GameObject.Destroy(mTroopInfo.troop);
				GameObject.Destroy(mTroopInfo.marchline.gameObject);
				marchLines.Remove(marchKey);
				troopInfos.Remove(marchKey);
			}
		}
	}

	public Rect lineWithRect = new Rect(-Screen.width / 2f, -Screen.height / 2f, Screen.width, Screen.height);
	public Vector2 VecLineStart;
	public Vector2 vecLineEnd;
	// private void OnDrawGizmos()
	// {	
	// 	Gizmos.DrawLine(VecLineStart, vecLineEnd);

	// 	Gizmos.DrawLine(leftDown, leftUp);
	// 	Gizmos.DrawLine(leftUp, RightUp);
	// 	Gizmos.DrawLine(RightUp, RigtDown);
	// 	Gizmos.DrawLine(RigtDown, leftDown);
	// }

	string content = "不在矩形内";
	public bool marchLineInScreen(Vector2 lineStartPos, Vector2 lineEndPos)
	{
		VecLineStart = lineStartPos;
		vecLineEnd = lineEndPos;

		bool isInScreen = false;
		if (LineInRect(lineStartPos, lineEndPos, lineWithRect))
		{
			isInScreen = true;
		}

		if (LineIntersectRect(lineStartPos, lineEndPos, lineWithRect))
		{
			isInScreen = true;
		}

		return isInScreen;
	}

	public Vector3 leftDown
	{
		get
		{
			return new Vector2(lineWithRect.xMin, lineWithRect.yMin);
		}
	}
	public Vector3 leftUp
	{
		get
		{
			return new Vector2(lineWithRect.xMin, lineWithRect.yMax);
		}
	}
	public Vector3 RigtDown
	{
		get
		{
			return new Vector2(lineWithRect.xMax, lineWithRect.yMin);
		}
	}
	public Vector3 RightUp
	{
		get
		{
			return new Vector2(lineWithRect.xMax, lineWithRect.yMax);
		}
	}

	// 线是否在矩形内
	bool LineInRect(Vector2 lineStart, Vector2 lineEnd, Rect rect)
	{
		return rect.Contains(lineStart) || rect.Contains(lineEnd);
	}

	// 线与矩形是否相交
	bool LineIntersectRect(Vector2 lineStart, Vector2 lineEnd, Rect rect)
	{
		if (LineIntersectLine(lineStart, lineEnd, leftDown, leftUp))
			return true;
		if (LineIntersectLine(lineStart, lineEnd, leftUp, RightUp))
			return true;
		if (LineIntersectLine(lineStart, lineEnd, RightUp, RigtDown))
			return true;
		if (LineIntersectLine(lineStart, lineEnd, RigtDown, leftDown))
			return true;

		return false;
	}

	// 线与线是否相交
	bool LineIntersectLine(Vector2 l1Start, Vector2 l1End, Vector2 l2Start, Vector2 l2End)
	{
		return QuickReject(l1Start, l1End, l2Start, l2End) && Straddle(l1Start, l1End, l2Start, l2End);
	}

	// 快速排序。  true=通过， false=不通过
	bool QuickReject(Vector2 l1Start, Vector2 l1End, Vector2 l2Start, Vector2 l2End)
	{
		float l1xMax = Mathf.Max(l1Start.x, l1End.x);
		float l1yMax = Mathf.Max(l1Start.y, l1End.y);
		float l1xMin = Mathf.Min(l1Start.x, l1End.x);
		float l1yMin = Mathf.Min(l1Start.y, l1End.y);

		float l2xMax = Mathf.Max(l2Start.x, l2End.x);
		float l2yMax = Mathf.Max(l2Start.y, l2End.y);
		float l2xMin = Mathf.Min(l2Start.x, l2End.x);
		float l2yMin = Mathf.Min(l2Start.y, l2End.y);

		if (l1xMax < l2xMin || l1yMax < l2yMin || l2xMax < l1xMin || l2yMax < l1yMin)
			return false;

		return true;
	}

	// 跨立实验
	bool Straddle(Vector3 l1Start, Vector3 l1End, Vector3 l2Start, Vector3 l2End)
	{
		float l1x1 = l1Start.x;
		float l1x2 = l1End.x;
		float l1y1 = l1Start.y;
		float l1y2 = l1End.y;
		float l2x1 = l2Start.x;
		float l2x2 = l2End.x;
		float l2y1 = l2Start.y;
		float l2y2 = l2End.y;

		if ((((l1x1 - l2x1) * (l2y2 - l2y1) - (l1y1 - l2y1) * (l2x2 - l2x1)) *
			 ((l1x2 - l2x1) * (l2y2 - l2y1) - (l1y2 - l2y1) * (l2x2 - l2x1))) > 0 ||
			(((l2x1 - l1x1) * (l1y2 - l1y1) - (l2y1 - l1y1) * (l1x2 - l1x1)) *
			 ((l2x2 - l1x1) * (l1y2 - l1y1) - (l2y2 - l1y1) * (l1x2 - l1x1))) > 0)
		{
			return false;
		}

		return true;
	}

	public float fpsMeasuringDelta = 1.0f;
	private float timePassed;
	private int m_FrameCount = 0;
	private float m_FPS = 0.0f;
	//获取fps
	public float GetFPS()
	{
		return m_FPS;
	}
}


