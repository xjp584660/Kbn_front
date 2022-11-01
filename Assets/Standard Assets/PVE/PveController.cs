using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;

namespace KBN
{
	public class PveController
	{
		const int MAX_PVE_STAMINA = 10;
		const int TIME_PVE_STAMINA = 120;//secends
		const int MAX_LEVEL_STARS = 3;
		const int PVE_MIN_LEVEL = 3;
		const int AllianceBossResultTyp = 4;

		public int curSelecteLevelID
		{
			get;
			set;
		}
		protected static String LAST_CLICK_CHAPTER_ID = "last_click_chapter_id";
		protected static String LAST_CLICK_LEVEL_ID = "last_click_level_id";
		protected static String LAST_WIN_LEVEL_ID = "last_win_level_id";
		protected static String MARCH_LEVEL_ID = "march_level_id";
		protected static String PRE_HIDEN_BOSS_COUNT = "pre_hiden_boss_count";

		protected static PveController singleton = null;
		protected delegate void OKFunc(byte[] result);
		protected OKFunc pveOKFunc = null;

		protected PveTotalData totalData = new PveTotalData ();
		protected PveResultData resulData = new PveResultData ();
		protected PveMarchData marchData = new PveMarchData ();
		//protected List<PveLevelData> levelDataList = new List<PveLevelData> ();
		protected Dictionary<int, PveChapterData> pveChapterDataList = new Dictionary<int, PveChapterData> ();

		private int pveFteStep = 0;

		public bool LevelFlagAnimation 
		{
			get;
			set;
		}
		protected PveLevelData m_FlagAnimationLevelData = new PveLevelData();


		protected Dictionary<int, HidenBossInfo> hidenBossList = new Dictionary<int, HidenBossInfo>();

		public int nextLevelID
		{
			get;
			set;
		}

		public int nextChapterID
		{
			get;
			set;
		}

		public HidenBossInfo nextBossInfo
		{
			get;
			set;
		}

		public int PveType 
		{
			get;
			set;
		}

		public static PveController instance()
		{
			if( singleton == null )
			{
				singleton = new PveController();
				KBN.GameMain.singleton.resgisterRestartFunc(new Action(delegate()
				{
					singleton = null;
				}));
			}
			return singleton as PveController;
		}

		private static void priv_OnGameRestart()
		{
			singleton = null;
		}

		public PveController()
		{
			init ();
		}

		public void init()
		{
			nextLevelID = 0;
			nextChapterID = 0;
			FillHidenBossData ();
			PveType = Constant.PveType.NORMAL;
		}

		public void OnAllianceBossMarchOver()
		{
			OnAllianceBossMarchOver(true);
		}

		public void OnAllianceBossMarchOver(bool updateSeed)
		{
//			ReqAllianceBossMarchResult ();
			marchData.clear ();
			PlayerPrefs.SetInt(MARCH_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);
			if (updateSeed)
				GameMain.singleton.seedUpdate(true);
		}

		public void PveGDSOnReady()
		{
			FillHidenBossData ();
		}

		//req message begin
		public void ReqPveInfo()
		{//request all pve info except top info
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_INFO;
			string url = "pve.php";
			pveOKFunc = OkMsgPveInfo;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null,true); 

			//MenuMgr.instance.PushMenu("PveLoadMenu", null, "trans_immediate");
		}

		public bool isVerifing = false;
		//验证等方法
		public void ReqVerify(Constant.PVE_VERIFY_REQ_Type type,int x=0)
		{//request all pve info except top info
			// VerifyMenu.GetInstance().Close();
			PBMsgReqVerify.PBMsgReqVerify reqMsg = new PBMsgReqVerify.PBMsgReqVerify ();
			reqMsg.type = (int)type;
			reqMsg.x=(int)x;
			string url = "verify.php";
			Action<byte[]> okFunc = delegate( byte[] reqResult ){
				if (reqResult!=null)
				{
					verifyStatus=_Global.DeserializePBMsgFromBytes<PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus> (reqResult);
					if(verifyStatus!=null){
						if (verifyStatus.status==2)
						{
							isVerifing = true;
							if (type==Constant.PVE_VERIFY_REQ_Type.VERIFY)
							{
								ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_2103"));
							}					
							VerifyMenu.GetInstance().SetValue(verifyStatus.x,verifyStatus.y);
						}else if(verifyStatus.status==1)
						{
							isVerifing = false;
							VerifyMenu.GetInstance().Close();
							KBN.UpdateSeed.singleton.update_seed_ajax_Force();
						}

						if (verifyStatus.status==3)
						{
							// verifyStatusLeftTime=verifyStatus!=null?(int)(verifyStatus.unBanTime-GameMain.unixtime()):0;
							// TimeDownContrtoller.GetInstance().SetTime(verifyStatusLeftTime);  //TODO:验证：时间换算
						}
					}
				}
			};
		
			UnityNet.RequestForGPB (url,reqMsg,okFunc,null); 
		}
		//验证回调
		private void verifyCallback(byte[] result){
			if (result!=null)
			{
				verifyStatus=_Global.DeserializePBMsgFromBytes<PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus> (result);
				if(verifyStatus!=null){
					if (verifyStatus.status==2)
					{
						ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_2103"));
						VerifyMenu.GetInstance().SetValue(verifyStatus.x,verifyStatus.y);
					}else
					{
						VerifyMenu.GetInstance().Close();
					}

					if (verifyStatus.status==3)
					{
						// verifyStatusLeftTime=verifyStatus!=null?(int)(verifyStatus.unBanTime-GameMain.unixtime()):0;
						TimeDownContrtoller.GetInstance().SetTime(verifyStatusLeftTime);  //TODO:验证：时间换算
					}
				}
			}
		}

		//timer recover
		public void ReqRefillStamina(int type)
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = type;
			string url = "pve.php";

