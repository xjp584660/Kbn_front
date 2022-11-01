//for pve and hero
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;

namespace KBN
{
	public class LeaderBoardController
	{
		protected static LeaderBoardController singleton = null;

		LeaderBoardInfoBase leaderBoarddata;

		public List<LeaderBoardItemInfo> GetDataList()
		{
			if(leaderBoarddata!=null)
				return leaderBoarddata.leaderBoardList;
			return null;
		}

		public static LeaderBoardController instance()
		{
			if( singleton == null )
			{
				singleton = new LeaderBoardController();
				KBN.GameMain.singleton.resgisterRestartFunc(new Action(priv_OnGameRestart));
			}
			return singleton as LeaderBoardController;
		}
		
		private static void priv_OnGameRestart()
		{
			singleton = null;
		}

		public LeaderBoardInfoBase GetLeaderBoard()
		{
			return leaderBoarddata;
		}

		private PBMsgLeaderboard.PBMsgLeaderboard FillDefaltData(byte[] result)
		{
			PBMsgLeaderboard.PBMsgLeaderboard msgLeaderBoard = 
				_Global.DeserializePBMsgFromBytes<PBMsgLeaderboard.PBMsgLeaderboard> (result);
			
			leaderBoarddata.total = msgLeaderBoard.total;
			leaderBoarddata.position = msgLeaderBoard.position;
			leaderBoarddata.score = msgLeaderBoard.score;
			if(msgLeaderBoard.pageSpecified)
				leaderBoarddata.curPage = msgLeaderBoard.page;
			int curStartIndex = (leaderBoarddata.curPage-1) * leaderBoarddata.PAGESIZE;
			leaderBoarddata.leaderBoardList.Clear ();
			
			if(msgLeaderBoard.data!=null)
			{
				for(int i = 0; i<msgLeaderBoard.data.Count; i++)
				{
					PBMsgLeaderboard.PBMsgLeaderboard.PBMsgPveLeaderboardList leaderItem = msgLeaderBoard.data[i];
					leaderBoarddata.leaderBoardList.Add(new LeaderBoardItemInfo(leaderItem.userId,curStartIndex+i+1,leaderItem.score,leaderItem.displayName,leaderItem.allianceId,leaderItem.allianceName,leaderItem.reward));
				}
			}
			return msgLeaderBoard;
		}
		
		private PBMsgReqLeaderboard.PBMsgReqLeaderboard CreateDefaltMsg(LeaderBoardInfoBase.LEADERBOARD_TYPE leaderboardType, int page)
		{
			PBMsgReqLeaderboard.PBMsgReqLeaderboard reqMsg = new PBMsgReqLeaderboard.PBMsgReqLeaderboard ();
			reqMsg.leaderboardType = (int)leaderboardType;
			leaderBoarddata.curPage = reqMsg.page = page;
			reqMsg.pageSize = leaderBoarddata.PAGESIZE;
			return reqMsg;
		}

		public void ReqLeaderBoardReward(int _userId, int _allinaceId)
		{
			PBMsgReqLeaderboardReward.PBMsgReqLeaderboardReward reqMsg = new PBMsgReqLeaderboardReward.PBMsgReqLeaderboardReward ();
			reqMsg.leaderboardType = (int)leaderBoarddata.leaderBoardType;
			reqMsg.userId = _userId;
			reqMsg.allianceId = _allinaceId;
			reqMsg.isGet = 0;
			string url = "pveLeaderboard.php";
			System.Action<byte[]> okFunc = (result) =>
			{	
				OkMsgLeaderBoardReward(result, _userId, _allinaceId);
			};
			UnityNet.RequestForGPB(url,reqMsg,okFunc); 
		}

		public void OkMsgLeaderBoardReward(byte[] result, int _userId, int _allinaceId)
		{
			PBMsgLeaderboardReward.PBMsgLeaderboardReward msg = 
				_Global.DeserializePBMsgFromBytes<PBMsgLeaderboardReward.PBMsgLeaderboardReward> (result);
			if(msg.isGet == 0)
			{
				if(msg.itemList.Count != msg.itemNumList.Count)
				{
					Debug.LogError("PBMsgLeaderboardReward error! ");
					return;
				}
				Hashtable itemHash = new Hashtable();
				for(int i=0; i<msg.itemList.Count; i++)
				{
					itemHash[msg.itemList[i]] = msg.itemNumList[i];
				}

				bool hasReward = false;
				if(Datas.singleton.tvuid() != _userId || Alliance.singleton.MyAllianceId() != _allinaceId)
					hasReward = true;

				HashObject id = new HashObject(new Hashtable(){
					{"Category","Chest"},
					{"inShop",false},
					{"hasReward",hasReward},
					{"bonus",itemHash},
					{"acqBonusOccasion","pve"},
				});
				MenuMgr.instance.PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
			}
		}

