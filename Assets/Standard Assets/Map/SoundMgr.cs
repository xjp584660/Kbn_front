using UnityEngine;
using System.Collections.Generic;
using _Global = KBN._Global;
using KBN;

public class SoundMgr : MonoBehaviour
{
	public AudioSource musicPlayer;
	public AudioSource[] effectPlayer;
	private int currentEffectPlayerIndex = 0;


	private	static	SoundMgr singleton;
	public	static	SoundMgr instance(){
		return singleton;
	}

	// OTA
	private class PlaybackContext
	{
		public AudioClip m_clip;
		public int m_playbackCount; // The playback count is a key to determine when to load the SFX
	};
	private bool USE_OTA_TO_HANDLE_AUDIO = false;
	private AssetBundleManager_Deprecate assetBundleManager;
	private Dictionary<string, Dictionary<string, PlaybackContext> > m_audioClipCache =
				new Dictionary<string, Dictionary<string, PlaybackContext>>();
	private string pathBGM;
	private string nameBGM;
	private AudioClip clipBGM = null;
	private delegate void OnRetrieveAudioAsset( string assetBundleFileName,
	                                           string[] assetNames,
	                                           AssetBundleManager_Deprecate.RetrieveResult result,
	                                           object[] assets,
	                                           float progress );
	private OnRetrieveAudioAsset resultHandler;
	private static int EFFECT_LOAD_PLAYBACK_THRESHOLD = 1;
	private static int CACHE_CLEANUP_THRESHOLD = 8;
	private void onRetrieveAudioAsset( string assetBundleFileName,
	                                  string[] assetNames,
	                                  AssetBundleManager_Deprecate.RetrieveResult result,
	                                      object[] assets,
	                                      float progress )
	{
		switch( result )
		{
		case AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_SUCCEEDED:
			bool isBGM = false;
			if( convertFromAssetBundleKeyToName( pathBGM ) == assetBundleFileName )
			{
				if( assetNames != null )
				{
					if( assetNames.Length == 1 && assetNames[0] == nameBGM )
					{
						// Play the BGM immediately after loading it.
						m_audioClipCache[pathBGM][nameBGM].m_clip = assets[0] as AudioClip;
						musicPlayer.clip = assets[0] as AudioClip;
						musicPlayer.Play();
						isBGM = true;
					}
				}
			}

			if( !isBGM ) // We don't play an effect immediately after loading it.
			{
				string key = TextureMgr.instance().otaPackageNameToType( assetBundleFileName );
				for( int i = 0; i < assetNames.Length; ++i )
				{
					if( assets[i] == null )
						continue;
					string name = assetNames[i];
					m_audioClipCache[key][name].m_clip = assets[i] as AudioClip;
				}
			}
			break;
		case AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_DOWNLOAD_IN_PROGRESS:
			break;
		case AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_NETWORK_ERROR:
			break;
		}
	}
	public void setAssetBundleManager( AssetBundleManager_Deprecate manager )
	{
		assetBundleManager = manager;
	}
	private string convertFromAssetBundleKeyToName( string key )
	{
		if( key == TextureType.AUDIO )
			return "audio.assetbundle";
		else if( key == TextureType.AUDIO_GEAR )
			return "audiogear.assetbundle";
		else if( key == TextureType.AUDIO_HERO )
			return "audiohero.assetbundle";
		else if( key == TextureType.AUDIO_OPENMENU )
			return "audioopenmenu.assetbundle";
		else if( key == TextureType.AUDIO_PVE )
			return "audiopve.assetbundle";
		else if( key == TextureType.AUDIO_SELECTTROOP )
			return "audioselecttroop.assetbundle";
		else if( key == TextureType.AUDIO_WHEELGAME )
			return "audiowheelgame.assetbundle";
		return null;
	}

