using UnityEngine;
using System.Collections;
using Datas = KBN.Datas;
using _Global = KBN._Global;
using ErrorMgr = KBN.ErrorMgr;
using UnityNet = KBN.UnityNet;
using MyItems = KBN.MyItems;
using MystryChest = KBN.MystryChest;
using System.Net;
using System.IO;
using System;
using System.Collections.Generic;
public class TextureMgr : MonoBehaviour
{
	public static TextureMgr singleton { get; protected set; }
	public  bool useLocalResolution=false;
	public  Vector2 screenResolution=new Vector2(640,960);
	public Constant.EitorResolutionType resolutionType;

	public	static	TextureMgr	instance()
	{
		return singleton;
	}
	
	public void Awake()
	{
		if(singleton)
		{
			Destroy (gameObject);
			return;
		}	
		singleton = this;
		priv_init();
		DontDestroyOnLoad(this.transform);
	}

	public void Update()
	{
		if ( m_iconSpt != null )
			m_iconSpt.Update();
		if ( gearSpt != null )
			gearSpt.Update();
		if ( m_asyncLoadTextureMgr != null )
			m_asyncLoadTextureMgr.LoadTexturesFromBuffer();
			if(m_Requestlist.Count>0)
			{
              for(int i = m_Requestlist.Count-1;i >= 0;i--)
			  {
				if(m_Requestlist[i]._request.isDone)
				 {
					GameObject obj = m_Requestlist[i]._request.asset as GameObject;
					if(m_Requestlist[i]._callback!=null)
						{
						  m_Requestlist[i]._callback.DynamicInvoke(obj);
						// _Global.LogWarning("LoadPrefab: x"+ Time.time);
						}
						  m_RequestNamelist.Remove(m_Requestlist[i]._name);
						  m_Requestlist.Remove(m_Requestlist[i]);
						 
				 }
			  }
			}
	}
	
	
	private	void	priv_init()
	{	
		otaDataPath = KBN.GameMain.GetApplicationDataSavePath() + "/ota/";
		m_AssetBundleMgr = AssetBundleManager.Instance ();
		retryQueue = new System.Collections.Generic.LinkedList<HashObject>();
		//downloadQueue = new Array();
	}

	protected AssetBundleManager m_AssetBundleMgr;
	private RemoteFile.RemoteFileMgr m_remoteFileMgr;
	private AsyncLoadTextureMgr m_asyncLoadTextureMgr;

	static private string animationPrePath = "AnimationPrefab/";	

	protected static string  otaDataPath;
	
	protected bool bChecked = false; 
	protected System.Collections.Generic.LinkedList<HashObject> retryQueue;
	//protected Array downloadQueue;
	protected HashObject updateAssets;
	
	protected int downloadQuant = 0;
	protected int finished = 0;
	protected int fakeFinished = 0;
	//protected TileSprite	backgroundSpt;
	protected TileSprite	m_iconSpt;
	//private TileSprite		m_buildingSpt;
	protected TileSprite	gearSpt;

	protected Texture2D whiteTex = null;