		public void ReqGetLeaderBoardReward()
		{
			PBMsgReqLeaderboardReward.PBMsgReqLeaderboardReward reqMsg = new PBMsgReqLeaderboardReward.PBMsgReqLeaderboardReward ();
			reqMsg.leaderboardType = (int)leaderBoarddata.leaderBoardType;
			reqMsg.userId = Datas.singleton.tvuid();
			reqMsg.allianceId = Alliance.singleton.MyAllianceId();
			reqMsg.isGet = 1;
			string url = "pveReward.php";
			UnityNet.RequestForGPB(url,reqMsg,OkMsgReqGetLeaderBoardReward); 
		}

		public void OkMsgReqGetLeaderBoardReward(byte[] result)
		{
			AllianceBossDamageLeaderBoard temData = (AllianceBossDamageLeaderBoard)leaderBoarddata;
			Func<LeaderBoardItemInfo, LeaderBoardInfoBase.LEADERBOARD_TYPE, bool> JudgeFunc = delegate(LeaderBoardItemInfo item, LeaderBoardInfoBase.LEADERBOARD_TYPE leaderType){
				switch(leaderType)
				{
				case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT:
				case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_LASTTIME:
					if(item.allianceId == Alliance.singleton.MyAllianceId())
						return true;
					break;
				case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_CURRENT:
				case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_LASTTIME:
					if(item.userID == Datas.singleton.tvuid())
						return true;
					break;
				}
				return false;
			};

			temData.leaderBoardList.ForEach(itemData=>{
				if(JudgeFunc(itemData,temData.leaderBoardType))
				{
					foreach(string itemKey in itemData.reward.Keys)
					{
						int itemID = _Global.INT32(itemKey);
						int itemNum = _Global.INT32(itemData.reward[itemKey]);
						MyItems.singleton.AddItemWithCheckDropGear(itemID, itemNum);
					}
				}
			});
			switch(temData.leaderBoardType)
			{
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT:
				temData.curAlReward = false;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_LASTTIME:
				temData.lastAlReward = false;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_CURRENT:
				temData.curPerReward = false;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_LASTTIME:
				temData.lastPerReward = false;
				break;
			}
			temData.hasReward = false;
			RefreshAllianceBossReward(temData);
			MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH,null);
		}

		public void ReqPveLeaderBoard(int leaderboardType, int chapterId, int page)
		{
			leaderBoarddata = new LeaderBoardInfoBase();
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_LEADERBOARD_PVE;
			reqMsg.leaderboardType = leaderboardType;
			leaderBoarddata.leaderBoardType = (LeaderBoardInfoBase.LEADERBOARD_TYPE) leaderboardType;
			reqMsg.chapterId = chapterId;
			leaderBoarddata.curPage = reqMsg.page = page;
			reqMsg.pageSize = leaderBoarddata.PAGESIZE;
			
			string url = "pve.php";
			//leaderBoardOKFunc = OkMsgPveLeaderBoard;
			UnityNet.RequestForGPB(url,reqMsg,OkMsgPveLeaderBoard); 
		}

		private void OkMsgPveLeaderBoard(byte[] result)
		{
			PBMsgPveLeaderboard.PBMsgPveLeaderboard msgLeaderBoard = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveLeaderboard.PBMsgPveLeaderboard> (result);
			
			leaderBoarddata.total = msgLeaderBoard.total;
			leaderBoarddata.position = msgLeaderBoard.position;
			leaderBoarddata.score = msgLeaderBoard.score;
			
			int curStartIndex = (leaderBoarddata.curPage-1) * leaderBoarddata.PAGESIZE;
			leaderBoarddata.leaderBoardList.Clear ();

			if(msgLeaderBoard.data!=null)
			{
				for(int i = 0; i<msgLeaderBoard.data.Count; i++)
				{
					PBMsgPveLeaderboard.PBMsgPveLeaderboard.PBMsgPveLeaderboardList leaderItem = msgLeaderBoard.data[i];
					leaderBoarddata.leaderBoardList.Add(new LeaderBoardItemInfo(leaderItem.userId,curStartIndex+i+1,leaderItem.score,leaderItem.displayName,leaderItem.allianceId,leaderItem.allianceName,null));
				}
			}
			MenuMgr.instance.sendNotification (Constant.Notice.PVE_LEADER_BOARD_OK,null);
		}

