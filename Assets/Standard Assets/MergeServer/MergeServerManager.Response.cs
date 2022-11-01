using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public partial class MergeServerManager
	{
		private void OnChoiceOk(byte[] data)
		{
			PBMsgMergeServerChoice.PBMsgMergeServerChoice pbChoice = _Global.DeserializePBMsgFromBytes<PBMsgMergeServerChoice.PBMsgMergeServerChoice>(data);
			MyServerMergeDetail.LastChoiceServerId = pbChoice.saveServerId;
			MenuMgr.instance.SendNotification(Constant.MergeServer.SaveServerOK);

			//maintence
			if(GameMain.unixtime() >= MyServerMergeDetail.StartTime)
			{
				ErrorMgr.singleton.PushError("", Datas.getArString("MergeServer.Confirm_Wait"),false,Datas.getArString("FTE.Restart"), new Action(RestartGame));
			}
		}

		private void RestartGame()
		{
			GameMain.singleton.restartGame ();
		}

		private void OnGetAllMsgOK(byte[] data)
		{
			PBMsgMergeServer.PBMsgMergeServer pbAllMsg = _Global.DeserializePBMsgFromBytes<PBMsgMergeServer.PBMsgMergeServer>(data);

			//AllMergeList
			List <MergerServerUnit> mergeList = new List <MergerServerUnit> ();
			MergerServerUnit mergeItem = null;

			foreach (PBMsgMergeServer.MergeServerUnit serverUnit in pbAllMsg.mergerServerList.serverList)
			{
				List<FromServerMsg> serverList = new  List<FromServerMsg>();
				FromServerMsg serverItem = null;
				foreach(PBMsgMergeServer.FromServerMsg fromServer in serverUnit.fromServerMsgList)
				{
					serverItem = new FromServerMsg(fromServer.serverId,fromServer.serverName);
					serverList.Add(serverItem);
				}
				mergeItem = new MergerServerUnit(serverUnit.toServerName,serverUnit.startTime,serverList);
				mergeList.Add(mergeItem);
			}
			m_AllMergeList = mergeList;
		
			//MyServer

			List <FromServerDetail> detailList = new List <FromServerDetail> ();
			FromServerDetail detailItem = null;
			foreach (PBMsgMergeServer.FromServerDetail fromDetail in pbAllMsg.myMergeServerDetail.fromServerDetailList)
			{
				detailItem = new FromServerDetail(fromDetail.serverId,fromDetail.serverName,fromDetail.might,fromDetail.cityCount,fromDetail.returnGems,fromDetail.level,false);
				detailList.Add(detailItem);
			}
			m_ServerMergeDetail = new ServerMergeDetail (pbAllMsg.myMergeServerDetail.toServerName,pbAllMsg.myMergeServerDetail.toServerId,pbAllMsg.myMergeServerDetail.lastSaveServerId,pbAllMsg.myMergeServerDetail.startTime,detailList);

			MenuMgr.instance.SendNotification(Constant.MergeServer.GetAllServerMergeMsgOk);
		}
	}
	
}