	public string otaPackageNameToType(string otaPackageName)
	{
		switch( otaPackageName )
		{
		case	"fte.assetbundle":
			return TextureType.FTE;
			
		case	"font.assetbundle":
			return TextureType.FONT;
			
		case	"report.assetbundle":
			return TextureType.REPORT;
			
		case	"build_animation.assetbundle":
			return TextureType.BUILD_ANIMATION;
			
		case	"map.assetbundle":
			return TextureType.MAP17D3A_TILE;
			
		case	"background.assetbundle":
			return TextureType.BACKGROUND;
			
		case	"gears.assetbundle":
			return TextureType.GEARS;
			
		case	"gear.assetbundle":
			return TextureType.GEAR;
			
		case	"audio.assetbundle":
			return TextureType.AUDIO;
		case	"audiogear.assetbundle":
			return TextureType.AUDIO_GEAR;
		case	"audiohero.assetbundle":
			return TextureType.AUDIO_HERO;
		case	"audioopenmenu.assetbundle":
			return TextureType.AUDIO_OPENMENU;
		case	"audiopve.assetbundle":
			return TextureType.AUDIO_PVE;
		case	"audioselecttroop.assetbundle":
			return TextureType.AUDIO_SELECTTROOP;
		case	"audiowheelgame.assetbundle":
			return TextureType.AUDIO_WHEELGAME;
			
			//		case	"icon_item.assetbundle":
			//			return TextureType.ICON_ITEM;
		case 	"buildingSprite.assetbundle":
			return TextureType.BUILDING_SPRITE;
			
		case	"icon_else.assetbundle":
			return TextureType.ICON_ELSE;
			
		case	"building.assetbundle":
			return TextureType.BUILDING;

		case	"campaign.assetbundle":
			return TextureType.PVE_CAMPAIGN;

		case 	"campaignanimation.assetbundle":
			return TextureType.PVE_CAMPAIGN_ANIMATION;

		case 	"campaignlevels.assetbundle":
			return TextureType.PVE_CAMPAIGN_LEVELS;
		
		case	"chaptermap100.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP100;
		case	"chaptermap101.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP101;
		case	"chaptermap102.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP102;
		case	"chaptermap103.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP103;
		case	"chaptermap104.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP104;
		case	"chaptermap105.assetbundle":
			return TextureType.PVE_CAMPAIGN_CHAPTERMAP105;

		case	"load.assetbundle":
			return TextureType.LOAD;
			
		case	"prefab.assetbundle":
			return TextureType.PREFAB;
			
		case	"effect.assetbundle":
			return TextureType.EFFECT;
			
		case	"icons.assetbundle":
			return TextureType.ICONS;
			
		case	"decoration.assetbundle":
			return TextureType.DECORATION;
			
		case	"button.assetbundle":
			return TextureType.BUTTON;
			
		case	"level.assetbundle":
			return TextureType.LEVEL;
			
		case	"icon.assetbundle":
			return TextureType.ICON;
			
		case	"getmore.assetbundle":
			return TextureType.GETMORE;
			
		case	"loading.assetbundle":
			return TextureType.LOADING;
			
		case	"layout.assetbundle":
			return TextureType.UILAYOUT;
			
		case	"wheelgames.assetbundle":
			return TextureType.WHEELGAME;
		case	"hero.assetbundle":
			return TextureType.HERO;
		case "pveboss.assetbundle":
			return TextureType.PVEBOSS;
			case "castle_skin.assetbundle":
				return TextureType.CITYSKIN;
		}
		return null;
	}
	

	public void InitSpt()
	{
		if (null != m_iconSpt)
			return;
		//m_iconSpt = TileSprite.CreateSprite(LoadText("Icons",TextureType.ICONS));
		m_iconSpt = priv_loadSpt("Icons", TextureType.ICONS);
		gearSpt = m_iconSpt;
		TileSprite.DefaultIcon = LoadTexture("icon_default", TextureType.ICON);
	}

	private void ReInitIcons()
	{
		m_iconSpt = priv_loadSpt("Icons", TextureType.ICONS);
		gearSpt = m_iconSpt;
		TileSprite.DefaultIcon = LoadTexture("icon_default", TextureType.ICON);
	}

	public void ReInitSpt()
	{
		ReInitIcons ();
	}

	private TileSprite priv_loadSpt(string name, string type)
	{
		TextAsset noOTA = priv_loadText(name, type, true);
		var tileSpt = TileSprite.CreateSprite(noOTA);
		var texNameNeedOTA = new System.Collections.Generic.List<string>();

		for ( uint i = 0; true; ++i )
		{
			var texInfo = tileSpt.GetTextureInfo(i);
			if ( texInfo == null )
				break;
			if ( !tileSpt.IsOTA(i) )
				continue;
			texNameNeedOTA.Add(texInfo.name);
		}

		TextAsset withOTA = priv_loadText(name, type, false);
		var otaTileSpt = TileSprite.CreateSprite(withOTA);
		tileSpt.Combine(otaTileSpt, texNameNeedOTA.ToArray());
		return tileSpt;
	}
	#region Get IconSpt
	public TileSprite SlotSpt()
	{
		return m_iconSpt;
	}
	