			pveOKFunc = OkMsgPveStaminaInfoOnTimer;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null,true); 
		}

		//buy or use item
		public void ReqRecoverStamina(int _type)
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			if(totalData.isNew)
			{
				reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_RECOVER_ADVANCED;
			}
			else
			{
				reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_RECOVER_ENERGY;
			}

			string url = "pve.php";
			totalData.reqSaminaType = _type;
			pveOKFunc = OkMsgPveStaminaInfo;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null); 
		}

		public void ReqMarch(Hashtable data)//int levelID,int knightId,int marchID,List<int> armyList)
		{
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(curSelecteLevelID);
			int samina = totalData.isNew ? totalData.advancedEnergy : totalData.samina;
			if(samina < gdsPveLevelInfo.ENERGY)//not enough 
			{
				MenuMgr.instance.PushMenu("RefillStaminaMenu", null, "trans_zoomComp");
				return;
			}
			if(IsHidenBossOver((int)curSelecteLevelID/1000000))
			{
				//MenuMgr.instance.PopMenu("MarchMenu");
				MenuMgr.instance.sendNotification (Constant.Notice.SEND_MARCH,null);
				return;
			}
			marchData.isAllianceBoss = false;

			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_MARCH;
			reqMsg.knightId = _Global.INT32(data["kid"]);
			reqMsg.levelId = curSelecteLevelID;
			reqMsg.cityId = _Global.INT32(data["cid"]);//GameMain.singleton.getCurCityId ();
			reqMsg.marchId = _Global.INT32(data["mid"]);//March.instance().getMarchId(reqMsg.cityId);

			marchData.cityID = _Global.INT32(data["cid"]);
			marchData.knightId = _Global.INT32(data["kid"]);

			reqMsg.units.Clear ();
			marchData.units.Clear ();
			marchData.marchHeroList.Clear ();

			int maxTroopType = 30;
			//hero
			foreach (DictionaryEntry hashItem in data)
			{
				if(hashItem.Key.ToString().StartsWith("h") && _Global.INT32(hashItem.Value.ToString())==1 )
				{
					long heroID = _Global.INT32(hashItem.Key.ToString().Substring(1));
					reqMsg.heroId.Add(heroID);
					marchData.marchHeroList.Add(heroID);
				}
				else if(hashItem.Key.ToString().StartsWith("u") )
				{
					int typeID = _Global.INT32(hashItem.Key.ToString().Substring(1));
					if(typeID>maxTroopType)
						maxTroopType = typeID;
				}
			}

			//army 
			for(int i=1; i <= maxTroopType; i++)
			{
				//				data.ContainsKey("u"+i)?(reqMsg.units).Add((int)data["u"+i]):(reqMsg.units).Add(0);
				if(data.ContainsKey("u"+i))
				{
					reqMsg.units.Add(_Global.INT32(data["u"+i]));
					marchData.units.Add(_Global.INT32(data["u"+i]));
				}
				else
				{
					reqMsg.units.Add(0);
					marchData.units.Add(0);
				}
			}

			if (null != data["buffItems"]) 
			{
				string[] arr = (data["buffItems"] as string).Split(',');
				for (int i = 0; i < arr.Length; i++)
				{
					reqMsg.buffItemId.Add(_Global.INT32(arr[i]));
				}
			}

			string url = "pve.php";
			pveOKFunc = OkMsgPveMarchInfo;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null); 
		}

		public void ReqMarchAllianceBoss(Hashtable data, int levelID, int layer)
		{
			curSelecteLevelID = levelID;
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(curSelecteLevelID);
			// 目前都用samina体力
			//int samina = totalData.isNew ? totalData.advancedEnergy : totalData.samina;
			if(totalData.samina < gdsPveLevelInfo.ENERGY)//not enough 
			{
				MenuMgr.instance.PushMenu("RefillStaminaMenu", null, "trans_zoomComp");
				return;
			}

			if(IsHidenBossOver((int)curSelecteLevelID/1000000))
			{
				//MenuMgr.instance.PopMenu("MarchMenu");
				MenuMgr.instance.sendNotification (Constant.Notice.SEND_MARCH,null);
				return;
			}
			marchData.isAllianceBoss = true;
			
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_MARCH_ALLIANCEBOSS;
			reqMsg.levelId = curSelecteLevelID;
			reqMsg.knightId = _Global.INT32(data["kid"]);
			reqMsg.cityId = _Global.INT32(data["cid"]);//GameMain.singleton.getCurCityId ();
			reqMsg.marchId = _Global.INT32(data["mid"]);//March.instance().getMarchId(reqMsg.cityId);
			reqMsg.layerId = layer;
			marchData.cityID = _Global.INT32(data["cid"]);
			marchData.knightId = _Global.INT32(data["kid"]);
			
			reqMsg.units.Clear ();
			marchData.units.Clear ();
			marchData.marchHeroList.Clear ();
			
			int maxTroopType = 30;
			//hero
			foreach (DictionaryEntry hashItem in data)
			{
				if(hashItem.Key.ToString().StartsWith("h") && _Global.INT32(hashItem.Value.ToString())==1 )
				{
					long heroID = _Global.INT32(hashItem.Key.ToString().Substring(1));
					reqMsg.heroId.Add(heroID);
					marchData.marchHeroList.Add(heroID);
				}
				else if(hashItem.Key.ToString().StartsWith("u") )
				{
					int typeID = _Global.INT32(hashItem.Key.ToString().Substring(1));
					if(typeID>maxTroopType)
						maxTroopType = typeID;
				}
			}
			
			//army 
			for(int i=1; i <= maxTroopType; i++)
			{
				//				data.ContainsKey("u"+i)?(reqMsg.units).Add((int)data["u"+i]):(reqMsg.units).Add(0);
				if(data.ContainsKey("u"+i))
				{
					reqMsg.units.Add(_Global.INT32(data["u"+i]));
					marchData.units.Add(_Global.INT32(data["u"+i]));
				}
				else
				{
					reqMsg.units.Add(0);
					marchData.units.Add(0);
				}
			}

			if (null != data["buffItems"]) 
			{
				string[] arr = (data["buffItems"] as string).Split(',');
				for (int i = 0; i < arr.Length; i++)
				{
					reqMsg.buffItemId.Add(_Global.INT32(arr[i]));
				}
			}

			string url = "pveAllianceBoss.php";
			pveOKFunc = OkMsgAllianceBossMarchInfo;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc, new Action<string, string, string>(FailMsgAllianceBossMarchInfo)); 
		}

		public void SetMarchEndTime(long time)
		{
			marchData.marchEndTime = time;
			if(marchData.marchEndTime <= GameMain.unixtime ())
				marchData.marchEndTime = GameMain.unixtime ();
			MenuMgr.instance.sendNotification(Constant.Notice.PVE_SPEED_MARCH_OK,null);
			GameMain.singleton.SetPveMarchAnimationTime (marchData.levelID,marchData.marchEndTime - GameMain.unixtime ());
		}

		public void ReqMarchResul()
		{
			// if (verifyStatus.status==1)  //普通战斗
			// {
				PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
				reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_MARCH_RESULT;//(int)REQ_Type.REQ_Type_MARCH;
				reqMsg.cityId = GameMain.singleton.getCurCityId ();
				reqMsg.levelId = marchData.levelID;

				string url = "pve.php";
				pveOKFunc = OkMsgPveResultInfo;
				UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null);
			// }else if (verifyStatus.status==2)   //验证
			// {
			// 	Verify();
			// }else if (verifyStatus.status==3)   //等待验证，倒计时
			// {
			// 	WaitVerify();
			// }
			 
		}

		//验证
		public void Verify(){  //TODO: 验证：作弊验证方法
			GameMain.singleton.Verify(verifyStatus.x,verifyStatus.y);
		}
		public void WaitVerify(){ //TODO:验证：更新字符串
			//弹出提示
			ErrorMgr.singleton.PushError("",Datas.getArString("Error.err_2102"));
		}

		public void ReqAllianceBossMarchResult()
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_MARCH_RESULT_ALLIANCEBOSS;//(int)REQ_Type.REQ_Type_MARCH;
			reqMsg.cityId = GameMain.singleton.getCurCityId ();
			reqMsg.levelId = marchData.levelID;
			
			string url = "pveAllianceBoss.php";
			pveOKFunc = OkMsgPveResultInfo;
			UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null); 
		}
		//req message end

		//ok function begin
		private void OkMsgPveInfo(byte[] result)
		{
			if (MenuMgr.instance.getMenu("PveMainChromMenu") == null)
			{
				MenuMgr.instance.SwitchMenu ("MainChrom",null);
				MenuMgr.instance.PushMenu("PveMainChromMenu", null, "trans_immediate");
			}

			PBMsgPveInfo.PBMsgPveInfo msgPve  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveInfo.PBMsgPveInfo> (result);

			//totalData.totalScore = msgPve.totalScore;
			//totalData.totalStar = msgPve.totalStars;
			totalData.totalScore = 0;
			totalData.totalStar = 0;
			pveChapterDataList.Clear ();

			if (msgPve.marchInfoSpecified) {
				PBMsgPveMarchInfo.PBMsgPveMarchInfo msgMarch  = 
					_Global.DeserializePBMsgFromBytes<PBMsgPveMarchInfo.PBMsgPveMarchInfo> (msgPve.marchInfo);
				SetMarchInfo (msgMarch);
				
			} 
			else
				marchData.clear ();

			if(msgPve.staminaInfoSpecified)
			{
				PBMsgPveStaminaInfo.PBMsgPveStaminaInfo msgStamina  = 
					_Global.DeserializePBMsgFromBytes<PBMsgPveStaminaInfo.PBMsgPveStaminaInfo> (msgPve.staminaInfo);
				SetPveStamina (msgStamina);
			}

			if(msgPve.levelInfo!=null)
			{
				foreach(PBMsgPveInfo.PBMsgPveInfo.PBMsgPveLevelInfo levelInfo in msgPve.levelInfo)
				{
					PveLevelData pveLevelData = new PveLevelData();
					pveLevelData.levelID				= levelInfo.levelID;
					pveLevelData.highestScore			= levelInfo.highestScore;
					pveLevelData.highestStar			= levelInfo.highestStar;
					pveLevelData.highestSpeed			= levelInfo.highestSpeed;
					pveLevelData.highestVitality		= levelInfo.highestVitality;
					pveLevelData.highestTactics			= levelInfo.highestTactics;
					pveLevelData.lastScore				= levelInfo.lastScore;
					pveLevelData.lastStar				= levelInfo.lastStar;
					pveLevelData.lastSpeed				= levelInfo.lastSpeed;
					pveLevelData.lastVitality			= levelInfo.lastVitality;
					pveLevelData.lastTactics			= levelInfo.lastTactics;
					pveLevelData.attackNum				= levelInfo.attackNum;
					pveLevelData.attackNumPerDay		= levelInfo.attackNumPerDay;
					AddLevelData(pveLevelData);
				}
		
			}

			if(msgPve.resultInfoSpecified)
			{
				OkMsgPveResultInfo(msgPve.resultInfo);
			}
			
			if(msgPve.hidenBossInfo!=null)
			{
				foreach(PBMsgPveInfo.PBMsgPveInfo.PBMsgPveHidenBossInfo hidenBossPB in msgPve.hidenBossInfo)
				{
					int curChapterID = hidenBossPB.levelID/1000000;
					if(hidenBossList.ContainsKey(curChapterID))
					{
						hidenBossList[curChapterID].chapterID		= curChapterID;
						hidenBossList[curChapterID].curLevelID		= hidenBossPB.levelID;
						hidenBossList[curChapterID].endTime			= hidenBossPB.activeTime;
						hidenBossList[curChapterID].curHP			= hidenBossPB.curHP;
						hidenBossList[curChapterID].totalHP			= hidenBossPB.totalHP;
					}
				}
			}

			if(msgPve.sourceBossinfo!=null)
			{
				foreach(PBMsgPveInfo.PBMsgPveInfo.PBMsgPveSourceInfo sourceBossPB in msgPve.sourceBossinfo)
				{
					int curChapterID = sourceBossPB.levelID/1000000;
					if(hidenBossList.ContainsKey(curChapterID))
					{
						hidenBossList[curChapterID].chapterID		= curChapterID;
						hidenBossList[curChapterID].curLevelID		= sourceBossPB.levelID;
						hidenBossList[curChapterID].curHP			= sourceBossPB.curHP;
						hidenBossList[curChapterID].totalHP			= sourceBossPB.totalHP;
						hidenBossList[curChapterID].endTime			= sourceBossPB.activeTime;
					}
				}
			}

			// if (msgPve.verifyStatusSpecified)
			// {
			// 	SetVerifyStatus(msgPve.verifyStatus);
			// }

			AllianceBossController.instance().endTime = msgPve.allianceBossEndTime;

			GameMain.singleton.loadLevel(GameMain.CAMPAIGNMAP_SCENE_LEVEL);

		}

		private void OkMsgPveStaminaInfo(byte[] result)
		{

			PBMsgPveStaminaInfo.PBMsgPveStaminaInfo msgStamina  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveStaminaInfo.PBMsgPveStaminaInfo> (result);
			int preItemID = totalData.itemID;
			int preGem = totalData.gem;

			if(totalData.isNew)
			{
				preItemID = totalData.advancedItemId;
				preGem = totalData.advancedItemPrice;
			}

//			if (msgStamina.energy == msgStamina.maxEnergy) 
//			{
				GameMain.singleton.CreateEnergyRecoverAnimation();
				if(totalData.reqSaminaType == 2 || totalData.reqSaminaType == 8)
				{
					MyItems.singleton.subtractItem(preItemID);
				}
				else if(totalData.reqSaminaType == 3 || totalData.reqSaminaType == 9 )
				{
					Payment.singleton.SubtractGems(preGem);
				}
				totalData.reqSaminaType = 0;
//			}

			SetPveStamina (msgStamina);
		}

		private void OkMsgPveStaminaInfoOnTimer(byte[] result)
		{
			PBMsgPveStaminaInfo.PBMsgPveStaminaInfo msgStamina  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveStaminaInfo.PBMsgPveStaminaInfo> (result);
			SetPveStamina (msgStamina);
		}

		private void OkMsgPveMarchInfo(byte[] result)
		{
			SoundMgr.instance().PlayEffect( "start_march", TextureType.AUDIO);
			PBMsgPveMarchInfo.PBMsgPveMarchInfo msgMarch  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveMarchInfo.PBMsgPveMarchInfo> (result);
			SetMarchInfo (msgMarch);
			if (null != msgMarch.buffItemId && msgMarch.buffItemId.Count > 0)
			{
				for (int i = 0; i < msgMarch.buffItemId.Count; i++)
				{
					int id = msgMarch.buffItemId[i];
					if (id > 0)
						MyItems.singleton.subtractItem(id);
				}
			}
			GameMain.singleton.AddPveMarchToSeed ();
			GameMain.singleton.SubVipReturnTroopLeftTime ();
			MenuMgr.instance.sendNotification (Constant.Notice.PVE_UPDATE_MARCH_DATA,"start");
		}

		private void OkMsgAllianceBossMarchInfo(byte[] result)
		{
			if(result!=null)
				OkMsgPveMarchInfo (result);
			else
			{
				OnAllianceBossMarchOver();
				AllianceBossController.instance().OnMarchError();
			}
		}

		private void FailMsgAllianceBossMarchInfo(string msg, string code, string feedback)
		{
			OnAllianceBossMarchOver();
			AllianceBossController.instance().OnMarchError();

			string errorMsg = UnityNet.localError(code, msg, feedback);
			if (errorMsg != null)
			{
				ErrorMgr.singleton.PushError("", errorMsg, true, "", null);
			}
		}

		private void OkMsgPveResultInfo(byte[] result)
		{
			PBMsgPveResultInfo.PBMsgPveResultInfo msgResult  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveResultInfo.PBMsgPveResultInfo> (result);
			if(msgResult.incrementBuffSpecified)
				marchData.isAllianceBoss = true;
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(msgResult.levelID);
			resulData.levelID				= msgResult.levelID;
			int chapterID = msgResult.levelID / 1000000;
			if(marchData.isAllianceBoss)
			{
				resulData.type				= AllianceBossResultTyp;
				AllianceBossController.instance().curBossHp			= msgResult.bossCurHP;
				AllianceBossController.instance().totalBossHp		= msgResult.bossTotalHP;
				AllianceBossController.instance().nextBossTotalHP	= msgResult.nextBossTotalHP;
				AllianceBossController.instance().nextBossCurHP		= msgResult.nextBossCurHP;
				AllianceBossController.instance().buff				= msgResult.totalBuff;
//				AllianceBossController.instance().leftAttackNum		= msgResult.attackNum;
				AllianceBossController.instance().curDamage			= msgResult.score;
			}
			else
			{
				DataTable.PveChapter gdsPveChapterInfo = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItemById(chapterID);
				resulData.type				= gdsPveChapterInfo.TYPE;
			}

			resulData.score					= msgResult.score;
			resulData.star					= msgResult.star;
			resulData.speed					= msgResult.speed;
			resulData.vitality				= msgResult.vitality;
			resulData.tactics				= msgResult.tactics;

			resulData.isFirstWin			= msgResult.isFirstWin;
//			resulData.isFirstWin			= true;
			if (gdsPveLevelInfo != null) 
			{
				resulData.gold				= gdsPveLevelInfo.REWARD_GOLD;
				resulData.food				= gdsPveLevelInfo.REWARD_FOOD;
				resulData.wood				= gdsPveLevelInfo.REWARD_WOOD;
				resulData.stone				= gdsPveLevelInfo.REWARD_STONE;
				resulData.ore				= gdsPveLevelInfo.REWARD_ORE;
				resulData.unlockHeroID		= gdsPveLevelInfo.UNLOCK_HERO_ID;
				DataTable.HeroBasic heroItem = GameMain.GdsManager.GetGds<GDS_HeroBasic>().GetItemById(resulData.unlockHeroID);
				if(heroItem==null)
					resulData.unlockHeroID=0;
			}

			if (msgResult.isFirstWin && msgResult.heroInfoSpecified) 
			{
				HeroManager.Instance.AddPVEHero(msgResult.heroInfo);
			}

			resulData.isNewrecord			= msgResult.isHighest;

			resulData.itemList				= new ArrayList(msgResult.item.ToArray()); 

			if(msgResult.levelID == marchData.levelID)
			{
				for (int i=0; i<msgResult.item.Count; i++) {
					//because we can not call js functions ,so we put this code into GameMain
//					MyItems.singleton.AddItem(msgResult.item[i]);
					MyItems.singleton.AddItemWithCheckDropGear(msgResult.item[i], 1);
				}
			}

			resulData.incrementBuff			= msgResult.incrementBuff;
			resulData.totalBuff				= msgResult.totalBuff;
			resulData.damageRank			= msgResult.damageRank;
			resulData.normalAttackNumPerWeek = msgResult.normalAttackNumPerWeek;
			//store this level data
			PveLevelData pveLevelData = new PveLevelData();

			pveLevelData.levelID			= resulData.levelID;
			pveLevelData.lastScore			= resulData.score;
			pveLevelData.lastStar			= resulData.star;
			pveLevelData.lastSpeed			= resulData.speed;
			pveLevelData.lastTactics		= resulData.tactics;
			pveLevelData.lastVitality		= resulData.vitality;


			pveLevelData.highestScore		= resulData.score;
			pveLevelData.highestStar		= resulData.star;
			pveLevelData.highestSpeed		= resulData.speed;
			pveLevelData.highestVitality	= resulData.vitality;
			pveLevelData.highestTactics		= resulData.tactics;
			pveLevelData.bossRenascenceTime = msgResult.activeTime;
			if (msgResult.bossCurHPSpecified && msgResult.bossTotalHPSpecified) 
			{
				pveLevelData.bossCurHP			= msgResult.bossCurHP;
				pveLevelData.bossTotalHP		= msgResult.bossTotalHP;

			}
			if(msgResult.nextLevelIDSpecified)
			{
				pveLevelData.bossNextLevelID = msgResult.nextLevelID;
			}
			pveLevelData.attackNum			= msgResult.attackNum;
			pveLevelData.attackNumPerDay = msgResult.attackNumPerDay;

			// if (msgResult.verifyStatusSpecified)
			// {
			// 	SetVerifyStatus(msgResult.verifyStatus);
			// }

			//set data for animation
			PveLevelData curLevelData = FindLeveData (resulData.levelID);
			SetFlagAnimationLevelData (curLevelData,pveLevelData);
			AddLevelData(pveLevelData);

			MenuMgr.instance.PopMenu("BossMenu");

			int curMarchLevelID = PlayerPrefs.GetInt (MARCH_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(), 0);
			if (curMarchLevelID > 0 && curMarchLevelID == msgResult.levelID) 
			{
				MenuMgr.instance.PopMenu("SpeedUpMenu");
				if(marchData.isAllianceBoss)
				{
					AllianceBossController.instance().OnAllianceBossAttack();
				}
				else
				{
					if(!GameMain.singleton.GetCampaignSettlementSkip())
					{
						MenuMgr.instance.PushMenu("PveResultMenu",null,"trans_down" );
					}
					else
					{
						CampaignSettlementSkip();
					}				
				}
				PlayerPrefs.SetInt(MARCH_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);
			}
			marchData.clear ();
			GameMain.singleton.seedUpdate(true);
		}

		private void CampaignSettlementSkip()
		{
			PveLevelInfo levelData = GetPveLevelInfo(resulData.levelID);
			if(resulData.star <= 0)
			{
				if(levelData.failStoryID > 0)
				{
					HashObject hash = new HashObject();
					hash["storyID"] = new HashObject();
					hash["storyID"].Value = "" + levelData.failStoryID;
					hash["heroID"] = new HashObject();
					hash["heroID"].Value = "0";
					hash["chapterID"] = new HashObject();
					hash["chapterID"].Value = "0";
					MenuMgr.instance.PushMenu("StoryMenu",hash,"trans_immediate" );
				}
			}
			else 
			{
				if(resulData.isFirstWin)//the first
				{
					int chapterID = resulData.levelID/1000000;
					
					int lastLevelID  = GetLastLevelID(chapterID);
					if(lastLevelID != resulData.levelID || levelData.type != Constant.PveType.NORMAL && levelData.type != Constant.PveType.ELITE)
						chapterID = 0;
					
					bool flg = true;
					if(levelData.successStoryID > 0)
					{
						HashObject hash2 = new HashObject();
						hash2["storyID"] = new HashObject();
						hash2["storyID"].Value = "" + levelData.successStoryID;
						hash2["heroID"] = new HashObject();
						hash2["heroID"].Value = "" + resulData.unlockHeroID;
						hash2["chapterID"] = new HashObject();
						hash2["chapterID"].Value = "" + chapterID;
						hash2["isWin"] = new HashObject();
						hash2["isWin"].Value = true;
						MenuMgr.instance.PushMenu("StoryMenu",hash2,"trans_immediate" );
						flg = false;
					}
					else if(resulData.unlockHeroID > 0)
					{
						HashObject hash3 = new HashObject();
						hash3["heroID"] = new HashObject();
						hash3["heroID"].Value = "" + resulData.unlockHeroID;
						hash3["chapterID"] = new HashObject();
						hash3["chapterID"].Value = "" + chapterID;
						hash3["isWin"] = new HashObject();
						hash3["isWin"].Value = true;
						MenuMgr.instance.PushMenu("UnlockHeroMenu", hash3, "trans_zoomComp");
						flg = false;
					}
					else if(chapterID > 0)//chapter
					{
						HashObject hash4 = new HashObject();
						hash4["chapterID"] = new HashObject();
						hash4["chapterID"].Value = "" + chapterID;
						hash4["isWin"] = new HashObject();
						hash4["isWin"].Value = true;
						MenuMgr.instance.PushMenu("LevelupMenu", hash4, "trans_zoomComp");
						PushUnlockEliteChapterMsg(chapterID);
						flg = false;
					}
					
					if(flg)
					{
						CheckUnlockNext();
						GameMain.singleton.onPveResultMenuPopUp();
					}
				}
				else
				{
					CheckUnlockNext();
					GameMain.singleton.onPveResultMenuPopUp();
				}
			}
		}

		///设置验证状态
		private void SetVerifyStatus(byte[] result){
			if (result!=null)
			{
				verifyStatus=_Global.DeserializePBMsgFromBytes<PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus> (result);
				if (verifyStatus.status==3)
				{
					// verifyStatusLeftTime=verifyStatus!=null?(int)(verifyStatus.unBanTime-GameMain.unixtime()):0;
					TimeDownContrtoller.GetInstance().SetTime(verifyStatusLeftTime);  //TODO:验证：时间换算
				}
			}
		}

		private PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus verifyStatus;
		public PBMsgVerifyPlayerStatus.PBMsgVerifyPlayerStatus VerifyStatus{
			get{
				if (verifyStatus==null)
				{
					verifyStatus.status=1;
				}
				return verifyStatus;
			}
		}
		private int verifyStatusLeftTime;
		public int VerifyStatusLeftTime{
			get{
				if (verifyStatus!=null)
				{
					// return verifyStatus.unBanTime;
				}
				return 0;
			}
		}


		//ok function end
		private void SetMarchInfo(PBMsgPveMarchInfo.PBMsgPveMarchInfo msgMarch)
		{	
			marchData.marchID = msgMarch.marchID;
			marchData.levelID = msgMarch.levelID;
			marchData.marchTime = msgMarch.marchBeginTime;
			//totalData.saminaTime = 
			GameMain.adjustUnixtime(msgMarch.curTime);
			
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(marchData.levelID);
			
			marchData.marchEndTime = msgMarch.marchTime;
			if(totalData.isNew)
			{
				int tempAdvancedTnery = totalData.advancedEnergy;
				totalData.advancedEnergy -= gdsPveLevelInfo.ENERGY;
				int tempAdvancedTnery1 = totalData.advancedEnergy;
				if(tempAdvancedTnery >= totalData.maxEnergy && tempAdvancedTnery1 < totalData.maxEnergy)
				{
					totalData.advancedTime = msgMarch.marchBeginTime;
				}
			}
			else
			{
				int tempSamina = totalData.samina;
				totalData.samina -= gdsPveLevelInfo.ENERGY;	
				int tempSamina1 = totalData.samina;		
				if(tempSamina >= totalData.maxEnergy && tempSamina1 < totalData.maxEnergy)
				{
					totalData.saminaTime = msgMarch.marchBeginTime;
				}
			}
			
            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Pve, gdsPveLevelInfo.ENERGY);
			marchData.needRequest = true;
			
			for (int i=0; i<marchData.marchHeroList.Count; i++) {
				HeroManager.Instance.SetHeroMarchStatus(marchData.marchHeroList[i]);
			}
			
			MenuMgr.instance.sendNotification (Constant.Notice.UPDATE_PVE_STAMINA,null);
			
			PlayerPrefs.SetInt(MARCH_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),msgMarch.levelID);
			
			if (msgMarch.hidenBossLevelIDSpecified) 
			{
				int chapterID = msgMarch.hidenBossLevelID/1000000;
				if(hidenBossList.ContainsKey(chapterID))
				{
					hidenBossList[chapterID].curLevelID		= msgMarch.hidenBossLevelID;
					KBN.DataTable.PveChapter item = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItemById (chapterID);
					hidenBossList[chapterID].endTime		= msgMarch.marchBeginTime +item.ACTIVE_DURATION;
					hidenBossList[chapterID].curHP = msgMarch.bossCurHP;
					hidenBossList[chapterID].totalHP = msgMarch.bossTotalHP;
					
					nextBossInfo = hidenBossList[chapterID];
					//toast
					string strMsg = Datas.getArString("Campaign.HiddenBossActive_Desc");
					string bossName = Datas.getArString(nextBossInfo.bossName);
					strMsg = string.Format(strMsg,bossName);
					MenuMgr.instance.PushMessage(strMsg);

					//for active boss after attack boss
					GameMain.singleton.CheckUnlockPveBoss();
				}
			}
			
			MenuMgr.instance.sendNotification (Constant.Notice.PVE_MARCH_BEGIN,null);
			
			//for pve march animation
			GameMain.singleton.CreatePveMarchAnimation (marchData.levelID,marchData.marchEndTime - GameMain.unixtime());
			
			//			GameMain.singleton.seedUpdate(true);
		}	

		public void SetPveStamina(PBMsgPveStaminaInfo.PBMsgPveStaminaInfo msgStamina)
		{
			totalData.samina		= msgStamina.energy;
			totalData.saminaTime	= msgStamina.time;
			
			totalData.maxEnergy		= msgStamina.maxEnergy;
			totalData.recoverTime	= msgStamina.recoverTime;

			totalData.itemID		= msgStamina.itemID;
			totalData.gem			= msgStamina.gem;
			totalData.needRequest	= true;
			totalData.leftBuyNum	= msgStamina.leftBuyNum;

			totalData.advancedEnergy = msgStamina.advancedEnergy;
			totalData.advancedItemPrice = msgStamina.advancedItemPrice;
			totalData.advancedItemLeftBuyNum = msgStamina.advancedItemLeftBuyNum;
			totalData.advancedTime = msgStamina.advancedTime;

			// _Global.LogWarning("PveController.SetPveStamina  samina : " + totalData.samina + " advancedEnergy : " + totalData.advancedEnergy 
			//                    + " advancedItemLeftBuyNum : " + totalData.advancedItemLeftBuyNum + " Gems : " + totalData.advancedItemPrice
			// 				   + "advancedTime : " + totalData.advancedTime);
			MenuMgr.instance.sendNotification (Constant.Notice.UPDATE_PVE_STAMINA,null);
		}

		public bool GetPveTotalIsNew()
		{
			return totalData.isNew;
		}

		public void SetPveTotalIsNew(bool isNew)
		{
			totalData.isNew = isNew;
		}

		public int GetSimina()
		{
			return totalData.isNew ? totalData.advancedEnergy : totalData.samina;
		}

		//get info function for ui begin
		public List<BossTroopInfo> GetBossTroopInfo(int _levelID, int _factor)
		{
			//PveLevelInfo
			List<BossTroopInfo> listBossTroop = new List<BossTroopInfo> ();
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(_levelID);
			if(gdsPveLevelInfo!=null)
			{
				DataTable.PveBoss gdsPveBossInfo = GameMain.GdsManager.GetGds<GDS_PveBoss>().GetItemById (gdsPveLevelInfo.BOSS_ID);
				if(gdsPveBossInfo!=null)
				{
					string [] columns = gdsPveBossInfo.UINT.Split ('*');
					for(int i=0;i<columns.Length;i++)
					{
						int nCount = _Global.INT32(columns[i]);
						if(nCount > 0)
						{
							listBossTroop.Add(new BossTroopInfo(i+1, (long)nCount*_factor/100));
						}
							
					}
				}
			}
			return listBossTroop;
		}

		public PveLevelInfo GetPveLevelInfo(int _levelID)
		{
			//PveLevelInfo
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(_levelID);
			PveLevelData pveLevelData = FindLeveData (_levelID);

			int chapterID = _levelID / 1000000;
			DataTable.PveChapter gdsPveChapterInfo = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItemById(chapterID);

			if(gdsPveLevelInfo==null || gdsPveChapterInfo==null)
			{
#if UNITY_EDITOR
				if(gdsPveLevelInfo == null)
					Debug.LogWarning(string.Format("<color=#FF5151FF>GDS_PveLevel 表中无法找到 id {0}，请检测该表数据以及该 id 对应的数据！！！！！ </color>", _levelID));
				else
					Debug.LogWarning(string.Format("<color=#FF5151FF>GDS_PveChapter 表中无法找到 id {0}，请检测该表数据以及该 id 对应的数据！！！！！ </color", _levelID));

#endif
				return null;
			}

			DataTable.PveBoss gdsPveBossInfo = GameMain.GdsManager.GetGds<GDS_PveBoss>().GetItemById (gdsPveLevelInfo.BOSS_ID);
			DataTable.PveDrop gdsPveDropInfo = GameMain.GdsManager.GetGds<GDS_PveDrop>().GetItemById (gdsPveLevelInfo.DROP_ID);
			if(gdsPveBossInfo==null)
			{
#if UNITY_EDITOR
				Debug.LogWarning(string.Format("<color=#FF5151FF>GDS_PveBoss 表中无法找到 id {0}，请检测该表数据以及该 id 对应的数据！！！！！ </color", gdsPveLevelInfo.BOSS_ID));
#endif
				return null;
			}
			//caculate level might

			PveLevelInfo pveLevelInfo = new PveLevelInfo();

			pveLevelInfo.levelID			= _levelID;
			pveLevelInfo.score				= pveLevelData!=null?pveLevelData.highestScore:0;
//			pveLevelInfo.might = ;
			pveLevelInfo.marchTime			= gdsPveLevelInfo.MARCH_TIME;
			pveLevelInfo.bossName			= gdsPveBossInfo.NAME;
			pveLevelInfo.bossIcon			= gdsPveBossInfo.LEVEL_BOSS_ICON;
			pveLevelInfo.bossBackImg		= gdsPveBossInfo.BOSS_BG;
			pveLevelInfo.bossLevel			= gdsPveBossInfo.LEVEL;
			pveLevelInfo.desc				= gdsPveLevelInfo.DESCRIPTION;
			pveLevelInfo.star				= pveLevelData!=null?pveLevelData.highestStar:0;
			pveLevelInfo.type				= gdsPveChapterInfo.TYPE;
			pveLevelInfo.maxAttackTimes 	= gdsPveLevelInfo.DAILY_COMBAT_LIMIT;
			pveLevelInfo.curAttackTimes		= pveLevelData!=null?pveLevelData.attackNumPerDay:0;

			pveLevelInfo.startStoryID		= gdsPveLevelInfo.START_STORY_ID;
			pveLevelInfo.successStoryID		= gdsPveLevelInfo.SUCCESS_STORY_ID;
			pveLevelInfo.failStoryID		= gdsPveLevelInfo.FAIL_STORY_ID;

			pveLevelInfo.gold				= gdsPveLevelInfo.REWARD_GOLD;
			pveLevelInfo.food				= gdsPveLevelInfo.REWARD_FOOD;
			pveLevelInfo.wood				= gdsPveLevelInfo.REWARD_WOOD;
			pveLevelInfo.stone				= gdsPveLevelInfo.REWARD_STONE;
			pveLevelInfo.ore				= gdsPveLevelInfo.REWARD_ORE;

			pveLevelInfo.enery				= gdsPveLevelInfo.ENERGY;
			
			if (gdsPveDropInfo != null) 
			{
				//drop items do not have now. by drop id in GDS_PveLevel,we can find drop items in dropGds.
				string [] columns = gdsPveDropInfo.DROP_ITEM.Split ('*');
				int itemID;
				foreach(string itemString in columns)
				{
					itemID = _Global.INT32(itemString.Split ('_')[0]);
					if(itemID != 0)
						pveLevelInfo.itemIDList.Add (itemID);
				}
			}

			//itemID gdsPveLevelInfo				
			return pveLevelInfo;
		}

		public bool CheckStamina(int _levelID)
		{
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(_levelID);
			int samina = totalData.isNew ? totalData.advancedEnergy : totalData.samina;
			if(gdsPveLevelInfo != null && samina >= gdsPveLevelInfo.ENERGY)//not enough 
			{
				return true;
			}
			return false;
		}

		public bool IsLevelUnlock(int levelId)
		{
			DataTable.PveLevel gdsLevelItem = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(levelId);
			if(gdsLevelItem != null)
			{
				PveLevelInfo parentLevelInfo = GetPveLevelInfo(gdsLevelItem.PARENT_LEVEL_ID);
				if(parentLevelInfo != null)
				{
					return parentLevelInfo.star >= 1;
				}
				else
				{
					return true;
				}
			}
			return false;
		}

		public int GetLevelStarNumber(int levelId)
		{
			PveLevelInfo levelInfo = GetPveLevelInfo(levelId);
			if (levelInfo != null)
			{
				return levelInfo.star;
			}
			return 0;
		}

		public PveResultData GetResultInfo()
		{
			return resulData;
		}

		public PveTotalData GetPveTotalInfo()
		{
			return totalData;
		}

		public PveMarchData GetPveMarchInfo()
		{
			return marchData;
		}

		public DataTable.PveStory GetStoryInfo(int _stroyID)
		{
			return GameMain.GdsManager.GetGds<GDS_PveStory>().GetItemById (_stroyID);
		}

		public int GetMaxStamina()
		{
			return totalData.maxEnergy;//MAX_PVE_STAMINA;
		}

		public int GetRecoverStaminaTime()
		{
			return totalData.recoverTime;//TIME_PVE_STAMINA;
		}

		public long GetRefreshTime()
		{
			if(totalData.isNew)
			{
				return totalData.advancedTime;
			}
			else
			{
				return totalData.saminaTime;
			}
		}

		public int GetCurLevelMarchTime()
		{
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(curSelecteLevelID);
			if(GameMain.singleton.IsVipOpened())
			{
				int vipLevel = GameMain.singleton.GetVipOrBuffLevel();
				KBN.DataTable.Vip vipDataItem = GameMain.GdsManager.GetGds<KBN.GDS_Vip>().GetItemById(vipLevel);
				if(vipDataItem.PVE_MARCH_SPEEDUP != 0)
					return 1;
				else if (gdsPveLevelInfo != null) {
					return gdsPveLevelInfo.MARCH_TIME;
				}
			}
			else if (gdsPveLevelInfo != null) {
				return gdsPveLevelInfo.MARCH_TIME;
			}
			return 0;
		}

		public int GetActivHidenBossNum()
		{
			int num = 0;
			foreach (int key in hidenBossList.Keys) {
				HidenBossInfo bossItem = hidenBossList [key];
				if(bossItem.type==2 && bossItem.curHP>0 && GameMain.unixtime ()<bossItem.endTime)
				{
					num++;
				}
			}
			return num;
		}

		public ArrayList GetHidenBossInfo()
		{
			ArrayList tempHidenBossList = new ArrayList ();
			foreach (int key in hidenBossList.Keys) {
				HidenBossInfo bossItem = hidenBossList [key];
				if(bossItem.type==2)
					tempHidenBossList.Add(hidenBossList [key]);
			}
			return tempHidenBossList;
		}

		public HidenBossInfo GetHidenBossItemData(int _chapterID)
		{
			if (hidenBossList.ContainsKey (_chapterID)) 
				return hidenBossList [_chapterID];
			return null;
		}

		public HidenBossUiInfo GetHidenBossUiInfo(int curChapterID)
		{
			HidenBossUiInfo hidenBossUiInfo = new HidenBossUiInfo ();
			foreach (int key in hidenBossList.Keys) 
			{
				HidenBossInfo bossItem = hidenBossList [key];
				if(bossItem.type==2 && totalData.totalStar>=bossItem.needStars)
				{
					if(hidenBossUiInfo.curChapterID!=0 && hidenBossUiInfo.nextChapterID==0)
					{
						hidenBossUiInfo.nextChapterID = bossItem.chapterID;
					}

					if(curChapterID == bossItem.chapterID)
					{
						hidenBossUiInfo.curChapterID = curChapterID;
					}

					if(hidenBossUiInfo.curChapterID==0)
					{
						hidenBossUiInfo.lastChapterID = bossItem.chapterID;
						hidenBossUiInfo.curHidenBossIndex++;
					}

					hidenBossUiInfo.unlockHidenBossNum++;
				}
			}
			hidenBossUiInfo.curHidenBossIndex++;
			return hidenBossUiInfo;
		}

		public PveChapterData GetChapterData(int chapeterID)
		{
			return pveChapterDataList.ContainsKey(chapeterID)?pveChapterDataList[chapeterID]:null;
		}

		public Dictionary<int, PveChapterData> GetPveChapterDataList()
		{
			return pveChapterDataList;
		}

		public Dictionary<int, HidenBossInfo> GetHidenBossList()
		{
			return hidenBossList;
		}
		//get info function for ui end
		
		//test begin
		public void TestData()
		{
			/*
			curSelecteLevelID = 100100100;

			resulData.levelID = 100100100;
			resulData.score = 100;
			resulData.star = 2;
			resulData.speed = 10;
			resulData.vitality = 9;
			resulData.tactics = 8;

			resulData.gold = 22;
			resulData.food = 33;
			resulData.wood = 44;
			resulData.stone = 55;
			resulData.ore = 66;
			resulData.isNewrecord = true;

			resulData.itemList.Clear ();
			resulData.itemList.Add (50000);
			resulData.itemList.Add (1001);
			resulData.itemList.Add (5001);

			//
			PveLevelData pveLevelData = new PveLevelData();
			pveLevelData.levelID = 100100100;

			pveLevelData.highestScore = 100;
			pveLevelData.highestStar = 3;
			pveLevelData.highestSpeed = 11;
			pveLevelData.highestVitality = 12;
			pveLevelData.highestTactics = 13;

			pveLevelData.lastScore = 55;
			pveLevelData.lastStar = 2;
			pveLevelData.lastSpeed = 1;
			pveLevelData.lastVitality = 2;
			pveLevelData.lastTactics = 3;
			*/

			PlayerPrefs.SetInt(LAST_CLICK_CHAPTER_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);
			PlayerPrefs.SetInt(LAST_CLICK_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);
			PlayerPrefs.SetInt(LAST_WIN_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);
			PlayerPrefs.SetInt(MARCH_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),0);

	
			//levelDataList.Add(pveLevelData);
		}
		//test end

		public bool IsHidenBossOver(int _chapterID)
		{
			if (hidenBossList.ContainsKey (_chapterID)) 
			{
				if(hidenBossList[_chapterID].type == Constant.PveType.SOURCEBOSS)
				{
					return false;
				}
				else
				{
					if(GameMain.unixtime () >= hidenBossList[_chapterID].endTime)
						return true;
				}
			}
			return false;
		}

		public PveLevelData FindLeveData(int _levelID)
		{
			int chapterID = _levelID / 1000000;
			if (pveChapterDataList.ContainsKey (chapterID)) 
			{
				if(pveChapterDataList[chapterID].levelDataList.ContainsKey(_levelID))
				   return pveChapterDataList[chapterID].levelDataList[_levelID];
			}

			return null;
			//PveLevelData
		}

		void AddLevelData(PveLevelData levelInfo)
		{
			if (levelInfo == null)
				return;
			int chapterID = levelInfo.levelID/1000000;

			DataTable.PveChapter gdsChapterItem = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItemById(chapterID);
			
			if(gdsChapterItem!=null && (gdsChapterItem.TYPE == 2 || gdsChapterItem.TYPE == 3 || gdsChapterItem.TYPE == 5) ) 
			{
				if(hidenBossList.ContainsKey(chapterID))
				{
					hidenBossList[chapterID].curLevelID	= levelInfo.levelID;
					hidenBossList[chapterID].curHP		= levelInfo.bossCurHP;
					hidenBossList[chapterID].totalHP	= levelInfo.bossTotalHP;
					hidenBossList[chapterID].nextLevelID = levelInfo.bossNextLevelID;
					if(gdsChapterItem.TYPE == 5)
					{
						hidenBossList[chapterID].endTime	= levelInfo.bossRenascenceTime;
					}
					
					GameMain.singleton.SetCampaignBossHp(levelInfo.levelID,chapterID,levelInfo.bossCurHP,levelInfo.bossTotalHP);
					if(hidenBossList[chapterID].nextLevelID != 0 && hidenBossList[chapterID].nextLevelID != hidenBossList[chapterID].curLevelID)
					{
						GameMain.singleton.ChangeCampaignBossToNextLevel(hidenBossList[chapterID].curLevelID,hidenBossList[chapterID].nextLevelID);
						hidenBossList[chapterID].curLevelID	= levelInfo.bossNextLevelID;
					}
				}
				return;
			}

			if(gdsChapterItem != null && gdsChapterItem.TYPE == 5 ) 
			{
				if(hidenBossList.ContainsKey(chapterID))
				{
					hidenBossList[chapterID].curLevelID	= levelInfo.levelID;
					hidenBossList[chapterID].curHP		= levelInfo.bossCurHP;
					hidenBossList[chapterID].totalHP	= levelInfo.bossTotalHP;
			
					GameMain.singleton.SetCampaignBossHp(levelInfo.levelID,chapterID,levelInfo.bossCurHP,levelInfo.bossTotalHP);
				}

				return;
			}
			
			if(! pveChapterDataList.ContainsKey(chapterID))
			{
				PveChapterData pveChapterData = new PveChapterData();
				
				//fill data
				pveChapterData.chapterID		= chapterID;
				pveChapterData.totalStar = 0;
				Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
				foreach (KBN.DataTable.PveLevel gdsLevelItem in gdsPveLevel) {
					int curChapterID = gdsLevelItem.ID/1000000;
					if(curChapterID == pveChapterData.chapterID)
					{
						pveChapterData.totalStar += MAX_LEVEL_STARS;//gdsLevelItem.THREE_STAR_SCORE;
					}
				}
				pveChapterDataList.Add(chapterID, pveChapterData);
			}
			
			if(! pveChapterDataList[chapterID].levelDataList.ContainsKey(levelInfo.levelID))
			{
				pveChapterDataList[chapterID].levelDataList.Add(levelInfo.levelID,levelInfo);
				pveChapterDataList[chapterID].curStar += levelInfo.highestStar;
				pveChapterDataList[chapterID].curScore += levelInfo.highestScore;

				totalData.totalScore += levelInfo.highestScore;
				totalData.totalStar += levelInfo.highestStar;

			}
			else{
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].levelID				= levelInfo.levelID;
				if(pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestScore<levelInfo.highestScore)
				{
					totalData.totalScore += (levelInfo.highestScore - pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestScore);

					pveChapterDataList[chapterID].curScore += (levelInfo.highestScore - pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestScore);

					MenuMgr.instance.sendNotification (Constant.Notice.UPDATE_PVE_SCORE_STAR,null);

					pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestScore			= levelInfo.highestScore;
					pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestSpeed			= levelInfo.highestSpeed;
					pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestVitality		= levelInfo.highestVitality;
					pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestTactics		= levelInfo.highestTactics;
				}

				if(pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestStar<levelInfo.highestStar)
				{
					totalData.totalStar += (levelInfo.highestStar - pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestStar);
					pveChapterDataList[chapterID].curStar += (levelInfo.highestStar - pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestStar);
					pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].highestStar			= levelInfo.highestStar;
				}

				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].lastScore			= levelInfo.lastScore;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].lastStar				= levelInfo.lastStar;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].lastSpeed			= levelInfo.lastSpeed;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].lastVitality			= levelInfo.lastVitality;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].lastTactics			= levelInfo.lastTactics;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].attackNum			= levelInfo.attackNum;
				pveChapterDataList[chapterID].levelDataList[levelInfo.levelID].attackNumPerDay		= levelInfo.attackNumPerDay;
			}
		}
		
		private void CalculateChapterData()
		{
			return;
		}

		private void FillHidenBossData()
		{
			hidenBossList.Clear ();
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveChapter = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItems ();
			foreach (KBN.DataTable.PveChapter chapterItem in gdsPveChapter) {
				if(chapterItem.TYPE == 2 || chapterItem.TYPE == 3 || chapterItem.TYPE == 5)//2,3hiden boss  5source boss
				{
					HidenBossInfo hidenBossInfo = new HidenBossInfo();
					hidenBossInfo.chapterID				= chapterItem.ID;
					hidenBossInfo.needStars				= chapterItem.UNLOCK_STAR;
					hidenBossInfo.lastLevelID			= GetLastLevelID(hidenBossInfo.chapterID);
					DataTable.PveLevel pveLevelInfo		= GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(hidenBossInfo.lastLevelID);
					hidenBossInfo.bossID				= pveLevelInfo!=null?pveLevelInfo.BOSS_ID:0;
					hidenBossInfo.chapterIcon			= chapterItem.ICON;
					DataTable.PveBoss pveBossInfo		= GameMain.GdsManager.GetGds<GDS_PveBoss>().GetItemById(hidenBossInfo.bossID);
					hidenBossInfo.bossIcon				= pveBossInfo!=null?pveBossInfo.HIDDEN_BOSS_ICON:"";
					hidenBossInfo.bigBossIcon			= pveBossInfo!=null?pveBossInfo.LEVEL_BOSS_ICON:"";
					hidenBossInfo.bossName				= pveBossInfo!=null?pveBossInfo.NAME:"";
					hidenBossInfo.slotID				= chapterItem.SLOT_ID;
					hidenBossInfo.totalTime				= chapterItem.ACTIVE_DURATION;
					hidenBossInfo.type					= chapterItem.TYPE;
					hidenBossList.Add(hidenBossInfo.chapterID,hidenBossInfo);
				}
			}
		}

		public int GetLastLevelID(int chapterID)
		{
			int lastLevlID = 0;
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
			foreach (KBN.DataTable.PveLevel dataItem in gdsPveLevel) 
			{
				if((int)(dataItem.ID / 1000000)==chapterID && lastLevlID<dataItem.ID)
					lastLevlID=dataItem.ID;
			}
			return lastLevlID;
		}

		public void Update()
		{
			//Refill Stamina
			if ( totalData.needRequest && totalData.saminaTime > 0 && 
			    totalData.samina < totalData.maxEnergy && //MAX_PVE_STAMINA
			    GameMain.unixtime () - totalData.saminaTime >= totalData.recoverTime) // seconds TIME_PVE_STAMINA
			{
				totalData.needRequest = false;
				ReqRefillStamina((int)Constant.PVE_REQ_Type.REQ_Type_REFILL_ENERGY);
			}

			if ( totalData.needRequest && totalData.advancedTime > 0 && 
			    totalData.advancedEnergy < totalData.maxEnergy && //MAX_PVE_STAMINA
			    GameMain.unixtime () - totalData.advancedTime >= totalData.recoverTime) // seconds TIME_PVE_STAMINA
			{
				totalData.needRequest = false;
				ReqRefillStamina((int)Constant.PVE_REQ_Type.REQ_Type_RECOVER_NEW_ADVANCED);
			}

			//march
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(marchData.levelID);
			if (gdsPveLevelInfo!=null && marchData.needRequest && marchData.marchID>=0 && GameMain.unixtime () >= marchData.marchEndTime)
			    //&& GameMain.unixtime () - marchData.marchTime >= gdsPveLevelInfo.MARCH_TIME) // seconds
			{
				//march over,req march result
				if(GameMain.singleton.curSceneLev() == GameMain.CHAPTERMAP_SCENE_LEVEL || 
				   GameMain.singleton.curSceneLev() == GameMain.CAMPAIGNMAP_SCENE_LEVEL ||
				   GameMain.singleton.curSceneLev() == GameMain.ALLIANCE_BOSS_LEVEL)
				{
					if(!marchData.isAllianceBoss)
						ReqMarchResul();
					else
						OnAllianceBossMarchOver();
				}
				marchData.needRequest = false;
			}
		}

		public void OnLevelWin(int _levelID)
		{
			if (_levelID > PlayerPrefs.GetInt (LAST_WIN_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(), 0)) 
			{
				//when first clik this level,pop the story menu
				PlayerPrefs.SetInt(LAST_WIN_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),_levelID);
			}
		}

		public bool IsFirstLevelClick(int _levelID)
		{
			int nType = _levelID/100000000;
			if(nType!=1)return false;

			PveLevelData pveLevelData = FindLeveData (_levelID);

			int nCurLevelID = PlayerPrefs.GetInt (LAST_CLICK_LEVEL_ID + Datas.singleton.tvuid ()+Datas.singleton.worldid(), 0);
			if (_levelID > nCurLevelID && (pveLevelData==null || pveLevelData!=null && pveLevelData.highestScore == 0)) 
			{
				//when first clik this level,pop the story menu
				PlayerPrefs.SetInt(LAST_CLICK_LEVEL_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),_levelID);
				return true;
			}

			return false;
		}

		public int GetNewHidenBossCount()
		{
			int nCurCount = PlayerPrefs.GetInt (PRE_HIDEN_BOSS_COUNT + Datas.singleton.tvuid ()+Datas.singleton.worldid(), 0);

			int nTotalCount = 0;
			foreach (int key in hidenBossList.Keys) {
				HidenBossInfo bossItem = hidenBossList [key];
				if(bossItem.type==2 && totalData.totalStar >= bossItem.needStars)
				{
					nTotalCount++;
				}
			}
			return (nTotalCount - nCurCount);
		}

		public void SetNewHidenBossCount()
		{
			int nTotalCount = 0;
			foreach (int key in hidenBossList.Keys) {
				HidenBossInfo bossItem = hidenBossList [key];
				if(bossItem.type==2 && totalData.totalStar >= bossItem.needStars)
				{
					nTotalCount++;
				}
			}

			PlayerPrefs.SetInt(PRE_HIDEN_BOSS_COUNT+Datas.singleton.tvuid()+Datas.singleton.worldid(),nTotalCount);
		}

		public bool IsFirstEnterChapterScene(int _chapterID)
		{
			if (_chapterID > PlayerPrefs.GetInt (LAST_CLICK_CHAPTER_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(), 0) && 
			    (!pveChapterDataList.ContainsKey(_chapterID) || pveChapterDataList.ContainsKey(_chapterID) && pveChapterDataList [_chapterID].curScore == 0)) 
			{
				//when first clik this chapter,pop the story menu
				PlayerPrefs.SetInt(LAST_CLICK_CHAPTER_ID+Datas.singleton.tvuid()+Datas.singleton.worldid(),_chapterID);
				return true;
			}
			return false;
		}

		public int GetBossNextLevelID(int curLevelID)
		{
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
			foreach (KBN.DataTable.PveLevel dataItem in gdsPveLevel) 
			{
				if(dataItem.PARENT_LEVEL_ID == curLevelID)
				{
					return dataItem.ID;
				}
			}
			return 0;
		}

		public bool IsChapterFinished(int chapterId)
		{
			if(!pveChapterDataList.ContainsKey(chapterId))
			{
				return false;
			}
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
			foreach (KBN.DataTable.PveLevel dataItem in gdsPveLevel) 
			{
				if(dataItem.ID/1000000 == chapterId)
				{
					if(pveChapterDataList[chapterId].levelDataList.ContainsKey(dataItem.ID))
					{
						if(pveChapterDataList[chapterId].levelDataList[dataItem.ID].highestStar <= 0)
						{
							return false;
						}
					}
					else
					{
						return false;
					}
				}
			}
			return true;
		}

		public bool IsChapterCompleted( int chapterID )
		{
			if( !pveChapterDataList.ContainsKey( chapterID ) ) // No data of this chapter found in the player's record
				return false;

			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection levels = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
			foreach (KBN.DataTable.PveLevel aLevel in levels) // Traverse levels...
			{
				if( aLevel.ID/1000000 == chapterID ) // Compare chapter ID
				{
					if( pveChapterDataList[chapterID].levelDataList.ContainsKey( aLevel.ID ) ) // Compare level ID
					{
						if( pveChapterDataList[chapterID].levelDataList[aLevel.ID].highestStar <= 0 )
						{
							return false;
						}
					}
					else // No data of this level found in the player's record
					{
						return false;
					}
				}
			}
			return true;
		}

		public bool IsNormalChapterUnlock(int chapterId)
		{
			bool bUnlock = true;
			DataTable.PveChapter gdsChapterItem = GameMain.GdsManager.GetGds<KBN.GDS_PveChapter>().GetItemById (chapterId);
			if(gdsChapterItem != null)
			{
				DataTable.PveChapter gdsParentChapterItem = GameMain.GdsManager.GetGds<KBN.GDS_PveChapter>().GetItemById(gdsChapterItem.PARENT_CHAPTER_ID);
				if(gdsParentChapterItem == null) return true;
				if(pveChapterDataList.ContainsKey(gdsParentChapterItem.ID))
				{
					Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
					foreach (KBN.DataTable.PveLevel dataItem in gdsPveLevel) 
					{
						if(dataItem.ID/1000000 == gdsParentChapterItem.ID)
						{
							if(pveChapterDataList[gdsParentChapterItem.ID].levelDataList.ContainsKey(dataItem.ID))
							{
								if(pveChapterDataList[gdsParentChapterItem.ID].levelDataList[dataItem.ID].highestStar <= 0)
								{
									bUnlock = false;
									break;
								}
							}
							else
							{
								bUnlock = false;
								break;
							}
						}
					}
				}
				else
				{
					bUnlock = false;
				}
			}
			else
			{
				bUnlock = true;
			}
			return bUnlock;
		}

		public bool IsEliteChapterUnlock(int chapterId)
		{
			int normalChapterId = chapterId % 100 + 100;
			return IsChapterFinished (normalChapterId);
		}

		public bool IsChapterUnlock(int chapterId)
		{
			if(chapterId/100 == Constant.PveType.NORMAL)
			{
				return IsNormalChapterUnlock(chapterId);
			}
			else if(chapterId/100 == Constant.PveType.ELITE)
			{
				return IsEliteChapterUnlock(chapterId);
			}
			return false;
		}

		public void CheckUnlockNext()
		{
			if( !resulData.isFirstWin ) return;
			int curLevelID = resulData.levelID;
			int curChapterID = curLevelID / 1000000;
			int maxLevelID = 0;
	
			nextLevelID = 0;
			nextChapterID = 0;

			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveLevel = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItems ();
			foreach (KBN.DataTable.PveLevel dataItem in gdsPveLevel) 
			{
				if((int)(dataItem.ID / 1000000)==curChapterID && maxLevelID<dataItem.ID)
					maxLevelID = dataItem.ID;
				if(dataItem.PARENT_LEVEL_ID == curLevelID)
				{
					if(resulData.star >0 )
					{
						nextLevelID = dataItem.ID;
					}
				}
			}
			if(maxLevelID == curLevelID)
			{
				Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsPveChapter = GameMain.GdsManager.GetGds<GDS_PveChapter>().GetItems ();
				foreach (KBN.DataTable.PveChapter dataItem in gdsPveChapter) 
				{
					if(dataItem.TYPE == Constant.PveType.NORMAL && dataItem.PARENT_CHAPTER_ID == curChapterID && totalData.totalStar >= dataItem.UNLOCK_STAR)
						nextChapterID = dataItem.ID;
				}
			}
		}

		public void SetFlagAnimationLevelData(PveLevelData lastData,PveLevelData highestData)
		{
			LevelFlagAnimation = false;
			if (null == lastData && highestData.highestStar > 0) 
			{
				LevelFlagAnimation = true;
			} 
			else if(null != lastData)
			{
				if(highestData.highestStar > lastData.highestStar)
				{
					LevelFlagAnimation = true;
				}
			}
			if (LevelFlagAnimation) 
			{
				m_FlagAnimationLevelData.levelID = highestData.levelID;
				m_FlagAnimationLevelData.highestScore = highestData.highestScore;
				m_FlagAnimationLevelData.highestStar = highestData.highestStar;
				m_FlagAnimationLevelData.highestSpeed = highestData.highestSpeed;
				m_FlagAnimationLevelData.highestVitality = highestData.highestVitality;
				m_FlagAnimationLevelData.highestTactics = highestData.highestTactics;
				m_FlagAnimationLevelData.lastScore = highestData.lastScore;
				m_FlagAnimationLevelData.lastStar = highestData.lastStar;
				m_FlagAnimationLevelData.lastSpeed = highestData.lastSpeed;
				m_FlagAnimationLevelData.lastVitality = highestData.lastVitality;
				m_FlagAnimationLevelData.lastTactics = highestData.lastTactics;
			}
		}

		public PveLevelData GetFlagAnimationLevelData()
		{
			return 	m_FlagAnimationLevelData;
		}

		public int GetFirstStoryID(int _storyGroupID)
		{
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection gdsStory = GameMain.GdsManager.GetGds<GDS_PveStory>().GetItems ();
			foreach (KBN.DataTable.PveStory dataItem in gdsStory) 
			{
				if((int)(dataItem.ID / 1000)==_storyGroupID)
					return dataItem.ID;
			}
			return 0;
		}

		public int GetMapStars(int mapId)
		{
			int retTotalStars = 0;
			int chapterId = mapId / 1000;
			if(pveChapterDataList.ContainsKey(chapterId))
			{
				PveChapterData chapterData = pveChapterDataList[chapterId];
				foreach (int key in chapterData.levelDataList.Keys)
				{
					retTotalStars += chapterData.levelDataList[key].highestStar;
				}
			}
			return retTotalStars;
		}

		public int GetActiveBossCount()
		{
			int retCount = 0;
			foreach ( int key in hidenBossList.Keys )
			{
				HidenBossInfo bossItem = hidenBossList[key];
				long curTime = GameMain.unixtime();
				if(bossItem != null && curTime < bossItem.endTime && bossItem.curHP > 0)
				{
					retCount++;
				}
			}
			return retCount;
		}

		public void OnClickLevel(int curLevelID)
		{

			bool isFirst = IsFirstLevelClick(curLevelID);
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(curLevelID);
			if(gdsPveLevelInfo!=null && isFirst && gdsPveLevelInfo.START_STORY_ID>0)
			{
				HashObject hash = new HashObject(
					new Hashtable(){
						{"storyID",gdsPveLevelInfo.START_STORY_ID},
						{"heroID",0},
						{"chapterID",0},
						{"levelID",curLevelID},
					}
				);
				MenuMgr.instance.PushMenu("StoryMenu",hash,"trans_immediate" );
			}
			else
			{
				HashObject param = new HashObject(
					new Hashtable(){
						{"levelID",curLevelID}, 
						{"isHIdeBossInfo",0},
					}
				);
				MenuMgr.instance.PushMenu("BossMenu", param,"transition_BlowUp");
			}
		}

		public void OnMapUnlock(int _mapID)
		{
			DataTable.PveMap gdsPveMapInfo = GameMain.GdsManager.GetGds<GDS_PveMap>().GetItemById (_mapID);
			if(gdsPveMapInfo!=null && gdsPveMapInfo.STORY_ID>0)
			{
				HashObject hash = new HashObject(
					new Hashtable(){
					{"storyID",gdsPveMapInfo.STORY_ID},
					{"heroID",0},
					{"chapterID",0},
					{"levelID",0},
				}
				);
				MenuMgr.instance.PushMenu("StoryMenu",hash,"trans_immediate" );
			}
		}

		public void OnEnterChapter()
		{
			int chapterID = GameMain.singleton.getChapterID ();
			bool isFirst = IsFirstEnterChapterScene(chapterID);
			if(isFirst)
			{
				OnMapUnlock(chapterID*1000+100);
			}
		}

		public int GetPveMinLevel()
		{
			HashObject seed = GameMain.singleton.getSeed ();
			if (seed ["pvePlayerLevel"] != null)
				return _Global.INT32 (seed ["pvePlayerLevel"].Value);
			return PVE_MIN_LEVEL;
		}

		public void CheckLevelUp()
		{
			if (GameMain.singleton.IsPveOpened() && GetPveMinLevel () <= GameMain.singleton.getPlayerLevel ()) 
			{
				if(GameMain.singleton.GetPveFteStep() == 0)
				{
					MenuMgr.instance.PushMenu("PveFteMenu", null, "trans_zoomComp");
				}
			}
		}

		public void SetPveFteStep(int nStep)
		{
			if (GameMain.singleton.IsPveOpened() && GetPveMinLevel () <= GameMain.singleton.getPlayerLevel ()) 
			{
				PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
				reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_PVE_FTE;

				pveFteStep = nStep;
				reqMsg.pveFte = nStep;
				
				string url = "pve.php";
				pveOKFunc = OkMsgPveFte;
				UnityNet.RequestForGPB (url,reqMsg,pveOKFunc,null,true); 
			}
		}

		private void OkMsgPveFte(byte[] result)
		{
			GameMain.singleton.SetPveFteStep (pveFteStep);
		}

		public bool IsAllianceBossMarch()
		{
			return marchData.isAllianceBoss;
		}

		public void PushUnlockEliteChapterMsg(int normalChpaterId)
		{
			if(normalChpaterId%100 == Constant.PveType.NORMAL)
			{
				int eliteChapterId = normalChpaterId%100 + 600;
				KBN.DataTable.PveChapter gdsChapterItem  = KBN.GameMain.GdsManager.GetGds<KBN.GDS_PveChapter>().GetItemById (eliteChapterId);
				string msg = string.Format(Datas.getArString("Campaign.Toastor_EliteChapterUnlock"),Datas.getArString(gdsChapterItem.NAME));
				MenuMgr.instance.PushMessage(msg);
			}
		}
	}
	//end class PveController

	public class PveTotalData
	{
		public PveTotalData()
		{
			totalScore = 0;
			totalStar = 0;
			samina = 0;
			saminaTime = 0;
			maxEnergy = 10;
			recoverTime = 120;
			itemID = 0;
			gem = 0;
			reqSaminaType = 0;
			needRequest = false;
			leftBuyNum = 0;
			advancedEnergy = 0;
			advancedItemPrice = 0;
			advancedItemId = 961;
			advancedItemLeftBuyNum = 0;
			advancedTime = 0;
			isNew = false;
		}
		public int totalScore;
		public int totalStar; 
		public int samina; 
		public long saminaTime; 
		public int maxEnergy;
		public int recoverTime;
		public int itemID;
		public int gem;
		public int reqSaminaType;//0,pveinfo	1,recover		2,item		3,gem
		public bool needRequest;
		public int leftBuyNum;
		public int advancedEnergy;
		public int advancedItemPrice;
		public int advancedItemId;
		public int advancedItemLeftBuyNum;
		public long advancedTime;
		public bool isNew; // is new energy
	}
	
	public class PveChapterData
	{
		public PveChapterData()
		{
			chapterID = 0;
			curStar = 0; 
			curScore = 0;
			totalStar = 0;
			levelDataList.Clear ();
		}
		public int chapterID;
		public int curStar; 
		public int curScore;
		public int totalStar;

		public Dictionary<int,PveLevelData> levelDataList = new Dictionary<int,PveLevelData> ();
	}

	public class PveLevelData
	{
		public PveLevelData()
		{
			levelID = 0;
			highestScore = 0;
			highestStar = 0;
			highestSpeed = 0;
			highestVitality = 0;
			highestTactics = 0;
			lastScore = 0;
			lastStar = 0;
			lastSpeed = 0;
			lastVitality = 0;
			lastTactics = 0;
			bossNextLevelID = 0;
			bossRenascenceTime = 0;
		}

		public int levelID;
	
		public int highestScore;
		public int highestStar;
		public int highestSpeed;
		public int highestVitality;
		public int highestTactics;
		
		public int lastScore;
		public int lastStar;
		public int lastSpeed;
		public int lastVitality;
		public int lastTactics;
		public long bossCurHP;
		public long bossTotalHP;
		public int bossNextLevelID;
		public int attackNum;
		public int attackNumPerDay;
		public long bossRenascenceTime;
	}
	
	public class PveResultData
	{
		public PveResultData()
		{
			levelID = 0;
			unlockHeroID = 0;
			isFirstWin = false;
			isNewrecord = false;
			type = 1;
		}

		public int levelID;
		public int type;	//1 normal	2 hiden boss	3 event boss
		public int score;
		public int star;
		public int speed;
		public int vitality;
		public int tactics;
		
		public int gold;
		public int food;
		public int wood;
		public int stone;
		public int ore;

		public int unlockHeroID;

		public bool isNewrecord;

		public bool isFirstWin;
		public long bossCurHP;
		public long bossTotalHP;

		public ArrayList itemList = new ArrayList();

		public int incrementBuff;
		public int totalBuff;
		public int damageRank;
		public int normalAttackNumPerWeek;
	}

	public class PveMarchData
	{
		public PveMarchData()
		{
			clear ();
		}

		public int marchID;
		public int levelID; 
		public long marchTime; 
		public long marchEndTime;
		public int cityID; 
		public int knightId; 
		public List<int> units = new List<int> ();
		public List<long> marchHeroList = new List<long> ();
		public bool isAllianceBoss;
		public bool needRequest;
		public void clear()
		{
			marchID = -1;
			levelID = -1;
			marchTime = 0;
			marchEndTime = 0;
			cityID = -1;
			knightId = -1;
			needRequest = false;
			marchHeroList.Clear ();
			units.Clear ();
			isAllianceBoss = false;
		}
	}

	public class PveTopData
	{
		public int ranking;
		public string name;
		public int score;

	}

	//menu info class bengin
	public class BossTroopInfo
	{
		public int troopID;
		public long troopAmount;
		public BossTroopInfo(int _troopID, long _troopAmount)
		{
			troopID = _troopID;
			troopAmount = _troopAmount;
		}
	}

	public class PveLevelInfo
	{
		public int levelID;
		public int score;
		public int might;
		public int marchTime;
		public string bossName;
		public string bossIcon;
		public string bossBackImg;
		public int bossLevel;
		public string desc;
		public int star;
		public int type;
		public int maxAttackTimes;
		public int curAttackTimes;
		//story
		public int startStoryID;
		public int successStoryID;
		public int failStoryID;

		//rewards
		public int gold;
		public int food;
		public int wood;
		public int stone;
		public int ore;

		public int enery;

		public ArrayList itemIDList = new ArrayList();
	}
	
	public class HidenBossInfo
	{	
		public HidenBossInfo()
		{
			chapterID = 0;
			needStars = 0;
			lastLevelID = 0; 
			bossID = 0;
			chapterIcon = "";
			bossIcon = "";
			bigBossIcon = "";
			bossName = "";

			curLevelID = 0;
			nextLevelID = 0;
			endTime = 0;
			slotID = 0;
			totalTime = 0;
			curHP = 0;
			totalHP = 0;
			type = 0;
		}
		public int chapterID;
		public int needStars;
		public int lastLevelID; 
		public int bossID;
		public string chapterIcon;
		public string bossIcon;
		public string bigBossIcon;
		public string bossName;

		public int curLevelID;
		public int nextLevelID;
		public long endTime;
		public int slotID;
		public long totalTime;
		public long curHP;
		public long totalHP;

		public int type;
	}

	public class HidenBossUiInfo
	{
		public HidenBossUiInfo()
		{
			curChapterID = 0;
			lastChapterID = 0;
			nextChapterID = 0;
			unlockHidenBossNum = 0;
		}

		public int curChapterID;
		public int lastChapterID;
		public int nextChapterID;
		public int curHidenBossIndex;
		public int unlockHidenBossNum;
	}
	//menu info class end
}