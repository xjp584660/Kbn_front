using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public abstract class GameMain : MonoBehaviour
	{


		public	const	int	CITY_SCENCE_LEVEL = 2;
		public	const	int	FIELD_SCENCE_LEVEL = 3;
		public	const	int	WORLD_SCENCE_LEVEL = 4;
		public  const   int CAMPAIGNMAP_SCENE_LEVEL = 5;
		public  const   int CHAPTERMAP_SCENE_LEVEL = 6;
        public  const   int HERO_EXPLORE_LEVEL = 7;
		public  const   int ALLIANCE_BOSS_LEVEL = 8;
		public	const	int AVA_MINIMAP_LEVEL = 9;

		public const int MISTEXPEDITION_LEVEL = 10;/* 迷雾远征 */





		public static bool USE_GHOST_MAP_2_CACHE_TILE_MOTIFS = true;

        public static GameMain singleton { get; protected set; }

		#region Manager Instances
		public AllianceEmblemMgr allianceEmblemMgr { get; protected set; }
		#endregion

        protected HashObject seed;

		public static float horizRatio;
		public static float vertRatio;

        protected static string timeKind;
		protected int	curScenceLevel = 0;
		protected int	m_lastScenceLevel = 0;
		protected GameObject m_CampaignMapObj = null;
		protected GameObject m_ChapterMapObj = null;
		protected static long gameTime;
		protected static double gameDeltaTime;
		protected int m_ServerMergeStep = -1; //
        public bool encrypt = false;

        public abstract void restartGame();
        public abstract void valideProducts(string msg);
        public abstract bool MapIsAutoUpdate();
		public abstract void onInitialAssetBundleListAcquire();
		public abstract int getCurCityId();
		public abstract int getUserId();
		public abstract Vector2 getCurCityCoor(int cityId);
		public abstract void repaintWorldMap();
		public abstract bool IsPushMainchrome ();
		public abstract void toggleShowAVAMarchLineInfo();
		public abstract void setCloudMaskEnabled( bool enabled );
		public abstract MapController getMapController();
		public abstract MapController getMapController2();
		public abstract void onCityMoved( int oldX, int oldY, int newX, int newY );
		public abstract void onAbandonTileOK( int tileId );
		public abstract int getCityIdByCityOrder(int cityOrder);
		public abstract string GetPvpLevelRestrict();

		public abstract void reqWorldMapOk();
		public abstract HashObject GetTileInfoFromSocket(PBMsgMapChange.PBMsgMapChange tileInfo);
		public abstract HashObject GetTileUserInfoFromSocket(PBMsgMapChange.PBMsgMapChange tileInfo);
		public abstract HashObject GetTileAllianceNamesInfoFromSocket(PBMsgMapChange.PBMsgMapChange tileInfo);
		public abstract HashObject GetTileAllianceMightInfoFromSocket(PBMsgMapChange.PBMsgMapChange tileInfo);
		public abstract HashObject GetTileAllianceLeagueInfoFromSocket(PBMsgMapChange.PBMsgMapChange tileInfo);

		public abstract HashObject GetBaseTile(int x,int y);

		public abstract void setLoopCntOfCurMusic(int cnt);
		public abstract void setLastMusicName( string name, string ota);
		public abstract void setCurMusicName( string name, string ota);
		public abstract void Verify(int x,int y);
		public static bool isUpdateSeed=false;
		private Rect screenShotRect=new Rect(60,160,500,580);
		private Texture2D gearShareTexture;


		/* 是否进入到游戏中
         * 当进入游戏中时，状态为 true，重启游戏时状态不变，只有在每次打开游戏时候才会是默认状态 false
		*/
		protected static bool isGameEnter = false;


		public int curSceneLev()
		{
			return curScenceLevel;
		}

		public int LastSceneLevel
		{
			get { return m_lastScenceLevel;}
			set { m_lastScenceLevel = value;}
		}
		public Texture2D GetGearShareTexture()
		{
			 return gearShareTexture;
//			set { gearShareTexture = value;}
		}
		public abstract void forceRepaintWorldMap();
		public abstract void forceRepaintWorldMap2();
		public abstract void seedUpdate(bool marchForceUpdateFlag);
		protected bool m_bTouchForbidden = false;
		public bool TouchForbidden
		{
			get { return m_bTouchForbidden; }
			set { m_bTouchForbidden = value; }
		}

		protected bool m_bForceTouchForbidden = false;
		public bool ForceTouchForbidden
		{
			get { return m_bForceTouchForbidden; }
			set { m_bForceTouchForbidden = value; }
		}


		protected bool m_bNotDrawMenu = false;
		public bool NotDrawMenu
		{
			get { return m_bNotDrawMenu; }
			set { m_bNotDrawMenu = value; }
		}

		protected System.Collections.Generic.List<System.MulticastDelegate>	restartFuncs = new System.Collections.Generic.List<System.MulticastDelegate>();
		public void resgisterRestartFunc(System.MulticastDelegate f)
		{
			restartFuncs.Add(f);
		}

		public Rect ScreenToRelativeRect(Rect _rect)
		{
			Rect returnRect = new Rect();
			
			returnRect.x 	  = _rect.x / GameMain.horizRatio;
			returnRect.width  = _rect.width;
			returnRect.y 	  = _rect.y / GameMain.horizRatio;
			returnRect.height = _rect.height;
			
			return returnRect;			
		}

        public HashObject getSeed()
        {
            return seed;
        }

        public static string getTimeKind()
        {
            return timeKind;
        }

		public static double DeltaTime()
		{
			return	gameDeltaTime;
		}

		public	static	long	unixtime()
		{
			return	gameTime;// + Time.realtimeSinceStartup;
		}	
		public static void adjustUnixtime(long t)
		{
			gameTime = t;
			gameDeltaTime = t;
		}

		private static string m_cachedApplicationPath = null;
		public static string GetApplicationDataSavePath()
		{
			if ( m_cachedApplicationPath == null )
			{
				if( Application.platform ==	RuntimePlatform.IPhonePlayer )
					m_cachedApplicationPath = Application.temporaryCachePath ;	
				else if( Application.platform == RuntimePlatform.Android)
					m_cachedApplicationPath = Application.temporaryCachePath ;
				else
					m_cachedApplicationPath = KBN._Global.ApplicationPersistentDataPath;
			}
			return m_cachedApplicationPath;
		}
		private static string m_Privacy = null;
		public static string GetPrivacyDataSavaPath()
		{
            if (m_Privacy == null)
            {
				m_Privacy = KBN._Global.ApplicationPersistentDataPath + "/Privacy";
			}
			return m_Privacy;
		}

		public int getCitiesNumber()
		{
			Hashtable cities = seed["cities"].Table;
			if(cities != null)
				return cities.Count;
			return 0;
		}

		public abstract System.Collections.IEnumerator onLevelLoaded(int level, GestureController controller);

		//start world map
		public void onReqWorldMap(System.Collections.Generic.List<string> blockNames, System.MulticastDelegate okFunc, System.MulticastDelegate errorFunc){
				MapView.instance().getMoreSlots(blockNames, okFunc, errorFunc);
		}

		// function for ParticalEffectMgr migration, temporary, TODO remove if possible
		public abstract Transform getMapViewControllerTransform(int idx);
		public abstract HashObject GetCityInfo(int cityId);
		public abstract void changeRallyMarchItem(PBMsgMarchInfo.PBMsgMarchInfo march);
		public abstract void checkMySelfRallyMarchIsReturn(System.Collections.Generic.List<PBMsgMarchInfo.PBMsgMarchInfo> marchs);
		public abstract void syncSeedMarch(int cityId, int marchId);
		public abstract void getMarchesInfo();


		/*
		 * =================================================================================================================
		 * 需要缓存的数据，可以减少重复查找seed 的操作，不过需要在 seed 更新的时候同时 更新下
		 * =================================================================================================================
		*/

		/// <summary>
		/// 在 seed 的更新后 ，刷新 缓存的本地数据
		/// </summary>
		public void RefreshLocalCacheData()
		{
			RefreshMonthlyCard();
		}


		/*
		 * =================================================================================================================
		*/


		#region boss

		/// <summary>
		/// 是否是 boss 
		/// </summary>
		/// <param name="x"></param>
		/// <param name="y"></param>
		/// <returns></returns>
		public bool isBoss(string x, string y)
		{
			if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
			{
				object[] tempArray = _Global.GetObjectValues(seed["geEvent"]["events"]);
				if(tempArray.Length > 0)
				{
					HashObject eventItem;
					for(int j=0; j < tempArray.Length; j++)
					{
						eventItem = tempArray[j] as HashObject;
						if(null != eventItem["bossInfo"] && null !=eventItem["bossInfo"]["tiles"])
						{
							object[] bossArray = _Global.GetObjectValues(eventItem["bossInfo"]["tiles"]);
							if(bossArray.Length > 0)
							{
								HashObject bossInfo = bossArray[0] as HashObject;
								if(_Global.GetString(bossInfo["x"]).Equals(x) && _Global.GetString(bossInfo["y"]).Equals(y)) 
									return true;
							}	
						}
					}
				}
			}
			return false;
		}




		/*---------------------------------------- MonthlyCard ----------------------------------------*/
		private bool isHaveMonthlyCard = false;
		/// <summary>
		/// 是否有月卡
		/// </summary>
		/// <returns></returns>
		public bool IsHaveMonthlyCard()
		{
			return isHaveMonthlyCard;
		}

        public void RefreshMonthlyCard()
		{
			isHaveMonthlyCard = seed != null && seed["monthlyCard"] != null && seed["monthlyCard"].ToString() != "";
		}


		/*-----------------------------------------------------------------------------------------------*/



		/// <summary>
		/// 是否开启翻译
		/// </summary>
		/// <returns></returns>
		public bool IsTrans(){
			//return true;
			return seed != null && seed["isTrans"] != null && _Global.GetString(seed["isTrans"]).Equals("1");
		}


		/// <summary>
		/// 是否是新的藏兵
		/// </summary>
		/// <returns></returns>
		public bool IsHideTroopLimitServer(){
			// return false;
			return seed != null && seed["hideTroopQueue"] != null && _Global.INT32(seed["hideTroopQueue"]["isHideTroopLimitServer"]) == 1;
		}



		/// <summary>
		/// 获取藏兵信息
		/// </summary>
		/// <returns></returns>
		public HashObject GetHideTroopData(){
			if(IsHideTroopLimitServer()){
				return seed["hideTroopQueue"];
			}
			return null;
		}

		public int getWorldBossMarchMaxNum()
		{
			int worldBossMarchMaxNum = _Global.INT32(seed["worldBossMarchConfig"]["marchNum"]);
			return worldBossMarchMaxNum;
		}

		public int getWorldBossXMaxNum()
		{
			int worldBossXMaxNum = _Global.INT32(seed["worldBossMarchConfig"]["horseNum"]);
			return worldBossXMaxNum;
		}



		/// <summary>
		/// 是否有世界bos活动
		/// </summary>
		/// <returns></returns>
		public bool IsHaveBossEvent(){
			//ProfilerSample.BeginSample("GameMain.IsHaveBossEvent!!!!!!");
			return IsHaveSeedParam("worldBossEvent")!=null;
			//ProfilerSample.EndSample();	
		}

		/// <summary>
        /// 获得 map 的 md5 值
        /// </summary>
        /// <returns></returns>
		public string GetMapMD5(){
			return seed!=null&&seed["baseTileInfoMd5"]!=null&&seed["baseTileInfoMd5"].Value!=null?seed["baseTileInfoMd5"].Value.ToString():string.Empty;
		}




		/// <summary>
		/// 获取当前世界boss活动id
		/// </summary>
		/// <returns></returns>
		public int GetCurBossEventId(){
			if(IsHaveBossEvent()){
				HashObject eventInfo=IsHaveSeedParam("worldBossEvent");
				return _Global.INT32(eventInfo["eventId"]);
			}
			return 0;
		}



		/// <summary>
		/// 获取活动结束时间
		/// </summary>
		/// <returns></returns>
		public string GetWorldBossEndTime(){
			if(IsHaveRealWorldBoss()){
				long endTime;
				long now=unixtime();
				HashObject eventInfo=IsHaveSeedParam("worldBossEvent");
				endTime=_Global.INT64(eventInfo["endTime"]);
				return _Global.timeFormatStr(endTime - now);
			}
			return "";
		}



		/// <summary>
		/// 世界boss次数
		/// </summary>
		/// <returns></returns>
		public int GetWorldBossCount(){
			return IsHaveSeedParam("worldBossEvent")!=null?_Global.INT32(seed["worldBossEvent"]["marchLimit"]):0;
		}




		/// <summary>
		/// 获取boss速度指数系数
		/// </summary>
		/// <returns></returns>
		public float GetWorldBossSqrt(){
			return IsHaveSeedParam("worldBossEvent")!=null&&
				seed["worldBossEvent"]["speedCutFactor"]!=null?
				_Global.FLOAT(seed["worldBossEvent"]["speedCutFactor"]):0;
		}




		/// <summary>
		/// 是否有世界boos
		/// </summary>
		/// <returns></returns>
		public bool IsHaveRealWorldBoss(){
			if(IsHaveBossEvent()){
//ProfilerSample.BeginSample("GameMain.IsHaveRealWorldBoss!!!!!!");
				long startTime,endTime,rewardEndTime;
				long now=unixtime();
				HashObject eventInfo=IsHaveSeedParam("worldBossEvent");
				startTime=_Global.INT64(eventInfo["startTime"]);
				endTime=_Global.INT64(eventInfo["endTime"]);
				rewardEndTime=_Global.INT64(eventInfo["rewardEndTime"]);

				return now>startTime&&now<endTime;
//ProfilerSample.EndSample();	
			}
			return false;
		}




		/// <summary>
		/// 获取世界boss活动时间信息
		/// </summary>
		/// <returns></returns>
		public string GetWorldBossTimeTip(){
			if(IsHaveBossEvent()){
				long startTime,endTime,rewardEndTime;
				long now=unixtime();
				HashObject eventInfo=IsHaveSeedParam("worldBossEvent");
				startTime=_Global.INT64(eventInfo["startTime"]);
				endTime=_Global.INT64(eventInfo["endTime"]);
				rewardEndTime=_Global.INT64(eventInfo["rewardEndTime"]);

				if(now<startTime){
					return string.Format(Datas.getArString("WorldBoss.Time_Text1"), _Global.timeFormatStr(startTime - now));
				}else if(now<endTime){
					return string.Format(Datas.getArString("WorldBoss.Time_Text2"), _Global.timeFormatStr(endTime - now));
				}else if(now<rewardEndTime){
					return Datas.getArString("WorldBoss.Time_Text3");
				}else{
					return "";
				}
			}else{
				return "";
			}
		}



		/// <summary>
		/// 获取世界boss排行刷新时间
		/// </summary>
		/// <param name="lastTime"></param>
		/// <returns></returns>
		public string GetWorldBossRankLastUpdateTime(long lastTime){

			long now=unixtime();
			if(lastTime!=0){
				// return _Global.timeFormatStr(now - lastTime);
				return _Global.timeFormatExceptDate(lastTime);
			}else{
				return "-";
			}
		}




		/// <summary>
		/// 获取世界boss信息
		/// </summary>
		/// <param name="key"></param>
		/// <returns></returns>
		public HashObject IsHaveSeedParam(string key){
			//ProfilerSample.BeginSample("GameMain.IsHaveSeedParam!!!!!!");
			if(seed!=null&&seed[key]!=null)
			{
				//ProfilerSample.BeginSample("GameMain.IsHaveSeedParam  seed[key].ToString()");
				return seed[key];
				//ProfilerSample.EndSample();	
			}
			else
			{
				return null;
			}
			//ProfilerSample.EndSample();	
		}


		/// <summary>
		/// 获取月卡信息
		/// </summary>
		/// <returns></returns>
		public HashObject GetMonthlyCard(){
			return IsHaveMonthlyCard() ? seed["monthlyCard"] : null;
		}

		public long getBossStartTime()
		{
			if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
			{
				object[] tempArray = _Global.GetObjectValues(seed["geEvent"]["events"]);
				if(tempArray.Length > 0)
				{
					HashObject eventItem;
					for(int j=0; j < tempArray.Length; j++)
					{
						eventItem = tempArray[j] as HashObject;
						if(null != eventItem["bossInfo"] && null != eventItem["bossInfo"]["startTime"])
						{
							return _Global.INT64(eventItem["bossInfo"]["startTime"]);
						}
					}
				}
			}
			return 0;
		}

		/// <summary>
        /// 获得boss结束时间
        /// </summary>
        /// <returns></returns>
		public long getBossEndTime()
		{
			if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
			{
				object[] tempArray = _Global.GetObjectValues(seed["geEvent"]["events"]);
				if(tempArray.Length > 0)
				{
					HashObject eventItem;
					for(int j=0; j < tempArray.Length; j++)
					{
						eventItem = tempArray[j] as HashObject;
						if(null != eventItem["bossInfo"] && null != eventItem["bossInfo"]["endTime"])
						{
							return _Global.INT64(eventItem["bossInfo"]["endTime"]);
						}
					}
				}
			}
			return 0;
		}



		/// <summary>
        /// 获得boss 的攻击数
        /// </summary>
        /// <returns></returns>
		public int getBossAttackCount()
		{
			if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
			{
				object[] tempArray = _Global.GetObjectValues(seed["geEvent"]["events"]);
				if(tempArray.Length > 0)
				{
					HashObject eventItem;
					for(int j=0; j < tempArray.Length; j++)
					{
						eventItem = tempArray[j] as HashObject;
						if(null != eventItem["bossInfo"] && null != eventItem["bossInfo"]["attackcount"])
						{
							return _Global.INT32(eventItem["bossInfo"]["attackcount"]);
						}
					}
				}
			}
			return 0;
		}

		#endregion

		public abstract void loadLevel(int level);
		public abstract int getScenceLevel();
		public abstract void CreateEnergyRecoverAnimation();
		public abstract void UnlockPveNextChapter_Step1();
		public abstract void UnlockPveNextChapter_Step2();
		public abstract void UnlockPveBoss_Step2();
		public abstract void UnlockPveLevel_Step2(int levelSlotId);
		public abstract void UnlockPveLevel_Step3(int levelSlotId);
		public abstract void CreatePveMarchAnimation(long levelId,long marchTime);
		public abstract void SetPveMarchAnimationTime(long levelId,long marchTime);
		public abstract void SetCampaignBossHp(int bossLevelId,int bossChapterId,long curHP,long totalHP);
		public abstract void ChangeCampaignBossToNextLevel(int curLevelID,int nextLevelID);
		public abstract void CreateScreenWhiteAnimation();
		public abstract void PveChapterCheckUnlockLevel();
		//these functions are to solve the problems about cs call js
		public abstract void AddPveMarchToSeed();
		public abstract HashObject GetVipData();
		public abstract int GetVipOrBuffLevel();
		public abstract bool IsVipOpened();
		public abstract bool IsPveBossOpened();

		public abstract void CheckPveGds();
		public abstract void CheckGotoMistExpedition();
		public abstract void CheckExitMistExpedition();
		public abstract void CheckMistExpeditionCloudAnimationOver();
		public abstract int getPlayerLevel();
		public abstract long getPlayerMight();
		public abstract bool IsPveOpened();
		
		public abstract int getChapterID ();
		public abstract void CheckUnlockPveBoss ();

		public abstract void CreateAllianceBossAttackAni();
		public abstract string getUserName();
		public abstract void UpdateAllianceBossSlot(bool isShow);

		public abstract void SendGetMarchList(string centerMapTile);

		public abstract void SetMarchData(object param);
		public abstract bool GetCampaignSettlementSkip();
		public abstract void onPveResultMenuPopUp();
		public int GetPveFteStep()
		{
			if(seed["pveFte"] != null)
			{
				return _Global.INT32(seed["pveFte"]);
			}
			return -1;
		}

		public void SetPveFteStep(int nStep)
		{
			if(seed["pveFte"] != null)
			{
				seed["pveFte"].Value = nStep;
			}
		}

		public int MaxPlayerNameCharactor
		{
			get
			{
				if ( seed == null || seed["maxNameLength"] == null )
					return 15;
				return _Global.INT32(seed["maxNameLength"]);
			}
		}

		public void RestartGameLater(float delay)
		{
			Invoke("restartGame", delay);
		}

		public void SubVipReturnTroopLeftTime()
		{
			int curTimes = _Global.INT32(seed["vip"]["returnTroopLeft"]);
			curTimes = curTimes >= 1 ? (curTimes - 1) : 0;
			seed["vip"]["returnTroopLeft"].Value = curTimes;
		}

		public bool IsHeroElevateOpened()
		{
			return _Global.INT32 (seed ["heroElevateOpened"]) != 0;
		}

		public bool IsHeroSkillLevelUpOpened()
		{
			return _Global.INT32 (seed ["heroSkillLVUpOpened"]) != 0;
		}

		public bool IsServerMergeOpened()
		{
			if(seed ["serverMerge"] != null)
			{
				return _Global.INT32 (seed ["serverMerge"]["isOpened"]) != 0;
			}
			else
			{
				return false;
			}
		}

		public long GetServerMergeStartTime()
		{
			if(seed ["serverMerge"] != null)
			{
				return _Global.INT64 (seed ["serverMerge"]["startTime"]);
			}
			else
			{
				return 0;
			}
		}

		public bool IsWorldMapActivityOpened()
		{
			if(seed ["worldmap"] != null)
			{
				return _Global.INT32 (seed ["worldmap"]["available"]) != 0;
			}
			else
			{
				return false;
			}
		}

		public int ServerMergeStep
		{
			get
			{
				return m_ServerMergeStep;
			}
			protected set
			{
				m_ServerMergeStep = value;
			}
		}

		public string FromServerName 
		{
			get;
			protected set;
		}

		#region Gear
		public int GetGearMaxLevelFromServer()
		{
			if (seed["serverSetting"] != null && seed["serverSetting"]["gearMaxLevel"] != null)
			{
				return _Global.INT32(seed["serverSetting"]["gearMaxLevel"]);
			}
			return 0;
		}
		#endregion
		public	abstract void hideTileInfoPopup();
		public	abstract void hideTileInfoPopup2();

		public abstract void searchWorldMap2(int x, int y);

        protected GdsManager gdsManager;

        public static GdsManager GdsManager
        {
            get
            {
                return singleton.gdsManager;
            }
        }

        protected AvaManager m_AvaManager;

        public static AvaManager Ava
        {
            get
            {
                return singleton.m_AvaManager;
            }
        }

		protected PlayerBuff m_PlayerBuff;
		public static PlayerBuff PlayerBuffs
		{
			get
			{
				return singleton.m_PlayerBuff;
			}
		}

        protected bool m_bNeedCheckString = false;
        protected bool m_bNeedCheckData = false;
        protected bool m_bNeedCheckGDSVersion = false;

        public bool NeedDownloadData
        {
            set
            {
                m_bNeedCheckData = value;
            }
        }

        public abstract void setSearchedTileToHighlight(int x, int y);
        public abstract void gotoMap(int x, int y);
		public abstract void setSearchedTileToHighlight2(int x, int y);
		public abstract void gotoMap2(int x, int y);

        public abstract string getCityNameById(int id);
        public abstract string GetAvatarTextureName(string avatar);

		public abstract bool CheckCampaignLevel();

        protected void CheckReportViewingType(int level)
        {
            if (level == AVA_MINIMAP_LEVEL)
            {
                Message.Instance.ReportViewingType = ReportViewingType.Ava;
            }
            else
            {
                Message.Instance.ReportViewingType = ReportViewingType.Default;
            }
        }

		
		public long GetAllianceMight()
		{
			if (null != seed["allianceMight"])
				return _Global.INT64(seed["allianceMight"]);
			return 0;
		}

		public void GotoAVAMinimap()
		{
			//Start Animatinom
			
			
			//Some Request
			Ava.Units.RequestAvaUnits();
			Ava.Buff.RequestBuffList();
			Ava.March.RequestMarchList();
			Ava.March.RequestIncommingAttackList();
            KBN.Alliance.singleton.reqAllianceInfo();
            Message.Instance.DownloadAvaReports();
			//change scene
			loadLevel(AVA_MINIMAP_LEVEL);
		}

		public bool AvaGlobalChatEnabled()
		{
			if (null != seed && null != seed["avaChatSwitch"])
				return _Global.INT32(seed["avaChatSwitch"]) == 1;
			return false;
		}

		public long AvaGetUserPower()
		{
			if (null != seed && null != seed["userAvAPower"])
				return _Global.INT64(seed["userAvAPower"]);
			return 0;
		}

		public long AvaGetAlliancePower()
		{
			if (null != seed && null != seed["allianceAvAPower"])
				return _Global.INT64(seed["allianceAvAPower"]);
			return 0;
		}

		public int AvaGetMaxDeploymentCountDivisor()
		{
			if (null != seed && null != seed["serverSetting_ava"] && null != seed["serverSetting_ava"]["deployMarchCount"])
				return _Global.INT32(seed["serverSetting_ava"]["deployMarchCount"]);
			return 1;
		}

		public long AvaGetMinDeploymentAllianceMight()
		{
			if (null != seed && null != seed["serverSetting_ava"] && null != seed["serverSetting_ava"]["minAllianceMight"])
				return _Global.INT64(seed["serverSetting_ava"]["minAllianceMight"]);
			return 0;
		}

		public long AvaGetMinDeploymentIndividualMight()
		{
			if (null != seed && null != seed["serverSetting_ava"] && null != seed["serverSetting_ava"]["minIndividualMight"])
				return _Global.INT64(seed["serverSetting_ava"]["minIndividualMight"]);
			return 0;
		}

		public long AvaGetMinProtectPower()
		{
			if (null != seed && null != seed["serverSetting_ava"] && null != seed["serverSetting_ava"]["minProtectPower"])
				return _Global.INT64(seed["serverSetting_ava"]["minProtectPower"]);
			return 0;
		}
        public bool HasAvAReward
        {
            get
            {
                if (seed["hasAvAReward"] != null)
                {
                    return _Global.GetBoolean(seed["hasAvAReward"]);
                }
                return false;
            }
            set
            {
                seed["hasAvAReward"] = new HashObject(value);
            }
        }

		public bool HasSeasonLeagueReward
		{
			get
			{
				if (seed["hasLeagueSeasonReward"] != null)
				{
					return _Global.GetBoolean(seed["hasLeagueSeasonReward"]);
				}
				return false;
			}
			set
			{
				seed["hasLeagueSeasonReward"] = new HashObject(value);
			}
		}

		public int GetAllianceLeague()
		{
			return _Global.INT32 (seed ["leagueLevel"]);
		}

		public int GetAllianceRankInLeague()
		{
			return _Global.INT32 (seed ["leagueRank"]);
		}

		public long SelfSeasonRewardBar()
		{
			return _Global.INT64 (seed ["selfSeasonRewardBar"]);
		}

		public long AllianceSeasonRewardBar()
		{
			return _Global.INT64 (seed ["allianceSeasonRewardBar"]);
		}
		public long GetCombatStats()
		{
			return _Global.INT64 (seed ["combatswitch"]);
		}

		public HashObject GetAvaWeeklyCycle()
		{	
			return seed["avaWeeklyCycle"];
		}

		public HashObject GetGWWonderWeeklyCycle()
		{
			return seed["modeAva"];
		}

		public void SaveGearShareTexture(Rect rect){
			
			//			string imagePath = Datas.singleton.saveScreenShort();
			StartCoroutine(saveShareTexture(rect));
		}

		IEnumerator  saveShareTexture(Rect rec){
			yield return null;
			yield return new WaitForEndOfFrame ();
			gearShareTexture = Datas.singleton.getScreenTexture(rec);
			MenuMgr.instance.sendNotification(Constant.Notice.ShowShareMenu, "");
		}


		public void ShareFBPhoto(){
			StartCoroutine(excuteSharePotho());
		}


		IEnumerator  excuteSharePotho(){
			yield return null;
			string pothoPath = Datas.singleton.saveScreenShort(gearShareTexture);
			yield return new WaitForSeconds(1);
			_Global.Log(pothoPath);
			NativeCaller.SharePhoto(pothoPath);
//			yield return new WaitForSeconds(1);


		}

		public abstract void LoadAVAAnimation();
		public abstract void DestroyAnimation(string name,Transform parentTrans);

		private bool isOnClick=false;
		public bool IsOnClick{
			get{
				return isOnClick;
			}
			set{
				InvokeIsOnClick();
				isOnClick=value;
			}
		}

		private void InvokeIsOnClick(){
			if (IsInvoking("SetIsOnClickFalse")) 
			{
				CancelInvoke("SetIsOnClickFalse");
			}
			Invoke("SetIsOnClickFalse",1f);
		}

		private void SetIsOnClickFalse(){
			isOnClick=false;
		}

		public static bool GetIsShowAVAMarch(){
			return PlayerPrefs.GetInt(GameMain.singleton.getUserId()+"_"+"IsShowAVAMarch",1)==1;
		}

		public static void SetIsShowAVAMarch(bool isShow){
			PlayerPrefs.SetInt(GameMain.singleton.getUserId()+"_"+"IsShowAVAMarch",isShow?1:0);
		}
	}
}