	private AudioClip loadAudioClipFromCacheOrDownload( string assetName, string assetBundleKey, bool isBGM )
	{
		if( assetName == null || assetBundleKey == null )
		{
			return null;
		}
		// Try to find the audio clip in the cache
		if( m_audioClipCache.ContainsKey( assetBundleKey ) )
		{
			Dictionary<string, PlaybackContext> audioNames = m_audioClipCache[assetBundleKey];
			if( audioNames.ContainsKey( assetName ) )
			{
				if( audioNames[assetName].m_clip == null )
				{
					audioNames[assetName].m_playbackCount++;
				}
				return audioNames[assetName].m_clip;
			}
			else
			{
				audioNames[assetName] = new PlaybackContext();
				audioNames[assetName].m_clip = null;
				audioNames[assetName].m_playbackCount = isBGM ? -1 : 1; // We don't care about the playback count of a BGM
			}
		}
		else
		{
			Dictionary<string, PlaybackContext> audioNames = new Dictionary<string, PlaybackContext>();
			audioNames[assetName] = new PlaybackContext();
			audioNames[assetName].m_clip = null;
			audioNames[assetName].m_playbackCount = isBGM ? -1 : 1;
			m_audioClipCache[assetBundleKey] = audioNames;
		}
		// The clip cannot be found, try to handle it tactically
		if( isBGM )
		{
			if( clipBGM != null ) // A BGM is playing
			{
				// Will play a different BGM
				if( pathBGM != assetBundleKey ||
				   nameBGM != assetName )
				{
					musicPlayer.Stop();
					musicPlayer.clip = null;
					Resources.UnloadUnusedAssets();


				}
			}
			pathBGM = assetBundleKey;
			nameBGM = assetName;

			assetBundleManager.retrieveAsset( nameBGM, convertFromAssetBundleKeyToName( pathBGM ),
			                                 true, resultHandler );
		}
		else // SFX
		{
			onTryToLoadAudioOTA( assetName, assetBundleKey );
		}
		return null;
	}

	private void onTryToLoadAudioOTA( string assetName, string assetBundleKey )
	{
		if( !m_audioClipCache.ContainsKey( assetBundleKey ) )
			return;
		Dictionary< string, PlaybackContext > bundle = m_audioClipCache[assetBundleKey];

		bool willLoad = false;
		foreach( KeyValuePair<string, PlaybackContext> playback in bundle )
		{
			if( playback.Value.m_playbackCount >= EFFECT_LOAD_PLAYBACK_THRESHOLD )
			{
				if( playback.Value.m_clip == null )
				{
					willLoad = true;
					break;
				}
			}
		}
		if( willLoad )
		{

			int i = 0;
			foreach( KeyValuePair<string, PlaybackContext> playback in bundle )
			{
				if( playback.Value.m_clip != null )
					continue;
				i++;
			}
			string[] assetNames = new string[i];
			i = 0;
			foreach( KeyValuePair<string, PlaybackContext> playback in bundle )
			{
				if( playback.Value.m_clip != null )
					continue;
				string name = playback.Key;
				assetNames[i++] = name;
			}
			assetBundleManager.retrieveAssets( assetNames,
			                                 convertFromAssetBundleKeyToName( assetBundleKey ),
			                                 true, resultHandler );
		}
	}

	private void cleanupClipsTactically()
	{
		int maxPlaybackCount = 100000; // Big enough
		PlaybackContext context = null;
		int clipCountInCache = 0;
		foreach( KeyValuePair<string, Dictionary<string, PlaybackContext>> bundle in m_audioClipCache )
		{
			foreach( KeyValuePair<string, PlaybackContext> playback in bundle.Value )
			{
				if( playback.Value.m_clip != null )
				{
					if( playback.Value.m_playbackCount >= 0 )
					{
						if( playback.Value.m_playbackCount < maxPlaybackCount )
						{
							context = playback.Value;
							maxPlaybackCount = playback.Value.m_playbackCount;
						}
					}
					clipCountInCache++;
				}
			}
		}
		if( clipCountInCache < CACHE_CLEANUP_THRESHOLD )
			return;

		if( context != null )
		{
			int i;
			bool isPlaying = false;
			for( i = 0; i < effectPlayer.Length; ++i )
			{
				if( effectPlayer[i].clip == context.m_clip )
				{
					isPlaying = effectPlayer[i].isPlaying;
					if( !isPlaying )
					{
						effectPlayer[i].clip = null;
					}
					break;
				}
			}
			if( !isPlaying )
			{
				context.m_clip = null;
				Resources.UnloadUnusedAssets();
			}
		}
	}