		public void ReqHeroLeaderBoard(int leaderboardType, int page)
		{
			leaderBoarddata = new LeaderBoardInfoBase();
			PBMsgReqHeroLeaderboard.PBMsgReqHeroLeaderboard reqMsg = new PBMsgReqHeroLeaderboard.PBMsgReqHeroLeaderboard ();
			reqMsg.leaderboardType = leaderboardType;
			leaderBoarddata.curPage = reqMsg.page = page;
			reqMsg.pageSize = leaderBoarddata.PAGESIZE;
			
			string url = "heroLeaderboard.php";
			//leaderBoardOKFunc = OkMsgHeroLeaderBoard;
			UnityNet.RequestForGPB(url,reqMsg,OkMsgHeroLeaderBoard,null); 
		}
		
		private void OkMsgHeroLeaderBoard(byte[] result)
		{
			PBMsgPveLeaderboard.PBMsgPveLeaderboard msgLeaderBoard = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveLeaderboard.PBMsgPveLeaderboard> (result);
			
			leaderBoarddata.total = msgLeaderBoard.total;
			leaderBoarddata.position = msgLeaderBoard.position;
			leaderBoarddata.score = msgLeaderBoard.score;
			
			int curStartIndex = (leaderBoarddata.curPage-1) * leaderBoarddata.PAGESIZE;
			leaderBoarddata.leaderBoardList.Clear ();

			if(msgLeaderBoard.data!=null)
			{
				for(int i = 0; i<msgLeaderBoard.data.Count; i++)
				{
					PBMsgPveLeaderboard.PBMsgPveLeaderboard.PBMsgPveLeaderboardList leaderItem = msgLeaderBoard.data[i];
					leaderBoarddata.leaderBoardList.Add(new LeaderBoardItemInfo(leaderItem.userId,curStartIndex+i+1,leaderItem.score,leaderItem.displayName,leaderItem.allianceId,leaderItem.allianceName,null));
				}
			}
			MenuMgr.instance.sendNotification (Constant.Notice.HERO_LEADER_BOARD_OK,null);
		}

		//
		public void ReqPveTroopKillLeaderBoard(int leaderboardType, int page)
		{
			leaderBoarddata = new LeaderBoardInfoBase();
			PBMsgReqPve.PBMsgReqPve reqMsg = new PBMsgReqPve.PBMsgReqPve ();
			reqMsg.type = (int)Constant.PVE_REQ_Type.REQ_Type_LEADERBOARD_PVE_TROOPKILL;
			reqMsg.leaderboardType = leaderboardType;
			leaderBoarddata.curPage = reqMsg.page = page;
			reqMsg.pageSize = leaderBoarddata.PAGESIZE;
			
			string url = "pve.php";
			//leaderBoardOKFunc = OkMsgPveTroopKillLeaderBoard;
			UnityNet.RequestForGPB(url,reqMsg,OkMsgPveTroopKillLeaderBoard,null); 
		}

		private void OkMsgPveTroopKillLeaderBoard(byte[] result)
		{
			PBMsgPveLeaderboard.PBMsgPveLeaderboard msgLeaderBoard = 
				_Global.DeserializePBMsgFromBytes<PBMsgPveLeaderboard.PBMsgPveLeaderboard> (result);
			
			leaderBoarddata.total = msgLeaderBoard.total;
			leaderBoarddata.position = msgLeaderBoard.position;
			leaderBoarddata.score = msgLeaderBoard.score;
			
			int curStartIndex = (leaderBoarddata.curPage-1) * leaderBoarddata.PAGESIZE;
			leaderBoarddata.leaderBoardList.Clear ();

			if(msgLeaderBoard.data!=null)
			{
				for(int i = 0; i<msgLeaderBoard.data.Count; i++)
				{
					PBMsgPveLeaderboard.PBMsgPveLeaderboard.PBMsgPveLeaderboardList leaderItem = msgLeaderBoard.data[i];
					leaderBoarddata.leaderBoardList.Add(new LeaderBoardItemInfo(leaderItem.userId,curStartIndex+i+1,leaderItem.score,leaderItem.displayName,leaderItem.allianceId,leaderItem.allianceName,null));
				}
			}
			MenuMgr.instance.sendNotification (Constant.Notice.PVE_TROOPKILL_LEADER_BOARD_OK,null);
		}

