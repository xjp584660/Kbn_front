import System.Collections.Generic;
import UnityEngine;
class MonsterController extends KBN.UnityNet{


	private static var _instance : MonsterController = null;
	
	public static function instance() : MonsterController {
		if (null == _instance) {
			_instance = new MonsterController();
			if (GameMain.instance()!=null)
			{
				GameMain.instance().resgisterRestartFunc(function(){
					_instance = null;
				});
			}
		}
		return _instance;
	}

	public var lvLimit=0;

	//////////////
	private var data:MonsterEventData=new MonsterEventData();
	public var monsterEventList:List.<MonsterPoolEventData> = new List.<MonsterPoolEventData>();
	public var monsterRewardList:List.<Object> = new List.<Object>();
	private var rewardList:Array=new Array();

	var rtArr : System.Collections.Generic.List.<System.Object>;
	//魔物迷宫接口
	public function AttackMonster(requestType:int,bossType:int)
	{
		var url:String="monsterEvent.php";
		var form:WWWForm=new WWWForm();
		form.AddField("requestType",requestType);
		form.AddField("eventType",bossType);
		var okFunc:Function=function(result:HashObject){

			
			if (result["ok"])
			{
			
				if (bossType==1&&data.dailyFree<=0&&data.commonFree<=0) 
				{
					KBN.MyItems.singleton.Use(4201,data.commonCost,true);
				}else if (bossType==2&&data.eliteFree<=0)
				{
					KBN.MyItems.singleton.Use(4201,data.eliteCost,true);
				}
				data.ClearAttackData();
				var playerInfo:HashObject=result["playerInfo"];
				var attackResult:HashObject=result["attackResult"];
				if(playerInfo!=null&&playerInfo.ToString()!="")
				{
					UpdatePlayerInfo(playerInfo);
					if(IsMonsterOpen())
					{
						if (requestType==1&&MenuMgr.getInstance().GetCurMenuName()!="MonsterMenu") {
							print("==1,MainChrome");
						}
						else{
							print("xx1,MainChrome");
							MenuMgr.instance.GetMainChromeMenu().SetVisible(false);
							MenuMgr.getInstance().PushMenu("MonsterMenu", data,"");
						}
					}else{
						// ErrorMgr.instance().PushError("","Not Open");
						ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", "9101")));
					}
				}else
				{
					// ErrorMgr.instance().PushError("","Not Event playerInfo");
					ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", "9101")));
				}
				
				if (attackResult!=null&&attackResult.ToString()!="")
				{
				 	UpdateAttackResult(attackResult,bossType);
				 	MenuMgr.getInstance().sendNotification("attack",data);
				}
				
				
			}else{
				// ErrorMgr.instance().PushError("",result["error_code"].ToString());
			    if (_Global.INT32(result["error_code"])==9104) 
				{
					lvLimit=_Global.INT32(result["msg"]);
					
					ErrorMgr.instance().PushError("",Datas.getArString(Datas.getArString("Error.err_9104",[lvLimit.ToString()])));
				}else if(_Global.INT32(result["error_code"])==9101&&MenuMgr.getInstance().GetCurMenuName()=="MonsterMenu")
				{
					ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", result["error_code"].ToString())));
					KBN.MenuMgr.instance.PopMenu("");
				}else
					ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", result["error_code"].ToString())));
			}
							
		};
		var errorFunc:Function=function(errorMsg:String, errorCode:String){
			if (errorCode=="9104") 
			{
//				lvLimit=_Global.INT32(result["msg"]);
				
				ErrorMgr.instance().PushError("",Datas.getArString(Datas.getArString("Error.err_9104",[lvLimit.ToString()])));
			}else if(errorCode=="9101"&&MenuMgr.getInstance().GetCurMenuName()=="MonsterMenu")
			{
				ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode.ToString())));
				KBN.MenuMgr.instance.PopMenu("");
			}else
				ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode.ToString())));
		};
		
	
		shortRequest(url,form,okFunc,errorFunc);
	}


	public function GetMonsterPool()
	{
		var url:String="getMonsterPool.php";
		var form:WWWForm=new WWWForm();
		form.AddField("eventId",data.eventId);
		var okFunc:Function=function(result:HashObject){	
			if (result["ok"])
			{
				data.curCommonPool=_Global.INT32(result["curCommonPool"]);
				data.curElitePool=_Global.INT32(result["curElitePool"]);
				MenuMgr.getInstance().sendNotification("UpdateSeed",data);
				var rewardArrary:Array=_Global.GetObjectValues(result["rewardList"]);
				for (var i = rewardArrary.length - 1; i >= 0; i--) {
					var montserPool:MonsterPoolEventData=new MonsterPoolEventData();
					var reward:HashObject=rewardArrary[i] as HashObject;
					montserPool.logId=_Global.INT32(reward["logId"]);
					montserPool.playerId=_Global.INT32(reward["playerId"]);
					montserPool.playerName=reward["playerName"].Value as String;
					montserPool.serverId=_Global.INT32(reward["serverId"]);
					montserPool.serverName=reward["serverName"].Value as String;
					montserPool.bossType=_Global.INT32(reward["type"]);
					montserPool.gems=_Global.INT32(reward["gems"]);
					montserPool.rewardTime=reward["rewardTime"].Value as String;

					monsterEventList.Add(montserPool);
				}
				
			}else{
				if (_Global.INT32(result["error_code"])==9101&&MenuMgr.getInstance().GetCurMenuName()=="MonsterMenu") 
				{
					ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", result["error_code"].ToString())));
					KBN.MenuMgr.instance.PopMenu("");
				}
				// ErrorMgr.instance().PushError("",result["error_code"].ToString());
			}
							
		};

		var errorFunc:Function=function(errorMsg:String, errorCode:String){
			if (errorCode=="9101") 
			{
				ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
				KBN.MenuMgr.instance.PopMenu("");
			}
		};

		shortRequest(url,form,okFunc,errorFunc);
	}
	//更新活动数据
	public function UpdateSeed(result:HashObject)
	{
		if (result!=null&&result.ToString()!="") 
			{data.eventId=_Global.INT32(result["eventId"]);
			data.startTime=result["startTime"].Value as String;
			data.startUnixTime=_Global.INT64(result["startUnixTime"]);
			data.endTime=result["endTime"].Value as String;
			data.endUnixTime=_Global.INT64(result["endUnixTime"]);
			data.openTime=result["openTime"].Value as String;
			
			lvLimit=_Global.INT32(result["LvLimit"]);
			// MenuMgr.getInstance().sendNotification("UpdateSeed",data);
		}else{
			data.eventId=0;
			data.startTime="";
			data.startUnixTime=0;
			data.endTime="";
			data.endUnixTime=0;
			data.openTime="";
			lvLimit=0;
		}
		
	}
	//活动是否开放
	public function IsMonsterOpen():boolean
	{
		if (GameMain.unixtime()<=data.endUnixTime&&data.startUnixTime<=GameMain.unixtime()) 
		{
			// if (GameMain.unixtime()<data.GetEndOpenTimeUnix()&&GameMain.unixtime()>data.GetStartOpenTimeUnix()) 
				return true;
		}
		return false;
	}
	//活动剩余天数
	public function GetLeftTime():String
	{
		if (GameMain.unixtime()<=data.endUnixTime&&data.startUnixTime<=GameMain.unixtime()) 
		{
			return _Global.timeFormatStrAbout(data.endUnixTime-GameMain.unixtime()); 
		}
		return _Global.timeFormatStrAbout(0);
	}
	private function UpdatePlayerInfo(playerInfo:HashObject)
	{
		data.eventId=_Global.INT32(playerInfo["eventId"]);
		data.startTime=playerInfo["startTime"].Value as String;
		data.startUnixTime=_Global.INT64(playerInfo["startUnixTime"]);
		data.endTime=playerInfo["endTime"].Value as String;
		data.endUnixTime=_Global.INT64(playerInfo["endUnixTime"]);
		data.openTime=playerInfo["openTime"]==null?"":playerInfo["openTime"].Value as String;
		data.curCommonPool=_Global.INT32(playerInfo["curCommonPool"]);
		data.curElitePool=_Global.INT32(playerInfo["curElitePool"]);
		data.dailyFree=_Global.INT32(playerInfo["dailyFree"]);
		data.curCommonBossId=_Global.INT32(playerInfo["curCommonBossId"]);
		data.commonName=playerInfo["commonName"].Value as String;
		data.commonBackground=playerInfo["commonBackground"].Value as String;
		data.commonPicture=playerInfo["commonPicture"].Value as String;
		data.commonDescription=playerInfo["commonDescription"].Value as String;
		data.commonCost=_Global.INT32(playerInfo["commonCost"]);
		data.curCommonBossBlood=_Global.INT32(playerInfo["curCommonBossBlood"]);
		data.commonFree=_Global.INT32(playerInfo["commonFree"]);
		data.curEliteBossId=_Global.INT32(playerInfo["curEliteBossId"]);
		data.eliteName=playerInfo["eliteName"].Value as String;
		data.eliteBackground=playerInfo["eliteBackground"].Value as String;
		data.elitePicture=playerInfo["elitePicture"].Value as String;
		data.eliteDescription=playerInfo["eliteDescription"].Value as String;
		data.eliteCost=_Global.INT32(playerInfo["eliteCost"]);
		data.curEliteBossBlood=_Global.INT32(playerInfo["curEliteBossBlood"]);
		data.eliteFree=_Global.INT32(playerInfo["eliteFree"]);
		data.curCommonSort=_Global.INT32(playerInfo["curCommonSort"]);
		data.curEliteSort=_Global.INT32(playerInfo["curEliteSort"]);

	}
	private function UpdateAttackResult(attackResult:HashObject,bossType:int)
	{
		data.getFreeTimes=_Global.INT32(attackResult["getFreeTimes"]);
		data.isDead=_Global.INT32(attackResult["isDead"]);
		data.isRun=_Global.INT32(attackResult["isRun"]);
		data.crit=_Global.INT32(attackResult["crit"]);
		data.attackReward=_Global.GetObjectValues(attackResult["attackReward"]);
		data.deadReward=_Global.GetObjectValues(attackResult["deathReward"]);
		data.dropGems=_Global.INT32(attackResult["dropGems"]);
		if (bossType==1)
		{
			data.commonFreeOnce=_Global.INT32(attackResult["getFreeTimes"]);
		}else if (bossType==2)
		{
			data.eliteFreeOnce=_Global.INT32(attackResult["getFreeTimes"]);
		}
	}
	public function GetShopList():List.<Object>
	{
		// if(Shop.instance().updateShop)
		// {
		// 	Shop.instance().getShopData(SetShopItemList);
		// }
		// else if (rtArr==null)
		// {
			SetShopItemList();
		// }
		
		return rtArr;
	}
	private function SetShopItemList()//:List.<Object>
	{
//		var arrDat : Array = _Global.GetObjectValues(Datas.instance().itemlist());
		rtArr=new List.<Object>();
		var idxPos : int = 0;
		for (var i = 2; i <= 10; i++) {
			var ii=4200+i;
			 var item:HashObject=Datas.instance().itemlist()["i" + ii] as HashObject;
			 if (item!=null&&item.ToString()!="") 
			 {
			 	item["id"]=new HashObject();
			 	item["id"].Value=ii.ToString();
			 	rtArr.Add(item);

			 }
		}
		// return rtArr;
	}
}