	public TileSprite UnitSpt()
	{
		return m_iconSpt;
	}
	
	public TileSprite GeneralSpt()
	{
		return m_iconSpt;
	}
	
	public TileSprite ResearchSpt()
	{
		return m_iconSpt;
	}
	
	public TileSprite BuildingSpt()
	{
		return m_iconSpt;
		//return m_buildingSpt;
	}
	
	public TileSprite ItemSpt()
	{
		return m_iconSpt;
	}

	public TileSprite IconSpt()
	{
		return m_iconSpt;
	}
	
	public TileSprite ElseIconSpt()
	{
		return m_iconSpt;
	}

	public TileSprite ActivitySpt()
	{
		return m_iconSpt;
	}

	public TileSprite GetHeroSpt()
	{
		return m_iconSpt;
	}

	public TileSprite GetTechSkillSpt()
	{
		return m_iconSpt;
	}

	#endregion
	#region Load Any Resource
	private Texture2D priv_loadRemoteTexture(string name, AsyncLoadTextureMgr.LoadTextureFinishHandle onLoadTextureFinish)
	{
		if ( m_asyncLoadTextureMgr == null )
		{
			m_remoteFileMgr = new RemoteFile.RemoteFileMgr(System.IO.Path.Combine(Application.persistentDataPath, "AsyncTexture"));
			m_remoteFileMgr.Start();
			m_asyncLoadTextureMgr = new AsyncLoadTextureMgr(m_remoteFileMgr);
		}
		return m_asyncLoadTextureMgr.GetTexture(name, onLoadTextureFinish);
	}

	public Texture2D LoadTexture(string name)
	{
		return priv_loadTextureWithCallback(name, null);
	}

	public Texture2D LoadTexture(string name, AsyncLoadTextureMgr.LoadTextureFinishHandle onLoadTextureFinish)
	{
		return priv_loadTextureWithCallback(name, onLoadTextureFinish);
	}

	private Texture2D priv_loadTextureWithCallback(string name, AsyncLoadTextureMgr.LoadTextureFinishHandle onLoadTextureFinish)
	{
		if ( name.IndexOf(":") != -1 )
			return priv_loadRemoteTexture(name, onLoadTextureFinish);
		int atPos = name.IndexOf("@");
		if ( atPos == -1 )
		{
			if ( onLoadTextureFinish != null )
				onLoadTextureFinish(false, name, null);
			return null;
		}

		string firstName = name.Substring(0, atPos);
		string lastName = name.Substring(atPos + 1);
		Texture2D tex = priv_loadTextureFromLocal(firstName, lastName);
		if ( onLoadTextureFinish != null )
			onLoadTextureFinish(tex != null, name, tex);
		return tex;
	}

	public Texture2D LoadTexture(string name, string type)
	{
		if ( string.IsNullOrEmpty(name) )
			return null;

	#if UNITY_ANDROID
		if(name.Equals("square_black2"))
		{
			name="square_black3";
		}
	#endif

		if ( name.IndexOf(":") != -1 )
		{
			return priv_loadRemoteTexture(name, null);
		}

		return priv_loadTextureFromLocal(name, type);
	}

	public bool IsOTA(string name, string type)
	{
		return m_AssetBundleMgr.IsResExist (name);

	}