	void Start()
	{
		resultHandler = onRetrieveAudioAsset;
	}

	void Awake()
	{
		if(singleton)
		{
			Destroy (gameObject);
			return;
		}

		AudioListener audioListener = this.GetComponent<AudioListener>();
		if (null != audioListener)
		{
			if (Application.isEditor)
				audioListener.enabled = true;
			else
				audioListener.enabled = false;
		}

		//default is ON
		this.SetMusicEnable(PlayerPrefs.GetInt("GAME_MUSIC",1) == 1);
		this.SetEffectEnable(PlayerPrefs.GetInt("GAME_SFX",1) == 1);

		singleton = this;
		DontDestroyOnLoad(this.transform);
		 _UpdateCoolDown = _PlayCheckCoolDown;
	}

	public float _PlayCheckCoolDown = 0.5f;
	private float _UpdateCoolDown;
	private static float ASSET_BUNDLE_CLEANUP_INTERVAL = 5.0f;
	private float assetBundleCleanupTimer = ASSET_BUNDLE_CLEANUP_INTERVAL;

	void Update()
	{
		_UpdateCoolDown -= Time.deltaTime;
		if (_UpdateCoolDown < 0)
		{
	 		UpdateCanPlayMusic();
		}
		if( USE_OTA_TO_HANDLE_AUDIO )
		{
			assetBundleCleanupTimer -= Time.deltaTime;
			if( assetBundleCleanupTimer <= 0.0f )
			{
				cleanupClipsTactically();
				assetBundleCleanupTimer = ASSET_BUNDLE_CLEANUP_INTERVAL;
			}
		}
	}

	void OnApplicationFocus(bool focus)
	{
		if (focus)
		{
			UpdateCanPlayMusic();
		}
	}

	private float _LastPlayingTime = 0;
	private bool _CanPlayMusic = false;
	public float _PlayDelay = 20;

	private void UpdateCanPlayMusic()
	{
		_UpdateCoolDown = _PlayCheckCoolDown;
		if (NativeCaller.IsOtherMusicPlaying())
		{
		 	_LastPlayingTime = Time.time;
		 	if (_CanPlayMusic)
		 	{
		    	_CanPlayMusic = false;
		    	musicPlayer.Pause();
		  	}
		}
		else
		{
		 	if (!_CanPlayMusic && _LastPlayingTime + _PlayDelay < Time.time)
		 	{
		   		_CanPlayMusic = true;
		  		PlayMusicInner();
		 	}
		}
	}
	/*
	 * OTA type defines in TextureType class:
	 * 
	 * public static string AUDIO = "Audio/";
	 * public static string AUDIO_GEAR = "Audio/Gear/";
	 * public static string AUDIO_HERO = "Audio/Hero/";
	 * public static string AUDIO_OPENMENU = "Audio/OpenMenu/";
	 * public static string AUDIO_PVE = "Audio/Pve/";
	 * public static string AUDIO_SELECTTROOP = "Audio/SelectTroop/";
	 * public static string AUDIO_WHEELGAME = "Audio/WheelGame/";
	 * 
	 * eg:
	 * 
	 * PlayMusic( "KBN_1_EquipGear_v01", true, TextureType.AUDIO_GEAR );
	 * 
	 */
	private string _MusicPath;
	private string _LastOTAType;
	
	public void PlayMusic( string fileName, bool loop, string otaType )
	{
		_MusicPath = fileName;
		musicPlayer.loop = loop;
		_LastOTAType = otaType;
		PlayMusicInner();
	}