		public void ReqAllianceBossDamageLeaderBoard(LeaderBoardInfoBase.LEADERBOARD_TYPE leaderboardType, int page)
		{
			leaderBoarddata = new AllianceBossDamageLeaderBoard();
			leaderBoarddata.leaderBoardType = leaderboardType;
			PBMsgReqLeaderboard.PBMsgReqLeaderboard reqMsg = CreateDefaltMsg(leaderboardType, page);
			
			string url = "pveLeaderboard.php";
			UnityNet.RequestForGPB(url,reqMsg,OkMsgAllianceBossDamageLeaderBoard,null); 
		}

		public void OkMsgAllianceBossDamageLeaderBoard(byte[] result)
		{
			if (result == null)return;
			PBMsgLeaderboard.PBMsgLeaderboard msgLeaderBoard = FillDefaltData(result);

			AllianceBossDamageLeaderBoard temData = (AllianceBossDamageLeaderBoard)leaderBoarddata;
			if(msgLeaderBoard.addIntData.Count >= (int)AllianceBossDamageLeaderBoard.ADD_DATA_INDEX.MAX_COUNT)
			{
				temData.curAlReward = msgLeaderBoard.addIntData [(int)AllianceBossDamageLeaderBoard.ADD_DATA_INDEX.CUR_AL_REWARD]!=0;
				temData.lastAlReward = msgLeaderBoard.addIntData [(int)AllianceBossDamageLeaderBoard.ADD_DATA_INDEX.LAST_AL_REWARD]!=0;
				temData.curPerReward = msgLeaderBoard.addIntData [(int)AllianceBossDamageLeaderBoard.ADD_DATA_INDEX.CUR_PER_REWARD]!=0;
				temData.lastPerReward = msgLeaderBoard.addIntData [(int)AllianceBossDamageLeaderBoard.ADD_DATA_INDEX.LAST_PER_REWARD]!=0;
				RefreshAllianceBossReward(temData);
			}
			temData.HasReward ();

			MenuMgr.instance.sendNotification (Constant.Notice.LEADERBOARD_DATA_OK,"AllianceBossDamageLeaderBoard");
		}

		private void RefreshAllianceBossReward(AllianceBossDamageLeaderBoard temData)
		{
			if(temData.curAlReward || temData.lastAlReward || temData.curPerReward || temData.lastPerReward)
			{
				AllianceBossController.instance().isHaveReward = true;
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH,null);
			}
			else
			{
				AllianceBossController.instance().isHaveReward = false;
				MenuMgr.instance.sendNotification (Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH,null);
			}
		}

		public void ReqAllianceBossBuffLeaderBoard(int page)
		{
			leaderBoarddata = new LeaderBoardInfoBase();
			leaderBoarddata.leaderBoardType = LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_BUFF;
			PBMsgReqLeaderboard.PBMsgReqLeaderboard reqMsg = CreateDefaltMsg(LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_BUFF, page);
			
			string url = "pveLeaderboard.php";
			UnityNet.RequestForGPB(url,reqMsg,OkMsgAllianceBossBuffLeaderBoard,null); 
		}

		public void OkMsgAllianceBossBuffLeaderBoard(byte[] result)
		{
			PBMsgLeaderboard.PBMsgLeaderboard msgLeaderBoard = FillDefaltData(result);
			MenuMgr.instance.sendNotification (Constant.Notice.LEADERBOARD_DATA_OK,"AllianceBossBuffLeaderBoard");
		}

		public void ReqAllianceLeaderBoard(LeaderBoardInfoBase.LEADERBOARD_TYPE leaderboardType, int page)
		{
			leaderBoarddata = new LeaderBoardInfoBase();
			leaderBoarddata.leaderBoardType = leaderboardType;
			PBMsgReqLeaderboard.PBMsgReqLeaderboard reqMsg = CreateDefaltMsg(leaderboardType, page);

			string url = "";
			if(leaderboardType == LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCE_DONATION)
				url = "allianceLeaderboardDonate.php";
			else if(leaderboardType == LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCE_AVA_SCORE)
				url = "allianceLeaderboardAvaScore.php";
			UnityNet.RequestForGPB(url,reqMsg,OkMsgAllianceLeaderBoard,null); 
		}
		
		public void OkMsgAllianceLeaderBoard(byte[] result)
		{
			PBMsgLeaderboard.PBMsgLeaderboard msgLeaderBoard = FillDefaltData(result);
			MenuMgr.instance.sendNotification (Constant.Notice.LEADERBOARD_DATA_OK,"AllianceLeaderBoard");
		}
	}
}