	private Texture2D priv_loadTextureFromLocal(string name, string type)
	{
		Texture2D ret = null;

		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name)as Texture2D ;
				m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch (Exception e)
			{
				ret =  null;
			}
		}
		//_Global.LogWarning("priv_loadTextureFromLocal"+name);
		if( ret == null ){
			ret =  Resources.Load<Texture2D>(newType(type) + name) ;	
		}	
		
		if( ret == null ){
			ret =  Resources.Load<Texture2D>(type + name) ;
		}
		
		return ret;
	}

	public TextAsset LoadText(string name, string type)
	{
		return priv_loadText(name, type, false);
	}

	public TextAsset priv_loadText(string name, string type, bool skipOTA)
	{
		TextAsset ret = null;
		if( !skipOTA )
		{
			var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
			if(assetBundle != null)
			{
				try
				{
					ret = assetBundle.LoadAsset(name)as TextAsset ;
					m_AssetBundleMgr.UnLoadAssetBundles(name);
				}
				catch(Exception e)
				{
					ret = null;
				}
			}
		}
		// _Global.LogWarning("priv_loadText"+name);

		
		if( ret == null )
			ret =  Resources.Load<TextAsset>(newType(type) + name);	
		if( ret == null )
			ret =  Resources.Load<TextAsset>(type + name);
		return ret;
	}

	public Font LoadFont(string name, string type)
	{
		Font ret = null;

		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name) as Font;
				m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch(Exception e)
			{
				ret = null;
			}
		}
			 //_Global.LogWarning("LoadFont"+name);
		if( ret == null )
		{
			ret = Resources.Load<Font>(newType(type) + name) ;
		}
		
		if( ret == null )
		{
			ret = Resources.Load<Font>(type + name);
		}	
		
		return ret;
	}

	public void UnloadAudio( AudioClip audioToUnload )
	{
		Resources.UnloadAsset(audioToUnload);
	}

	public AudioClip LoadAudio( string name, string type )
	{
		AudioClip ret = null;

		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name) as AudioClip;
				//m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch(Exception e)
			{
				ret = null;
			}
		}

		//_Global.LogWarning("LoadAudio"+name);

		if( ret == null )
		{
			ret = Resources.Load<AudioClip>(newType(type) + name);
		}
		
		if( ret == null )
		{
			ret = Resources.Load<AudioClip>(type + name);
		}	
		
		return ret;	
	}

	public TextAsset LoadUILayout(string name)
	{
		TextAsset ret = null;
		var type = TextureType.UILAYOUT;

		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name) as TextAsset;
				m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch(Exception e)
			{
				ret = null;
			}
		}
		//_Global.LogWarning("LoadUILayout"+name);

		if( ret == null ){
			ret =  Resources.Load<TextAsset>(newType(type) + name);
#if UNITY_EDITOR
			Debug.Log("layoutRes NamePath(new):<color=#FF5EC5FF>" + (newType(type) + name) + "</color>");
#endif
		}

		if ( ret == null ){
			ret =  Resources.Load<TextAsset>(type + name);
#if UNITY_EDITOR
			Debug.Log("layoutRes NamePath:<color=#FF5EC5FF> " + (type + name) + "</color>");
#endif
		}

		return ret;
	}
	
	public UILayout.UIFrame LoadUILayout(string fileName, System.Collections.Generic.Dictionary<string, object> initPropList)
	{
		TextAsset textResource;
		if ( _Global.IsLargeResolution() )
			textResource = this.LoadUILayout(fileName + ".high");
		else
			textResource = this.LoadUILayout(fileName + ".low");
		
		var memStream = new System.IO.MemoryStream(textResource.bytes);
		return UILayout.XAMLResReader.ReadFile(memStream, initPropList) as UILayout.UIFrame;
	}

	public GameObject LoadPrefab(string name)
	{
		GameObject ret = null;

		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name)as GameObject ;
				m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch(Exception e)
			{
				ret = null;
			}
		}
		//_Global.LogWarning("LoadPrefab"+name);

		if( ret == null ){
			ret = Resources.Load<GameObject>(newType(TextureType.PREFAB) + name)  ;
		}
		
		if ( ret == null ){
			ret = Resources.Load<GameObject>(TextureType.PREFAB + name); 
		}
		
		return ret;
	}
	


   public void LoadMenuPrefabAysn(string name,MulticastDelegate callback)
   {

			 if( Datas.singleton != null)
			 {
				loadAysnPrefab(newType(TextureType.PREFAB) + name,callback);
			 }
			else
			{
			  loadAysnPrefab(TextureType.PREFAB + name,callback);
			}
		
   }
    private List<RequestStruct> m_Requestlist = new List<RequestStruct>();
	private List<String> m_RequestNamelist = new List<string>();
    
    public struct RequestStruct
	{
        public ResourceRequest _request;
		public MulticastDelegate _callback;

		public String _name;
	}
	private void loadAysnPrefab(string name,MulticastDelegate callback)
	{
		//_Global.LogWarning("LoadPrefab"+ name +" "+ Time.time);
		if(!m_RequestNamelist.Contains(name)){
			ResourceRequest request = Resources.LoadAsync(name);
			RequestStruct rs = new RequestStruct();
			rs._request = request;
			rs._callback = callback;
			rs._name = name;
			m_Requestlist.Add(rs);
			m_RequestNamelist.Add(name);
		}
		

		// if(request.asset!=null)
		// {
        //     GameObject obj = Instantiate(request.asset) as GameObject;
		// 	 if(callback!=null)
		// 	{
		// 		callback.DynamicInvoke(obj);
		// 	}
		// }
		

	}
	// private IEnumerator loadAysnAssesBundle(string name,Action<GameObject> callback)
	// {
    //      AssetBundleRequest request =  AssetBundle.LoadAsync(name,typeof(GameObject));
	// 	 yield return request;
	// 	 GameObject obj = request.asset as GameObject;
	// 		if(callback!=null)
	// 		{
	// 			callback(obj);
	// 		}

	// }
	public TileSprite GetGearSpt()
	{
		if(gearSpt == null) 
			InitGearSpt();
		return gearSpt;
	}

	public TileSprite GetWheelGamesSpt()
	{
		//var sprite = TileSprite.CreateSprite(LoadTexture("wheelgames", TextureType.WHEELGAME), LoadText("wheelgames", TextureType.WHEELGAME));
		var sprite = TileSprite.CreateSprite(LoadText("Wheelgames", TextureType.WHEELGAME));
		return sprite;
	}
	
	public Tile GetGearIcon(string name)
	{
		if(gearSpt == null) 
			InitGearSpt();
		return gearSpt.GetTile(name);
	}
	
	public TileSprite BackgroundSpt()
	{
		return m_iconSpt;
	}
	
	#endregion
	//获取自资源动画Obj  （名称，类型）
	public GameObject loadAnimationSprite(string name, string spriteType)
	{
		var type = animationPrePath + spriteType + "/";
		GameObject ret = null;
	
		var assetBundle = m_AssetBundleMgr.GetAssetBundle(name);
		if(assetBundle != null)
		{
			try
			{
				ret = assetBundle.LoadAsset(name) as GameObject;
				m_AssetBundleMgr.UnLoadAssetBundles(name);
			}
			catch
			{
				ret = null;
			}
		}
       // _Global.LogWarning("loadAnimationSprite"+name);
		if( ret == null ){
			ret =  Resources.Load<GameObject>(newType(type) + name) ;	
		}	
		
		if( ret == null ){
			ret =  Resources.Load<GameObject>(type + name);
		}
		
		return ret;
	}

	public Texture2D loadBuildingTextureFromSprite(string name)
	{
		GameObject m_animationSprClone = loadAnimationSprite(name, Constant.AnimationSpriteType.Building);
		if (m_animationSprClone == null)
			return null;

		m_animationSprClone = Instantiate(m_animationSprClone) as GameObject;
		var texture = m_animationSprClone.transform.GetChild(0).GetComponent<Renderer>().material.mainTexture as Texture2D;

		GameObject.Destroy(m_animationSprClone);
		m_animationSprClone = null;

		return texture;
	}

	public string LoadTileNameFromSetting(string key)
	{
		HashObject imageData = Datas.singleton.imageResourceData();
		if(imageData["i" + key] == null)
			return "";

		string name = imageData["i" + key][_Global.ap + 1].Value.ToString();
		return name;
	}

	private	string newType(string type)
	{
		if(Datas.singleton == null)
		{
			return type;
		}
		if ( _Global.IsLowEndProduct() )
			return Datas.singleton.getGameTheme() == 1 ? "low/" + type : "Reskin/low/" + type;
		return Datas.singleton.getGameTheme() == 1 ? type : "Reskin/" + type;
	}
	public string castBundleName(string bundleName)
	{
		//var otaPackage:HashObject = updateAssets[otaKeys[i]];
		//var assetBundleName : String = otaPackage["name"].Value;
		var extName = System.IO.Path.GetExtension(bundleName);
		switch ( extName )
		{
		case ".ios":
			if ( Application.platform != RuntimePlatform.IPhonePlayer && Application.platform != RuntimePlatform.OSXEditor )
				return null;
			bundleName = bundleName.Substring(0, bundleName.Length - 4 /* ".ios".Length */);
			break;
			
		case ".android":
			if ( Application.platform != RuntimePlatform.Android && Application.platform != RuntimePlatform.OSXEditor )
				return null;
			bundleName = bundleName.Substring(0, bundleName.Length - 8/* ".android".Length */);
			break;
			
		case ".assetbundle":
			break;
		}
		
		return bundleName;
	}
	
	private string priv_getBundleFileVerKey(string packName)
	{
		return "t_" +Datas.singleton.getGameTheme() +  "_" + packName + "_version";
	}
	
	private string priv_getOTAVersionKey()
	{
		return "t_" +Datas.singleton.getGameTheme() + "_ota_version";
	}

    public Tile LoadTileOfItem(int _itemId)
    {
        var tileName = LoadTileNameOfItem(_itemId);
        return ItemSpt().GetTile(tileName);
    }
	
	public string LoadTileNameOfItem(int _itemId)
	{
		var item = (Datas.singleton.itemlist())["i" + _itemId];				
		string imageName = null;

		if(MystryChest.singleton.IsMystryChest(_itemId))
		{
			imageName = MystryChest.singleton.GetChestImage(_itemId);
			if(!this.ItemSpt().IsTileExist(imageName))
			{
				imageName = Constant.DefaultChestTileName;
			}			
		}
		else if(MystryChest.singleton.IsLevelChest(_itemId))
		{
			imageName = MystryChest.singleton.GetLevelChestImage(_itemId);
			if(!this.ItemSpt().IsTileExist(imageName))
			{
				imageName = Constant.DefaultChestTileName;
			}			
		}
		else if(MystryChest.singleton.IsExchangeChest(_itemId))
		{
			imageName = MystryChest.singleton.GetChestImage(_itemId);
			if(!this.ItemSpt().IsTileExist(imageName))
			{
				imageName = "i" + _itemId;
			}						
		}
		else if(item != null)
		{
			var categary = (MyItems.Category)_Global.INT32(item["category"]);
			if(categary == MyItems.Category.Chest)
			{
				imageName = "i"+ _itemId.ToString();
				if(!this.ItemSpt().IsTileExist(imageName))
				{
					imageName = Constant.DefaultChestTileName;
				}			
			}
			else
			{
				var itemImage = (Datas.singleton.imageResourceData())["i" + _itemId];
				if(itemImage != null)
				{
					imageName = itemImage[_Global.ap + 1].Value.ToString();
				}
				else
				{
					imageName = "i" + _itemId;
				}
			}
		}
        if ( imageName != null && this.ItemSpt().IsTileExist(imageName) ) {
            return imageName;
		}
		return "icon_default";
	}
	
	public TileSprite GetSpriteFromSetting(string key)
	{
		var imageData = Datas.singleton.imageResourceData();
		var sprite = m_iconSpt;
		if ( imageData["i" + key] != null )
		{
			var type = _Global.INT32(imageData["i" + key][_Global.ap + 0]);
			switch(type)
			{
			case 1:
				sprite = ItemSpt();
				break;
			case 2:
				sprite = BuildingSpt();
				break;
			case 3:
				sprite = GeneralSpt();
				break;
			case 4:
				sprite = ResearchSpt();
				break;
			case 5:
				sprite = UnitSpt();
				break;
			default:
				sprite = m_iconSpt;
				break;
			}
		}
		return sprite;
	}
	
	protected static bool IsGZip(WWW www)
	{
		foreach (string key in www.responseHeaders.Keys)
		{
			if(0 == string.Compare(key, "Content-Encoding", true))
			{
				string val = www.responseHeaders[key];
				if(0 == string.Compare(val, "gzip", true))
				{
					return true;
				}
			}
		}
		return false;
	}

	public void unloadUnusedAssets()
	{
		//Resources.UnloadUnusedAssets();
	}   
	
	public bool MVPDownloadFin()
	{
		bool bRet = false;
		if ( finished < downloadQuant )
		{
			bRet =  false;
		}
		else
		{
			bRet = bChecked;
			bChecked = false;
		}
		return bRet;
	}

	
	void RetryDownload()
	{
		Invoke("RetryDownloadAssetBundle",0.1f);
	}

	public void InitGearSpt()
	{
		if ( gearSpt == null )
			gearSpt = TileSprite.CreateSprite(LoadText("Icons", TextureType.ICONS));
			//gearSpt = TileSprite.CreateSprite(LoadTexture("gears", TextureType.GEARS), LoadText("gears", TextureType.GEARS));
	}

	public void DestroyGearSpt()
	{
		if(gearSpt == null)
			return;
		gearSpt.ClearTextures();
	}

	public Texture2D WhiteTex()
	{
		if (null == whiteTex) {
			whiteTex = new Texture2D(1, 1);
			whiteTex.SetPixel(0, 0, Color.white);
			whiteTex.Apply();
		}
		return whiteTex;
	}

	public delegate void DrawTextureOK();
	public event DrawTextureOK onDrawTextureOK = null;
	
	public List<Vector3> m_point3;
	public Color m_lineColor;
	//public Color m_bgColor = new Color(198f/255f, 206f/255f, 211f/255f, 255f/255f);
	public Color m_bgColor = new Color(0f, 0f, 0f, 0f);
	public Texture2D m_texure; //最终渲染得到的带有贝塞尔曲线的纹理
	
	public int segmentNum = 1000;
	
	public int width = 460;
	public int height = 174;

	public void InitCanvas(List<Vector3> points, int width, int height) 
	{
		this.m_point3 = points;
		this.width = width;
		this.height = height;
		// 带透明通道的
		m_texure = new Texture2D(width, height, TextureFormat.ARGB32, false);
		
		StartCoroutine(Draw());
	}
	
	public IEnumerator Draw()
	{
		//清空纹理对象
		for (int i = 0; i < width; i++)
		{
			for (int j = 0; j < height; j++)
			{
				m_texure.SetPixel(i, j, m_bgColor);
			}
		}
		
		for(int j = 1 ; j <= segmentNum; j++)
		{
			float t = j / (float)segmentNum;
			
			for(int i = 0; i <= m_point3.Count - 2; i++)
			{
				int p0 = i - 1 <= 0 ? 0 : i - 1;
				int p1 = i;
				int p2 = i + 1;
				int p3 = i + 2 > m_point3.Count - 1 ? m_point3.Count - 1 : i + 2;
				
				Vector3 pixel = CatmullRomPoint(t, m_point3[p0] ,m_point3[p1], 
				                                m_point3[p2], m_point3[p3]);
				
				int pixelX = Convert.ToInt32(pixel.x);
				int pixelY = Convert.ToInt32(pixel.y);
				m_texure.SetPixel(pixelX, pixelY, m_lineColor);
				m_texure.SetPixel(pixelX, pixelY - 1, m_lineColor);
				m_texure.SetPixel(pixelX, pixelY - 2, m_lineColor);
			}
		}
		
		m_texure.Apply();
		
		if(onDrawTextureOK != null)
		{
			onDrawTextureOK();
		}
		
		yield return m_texure;
	}
	
	public void RegisterDrawTextureOKFunc(DrawTextureOK ok)
	{
		onDrawTextureOK = ok;
	}
	
	private Vector3 CatmullRomPoint(float t, Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3)
	{
		return p1 + (0.5f * (p2 - p0) * t) + 0.5f * (2f * p0 - 5f * p1 + 4f * p2 - p3) * t * t +
			0.5f * (-p0 + 3f * p1 - 3f * p2 + p3) * t * t * t;
	}

	public void Clear()
	{
      m_Requestlist.Clear();
	}
}