	private void PlayMusicInner()
	{
		if (!_CanPlayMusic)
		{
	     	UpdateCanPlayMusic();
	     	return;
	    }

		if(musicPlayer.mute)
			return;
        if(string.IsNullOrEmpty(_MusicPath))
		{
			if( musicPlayer.clip != null)
			{
						musicPlayer.Stop();
						musicPlayer.clip = null;
			}
						return;
		}
		
		if (musicPlayer.clip != null && musicPlayer.clip.name == _MusicPath && musicPlayer.isPlaying)
		{
			return;
		}
		if( !USE_OTA_TO_HANDLE_AUDIO )
		{
			//TextureMgr.instance().UnloadAudio( musicPlayer.clip );
		}
		musicPlayer.clip = TextureMgr.instance().LoadAudio(_MusicPath, _LastOTAType);
		if( USE_OTA_TO_HANDLE_AUDIO )
		{
			if( musicPlayer.clip == null )
			{
				musicPlayer.clip = loadAudioClipFromCacheOrDownload( _MusicPath, _LastOTAType, true );
			}
		}
		musicPlayer.Play();
	}

	public bool IsMusicPlaying()
	{
		return musicPlayer.isPlaying;
	}
	/*
	 * OTA type defines in TextureType class:
	 * 
	 * public static string AUDIO = "Audio/";
	 * public static string AUDIO_GEAR = "Audio/Gear/";
	 * public static string AUDIO_HERO = "Audio/Hero/";
	 * public static string AUDIO_OPENMENU = "Audio/OpenMenu/";
	 * public static string AUDIO_PVE = "Audio/Pve/";
	 * public static string AUDIO_SELECTTROOP = "Audio/SelectTroop/";
	 * public static string AUDIO_WHEELGAME = "Audio/WheelGame/";
	 * 
	 * eg:
	 * 
	 * PlayEffect( "KBN_1_EquipGear_v01", TextureType.AUDIO_GEAR );
	 * 
	 */
	public void PlayEffect(string fileName, string otaType )
	{
		if (effectPlayer.Length <= 0 || effectPlayer[0].mute)
		{
			return;
		}

		if( !USE_OTA_TO_HANDLE_AUDIO )
		{
			if (effectPlayer[currentEffectPlayerIndex].clip != null)
			{
				//TextureMgr.instance().UnloadAudio(effectPlayer[currentEffectPlayerIndex].clip);
			}
		}

		effectPlayer[currentEffectPlayerIndex].clip = TextureMgr.instance().LoadAudio(fileName, otaType );
		if( USE_OTA_TO_HANDLE_AUDIO )
		{
			if( effectPlayer[currentEffectPlayerIndex].clip == null )
			{
				effectPlayer[currentEffectPlayerIndex].clip = loadAudioClipFromCacheOrDownload( fileName, otaType, false );
			}
		}
		effectPlayer[currentEffectPlayerIndex].loop = false;
		effectPlayer[currentEffectPlayerIndex].Play();

		currentEffectPlayerIndex = (currentEffectPlayerIndex + 1) % effectPlayer.Length;
    }

    public void PlaySplashMusic()
	{
		if( musicPlayer.clip != null )
		{
			//TextureMgr.instance().UnloadAudio( musicPlayer.clip);
		}
		PlayMusic("KoCM_Splash_Loop", false, TextureType.AUDIO);
	}

	public void PlayRelativeToGear(string audioName)
	{
		if(_Global.IsLowEndProduct())
		{
			return;
		}

		if ( audioName != null )
		{
			this.PlayEffect(audioName, TextureType.AUDIO_GEAR);
		}
	}

