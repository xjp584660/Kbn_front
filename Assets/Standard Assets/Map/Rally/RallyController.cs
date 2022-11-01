using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;

namespace KBN
{
	public enum RALLY_MARCH_STATUS
	{
		NotReachRallyPoint = 1,// 1.未到达集结点
		ReachRallyPoint = 2,   // 2.已到达集结点
	} 

	public enum RALLY_STATUS
	{
		Rally_Waiting = 1,   // 1.等待中
		Rally_OutBound = 2,  // 2.出发
		Rally_Return = 3,    // 3.返回
		Rally_Cancel = 4,    // 4.取消
	}

	public class RallyDetailedData
	{
		public PBMsgRallySocket.PBMsgRallySocket pBMsgRallySocket = new PBMsgRallySocket.PBMsgRallySocket();
		public string toAllianceName;
		public string toUserPhoto;
		public string toUserName;
		
		public Dictionary<int, RallyPartnerInfo> partnerInfos = new Dictionary<int, RallyPartnerInfo>();
	}

	// 参与集结者信息
	public class RallyPartnerInfo
	{
		public string fromName;
		public string fromUserPhoto;
		public int rallyMarchStatus;  // 1.未到达集结点 2.已到达集结点
		public int endTime;
		public int troopTotal; 
		public int fromUserId;
		public int rallyId;

		public bool isSelected = false;

		public Dictionary<int, int> units = new Dictionary<int, int>();
	}

	public class RallyController
	{
		private Dictionary<int, PBMsgRallySocket.PBMsgRallySocket> rallyLists;
		private bool isCanPullRallyList = true;

		protected static RallyController singleton = null;

		public static RallyController instance()
		{
			if( singleton == null )
			{
				singleton = new RallyController();
			}
			return singleton as RallyController;
		}

		public RallyController()
		{
			rallyLists = new Dictionary<int, PBMsgRallySocket.PBMsgRallySocket>();
		}

		public void Init()
		{
			NewSocketNet.instance.RegisterConnectedHandlers(OnNewNetworkNodeConnected);
			//getRallyMarchList();
		}

		// socket重连后要重新拉取集结列表
		private void OnNewNetworkNodeConnected()
	    {
	    	//_Global.LogWarning("RallyController.OnNewNetworkNodeConnected  reconnect success!!!!!");
	    	//getRallList();
			//getRallyMarchList();
	    }

	    public void getRallList()
	    {
			if(Alliance.singleton != null)
			{
				int cityId = GameMain.singleton.getCurCityId();
		    	int userId = GameMain.singleton.getUserId();
		    	int allianceId = Alliance.singleton.MyAllianceId();
		        UnityNet.getRallyList(userId, allianceId, cityId, getRallyListOK, getRallyListError);
			}   	
	    }

	    private void getRallyListError(string errorMessage, string errorCode)
	    {

	    }

	    // 获取集结列表
	    private void getRallyListOK(HashObject result)
		{
			if(_Global.GetBoolean(result["ok"]))
			{
				rallyLists.Clear();

				HashObject rallys = result["rally"];
				int rallyCount = _Global.GetObjectValues(rallys).Length;

				for( int i = 0; i < rallyCount; i ++ )
				{
					HashObject r = rallys[_Global.ap + i];
					PBMsgRallySocket.PBMsgRallySocket temp = new PBMsgRallySocket.PBMsgRallySocket();

					temp.rallyId = _Global.INT32(r["rallyId"]);
					temp.fromUserId = _Global.INT32(r["fromUserId"]);
					temp.fromAllianceId = _Global.INT32(r["fromAllianceId"]);
					temp.toUserId = _Global.INT32(r["toUserId"]);
					temp.toAllianceId = _Global.INT32(r["toAllianceId"]);
					temp.rallyStatus = _Global.INT32(r["rallyStatus"]);
					temp.fromName = r["fromName"].Value.ToString();
					temp.fromUserPhoto = r["fromUserPhoto"].Value.ToString();
					temp.fromX = _Global.INT32(r["fromX"]);
					temp.fromY = _Global.INT32(r["fromY"]);
					temp.toName = r["toName"].Value.ToString();
					temp.toX = _Global.INT32(r["toX"]);
					temp.toY = _Global.INT32(r["toY"]);
					temp.startTimeStamp = _Global.INT32(r["startTimeStamp"]);
					temp.endTimeStamp = _Global.INT32(r["endTimeStamp"]);
					temp.maxCount = _Global.INT32(r["maxCount"]);
					temp.curCount = _Global.INT32(r["curCount"]);
					temp.maxSize = _Global.INT32(r["maxSize"]);
					temp.curSize = _Global.INT32(r["curSize"]);

					AddRally(temp);
				}
			}
		}

