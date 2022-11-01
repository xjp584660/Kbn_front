using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public partial class MergeServerManager
	{
		public void RequestChoice(int serverId)
		{
			PBMsgReqServerMergeChoice.PBMsgReqServerMergeChoice request = new PBMsgReqServerMergeChoice.PBMsgReqServerMergeChoice ();
			request.selectedServerId = serverId;
			request.targetServerId = MyServerMergeDetail.TargetServerId;
			UnityNet.RequestForGPB("mergeServerSave.php", request, OnChoiceOk);
		}

		public void RequestAllServerMergeMsg()
		{
			PBMsgReqMergeServer.PBMsgReqMergeServer request = new PBMsgReqMergeServer.PBMsgReqMergeServer ();
			UnityNet.RequestForGPB("mergeServerList.php", request, OnGetAllMsgOK,null);
		}
	}
	
}