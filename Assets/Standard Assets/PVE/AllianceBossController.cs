using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;

namespace KBN
{
	public class AllianceBossLayerInfo
	{
		public List<int> levelList = new List<int> ();
		public int layer;//begin from 0
		public int factor;
		public List<string> leaveMsg = new List<string> ();
		public List<string> avatar = new List<string> ();
		public AllianceBossLayerInfo(List<int> _levelList, int _layer, int _factor, List<string> _leaveMsg)
		{
			levelList = _levelList;
			layer = _layer;
			factor = _factor;
			leaveMsg = _leaveMsg;
		}

		public AllianceBossLayerInfo(int _layer)
		{
			layer = _layer;
//			TestData ();
		}

		public AllianceBossLayerInfo()
		{
		}

		public void TestData()
		{
			factor = 20;
			levelList = new List<int> ();
			leaveMsg = new List<string> ();
			levelList.Add (100100101);
			levelList.Add (100100102);
			levelList.Add (100100103);
			levelList.Add (100100104);
			levelList.Add (100101101);
			levelList.Add (100101102);
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31a");
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31b");
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31c");
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31d");
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31e");
			leaveMsg.Add ("msg1123231321qqweqeqweqeqewqewqewq31f");
		}
	}

	public class AllianceBossController
	{
		public enum EVENT_TIME_STATE
		{
			NOT_START = 1,
			START,
			OVER,
		};
		const int SOCKET_REQ_TYPE = 1;
		const int SOCKET_REGISTER = 1;
		const int SOCKET_UN_REGISTER = 2;
		const int SOCKET_REGISTER_TYPE_ALLIANCE_BOSS = 1;
		enum SCOKET_PACKET_TYPE
		{
			SCOKET_PACKET_TYPE_MSG			= 1,
			SCOKET_PACKET_TYPE_ATTACK		= 2,
			SCOKET_PACKET_TYPE_RESET		= 3,
			SCOKET_PACKET_TYPE_JOIN_PLAYER	= 4,
		};
		public const long WARNING_TIME = 600;
		public const long WARNING_ATTACK_NUM = 10;
		const int REQ_ALLIANCE_BOSS_TROOP_RETURN = 1;
		protected delegate void OKFunc(byte[] result);
		protected static AllianceBossController singleton = null;
		public const int RESET_ITEM_ID = 999;
		public const int MAX_MSG_LENGTH = 60;

		public AllianceBossController()
		{
//			SocketNet.Instance.RegisterNetworkErrorFunc(OnNetworkError);
//			SocketNet.Instance.RegisterNetworkConnectFunc (OnNetworkConnected);
			NewSocketNet.instance.RegisterNetworkSignUpFunc (OnNetworkConnected);
			isAcceptSocket = false;
			eventState = EVENT_TIME_STATE.NOT_START;
			isCurBossFail = false;
		}

		public EVENT_TIME_STATE EventState
		{
			get { return eventState; }
		}

		public long endTime
		{
			get ;
			set ;
		}
		public long notifyTime
		{
			get{
				HashObject seed = GameMain.singleton.getSeed();
				if(seed["pveAllianceBoss"] != null)
					return _Global.INT64(seed["pveAllianceBoss"]["notifyTime"]);
				return 0;
			}
		}
		public long startTime
		{
			get{
				HashObject seed = GameMain.singleton.getSeed();
				if(seed["pveAllianceBoss"] != null)
					return _Global.INT64(seed["pveAllianceBoss"]["startTime"]);
				return 0;
			}
		}
		public long eventEndTime
		{
			get{
				HashObject seed = GameMain.singleton.getSeed();
				if(seed["pveAllianceBoss"] != null)
					return _Global.INT64(seed["pveAllianceBoss"]["eventEndTime"]);
				return 0;
			}
		}
		public long rewardEndTime
		{
			get{
				HashObject seed = GameMain.singleton.getSeed();
				if(seed["pveAllianceBoss"] != null)
					return _Global.INT64(seed["pveAllianceBoss"]["rewardEndTime"]);
				return 0;
			}
		}
		public List<AllianceBossLayerInfo> layerList{get;protected set;}
		public int curLayer{get;protected set;}//begin from 0
		public int curLevel{get;protected set;}
		public int curLevelIndex{get;protected set;}//begin from 0
		public long disappearTime{get;protected set;}
		public int leftAttackNum{get;set;}
		public int buff{get;set;}
		public int increbuff{get; set;}
		public long totalBossHp{get;set;}
		public long curBossHp{get;set;}
		public long curDamage{get;set;}
		public int joinPlayerNum{get;set;}
		public long nextBossCurHP{get;set;}
		public long nextBossTotalHP{get;set;}
		public int changeRank{get;set;}
		public bool isBossDie{get;set;}
		public string attackerName{get;set;}
		public int damageRank{get;set;}
		public bool isHaveReward{get;set;}
		public HashObject rewardItem{get;set;}
		private bool isAcceptSocket;
		static private bool isSeedHaveEndTime = false;
		private EVENT_TIME_STATE eventState;
		private bool isCurBossFail = false;
		