		public void getRallyDetailedInfo(int rallyId)
		{
			int cityId = GameMain.singleton.getCurCityId();
	    	int userId = GameMain.singleton.getUserId();
	    	int allianceId = Alliance.singleton.MyAllianceId();
	        UnityNet.getRallyDetailedInfo(userId, allianceId, cityId, rallyId, getRallyDetailedInfoOK, getRallyDetailedInfoError);
		}

	    private void getRallyDetailedInfoError(string errorMessage, string errorCode)
	    {

	    }

	    // 集结详细信息
	    private void getRallyDetailedInfoOK(HashObject result)
		{
			if(_Global.GetBoolean(result["ok"]))
			{
				HashObject rally = result["rally"];

				RallyDetailedData detailedData = new RallyDetailedData();

				int rallyId = _Global.INT32(rally["rallyId"]);
				if(rallyLists.ContainsKey(rallyId))
				{
					detailedData.pBMsgRallySocket = rallyLists[rallyId];
				}
				else
				{
					// todo 此集结结束
					return;
				}

				detailedData.toAllianceName = rally["toAllianceName"].Value.ToString();
				detailedData.toUserPhoto = rally["toUserPhoto"].Value.ToString();
				detailedData.toUserName = rally["toUserName"].Value.ToString();

				HashObject marchs = rally["marches"];
				int marchCount = _Global.GetObjectValues(marchs).Length;

				for( int i = 0; i < marchCount; i ++ )
				{
					HashObject m = marchs[_Global.ap + i];
					RallyPartnerInfo parInfo = new RallyPartnerInfo();

					parInfo.fromName = m["fromName"].Value.ToString();
					parInfo.fromUserPhoto = m["fromUserPhoto"].Value.ToString();
					parInfo.rallyMarchStatus = _Global.INT32(m["rallyMarchStatus"]);
					parInfo.endTime = _Global.INT32(m["destinationEta"].Value);
					parInfo.troopTotal = _Global.INT32(m["headCount"].Value);
					parInfo.fromUserId = _Global.INT32(m["fromUserId"].Value);
					parInfo.rallyId = rallyId;

					HashObject units = m["units"];
					string[] keys = _Global.GetObjectKeys(units);
					for(int j = 0; j < keys.Length; j ++)
					{
						int unitID = _Global.INT32(keys[j]);
						int troopCount = _Global.INT32(units[keys[j]]);
						parInfo.units.Add(unitID, troopCount);
					}

					detailedData.partnerInfos.Add(parInfo.fromUserId, parInfo);
				}

				MenuMgr.instance.sendNotification (Constant.Action.RALLY_DETAILED_INFO_PUSH,detailedData);
			}
		}

		public void getRallyMarchList()
		{
			UnityNet.getRallyMarchList(getRallyMarchListOK, getRallyMarchListError);
		}

		private void getRallyMarchListError(string errorMessage, string errorCode)
	    {

	    }