	public void PlayOpenBuildMenu(int buildTypeId)
	{
		string audioName = null;
		switch ( buildTypeId )
		{
		case Constant.Building.PALACE: audioName = "open_castle";break;
		case Constant.Building.FARM: audioName = "open_farm";break;
		case Constant.Building.SAWMILL: audioName = "open_sawmill";break;
		case Constant.Building.QUARRY: audioName = "open_quarry";break;
		case Constant.Building.MINE: audioName = "open_mine";break;
		case Constant.Building.VILLA: audioName = "open_cottage";break;
		case Constant.Building.ACADEMY: audioName = "open_alchemy_lab";break;

		case Constant.Building.GENERALS_QUARTERS: audioName = "open_knights_hall";break;
		case Constant.Building.STOREHOUSE: audioName = "open_storehouse";break;
		case Constant.Building.COLISEUM: audioName = null;break;
		case Constant.Building.RALLY_SPOT: audioName = "open_rally_point";break;
		case Constant.Building.BARRACKS: audioName = null;break;
		case Constant.Building.EMBASSY: audioName = "open_embassy";break;
		//case Constant.Building.COLISEUM: audioName = null;break;
		case Constant.Building.BLACKSMITH: audioName = "open_blacksmith";break;
		case Constant.Building.WORKSHOP: audioName = "open_workshop";break;
		case Constant.Building.WATCH_TOWER: audioName = "open_watchtower";break;
		case Constant.Building.STABLE: audioName = "open_stable";break;
		case Constant.Building.MUSEUM: audioName = null;break;
		case Constant.Building.RELIEF_STATION: audioName = null;break;
		case Constant.Building.WALL: audioName = "open_wall";break;
		case Constant.Building.MARKET: audioName = null;break;
		case Constant.Building.HOSPITAL: audioName = "open_hospital";break;
		}

		if ( audioName != null )
			this.PlayEffect(audioName, TextureType.AUDIO_OPENMENU);
	}

	public void PlaySoundOnSelectTroop(int troopId)
	{
		string audioName = null;
		///*
		//	the name of case is invalid.
		switch ( troopId )
		{
		case Constant.Unit.SUPPLY_DONKEY: audioName = "select_pikeman"; break;
		case Constant.Unit.CONSCRIPT: audioName = "select_wagon";break;
		case 3: audioName = "select_wagon";break;
		case Constant.Unit.LEGIONARY: audioName = "select_calvary";break;
		case Constant.Unit.CENTURION: audioName = "select_militiaman"; break;
		case Constant.Unit.SKIRMISHER: audioName = "select_archer";break;
		case Constant.Unit.CALVARY: audioName = "select_swordsman"; break;
		case Constant.Unit.HEAVY_CALVARY: audioName = "select_calvary"; break;
		case Constant.Unit.SUPPLY_WAGON: audioName = "select_wagon";break;
		case Constant.Unit.SCORPIO: audioName = "select_battering";break;
		case Constant.Unit.BATTERING_RAM: audioName = "select_crossbow";break;
		case Constant.Unit.BALLISTA: audioName = "select_catapult";break;
		case 13: audioName = "select_calvary";break;	//	Constant.Unit.HEAVY_CALVARY
		case 14: audioName = "select_wagon"; break;	//	Siege Towers
		case 15: audioName = "select_ballistae"; break;	//	Fire Ballistae
		case 16: audioName = "select_wagon"; break; // War wagon.
		//case Constant.Unit.int DEFENSIVE_SCORPIO = 53;
		//case Constant.Unit.int DEFENSIVE_BALLISTAE = 55;
		//case Constant.Unit.int TRAPS = 60;
		//case Constant.Unit.int SLING_BULLETS = 61;
		//case Constant.Unit.int SPIKED_BARRIERS = 62;
		}
		//*/
		if ( audioName != null )
			this.PlayEffect(audioName, /*TextureType.AUDIO_SELECTTROOP*/"Audio/SelectTroop/");
	}

	public void SetMusicVolum(float value)
	{
		musicPlayer.volume = value;
	}

	public void SetEffectVolum(float value)
	{
		foreach (AudioSource audioSource in effectPlayer)
		{
			audioSource.volume = value;
		}
	}

	public void SetMusicEnable(bool enable)
	{
		PlayerPrefs.SetInt("GAME_MUSIC",enable ? 1 : 0);

		musicPlayer.mute = !enable;
	    if (enable)
	    {
	    	PlayMusicInner();
	    }
	    else
	    {
	    	musicPlayer.Pause();
	    	musicPlayer.Pause();
	    }
	}

	public void SetEffectEnable(bool enable)
	{
		PlayerPrefs.SetInt("GAME_SFX",enable ? 1 : 0);

		foreach (AudioSource audioSource in effectPlayer)
		{
			audioSource.mute = !enable;
        }
	}

	public void StopMusic()
	{
		_MusicPath = null;
		musicPlayer.Stop();
	}

	public void StopEffect()
	{
	}
}