		public static bool isAllianceBossDie = false;

		public static AllianceBossController instance()
		{
			if( singleton == null )
			{
				singleton = new AllianceBossController();
			}
			return singleton as AllianceBossController;
		}

		public void ReqAllianceBossInfo()
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_REQ_TYPE_INFO;
			string url = "pveAllianceBoss.php";
			UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossInfo,null,false); 
		}

		private void SendSocketRegister()
		{
			isAcceptSocket = true;
			battleInfo.battleInfo msgSoket = new battleInfo.battleInfo ();
			msgSoket.userId = Datas.singleton.tvuid();
			msgSoket.type = SOCKET_REQ_TYPE;
			msgSoket.cmd = SOCKET_REGISTER;
			msgSoket.worldId = Datas.singleton.worldid();
			msgSoket.id = SOCKET_REGISTER_TYPE_ALLIANCE_BOSS;
			msgSoket.subId = Alliance.singleton.MyAllianceId();
			NewSocketNet.instance.Send(msgSoket);
		}

		public void SendSocketUnRegister()
		{
			isAcceptSocket = false;
			battleInfo.battleInfo msgSoket = new battleInfo.battleInfo ();
			msgSoket.userId = Datas.singleton.tvuid();
			msgSoket.type = SOCKET_REQ_TYPE;
			msgSoket.cmd = SOCKET_UN_REGISTER;
			msgSoket.worldId = Datas.singleton.worldid();
			msgSoket.id = SOCKET_REGISTER_TYPE_ALLIANCE_BOSS;
			msgSoket.subId = Alliance.singleton.MyAllianceId();
			NewSocketNet.instance.Send(msgSoket);
		}

		public void ReqAllianceBossMsg(string _msg, int _levelID, int _layerID)
		{
			IsLayerLegal("ReqAllianceBossMsg", _layerID);
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_REQ_TYPE_MSG;
			if(_msg.Length>MAX_MSG_LENGTH)
				reqMsg.allianceBossMsg = _msg.Substring(0,MAX_MSG_LENGTH);
			else
				reqMsg.allianceBossMsg = _msg;
			reqMsg.levelId = _levelID;
			reqMsg.layerId = _layerID;
			string url = "pveAllianceBoss.php";
			UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossMsg,null,false); 
		}

		private void OkMsgAllianceBossMsg(byte[] result)
		{
		}

		private void OkMsgAllianceBossInfo(byte[] result)
		{
			PBMsgAllianceBossInfo.PBMsgAllianceBossInfo msgAllianceBossInfo  = 
				_Global.DeserializePBMsgFromBytes<PBMsgAllianceBossInfo.PBMsgAllianceBossInfo> (result);
			if(msgAllianceBossInfo.layerList!=null && msgAllianceBossInfo.layerList.Count>0)
			{
				layerList = new List<AllianceBossLayerInfo> ();
				msgAllianceBossInfo.layerList.ForEach(
					i => 
					{
						AllianceBossLayerInfo temBossLayerInfo = new AllianceBossLayerInfo();
						temBossLayerInfo.levelList = new List<int>(i.levelList.ToArray());
						temBossLayerInfo.layer = i.layer-1;
						temBossLayerInfo.factor = i.factor;
						temBossLayerInfo.leaveMsg = new List<string>(i.leaveMsg.ToArray());
						temBossLayerInfo.avatar = new List<string>(i.avatar.ToArray());
						layerList.Add(temBossLayerInfo);
					}
				);
			}
		
			curLayer			= msgAllianceBossInfo.curLayer-1;
			IsLayerLegal("OkMsgAllianceBossMsg", curLayer);
			curLevel			= msgAllianceBossInfo.curLevelId;
			disappearTime		= msgAllianceBossInfo.disappearTime;
			leftAttackNum		= msgAllianceBossInfo.leftAttackNum;
			buff				= msgAllianceBossInfo.buff;
			totalBossHp			= msgAllianceBossInfo.totalBossHp;
			curBossHp			= msgAllianceBossInfo.curBossHp;
			joinPlayerNum		= msgAllianceBossInfo.joinPlayerNum;
			damageRank			= msgAllianceBossInfo.damageRank;
			GetcurLevelIndex ();
			isHaveReward		= msgAllianceBossInfo.hasReward == 1;
			isCurBossFail		= IsFail();

//			TestData ();
			if(GameMain.singleton.curSceneLev()!=GameMain.ALLIANCE_BOSS_LEVEL)
				GameMain.singleton.loadLevel(GameMain.ALLIANCE_BOSS_LEVEL);

			SendSocketRegister ();
		}

		public void ReqMarch(Hashtable data)
		{
			PveController.instance ().ReqMarchAllianceBoss (data, curLevel, curLayer+1);
		}

		private void OkMsgAttack(byte[] result)
		{
		}

		public AllianceBossLayerInfo GetLayerData(int _layer)
		{
			for(int i=0; i<layerList.Count; i++)
			{
				if(layerList[i].layer == _layer)
					return layerList[i];
			}
			return null;
		}

		private void GetcurLevelIndex()
		{
			IsLayerLegal("GetcurLevelIndex", curLayer);
			curLevelIndex = 0;
			for(int i=0; i<layerList[curLayer].levelList.Count; i++)
			{
				if(layerList[curLayer].levelList[i] == curLevel)
				{
					curLevelIndex = i;
				}
			}
		}

		private void TestData()
		{
			layerList = new List<AllianceBossLayerInfo> ();
			layerList.Add (new AllianceBossLayerInfo(1));
			layerList.Add (new AllianceBossLayerInfo(2));
			layerList.Add (new AllianceBossLayerInfo(3));
			layerList.Add (new AllianceBossLayerInfo(4));
			layerList.Add (new AllianceBossLayerInfo(5));
			layerList.Add (new AllianceBossLayerInfo(6));
			curLayer = 2;
			curLevel = 100100104;
			curLevelIndex = 3;
			disappearTime = 0;
			leftAttackNum = 0;
			buff = 15;
			totalBossHp = 100;
			curBossHp = 10;
		}

		public bool IsFail()
		{
			if (curBossHp <= 0)
				return false;
			if (leftAttackNum <= 0)
				return true;
			if (disappearTime>0 && disappearTime <= GameMain.unixtime ())
				return true;
			return false;
		}

		public bool IsOver()
		{
			if (eventEndTime <= GameMain.unixtime ())
				return true;
			return false;
		}

		public bool IsInProgress()
		{
			if (GameMain.unixtime () < eventEndTime && GameMain.unixtime () > startTime)
				return true;
			return false;
		}

		public bool IsActive()
		{
			if (GameMain.unixtime () < eventEndTime && GameMain.unixtime () > notifyTime)
				return true;
			return false;
		}

		private void NextLevel()
		{
			curLevelIndex ++;
			if(curLevelIndex>=layerList[curLayer].levelList.Count)
			{
				curLevelIndex = 0;
				curLayer++;
				if(curLayer>=layerList.Count)
				{
					curLayer = layerList.Count-1;
					curLevelIndex = layerList[curLayer].levelList.Count-1;
				}
			}
			curLevel = layerList[curLayer].levelList[curLevelIndex];
		}

		public void OnAllianceBossAttack()
		{
			if(IsFail())
			{
				//fail
				MenuMgr.instance.PushMenu("PveResultMenu",null,"trans_down" );
			}
			else if (curBossHp <= 0)
			{
				//success
				MenuMgr.instance.PushMenu("PveResultMenu",null,"trans_down" );
				NextLevel();
			}
			else
			{
				MenuMgr.instance.sendNotification (Constant.Notice.PVE_UPDATE_MARCH_DATA,"over");
			}
		}

		public Hashtable GetPreLevelInfo()
		{
			Hashtable newHash = null;
			if(curLevelIndex<=0)
			{
				if(curLayer>0)
				{
					int nCount = layerList[curLayer-1].levelList.Count;
					newHash = new Hashtable(){
						{"levelID",layerList[curLayer-1].levelList[nCount-1]}, 
						{"leveIndex",nCount-1},
						{"layerID",curLayer-1},
						{"factor",layerList[curLayer-1].factor}
					};
				}
			}
			else
			{
				if(curLayer>=0)
				{
					newHash = new Hashtable(){
						{"levelID",layerList[curLayer].levelList[curLevelIndex-1]}, 
						{"leveIndex",curLevelIndex-1},
						{"layerID",curLayer},
						{"factor",layerList[curLayer].factor}
					};
				}
			}
			return newHash;
		}

		public void ReqAllianceBossReset()
		{
			if (!IsInProgress())
				return;
			if (!IsFail())
				return;
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_REQ_TYPE_RESET;
			string url = "pveAllianceBoss.php";
			UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossReset,null,false); 
		}

		private void OkMsgAllianceBossReset(byte[] result)
		{
//			PBMsgAllianceBossInfo.PBMsgAllianceBossInfo msgAllianceBossInfo  = 
//				_Global.DeserializePBMsgFromBytes<PBMsgAllianceBossInfo.PBMsgAllianceBossInfo> (result);
//
//			curLayer			= msgAllianceBossInfo.curLayer-1;
//			curLevel			= msgAllianceBossInfo.curLevelId;
//			disappearTime		= msgAllianceBossInfo.disappearTime;
//			leftAttackNum		= msgAllianceBossInfo.leftAttackNum;
//			totalBossHp			= msgAllianceBossInfo.totalBossHp;
//			curBossHp			= msgAllianceBossInfo.curBossHp;
//			GetcurLevelIndex ();
//			MyItems.singleton.subtractItem(RESET_ITEM_ID);
//
//			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_RESET,"first");
		}

		public void OkMsgAllianceBossSocket(byte[] result)
		{
			if(!isAcceptSocket)
			{
				SendSocketUnRegister();
				UnityEngine.Debug.LogWarning("OkMsgAllianceBossSocket do not need recive!");
				return;
			}
			if (result == null)
			{
				UnityEngine.Debug.LogWarning("OkMsgAllianceBossSocket recive a empty packet!");
				return;
			}
			PBMsgAllianceBossSocket.PBMsgAllianceBossSocket msgAllianceBossSocket  = 
				_Global.DeserializePBMsgFromBytes<PBMsgAllianceBossSocket.PBMsgAllianceBossSocket> (result);
			switch((SCOKET_PACKET_TYPE)msgAllianceBossSocket.type)
			{
			case SCOKET_PACKET_TYPE.SCOKET_PACKET_TYPE_MSG:
				OnMsg(msgAllianceBossSocket);
				break;
			case SCOKET_PACKET_TYPE.SCOKET_PACKET_TYPE_ATTACK:
				OnAttackOver(msgAllianceBossSocket);
				break;
			case SCOKET_PACKET_TYPE.SCOKET_PACKET_TYPE_RESET:
				OnReset(msgAllianceBossSocket);
				break;
			case SCOKET_PACKET_TYPE.SCOKET_PACKET_TYPE_JOIN_PLAYER:
				OnJoinPlayer(msgAllianceBossSocket);
				break;
			default:
				UnityEngine.Debug.LogWarning("PBMsgAllianceBossSocket use an invalid type!");
				break;
			}
			UnityEngine.Debug.Log("PBMsgAllianceBossSocket recive a packet, type = "+msgAllianceBossSocket.type);
		}

		private int GetLevelIndex(int _layer, int _levelID)
		{
			for(int i=0; i<layerList[_layer].levelList.Count; i++)
			{
				if(layerList[_layer].levelList[i] == _levelID)
				{
					return i;
				}
			}
			return -1;
		}

		private bool IsLegal(int _layer, int _levelIndex)
		{
			if(_layer>=0&& _layer<layerList.Count && 
			   _levelIndex>=0 && _levelIndex<layerList[_layer].levelList.Count)
				return true;
			return false;
		}

		private	void OnMsg (PBMsgAllianceBossSocket.PBMsgAllianceBossSocket msgAllianceBossSocket)
		{
			if(msgAllianceBossSocket.layerSpecified && msgAllianceBossSocket.levelIdSpecified && msgAllianceBossSocket.leaveMsgSpecified)
			{
				int layer = msgAllianceBossSocket.layer-1;
				IsLayerLegal("OnMsg", layer);
				int levelIndex = GetLevelIndex(layer, msgAllianceBossSocket.levelId);
				if(!IsLegal(layer, levelIndex))return;
				layerList[layer].leaveMsg[levelIndex] = msgAllianceBossSocket.leaveMsg;
				layerList[layer].avatar[levelIndex] = msgAllianceBossSocket.avatar;
				Hashtable newHash = new Hashtable(){
					{"layer",layer}, 
					{"levelIndex",levelIndex},
					{"msg",msgAllianceBossSocket.leaveMsg},
					{"avatar",msgAllianceBossSocket.avatar}
				};
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_MSG,newHash);
			}
			else
				UnityEngine.Debug.Log("PBMsgAllianceBossSocket msg invalid");
		}

		private	void OnAttackOver (PBMsgAllianceBossSocket.PBMsgAllianceBossSocket msgAllianceBossSocket)
		{
			if(msgAllianceBossSocket.damageSpecified && msgAllianceBossSocket.attackerNameSpecified && msgAllianceBossSocket.totalbuffSpecified &&
				msgAllianceBossSocket.increbuffSpecified && msgAllianceBossSocket.isBossDieSpecified && msgAllianceBossSocket.curtotalBossHpSpecified &&
				msgAllianceBossSocket.curBossHpSpecified && msgAllianceBossSocket.curRankSpecified && msgAllianceBossSocket.leftAttackNumSpecified)
			{
				if (msgAllianceBossSocket.layer - 1 < curLayer ||
				    (msgAllianceBossSocket.layer - 1 == curLayer &&  GetLevelIndex(curLayer,  msgAllianceBossSocket.levelId) < curLevelIndex))
				{
					if(msgAllianceBossSocket.attackerName == GameMain.singleton.getUserName())
					{
						PveController.instance ().OnAllianceBossMarchOver();
					}
					return;
				}

				isBossDie		= msgAllianceBossSocket.isBossDie == 1;
				curDamage		= msgAllianceBossSocket.damage;
				attackerName	= msgAllianceBossSocket.attackerName;
				buff			= msgAllianceBossSocket.totalbuff;
				increbuff		= msgAllianceBossSocket.increbuff;
				changeRank		= msgAllianceBossSocket.curRank - damageRank;
				damageRank		= msgAllianceBossSocket.changeRank;
				leftAttackNum	= msgAllianceBossSocket.leftAttackNum;
				totalBossHp		= msgAllianceBossSocket.curtotalBossHp;
				curBossHp		= msgAllianceBossSocket.curBossHp;
				rewardItem		= JSONParse.instance.Parse(msgAllianceBossSocket.item);
				curLayer		= msgAllianceBossSocket.layer-1;
				IsLayerLegal("OnAttackOver", curLayer);
				curLevel		= msgAllianceBossSocket.levelId;
				GetcurLevelIndex ();
				isCurBossFail	= IsFail();
				if(msgAllianceBossSocket.disappearTimeSpecified)
					disappearTime = msgAllianceBossSocket.disappearTime;
				if(attackerName == GameMain.singleton.getUserName())
				{
					PveController.instance ().OnAllianceBossMarchOver();
				}
//				if(isBossDie)
//					NextLevel();
				if(isBossDie && attackerName == GameMain.singleton.getUserName())
				{
					MenuMgr.instance.PushMenu("PveResultMenu","alliance_boss","trans_down" );
					isAllianceBossDie = true;
				}
				else if(IsFail())
				{
					MenuMgr.instance.PushMenu("PveResultMenu","alliance_boss","trans_down" );
				}
				else
				{
					MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_OTHER_ATTACK, null);
				}
			}
			else
				UnityEngine.Debug.Log("PBMsgAllianceBossSocket attack invalid");
		}

		private	void OnReset(PBMsgAllianceBossSocket.PBMsgAllianceBossSocket msgAllianceBossSocket)
		{
			curLayer			= msgAllianceBossSocket.layer-1;
			IsLayerLegal("OnReset", curLayer);
			curLevel			= msgAllianceBossSocket.levelId;
			disappearTime		= msgAllianceBossSocket.disappearTime;
			leftAttackNum		= msgAllianceBossSocket.leftAttackNum;
			totalBossHp			= msgAllianceBossSocket.curtotalBossHp;
			curBossHp			= msgAllianceBossSocket.curBossHp;
			buff				= msgAllianceBossSocket.totalbuff;
			GetcurLevelIndex ();
			if(msgAllianceBossSocket.attackerName == GameMain.singleton.getUserName())
			{
				MyItems.singleton.subtractItem(RESET_ITEM_ID);
			}
			if(MenuMgr.instance.GetCurMenuName() == "AllianceBossResetMenu")
			{
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_RESET,"first");
			}
			else
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_RESET,"second");
		}

		private	void OnJoinPlayer (PBMsgAllianceBossSocket.PBMsgAllianceBossSocket msgAllianceBossSocket)
		{
			if(msgAllianceBossSocket.joinPlayerNumSpecified)
			{
				joinPlayerNum = msgAllianceBossSocket.joinPlayerNum;
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_MSG,null);
			}
			else
				UnityEngine.Debug.Log("PBMsgAllianceBossSocket join player invalid");
		}

		private void OnNetworkError(NetworkErrorCode errorCode, string errorMessage)
		{
			//close the menu
			MenuMgr.instance.sendNotification (Constant.Notice.SOCKET_ERROR,null);
		}

		private void OnNetworkConnected()
		{
//			if(isAcceptSocket)
//				SendSocketRegister();
//			else
//				SendSocketUnRegister();
			MenuMgr.instance.sendNotification (Constant.Notice.SOCKET_RE_CONNECT,null);
		}

		public Hashtable GetShowTime()
		{
			Hashtable timeData = new Hashtable ();
			if(GameMain.unixtime () < startTime)
			{
				timeData["time"] = startTime - GameMain.unixtime ();
				timeData["type"] = EVENT_TIME_STATE.NOT_START;
			}
			else if(GameMain.unixtime () < eventEndTime)
			{
				timeData["time"] = eventEndTime - GameMain.unixtime ();
				timeData["type"] = EVENT_TIME_STATE.START;
			}
			else
			{
				timeData["time"] = 0;
				timeData["type"] = EVENT_TIME_STATE.OVER;
			}
			return timeData;
		}

		public void ReqAllianceBossTroopInfo()
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_TROOP_INFO;
			string url = "pveAllianceBoss.php";
			UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossTroopInfo,null,false); 
		}

		private void OkMsgAllianceBossTroopInfo(byte[] result)
		{
			if(result == null)
			{
				MenuMgr.instance.PushMessage(Datas.getArString("Event.Losttroop_Empty"));
				return;
			}

			PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop msgReturn  = 
				_Global.DeserializePBMsgFromBytes<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop> (result);
			List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.city> cities = msgReturn.cityInfo;
			HashObject idNumPairs = new HashObject();
			for( int i = 0; i < cities.Count; ++i ) {
				int cityID = cities[i].cityId;
				List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.unit> troop = cities[i].troop;
				for( int j = 0; j < troop.Count; ++j ) {
					int troopID = troop[j].unitId;
					int num = troop[j].num;
					
					string key = ""+troopID;
					if( idNumPairs[key] == null ) {
						idNumPairs[key] = new HashObject();
						idNumPairs[key].Value = "0";
					}
					int curNum = _Global.INT32( idNumPairs[key].Value as string );
					curNum += num;
					idNumPairs[key].Value = ""+curNum;
					
				}
			}
			string dataString = "";
			string[] keys = _Global.GetObjectKeys( idNumPairs );
			for( int i = 0; i < keys.Length; ++i ) {
				dataString += ( i == 0 ? "" : "_" ) + keys[i] + "_" + ( idNumPairs[keys[i]].Value as string );
			}

			HashObject paramHash = new HashObject(
				new Hashtable(){
					{"MenuType" , 1},
					{"Data" , dataString},
					{"isViewTroop" , true},
				}
			);
			if(MenuMgr.instance.GetCurMenuName() != "TournamentTroopRestoreMenu")
				MenuMgr.instance.PushMenu("TournamentTroopRestoreMenu",paramHash,"trans_zoomComp" );
			else
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_TROOP_DATA_OK, paramHash);
		}

		public void ReqAllianceBossTroopReturn()
		{
			HashObject seed = GameMain.singleton.getSeed();
			if(seed["pveAllianceBoss"] != null && _Global.INT32(seed["pveAllianceBoss"]["troopReturn"]) != 0)
			{
				PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
				reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_TROOP_RETURN;
				string url = "pveAllianceBoss.php";
				UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossTroopReturn,null,false); 
			}
		}
		
		private void OkMsgAllianceBossTroopReturn(byte[] result)
		{
			PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop msgReturn  = 
				_Global.DeserializePBMsgFromBytes<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop> (result);
			List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.city> cities = msgReturn.cityInfo;

			HashObject idNumPairs = new HashObject();
			for( int i = 0; i < cities.Count; ++i ) {
				int cityID = cities[i].cityId;
				List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.unit> troop = cities[i].troop;
				for( int j = 0; j < troop.Count; ++j ) {
					int troopID = troop[j].unitId;
					int num = troop[j].num;
					KBN.BarracksBase.baseSingleton.addUnitsToSeed( troopID, num, cityID );

					string key = ""+troopID;
					if( idNumPairs[key] == null ) {
						idNumPairs[key] = new HashObject();
						idNumPairs[key].Value = "0";
					}
					int curNum = _Global.INT32( idNumPairs[key].Value as string );
					curNum += num;
					idNumPairs[key].Value = ""+curNum;
				}
			}
			string dataString = "";
			string[] keys = _Global.GetObjectKeys( idNumPairs );
			for( int i = 0; i < keys.Length; ++i ) {
				dataString += ( i == 0 ? "" : "_" ) + keys[i] + "_" + ( idNumPairs[keys[i]].Value as string );
			}
			HashObject paramHash = new HashObject(
				new Hashtable(){
				{"MenuType" , 1},
				{"Data" , dataString},
				{"isViewTroop" , false},
			}
			);
			if(MenuMgr.instance.GetCurMenuName() != "TournamentTroopRestoreMenu")
				MenuMgr.instance.PushMenu("TournamentTroopRestoreMenu",paramHash,"trans_zoomComp" );
			else
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_TROOP_DATA_OK, paramHash);

			HashObject seed = GameMain.singleton.getSeed();
			if (seed["pveAllianceBoss"] != null && seed["pveAllianceBoss"]["troopReturn"] != null)
				seed["pveAllianceBoss"]["troopReturn"].Value = 0;