	    // 断线重连后获取所有集结march信息
	    private void getRallyMarchListOK(HashObject result)
		{
			if (result["marches"]!=null && result["marches"].ToString()!="") 
			{
				HashObject marchs = result["marches"];
				int marchCount = _Global.GetObjectValues(marchs).Length;

				List<PBMsgMarchInfo.PBMsgMarchInfo> myRallyMarchs = new List<PBMsgMarchInfo.PBMsgMarchInfo>();

				for( int i = 0; i < marchCount; i ++ )
				{
					HashObject marchInfo = marchs[_Global.ap + i];

					PBMsgMarchInfo.PBMsgMarchInfo march = new PBMsgMarchInfo.PBMsgMarchInfo();
					march.marchId =_Global.INT32(marchInfo["marchId"]);
					march.fromX =_Global.INT32(marchInfo["fromX"]);
					march.fromY =_Global.INT32(marchInfo["fromY"]);
					march.toX =_Global.INT32(marchInfo["toX"]);
					march.toY =_Global.INT32(marchInfo["toY"]);
					march.marchType =_Global.INT32(marchInfo["marchType"]);
					march.marchStatus =_Global.INT32(marchInfo["marchStatus"]);
					march.startTimeStamp =_Global.INT32(marchInfo["startTimeStamp"]);
					march.endTimeStamp =_Global.INT32(marchInfo["endTimeStamp"]);
					march.fromPlayerId =_Global.INT32(marchInfo["fromPlayerId"]);
					march.worldBossId =_Global.INT32(marchInfo["worldBossId"]);
					march.oneWayTime =_Global.INT32(marchInfo["oneWayTime"]);
					march.rallyId =_Global.INT32(marchInfo["rallyId"]);
					march.toAllianceId =_Global.INT32(marchInfo["toAllianceId"]);
					march.fromAllianceId =_Global.INT32(marchInfo["fromAllianceId"]);
					
					if(march.fromPlayerId == GameMain.singleton.getUserId())
					{
						changeRallyMarchItem(march);
						myRallyMarchs.Add(march);
					}
					else
					{
						if(march.marchStatus != Constant.MarchStatus.OUTBOUND)
						{
							KBN.RallyBossMarchController.instance().AddMarch(march);
						}						
					}
				}

				if(myRallyMarchs.Count > 0)
				{
					GameMain.singleton.checkMySelfRallyMarchIsReturn(myRallyMarchs);
				}
			}
		}

		public List<PBMsgRallySocket.PBMsgRallySocket> GetRallyList()
		{
			List<PBMsgRallySocket.PBMsgRallySocket> rallyTempList = new List<PBMsgRallySocket.PBMsgRallySocket>();
			var rallys = rallyLists.GetEnumerator();
			while(rallys.MoveNext())
			{
				rallyTempList.Add(rallys.Current.Value);
			}

			return rallyTempList;
		}

		public void changeRallyMarchItem(PBMsgMarchInfo.PBMsgMarchInfo march)
		{
			GameMain.singleton.changeRallyMarchItem(march);
		}

		// 集结数据变更
		public void OnRallySocketMsgReceive(byte[] result)
		{
			if (result == null)
			{
				UnityEngine.Debug.LogWarning("RallyController.OnRallySocketMsgReceive recive a empty packet!");
				return;
			}

			PBMsgRallySocket.PBMsgRallySocket rallyMsg = _Global.DeserializePBMsgFromBytes<PBMsgRallySocket.PBMsgRallySocket>(result);
//			_Global.LogWarning("RallyController.OnRallySocketMsgReceive PBMsgRallySocket rallyId : " + rallyMsg.rallyId + " fromUserId : "
//				+ rallyMsg.fromUserId + " fromAllianceId : " + rallyMsg.fromAllianceId + " fromName : " + rallyMsg.fromName + " fromX : " + 
//				rallyMsg.fromX + " fromY : " + rallyMsg.fromY + " toUserId : " + rallyMsg.toUserId + " toAllianceId : " + rallyMsg.toAllianceId
//				+ " toName : " + rallyMsg.toName + " toX : " + rallyMsg.toX + " toY : " + rallyMsg.toY + " rallyStatus : " + rallyMsg.rallyStatus
//				+ " startTimeStamp : " + rallyMsg.startTimeStamp + " endTimeStamp : " + rallyMsg.endTimeStamp + " maxCount : " + 
//				rallyMsg.maxCount + " curCount : " + rallyMsg.curCount + " maxSize : " + rallyMsg.maxSize + " curSize : " + rallyMsg.curSize);

			AddRally(rallyMsg);

			if(rallyMsg.rallyStatus != (int)RALLY_STATUS.Rally_Return)
			{
				MenuMgr.instance.sendNotification (Constant.Action.RALLY_DATA_UPDATE,rallyMsg);
			}
		}

		private void AddRally(PBMsgRallySocket.PBMsgRallySocket rally)
		{
			if(rallyLists.ContainsKey(rally.rallyId))
			{
				// 返回状态时删除
				if(rally.rallyStatus == (int)RALLY_STATUS.Rally_Return || rally.rallyStatus == (int)RALLY_STATUS.Rally_Cancel)
				{
					rallyLists.Remove(rally.rallyId);
					MenuMgr.instance.sendNotification (Constant.Action.RALLY_DATA_REMOVE,rally.rallyId);
				}
				else
				{
					rallyLists[rally.rallyId] = rally;	

				}
			}
			else
			{
				rallyLists.Add(rally.rallyId, rally);
			}
		}
	}
}
