import System.Collections.Generic;
import UnityEngine;

class WorldBossController extends KBN.WorldBossController{

	public static function instance() : WorldBossController {
		if (null == singleton) {
			singleton = new WorldBossController();
			if (GameMain.instance()!=null)
			{
				GameMain.instance().resgisterRestartFunc(function(){
					singleton = null;
				});
			}
		}
		return singleton;
	}

	public function Init(){
		NewSocketNet.instance.RegisterConnectedHandlers(GetWorldBossList);
//		GetWorldBossList();
	}

	private function GetWorldBossList(){
		if (GameMain.singleton.getMapController()!=null) {
			GameMain.singleton.getMapController().SetAllRallyBossMarchUnActive();
		}

		getWorldBossList(getWorldBossListOkfunction);	
		//UnityNet.getWorldBossList(0,getWorldBossListOkfunction,null);
	}

	private var bossList:Dictionary.<String,PBMsgWorldBossSocket.PBMsgWorldBossSocket> =
		new Dictionary.<String,PBMsgWorldBossSocket.PBMsgWorldBossSocket>();

	private function getWorldBossListOkfunction(msgPBMsgWorldBossInfo : PBMsgWorldBossInfo.PBMsgWorldBossInfo)
	{
		bossList.Clear();
		if (msgPBMsgWorldBossInfo != null && msgPBMsgWorldBossInfo.bossList != null) {
			
			for (var i = 0; i < msgPBMsgWorldBossInfo.bossList.Count; i++) {
				var boss : PBMsgWorldBossSocket.PBMsgWorldBossSocket=new PBMsgWorldBossSocket.PBMsgWorldBossSocket();

				var bossInfo : PBMsgWorldBossInfo.PBMsgWorldBossInfo.PBMsgWorldBoss = msgPBMsgWorldBossInfo.bossList[i];

				boss.bossId=bossInfo.bossId;
				boss.eventId=bossInfo.eventId;
				boss.bossTypeId=bossInfo.bossTypeId;
				boss.xCoord=bossInfo.xCoord;
				boss.yCoord=bossInfo.yCoord;
				boss.blood=bossInfo.blood;			
				boss.direction=bossInfo.direction;
				boss.status=bossInfo.status;
					
				var key=boss.xCoord+"_"+boss.yCoord;
				if (isWorldBoss(boss.xCoord,boss.yCoord)) {
					bossDic[key]=boss;
					OnBossSocketMsgReceive(boss);
				}else{
					bossDic.Add(key,boss);
				}

				bossList.Add(key,boss);
			}
		}

		DelAllNotUseBoss();

		if (msgPBMsgWorldBossInfo!=null&&msgPBMsgWorldBossInfo.marchList!=null) 
		{
			for (var j = 0; j < msgPBMsgWorldBossInfo.marchList.Count; j++) 
			{
				var march:PBMsgMarchInfo.PBMsgMarchInfo=new PBMsgMarchInfo.PBMsgMarchInfo();

				var marchInfo : PBMsgWorldBossInfo.PBMsgWorldBossInfo.PBMsgMarch = msgPBMsgWorldBossInfo.marchList[j];

				march.marchId=marchInfo.marchId;
				march.fromX=marchInfo.fromX;
				march.fromY=marchInfo.fromY;
				march.toX=marchInfo.toX;
				march.toY=marchInfo.toY;
				march.marchType=marchInfo.marchType;
				march.marchStatus=marchInfo.marchStatus;
				march.startTimeStamp=marchInfo.startTimeStamp;
				march.endTimeStamp=marchInfo.endTimeStamp;
				march.fromPlayerId=marchInfo.fromPlayerId;
				march.worldBossId=marchInfo.worldBossId;
				march.oneWayTime=marchInfo.oneWayTime;
				march.toAllianceId =marchInfo.toAllianceId;
				march.fromAllianceId =marchInfo.fromAllianceId;
				
					// _Global.LogWarning("PBMsgMarch  : " + " marchId : " + march.marchId + " fromPlayerId : " + march.fromPlayerId + "fromX : " + march.fromX + 
     //                     " fromY : " + march.fromY + " toX : " + march.toX + " toY : " + march.toY + " marchtype : " + march.marchType + " marchstatus : " + 
     //                     march.marchStatus + " startTime : " + march.startTimeStamp + " endTime : " + march.endTimeStamp + " isWin " + march.isWin);
				
				KBN.RallyBossMarchController.instance().AddMarch(march);
			}
		}
	}
	//剔除已经不存在的boss
	private function DelAllNotUseBoss()
	{
		var keys:List.<String> = new List.<String>();
		for(var key:String in bossDic.Keys){
			keys.Add(key);
		}
		for(var realkey:String in keys){
			var boss:PBMsgWorldBossSocket.PBMsgWorldBossSocket=bossDic[realkey];
			if (!bossList.ContainsKey(boss.xCoord+"_"+boss.yCoord)) {
				bossDic.Remove(boss.xCoord+"_"+boss.yCoord);
				SetBossState(boss.xCoord,boss.yCoord,
					Constant.WorldBossAnimationState.normal,
		        	Constant.WorldBOssAnimationAction.reallyDead,
		        	Constant.WorldBossAnimationPar.frontalAttack
		        	);
				SetBoss(boss.xCoord,boss.yCoord,4);
			}else{
				SetBossState(boss.xCoord,boss.yCoord,
					Constant.WorldBossAnimationState.normal,
		        	Constant.WorldBOssAnimationAction.idle,
		        	50
		        	);
			}
		}
	}


}