//			MenuMgr.instance.PushMessage(Datas.getArString("Dungeon.NoTroop"));
		}

		public void UpdateSeed(HashObject allianceBossSeed)
		{
			if(allianceBossSeed==null)
			{
				if(isSeedHaveEndTime)
				{
					GameMain.singleton.UpdateAllianceBossSlot(false);
					isSeedHaveEndTime = false;
				}
				return;
			}
			if(allianceBossSeed["troopReturn"] != null)
			{
				int troopReturnStep = _Global.INT32(allianceBossSeed["troopReturn"]);
				if(troopReturnStep == REQ_ALLIANCE_BOSS_TROOP_RETURN)
				{
					ReqAllianceBossTroopReturn();
				}
			}

			if(allianceBossSeed["eventEndTime"] == null && isSeedHaveEndTime)
			{
				GameMain.singleton.UpdateAllianceBossSlot(false);
				isSeedHaveEndTime = false;
			}
			else if(allianceBossSeed["eventEndTime"] != null && !isSeedHaveEndTime)
			{
				GameMain.singleton.UpdateAllianceBossSlot(true);
				isSeedHaveEndTime = true;
			}
		}

		public int GetCurLevelMarchTime()
		{
			DataTable.PveLevel gdsPveLevelInfo = GameMain.GdsManager.GetGds<GDS_PveLevel>().GetItemById(curLevel);
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

		public void OnMarchError()
		{
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_ERROR,null);
		}

		public bool IsLast()
		{
			if(curLayer==layerList.Count-1 && curLevelIndex==layerList[curLayer].levelList.Count-1)
				return true;
			return false;
		}

		public void IsLayerLegal(string strFunc, int _layer)
		{
			if(_layer<0 || _layer>=layerList.Count)
				throw new System.ApplicationException(strFunc+" Error. layer = "+_layer);
		}

		public void Update()
		{
			if(eventEndTime == 0)
			{
				eventState = EVENT_TIME_STATE.NOT_START;
				return;
			}

			if(GameMain.unixtime () < startTime)
			{
				eventState = EVENT_TIME_STATE.NOT_START;
				return;
			}

			if(eventState == EVENT_TIME_STATE.NOT_START && GameMain.unixtime () > startTime)
			{
				eventState = EVENT_TIME_STATE.START;
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_STATE_CHANGE,null);
			}
			else if(eventState == EVENT_TIME_STATE.START && GameMain.unixtime () > eventEndTime)
			{
				eventState = EVENT_TIME_STATE.OVER;
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_STATE_CHANGE,null);

				// to refresh "isHaveReward"
				LeaderBoardController.instance().ReqAllianceBossDamageLeaderBoard(LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT, 0);
			}

			if(isAcceptSocket)
			{
				if(!isCurBossFail && disappearTime <= GameMain.unixtime ())
				{
					isCurBossFail = true;
					MenuMgr.instance.PushMenu("PveResultMenu","alliance_boss","trans_down" );
				}
			}
		}

		public void ReqAllianceBossReward()
		{
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.ALLIANCE_BOSS_REWARD;
			string url = "pveAllianceBoss.php";
			UnityNet.RequestForGPB (url,reqMsg,OkMsgAllianceBossReward,null,false); 
		}

		private void OkMsgAllianceBossReward(byte[] result)
		{
			PBMsgPveAllianceBossEvent.PBMsgPveAllianceBossEvent msgReward  = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveAllianceBossEvent.PBMsgPveAllianceBossEvent> (result);
			int nIndex = 1;
			Dictionary<int, Hashtable> allianceData = new Dictionary<int, Hashtable>();
			for(int i=0; i<msgReward.rewards.Count; i++)
			{
				if(allianceData.ContainsKey(msgReward.rewards[i].min))
				{
					((Hashtable)allianceData[msgReward.rewards[i].min]["bonus"]).Add(msgReward.rewards[i].itemId+"",msgReward.rewards[i].num);
				}
				else
				{
					Hashtable tempHash = new Hashtable(){
						{"nIndex",nIndex},
						{"min",msgReward.rewards[i].min},
						{"max",msgReward.rewards[i].max},
						{"isAlliance",true},
						{
							"bonus",new Hashtable(){
							{msgReward.rewards[i].itemId+"",msgReward.rewards[i].num},
							}
						},
					};
					allianceData.Add(msgReward.rewards[i].min, tempHash);
					nIndex++;
				}
			}

			nIndex = 1;
			Dictionary<int, Hashtable> playerData = new Dictionary<int, Hashtable>();
			for(int i=0; i<msgReward.playerRewards.Count; i++)
			{
				if(playerData.ContainsKey(msgReward.playerRewards[i].min))
				{
					((Hashtable)playerData[msgReward.playerRewards[i].min]["bonus"]).Add(msgReward.playerRewards[i].itemId+"",msgReward.playerRewards[i].num);
				}
				else
				{
					Hashtable tempHash = new Hashtable(){
						{"nIndex",nIndex},
						{"min",msgReward.playerRewards[i].min},
						{"max",msgReward.playerRewards[i].max},
						{"isAlliance",false},
						{
							"bonus",new Hashtable(){
								{msgReward.playerRewards[i].itemId+"",msgReward.playerRewards[i].num},
							}
						},
					};
					playerData.Add(msgReward.playerRewards[i].min, tempHash);
					nIndex++;
				}
			}

			Hashtable rewardData = new Hashtable (){
				{"alliance",allianceData},
				{"player",playerData},
			};
			MenuMgr.instance.PushMenu("AllianceBossRewardMenu", rewardData, "trans_zoomComp");
		}
	}
}
